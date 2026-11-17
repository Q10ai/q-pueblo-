import './check-learning-library.mjs';
import './check-guided-tools.mjs';
import './check-discoveries-tools.mjs';
import './check-resource-library.mjs';
import './check-rumor-answer.mjs';
import './check-learn-pueblo.mjs';
import './check-who-governs.mjs';
import './check-issue-story.mjs';
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
assert(home.includes('<h1>Get to Know Pueblo</h1>'),'Visible primary heading missing');
assert(!home.includes('One Network. Twelve ways to explore.'),'Retired entryway wording');
assert(home.includes('people retain authority'),'Human authority missing');
for(const p of ['now.html','discover.html','rumor-mill.html','ai-learn.html','areas.html','connections.html','rx.html','twin.html','exit.html','case-library.html'])assert(home.includes('href="'+p+'"'),'home missing '+p);
for(const old of ['reports.html','issues.html','packets.html','qify.html','q-tools.html','participate.html'])assert(home.includes('href="'+old+'"'),'old site feature lost '+old);
assert.equal(JSON.parse(read('data/q-pueblo-issue-index-2026-11-09.json')).issues.length,174);
const featured=JSON.parse(read('data/qp-featured-reads-2026-11-14.json')).reads;
assert.equal(featured.length,20);assert.equal(featured.filter(r=>r.type==='analysis').length,14);assert.equal(featured.filter(r=>r.type==='case_summary').length,6);assert.equal(new Set(featured.map(r=>r.artIndex)).size,20);
assert.equal((home.match(/class="qp-art-card qp-entry-card"/g)||[]).length,5);assert.equal((home.match(/data-featured-topic=/g)||[]).length,0);assert.equal((home.match(/data-home-report=/g)||[]).length,4);
let prev=-1;for(const id of ['search-pueblo','entryways','featured-papers','updates-and-future','what-is-q','what-is-qpueblo']){const at=home.indexOf('id="'+id+'"');assert(at>prev,'Homepage order: '+id);prev=at;}
const rslugs=new Set(JSON.parse(read('data/q-pueblo-qified-reports-v2-2026-11-09.json')).reports.map(r=>r.slug));const cslugs=new Set(JSON.parse(read('data/q-pueblo-public-case-summaries.json')).caseSummaries.map(r=>r.slug));for(const r of featured){assert((r.type==='analysis'?rslugs:cslugs).has(r.slug),'Featured read not grounded: '+r.slug);assert(fs.existsSync(path.join(base,r.type==='analysis'?'report-'+r.slug+'.html':'packets.html')),'Archive route absent: '+r.slug);}
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

assert.equal(model.graphTopics.length,211);assert(model.graphTopics.some(t=>t.id==='heal-010'&&t.reports.some(r=>r.slug==='food-assistance')));assert(model.graphTopics.some(t=>t.id==='edu-006'&&t.reports.some(r=>r.slug==='d60-preschool-2026')));assert(model.allTopics.every(t=>Array.isArray(t.entities)&&Array.isArray(t.reports)));assert(read('governance-topics.html').includes('211 dated graph topics'));assert(!read('packets.html').includes('docs/pueblo/intake/'));assert.equal((read('packets.html').match(/class="qp-case-story"/g)||[]).length,8);console.log('PASS exact-ID topic crosswalk and eight bounded case stories; original registers remain separate');

