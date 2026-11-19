import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const model=require('../public/regional-transition-tools.js');
const stories=require('../public/data/qp-story-editions.js');
const data=JSON.parse(fs.readFileSync(new URL('../public/data/qp-regional-transition-2026-11-18.json',import.meta.url),'utf8'));
const read=p=>fs.readFileSync(new URL('../public/'+p,import.meta.url),'utf8');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,a+' != '+b);
assert.equal(data.stories.length,8);assert.equal(new Set(data.stories.map(s=>s.id)).size,8);
for(const s of data.stories){assert.deepEqual(stories.byId(s.id),s);assert.ok(s.chapters.length>=10);assert.ok(s.sources.length>=3);assert.ok(s.packet.related.every(id=>data.stories.some(t=>t.id===id)));assert.ok(s.sources.every(x=>x.url.startsWith('https://')));assert.ok(read(s.route).includes('id="sources"'));assert.ok(read(s.route).includes('id="unknowns"'));for(const p of ['index.html','reports-static.html','issues.html','now.html','regional-financial-transition.html'])assert.ok(read(p).includes('href="'+s.route+'"'),p+' '+s.route);}
close(model.budget({revenueLoss:1}).annual,.0333);close(model.budget({revenueLoss:2}).annual,-1.1934);close(model.budget({revenueLoss:0,savings:90}).annual,.279);close(model.opening({sale:0,cop:0}).balance,-21.1);close(model.compensation({}).threeCost,595008.75);assert.equal(model.pension().liability,145099294);assert.equal(model.pension().shortfall,4215030);close(model.reuse({}).net,13400);assert.equal(model.reuse({operation:100000}).payback,null);
assert.ok(read('regional-transition-tools.html').includes('src="regional-transition-tools.js"'));
console.log('8 living research articles, source-index parity, connections and five deterministic models validated.');
