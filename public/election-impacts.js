'use strict';
(async()=>{
 const byId=id=>document.getElementById(id);
 const text=(tag,value,className)=>{const e=document.createElement(tag);e.textContent=String(value);if(className)e.className=className;return e;};
 const values=arr=>Array.isArray(arr)?arr:[];
 try{
  const response=await fetch('data/qp-2026-election-impacts.json',{cache:'no-cache'});
  if(!response.ok)throw new Error('Public register is unavailable');
  const d=await response.json();
  if(d.schema!=='qp-election-impact-registry-v1'||d.status!=='UNOFFICIAL_PENDING_CANVASS'||!Array.isArray(d.records))throw new Error('Register status needs human review');
  byId('status').textContent='UNOFFICIAL — Pueblo County Nov. 5, 2026 count · Reviewed Nov. 11 · Next expected update Nov. 13. No result here establishes certification or transfer of office.';
  byId('official').href=d.source_status_url;
  byId('nrecords').textContent=d.records.length;
  byId('nentities').textContent=d.entities.length;
  byId('ndomains').textContent=d.impact_domains.length;
  const names=Object.fromEntries(d.entities.map(e=>[e.id,e.name]));
  const sel=byId('entity');
  for(const e of d.entities.sort((a,b)=>a.name.localeCompare(b.name))){const o=document.createElement('option');o.value=e.id;o.textContent=e.name;sel.append(o);}
  const render=()=>{
   const q=byId('find').value.trim().toLocaleLowerCase();const kind=byId('kind').value;const entity=sel.value;
   const matches=d.records.filter(r=>(kind==='all'||r.record_type===kind)&&(entity==='all'||r.linked_entities.includes(entity))&&([r.title,r.count_leader,r.impact_note,values(r.candidates).map(x=>x.name).join(' '),r.impact_domains.join(' '),r.linked_entities.map(x=>names[x]||x).join(' ')].join(' ').toLocaleLowerCase().includes(q)));
   byId('count').textContent=`${matches.length} of ${d.records.length} dated entries`;
   const host=byId('results');host.replaceChildren();
   for(const r of matches){
    const card=document.createElement('article');card.className='entry';
    card.append(text('span',r.record_type==='office_election'?'OFFICE COUNT':'BALLOT / RETENTION COUNT','chip'));
    card.append(text('h3',r.title));
    card.append(text('p','Reported geography: '+r.ballot_geography.replaceAll('_',' '),'sub'));
    card.append(text('p','Count leader: '+r.count_leader+(r.count_margin===null?' (unopposed ballot listing)':` · lead ${r.count_margin.toLocaleString()} votes`),'votes'));
    if(r.record_type==='office_election')card.append(text('p',r.candidates.map(x=>`${x.name} (${x.affiliation}): ${x.votes.toLocaleString()}`).join(' · '),'names'));
    else card.append(text('p',`Yes / For: ${r.yes.toLocaleString()} · No / Against: ${r.no.toLocaleString()}`,'names'));
    card.append(text('p',r.impact_note||'Potential impacts require authoritative post-election action records.','note'));
    card.append(text('p','Institutions: '+r.linked_entities.map(x=>names[x]||x).join(' · '),'names'));
    card.append(text('p','Impact areas: '+r.impact_domains.join(' · '),'names'));
    card.append(text('p','STATUS: Unofficial count only · no office or policy change established','hint'));
    const a=document.createElement('a');a.href=d.source_url+'#page='+r.source_page;a.textContent='Official county report · page '+r.source_page;a.rel='noopener noreferrer';a.target='_blank';card.append(a);
    host.append(card);
   }
  };
  for(const id of ['find','kind','entity'])byId(id).addEventListener(id==='find'?'input':'change',render);
  render();
 }catch(err){byId('status').textContent='The evidence register is currently unavailable or requires review; please use the official county source link. Do not rely on any stale claims.';byId('results').replaceChildren();}
})();
