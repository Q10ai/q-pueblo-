'use strict';
(function(root){
 const safeLocal=u=>typeof u==='string'&&/^[a-z0-9_/-]+\.html(?:#[a-z0-9_-]+)?$/i.test(u)&&!u.includes('..')&&!u.startsWith('/');
 const clean=items=>[...new Set((items||[]).filter(x=>typeof x==='string'&&x.trim()))];
 const links=items=>{const seen=new Set();return (items||[]).filter(x=>safeLocal(x.route)&&x.title&&!seen.has(x.route)&&seen.add(x.route));};
 const normalize=s=>String(s??'').toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const relatedLiving=(q,rows)=>{const tokens=normalize(q).split(' ').filter(t=>t.length>2&&!['pueblo','what','where','which','about','does','the','and','how','can','for','when','with','are'].includes(t));return rows.map(r=>({r,n:tokens.filter(w=>(' '+normalize(r.title+' '+r.keywords)+' ').includes(' '+w+' ')).length})).filter(x=>x.n>=Math.min(2,Math.max(1,tokens.length))).sort((a,b)=>b.n-a.n).slice(0,6).map(x=>({title:x.r.title,route:x.r.route,context:'Related living research; not an exact answer'}));};
 // The analytical lenses are available internally, never a public section quota.
 function substantive(rows,already=[]){
  const seen=new Set(already.map(normalize));
  return rows.filter(x=>{const t=normalize(x.text??x.answer),state=normalize(x.state??x.classification);
   if(!t||seen.has(t)||/^(not assessed|not established|not yet established|unknown|unassessed|no evidence|unanswered)( |$)/.test(state))return false;
   if(/^(not yet established by the available evidence|this point has not been established by the reviewed records)$/.test(t))return false;
   seen.add(t);return true;
  });
 }
 function pruneCoverage(root){
  for(const row of root.querySelectorAll('.qp40-row')){
   if(row.querySelector('.qp-coverage-note')?.textContent.trim()==='Not yet established')row.remove();
  }
  for(const group of root.querySelectorAll('.qp40-group,.qp40-additional')){
   if(!group.querySelector('.qp40-row'))group.remove();
  }
 }
 function project({question='',report=null,story=null,related=[],prior=[],coverage=[]}={}){
  const known=!!(report||story),r=report||{},s=story||{},t=r.qification?.temporal||{};
  const findings=clean(report?[r.summary,...(r.whatKnown||[]),r.qification?.assessment]:story?[s.summary,...(s.chapters||[]).filter(c=>['fact','finding','evidence'].includes(c.kind)).map(c=>c.text)]:[]);
  const historical=clean(report?[t.past]:story?(s.chapters||[]).filter(c=>/histor|timeline|past|background|develop|earlier|origins/i.test(c.heading)).map(c=>c.text):[]);
  const lessonLinks=links(prior);
  const rawQuilt=report?coverage.map(x=>({title:x.title,text:x.answer,state:x.classification,group:x.group})):story?(s.coverage40?.length?s.coverage40.map(x=>({title:x.title,text:x.answer,state:x.classification,group:'Research perspectives'})):s.chapters.map(c=>({title:c.heading,text:c.text,state:c.kind,group:'Story sections'}))):[];
  const quilt=substantive(rawQuilt,[...findings,...historical]);
  return {schema:'qp-reader-quilt-v1',question,evidenceState:known?'DATED_PREPARED_FINDINGS':'NO_EXACT_PREPARED_ANSWER',answer:findings[0]||'No prepared, source-supported answer matches this exact question.',findings,legacyLearning:{historical,prior:lessonLinks,scope:'Dated findings and linked prior work in the available collection. The wider Legacy Learning archive is not certified reconciled.'},quilt,related:links(related),unknowns:clean(report?[r.counter,...(r.unknowns||[])]:story?s.unknowns:[]),twin:'twin.html',learn:'learn-pueblo.html'};
 }
 const node=(tag,text)=>{const e=document.createElement(tag);if(text!=null)e.textContent=String(text);return e;};
 const para=(p,t)=>{if(t)p.append(node('p',t));};
 const anchor=(p,label,route)=>{if(!safeLocal(route)&&!/^#[a-z0-9_-]+$/i.test(route||''))return;const x=node('a',label);x.href=route;p.append(x);};
 const linkList=(p,arr)=>{for(const x of arr){const li=node('p');anchor(li,x.title,x.route);if(x.context)li.append(document.createTextNode(' — '+x.context));p.append(li);}};
 function view(data,{includeFindings=true,includeQuilt=true}={}){
  const out=node('section');out.className='qp-story';out.dataset.qpReaderQuilt='true';
  if(includeFindings){out.append(node('h3','Findings'));if(data.findings.length)for(const f of data.findings)para(out,f);else para(out,data.answer);}
  const ll=node('details');ll.append(node('summary','Legacy Learning (LL) — earlier evidence and findings'));for(const h of data.legacyLearning.historical)para(ll,h);linkList(ll,data.legacyLearning.prior);if(!data.legacyLearning.historical.length&&!data.legacyLearning.prior.length)para(ll,'No earlier case-specific findings are established in this linked collection.');para(ll,data.legacyLearning.scope);out.append(ll);
  if(includeQuilt&&data.quilt.length){const quilt=node('details');quilt.append(node('summary','Quilted research sections — evidence and connections'));if(data.quilt.length){let last='';for(const x of data.quilt){if(x.group&&x.group!==last){quilt.append(node('h4',x.group));last=x.group;}const d=node('details');d.append(node('summary',x.title));para(d,x.text);if(x.state)para(d,x.state);quilt.append(d);}}else para(quilt,'No case-specific analytical findings are available for this exact question. Related research below does not establish an answer.');out.append(quilt);}
  if(data.related.length){const d=node('details');d.append(node('summary','Connected research and earlier editions'));linkList(d,data.related);out.append(d);}
  const p=node('p');anchor(p,'Twin Pueblo — relationships and scenarios',data.twin);p.append(document.createTextNode(' · '));anchor(p,'Learn Pueblo',data.learn);out.append(p);return out;
 }
 function markdown(p){return '\n\n## Legacy Learning (LL)\n'+(p.legacyLearning.historical.join('\n\n')||'No earlier case-specific finding established in the linked collection.')+'\n'+p.legacyLearning.prior.map(x=>x.title+' — '+x.route).join('\n')+'\n'+p.legacyLearning.scope+'\n\n## Connected quilted sections\n'+(p.quilt.map(x=>x.title+' — '+x.text+(x.state?' ['+x.state+']':'')).join('\n')||'No case-specific findings established.')+'\n\n## Related research (not proof of an exact answer)\n'+p.related.map(x=>x.title+' — '+x.route).join('\n')+'\n\nTwin: '+p.twin+' · Learning: '+p.learn;}
 const companionGroups=[["report-budget-2026.html","report-county-budget-2027.html","county-fiscal-recovery-2026-11-19.html","nov18-county-fiscal-recovery.html","year-end-01-county-financial-crisis.html","year-end-06-city-budget.html"],["report-csac-2027.html","nonprofit-funding-continuity.html","county-fiscal-recovery-2026-11-19.html"],["report-half-cent-2026.html","report-lime-road-costs.html","research/economic-development-20261119.html","nov18-tif-accountability.html","pueblo-west-tract-367.html"],["report-pueblo-boulevard-agenda.html","pueblo-boulevard-pura-repayment.html","nov18-tif-accountability.html","nov18-north-elizabeth-renewal.html"],["report-aspen-recovery.html","report-aspen-recovery-costs.html","resilience-aspen-five-year.html","resilience-burn-scar-mitigation.html","pueblo-mountain-park-recovery.html","resilience-regional-shock.html"],["report-pueblo-flood-history.html","resilience-spill-infrastructure.html","report-wastewater-2026.html","resilience-wastewater-health.html"],["report-water-budget-evidence.html","resilience-water-drought-budget.html","resilience-water-users-industry.html"],["municipal-jail-community-safety.html","nov18-municipal-enforcement.html","nov18-jail-lifecycle.html","year-end-03-new-jail.html","year-end-04-municipal-offenses.html","nov18-sheriff-workforce.html","year-end-02-sheriff-staffing.html"],["nov18-school-safety.html","year-end-05-sheriff-transition.html"],["energy-research-paper-2026.html","energy-governance-supplement-2026.html","report-black-hills-rate-case-2026.html"],["museums-culture.html","museums-culture-research.html","culture-learning.html"],["pueblo-ai-readiness.html","year-end-07-ai-governance.html","year-end-08-leap-2027.html","regional-transition-and-leap.html"],["report-housing-pipeline.html","report-permits-jurisdiction.html","report-food-assistance.html"],["public-information-transparency.html","report-records-request.html","civic-observatory.html","community-input-to-action.html","community-signals-2026-11-18.html","council-attorney-funding.html","civic-finance-observatory.html"],["report-county-priorities-2026.html","report-city-mill-levy-2026.html","report-budget-2026.html"],["be-ready-pueblo.html","resilience-regional-shock.html"],["pueblo-air-service-2027.html","research/economic-development-20261119.html"],["report-d60-preschool-2026.html","nov18-school-safety.html","learn-pueblo.html"]];
 const titles={"report-budget-2026.html":"City adopted 2026 budget","report-county-budget-2027.html":"County proposed 2027 budget","report-csac-2027.html":"2027 community service requests","report-half-cent-2026.html":"Half-Cent economic development commitments","report-lime-road-costs.html":"Lime Road commitments","report-pueblo-boulevard-agenda.html":"Pueblo Boulevard October agenda","report-aspen-recovery.html":"Aspen Acres assistance and declaration","report-aspen-recovery-costs.html":"Aspen Acres recovery costs","report-pueblo-flood-history.html":"1921 flood history","report-wastewater-2026.html":"Arkansas River discharge","report-water-budget-evidence.html":"Water budget and household bills","report-housing-pipeline.html":"Housing permit-to-occupancy pipeline","report-permits-jurisdiction.html":"Permitting jurisdiction","report-food-assistance.html":"Food assistance","report-records-request.html":"Public records","report-county-priorities-2026.html":"County priorities dashboard","report-city-mill-levy-2026.html":"City mill levy","report-d60-preschool-2026.html":"District 60 preschool","culture-learning.html":"Cultural Legacy Learning and teaching","museums-culture.html":"Museum and culture story","museums-culture-research.html":"Cultural research paper"};
 function priorFor(route){return links(companionGroups.filter(a=>a.includes(route)).flat().filter(r=>r!==route).map(r=>({route:r,title:titles[r]||r.split('/').pop().replace(/\.html$/,'').replace(/-/g,' '),context:'Linked prior or companion edition; compare its date and scope'})));}

 // Progressive enhancement of existing report pages: same evidence, not a second research report.
 async function mountSubject(route,base){
  const main=document.querySelector('main');if(!main||main.querySelector('[data-qp-reader-quilt]'))return;
  const canonical=route.match(/^report-([a-z0-9-]+)\.html$/);
  let report=null;
  if(canonical){try{const response=await fetch(new URL('data/qp-current-reports.json',base),{credentials:'same-origin'});if(response.ok)report=(await response.json()).reports.find(r=>r.slug===canonical[1])||null;}catch{}}
  const projection=project({report,prior:priorFor(route)});
  const block=view(projection,{includeFindings:false,includeQuilt:false});
  pruneCoverage(main);
  // Use the existing story and sections in place; do not generate a second table of contents.
  if(main.querySelector('#coverage-40 .qp40-row')){const p=node('p');anchor(p,'Detailed findings and analysis','#coverage-40');block.append(p);}
  const prior=block.querySelector('details');if(prior&&route==='museums-culture-research.html'){const p=node('p');anchor(p,'Cultural Legacy Learning case history','culture-learning.html#legacy-learning');prior.append(p);}
  for(const link of block.querySelectorAll('a[href]')){const href=link.getAttribute('href');if(safeLocal(href))link.href=new URL(href,base).href;}
  const finding=main.querySelector('.qp-story-takeaway,#story-first,.qp-story-lead,.qp-answer-intro');
  if(finding){const section=finding.closest('section')||finding;section.after(block);}else{const first=main.querySelector('h1');const p=first?.nextElementSibling;if(p?.tagName==='P')p.after(block);else if(first)first.after(block);else main.append(block);}
 }
 const api={project,view,markdown,relatedLiving,safeLocal,priorFor,mountSubject,substantive,pruneCoverage};
if(root){root.QPReaderQuilt=api;const script=typeof document!=='undefined'?document.currentScript:null;if(script?.dataset.qpSubject)mountSubject(script.dataset.qpSubject,new URL('.',script.src)).catch(()=>{});}if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:null);
