import assert from 'node:assert/strict';
import { cpSync, copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
const inventory = JSON.parse(readFileSync('.pages-release/release-inventory.json', 'utf8'));
for (const file of inventory.files) {
  const bytes = readFileSync(resolve('.pages-release', file.path));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256, `Staged file changed: ${file.path}`);
}
rmSync('.pages-dashboard', { recursive:true, force:true });
mkdirSync('.pages-dashboard');
cpSync('.pages-release/public', '.pages-dashboard', { recursive:true });
execFileSync(resolve('node_modules/.bin/wrangler'), [
  'pages','functions','build','.pages-release/functions','--outdir','.pages-release/dashboard-worker',
  '--build-output-directory','.pages-dashboard','--minify'
], { stdio:'inherit', env:{...process.env,WRANGLER_SEND_METRICS:'false'} });
assert.deepEqual(readdirSync('.pages-release/dashboard-worker'), ['index.js'], 'Review additional Worker modules before dashboard upload');
copyFileSync('.pages-release/dashboard-worker/index.js', '.pages-dashboard/_worker.js');
assert(existsSync('.pages-dashboard/_worker.js'));
// Execute the real compiled handler, not a duplicate of the implementation.
const { default: worker } = await import(resolve('.pages-dashboard/_worker.js'));
const response = await worker.fetch(new Request('https://qpueblo.pages.dev/api/v1/config'), {
  ASSETS:{fetch:async()=>new Response('asset fallback')}
}, { waitUntil(){}, passThroughOnException(){} });
assert.equal(response.status,200);
assert.equal(response.headers.get('x-content-type-options'),'nosniff');
const config = await response.json();
assert.equal(config.ai_agents_live,false);
assert.equal(config.contributions_enabled,false);
assert.equal(config.review_gate,'human_required');
const asset = await worker.fetch(new Request('https://qpueblo.pages.dev/index.html'), {
  ASSETS:{fetch:async()=>new Response('asset fallback')}
}, {waitUntil(){},passThroughOnException(){}});
assert.equal(await asset.text(),'asset fallback');
writeFileSync('.pages-release/dashboard-build-receipt.json',JSON.stringify({
  sourceCommit:inventory.sourceCommit, compiledFunctionTest:'PASS', staticFallbackTest:'PASS',
  intendedProject:'qpueblo', publication:'human_required',
  instruction:'Upload only after human review, using a new deployment inside the existing qpueblo Pages project.'
},null,2)+'\n');
console.log('PASS complete dashboard folder: compiled read-only Function and static fallback. No publication performed.');
