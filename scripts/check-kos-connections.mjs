import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolveKOS} from '../functions/api/kos/resolve.js';
import {onRequestGet as linksGet} from '../functions/api/kos/links.js';
import {onRequestGet as paperGet,onRequestPost as paperPost} from '../functions/api/kos/paper.js';

const root='public/';
const read=p=>readFileSync(root+p,'utf8');
const families=JSON.parse(read('data/qp-subject-families-2026-11-21.json'));
const index=JSON.parse(read('data/qp-kos-resource-links-2026-11-21.json'));
const js=read('data/qp-resource-registry.js');
const depthSpec=JSON.parse(read('data/qp-kos-depth-profiles-2026-11-21.json'));
const css=read('public-experience.css');
assert.equal(depthSpec.schema,'qp-kos-proportional-context-v1');
assert.equal(depthSpec.research.entityDimensions.length,13);
for(const swatch of ['--qp3-purple','#deaff8','#ffd39e','#a7ece0','#bfe2a4'])
 assert(css.includes(swatch),'Missing logo palette swatch '+swatch);
assert(css.includes('QP LOGO-PALETTE V1'),'Logo-inspired high contrast theme missing');
const home=read('index.html'),areas=read('areas.html');
const tiles=['authority','future','money','water','infrastructure','homes','people','safety'];
const homeLinks=[...home.slice(home.indexOf('<div class="qp-entry-grid">')).matchAll(/class="qp-art-card qp-entry-card" href="areas.html#([a-z-]+)"/g)].slice(0,8).map(x=>x[1]);
const areasLinks=[...areas.slice(areas.indexOf('id="tile-entry"')).matchAll(/class="qp-exp-card" href="#([a-z-]+)"/g)].slice(0,8).map(x=>x[1]);
assert.deepEqual(homeLinks,tiles,'Home priority tile order');
assert.deepEqual(areasLinks,tiles,'Explore priority tile order');

const from=js.indexOf('const items=')+12,to=js.indexOf('],scopes=')+1;
assert(from>=12 && to>from,'Original resource registry shape changed');
const original=JSON.parse(js.slice(from,to));
assert.equal(index.resources.length,original.length);
assert.deepEqual(index.resources.map(r=>r.id),original.map(r=>r.id));
for(let i=0;i<original.length;i++){
 assert.equal(index.resources[i].url,original[i].url,'Resource URL drift');
 assert.equal(index.resources[i].reviewBy,original[i].reviewBy,'Resource review-date drift');
}
assert.deepEqual(new Set(families.families.map(f=>f.id)),new Set(Object.keys(index.familyMapping)));
assert.deepEqual(new Set(index.familyMapping[Object.keys(index.familyMapping)[0]].groups).size>0,true);
let fetchCount=0;
const env={ASSETS:{fetch:async request=>{
 const path=new URL(request.url).pathname.replace(/^\//,'');
 fetchCount++;
 if(!existsSync(root+path))return new Response('Not found',{status:404});
 return new Response(read(path),{status:200,headers:{'Content-Type':'application/json'}});
}}};
const request=new Request('https://qpueblo.pages.dev/api/kos/links');
let topicCount=0,withLeads=0;
for(const family of families.families){
 const f=await resolveKOS({env,request,familyId:family.id});
 assert.equal(f.schema,'qp-kos-resolved-context-v1');
 assert.equal(f.family.id,family.id);
 assert.equal(f.subject,family.title);
 assert.equal(f.depthPlan.standard,'qp-kos-proportional-context-v1');
 assert.equal(f.depthPlan.audience,depthSpec.reader.target);
 assert.equal(f.depthPlan.primaryOutput,depthSpec.reader.defaultProduct);
 assert.equal(f.depthPlan.contextDimensions.length,13);
 assert.equal(f.depthPlan.mode,'multi-entity-system');

 assert(f.sourceCandidates.length<=45);
 assert(f.resources.every(r=>/^https:\/\//.test(r.url)),'Non-HTTPS resource lead');
 assert(f.sourceCandidates.every(r=>r.sourceStatus!=='independently-verified-for-request'));
 assert(f.editorial.every(r=>/\.html(?:#.*)?$/.test(r)),'Invalid archive route');
 withLeads+=Number(f.sourceCandidates.length>0);
 for(let i=0;i<family.topics.length;i++){
  const sub=await resolveKOS({env,request,familyId:family.id,topicIndex:i});
  assert.equal(sub.subject,family.topics[i]);
  assert.equal(sub.subtopic.index,i);
  topicCount++;
 }
}
assert.equal(families.families.length,25);
assert.equal(topicCount,77);
const institutional=await resolveKOS({env,request,idea:'Pueblo County government'});
assert.equal(institutional.depthPlan.mode,'institutional-full-context');
assert.equal(institutional.depthPlan.contextDimensions.length,13);
assert(institutional.depthPlan.presentationRule.includes('never create empty headings'));

assert(withLeads>=20,'Resources not broadly connected');
const q=new Request('https://qpueblo.pages.dev/api/kos/links?family=agriculture&topic=0');
const response=await linksGet({request:q,env});
assert.equal(response.status,200);
const payload=await response.json();
assert.equal(payload.paperGenerated,false);
assert.equal(payload.subject,families.families.find(f=>f.id==='agriculture').topics[0]);
const unknown=await linksGet({request:new Request('https://qpueblo.pages.dev/api/kos/links?family=no-such-family'),env});
assert.notEqual(unknown.status,200);
const capabilities=await paperGet({env});
const cap=await capabilities.json();
assert.equal(cap.onDemandGeneration,false);
assert.equal(cap.publicPublishing,false);
assert.equal(cap.connectedResearchLinks,true);
const post=await paperPost({request:new Request('https://qpueblo.pages.dev/api/kos/paper',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({family:'agriculture',topic:0,privacyConsent:true})}),env});
assert.equal(post.status,503,'No release-gated live research backend must fail closed');
const page=read('kos.html'),script=read('kos-subject.js'),areas=read('areas.html');
assert(page.includes('id="kos-on-demand"')&&page.includes('id="kos-connected-sources"'));
assert(script.includes('/api/kos/links?')&&script.includes('/api/kos/paper'));
assert.equal((areas.match(/class="qp-kos-topic"/g)||[]).length,77);
assert.equal((areas.match(/class="qp-enter-kos"/g)||[]).length,25);
console.log('PASS KOS crosswalk: 25 families, 77 subtopics, '+original.length+' library resources, source route discovery ('+withLeads+' families), on-demand gateway default OFF, all registry links intact; public source links are not verified claims. Asset fetches: '+fetchCount);
