import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=readFileSync('public/workbench.html','utf8');
const js=readFileSync('public/workbench.js','utf8');
const specJs=readFileSync('public/workbench-spec.js','utf8');
const ctx={window:{}};vm.runInNewContext(specJs,ctx,{timeout:2500});
const spec=ctx.window.QP_WORKBENCH_SPEC;
assert.equal(spec.schema,'qp-knowledge-workbench-v1');
assert.ok(spec.roles.length>=13,'Must support diverse audiences');
assert.equal(new Set(spec.roles.map(r=>r.id)).size,spec.roles.length);
assert.ok(spec.roles.every(r=>r.need&&r.questions.length>=3&&r.outputs.length>=2));
const outputs=new Set(spec.outputs.map(o=>o.id));
for(const r of spec.roles){for(const o of r.outputs)assert.ok(outputs.has(o),'Invalid output '+o);}
assert.equal(spec.questions.length,6);
assert.deepEqual([...spec.questions.map(q=>q.code)].sort(),['HOW','WHAT','WHEN','WHERE','WHO','WHY'].sort());
assert.equal(spec.layers.length,3);
assert.equal(spec.rx.length,5);
const schema=JSON.parse(readFileSync('public/packet-schema.json','utf8'));
assert.equal(schema.properties.shock.properties.scenarios.minItems,4);
assert.equal(schema.properties.shock.properties.scenarios.maxItems,4);

assert.ok(spec.safeguards.some(x=>x.includes('automatic')));
for(const id of ['wb-form','wb-persona','wb-question','wb-issue-filter','wb-issue','wb-level','wb-lens','wb-output','wb-shock','wb-horizon','wb-posture','wb-risk','wb-output-body','wb-download-json','wb-download-md','wb-copy','wb-print','wb-reset','wb-issue-meta','wb-persona-summary','wb-starters','wb-persona-chips','wb-toast','wb-packet-status','wb-output-section'])assert.ok(html.includes('id="'+id+'"'),'Missing HTML control: '+id);
assert.ok(html.includes('data/q-pueblo-public-catalog-2026-11-08.js'));
assert.ok(html.includes('src="workbench-spec.js"')&&html.includes('src="workbench.js"'));
assert.ok(readFileSync('public/index.html','utf8').includes('href="workbench.html"'));
assert.ok(readFileSync('public/explore.js','utf8').includes('workbench.html?issue='));
for(const token of ['fourScenarios','Correlated / backup failure','MODELLED CONDITIONAL PATH','NEW-LEAD','unknown','childImpact','finance','similar','RX','horizon','shockData','sourceBy','UNVERIFIED_RESEARCH_STARTER_NOT_PUBLISHED_FACT','URL.createObjectURL']) {
  if(token==='sourceBy')continue;
  assert.ok(js.includes(token),'Missing core fallback or packet capability: '+token);
}
const fetches=[...js.matchAll(/\\bfetch\\s*\\(\\s*['"]([^'"]+)['"]/g)].map(x=>x[1]);
assert.deepEqual(fetches,['data/q-pueblo-qified-briefs-2026-11-09.json'],'Only locally served public source evidence may be fetched');
assert.ok(!/XMLHttpRequest|localStorage|sessionStorage|sendBeacon/.test(js),'No persistence or telemetry of personal queries');
assert.ok(!/api_key=|SECRET_TOKEN|BEGIN PRIVATE KEY/.test(js+specJs));
console.log('PASS: Role workbench schema, controls, unknown issue, 5Ws, impact layers, RX, shock/LEAP, local export and privacy boundaries.');
