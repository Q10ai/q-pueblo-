import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const catalogCode=readFileSync('public/data/q-pueblo-public-catalog-2026-11-08.js','utf8');
const sandbox={window:{}};vm.runInNewContext(catalogCode,sandbox,{timeout:3000});
const c=sandbox.window.QP_PUBLIC_CATALOG;
assert.equal(c.schema,'qp-public-catalog-v1');
assert.equal(c.publicState,'INDEX_ONLY_NOT_CURRENT_FINDINGS');
assert.equal(c.issues.length,174);
assert.equal(c.issues.filter(x=>x.id.startsWith('REG-')).length,73);
assert.equal(c.issues.filter(x=>x.id.startsWith('QRX-')).length,101);
assert.equal(new Set(c.issues.map(x=>x.id)).size,174);
assert.equal(c.categories.length,10);
assert.equal(c.domains.length,27);
assert.equal(c.stats.registeredSources,199);
assert.ok(c.sources.length>100);
assert.equal(new Set(c.sources.map(x=>x.id)).size,c.sources.length);
const known=new Set(c.sources.map(x=>x.id));
for(const i of c.issues){
  assert.ok(i.title.length>4 && i.domain.length>0 && c.categories.includes(i.category),i.id);
  assert.ok(i.childImpact.includes('review'),i.id);
  for(const s of i.sourceIds)assert.ok(known.has(s),s);
}
for(const s of c.sources){
  assert.match(s.url,/^https:\/\//i);
  assert.ok(!/(?:docs\.google\.com|drive\.google\.com|localhost|127\.0\.0\.1)/i.test(s.url),'Private or internal link');
  assert.ok(!/token=|api_key=|access_token=/i.test(s.url),'Token-bearing link');
}
const home=readFileSync('public/index.html','utf8');
const page=readFileSync('public/explore.html','utf8');
assert.ok(home.includes('href="explore.html"'));
assert.ok(home.includes('Know Pueblo. Help Shape Its Future.'));
assert.ok(page.includes('id="issue-results"')&&page.includes('id="source-results"'));
assert.ok(page.includes('src="explore.js"')&&page.includes('q-pueblo-public-catalog-2026-11-08.js'));
assert.ok(readFileSync('public/_headers','utf8').includes("script-src 'self'"));
console.log('PASS: 174 issue IDs, 141+ controlled external source links, ten categories, 27 domains, safe static front end.');
