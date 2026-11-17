'use strict';
(() => {
 // Original raster remains a fallback; normal navigation uses the isolated emblem.
 // Keep the lightweight raster logo on initial load; do not replace it with a larger SVG.
 // The existing vector emblem remains available as a public artwork asset: assets/pueblo-emblem.svg.
 for(const link of document.querySelectorAll('.qp-v3-wordmark[href="index.html"], #qp-global-nav a[href="index.html"]'))link.setAttribute('href','/');

 const header=document.querySelector('.qp-v3-header');if(header&&!document.querySelector('.qp-op-notice')&&!document.querySelector('.qp-welcome-note')){const p=document.createElement('div');p.className='qp-op-notice';p.textContent=document.documentElement.lang==='es'?'Investigación independiente · No es un servicio gubernamental · ':'Independent research · Not a government service · ';const a=document.createElement('a');a.href='about.html';a.textContent=document.documentElement.lang==='es'?'Información y correcciones (inglés)':'About and corrections';p.append(a);header.after(p);}

 // Inventory numbers are derived from the current public records; review expiry never deletes history.
 const countNodes=[...document.querySelectorAll('[data-qp-count]')];
 const inventory=document.getElementById('qp-inventory-live');
 const freshnessNodes=[...document.querySelectorAll('[data-qp-review-due]')];
 const day=()=>{const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Denver',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day;};
 function refreshDates(){const today=day();for(const e of document.querySelectorAll('[data-qp-review-due]')){const due=e.dataset.qpReviewDue,checked=e.dataset.qpChecked;e.textContent=!due||!checked||checked>today?'Review date unverified':today>=due?'Source recheck due — retained as dated evidence':'Within scheduled review window — not a live verification';}}
 refreshDates();if(freshnessNodes.length)setInterval(refreshDates,60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshDates()});
 if(countNodes.length||inventory){const files=['q-pueblo-issue-index-2026-11-09.json','qp-three-hop-2026-11-13.json','qp-current-reports.json','qp-governance-index-input-v1.json'];Promise.all(files.map(f=>fetch('data/'+f,{cache:'no-cache',credentials:'same-origin'}).then(r=>{if(!r.ok)throw Error('Inventory unavailable');return r.json()}))).then(([legacy,graph,register,cfg])=>{
 const distinct=(a,key)=>new Set(a.map(x=>x[key]));
 const issues=legacy.issues,rs=register.reports,excluded=new Set(cfg.excludeFromFeatured),eligible=issues.filter(i=>!excluded.has(i.id));
 if(distinct(issues,'id').size!==issues.length||distinct(graph.issues,'id').size!==graph.issues.length||distinct(rs,'slug').size!==rs.length)throw Error('Duplicate inventory keys');
 const cats={};for(const i of issues)cats[i.category]=(cats[i.category]||0)+1;
 const mapped=issues.filter(i=>i.availableSourceUrls?.length).length;
 const compute=()=>{const today=day(),within=rs.filter(r=>typeof r.sourceChecked==='string'&&typeof r.reviewDue==='string'&&r.sourceChecked<=today&&today<r.reviewDue).length;const due=rs.filter(r=>typeof r.reviewDue==='string'&&today>=r.reviewDue).length;
 const values={featured:Math.min(cfg.prioritySize,eligible.length),historical:issues.length,graph:graph.issues.length,mapped,unmapped:issues.length-mapped,candidates:legacy.coverageCandidates.length,categories:Object.keys(cats).length,reports:rs.length,within,due,unknown:rs.length-within-due};
 for(const e of countNodes){const k=e.dataset.qpCount,v=k==='category'?cats[e.dataset.qpCategory]:values[k];e.textContent=Number.isInteger(v)?String(v):'Not established';}
 if(inventory){inventory.replaceChildren();const h=document.createElement('h2');h.textContent='Current published inventory and review status';inventory.append(h);const ul=document.createElement('ul');for(const [key,label] of [['featured','Featured historical topics (selection limit, not new research)'],['historical','Historical issue records'],['graph','Separate connected-issue IDs (may overlap)'],['mapped','Historical records with source links'],['unmapped','Historical records without source links'],['candidates','Candidate topics awaiting reconciliation'],['reports','Dated report records'],['within','Reports within their review window'],['due','Reports due for source recheck'],['unknown','Reports with undetermined review status']]){const li=document.createElement('li');li.textContent=label+': '+values[key];ul.append(li);}inventory.append(ul);const p=document.createElement('p');p.textContent='Calculated from the public datasets on '+today+' (Mountain date). Counts can change with published records; expired evidence remains available as history. Review windows are not live verification. Do not add overlapping registers.';inventory.append(p);}
 refreshDates();};compute();setInterval(()=>{if(!document.hidden)compute()},60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)compute()});
 }).catch(()=>{for(const e of countNodes)e.textContent='Unavailable';if(inventory)inventory.textContent='Current inventory could not be loaded. Consult the dated source registers; no counts are inferred.';});}

 const homeForm=document.querySelector('.qp-searchstrip form');
 if(homeForm && !homeForm.hasAttribute('data-search-mode'))homeForm.addEventListener('submit',e=>{e.preventDefault();const query=document.getElementById('home-q').value.trim();if(query)location.href='qify.html#q='+encodeURIComponent(query)});
 const caseOpen=()=>{if(!location.pathname.endsWith('packets.html'))return;try{let target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target?.classList.contains('qp-case-detail')){let d=target.querySelector('details');if(d)d.open=true}}catch{}};caseOpen();window.addEventListener('hashchange',caseOpen);
 const menu=document.getElementById('qp-menu-toggle'),nav=document.getElementById('qp-global-nav');
 if(menu&&nav){if(document.documentElement.lang==='en'&&!nav.querySelector('a[href="es.html"], a[href="/es"]')){const a=document.createElement('a');a.href='es.html';a.lang='es';a.textContent='Español';nav.append(a);}nav.classList.add('qp-js-nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menu.focus();}});nav.addEventListener('click',e=>{if(e.target.closest('a')){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open')}})}
  // Decorative subject thumbnails: existing artwork only; never change findings or evidence status.
  if(document.body.classList.contains('qp-v3')&&document.querySelector('link[href="public-experience.css"]')){
    const areas={authority:1,money:2,water:5,infrastructure:3,homes:6,people:10,safety:9,future:11};
    const categories={'public money':2,'health & safety':9,'roads & transport':3,'water & energy':5,'government & law':1,'housing & land':6,'culture & history':0,'economy & jobs':2,'education & children':10,'technology & information':11,'environment & place':5};
    const rules=[
      [9,/\b(surveillance|flock|crime|police|fire|disaster|emergency|safety|hazards?|resilience|detention|aspen acres)\b/i],
      [5,/\b(water|wastewater|sewage|energy|electric|watershed|environment|conduit|utilities)\b/i],
      [6,/\b(housing|homelessness|homeless|rent|rental|neighborhoods?|habitability|land use|community|food assistance)\b/i],
      [3,/\b(roads?|rail|airport|aviation|transportation|transport|infrastructure|fiber|boulevard|transit|bridges?)\b/i],
      [10,/\b(education|schools?|preschool|children|families|health|healthcare|workforce development)\b/i],
      [11,/\b(ai|artificial intelligence|technology|digital|future systems|privacy|information systems)\b/i],
      [2,/\b(budgets?|debt|funds?|funding|tax|levy|finance|financial|money|business|jobs|economy|economic|incentives?|investment|contracts?|wages|industry|half.cent|falcon|pedco)\b/i],
      [1,/\b(government|governance|council|commissioners|law|lawsuits?|elections?|authority|jurisdiction|accountability|ordinance|public records|decisions?)\b/i]
    ];
    const selector='.qp-gov-card > h3,.topic-card > h2,.qp-exp-card > h2,.qp-exp-card > h3,.qp-issue-story h3,.qp-issue-story h4,.qp-report-detail h1,.qp-report-detail h2,.qp-report-detail h3,.qp-report-popout h3,.qp-case-detail > h2,main details > summary,main dialog h2,main dialog h3,#qp-static-report-list > li > a,#entryways ~ section > h2,.qp-exp-section[id] > h2';
    function decorate(e){
      const slot=e.matches('summary')&&e.querySelector('.issue-title')||e;
      if(slot.querySelector(':scope > .qp-subject-icon, :scope > .qp-card-icon, :scope > .qp-exp-icon, :scope > svg, :scope > img'))return;
      const card=e.closest('.qp-gov-card,.qp-exp-card,.qp-art-card');
      if(card&&card.querySelector(':scope > .qp-entry-art,:scope > .qp-report-art,:scope > .qp-exp-icon'))return;
      const record=e.closest('[data-category]');
      const category=record?.dataset.category?.toLowerCase().trim();
      const section=e.closest('.qp-exp-section[id]');
      const title=slot.textContent.trim();
      if(!title)return;
      let n=category&&Object.prototype.hasOwnProperty.call(categories,category)?categories[category]:section&&Object.prototype.hasOwnProperty.call(areas,section.id)?areas[section.id]:undefined;
      if(n===undefined){const match=rules.find(([,re])=>re.test(title));n=match?match[0]:0;}
      const icon=document.createElement('span');
      icon.className='qp-subject-icon art-entry-'+n;
      icon.setAttribute('aria-hidden','true');
      slot.prepend(icon);
    }
    function scan(node){
      if(node.nodeType!==1)return;
      if(node.matches(selector))decorate(node);
      for(const e of node.querySelectorAll(selector))decorate(e);
    }
    const root=document.querySelector('main');
    if(root){
      scan(root);
      // Pop-outs and report records may be rendered after page load. Observe only appended subtrees.
      const observer=new MutationObserver(records=>{for(const r of records)for(const node of r.addedNodes)scan(node);});
      observer.observe(root,{childList:true,subtree:true});
    }
  }
})();
