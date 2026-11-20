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
