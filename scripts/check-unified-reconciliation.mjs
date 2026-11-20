import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
const read=p=>readFileSync(p,'utf8');
const data='data/qp-living-research-discovery-2026-11-19.json';
const r=JSON.parse(read('public/'+data));
const h=read('public/living-research.html');
assert.equal(r.schema,'qp-living-research-discovery-v1');
assert.equal(new Set(r.rows.map(x=>x.id)).size,r.rows.length);
assert.equal(new Set(r.rows.map(x=>x.route)).size,r.rows.length);
const groups=new Set(r.groups.map(x=>x.id));
assert.equal(groups.size,10);
for(const x of r.rows){assert(groups.has(x.group));assert(x.title&&x.review&&x.status);assert(h.includes('href="'+x.route+'"'));for(const file of [x.route,...x.files]){assert(/^[a-z0-9_./-]+$/i.test(file)&&!file.includes('..')&&!file.startsWith('/'));const path=resolve('public',file);assert(existsSync(path),'Missing '+path);if(file.endsWith('.json'))JSON.parse(read(path));}}
for(const p of ['index.html','reports-static.html','priorities.html','twin.html','packets.html'])assert(read('public/'+p).includes('living-research.html'),p);
assert(read('public/entities.html').includes('civic-observatory.html'));
assert(read('public/home-search.js').includes(data));
assert.equal(r.metrics.canonicalClaimCoverage,null);
assert.equal(r.metrics.productionParity,null);
assert(!h.includes('5,760')&&!h.includes('4,914'));
console.log('Living research discovery structural checks passed: '+r.rows.length+' routes; '+groups.size+' categories. No source-truth or production certification.');

const cross=JSON.parse(read('public/data/qp-issue-identity-crosswalk-2026-11-19.json'));
const historical=JSON.parse(read('public/data/q-pueblo-issue-index-2026-11-09.json')).issues;
const graph=JSON.parse(read('public/data/qp-three-hop-2026-11-13.json')).issues;
assert.deepEqual(new Set(cross.rows.map(x=>x.historicalId).filter(Boolean)),new Set(historical.map(x=>x.id)));
assert.deepEqual(new Set(cross.rows.map(x=>x.graphId).filter(Boolean)),new Set(graph.map(x=>x.id)));
assert.equal(cross.rows.filter(x=>x.historicalId).length,historical.length);assert.equal(cross.rows.filter(x=>x.graphId).length,graph.length);
assert.equal(cross.rows.filter(x=>x.state==='id-match-scope-review').length,10);
assert(h.includes('qp-issue-identity-crosswalk-2026-11-19.json'));
console.log('Issue identity coverage passes; ten ambiguous title/scope pairs remain unmerged.');

const depth=JSON.parse(read('public/data/qp-living-reference-depth-2026-11-20.json'));
const depthPage=read('public/research-depth.html');
assert.deepEqual(new Set(depth.rows.map(x=>x.route)),new Set(r.rows.map(x=>x.route)));
assert.equal(depth.rows.length,r.rows.length);
for(const row of depth.rows){const html=read('public/'+row.route);const links=new Set([...html.matchAll(/<a\b[^>]*\bhref\s*=\s*["'](https?:\/\/[^"']+)["'][^>]*>/gi)].map(m=>m[1].replace(/&amp;/g,'&')));assert.equal(row.distinctExternalLinks,links.size,row.route+' link count');assert.equal(row.headingEntries,(html.match(/<h[1-6]\b/gi)||[]).length,row.route+' heading count');assert(depthPage.includes('href="'+row.route+'"'));}
for(let i=1;i<depth.rows.length;i++){const a=depth.rows[i-1],b=depth.rows[i];assert(a.distinctExternalLinks>b.distinctExternalLinks||(a.distinctExternalLinks===b.distinctExternalLinks&&a.headingEntries>=b.headingEntries));}
console.log('PASS complete living reference-depth index; counts are navigation descriptors, not evidence ratings.');

const cultureHub=read('public/museums-culture.html'),culturePaper=read('public/museums-culture-research.html');
assert(cultureHub.indexOf('id="story-first"')<cultureHub.indexOf('id="directory"'));
assert(cultureHub.indexOf('id="money"')<cultureHub.indexOf('id="directory"'));
assert(culturePaper.indexOf('id="story-first"')<culturePaper.indexOf('aria-label="Paper contents"'));
for(const page of [cultureHub,culturePaper])assert(!/Continue adding community heritage groups|Q processing and future builds|Review dates are editorial targets|November 25 review is editorial/.test(page));
assert(cultureHub.includes('museums-culture-research.html')&&cultureHub.includes('museums-culture-tools.html')&&cultureHub.includes('qp-museums-culture-2026-11-19.json'));
assert.equal((culturePaper.match(/id="chapter-\d+"/g)||[]).length,40);
console.log('PASS culture reader story leads; internal work notes omitted from reader pages; 40 analytical sections preserved.');

