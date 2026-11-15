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
 let reportList=[];try{const rr=await fetch('data/qp-current-reports.json',{credentials:'same-origin'});if(rr.ok)reportList=(await rr.json()).reports||[];}catch{}
 const issues=new Map(d.issues.map(i=>[i.id,i])),entities=new Map(d.entities.map(e=>[e.id,e])),byEntity=new Map(d.entities.map(e=>[e.id,new Set()]));
 for(const issue of d.issues)for(const edge of issue.edges){const s=byEntity.get(edge.entity_id);if(s)s.add(issue.id)}
 const hubs=new Set([...byEntity].filter(([id,ids])=>ids.size>25||entities.get(id)?.identity_state.startsWith('Unresolved group')).map(([id])=>id));
 select.replaceChildren(node('option','Choose one of '+d.coverage.issues+' public issue records'));
 select.firstChild.value='';
 for(const i of d.issues.slice().sort((a,b)=>a.title.localeCompare(b.title))){const option=node('option',i.title);option.value=i.id;select.append(option)}
 const getHash=()=>{const m=window.location.hash.match(/^#issue=(.+)$/);if(m)return decodeURIComponent(m[1]);return new URLSearchParams(window.location.search).get('issue')};
 function section(title,subtitle,rows,format){
  const s=node('section');s.append(node('h3',title));if(subtitle)s.append(node('p',subtitle));
  if(!rows.length)return null;
  const details=node('details'),sum=node('summary',rows.length+' related records');details.append(sum);
  const ul=node('ul');for(const x of rows){const li=node('li');format(li,x);ul.append(li)}details.append(ul);s.append(details);return s;
 }
 function render(){
  const id=select.value;result.replaceChildren();
  if(!issues.has(id)){status.textContent='Select an issue to read its story and explore its connections.';result.append(node('p','You can also browse the local issue directory.'));return}
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
  const story=window.QPStoryEditions?.byId(i.id);if(story&&window.QPIssueStoryView)result.append(window.QPIssueStoryView.narrative(story));else {const linked=reportList.filter(r=>(r.issueIds||[]).some(x=>String(x).toUpperCase()===String(id).toUpperCase()));let shown=0;for(const report of linked){const article=window.QPInvestigativeStoryView?.render(window.QPInvestigativeStory?.project(report));if(article){result.append(node('p','Dated issue-linked account; scope may be narrower than the selected issue.'),article,link('Full supporting report','reports.html?report='+encodeURIComponent(report.slug)+'#qified-report'));shown++;}}if(!shown)result.append(node('p','The exact issue story has not yet been recovered into this edition. The relationships below are discovery leads, not an answer.'));}
  result.append(node('h3','Explore the connections'));
  const recordDate=i.source_date?'Source date: '+i.source_date+'. ':'';
  result.append(node('p',recordDate+'These names appear in the dated research index. Their appearance does not establish responsibility or control.'));
  status.textContent=direct.length?direct.length+' recorded names for this topic.':'No documented organization links for this topic yet.';
  if(i.source_url)result.append(link('Original source',i.source_url));
  const push=s=>{if(s)result.append(s)};
  push(section('Organizations named in the records','',direct,(li,x)=>{
    li.append(node('strong',x.entity.name));
    li.append(node('p',x.entity.identity_state.startsWith('Unresolved group')?'Grouped name; individual organization not identified.':'Named in the dated index.'));
    li.append(link('Explore organization','governance-entities.html#'+encodeURIComponent(x.entity_id)));
  }));
  push(section('Related issues — shared organizations','These are discovery leads, not answers about the selected issue.',activePeers,(li,x)=>{
    li.append(link(x.record.title,'connections.html?issue='+encodeURIComponent(x.record.id)));
    li.append(node('p','Shared names: '+x.via.map(e=>e.entity.name).join('; ')));
  }));
  push(section('Other named organizations','Indirect associations, not a finding of authority.',activeThird,(li,x)=>{
    li.append(link(x.entity.name,'governance-entities.html#'+encodeURIComponent(x.entity.id)));
  }));
  if(!direct.length)result.append(node('p','We do not yet have enough verified information to explain who is involved in this exact issue.'));
  result.append(link('Read the available research stories','reports.html'),node('p','For documented roles and relationships, use the entity index.'),link('Explore the entity index','governance-entities.html'));

 }
 select.addEventListener('change',()=>{if(select.value)window.location.hash='issue='+encodeURIComponent(select.value);render()});
 mode.addEventListener('change',render);
 window.addEventListener('hashchange',()=>{const id=getHash();if(id&&issues.has(id)){select.value=id;render()}});
 const fromURL=getHash();if(fromURL&&issues.has(fromURL)){select.value=fromURL;render()}else{status.textContent='Explore '+d.coverage.issues+' issues, '+d.coverage.entity_labels+' labels. Choose an issue to trace.'}
}catch(err){status.textContent='This local graph cannot be loaded at the moment.';result.replaceChildren(node('p','The regular issue and institution directories still work.'));result.append(link('Browse Pueblo topics','governance-topics.html'))}
})();
