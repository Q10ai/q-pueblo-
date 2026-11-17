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
  // Public visual language: the original local Pueblo illustration atlas, no new icon library.
  if(document.body.classList.contains('qp-v3')&&document.querySelector('link[href*="public-experience.css"]')){
    const areas={authority:1,money:2,water:5,infrastructure:3,homes:6,people:10,safety:9,future:11};
    const categories={'public money':2,'health & safety':9,'roads & transport':3,'water & energy':5,'government & law':1,'housing & land':6,'culture & history':0,'economy & jobs':2,'education & children':10,'environment & place':5,'technology & information':11};
    const rules=[
      [9,/\b(surveillance|flock|crime|police|fire|disaster|emergency|safety|hazards?|resilience|detention|aspen acres|seguridad|incendio)\b/i],
      [5,/\b(water|wastewater|sewage|energy|electric|watershed|environment|conduit|utilities|agua|energía|ambiente)\b/i],
      [6,/\b(housing|homelessness|homeless|rent|rental|neighborhoods?|habitability|land use|community|food assistance|vivienda|comunidad|familias)\b/i],
      [3,/\b(roads?|rail|airport|aviation|transportation|transport|infrastructure|fiber|boulevard|transit|bridges?|transporte|carreteras)\b/i],
      [10,/\b(education|schools?|preschool|children|families|health|healthcare|workforce development|learn|learning|students?|kids|teens|educación|salud|escuelas)\b/i],
      [11,/\b(ai|artificial intelligence|technology|digital|future|privacy|information systems|models?|scenario|simulation|inteligencia artificial|futuro|tecnología)\b/i],
      [2,/\b(budgets?|debt|funds?|funding|tax|levy|finance|financial|money|business|jobs|economy|economic|incentives?|investment|contracts?|wages|industry|half.cent|falcon|pedco|dinero|impuestos|presupuesto|empleo)\b/i],
      [1,/\b(government|governance|council|commissioners|law|lawsuits?|elections?|authority|jurisdiction|accountability|ordinance|public records|decisions?|gobierno|ley|elecciones)\b/i],
      [7,/\b(compare|calculate|calculator|tools?|options?|solutions?|remedies|costs?|truth|evidence|sources?|research|verify|check|audit|answers?|findings?|limitations?|herramientas|fuentes|respuestas|investigación)\b/i],
      [0,/\b(history|historical|museum|culture|archives?|library|trivia|play|places?|historia|biblioteca|cultura)\b/i]
    ];
    const emojiMap={'💰':2,'💵':2,'💧':5,'🌊':5,'⚡':5,'🏗':3,'🚆':3,'🏘':6,'🏠':6,'🎓':10,'🎈':10,'🛡':9,'🔥':9,'🏛':1,'⚖':1,'🔭':11,'🌐':11,'🤖':11,'🧠':11,'🔗':11,'🔬':7,'🔍':7,'📚':0,'🪶':0,'🎡':0,'⚙':2,'🧭':0,'🎉':0};
    const emojiOnly=/^(?:[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u200D\u20E3]\s*)+$/u;
    const leadingEmoji=/^\s*((?:[\p{Extended_Pictographic}\uFE0F\u200D])+)\s*/u;
    const cardSelector='.qp-gov-card,.qp-exp-card,.qp-action-card,.qp-art-card,.topic-card,.qp-report-card,.qp-feature-report,.qp-resource-card,.qp-task-card,.learn-record';
    const selector='main h2,main h3,main h4,main details > summary,main dialog h2,main dialog h3,main [role="dialog"] h2,main [role="dialog"] h3,#qp-static-report-list > li > a,.qp-report-directory a,.qp-exp-card > strong,.qp-action-card > strong,.qp-resource-card > strong,.qp-feature-report > strong,.qp-card-icon,.qp-exp-icon';
    function classify(title,context){
      const match=rules.find(([,re])=>re.test(title));if(match)return match[0];
      const fallback=rules.find(([,re])=>re.test(context||''));return fallback?fallback[0]:0;
    }
    function makeIcon(n){const icon=document.createElement('span');icon.className='qp-subject-icon art-entry-'+n;icon.setAttribute('aria-hidden','true');return icon;}
    function decorate(e){
      const isLegacy=e.matches('.qp-card-icon,.qp-exp-icon');
      const slot=e.matches('summary')&&e.querySelector('.issue-title')||e;
      const card=e.closest(cardSelector);
      if(isLegacy){
        if(e.classList.contains('qp-subject-icon')||!emojiOnly.test(e.textContent.trim())||e.children.length)return;
        // Replace only a decorative standalone pictogram, not meaningful status text.
        if(card?.querySelector(':scope > .qp-entry-art,:scope > .qp-report-art')){e.hidden=true;return;}
        const title=card?.querySelector('h2,h3,h4,strong')?.textContent||'';
        const symbol=e.textContent.trim().replace(/\uFE0F/g,'');
        const n=Object.prototype.hasOwnProperty.call(emojiMap,symbol)?emojiMap[symbol]:classify(title,'');
        e.textContent='';e.classList.add('qp-subject-icon','art-entry-'+n);e.setAttribute('aria-hidden','true');return;
      }
      if(slot.querySelector(':scope > .qp-subject-icon,:scope > svg,:scope > img'))return;
      // A card's artwork already identifies its main title; its inner pop-outs still receive icons.
      const cardTitle=card&&e.parentElement===card&&!e.matches('summary');
      if(cardTitle&&card.querySelector(':scope > .qp-entry-art,:scope > .qp-report-art,:scope > .qp-exp-icon,:scope > .qp-card-icon'))return;
      if(e.closest('.qp-art-caption,.qp-eight-grid,.qp-entry-grid'))return;
      const title=slot.textContent.trim();if(!title)return;
      const record=e.closest('[data-category]');const category=record?.dataset.category?.toLowerCase().trim();
      const section=e.closest('.qp-exp-section[id]');
      const symbol=title.match(leadingEmoji)?.[1]?.replace(/\uFE0F/g,'');
      let n=category&&Object.prototype.hasOwnProperty.call(categories,category)?categories[category]:section&&Object.prototype.hasOwnProperty.call(areas,section.id)?areas[section.id]:undefined;
      if(n===undefined&&symbol&&Object.prototype.hasOwnProperty.call(emojiMap,symbol))n=emojiMap[symbol];
      if(n===undefined)n=classify(title,card?.querySelector('h2,h3,h4,strong')?.textContent||document.title);
      // Do not rewrite headings or claim/status labels; only remove recognized decorative prefixes.
      const first=slot.firstChild;
      if(symbol&&Object.prototype.hasOwnProperty.call(emojiMap,symbol)&&first?.nodeType===3)first.nodeValue=first.nodeValue.replace(leadingEmoji,'');
      slot.prepend(makeIcon(n));
    }
    function scan(node){
      if(node.nodeType!==1)return;
      if(node.matches(selector))decorate(node);
      for(const e of node.querySelectorAll(selector))decorate(e);
    }
    const root=document.querySelector('main');
    if(root){
      scan(root);
      // Dynamic search results, research cards and dialogs inherit the same artwork.
      const observer=new MutationObserver(records=>{for(const r of records)for(const node of r.addedNodes)scan(node);});
      observer.observe(root,{childList:true,subtree:true});
    }
  }
})();