const expandedCulture=JSON.parse(read('public/data/qp-museums-culture-2026-11-19.json')).cultureExpansion.profiles;
assert.equal(new Set(expandedCulture.map(x=>x.id)).size,expandedCulture.length);
for(const x of expandedCulture){assert(x.finding&&x.meaning&&x.unknown&&x.sources.length&&cultureHub.includes('id="culture-'+x.id+'"'));}
assert(culturePaper.includes('museums-culture.html#living-culture'));
assert(read('public/home-search.js').includes('culture.cultureExpansion'));
console.log('PASS individual cultural profiles, research and search links');

const cultureLearning=JSON.parse(read('public/data/qp-culture-twin-learning-2026-11-20.json'));
const cultureLearnPage=read('public/culture-learning.html');
const culturePacket=JSON.parse(read('public/data/qp-museums-culture-2026-11-19.json'));
assert.equal(cultureLearning.legacyLearning.meaning,'Legacy Learning');
assert.deepEqual(new Set(cultureLearning.rows.map(x=>x.id)),new Set([...culturePacket.profiles,...culturePacket.cultureExpansion.profiles].map(x=>x.id)));
assert.equal(cultureLearning.rows.length,36);
for(const x of cultureLearning.rows){assert(x.lesson&&x.question&&x.sourceUrls.length);assert(cultureLearnPage.includes('id="learn-'+x.id+'"'));assert(cultureHub.includes('culture-learning.html#learn-'+x.id));assert(cultureHub.includes('id="'+x.storyRoute.split('#')[1]+'"'));}
for(const p of ['twin.html','learn-pueblo.html','museums-culture-research.html','museums-culture-tools.html'])assert(read('public/'+p).includes('culture-learning.html'));
assert(cultureLearnPage.includes('twin.html#culture-learning'));
console.log('PASS cultural profile learning, legacy learning meaning, and reciprocal Twin connections');

const {runInNewContext}=await import('node:vm');
const quiltScope={window:{}};runInNewContext(read('public/reader-quilt.js'),quiltScope);const quiz=quiltScope.window.QPReaderQuilt;
const currentReports=JSON.parse(read('public/data/qp-current-reports.json')).reports;
const reportScope={window:{}};runInNewContext(read('public/report-core.js'),reportScope);const reportApi=reportScope.window.QPReport;
const groupRoutes=[...currentReports.map(x=>'report-'+x.slug+'.html'),...r.rows.map(x=>x.route),'museums-culture.html','culture-learning.html'];
const launchCode=read('public/launch-system.js');
for(const route of groupRoutes){const html=read('public/'+route);assert(launchCode.includes(JSON.stringify(route)),route+' missing subject entry');assert(/launch-system\.js|reader-quilt\.js/.test(html),route+' missing runtime');for(const prior of quiz.priorFor(route))assert(existsSync('public/'+prior.route),prior.route);}
for(const report of currentReports){const q=quiz.project({report,prior:quiz.priorFor('report-'+report.slug+'.html'),coverage:reportApi.coverage40(report)});assert(q.findings.length&&q.legacyLearning.historical.length&&q.quilt.length<=40 && q.quilt.every(x=>x.state!=='Not assessed'));assert(q.evidenceState==='DATED_PREPARED_FINDINGS');assert(quiz.markdown(q).includes('Legacy Learning (LL)'));}
const none=quiz.project({question:'Unestablished question',related:[{title:'Related topic',route:'museums-culture.html'}]});assert.equal(none.evidenceState,'NO_EXACT_PREPARED_ANSWER');assert.equal(none.findings.length,0);assert.equal(none.quilt.length,0);assert.equal(none.related.length,1);assert(!quiz.safeLocal('../private.html'));
for(const path of ['qify.html','reports.html'])assert(read('public/'+path).includes('reader-quilt.js'));
assert(read('public/qify.js').includes('packet.readerProjection')&&read('public/qify.js').includes('reader.relatedLiving'));
const lean=quiz.project({report:currentReports[0],coverage:[{title:'Empty',answer:'Not assessed',classification:'Not assessed'},{title:'Duplicate',answer:currentReports[0].summary,classification:'Dated'},{title:'Distinct',answer:'A distinct test observation.',classification:'Dated'}]});assert.equal(lean.quilt.length,1);assert.equal(lean.quilt[0].title,'Distinct');
console.log('PASS LL and quilt projections for '+new Set(groupRoutes).size+' registered subject routes, prepared reports, and unmatched question boundary');

await import('./check-site-inventory.mjs');
