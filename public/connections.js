'use strict';
/* Public static graph exploration. No telemetry, cookies, identity inference or remote data calls. */
(async()=>{
const select=document.getElementById('qp-network-issue');
const mode=document.getElementById('qp-network-filter');
const result=document.getElementById('qp-network-results');
const status=document.getElementById('qp-network-state');
if(!select||!mode||!result||!status)return;
const base='data/qp-three-hop-2026-11-13.json';
const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=String(text);if(cls)e.className=cls;return e};
const link=(label,url)=>{const a=node('a',label);a.href=url;if(/^https:/.test(url)){a.rel='noopener noreferrer';a.target='_blank'}return a};
try{
 const response=await fetch(base,{credentials:'same-origin',cache:'default'});
 if(!response.ok)throw Error('Snapshot not available, HTTP '+response.status);
 const d=await response.json();
 const issues=new Map(d.issues.map(i=>[i.id,i])),entities=new Map(d.entities.map(e=>[e.id,e])),byEntity=new Map(d.entities.map(e=>[e.id,new Set()]));
 for(const issue of d.issues)for(const edge of issue.edges){const s=byEntity.get(edge.entity_id);if(s)s.add(issue.id)}
 const hubs=new Set([...byEntity].filter(([id,ids])=>ids.size>25||entities.get(id)?.identity_state.startsWith('Unresolved group')).map(([id])=>id));
 select.replaceChildren(node('option','Choose one of '+d.coverage.issues+' public issue records'));
 select.firstChild.value='';
 for(const i of d.issues.slice().sort((a,b)=>a.title.localeCompare(b.title))){const option=node('option',i.title+' ['+i.id+']');option.value=i.id;select.append(option)}
 const getHash=()=>{const m=window.location.hash.match(/^#issue=(.+)$/);return m?decodeURIComponent(m[1]):null};
 function section(title,subtitle,rows,format){
  const s=node('section');s.append(node('h3',title),node('p',subtitle));
  if(!rows.length){s.append(node('p','No source-associated records for this step. An evidence gap is not proof of absence.'));return s}
  const details=node('details'),sum=node('summary',rows.length+' paths · open complete list');details.append(sum);
  const ul=node('ul');for(const x of rows){const li=node('li');format(li,x);ul.append(li)}details.append(ul);s.append(details);return s;
 }
 function render(){
  const id=select.value;result.replaceChildren();
  if(!issues.has(id)){status.textContent='Select an issue to see the three-hop association path.';result.append(node('p','You can also browse the 174 historical records in the separate standalone Q-Pueblo issue index.'));return}
  const i=issues.get(id);
  const direct=i.edges.map(x=>({...x,entity:entities.get(x.entity_id),broad:hubs.has(x.entity_id)})).filter(x=>x.entity);
  const directIds=new Set(direct.map(e=>e.entity_id));
  const shared=new Map();
  for(const d1 of direct){for(const iid of byEntity.get(d1.entity_id)||[]){if(iid===id)continue;let r=shared.get(iid);if(!r){r={record:issues.get(iid),via:[]};shared.set(iid,r)}r.via.push(d1)}}
  const peer=[...shared.values()].map(x=>({...x,specific:x.via.some(v=>!v.broad)}));
  const third=new Map();
  for(const p of peer){for(const e2 of p.record.edges){if(directIds.has(e2.entity_id))continue;let x=third.get(e2.entity_id);if(!x){x={entity:entities.get(e2.entity_id),via:new Set(),specific:false};third.set(e2.entity_id,x)}x.via.add(p.record.id);x.specific ||= p.specific}}
  const broad=mode.value==='all';
  const activePeers=peer.filter(x=>broad||x.specific).sort((a,b)=>a.record.title.localeCompare(b.record.title));
  const activeThird=[...third.values()].filter(x=>x.entity&&(broad||x.specific)).sort((a,b)=>a.entity.name.localeCompare(b.entity.name));
  result.append(node('h2',i.title));
  result.append(node('p','Source classification: '+i.kind+' · '+i.state+' · Date: '+(i.source_date||'not confirmed')));
  result.append(node('p','Questions to resolve: '+(i.needed||'Source date, authority and material role require rechecking.')));
  status.textContent=direct.length+' direct labels; '+peer.length+' two-hop issue associations ('+activePeers.length+' displayed); '+third.size+' third-hop entity labels ('+activeThird.length+' displayed). Common institutional hubs are context, not authority.';
  if(i.source_url){result.append(link('Original source lead ↗',i.source_url))}
  result.append(section('1 · Direct entity labels','A recorded name or role is not evidence of funding, control, culpability or an executed agreement.',direct,(li,x)=>{
    li.append(node('strong',x.entity.name+' · '));
    li.append(node('span',x.entity.identity_state+(x.broad?' · LOW SPECIFICITY GROUP/HUB':'')));
    li.append(node('p',x.role+' · '+x.state));
  }));
  result.append(section('2 · Other issues sharing a label','Specific paths first; the broad government/group option may connect otherwise unrelated topics.',activePeers,(li,x)=>{
    li.append(link(x.record.title,'https://q10asi.com/projects/q-pueblo/issues/'+encodeURIComponent(x.record.id)+'/'));
    li.append(node('p','Via: '+x.via.map(e=>e.entity.name+(e.broad?' [hub]':'')).join('; ')));
  }));
  result.append(section('3 · Additional entities appearing on those issues','These are discovery candidates only, not a causal supply-chain or responsibility map.',activeThird,(li,x)=>{
    li.append(node('strong',x.entity.name));
    li.append(node('p',x.entity.identity_state+' · Found via '+x.via.size+' related issue(s)'));
  }));
  const footer=node('p','Next: obtain actual governing instrument, contract, funding ledger, permits, operator records and dated before/after impacts to establish directed roles.');
  result.append(footer);
 }
 select.addEventListener('change',()=>{if(select.value)window.location.hash='issue='+encodeURIComponent(select.value);render()});
 mode.addEventListener('change',render);
 window.addEventListener('hashchange',()=>{const id=getHash();if(id&&issues.has(id)){select.value=id;render()}});
 const fromURL=getHash();if(fromURL&&issues.has(fromURL)){select.value=fromURL;render()}else{status.textContent='Public-safe source graph loaded: '+d.coverage.issues+' issues, '+d.coverage.entity_labels+' labels. Choose an issue to trace.'}
}catch(err){status.textContent='This local graph cannot be loaded at the moment.';result.replaceChildren(node('p','The regular issue and institution directories still work.'));result.append(link('Open the underlying Q10ASI public issue index','https://q10asi.com/projects/q-pueblo/issues/'))}
})();
