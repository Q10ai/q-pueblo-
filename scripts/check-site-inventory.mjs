import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const read=p=>readFileSync('public/'+p,'utf8'), json=p=>JSON.parse(read(p));
const inv=json('data/qp-site-inventory.json'), html=read('site-inventory.html');
const walk=(dir,prefix='')=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name),prefix+e.name+'/'):[prefix+e.name]);
const actual=walk('public').filter(p=>p.endsWith('.html')).sort();
assert.deepEqual(inv.rows.map(r=>r.route).sort(),actual,'Inventory must cover every HTML route exactly once');
assert.equal(inv.counts.htmlRoutes,actual.length);
const canonical=json(inv.registers.canonical).reports,living=json(inv.registers.living).rows,graph=json(inv.registers.connected),historical=json(inv.registers.historical),cross=json(inv.registers.identityCrosswalk),nav=json(inv.registers.priorities);
assert.equal(inv.counts.canonicalReports,canonical.length);assert.equal(inv.counts.livingResearchRoutes,living.length);assert.equal(inv.counts.connectedIssueRecords,graph.issues.length);assert.equal(inv.counts.historicalIssueRecords,historical.issues.length);assert.equal(inv.counts.entityLabels,graph.entities.length);assert.equal(inv.counts.identityCrosswalkRows,cross.rows.length);
assert.deepEqual(new Set(inv.rows.filter(r=>r.canonicalId).map(r=>r.canonicalId)),new Set(canonical.map(r=>r.id)));
assert.deepEqual(new Set(inv.rows.filter(r=>r.livingId).map(r=>r.livingId)),new Set(living.map(r=>r.id)));
for(const r of inv.rows){assert(html.includes('href="'+r.route+'"'),r.route);for(const f of r.supportingFiles||[])assert(existsSync('public/'+f),f);}
for(const g of inv.groups){if(nav.groups.some(n=>n.id===g.id)){assert.deepEqual(g.priorityIssueIds,nav.groups.find(n=>n.id===g.id).primaryIssueIds);assert.deepEqual(g.entityIds,nav.entityCrosswalk.filter(e=>e.groupIds.includes(g.id)).map(e=>e.id));}}
for(const p of ['index.html','living-research.html','priorities.html','governance-entities.html','learn-pueblo.html','twin.html'])assert(read(p).includes('href="site-inventory.html"'),p);
assert(read('sitemap.xml').includes('/site-inventory</loc>'));
console.log('PASS exact site route inventory, distinct register counts, topic associations and integrated directory links');
