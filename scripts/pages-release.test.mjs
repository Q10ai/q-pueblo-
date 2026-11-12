import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { validateProject, assertReleaseRequest, verifyAssets, ORIGIN } from './pages-release.mjs';
const id = '4b4087b8-85d1-41de-bc58-571a986189b8';
const project = { id: '12345678-1234-1234-1234-123456789abc', name: 'qpueblo', subdomain: 'qpueblo.pages.dev', production_branch: 'production', canonical_deployment: { id, environment: 'production', latest_stage: { status: 'success' }, url: 'https://4b4087b8.qpueblo.pages.dev' } };
test('Existing production identity is verified without assuming the branch is main', () => {
  assert.equal(validateProject(project, id).productionBranch, 'production');
  for (const mutation of [{name:'other'}, {subdomain:'other.pages.dev'}, {source:{type:'github'}}, {canonical_deployment:{...project.canonical_deployment,id:'another'}}]) {
    assert.throws(() => validateProject({...project,...mutation}, id));
  }
});
test('Changed main, wrong checkout, missing approval and stale prior deployment are blocked', () => {
  const sha = 'a'.repeat(40);
  const request = { releaseSha: sha, actualSha: sha, mainSha: sha, ref: 'refs/heads/main', approval: 'PUBLISH qpueblo', previousId: id };
  assert.doesNotThrow(() => assertReleaseRequest(request));
  for (const mutation of [{mainSha:'b'.repeat(40)}, {actualSha:'b'.repeat(40)}, {ref:'refs/heads/draft'}, {approval:''}, {previousId:'4b4087b8'}]) {
    assert.throws(() => assertReleaseRequest({...request,...mutation}));
  }
});
test('HTTP 200 fallback, stale bytes, missing routes and offsite redirects cannot pass', async () => {
  const bytes = Buffer.from('real report');
  const inventory = { sourceCommit:'a'.repeat(40), files:[{path:'public/reports.html',served:true,sha256:createHash('sha256').update(bytes).digest('hex')},{path:'public/_headers',served:false}] };
  const mock = (body, status=200, url=ORIGIN+'/reports') => async () => ({status,url,arrayBuffer:async()=>Buffer.from(body)});
  assert.equal((await verifyAssets(inventory,{fetcher:mock(bytes)}))[0].result,'PASS');
  for (const fetcher of [mock('<html>fallback homepage</html>'),mock(bytes,404),mock(bytes,200,'https://unrelated.example/reports')]) {
    assert.equal((await verifyAssets(inventory,{fetcher}))[0].result,'FAIL');
  }
});
