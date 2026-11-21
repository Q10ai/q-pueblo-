'use strict';
// Public KOS entry: source-connection discovery works without an AI provider.
// Paper generation is guarded by the server's capability response and a user action.
// Untrusted text is only ever inserted via textContent.
(()=>{
 const by=id=>document.getElementById(id);
 const root=by('kos-subject-entry');
 if(!root)return;
 const nav=new URLSearchParams(location.search);
 const familyId=nav.get('family'), rawTopic=nav.get('topic');
 const ideaForm=by('kos-idea-form'),paperForm=by('kos-paper-form');
 let requestData=null;
 const text=(id,s)=>{const n=by(id);if(n)n.textContent=String(s||'');};
 const link=(parent,label,href,external=false)=>{
   try{
     const url=new URL(href,location.origin);
     if(external?(url.protocol!=='https:'||!url.hostname.includes('.')||url.username||url.password):
       (url.origin!==location.origin||url.protocol!==location.protocol))return;
     const li=document.createElement('li'),a=document.createElement('a');
     a.textContent=label;a.href=url.href;
     if(external){a.rel='noopener noreferrer';a.target='_blank';}
     li.append(a);parent.append(li);
   }catch{/* do not render untrusted link */}
 };
 const safeLocal=href=>/^(?:[a-z0-9-]+\/)*[a-z0-9-]+\.html(?:#[a-z0-9-]+)?$/i.test(href);
 function clear(){for(const id of ['kos-source-links','kos-research-links','kos-archival-links','kos-paper-sections','kos-paper-sources','kos-impact-events'])by(id).replaceChildren();
  for(const id of ['kos-connected-sources','kos-connected-research','kos-archival-leads','kos-verified-story','kos-paper-output','kos-on-demand','kos-impact-lens'])by(id).hidden=true;
  text('kos-paper-status','');}
 function renderConnections(c){
  const sources=by('kos-source-links');
  for(const lead of (c.sourceCandidates||[]).slice(0,25)){
    const meta=lead.checkedAt?' · catalogue date '+lead.checkedAt:'';
    link(sources,lead.title+' — '+lead.kind.replaceAll('-',' ')+meta,lead.url,true);
  }
  by('kos-connected-sources').hidden=sources.children.length===0;
  const research=by('kos-research-links');
  for(const r of (c.canonical||[]).slice(0,8))if(safeLocal(r.route))link(research,r.title+' (dated Q Pueblo research)',r.route);
  for(const r of (c.research||[]).slice(0,10))if(safeLocal(r.route))link(research,r.title+' (related study)',r.route);
  for(const r of (c.siteRoutes||[]).slice(0,10))if(safeLocal(r.route))link(research,r.title+' (related site material)',r.route);
  for(const r of (c.historicalIssues||[]).slice(0,8))if(/^[a-z0-9-]+$/i.test(r.id))link(research,r.title+' (historical record, recheck required)','issues.html#'+encodeURIComponent(r.id));
  for(const r of (c.connectedIssues||[]).slice(0,10))if(/^[a-z0-9-]+$/.test(r.id))link(research,r.title+' (historical issue lead)','connections.html?issue='+encodeURIComponent(r.id));
  for(const r of (c.connectedEntities||[]).slice(0,8))if(/^[a-z0-9-]+$/.test(r.id))link(research,r.name+' (entity label; identity must be checked)','governance-entities.html?entity='+encodeURIComponent(r.id));
  by('kos-connected-research').hidden=research.children.length===0;
  const examples=by('kos-impact-events'),lens=c.impactLens;
  if(lens?.status==='PLANNING_SCENARIO'){
    for(const event of (lens.relevantDisruptions||[]).slice(0,5)){
      const li=document.createElement('li');
      const strong=document.createElement('strong');strong.textContent=String(event.title||'');
      li.append(strong,document.createTextNode(' — '+String(event.mechanism||'')));
      examples.append(li);
    }
  }
  by('kos-impact-lens').hidden=examples.children.length===0;
 }
 function renderPaper(result){
  const p=result.paper;if(!p)return;
  by('kos-paper-output').hidden=false;
  text('kos-paper-title',p.title);
  text('kos-paper-date','Prepared for this request · reported source-check date '+p.asOf+' · Provisional; not independently approved for publication');
  const body=by('kos-paper-sections'),list=by('kos-paper-sources');
  const sourceIndex=new Map((p.sources||[]).map((s,i)=>[s.id,i+1]));
  for(const section of p.sections||[]){
    const h=document.createElement('h4');h.textContent=section.heading;body.append(h);
    for(const para of section.paragraphs||[]){
      const el=document.createElement('p');el.append(document.createTextNode(para.text));
      if(para.sourceIds?.length){
        el.append(document.createTextNode(' '));
        for(const id of para.sourceIds){
          const no=sourceIndex.get(id);if(!no)continue;
          const a=document.createElement('a');a.href='#kos-citation-'+no;a.textContent='['+no+']';el.append(a);
          el.append(document.createTextNode(' '));
        }
      }
      body.append(el);
    }
  }
  for(const [i,source] of (p.sources||[]).entries()){
    const li=document.createElement('li');li.id='kos-citation-'+(i+1);
    const a=document.createElement('a');
    try{const url=new URL(source.url);if(url.protocol==='https:'&&url.hostname.includes('.')&&!url.username&&!url.password){a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';}}
    catch{}
    a.textContent=source.title;
    li.append(a,document.createTextNode(' · Service-reported source check '+source.checkedAt));
    list.append(li);
  }
  by('kos-paper-output').scrollIntoView({block:'start',behavior:'auto'});
 }
 async function capabilities(){
  try{const r=await fetch('/api/kos/paper',{credentials:'same-origin',cache:'no-store'});if(!r.ok)return false;
   const d=await r.json();return d.onDemandGeneration===true&&d.publicPublishing===false;
  }catch{return false;}
 }
 async function load(){
  clear();root.hidden=true;
  let data=null,family=null,topic=null,idea=null;
  const fragment=new URLSearchParams(location.hash.slice(1));
  if(!familyId)idea=fragment.get('idea')?.trim()||null;
  if(!familyId&&!idea)return;
  try {
   if(familyId){
    const v=await fetch('data/qp-subject-families-2026-11-21.json',{cache:'no-store',credentials:'same-origin'});
    if(!v.ok)throw new Error('Subject registry unavailable');
    data=await v.json();family=(data.families||[]).find(f=>f.id===familyId);
    if(!family)throw new Error('Subject not found');
    if(rawTopic!==null){
      if(!/^\d{1,2}$/.test(rawTopic)||Number(rawTopic)>=family.topics.length)throw new Error('Subtopic not found');
      topic=Number(rawTopic);
    }
   }else if(idea.length<3||idea.length>240)throw new Error('Subject must be between 3 and 240 characters');
   const title=family?(topic===null?family.title:family.topics[topic]):idea;
   text('kos-selected-title',title);
   text('kos-selected-description','KOS follows the connections behind this subject: its history, people, institutions, money, impacts and possible options. Original sources must support the conclusions of any full paper.');
   requestData=family?{family:familyId,topic}:{idea};
   const query=new URLSearchParams(family?{family:familyId}:{idea});
   if(topic!==null)query.set('topic',String(topic));
   let connected=false;
   try{
     const r=await fetch('/api/kos/links?'+query.toString(),{credentials:'same-origin',cache:'no-store'});
     if(!r.ok)throw Error('No read-only crosswalk');
     renderConnections(await r.json());connected=true;
   }catch{/* preserve static editorial routes; do not imply source verification */}
   const archive=by('kos-archival-links');
   for(const href of family?.links||[]){
     if(!safeLocal(href)||href==='kos-story-pueblo-flood-1921.html')continue;
     link(archive,href.replace(/^.*\//,'').replace(/\.html(?:#.*)?$/,'').replaceAll('-',' '),href);
   }
   by('kos-archival-leads').hidden=archive.children.length===0;
   text('kos-entry-limit',connected?
    'The connections above are research leads, not claims that every source has been verified for this question. Live paper generation is a separate governed capability.' :
    'Only previously indexed reading is available here; the full KOS connection service is not accessible. This page cannot claim to have prepared a new paper.');
   const enabled=await capabilities();
   if(enabled)by('kos-on-demand').hidden=false;
   if(!enabled)text('kos-entry-limit',(by('kos-entry-limit').textContent+' The live on-demand research service is not enabled on this site.'));
  }catch(e){
   requestData=null;text('kos-selected-title','Subject could not be opened');
   text('kos-selected-description',e.message);
   text('kos-entry-limit','Return to Explore for a valid subject.');
  }
  root.hidden=false;
  if(idea)root.scrollIntoView({block:'start',behavior:'auto'});
 }
 ideaForm?.addEventListener('submit',e=>{
   e.preventDefault();
   const v=by('kos-idea').value.trim();
   if(v.length<3||v.length>240)return;
   text('kos-idea-status','');
   location.hash='idea='+encodeURIComponent(v);
   load();
 });
 paperForm?.addEventListener('submit',async e=>{
   e.preventDefault();
   if(!requestData||!by('kos-share-consent').checked)return;
   const b=paperForm.querySelector('button[type="submit"]');b.disabled=true;
   text('kos-paper-status','Checking connected original sources and preparing the paper. No public publication will be made.');
   by('kos-paper-output').hidden=true;
   try{
    const r=await fetch('/api/kos/paper',{method:'POST',headers:{'Content-Type':'application/json'},
      credentials:'same-origin',body:JSON.stringify({...requestData,privacyConsent:true})});
    const v=await r.json();
    if(!r.ok)throw Error(v.error||'A source-supported paper was not returned');
    text('kos-paper-status','Provisional contextual paper prepared from the configured research service. Independent review is still required before public publication.');
    renderPaper(v);
   }catch(e){text('kos-paper-status',e.message||'Could not create a source-supported paper.');}
   finally{b.disabled=false;}
 });
 window.addEventListener('hashchange',()=>{if(!familyId)load();});
 load();
})();
