import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const j=JSON.parse(readFileSync('public/data/qp-2026-election-impacts.json','utf8'));
assert.equal(j.schema,'qp-election-impact-registry-v1');
assert.equal(j.status,'UNOFFICIAL_PENDING_CANVASS');
assert.equal(j.records.length,52);assert(j.entities.length>=27);
assert.equal(new Set(j.records.map(x=>x.id)).size,j.records.length);
for(const x of j.records){
 assert(x.id && x.title && x.source_page>=1 && x.source_page<=18 && x.ballot_geography);
 assert.equal(x.effective_authority,'NO_CHANGE_PROVEN');
 assert.equal(x.status,'UNOFFICIAL_COUNT_ONLY');
 assert(!('winner' in x)&&!('is_elected' in x));
 assert(x.linked_entities.length && x.linked_entities.every(id=>j.entities.some(e=>e.id===id)));
 if(x.record_type==='office_election'){
  assert.equal(x.votes_total,x.candidates.reduce((n,v)=>n+v.votes,0));
  const votes=x.candidates.map(c=>c.votes).sort((a,b)=>b-a);
  assert.equal(x.count_margin,votes.length>1?votes[0]-votes[1]:null);
 } else {assert.equal(x.votes_total,x.yes+x.no);assert.equal(x.count_margin,Math.abs(x.yes-x.no));}
}
const get=id=>j.records.find(r=>r.id===id);
assert.equal(get('PC-SHERIFF').count_margin,278);
assert.equal(get('PC-COMM-03').count_margin,810);
assert.equal(get('PC-ASSESSOR').count_margin,938);
assert.equal(get('PUEBLO-CITY-2A').count_leader,'No/Against');
assert.equal(get('PUEBLO-CITY-2B').count_leader,'Yes/For');
assert(get('FRPR-7A').ballot_geography.startsWith('pueblo_county_voters'));
const js=readFileSync('public/election-impacts.js','utf8');
assert(js.includes('textContent')&&js.includes('replaceChildren'));
for(const forbidden of ['innerHTML','localStorage','sessionStorage','sendBeacon','XMLHttpRequest','eval(']) assert(!js.includes(forbidden));
const html=readFileSync('public/election-impacts.html','utf8');
assert(html.includes('aria-live') && html.includes('href="index.html"'));
assert(!/Q10ai\/q10-core|OPENAI_API_KEY|PRIVATE_DRAFT/.test(js+html+JSON.stringify(j)));
console.log(`PASS 52 dated election counts; ${j.entities.length} institutions; authority and county-scope guards; safe read-only preview.`);
