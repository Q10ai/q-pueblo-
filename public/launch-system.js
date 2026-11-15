'use strict';
(() => {
 // Original raster remains a fallback; normal navigation uses the isolated emblem.
 for(const logo of document.querySelectorAll('.qp-v3-wordmark img'))logo.src='assets/pueblo-emblem.svg';
 for(const favicon of document.querySelectorAll('link[rel="icon"]')){favicon.href='assets/pueblo-emblem.svg';favicon.type='image/svg+xml';}

 const header=document.querySelector('.qp-v3-header');if(header&&!document.querySelector('.qp-op-notice')&&!document.querySelector('.qp-welcome-note')){const p=document.createElement('div');p.className='qp-op-notice';p.textContent='Independent research beta · Not a government service · ';const a=document.createElement('a');a.href='about.html';a.textContent='About and corrections';p.append(a);header.after(p);}

 // Inventory numbers are derived from the current public records; review expiry never deletes history.
 const countNodes=[...document.querySelectorAll('[data-qp-count]')];
 const inventory=document.getElementById('qp-inventory-live');
 const freshnessNodes=[...document.querySelectorAll('[data-qp-review-due]')];
 const day=()=>{const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Denver',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day;};
 function refreshDates(){const today=day();for(const e of freshnessNodes){const due=e.dataset.qpReviewDue,checked=e.dataset.qpChecked;e.textContent=!due||!checked||checked>today?'Review date unverified':today>=due?'Source recheck due — retained as dated evidence':'Within scheduled review window — not a live verification';}}
 refreshDates();document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshDates()});
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
 refreshDates();};compute();document.addEventListener('visibilitychange',()=>{if(!document.hidden)compute()});
 }).catch(()=>{for(const e of countNodes)e.textContent='Unavailable';if(inventory)inventory.textContent='Current inventory could not be loaded. Consult the dated source registers; no counts are inferred.';});}

 const homeForm=document.querySelector('.qp-searchstrip form');
 if(homeForm && !homeForm.hasAttribute('data-search-mode'))homeForm.addEventListener('submit',e=>{e.preventDefault();const query=document.getElementById('home-q').value.trim();if(query)location.href='qify.html#q='+encodeURIComponent(query)});
 const caseOpen=()=>{if(!location.pathname.endsWith('packets.html'))return;try{let target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target?.classList.contains('qp-case-detail')){let d=target.querySelector('details');if(d)d.open=true}}catch{}};caseOpen();window.addEventListener('hashchange',caseOpen);
 const menu=document.getElementById('qp-menu-toggle'),nav=document.getElementById('qp-global-nav');
 if(menu&&nav){nav.classList.add('qp-js-nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)});nav.addEventListener('click',e=>{if(e.target.closest('a')){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open')}})}
})();
