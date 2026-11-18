import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
const routes=[["ai-world.html","AI &amp; Our World"],["ai-citizen-learning.html","AI Education for Everyone"],["ai-education.html","AI in Education"],["digital-twins.html","Digital Twins"],["ai-readiness.html","Is Pueblo ready for the AI era?"],["edu-review.html","Practice an AI education review"],["ai-readiness-worksheet.txt","AI ERA PREPAREDNESS"]];
const read=p=>readFileSync('public/'+p,'utf8');
const home=read('index.html'), sitemap=read('sitemap.xml');
assert.equal((home.match(/class="qp-art-card qp-entry-card"/g)||[]).length,8,'preserve principal gateways');
assert(home.includes('id="ai-our-world"'));
assert.equal((read('ai-world.html').match(/class="qp-art-card qp-entry-card"/g)||[]).length,16);
for(const [p,marker] of routes){const s=read(p);assert(s.includes(marker),p);assert(!/\\bQ10ai\\b|\\bq10-core\\b|q10agi@gmail\\.com|sandbox:|PRIVATE REVIEW/i.test(s),'internal locator '+p);if(!p.endsWith('.html'))continue;assert(sitemap.includes('https://qpueblo.pages.dev/'+p.slice(0,-5)+'</loc>'),p+' sitemap');assert(!/<(?:form|input|iframe|script(?![^>]*src=))\\b/i.test(s),p+' unexpected data intake or inline script');const ids=[...s.matchAll(/\\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,ids.length,p+' duplicate ids');for(const [,url] of s.matchAll(/href="([^"]+)"|src="([^"]+)"/g).map(m=>[m[0],m[1]||m[2]])){if(url.startsWith('https://')||url==='/')continue;const [file,fragment]=url.split('#');const target=(file||p).split('?')[0];assert(existsSync(path.join('public',target)),p+' missing '+target);if(fragment&&target.endsWith('.html'))assert(read(target).includes('id="'+fragment+'"'),p+' missing anchor '+url);}}
assert(home.includes('href="ai-world.html"')&&home.includes('href="ai-readiness.html"'));
console.log('PASS new AI routes, 16 hub entries, existing 8 principal gateways, local links, no intake or inline script and public exposure checks (static only).');
