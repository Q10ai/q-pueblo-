// Q-Pueblo controlled research-register integrity check. No network, no deployment, no publication.
// Run: node scripts/check-research-master.mjs
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const m=JSON.parse(readFileSync('docs/research/2026-11-12-qpueblo-master-crosswalk-v0.2.json','utf8'));
const unique=(items,key,label)=>assert.equal(new Set(items.map(x=>x[key])).size,items.length,label+': duplicate '+key);
assert.equal(m.schema,'qp-master-build-crosswalk-v0.2');
assert.equal(m.public_auto_publish,false,'Publication must be human-approved');
assert.equal(m.claims_of_runtime_activation,false,'Proposed model must not imply activation');
assert.equal(m.human_approval,'PENDING');
assert.equal(m.counts.historical_issue_ids,m.counts.historical_issue_source_mapped+m.counts.historical_issue_unmapped);
assert.equal(m.topic_index.length,25,'25 prior draft topics must remain indexed');
assert.equal(m.counts.current_public_dated_report_register,14);
assert.equal(m.counts.regional_qified_drafts,25);
assert.equal(m.counts.historical_issue_unmapped,92);
assert.ok(m.sources.length>=18,'Minimum evidence/source catalog');
assert.ok(m.qified_examples.length>=6,'Minimum initial Qified examples');
unique(m.sources,'id','source list');
unique(m.qified_examples,'id','Qified examples');
const topicIds=m.topic_index.filter(x=>x.canonical_issue_id).map(x=>x.canonical_issue_id);
assert.equal(new Set(topicIds).size,topicIds.length,'Duplicate canonical historical issue ID');
const sourceIds=new Set(m.sources.map(s=>s.id));
for(const s of m.sources){assert.match(s.url,/^https:\/\//,'Source must use https: '+s.id); assert.ok(s.topic&&s.type);}
for(const c of m.qified_examples){
  for(const k of ['id','status','scope','question','known','positions','unknowns','next','sources'])assert.ok(k in c,c.id+': missing '+k);
  assert.ok(c.known.length>0&&c.unknowns.length>0&&c.positions.length>=2,c.id+': missing opposing interpretations or uncertainty');
  for(const s of c.sources)assert.ok(sourceIds.has(s),c.id+': unresolved source reference '+s);
}
assert.ok(m.tests.some(x=>x.includes('candidate')||x.includes('voter')));
assert.ok(m.tests.some(x=>x.includes('packet remains accessible')));
assert.equal(m.financial_stages[0],'estimated');
assert.equal(m.financial_stages.at(-1),'observed_outcome');
console.log(JSON.stringify({result:'PASS',schema:m.schema,topics:m.topic_index.length,cases:m.qified_examples.length,sources:m.sources.length,unmapped:m.counts.historical_issue_unmapped,public_auto_publish:m.public_auto_publish},null,2));
