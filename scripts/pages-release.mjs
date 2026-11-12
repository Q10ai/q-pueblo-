import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PROJECT = 'qpueblo';
export const ORIGIN = 'https://qpueblo.pages.dev';
const OUTPUT = '.pages-release';
const sha256 = data => createHash('sha256').update(data).digest('hex');
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const save = (path, data) => writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
const isSha = value => /^[a-f0-9]{40}$/.test(value ?? '');
const isId = value => /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/.test(value ?? '');
const tracked = prefix => git('ls-files', '-z', prefix).split('\0').filter(Boolean).sort();
const metadata = path => ['.nojekyll', '_headers', '_redirects', '_routes.json'].includes(path);

export function validateProject(project, previousId) {
  assert.equal(project.name, PROJECT, 'Wrong Pages project; nothing may be created or replaced');
  assert.equal(project.subdomain, 'qpueblo.pages.dev', 'Wrong Pages address/account');
  assert(isId(project.id), 'Missing stable existing project ID');
  assert(!project.source, 'Unexpected Git integration: review actual project configuration first');
  assert(typeof project.production_branch === 'string' && /^[a-zA-Z0-9_./-]+$/.test(project.production_branch), 'Invalid production branch');
  assert(!project.production_branch.startsWith('-'), 'Invalid production branch');
  const deployment = project.canonical_deployment;
  assert(isId(previousId), 'Supply the full current production deployment ID from Cloudflare');
  assert.equal(deployment?.id, previousId, 'Production changed since review; inspect it before publishing');
  assert.equal(deployment.environment, 'production');
  assert.equal(deployment.latest_stage?.status, 'success', 'Current production is not a successful rollback target');
  return {
    project: PROJECT, projectId: project.id, productionBranch: project.production_branch,
    previousDeploymentId: previousId, previousDeploymentUrl: safeDeploymentUrl(deployment.url),
    checkedAt: new Date().toISOString()
  };
}

function safeDeploymentUrl(value) {
  const url = new URL(value);
  assert.equal(url.protocol, 'https:');
  assert(/^[a-z0-9-]+\.qpueblo\.pages\.dev$/.test(url.hostname), 'Unexpected deployment URL');
  assert(!url.username && !url.password && !url.search && !url.hash);
  return url.href;
}

export function assertReleaseRequest({ releaseSha, actualSha, mainSha, ref, approval, previousId }) {
  assert.equal(ref, 'refs/heads/main', 'Production workflow must run from main');
  assert(isSha(releaseSha), 'Full reviewed commit SHA required');
  assert.equal(releaseSha, actualSha, 'Checked out code differs from the approved commit');
  assert.equal(releaseSha, mainSha, 'Main changed since review; prepare and approve the new commit');
  assert.equal(approval, 'PUBLISH qpueblo', 'Explicit publication confirmation required');
  assert(isId(previousId), 'Full previous production deployment ID required');
}

export function prepare() {
  assert.equal(git('status', '--porcelain', '--untracked-files=no'), '', 'Commit reviewed changes before creating provenance');
  const publicFiles = tracked('public');
  const functionFiles = tracked('functions');
  assert(publicFiles.length > 18, 'Refuse the obsolete 18-file bundle');
  assert.deepEqual(functionFiles, ['functions/api/v1/config.js'], 'New backend routes require separate security review');
  // Avoid silently overlooking new files or accidentally publishing local credentials.
  for (const prefix of ['public', 'functions']) {
    assert.equal(git('ls-files', '--others', '--exclude-standard', prefix), '', `Untracked ${prefix} assets must be reviewed and committed`);
  }
  assert(!existsSync('public/deployment-provenance.json'), 'Provenance is generated, not maintained by hand');
  const outputPath = resolve(OUTPUT);
  assert.equal(dirname(outputPath), process.cwd());
  rmSync(outputPath, { recursive: true, force: true });
  mkdirSync(outputPath);
  const files = [];
  for (const path of [...publicFiles, ...functionFiles]) {
    assert(lstatSync(path).isFile() && !lstatSync(path).isSymbolicLink(), `Nonregular asset: ${path}`);
    assert(!/(?:^|\/)(?:\.env(?:\..*)?|\.dev\.vars|\.git|node_modules)(?:\/|$)/.test(path), `Unsafe asset: ${path}`);
    const bytes = readFileSync(path);
    assert(bytes.length <= 25 * 1024 * 1024, `Cloudflare asset too large: ${path}`);
    const destination = resolve(OUTPUT, path);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(path, destination);
    files.push({ path, bytes: bytes.length, sha256: sha256(bytes), served: path.startsWith('public/') && !metadata(path.slice(7)) });
  }
  const sourceCommit = git('rev-parse', 'HEAD');
  const provenance = {
    schema: 'qp-deployment-provenance-v1', project: PROJECT, sourceCommit,
    publicSourceFiles: publicFiles.length, functionSourceFiles: functionFiles.length,
    sourceInventorySha256: sha256(JSON.stringify(files)), publicationAuthority: 'human_required',
    scope: 'Committed public release scope; other draft branches and private research are excluded. Publication requires human approval.'
  };
  save(OUTPUT + '/public/deployment-provenance.json', provenance);
  const bytes = readFileSync(OUTPUT + '/public/deployment-provenance.json');
  files.push({ path: 'public/deployment-provenance.json', bytes: bytes.length, sha256: sha256(bytes), served: true });
  const inventory = { schema: 'qp-release-inventory-v1', project: PROJECT, sourceCommit, files };
  save(OUTPUT + '/release-inventory.json', inventory);
  console.log(`Prepared ${publicFiles.length} public source files + provenance and ${functionFiles.length} read-only Function. No deployment performed.`);
  return inventory;
}

