import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=p=>readFileSync('public/'+p,'utf8');
const json=p=>JSON.parse(read(p));
const nav=json('data/qp-priority-navigation-2026-11-19.json');
const graph=json('data/qp-three-hop-2026-11-13.json');
const structured=json('data/qp-current-reports.json').reports;
const home=read('index.html'),hub=read('priorities.html');
const expected=new Set(graph.issues.map(i=>i.id)),assigned=nav.groups.flatMap(g=>g.primaryIssueIds);
assert.equal(nav.groups.length,10);
assert.equal(assigned.length,expected.size);
assert.deepEqual(new Set(assigned),expected);
assert.equal(nav.entityCrosswalk.length,graph.entities.length);
assert.equal(new Set(nav.entityCrosswalk.map(e=>e.id)).size,graph.entities.length);
for(const ent of graph.entities){const row=nav.entityCrosswalk.find(e=>e.id===ent.id);assert(row);assert.deepEqual(new Set(row.issueIds),new Set(graph.issues.filter(i=>i.edges.some(e=>e.entity_id===ent.id)).map(i=>i.id)));assert(hub.includes('governance-entities.html?entity='+ent.id));}
for(const group of nav.groups){assert(hub.includes('id="'+group.id+'"'));for(const route of group.routes)assert(existsSync('public/'+route),route);for(const id of group.primaryIssueIds)assert(hub.includes('connections.html?issue='+id));}
assert.deepEqual(new Set(nav.structuredReports.map(r=>r.id)),new Set(structured.map(r=>r.id)));
for(let i=1;i<nav.structuredReports.length;i++){let a=nav.structuredReports[i-1],b=nav.structuredReports[i];assert(a.sourceEntries>b.sourceEntries||(a.sourceEntries===b.sourceEntries&&a.claimEntries>=b.claimEntries));}
assert(home.indexOf('Start with Pueblo')<home.indexOf('id="governance-intelligence"'));
for(const page of ['index.html','reports-static.html','governance-entities.html'])assert(read(page).includes('priorities.html#by-entity'));
for(const page of [home,hub])assert.equal((page.match(/<details\b/g)||[]).length,(page.match(/<\/details>/g)||[]).length);
console.log('PASS: priority coverage, dated entity associations, report depth order, navigation and disclosure balance');
