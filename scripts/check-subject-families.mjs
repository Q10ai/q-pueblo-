import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const read=p=>readFileSync('public/'+p,'utf8');
const rows=JSON.parse(read('data/qp-subject-families-2026-11-21.json'));
const areas=read('areas.html'),home=read('index.html'),inventory=read('site-inventory.html');
assert.equal(rows.schema,'qp-subject-families-v1');
assert.equal(rows.status,'editorial-navigation-not-evidence-validation');
assert.equal(rows.count,rows.families.length);
assert(rows.families.length>=25,'Subject-family register unexpectedly shrank');
assert.equal(new Set(rows.families.map(f=>f.id)).size,rows.families.length,'Duplicate family identifiers');
assert.equal(new Set(rows.groups.map(g=>g.id)).size,rows.groups.length,'Duplicate groups');
assert(areas.includes('id="subject-families"'),'Missing Explore subject directory');
assert(home.includes('href="areas.html#subject-families"'),'Home missing subject directory link');
assert(inventory.includes('href="areas.html#subject-families"'),'Site inventory missing subject directory');
assert(areas.includes('id="regional-overview"'),'Original eight overview pathways missing');
for(const f of rows.families){
 assert(/^[a-z0-9-]+$/.test(f.id),f.id+': bad ID');
 assert(rows.groups.some(g=>g.id===f.group),f.id+': unknown group');
 assert(f.title&&f.topics.length>=3&&f.links.length>=2,f.id+': missing topic depth');
 assert(['partial','underrepresented'].includes(f.coverage),f.id+': coverage not editorially classified');
 assert(areas.includes('id="family-'+f.id+'"'),f.id+': no directory anchor');
 for(const topic of f.topics)assert(areas.includes(topic.replaceAll('&','&amp;')),f.id+': topic not rendered '+topic);
 for(const href of f.links){
  assert(/^(?:[a-z0-9-]+\/)*[a-z0-9-]+\.html(?:#[a-z0-9-]+)?$/i.test(href),f.id+': unsafe local route '+href);
  const [route,fragment]=href.split('#');
  assert(existsSync('public/'+route),f.id+': broken linked route '+route);
  assert(areas.includes('href="'+href+'"'),f.id+': route not visible '+href);
  if(route==='areas.html'&&fragment)assert(areas.includes('id="'+fragment+'"'),f.id+': broken anchor '+fragment);
 }
}
for(const label of ['Grandparents raising grandchildren','Churches, congregations','Pueblo chile','SHOCK','Child Zero','five levels','Healthcare','Local journalism'])
 assert(areas.toLowerCase().includes(label.toLowerCase()),'Missing agreed scope: '+label);
console.log('PASS '+rows.families.length+' subject families; '+rows.groups.length+' groups, topic depth, linked routes, homepage discovery, safety boundary. This is not a substantive evidence or live-deployment audit.');
