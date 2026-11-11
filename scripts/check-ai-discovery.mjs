// Review-gated source-level discovery contract. No external requests.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const read = p => fs.readFileSync(p,'utf8');
const r=read('public/robots.txt'), xml=read('public/sitemap.xml');
for (const b of ['GPTBot','ClaudeBot','CCBot','Google-Extended']) {
  assert.match(r,new RegExp('User-agent: '+b+'\\s+Disallow: /'),b+' must opt out');
}
for (const b of ['OAI-SearchBot','Claude-SearchBot']) {
  assert.match(r,new RegExp('User-agent: '+b+'\\s+Allow: /'),b+' must allow public search');
}
assert.match(r,/Sitemap: https:\/\/qpueblo\.pages\.dev\/sitemap\.xml/);
const expected=new Map([['/','public/index.html'],['/reports.html','public/reports.html'],['/evidence-desk.html','public/evidence-desk.html']]);
const locs=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.deepEqual(new Set(locs),new Set([...expected.keys()].map(p=>'https://qpueblo.pages.dev'+p)));
assert.equal(locs.length,expected.size,'No duplicate sitemap entries');
for (const [url,file] of expected) {
  const html=read(file);
  assert.match(html,/<title>[^<]+<\/title>/,'title missing '+file);
  assert.match(html,/<meta name="description" content="[^"]+"/,'description missing '+file);
  assert.ok(html.includes('<link rel="canonical" href="https://qpueblo.pages.dev'+url+'">'), 'canonical missing '+file);
  assert.ok(!/<meta[^>]+name="robots"[^>]+noindex/i.test(html),'accidental noindex '+file);
}
for (const file of ['public/packets.html','public/workbench.html']) {
  assert.match(read(file),/<meta name="robots" content="noindex,follow">/,'draft/archive noindex missing: '+file);
}
console.log('AI discovery source gate passed (NOT a live deployment or content verification).');
