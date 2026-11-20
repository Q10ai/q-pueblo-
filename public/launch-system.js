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
 // Keep technical coverage closed by default, but open requested evidence anchors.
 const openEvidenceAnchor=()=>{try{const id=decodeURIComponent(location.hash.slice(1));if(id==='coverage-40'||id==='coverage'){const el=document.getElementById(id);const d=el?.matches('details')?el:el?.querySelector('details');if(d)d.open=true;}}catch{}};openEvidenceAnchor();window.addEventListener('hashchange',openEvidenceAnchor);document.addEventListener('click',e=>{const a=e.target.closest?.('a[href="#coverage-40"],a[href="#coverage"]');if(!a)return;const el=document.getElementById(a.hash.slice(1));const d=el?.matches('details')?el:el?.querySelector('details');if(d)d.open=true;});
 const caseOpen=()=>{if(!location.pathname.endsWith('packets.html'))return;try{let target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target?.classList.contains('qp-case-detail')){let d=target.querySelector('details');if(d)d.open=true}}catch{}};caseOpen();window.addEventListener('hashchange',caseOpen);
 const menu=document.getElementById('qp-menu-toggle'),nav=document.getElementById('qp-global-nav');
 if(menu&&nav){if(document.documentElement.lang==='en'&&!nav.querySelector('a[href="es.html"], a[href="/es"]')){const a=document.createElement('a');a.href='es.html';a.lang='es';a.textContent='Español';nav.append(a);}nav.classList.add('qp-js-nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menu.focus();}});nav.addEventListener('click',e=>{if(e.target.closest('a')){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open')}})}
  // One locally hosted square illustration per semantic subject family; no generic random art.
  if(document.body.classList.contains('qp-v3')&&document.querySelector('link[href*="public-experience.css"]')){
    const areas={authority:'government',money:'economy',water:'water-energy',infrastructure:'transport',homes:'housing',people:'education-health',safety:'safety',future:'future'};
    const categories={'public money':'budgets','health & safety':'safety','roads & transport':'transport','water & energy':'water-energy','government & law':'legal-accountability','housing & land':'housing','culture & history':'heritage','economy & jobs':'economy','education & children':'learning','environment & place':'water-energy','technology & information':'future'};
    const rules=[
      ['wildfire-recovery',/\b(aspen acres|wildfire|fire recovery|burn scar|watershed recovery|rebuilding after fire)\b/i],
      ['surveillance',/\b(surveillance|flock|cameras?|license.plate|speed enforcement|crime center|police technology)\b/i],
      ['winter-housing',/\b(homelessness|homeless|shelters?|winter housing|winter response|habitability)\b/i],
      ['industrial-investment',/\b(half.cent|falcon|pedco|pura|little leaf|incentives?|industrial|economic development|investment agreement|steel mill)\b/i],
      ['elections',/\b(elections?|ballot|canvass|voters?|voting|certification|officeholders?|elecciones)\b/i],
      ['legal-accountability',/\b(lawsuits?|litigation|courts?|legal|ordinance|accountability|law|jurisdiction|records request|ley)\b/i],
      ['state-federal',/\b(state and federal|federal and state|state government|federal government|statewide|congress|legislature)\b/i],
      ['utility-rates',/\b(utility rates?|water rates?|electric rates?|sewer rates?|electricity bills?|utility costs?|black hills|water budget|utilities|tariffs?|rate hearing)\b/i],
      ['passenger-rail',/\b(passenger rail|rail district|train service|station|commuter rail|railway)\b/i],
      ['community-action',/\b(community movements?|civic voices|community priorities|community action|neighborhood groups?|volunteering|participation|public comment|collaborat|community resources|everyday resources|food assistance|comunidad)\b/i],
      ['agriculture',/\b(agriculture|agricultural|farms?|farming|chiles?|food systems|irrigation)\b/i],
      ['healthcare',/\b(healthcare|health care|hospitals?|clinics?|medicine|behavioral health|medical|salud)\b/i],
      ['budgets',/\b(budgets?|debt|funds?|funding|tax|levy|finance|financial|money|appropriation|spending|cost comparisons?|dinero|impuestos|presupuesto)\b/i],
      ['water-energy',/\b(water|wastewater|sewage|energy|electric|watershed|environment|conduit|agua|energía|ambiente)\b/i],
      ['housing',/\b(housing|rent|rental|neighborhoods?|land use|families|vivienda|familias)\b/i],
      ['transport',/\b(roads?|rail|airport|aviation|transportation|transport|infrastructure|fiber|boulevard|transit|bridges?|transporte|carreteras)\b/i],
      ['learning',/\b(education|schools?|preschool|children|learn|learning|students?|kids|teens|education|trivia|play|educación|escuelas)\b/i],
      ['twin',/\b(twin pueblo|regional model|digital twin|regional relationships|regional future lab)\b/i],
      ['future',/\b(ai|artificial intelligence|technology|digital|future|privacy|information systems|models?|scenario|simulation|inteligencia artificial|futuro|tecnología)\b/i],
      ['economy',/\b(business|jobs|economy|economic|investment|contracts?|wages|industry|empleo|workforce|employment)\b/i],
      ['safety',/\b(crime|police|fire|disaster|emergency|safety|hazards?|resilience|detention|seguridad|incendio)\b/i],
      ['government',/\b(government|governance|council|commissioners|authority|decisions?|gobierno)\b/i],
      ['heritage',/\b(history|historical|museum|culture|archives?|library|places?|heritage|historia|biblioteca|cultura)\b/i],
      ['research-tools',/\b(compare|calculate|calculator|tools?|options?|solutions?|remedies|truth|evidence|sources?|research|verify|check|audit|answers?|findings?|limitations?|supporting information|technical|explanation|timeline|summary|herramientas|fuentes|respuestas|investigación)\b/i]
    ];
    const emojiMap={'💰':'budgets','💵':'budgets','💧':'water-energy','🌊':'water-energy','⚡':'water-energy','🏗':'transport','🚆':'passenger-rail','🏘':'housing','🏠':'housing','🎓':'learning','🎈':'learning','🛡':'safety','🔥':'wildfire-recovery','🏛':'government','⚖':'legal-accountability','🔭':'future','🌐':'future','🤖':'future','🧠':'future','🔗':'twin','🔬':'research-tools','🔍':'research-tools','📚':'heritage','🪶':'heritage','🎡':'learning','⚙':'economy','🧭':'heritage','🎉':'learning'};
    const emojiOnly=/^(?:[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u200D\u20E3]\s*)+$/u;
    const leadingEmoji=/^\s*((?:[\p{Extended_Pictographic}\uFE0F\u200D])+)\s*/u;
    const cardSelector='.qp-gov-card,.qp-exp-card,.qp-action-card,.qp-art-card,.topic-card,.qp-report-card,.qp-feature-report,.qp-resource-card,.qp-task-card,.learn-record';
    const selector='main h2,main h3,main h4,body:not(.qp-v3-home) main h1,main details > summary,dialog h2,dialog h3,[role="dialog"] h2,[role="dialog"] h3,#qp-static-report-list > li > a,.qp-report-directory a,.qp-exp-card > strong,.qp-action-card > strong,.qp-resource-card > strong,.qp-feature-report > strong,.qp-card-icon,.qp-exp-icon,.qp-task-card > .qp-entry-art';
    const classify=(title)=>rules.find(([,re])=>re.test(title||''))?.[0];
    const keyFor=(o,k)=>k&&Object.prototype.hasOwnProperty.call(o,k)?o[k]:undefined;
    function makeIcon(id){const icon=document.createElement('span');icon.className='qp-subject-icon';icon.dataset.qpArt=id;icon.setAttribute('aria-hidden','true');return icon;}
    function decorate(e){
      const isLegacy=e.matches('.qp-card-icon,.qp-exp-icon');
      const slot=e.matches('summary')&&e.querySelector('.issue-title')||e;
      const card=e.closest(cardSelector);
      const cardTitleText=card?.querySelector('.qp-art-caption strong,h2,h3,h4,strong')?.textContent||'';
      if(e.matches('.qp-task-card > .qp-entry-art')){
        if(e.dataset.qpArt)return;
        const id=classify(cardTitleText);if(id){for(const k of [...e.classList])if(/^art-entry-\d+$/.test(k))e.classList.remove(k);e.dataset.qpArt=id;}return;
      }
      if(isLegacy){
        if(e.classList.contains('qp-subject-icon')||!emojiOnly.test(e.textContent.trim())||e.children.length)return;
        if(card?.querySelector(':scope > .qp-entry-art,:scope > .qp-report-art')){e.hidden=true;return;}
        const symbol=e.textContent.trim().replace(/\uFE0F/g,'');
        const id=classify(cardTitleText)||keyFor(emojiMap,symbol);
        if(id){e.textContent='';e.classList.add('qp-subject-icon');e.dataset.qpArt=id;e.setAttribute('aria-hidden','true');}return;
      }
      if(slot.querySelector(':scope > .qp-subject-icon,:scope > svg,:scope > img'))return;
      const cardTitle=card&&e.parentElement===card&&!e.matches('summary');
      if(cardTitle&&card.querySelector(':scope > .qp-entry-art,:scope > .qp-report-art,:scope > .qp-exp-icon,:scope > .qp-card-icon'))return;
      if(e.closest('.qp-art-caption,.qp-eight-grid,.qp-entry-grid'))return;
      const title=slot.textContent.trim();if(!title)return;
      const record=e.closest('[data-category]');const category=record?.dataset.category?.toLowerCase().trim();
      const section=e.closest('.qp-exp-section[id]');
      const symbol=title.match(leadingEmoji)?.[1]?.replace(/\uFE0F/g,'');
      const id=classify(title)||keyFor(categories,category)||keyFor(areas,section?.id)||keyFor(emojiMap,symbol)||classify(cardTitleText);
      if(!id)return; // Unclassified subject: leave text alone until a related icon exists.
      const first=slot.firstChild;
      if(keyFor(emojiMap,symbol)&&first?.nodeType===3)first.nodeValue=first.nodeValue.replace(leadingEmoji,'');
      slot.prepend(makeIcon(id));
    }
    function scan(node){if(node.nodeType!==1)return;if(node.matches(selector))decorate(node);for(const e of node.querySelectorAll(selector))decorate(e);}
    const root=document.body;
    scan(root);
    const observer=new MutationObserver(records=>{for(const r of records)for(const node of r.addedNodes)if(!node.classList?.contains('qp-subject-icon'))scan(node);});
    observer.observe(root,{childList:true,subtree:true});
  }
})();

 // Load the shared reader projection only on registered subject pages.
 (()=>{const routes=["report-budget-2026.html","report-half-cent-2026.html","report-csac-2027.html","report-county-priorities-2026.html","report-city-mill-levy-2026.html","report-permits-jurisdiction.html","report-wastewater-2026.html","report-housing-pipeline.html","report-aspen-recovery.html","report-lime-road-costs.html","report-water-budget-evidence.html","report-records-request.html","report-pueblo-flood-history.html","report-pueblo-boulevard-agenda.html","report-county-budget-2027.html","report-food-assistance.html","report-d60-preschool-2026.html","report-aspen-recovery-costs.html","county-fiscal-recovery-2026-11-19.html","civic-finance-observatory.html","council-attorney-funding.html","nonprofit-funding-continuity.html","pueblo-boulevard-pura-repayment.html","municipal-jail-community-safety.html","be-ready-pueblo.html","energy-research-paper-2026.html","energy-governance-supplement-2026.html","research/economic-development-20261119.html","pueblo-west-tract-367.html","public-information-transparency.html","civic-observatory.html","community-input-to-action.html","pueblo-air-service-2027.html","museums-culture-research.html","pueblo-ai-readiness.html","pueblo-mountain-park-recovery.html","nov18-county-fiscal-recovery.html","nov18-jail-lifecycle.html","nov18-municipal-enforcement.html","nov18-sheriff-workforce.html","nov18-school-safety.html","nov18-tif-accountability.html","nov18-north-elizabeth-renewal.html","resilience-aspen-five-year.html","resilience-burn-scar-mitigation.html","resilience-regional-shock.html","resilience-spill-infrastructure.html","resilience-wastewater-health.html","resilience-water-drought-budget.html","resilience-water-users-industry.html","community-signals-2026-11-18.html","year-end-01-county-financial-crisis.html","year-end-02-sheriff-staffing.html","year-end-03-new-jail.html","year-end-04-municipal-offenses.html","year-end-05-sheriff-transition.html","year-end-06-city-budget.html","year-end-07-ai-governance.html","year-end-08-leap-2027.html","museums-culture.html","culture-learning.html"];const current=location.pathname.replace(/^\//,'');const route=routes.find(r=>r===current||r.replace(/\.html$/,'')===current);if(!route||document.querySelector('script[data-qp-subject]'))return;const script=document.createElement('script');script.src=new URL('reader-quilt.js',document.currentScript.src).href;script.dataset.qpSubject=route;document.head.append(script);})();