const decisionCtx={module:{exports:{}}};vm.runInNewContext(read('decision-tools.js'),decisionCtx);const dt=decisionCtx.module.exports;assert.equal(dt.kinds.length,24);assert.equal(dt.kinds.filter(k=>k[2]==='existing').length,13);assert.equal(dt.horizon(5,[{upfront:100000,cost:40000,benefit:60000}])[0].net,0);assert.equal(dt.resource(1000,800).delta,200);assert.equal(dt.resource(1000,800).percent,20);assert.equal(dt.resource(0,10).percent,null);assert.equal(dt.review([4,4],[true,false]).disposition,'Hold: required safeguards missing');assert(dt.review([4,0],[true,true]).disposition.includes('Review needed'));assert(dt.review([], [true]).disposition.includes('No applicable'));assert(!/\bfetch\s*\(|localStorage|sendBeacon|XMLHttpRequest/.test(read('decision-tools.js')));assert(read('decision-tools.html').includes('no publication authority'));console.log('PASS four local decision tools, reference calculations, unknown/zero distinction and non-compensatory evidence gates');

const heroCss=read('public-experience.css');assert(heroCss.includes('.qp-v3-home .qp-v3-hero,.qp-v3-home .qp-v3-nav,.qp-v3-home .qp-v3-main'));assert(heroCss.includes('height:auto;aspect-ratio:auto;object-fit:contain'));assert(heroCss.includes('max-height:none;line-height:0;border:0'));assert(heroCss.includes('@media(max-width:340px){.qp-v3-home .qp-v3-hero'));console.log('PASS responsive hero CSS contract; rendered device test still required.');

{
 const askPage=read('qify.html'),askCode=read('qify.js'),reportCode=read('report-core.js');
 assert(askPage.includes('id="qify-topic"')&&askPage.includes('value="__other__"')&&askPage.includes('<textarea id="qify-query"'));
 assert(askCode.includes('Dated reports')&&askCode.includes("chooser.value==='__other__'"));
 assert(askCode.includes('Useful next steps')&&askCode.includes('No exact answer is established'));
 const scope={window:{}};vm.runInNewContext(reportCode,scope);const core=scope.window.QPReport;
 const reports=JSON.parse(read('data/qp-current-reports.json')).reports,slugs=new Set(reports.map(r=>r.slug));
 const graphIds=new Set(graph.issues.map(i=>i.id));
 let links=0;for(const report of reports){const routes=core.usefulLinks(report);assert(routes.length>0,report.slug);for(const [label,route] of routes){assert(label.length>10);const url=new URL(route,'https://example.invalid/');const file=url.pathname.slice(1);assert(fs.existsSync(path.join(base,file)),route);if(url.searchParams.has('report'))assert(slugs.has(url.searchParams.get('report')),route);if(url.searchParams.has('issue'))assert(graphIds.has(url.searchParams.get('issue')),route);if(url.hash&&file!=='reports.html')assert(read(file).includes('id="'+url.hash.slice(1)+'"'),route);links++;}assert(core.render(report).includes('class="qp-next-steps"'),report.slug);}
 assert(core.usefulLinks(reports.find(r=>r.slug==='half-cent-2026')).some(x=>x[1].includes('report=lime-road-costs')));
 assert(read('launch-system.js').includes('assets/pueblo-emblem.svg'));const emblem=read('assets/pueblo-emblem.svg');assert(emblem.includes('clipPath')&&emblem.includes('preserveAspectRatio="xMidYMid meet"')&&!emblem.includes('<rect'));
 const styles=read('public-experience.css');assert(styles.includes('.qp-v3 .qp-qify-output .qp-answer-intro{background:#edf3f3;color:#10263b}'));
 console.log('PASS all 18 report next-step maps, '+links+' local destination checks, question chooser, foreground rules and emblem wiring; not device visual acceptance.');
}

// User-facing Falcon discoverability and theme contract (actual render checked separately).
{const falcon=read('project-falcon.html');assert(falcon.includes('id="timeline"')&&falcon.includes('January 31, 2027'));assert.equal((falcon.match(/class="qp-falcon-event"/g)||[]).length,8);assert(falcon.includes('Proposal ≠ Approval')&&falcon.includes('not established'));for(const file of ['index.html','reports.html','hot-topics.html','case-library.html','now.html'])assert(read(file).includes('href="project-falcon.html"'),file);assert(read('home-search.js').includes("'project-falcon.html'"));assert(read('public-experience.css').includes('background-color:#101a36')&&read('public-experience.css').includes('--reading-ink:#152d3c'));console.log('PASS Falcon eight dated milestones and six discovery paths; explicit foreground theme contract.');}

{const reports=JSON.parse(read('data/qp-current-reports.json')).reports;assert.equal(reports.length,18);const dir=read('reports-static.html');const fields=new Set();for(const r of reports){const file='report-'+r.slug+'.html',html=read(file);assert(dir.includes('href="'+file+'"'),file);assert(html.includes('id="original-sources"')&&html.includes('id="coverage-40"'),file);assert(html.includes(r.sourceChecked)&&html.includes(r.reviewDue),file);assert(html.includes('rel="canonical"')&&html.includes('property="og:title"'),file);const title=html.match(/<title>(.*?)<\/title>/)[1];assert(!fields.has(title),file);fields.add(title);assert(html.includes('Interactive version and downloads'),file);assert(html.includes(r.sourceChecked)&&html.includes('Original sources'),file);}
assert.equal(fields.size,18);assert(read('discover.html').includes('A — 1881'));assert(read('robots.txt').includes('Sitemap: https://qpueblo.pages.dev/sitemap.xml'));assert(read('sitemap.xml').includes('https://qpueblo.pages.dev/project-falcon'));assert(!read('sitemap.xml').includes('/workbench'));assert(read('about.html').includes('have not yet been independently established and published'));assert(read('es.html').includes('archivo de investigaciones'));assert(read('packets.html').includes('about $0.71 million'));console.log('PASS static full reports, unique titles, review date, share metadata, steel milestone, rounded figures and public accountability.');}

{const reports=JSON.parse(read('data/qp-current-reports.json')).reports;for(const r of reports){const html=read('report-'+r.slug+'.html');assert(html.indexOf('Short answer')<html.indexOf('id="coverage-40"'),r.slug);assert(html.indexOf('class="qp40-summary"')<html.indexOf('class="qp-next-steps"'),r.slug);assert(html.includes('data-qp-review-due="'+r.reviewDue+'"'),r.slug);assert.equal((html.match(/data-coverage="/g)||[]).length,40,r.slug);}assert(read('launch-system.js').includes('today>=due'));assert(read('about.html').includes('qp-inventory-live'));console.log('PASS reader-first packets and changing review-status inventory');}

import {execFileSync as runStaticParity} from 'node:child_process';
console.log(runStaticParity(process.execPath,['scripts/render-static-reports.mjs','--check'],{encoding:'utf8'}));

// Answer utility is a separate acceptance gate from formatting or count parity.
{const vmScope={window:{}};vm.runInNewContext(read('report-core.js'),vmScope);const api=vmScope.window.QPReport;const rs=JSON.parse(read('data/qp-current-reports.json')).reports;const prompt=api.researchPrompt('Where can I get food in Pueblo?');assert.equal(prompt.split('\n').filter(x=>/^\d+\. /.test(x)).length,40);assert(prompt.includes('RESEARCH BEFORE RENDERING')&&prompt.includes('A single program is not a complete regional answer'));const food=rs.find(r=>r.slug==='food-assistance');assert(food.serviceResources.length>=12);assert.equal(new Set(food.serviceResources.map(x=>x.id)).size,food.serviceResources.length);const page=read('report-food-assistance.html');assert(page.indexOf('id="service-directory"')<page.indexOf('id="coverage-40"'));for(const x of food.serviceResources){assert(food.sources.some(s=>s.id===x.id));for(const k of ['name','type','access','schedule','eligibility','url','checked','reviewDue'])assert(x[k],x.id+' '+k);assert(page.includes(api.esc(x.name))&&page.includes('href="'+api.esc(x.url)+'"'));assert(api.markdown(food).includes(x.name));}for(const r of rs){const html=read('report-'+r.slug+'.html');for(const s of r.sources)assert(html.includes('href="'+api.esc(s.url)+'"'),r.slug+' missing clickable source '+s.id);}for(const u of ['javascript:alert(1)','https://bad.test@evil.test/','https://bad.test\\evil','http://bad.test'])assert.equal(api.safeUrl(u),null);assert(read('twin.html').includes('report-food-assistance.html#service-directory'));assert(read('qify.js').includes('Practical food services in Pueblo'));console.log('PASS 40 discovery instructions, 15 food access routes, all static source hyperlinks and shared twin/search entry points. No live service availability asserted.');}

{const rs=JSON.parse(read("data/qp-current-reports.json")).reports;for(const r of rs){const h=read("report-"+r.slug+".html");const start=h.indexOf("id=\"coverage-40\""),end=h.indexOf("<section class=\"qp40-summary\">",start),coverage=h.slice(start,end),extra=coverage.indexOf("<details class=\"qp-report-popout qp40-additional\">");assert(extra>=0,r.slug+" missing optional coverage");assert(!coverage.slice(0,extra).includes("Not yet established</p>"),r.slug+" exposed empty slot");assert(coverage.slice(extra).includes("data-coverage=\"38\"")&&coverage.slice(extra).includes("data-coverage=\"39\""),r.slug+" missing uncertainty detail");assert.equal((coverage.match(/data-coverage=\"/g)||[]).length,40,r.slug);assert(!/<details open[^>]*qp40-additional/.test(coverage),r.slug+" additional coverage is expanded");}console.log("PASS findings-first presentation; 40 coverage records retained, empty slots and reopening details available on request");}

{const g=read('governance.html');assert(home.includes('href="governance.html"'));for(const id of ['falcon','boulevard','county-budget','city-budget'])assert(g.includes('id="'+id+'"'));for(const slug of ['half-cent-2026','lime-road-costs','pueblo-boulevard-agenda','county-budget-2027','budget-2026'])assert(g.includes('href="report-'+slug+'.html"'));assert(g.includes('2,058,277.00')&&g.includes('not payments'));console.log('PASS governance briefing routes and explicit financial boundaries');}

{assert(home.includes('People need information to govern themselves'));const g=read('governance.html');assert(g.includes('Q does not govern, vote, spend, or authorize decisions'));assert(g.includes('Participate with knowledge'));}

{const g=read('governance.html');for(const label of ['Residents and households','Elected officials and public employees','Businesses and regional decision-makers','Community leaders, educators and researchers'])assert(g.includes(label));assert(g.includes('does not change facts'));assert(home.includes('elected officials, public employees, businesses and community leaders'));}

{const hero=home.indexOf('class="qp-v3-hero"'),intro=home.indexOf('class="qp-welcome-note qp-home-intro"'),search=home.indexOf('id="search-pueblo"');assert(hero<intro&&intro<search,'Banner must precede compact intro and search');const compact=home.slice(intro,search).replace(/<[^>]+>/g,' ').trim();assert(compact.length<220,'Intro exceeds compact mobile budget');assert(home.includes('srcset="assets/pueblo-riverwalk-hero.webp"'),'Use complete uncropped artwork on mobile');console.log('PASS mobile-first banner and compact intro order');}
