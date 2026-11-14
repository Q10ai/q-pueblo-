'use strict';
(()=>{
const $=id=>document.getElementById(id);
const curated=[
['City of Pueblo','Municipal government','Municipal ordinances, City Council, mayoral administration, city services and adopted municipal budget','https://www.pueblo.us/','City'],
['Pueblo County','County government','Board of County Commissioners, county functions, county services, elections and published county meeting agendas','https://www.pueblocounty.gov/','County'],
['Pueblo Water / Board of Water Works','Public water authority','Pueblo Water service, water quality, supply and its own public records','https://pueblowater.org/','Water'],
['Pueblo Area Council of Governments (PACOG)','Regional planning organization','Intergovernmental body; metropolitan and regional transportation planning among city, county, water, school and district members','https://www.pacog.net/whoispacog','Regional'],
['Pueblo School District 60','School district','School board, K–12 education administration, board meetings and financial transparency','https://www.pueblod60.org/','Education'],
['Pueblo County School District 70','School district','K–12 school administration and district board; jurisdiction distinct from D60','https://www.district70.org/','Education'],
['Pueblo West Metropolitan District','Metropolitan district','Pueblo West water utility, parks and district board decisions and agendas','https://www.pueblowestmetro.us/','District'],
['Pueblo Department of Public Health and Environment','Public health agency','Pueblo County health programs, environmental health and public-health information','https://county.pueblo.org/public-health/pueblo-department-public-health-and-environment','Health'],
['City of Pueblo Finance Department','Municipal finance','City annual budgets, sales-tax data, economic-development reports and financial transparency portal','https://www.pueblo.us/92/Finance','Finance'],
['City of Pueblo City Council','Legislative municipal body','Meeting agendas, adopted ordinances, minutes and council votes','https://www.pueblo.us/list.aspx','City'],
['Colorado Department of Transportation','State agency','State highway planning, capital projects and transport data affecting the region','https://www.codot.gov/','State'],
['Colorado General Assembly','State legislative body','Colorado statutes, introduced bills, fiscal notes and official legislative proceedings','https://leg.colorado.gov/','State']
];
const node=(tag,text,cls)=>{let n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);if(cls)n.className=cls;return n};
const link=(label,url,external=false)=>{let a=node('a',label);a.href=url;if(external){a.target='_blank';a.rel='noopener noreferrer'}return a};
const safeURL=u=>{try{const x=new URL(u);return x.protocol==='https:'?x.href:null}catch{return null}};
let graph=[];
const curatedRows=curated.map(([name,kind,description,url,group])=>({name,kind,description,url,group,issues:[],curated:true}));
function norm(v){return String(v??'').toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu,' ').trim()}
function render(){let q=norm($('entity-query').value),rows=[...curatedRows,...graph], seen=new Set();rows=rows.filter(x=>{const k=norm(x.name);if(seen.has(k))return false;seen.add(k);return true});
 const matches=rows.filter(r=>!q||q.split(' ').every(term=>norm([r.name,r.kind,r.description,r.group,...r.issues.map(x=>x.role)].join(' ')).includes(term)));const box=$('entities-results');box.replaceChildren();$('entity-count').textContent=matches.length+' matching organizations or stakeholder labels. Check the original records to confirm their responsibilities.';
 for(const r of matches){let a=node('article',undefined,'qp-entity-card');a.append(node('small',r.kind),node('h2',r.name),node('p',r.description));const u=safeURL(r.url);if(u)a.append(link(r.curated?'Open official source':'Open associated source',u,true));
 if(r.issues.length){let d=node('details');d.append(node('summary','Related issues ('+r.issues.length+')'));let l=node('ul');for(const i of r.issues){let li=node('li');li.append(link(i.title,'connections.html?issue='+encodeURIComponent(i.id)),node('p',i.role));l.append(li)}d.append(l);a.append(d)}
 let p=node('p');p.append(link('Explore this organization in Q','qify.html#q='+encodeURIComponent(r.name)));a.append(p);box.append(a)}
 if(!matches.length)box.append(node('p','No matching labels. Try a shorter organization or role name, or browse the issue network.'));
}
function hash(){try{if(location.hash.startsWith('#find='))$('entity-query').value=decodeURIComponent(location.hash.slice(6)).slice(0,240)}catch{}}
$('entity-query').addEventListener('input',render);window.addEventListener('hashchange',()=>{hash();render()});hash();render();
fetch('data/qp-three-hop-2026-11-13.json',{credentials:'same-origin'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(d=>{
 const by=new Map();for(const i of d.issues)for(const e of i.edges||[]){if(!by.has(e.entity_id))by.set(e.entity_id,[]);by.get(e.entity_id).push({id:i.id,title:i.title,role:e.role+' · '+e.state})}
 graph=d.entities.map(x=>({name:x.name,kind:x.kind,description:x.identity_state,url:x.source_url,group:'Recorded stakeholder label',issues:by.get(x.id)||[],curated:false}));
 // Where the exact normalized name is in curated directory, merge issue links rather than losing that context.
 for(const c of curatedRows){const same=graph.find(x=>norm(x.name)===norm(c.name));if(same)c.issues=same.issues}
 render();
}).catch(()=>{render();$('entity-count').textContent+=' Additional connections could not load; the official source directory remains available.'});
})();
