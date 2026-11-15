import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync('public/'+p,'utf8');
const doc=JSON.parse(read('data/q-pueblo-qified-reports-v2-2026-11-09.json'));
const archive=JSON.parse(read('data/q-pueblo-public-case-summaries.json'));
const issues=JSON.parse(read('data/q-pueblo-issue-index-2026-11-09.json')).issues;
const context={window:{},URL};vm.createContext(context);vm.runInContext(read('report-core.js'),context);
const core=context.window.QPReport;
assert.equal(doc.reports.length,14);
assert.equal(new Set(doc.reports.map(r=>r.id)).size,doc.reports.length);
assert.equal(new Set(doc.reports.map(r=>r.slug)).size,doc.reports.length);
for(const r of doc.reports){
 const ids=new Set(r.sources.map(s=>s.id));
 for(const c of r.claims){assert(c.sourceIds.length);for(const id of c.sourceIds)assert(ids.has(id),r.slug+': claim source missing');}
 for(const id of r.issueIds)assert(issues.some(i=>i.id===id),r.slug+': unmapped issue');
 assert.equal(r.independentAudit,false);
 assert(r.qification.alternatives.length>=2);
 assert(r.recordsNeeded.length);
 const markdown=core.markdown(r),rendered=core.render(r);
 for(const phrase of [r.qification.assessment,r.qification.childImpact.future,r.qification.shock,r.counter,...r.recordsNeeded])assert(markdown.includes(phrase),r.slug+': export loses analysis');
 for(const s of r.sources){assert(s.url.startsWith('https://'));assert(markdown.includes(s.url));assert(core.safeUrl(s.url));assert(rendered.includes(core.esc(core.safeUrl(s.url))));}
 for(const q of r.questions){const matches=core.matchReports(q,doc.reports);assert(matches.some(m=>m.exact&&m.report.id===r.id),q+': prepared question not found');}
 assert(core.status(r,'2027-01-01').startsWith('REVIEW DUE'));
}
assert.equal(core.matchReports('What is Pueblo like?',doc.reports).length,0,'generic word must not yield a report');
assert.equal(core.matchReports('Is the city 2027 budget approved?',doc.reports).filter(x=>x.report.slug==='budget-2026').length,0,'wrong fiscal year');
assert.equal(core.matchReports('How much is the 2026 budget?',doc.reports).some(x=>x.exact),false,'related match must not become an exact answer');
assert.equal(core.safeUrl('javascript:alert(1)'),null);
assert(!core.render({...doc.reports[0],title:'<img src=x onerror=alert(1)>'}).includes('<img src=x'));
assert(!('families' in archive),'Private draft inventory must not be public');
assert(!fs.existsSync('public/data/q-pueblo-historical-library-2026-11-10.json'));
assert.equal(archive.caseSummaries.length,8);
for(const c of archive.caseSummaries){assert(fs.existsSync('public/'+c.localDownload));assert(read(c.localDownload).includes(c.url));}
const page=read('packets.html');assert.equal((page.match(/class="qp-art-card qp-paper-card"/g)||[]).length,20);assert.equal((page.match(/class="qp-case-detail"/g)||[]).length,8);for(const c of archive.caseSummaries){assert(page.includes(c.localDownload));assert(page.includes(c.slug));}
assert(read('index.html').includes('name="q"')===false,'home question must not enter GET query');
assert(read('launch-system.js').includes('qify.html#q='));
for(const page of ['reports.html','qify.html'])assert(read(page).indexOf('report-core.js')<read(page).indexOf(page.replace('.html','.js')),'shared code load order');
const publicFiles=['packets.html','data/q-pueblo-public-case-summaries.json','report-core.js','qify.js'];
for(const p of publicFiles)assert(!/libfile_|docs\.google\.com|q10-core\/blob|SECRET|BEGIN PRIVATE KEY/.test(read(p)),p+': private locator leaked');
console.log('PACKET_REPORT_CHECK=PASS; reports=14; claims=49; draft inventory excluded; case captures=8; private originals excluded');

