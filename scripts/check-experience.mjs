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
 assert(html.includes('assets/q-pueblo-header-wide.png'),name+' brand preservation');
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
for(const p of ['now.html','discover.html','rumor-mill.html','ai-learn.html','areas.html','connections.html','rx.html','twin.html','exit.html','case-library.html'])assert(home.includes('href="'+p+'"'),'home missing '+p);
for(const old of ['reports.html','issues.html','packets.html','qify.html','q-tools.html','participate.html'])assert(home.includes('href="'+old+'"'),'old site feature lost '+old);
assert(home.includes('174')&&home.includes('14')&&home.includes('141'),'original baseline changed');
assert(home.includes('assets/q-pueblo-header-wide.png'));
assert.equal((read('case-library.html').match(/class="qp-exp-card"/g)||[]).length,20);
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
