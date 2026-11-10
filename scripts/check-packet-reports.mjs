import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync('public/'+p,'utf8');
const doc=JSON.parse(read('data/q-pueblo-qified-reports-v2-2026-11-09.json'));
const archive=JSON.parse(read('data/q-pueblo-historical-library-2026-11-10.json'));
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
assert.equal(archive.families.length,55);assert.equal(archive.families.reduce((n,f)=>n+f.variants,0),109);
assert.equal(new Set(archive.families.map(f=>f.url)).size,55);
assert.equal(archive.caseSummaries.length,8);
for(const c of archive.caseSummaries){assert(fs.existsSync('public/'+c.localDownload));assert(read(c.localDownload).includes(c.url));}
const page=read('packets.html');assert.equal((page.match(/data-packet-family/g)||[]).length,55);assert(page.includes('not eight newly completed'));
assert(read('index.html').includes('name="q"')===false,'home question must not enter GET query');
assert(read('launch-system.js').includes('qify.html#q='));
for(const page of ['reports.html','qify.html'])assert(read(page).indexOf('report-core.js')<read(page).indexOf(page.replace('.html','.js')),'shared code load order');
const publicFiles=['packets.html','data/q-pueblo-historical-library-2026-11-10.json','report-core.js','qify.js'];
for(const p of publicFiles)assert(!/libfile_|docs\.google\.com|q10-core\/blob|SECRET|BEGIN PRIVATE KEY/.test(read(p)),p+': private locator leaked');
console.log('PACKET_REPORT_CHECK=PASS; reports=14; claims=49; public draft families=55; case captures=8; private originals excluded');

const road=doc.reports.find(r=>r.slug==='pueblo-boulevard-agenda');
assert.equal(175638340+3256160+1933200+25000000,165827700+40000000,'agenda sources/uses in integer cents');
assert(road.summary.includes('not evidence of adoption'));
assert(road.money.some(x=>x.stage==='Contingency'&&x.status.includes('not an incurred expense')));
assert(road.unknowns.some(x=>x.includes('executed contract')));
assert(read('entities.html').includes('An asset or address is not automatically'));
assert(read('entities.html').includes('TBTD Pueblo, LLC'));
