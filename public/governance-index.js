'use strict';
(async()=>{
 const root=document.getElementById('governance-results');if(!root)return;
 const $=id=>document.getElementById(id),n=(tag,txt,cls)=>{const e=document.createElement(tag);if(txt!=null)e.textContent=txt;if(cls)e.className=cls;return e},a=(txt,url)=>{const e=n('a',txt);e.href=url;return e};
 const f=['data/q-pueblo-issue-index-2026-11-09.json','data/qp-three-hop-2026-11-13.json','data/qp-current-reports.json','data/qp-governance-index-input-v1.json'];
 try{
 const [l,g,r,c]=await Promise.all(f.map(p=>fetch(p,{credentials:'same-origin'}).then(x=>{if(!x.ok)throw Error('load');return x.json()})));
 const m=QPGovernance.build(l,g,r.reports,c),mode=root.dataset.mode,query=$('governance-query'),scope=$('governance-scope'),status=$('governance-status');
 const short=s=>String(s??'');const terms=()=>QPGovernance.norm(query.value).split(' ').filter(Boolean);
 const match=(...t)=>terms().every(x=>QPGovernance.norm(t.join(' ')).includes(x));
 const reportLink=r=>a('Read findings and 40-point report','reports.html?report='+encodeURIComponent(r.slug)+'#qified-report');
 const section=(title,items,render)=>{let d=n('details');d.append(n('summary',title+' ('+items.length+')'));if(!items.length)d.append(n('p','No documented path in the current curated records.'));else{let ul=n('ul');for(const item of items){let li=n('li');render(li,item);ul.append(li)}d.append(ul)}return d};
 function render(){
  root.replaceChildren();
  if(mode==='entities'){
   const matches=m.entities.filter(e=>match(e.name,e.kind,e.description,...e.issues.map(i=>i.title),...e.reports.map(r=>r.title)));
   status.textContent=matches.length+' matching institution, office, organization, asset or stakeholder names. Grouped labels are not verified legal entities.';
   for(const e of matches){const card=n('article',null,'qp-gov-card');card.id=e.id;card.append(n('small',e.kind),n('h2',e.name),n('p',e.description));if(QPGovernance.validUrl(e.url))card.append(a('Original or official source',e.url));for(const r of e.reports){card.append(n('p',r.summary),reportLink(r))}
    for(const [direction,label] of [['up','Upstream: authority, funding or service relationships'],['down','Downstream: departments, service or counterparty relationships']]){
     const paths=m.paths(e.id,direction,3);
     card.append(section(label,paths,(li,p)=>{li.append(n('strong','Level '+p.depth+' · '+p.name));for(const edge of p.path){li.append(n('p',edge.role+' — '+edge.boundary+' (checked '+edge.asOf+')'),reportLink(m.reportBySlug.get(edge.report)))}}));
    }
    card.append(section('Direct issue associations',e.issues,(li,i)=>{li.append(a(i.title,'connections.html?issue='+encodeURIComponent(i.id)),n('p',i.role+' · '+i.state))}));
    card.append(section('Indirect associations through shared issues (not authority)',m.associations(e.id),(li,x)=>{const link=a(x.name,'#'+encodeURIComponent(x.id));link.addEventListener('click',ev=>{ev.preventDefault();query.value=x.name;render();document.getElementById(x.id)?.scrollIntoView()});li.append(link,n('p',x.via.join('; ')))}));
    root.append(card)
   }
  }else{
   const all=scope.value==='all',current=scope.value==='recent';const selected=(all?m.allTopics:current?m.allTopics.filter(i=>i.reviewStatus==='DATED_UPDATE'||i.reviewStatus==='DATED_ANALYSIS'):m.featured).filter(i=>match(i.title,i.category,i.id,i.report?.summary,...i.updates.map(u=>u.title+' '+u.finding)));
   status.textContent=selected.length+' matching '+(all?'dated records':current?'topics with dated findings inside their review window':'discovery topics')+'. A review window is not proof that the underlying situation has not changed.';
   for(const i of selected){const card=n('article',null,'qp-gov-card');card.append(n('small',i.category),n('h2',i.title),n('p',i.reviewStatus==='DATED_UPDATE'?'New dated source update':i.reviewStatus==='DATED_ANALYSIS'?'Dated analysis — not live verification':i.reviewStatus==='RECHECK_DUE'?'Source review due — do not rely on it as current':'Historical research topic — current status unverified'));for(const u of i.updates){const d=n('details');d.open=m.dateReview(u)==='DATED_UPDATE';d.append(n('summary',u.title),n('p',u.finding),n('p',u.meaning),n('p',u.milestone),n('small','Checked '+u.checkedDate+' · '+(m.dateReview(u)==='DATED_UPDATE'?'Recheck by ':'Review due since ')+u.recheckDate));if(u.figures?.length){const more=n('details');more.append(n('summary','November 13 unofficial counts — selected contests and measures'));for(const f of u.figures)more.append(n('p',f.label+': '+f.value+' ('+f.locator+')'));d.append(more)}for(const s of u.sources){const p=n('p');p.append(a(s.title,s.url));d.append(p)}card.append(d)}for(const u of i.relatedUpdates){card.append(a('Related dated update: '+u.title,'now.html#'+encodeURIComponent(u.id)),n('small','Related information only; this topic has not been reverified.'))}if(i.report)card.append(n('p',i.report.summary),n('small','Related dated analysis; exact scope may differ.'),reportLink(i.report));else if(!i.updates.length)card.append(n('p','Current findings not yet established for this exact topic.'));card.append(a('Topic record and sources',i.href));root.append(card)}
  }
  if(!root.children.length)root.append(n('p','No matching records. Try another place, organization or topic.'));
 }
 const directId=decodeURIComponent(location.hash.slice(1));if(mode==='entities'&&directId){const ent=m.entities.find(x=>x.id===directId);if(ent)query.value=ent.name;}query.addEventListener('input',render);scope?.addEventListener('change',render);render();if(directId)document.getElementById(directId)?.scrollIntoView();
 }catch{root.replaceChildren(n('p','The indexes could not load. Use the existing issue directory and report library.'));$('governance-status').textContent='Index unavailable.'}
})();