async function cloudflareProject() {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  assert(/^[a-f0-9]{32}$/.test(account ?? ''), 'Configure CLOUDFLARE_ACCOUNT_ID in the protected release environment');
  assert(token, 'Configure CLOUDFLARE_API_TOKEN in the protected release environment');
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/${PROJECT}`, {
    headers: { Authorization: `Bearer ${token}` }, redirect: 'error', signal: AbortSignal.timeout(20000)
  });
  assert(response.ok, `Cannot verify existing Pages project (HTTP ${response.status}); stop without creating anything`);
  const body = await response.json();
  assert(body.success === true && body.result, 'Cloudflare project lookup failed');
  return body.result; // Never print/store this raw response: it can contain environment values.
}

async function preflight() {
  assertReleaseRequest({ releaseSha: process.env.RELEASE_SHA, actualSha: git('rev-parse', 'HEAD'),
    mainSha: git('ls-remote', 'origin', 'refs/heads/main').split(/\s+/)[0],
    ref: process.env.GITHUB_REF, approval: process.env.RELEASE_APPROVAL, previousId: process.env.PREVIOUS_DEPLOYMENT_ID });
  const receipt = validateProject(await cloudflareProject(), process.env.PREVIOUS_DEPLOYMENT_ID);
  save(OUTPUT + '/preflight-receipt.json', receipt);
  if (process.env.GITHUB_OUTPUT) writeFileSync(process.env.GITHUB_OUTPUT, `production_branch=${receipt.productionBranch}\n`, { flag: 'a' });
  console.log(`Verified existing ${PROJECT}; prior deployment recorded for human-directed rollback.`);
}

export async function verifyAssets(inventory, { origin = ORIGIN, fetcher = fetch } = {}) {
  assert.equal(origin, ORIGIN, 'Production verification must use the preserved qpueblo address');
  const results = [];
  const pending = inventory.files.filter(file => file.served);
  // Bounded concurrency and no continuous retry loop: a mismatch is a failed release.
  const workers = Array.from({ length: Math.min(6, pending.length) }, async () => {
    while (pending.length) {
      const file = pending.shift();
      const path = file.path.slice(7).split('/').map(encodeURIComponent).join('/');
      try {
        const response = await fetcher(`${origin}/${path}?qpRelease=${inventory.sourceCommit}`, {
          cache: 'no-store', redirect: 'follow', signal: AbortSignal.timeout(20000)
        });
        assert.equal(new URL(response.url).origin, origin, 'Asset redirected away from Q-Pueblo');
        assert.equal(response.status, 200, `HTTP ${response.status}`);
        const body = new Uint8Array(await response.arrayBuffer());
        assert.equal(sha256(body), file.sha256, 'Wrong, stale or fallback content');
        results.push({ path: file.path, result: 'PASS' });
      } catch (error) { results.push({ path: file.path, result: 'FAIL', reason: error.message }); }
    }
  });
  await Promise.all(workers);
  return results.sort((a, b) => a.path.localeCompare(b.path));
}

async function verify() {
  const inventory = json(OUTPUT + '/release-inventory.json');
  const before = json(OUTPUT + '/preflight-receipt.json');
  const project = await cloudflareProject();
  assert.equal(project.id, before.projectId, 'Project identity changed');
  assert.equal(project.name, PROJECT);
  assert.equal(project.subdomain, 'qpueblo.pages.dev');
  const deployed = project.canonical_deployment;
  assert.notEqual(deployed?.id, before.previousDeploymentId, 'Cloudflare still points at the previous deployment');
  assert.equal(deployed?.environment, 'production');
  assert.equal(deployed?.latest_stage?.status, 'success');
  assert.equal(deployed?.deployment_trigger?.metadata?.commit_hash, inventory.sourceCommit, 'Wrong deployed source commit');
  assert.equal(deployed?.uses_functions, true, 'Read-only Pages Function was not deployed');
  const results = await verifyAssets(inventory);
  for (const route of ['/', '/api/v1/config']) {
    try {
      const response = await fetch(ORIGIN + route, { cache: 'no-store', redirect: 'follow', signal: AbortSignal.timeout(20000) });
      assert.equal(new URL(response.url).origin, ORIGIN);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      if (route === '/') {
        assert.equal(response.headers.get('x-frame-options'), 'DENY');
        assert(response.headers.get('content-security-policy')?.includes("default-src 'self'"), 'Security headers missing');
      } else {
        const config = await response.json();
        assert.equal(config.ai_agents_live, false);
        assert.equal(config.contributions_enabled, false);
        assert.equal(config.review_gate, 'human_required');
      }
      results.push({ path: route, result: 'PASS' });
    } catch (error) { results.push({ path: route, result: 'FAIL', reason: error.message }); }
  }
  const report = { project: PROJECT, sourceCommit: inventory.sourceCommit, deploymentId: deployed.id,
    deploymentUrl: safeDeploymentUrl(deployed.url), previousDeploymentId: before.previousDeploymentId,
    checkedAt: new Date().toISOString(), result: results.every(r => r.result === 'PASS') ? 'PASS' : 'FAIL', results,
    limitation: 'Asset and read-only route verification; editorial freshness and full usability still require human review.' };
  save(OUTPUT + '/verification.json', report);
  console.log(JSON.stringify(report, null, 2));
  assert.equal(report.result, 'PASS', 'Release verification failed. Preserve evidence; operator decides rollback.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const command = process.argv[2];
  try {
    if (command === 'prepare') prepare();
    else if (command === 'preflight') await preflight();
    else if (command === 'verify') await verify();
    else throw new Error('Use prepare, preflight or verify');
  } catch (error) { console.error('RELEASE BLOCKED:', error.message); process.exitCode = 1; }
}