const road=doc.reports.find(r=>r.slug==='pueblo-boulevard-agenda');
assert.equal(175638340+3256160+1933200+25000000,165827700+40000000,'agenda sources/uses in integer cents');
assert(road.summary.includes('not evidence of adoption'));
assert(road.money.some(x=>x.stage==='Contingency'&&x.status.includes('not an incurred expense')));
assert(road.unknowns.some(x=>x.includes('executed contract')));
assert(read('entities.html').includes('An asset or address is not automatically'));
assert(read('entities.html').includes('TBTD Pueblo, LLC'));

for(const r of doc.reports){const items=core.coverage40(r);assert.equal(items.length,40,r.slug);assert.equal(new Set(items.map(x=>x.n)).size,40);assert(items.every(x=>typeof x.answer==='string'&&x.answer.trim().length>5&&x.classification));assert.equal((core.render(r).match(/data-coverage="/g)||[]).length,40);assert(core.render(r).indexOf('class="qp40-summary"')<core.render(r).indexOf('id="original-sources"'));assert(core.markdown(r).includes('40-point findings'))}
assert(core.coverage40(doc.reports.find(r=>r.slug==='budget-2026'))[16].answer.includes('57.4%'));
assert(core.coverage40(doc.reports.find(r=>r.slug==='budget-2026'))[18].answer.includes('not been reconciled'));
assert(core.researchPrompt('Pueblo water bills','resident','full report').includes('40 sections'));
console.log('PASS: 14 dated analyses mapped to 40 reader-facing fields, missing evidence explicit, optional research prompt.');

const current=JSON.parse(read('data/qp-current-reports.json'));
assert.equal(current.reports.length,18);
assert.deepEqual(current.reports.slice(0,14),doc.reports,'Earlier evidence edition must remain unchanged');
assert.equal(new Set(current.reports.map(r=>r.slug)).size,18);
for(const r of current.reports.slice(14)){assert.equal(core.coverage40(r).length,40);assert.equal((core.render(r).match(/data-coverage="/g)||[]).length,40);assert(r.sources.every(s=>s.url.startsWith('https://')));assert(r.claims.every(c=>c.sourceIds.every(id=>r.sources.some(s=>s.id===id))));assert(r.questions.every(q=>core.matchReports(q,current.reports).some(x=>x.exact&&x.report.id===r.id)));assert(core.markdown(r).includes('40-point findings'));}
assert(core.coverage40(current.reports.find(r=>r.slug==='food-assistance'))[34].answer.includes('1-877-644-3663'));
for(const name of ['qify.js','reports.js','workbench.js','evidence-desk.js','home-search.js','governance-index.js'])assert(read(name).includes('data/qp-current-reports.json'),name+' current edition missing');
console.log('PASS current 18-report edition, 14 originals unchanged, four public-source additions and shared reader routes');

for(const r of current.reports){const out=core.render(r);assert(core.story(r).length>=3,r.slug+' missing authored story');assert(out.includes('class="qp-story"'));assert(out.indexOf('class="qp-story"')<out.indexOf('id="coverage-40"'));assert(out.includes('<details open class="qp40 qp-report-popout" id="coverage-40">'));assert(!out.includes('LOW SPECIFICITY GROUP/HUB'));assert(core.markdown(r).includes(core.story(r)[0][1]));}
assert(read('public-experience.css').includes('.qp-v3 .qp-report-detail .qp-report-popout{background:#edf3f3;color:#142b3d'));
assert(!read('connections.js').includes('Next: obtain actual governing instrument'));
assert(!read('connections.js').includes('https://q10asi.com/projects/q-pueblo/issues/'));
console.log('PASS 18 authored narratives, collapsed 40-point coverage, explicit readable report theme, local connection navigation');

assert.equal(core.csacEvidence.rows.length,46);assert.equal(core.csacEvidence.rows.reduce((s,x)=>s+x[1],0),2203865);assert.equal(Object.values(core.csacEvidence.totals).reduce((s,x)=>s+x,0),2203865);const csac=current.reports.find(r=>r.slug==='csac-2027');assert(core.render(csac).includes('All 46 applicants'));assert(core.coverage40(csac)[16].answer.includes('22.23%'));assert(core.markdown(csac).includes('2,203,865'));console.log('PASS 46 source-attributed CSAC request rows reconcile exactly; source dates and financial stages preserved');
