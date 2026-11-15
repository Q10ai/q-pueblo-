import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const base=path.resolve('public');
const read=p=>fs.readFileSync(path.join(base,p),'utf8');
const names=['index.html','now.html','areas.html','case-library.html','connections.html','discover.html','rumor-mill.html','ai-learn.html','rx.html','twin.html','exit.html'];
const graph=JSON.parse(read('data/qp-three-hop-2026-11-13.json'));
const now=JSON.parse(read('data/qp-now-2026-11-13.json'));
assert.equal(graph.coverage.issues,211);
assert.equal(graph.coverage.entity_labels,56);
assert.equal(graph.coverage.associations,456);
assert.equal(graph.coverage.unresolved_groups,15);
assert.equal(graph.coverage.unmapped_issues,26);
assert.equal(graph.issues.length,211);
assert.equal(graph.entities.length,56);
assert.equal(new Set(graph.issues.map(x=>x.id)).size,211);
const ids=new Set(graph.entities.map(x=>x.id));
assert.equal(graph.issues.reduce((n,i)=>n+i.edges.length,0),456);
for(const i of graph.issues)for(const e of i.edges)assert(ids.has(e.entity_id),'unknown graph entity: '+i.id+' '+e.entity_id);
assert.equal(now.records.length,8);
assert.equal(now.edition,'2026-11-13');
assert.equal(now.controls.human_release_required,true);
for(const x of now.records){
 assert(x.last_checked && x.recheck_by && x.recheck_by>=x.last_checked,'missing TTL '+x.id);
 assert(x.source.length>0 && x.source.every(s=>s.url.startsWith('https://')),'no official source '+x.id);
 assert(x.uncertainty && x.before && x.after,'missing action or uncertainty '+x.id);
}
for(const name of names){
 const html=read(name);
 assert(/<html\s+lang="en"/.test(html),name+' lang');
 assert(/<main\s+id="main"/.test(html),name+' main');
 assert(html.includes('class="skip-to"'),name+' skip');
 assert(html.includes('assets/pueblo-mark.webp'),name+' brand preservation');
 assert(html.includes('href="launch-system.css"') && (name==='index.html'||html.includes('href="experience.css"')),name+' styles');
 assert(!/\/docs\/q10\//.test(html),name+' private docs route');
 assert(!/API_KEY|sk-proj-|-----BEGIN PRIVATE KEY-----/.test(html),name+' secrets');
 for(const m of html.matchAll(/\b(?:src|href)="([^"]+)"/g)){
  const raw=m[1].replaceAll('&amp;','&');
  if(!raw||raw.startsWith('#')||/^(https?:|mailto:|tel:|data:)/.test(raw))continue;
  const file=raw.split(/[?#]/)[0];if(!file)continue;
  assert(fs.existsSync(path.join(base,file)),name+' broken local link '+file);
 }
}
const home=read('index.html');
assert(home.includes('<h2>Get to Know Pueblo</h2>'),'Approved public entryway heading missing');
assert(!home.includes('One Network. Twelve ways to explore.'),'Retired entryway wording');
assert(home.includes('As Pueblo evolves in the age of AI'),'Future-oriented invitation missing');
for(const p of ['now.html','discover.html','rumor-mill.html','ai-learn.html','areas.html','connections.html','rx.html','twin.html','exit.html','case-library.html'])assert(home.includes('href="'+p+'"'),'home missing '+p);
for(const old of ['reports.html','issues.html','packets.html','qify.html','q-tools.html','participate.html'])assert(home.includes('href="'+old+'"'),'old site feature lost '+old);
assert.equal(JSON.parse(read('data/q-pueblo-issue-index-2026-11-09.json')).issues.length,174);
const featured=JSON.parse(read('data/qp-featured-reads-2026-11-14.json')).reads;
assert.equal(featured.length,20);assert.equal(featured.filter(r=>r.type==='analysis').length,14);assert.equal(featured.filter(r=>r.type==='case_summary').length,6);assert.equal(new Set(featured.map(r=>r.artIndex)).size,20);
assert.equal((home.match(/class="qp-art-card qp-entry-card"/g)||[]).length,12);assert.equal((home.match(/data-featured-topic=/g)||[]).length,20);
let prev=-1;for(const id of ['what-is-q','what-is-qpueblo','entryways','search-pueblo','featured-papers','updates-and-future']){const at=home.indexOf('id="'+id+'"');assert(at>prev,'Homepage order: '+id);prev=at;}
const rslugs=new Set(JSON.parse(read('data/q-pueblo-qified-reports-v2-2026-11-09.json')).reports.map(r=>r.slug));const cslugs=new Set(JSON.parse(read('data/q-pueblo-public-case-summaries.json')).caseSummaries.map(r=>r.slug));for(const r of featured){assert((r.type==='analysis'?rslugs:cslugs).has(r.slug),'Featured read not grounded: '+r.slug);assert(home.includes('data-featured-topic="'+r.slug+'"'));}
for(const f of ['pueblo-riverwalk-hero.webp','pueblo-riverwalk-hero-mobile.webp','pueblo-mark.webp','pueblo-entry-art.webp','pueblo-report-art.webp']){const b=fs.readFileSync(path.join(base,'assets',f));assert(b.length>1000&&b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP',f);}
function checkPublic(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,ent.name);if(ent.isDirectory())checkPublic(p);else if(/\.(html|js|json|md)$/i.test(p)){const s=fs.readFileSync(p,'utf8');assert(!/gamma\.app\/docs\/|docs\/q10\/|research\/pueblo\/|projects\/pueblo\/|Q10\/Public_Web_Fabric\/|(?:docs|drive)\.google\.com|q10-core\/(?:blob|tree)\/|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/i.test(s),'Private locator: '+p);}}}checkPublic(base);
assert(home.includes('assets/pueblo-riverwalk-hero.webp'));
assert.equal((read('case-library.html').match(/class="qp-art-card qp-case-lead"/g)||[]).length,20);
for(const token of ['Kids','Teens','Adults','Experts'])assert(read('discover.html').includes(token));
assert.equal((read('discover.html').match(/Question \d+ · /g)||[]).length,8);
for(const phrase of ['not anonymous','private human consideration','No submission is published automatically'])assert(read('rumor-mill.html').toLowerCase().includes(phrase.toLowerCase()),'rumor privacy '+phrase);
assert(read('rumor-mill.html').includes('mailto:Q10pueblo@gmail.com'));
assert(read('rumor-mill.html').includes('no submission is published automatically') || read('rumor-mill.html').includes('No submission is published automatically'));
assert(read('connections.js').includes('credentials:\'same-origin\''));
assert(!/localStorage|sessionStorage|document\.cookie|sendBeacon|analytics/.test(read('connections.js')),'tracking must not be added');
assert(read('twin.html').includes('not a live city control system'));
assert(read('exit.html').includes('does not provide user accounts'));
console.log('QP_PUB_EXPERIENCE_CHECK=PASS; '+names.length+' pages; graph 211/56/456; 20 case leads; eight weekly notices; baseline 174/14 retained');

const {default:vm}=await import('node:vm');
const ctx={window:{},URL,Date};vm.runInNewContext(read('governance-index-core.js'),ctx);
const gc=ctx.window.QPGovernance;
const settings=JSON.parse(read('data/qp-governance-index-input-v1.json'));
const legacy=JSON.parse(read('data/q-pueblo-issue-index-2026-11-09.json'));
const papers=JSON.parse(read('data/qp-current-reports.json')).reports;
const model=gc.build(legacy,graph,papers,settings);
assert.equal(model.featured.length,150);assert.equal(model.allTopics.length,174);
assert.equal(model.entities.length,graph.entities.length+settings.additions.length);
assert.equal(new Set(model.entities.map(e=>e.id)).size,model.entities.length);
assert(model.featured.every(e=>!settings.excludeFromFeatured.includes(e.id)));
for(const e of model.entities)for(const direction of ['up','down'])for(const p of model.paths(e.id,direction,3)){assert(p.depth<=3&&p.depth>=1);assert(p.path.every(x=>x.boundary&&x.report&&x.sourceIds.length));}
assert.equal(gc.freshness({observedAt:'2026-11-14T12:00:00Z',recheckBy:'2026-11-14T13:00:00Z'},new Date('2026-11-14T13:00:00Z')),'RECHECK_DUE');
assert.equal(gc.freshness({observedAt:'bad',recheckBy:'2026-11-14T13:00:00Z'},new Date('2026-11-14T12:10:00Z')),'INVALID_OR_UNVERIFIED');
assert(home.includes('href="governance-entities.html"')&&home.includes('href="governance-topics.html"'));
console.log('PASS two governance indexes, 150 topic selection, 174 original records, evidence-linked directional paths, freshness fail-closed');

assert.equal(model.updates.length,3);
assert(model.updates.every(u=>u.sources.every(s=>/^https:\/\//.test(s.url))));
assert.equal(model.dateReview(model.updates[0],'2026-11-14'),'DATED_UPDATE');
assert.equal(model.dateReview(model.updates[0],'2026-11-15'),'RECHECK_DUE');
assert.equal(model.dateReview(model.updates[0],'2026-11-13'),'REVIEW_REQUIRED');
assert(model.allTopics.find(t=>t.id==='REG-071').updates.some(u=>u.status==='UNOFFICIAL_UPDATE'));
assert(model.allTopics.find(t=>t.id==='REG-069').updates.some(u=>u.status==='PROPOSAL_LISTED'));
assert(model.allTopics.every(t=>t.reviewStatus));
assert(read('governance-topics.html').includes('Dated findings within review window'));
assert(read('now.html').includes('November 13 unofficial results update'));
console.log('PASS dated election/budget updates and review-window expiry; no historical lead promoted to a current fact');

assert(model.updates[0].figures.some(f=>f.label==='Reported voters cast'&&f.value.includes('69,917')));assert(!model.allTopics.find(i=>i.id==='QRX-REG-071-05').updates.length);assert(model.allTopics.find(i=>i.id==='QRX-REG-071-05').relatedUpdates.length);assert(!model.allTopics.find(i=>i.id==='REG-049').updates.length);console.log('PASS scoped evidence updates, related versus directly checked topic separation');

const learn=read('ai-learn.html'),guide=read('ask-guide.html'),twinPage=read('twin.html');for(const id of ['education','governance','healthcare','business','infrastructure','community'])assert(learn.includes('id="ai-'+id+'"'));assert(guide.includes('id="qp-prompt-form"'));assert(guide.includes('regional-tools.js'));assert(twinPage.includes('id="qp-twin-form"')&&twinPage.includes('twin-evidence.js'));assert(read('discover.html').includes('id="qp-quiz-root"'));const localTools=read('regional-tools.js');assert(!/localStorage|sessionStorage|XMLHttpRequest|sendBeacon|\bfetch\s*\(/.test(localTools));const localCtx={document:{getElementById:()=>null},module:{exports:{}},URL,URLSearchParams};vm.runInNewContext(localTools,localCtx);const sample=localCtx.module.exports.scenario(10,80,60,.2);assert.equal(sample.mwh,70080);assert.equal(sample.cost,4204800);assert.equal(sample.waterLiters,14016000);assert.equal(localCtx.module.exports.scenario(10,101,60,.2),null);assert(localCtx.module.exports.compose('Pueblo water','infrastructure','Resident','story','2027').includes('never invent a citation'));console.log('PASS local regional prompt composer, educational pathways, interactive civic game, bounded infrastructure scenario arithmetic and shared twin evidence');
