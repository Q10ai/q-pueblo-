'use strict';
(() => {
  const cat = window.QP_PUBLIC_CATALOG, spec = window.QP_WORKBENCH_SPEC;
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  if (!cat || !spec || !Array.isArray(cat.issues) || !Array.isArray(spec.roles)) {
    const status = $('wb-persona-summary');
    if(status) status.textContent = 'Research reference data are unavailable. Use the public issue library.';
    return;
  }
  const roles=spec.roles,issues=[...cat.issues].sort((a,b)=>a.title.localeCompare(b.title));
  const bySource=new Map(cat.sources.map(s=>[s.id,s]));
  // Dated public reports are loaded once. This is not a live AI/web research service.
  let publishedBriefs=[];
  const briefsReady=fetch('data/q-pueblo-qified-reports-v2-2026-11-09.json',{cache:'no-store'})
    .then(r=>{if(!r.ok)throw Error('Unavailable evidence ledger');return r.json();})
    .then(data=>{if(!Array.isArray(data.reports))throw Error('Invalid evidence ledger');publishedBriefs=data.reports;})
    .catch(()=>{publishedBriefs=[];});
  const matchPublished=q=>q&&window.QP_QIFY_MATCH?window.QP_QIFY_MATCH.selectReport(q,publishedBriefs)?.report||null:null;
  const form=$('wb-form'),role=$('wb-persona'),issue=$('wb-issue'),search=$('wb-issue-filter');
  const level=$('wb-level'),lens=$('wb-lens'),output=$('wb-output');
  const fallback={id:'NEW-LEAD',title:'Emerging topic / unknown issue (new research lead)',category:'Unclassified / emerging',domain:'Needs jurisdiction and source classification',lastReviewed:'No indexed record',sourceIds:[],geography:'Not determined',childImpact:'Must be assessed after scope is established'};
  let packet=null,markdown='';
  const option=(value,label)=>{const n=document.createElement('option');n.value=value;n.textContent=label;return n;};
  const chosenRole=()=>roles.find(x=>x.id===role.value)||roles[0];
  const chosenIssue=()=>issues.find(x=>x.id===issue.value)||fallback;
  const chosen=(arr,value)=>arr.find(x=>x.id===value)||arr[0];
  const checklist=arr=>'<ul>'+arr.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
  const section=(name,body,full=false)=>'<section class="wb-packet-block'+(full?' wb-full':'')+'" aria-label="'+esc(name)+'"><h3>'+esc(name)+'</h3>'+body+'</section>';
  const msg=text=>{$('wb-toast').textContent=text;$('wb-toast').hidden=false;};
  const hostValid=url=>/^https:\/\//i.test(url)&&!/[<>"']/.test(url);
  const sourceLine=s=>'<div><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a><small>'+esc(s.publisher)+' · '+esc(s.asOf||'check current version')+'</small></div>';
  const clean=s=>String(s||'').replace(/[\r\n]+/g,' ').trim().slice(0,1000);
  const shockData={
    none:{focus:'General change and decision uncertainty',signals:['Official decision, budget or contract change','Source revision or contradictory reporting','Service-access or delivery change'],defense:['Keep a dated source trail and responsible custodian','Preserve continuity of service and correction path'],advance:['Identify no-regret improvements, collaboration and public learning']},
    economic:{focus:'Revenue, grants, jobs, business continuity and affordability',signals:['Budget amendment and cash-flow stress','Employer and procurement changes','Price, jobs and tax-base trend'],defense:['Maintain essential-service funding alternatives','Review cash reserves, debt covenants and double counting'],advance:['Diversify suppliers and workforce partnerships','Target sustainable investment tied to measured outcomes']},
    infrastructure:{focus:'Utility, transport and physical asset service reliability',signals:['Outage, capacity and maintenance indicators','Asset lifecycle, permits and access limitations','Supplier or contractor dependency'],defense:['Identify backup service and critical loads','Test maintenance reserves and recovery contracts'],advance:['Invest in resilience and preventive maintenance','Design modular infrastructure alternatives']},
    health:{focus:'Population health, safety, hazardous exposure and emergency services',signals:['Official health/safety notices','Service-capacity and response trends','Publicly verified exposure measures'],defense:['Prioritize emergency access and child safeguards','Separate clinical/public-safety alerts from rumors'],advance:['Improve prevention, coordination and equitable access']},
    climate:{focus:'Water, drought, flood, fire and environmental continuity',signals:['Official hazard outlooks and monitoring','Water reliability, extreme weather and burn conditions','Recovery funding and property exposure'],defense:['Use authorized emergency plans and evacuation notices','Protect critical utilities, documents and vulnerable populations'],advance:['Improve watershed and land resilience','Use adaptive building/land-use decisions and local skills']},
    governance:{focus:'Elections, authority, compliance and institutional trust',signals:['New official results or certification','Legal, board, staffing and delegation changes','Budget/contract/ordinance amendments'],defense:['Preserve valid-vs-observed time and status','Verify legal powers and transition handoffs'],advance:['Improve transparent decision packets and access','Make correction and public participation easier']},
    technology:{focus:'AI, data, cybersecurity and changing technical capacity',signals:['System/integration changes and vendor controls','Security incidents or privacy revisions','Costs, workforce and service adoption'],defense:['Protect identity, consent, backups and human override','Stage pilots with disable/rollback switches'],advance:['Train staff and residents in AI literacy','Pilot accessible low-cost human-reviewed public tools']},
    supply:{focus:'Labor, materials, logistics and capacity',signals:['Materials availability and pricing','Supplier concentration and labor gaps','Transportation/permit delays'],defense:['Identify alternatives for critical suppliers','Document inventory, lead times and service continuity'],advance:['Invest in local workforce and modular sourcing','Build transparent vendor access and collaboration']},
    unknown:{focus:'Compound or novel uncertainties across domains',signals:['Unexpected correlated service changes','Emerging claims without verified primary records','Cross-agency failure and rapid context shifts'],defense:['Protect life, essential services and verified communication','Use independent backup records, escalation and reversible actions'],advance:['Explore multiple bounded scenarios without assuming forecasts','Create a repeatable intake and learning record']}
  };
  const shockName={none:'General',economic:'Economic/fiscal',infrastructure:'Infrastructure/utility',health:'Health/safety',climate:'Climate/environment',governance:'Governance/transition',technology:'AI/technology/cyber',supply:'Labor/supply chain',unknown:'Compound/novel'};
  const horizonName={immediate:'Immediate / weeks',mid:'Months to 2 years',long:'3–10 years',generation:'Generational / children’s future'};
  const postureName={balanced:'Balanced protection and opportunity',defend:'Defensive continuity and recovery',advance:'Proactive development and capability',explore:'LEAP exploratory alternatives'};
  const riskName={standard:'Standard screening',heightened:'Heightened attention to essential services',severe:'Severe correlated-failure exercise'};
  // Bounded scenario branches are planning templates, not quantified predictions.
  const fourScenarios=(s,horizon,posture,risk)=>[
    {id:'baseline',label:'Baseline continuity',assumption:'No additional shock is assumed; verify current source versions, operating capacity and lawful budgets before acting.',trigger:'New authoritative baseline or status amendment',response:['Confirm the responsible offices and published service standards','Preserve the existing service, funding and children/family access baseline','Track changes through dated official records'],measure:'Documented service availability and independently reviewable spending/outcome baseline'},
    {id:'single',label:'Single-system stress',assumption:'One material stress affects '+s.focus.toLowerCase()+'. This is a hypothesis requiring place-specific evidence.',trigger:'A verified material disruption or authoritative notice affecting the issue',response:[...s.defense,'Assign a lawful continuity owner and measurable recovery milestones'],measure:'Officially measured disruption extent, service restoration and equitable access'},
    {id:'compound',label:'Correlated / backup failure',assumption:'Two connected services or the primary and its backup fail due to a common dependency. Do not multiply independent failure probabilities.',trigger:'Independent original records indicate overlapping disruptions or the proposed backup is unavailable',response:['Find a distinct custodian, supplier or independent fallback path',...s.defense,'Activate accessible communications and child/family continuity before noncritical optimizations'],measure:'Documented recovery time, failed common dependencies, safety and resource tradeoffs'},
    {id:'adaptive',label:'Recovery and LEAP improvement',assumption:'An authorized recovery and improvement path is compared against baseline, with explicit funding, rights and rollback constraints.',trigger:'Documented service stabilization and post-event assessment',response:[...s.advance,'Test the proposed improvement against simpler lower-cost alternatives','Record observed outcomes, amendments and a human-reviewed rollback decision'],measure:'Verified outcomes versus baseline, lifecycle cost, resource/energy use and child/community effects'}
  ].map(x=>({...x,horizon:horizonName[horizon],posture:postureName[posture],riskLabel:riskName[risk],evidenceStatus:'MODELLED CONDITIONAL PATH — NOT A VERIFIED EVENT OR FORECAST'}));
  const moneyStages=[
    'Requested or proposed amount — identify applicant, estimates and purpose',
    'Legal or voter authority — inspect statute, ordinance, measure or board resolution',
    'Appropriated amount — check year, fund restrictions, transfer and balance',
    'Awarded or obligated amount — confirm instrument, conditions and recipient',
    'Executed contract — verify parties, scope, pricing, amendments and milestones',
    'Invoiced versus cash paid — trace actual transaction IDs, dates and payees',
    'Recovered or clawed back — separate recovery from original obligations',
    'Actual results — verify delivery, maintenance, jobs, lifecycle costs and outcome'
  ];
  function roleChange(){
    const r=chosenRole();$('wb-persona-summary').textContent=r.need;
    $('wb-starters').innerHTML=r.questions.map((q,i)=>'<button type="button" data-starter="'+i+'">'+esc(q)+'</button>').join('');
    $('wb-persona-chips').querySelectorAll('[data-role]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.role===r.id)));
  }
  roles.forEach(r=>role.appendChild(option(r.id,r.title)));
  spec.levels.forEach(x=>level.appendChild(option(x.id,x.title)));
  spec.lenses.forEach(x=>lens.appendChild(option(x.id,x.title)));
  spec.outputs.forEach(x=>output.appendChild(option(x.id,x.title)));
  role.value='resident';level.value='investigate';lens.value='balanced';output.value='snapshot';
  const common=['resident','family','business','investor','council','mayor','commissioner','state','federal'];
  $('wb-persona-chips').innerHTML=common.map(id=>{
    const r=roles.find(x=>x.id===id);
    return '<button type="button" data-role="'+esc(r.id)+'" aria-pressed="false">'+esc(r.title.split(' / ')[0])+'</button>';
  }).join('');
  $('wb-persona-chips').addEventListener('click',e=>{const b=e.target.closest('[data-role]');if(!b)return;role.value=b.dataset.role;output.value=chosenRole().outputs[0];roleChange();});
  $('wb-starters').addEventListener('click',e=>{const b=e.target.closest('[data-starter]');if(!b)return;$('wb-question').value=chosenRole().questions[Number(b.dataset.starter)]||'';$('wb-question').focus();});
  const evidenceExamples=$('wb-evidence-examples');
  if(evidenceExamples)evidenceExamples.addEventListener('click',e=>{const b=e.target.closest('[data-evidence-question]');if(!b)return;
    $('wb-question').value=b.dataset.evidenceQuestion;issue.value='NEW-LEAD';showIssue();form.requestSubmit();});
  role.addEventListener('change',()=>{output.value=chosenRole().outputs[0];roleChange();});
  function showIssue(){
    const i=chosenIssue();
    $('wb-issue-meta').textContent=i.id==='NEW-LEAD'?'Unlisted topic: initial classification and original-source discovery needed. No claim is registered.':
      i.id+' · '+i.category+' · last historical review: '+(i.lastReviewed||'not recorded')+' · '+i.sourceIds.length+' crosswalked public source links. This title is a research scope, not a finding.';
  }
  function issueOptions(){
    const q=search.value.toLowerCase().trim(),old=issue.value;
    const rows=issues.filter(i=>!q||[i.id,i.title,i.domain,i.category,i.geography].join(' ').toLowerCase().includes(q));
    issue.replaceChildren(option('NEW-LEAD','NEW-LEAD — Emerging topic / not in the indexed research'));
    rows.forEach(i=>issue.appendChild(option(i.id,i.id+' — '+i.title)));
    issue.value=rows.some(i=>i.id===old)?old:(q&&!rows.length?'NEW-LEAD':rows.length?rows[0].id:'NEW-LEAD');
    showIssue();
  }
  search.addEventListener('input',issueOptions);issue.addEventListener('change',showIssue);
  issueOptions();roleChange();
  function relatedIssues(target,question){
    const text=(target.id==='NEW-LEAD'?question:target.title+' '+question).toLowerCase();
    const stop=new Set(['pueblo','county','city','local','what','when','that','from','have','will','this','their','public','with','there','into','about','current','issue','does','who','why','how','project']);
    const tokens=new Set((text.match(/[a-z]{4,}/g)||[]).filter(t=>!stop.has(t)));
    return issues.filter(i=>i.id!==target.id).map(i=>{
      const words=new Set((i.title+' '+i.domain).toLowerCase().match(/[a-z]{4,}/g)||[]);
      let score=0;for(const t of tokens)if(words.has(t))score++;
      if(target.id!=='NEW-LEAD'&&i.category===target.category)score+=.5;
      return {i,score};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.i.id.localeCompare(b.i.id)).slice(0,6).map(x=>({...x.i,provenance:'TEXT MATCH ONLY; not a verified relationship'}));
  }
  function linksFor(i,q){
    const direct=i.sourceIds.map(id=>bySource.get(id)).filter(Boolean).filter(s=>hostValid(s.url));
    const original=direct.length?direct:[];
    const keywords=new Set((q+' '+i.title).toLowerCase().match(/[a-z]{5,}/g)||[]);
    const ranked=cat.sources.filter(s=>hostValid(s.url)&&!original.some(d=>d.id===s.id)).map(s=>{
      const words=new Set((s.title+' '+s.publisher).toLowerCase().match(/[a-z]{5,}/g)||[]);
      let n=0;for(const t of keywords)if(words.has(t))n++;
      if(/pueblo city council|pueblo county|colorado state|official|municipal code|budget/i.test(s.title))n+=.15;
      return {s,n};
    }).sort((a,b)=>b.n-a.n||a.s.id.localeCompare(b.s.id));
    const general=ranked.slice(0,Math.max(0,7-Math.min(original.length,5))).map(x=>x.s);
    const wrap=(s,type)=>({id:s.id,title:s.title,publisher:s.publisher,url:s.url,asOf:s.asOf||'unknown',kind:type,
      evidenceStatus:type==='registry-linked'?'Source lead linked to issue in dated registry; claim-level check still required':'General or keyword-matched official-source lead; NOT established as evidence on this issue'});
    return [...original.slice(0,5).map(s=>wrap(s,'registry-linked')),...general.map(s=>wrap(s,'discovery-only'))];
  }
  function build(){
    const r=chosenRole(),i=chosenIssue(),q=clean($('wb-question').value)||r.questions[0],L=chosen(spec.levels,level.value),focus=chosen(spec.lenses,lens.value),deliverable=chosen(spec.outputs,output.value);
    const shock=$('wb-shock').value, horizon=$('wb-horizon').value,posture=$('wb-posture').value,risk=$('wb-risk').value;
    const s=shockData[shock]||shockData.unknown;
    const direct=linksFor(i,q),crosswalk=relatedIssues(i,q);
    // Never treat the generic persona starter or an indexed issue title as claim evidence.
    const reviewedBrief=matchPublished(clean($('wb-question').value));
    return {
      schema:'qp-research-workbench-v1',createdAt:new Date().toISOString(),
      state:reviewedBrief?'DATED_SOURCE_ATTRIBUTED_BRIEF_NOT_CURRENT_VERIFICATION':'UNVERIFIED_RESEARCH_STARTER_NOT_PUBLISHED_FACT',
      reviewedBrief,
      platform:'static-public-workbench-no-network-inquiry-no-automatic-AI',
      role:{id:r.id,title:r.title,need:r.need},question:q,
      issue:{id:i.id,title:i.title,domain:i.domain,category:i.category,lastReviewed:i.lastReviewed,scope:i.geography,registryStatus:i.id==='NEW-LEAD'?'NOT YET REGISTERED':'HISTORICAL SCOPED RESEARCH'},
      output:{depth:L.title,lens:focus.title,deliverable:deliverable.title,purpose:deliverable.purpose},
      initialResponse:i.id==='NEW-LEAD'?
        'This issue is not matched to a canonical Pueblo research record. The starting answer is to determine scope and responsible authority; locate the earliest original source; establish time and jurisdiction; test risk and child impact; then review whether to attach it to an existing case or create a new signal.' :
        'Q Pueblo has a dated research entry for this topic. It identifies a question for investigation, not a verified current resolution. Start with the listed source leads, check the historical review date and authority, then compare newer official records before using any finding.',
      questions:r.questions,
      fiveWH:spec.questions.map(x=>({dimension:x.code,prompt:x.prompt,status:'VERIFY FROM ORIGINAL RECORD'})),
      entityImpact:[
        ...spec.layers.map(x=>({depth:x.depth,title:x.title,questions:x.questions,confidence:x.type+' — source-backed specific entities and edges are NOT provided by this tool'}))
      ],
      relatedTopics:crosswalk.map(x=>({id:x.id,title:x.title,relationship:'Keyword/research affinity only; no documented causal or legal edge'})),
      finance:moneyStages.map(x=>({check:x,status:'NO DOLLAR AMOUNT OR RESULT ASSUMED'})),
      sources:direct,
      shock:{kind:shockName[shock],horizon:horizonName[horizon],posture:postureName[posture],riskScreen:riskName[risk],confidence:'Illustrative qualitative readiness checklist — not measured probability or hazard warning',focus:s.focus,earlyWarning:s.signals,protect:s.defense,improve:s.advance,scenarios:fourScenarios(s,horizon,posture,risk),
        compoundedFailure:['What if the primary system and its backup fail together?','What if responsible authority, funding and service access change simultaneously?','How do we reach residents without digital access, with accessible language and privacy?'],
        preparedness:['Map essential functions and dependency owners','Identify alternate contacts, vendors and source custodians','Define triggers, thresholds only when measured, escalation and stop/rollback','Review financial and equity tradeoffs under at least two plausible scenarios','Recheck outcomes and archive what changed']},
      RX:spec.rx.map(x=>({key:x.key,title:x.title,question:x.question,status:'TO DO — not automatically completed'})),
      timeModel:{
        past:'Preserve original event/decision, governing text and versioned amendments',
        present:'Find latest authoritative records; keep event, publication, observation and effective dates separate',
        future:'Branch alternative conditional scenarios with ranges, assumptions, sources and reversibility',
        learning:'Record observed outcome, contradictions and correction, then update the next version only after review'
      },
      childImpact:{
        status:'REQUIRED FOR ANY CONSEQUENTIALLY PUBLISHED PACKET',
        questions:['Which children and families are affected indirectly or directly at safe aggregate scale?','What changes in safety, health, services, education, cost and access?','What liabilities and resilience benefits extend into adulthood and future generations?','Are there disparate burdens, unresolved evidence, or privacy and dignity risks?']},
      adaptive:{unknownIssueSupported:true,models:'Classical multi-scenario and graph-oriented specification; no quantum hardware, neural network, live predictions or autonomous agents running here',
        integration:'Stable versioned JSON/Markdown export suitable for human-reviewed downstream ingestion',
        provenance:'Any external assistant, data tool, or future model must attach exact sources, validity windows, permissions and review receipts'},
      nextSteps:i.id==='NEW-LEAD'?
        ['Classify threat/opportunity, jurisdiction, date, domain and child impact','Locate primary custodian; archive original and relevant alternative authorities','Create a lead with unknown/contested labels, not a proven finding','Search for existing canonical aliases and cross-domain case relationships','Prepare a human-reviewed source-backed packet; reassess during refresh']:
        ['Read original documents or official portal and establish source versions','Distinguish proposed, authorized, contracted, paid and realized outcomes','Map direct, second and third-order dependencies only with evidence','Challenge with independent origin records and documented alternative interpretations','Write dated brief with child impact, scenario bounds, reviewer, correction and refresh triggers'],
      limitations:['No automatic claim verification','No inference of a source-supported relationship from text similarity','No emergency instruction or personalized legal/financial/medical advice','No automatic scraping, user profiling, private input submission or quantum advantage claim']
    };
  }
  function render(p){
    const r=p.reviewedBrief, pieces=[];
    const listed=r&&Array.isArray(r.sources)?r.sources.filter(s=>hostValid(s.url)):[];
    if(r){
      pieces.push(section('A. Answer from a dated original public record',
        '<p class="wb-qa-scope">'+esc(r.stage)+' · Source check '+esc(r.sourceChecked||r.date)+' · Review due '+esc(r.reviewDue||'not scheduled')+'</p>'+
        '<p class="wb-direct-answer"><strong>'+esc(r.summary)+'</strong></p>'+
        '<p><a href="reports.html?report='+encodeURIComponent(r.slug)+'">Read the complete sourced Qified report</a></p>',true));
      pieces.push(section('B. Actual reported figures and documented facts',
        '<div class="wb-fact-grid">'+r.keyFacts.map(f=>'<article><small>'+esc(f.label)+'</small><strong>'+esc(f.value)+'</strong><span>'+esc(f.stage)+(f.source?' · source '+esc(f.source):'')+'</span></article>').join('')+'</div>'+checklist(r.whatKnown),true));
      if(Array.isArray(r.claims)&&r.claims.length)pieces.push(section('Claim-to-source crosswalk',checklist(r.claims.map(c=>c.id+' | '+c.claim+' | '+c.classification+' | Sources: '+c.sourceIds.join(', ')+' | '+c.boundary))));
      pieces.push(section('C. Who, what, when, where, why and how',
        '<dl class="wb-evidence-dl">'+[['Who',r.who],['What',r.what],['When',r.when],['Where',r.where],['Why',r.why],['How',r.how]].map(([k,v])=>'<dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd>').join('')+'</dl>'));
      pieces.push(section('D. Follow the money — keep accounting stages separate',
        '<table class="wb-evidence-money"><thead><tr><th>Stage</th><th>Recorded details</th><th>Evidence boundary</th></tr></thead><tbody>'+r.money.map(m=>'<tr><th>'+esc(m.stage)+'</th><td>'+esc(m.detail)+'</td><td>'+esc(m.status)+'</td></tr>').join('')+'</tbody></table>'));
      pieces.push(section('E. Counterevidence and unresolved gaps',
        '<h4>Competing interpretation</h4><p>'+esc(r.counter)+'</p><h4>What is not established</h4>'+checklist(r.unknowns),true));
      pieces.push(section('F. Primary sources to inspect',
        '<p>Published dates and source scopes control. These documents do not establish subsequent events.</p><div class="wb-source-grid">'+listed.map(s=>'<div><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a><small>'+esc(s.kind)+' · '+esc(s.asOf)+'</small></div>').join('')+'</div>',true));
      pieces.push(section('G. Next useful, reversible actions',checklist(r.actions.concat(r.options))));
      pieces.push(section('H. Children, families and future effects','<p>'+esc(r.child)+'</p>'));
    }else{
      pieces.push(section('A. No published source-backed answer for this exact question',
        '<p class="wb-direct-answer">Q-Pueblo cannot substantiate a direct answer from its five dated source-attributed briefs. It will not present research prompts, inferred relationships or an issue-index title as completed findings.</p>'+
        '<p>This is an evidence coverage gap, not proof that an issue is unimportant or untrue.</p>'+
        '<p><a href="qify.html?q='+encodeURIComponent(p.question)+'">Check the dated Qified library</a> · <a href="mailto:Q10pueblo@gmail.com?subject='+encodeURIComponent('Pueblo original-record research request')+'">Request source-backed research and review</a></p>',true));
      pieces.push(section('B. Source leads — not proof of a claim',
        '<p>These are historically indexed or keyword-discovered routes, not independently verified answers.</p><div class="wb-source-grid">'+p.sources.filter(s=>hostValid(s.url)).map(sourceLine).join('')+'</div>',true));
      pieces.push(section('C. Specific evidence needed next',
        '<p>Obtain the original decision, responsible jurisdiction, governing text, dated financial stage and supporting outcome. Any contested conclusion requires independent contrary evidence and human review.</p>',true));
    }
    const prompts=[];
    prompts.push(section('5 Ws + How research prompts',checklist(p.fiveWH.map(x=>x.dimension+': '+x.prompt)),true));
    prompts.push(section('Unverified relationships to investigate',p.entityImpact.map(x=>'<h4>'+esc(x.title)+'</h4>'+checklist(x.questions)+'<small>'+esc(x.confidence)+'</small>').join('')));
    prompts.push(section('Money lifecycle checklist',checklist(p.finance.map(x=>x.check))));
    prompts.push(section('Safety, continuity and opportunity prompts',checklist(p.shock.earlyWarning.concat(p.shock.protect,p.shock.improve))));
    if(p.shock.scenarios.length)prompts.push(section('Conditional scenarios, not forecasts',p.shock.scenarios.map(x=>'<h4>'+esc(x.label)+'</h4><p>'+esc(x.assumption)+'</p>'+checklist(x.response)).join('')));
    prompts.push(section('RX contradiction questions',checklist(p.RX.map(x=>x.title+': '+x.question))));
    pieces.push('<details class="wb-extra-research wb-full"><summary>Optional: unverified research questions, dependency checks and hypothetical scenarios</summary><p>For planning only. Nothing below is a source-backed local finding.</p><div class="wb-extra-grid">'+prompts.join('')+'</div></details>');
    $('wb-output-body').innerHTML=pieces.join('');
    $('wb-output-section').hidden=false;
    $('wb-packet-status').textContent=r?r.id+' · Source checked '+(r.sourceChecked||r.date)+' · '+((r.reviewDue && new Date().toISOString().slice(0,10)>r.reviewDue)?'REVIEW DUE · HISTORICAL':'DATED REPORT · NOT LIVE VERIFICATION'):p.issue.id+' · No source-backed answer matched · Human investigation required';
    $('wb-output-section').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function toMarkdown(p){
    const text=[];
    const line=(h,body)=>{text.push('## '+h,'',body,'');};
    const bullets=x=>x.map(a=>'- '+String(a).replace(/[\r\n]+/g,' ')).join('\n');
    text.push('# Q Pueblo — '+p.output.deliverable,'','**Status:** UNVERIFIED RESEARCH STARTER / HUMAN REVIEW REQUIRED',
      '**Snapshot:** '+p.createdAt+' | master index '+cat.snapshot,
      '**Issue:** '+p.issue.id+' — '+p.issue.title,
      '**Historical review:** '+p.issue.lastReviewed,
      '**Perspective:** '+p.role.title+' | **Depth:** '+p.output.depth,
      '**Shock:** '+p.shock.kind+' | **Horizon:** '+p.shock.horizon,'');
    line('The question',p.question);
    line('Initial response',p.initialResponse);
    if(p.reviewedBrief){const r=p.reviewedBrief;
      line('Source-attributed answer',r.summary+' [Source checked '+(r.sourceChecked||r.date)+'; review due '+(r.reviewDue||'not scheduled')+'; '+r.id+']');
      line('Actual figures',bullets(r.keyFacts.map(x=>x.label+': '+x.value+' ['+x.stage+']')));
      line('Money by accounting stage',bullets(r.money.map(x=>x.stage+': '+x.detail+' ['+x.status+']')));
      line('What the record establishes',bullets(r.whatKnown));
      line('Counterevidence and unknowns',r.counter+'\n'+bullets(r.unknowns));
      line('Primary sources',bullets(r.sources.map(x=>x.title+' — '+x.url+' ('+x.asOf+')')));
      if(r.claims)line('Claims mapped to original-source IDs',bullets(r.claims.map(x=>x.id+' | '+x.claim+' | '+x.classification+' | '+x.sourceIds.join(', ')+' | '+x.boundary)));
    }else line('Answer coverage','NO MATCHED SOURCE-ATTRIBUTED ANSWER. Research prompts are not evidence.');
    line('Five Ws + How',bullets(p.fiveWH.map(x=>x.dimension+': '+x.prompt)));
    line('Direct, secondary and tertiary impact questions',p.entityImpact.map(x=>'### '+x.title+'\n'+bullets(x.questions)).join('\n'));
    line('Money and lifecycle audit',bullets(p.finance.map(x=>x.check)));
    line('Past, present, future and LEAP',bullets(Object.entries(p.timeModel).map(([k,v])=>k+': '+v)));
    line('Child and family impact',bullets(p.childImpact.questions));
    line('Shock and preparedness',bullets(['Focus: '+p.shock.focus,'Early warnings:',...p.shock.earlyWarning,'Defensive continuity:',...p.shock.protect,'Proactive improvement:',...p.shock.improve,'Backups to backups:',...p.shock.compoundedFailure]));
    line('Four conditional scenario branches — not forecasts',p.shock.scenarios.map(x=>'### '+x.label+'\nAssumption: '+x.assumption+'\nTrigger: '+x.trigger+'\nResponses:\n'+bullets(x.response)+'\nMeasure: '+x.measure).join('\n\n'));
    line('RX / contradiction and backup chain',bullets(p.RX.map(x=>x.title+': '+x.question)));
    line('Unverified crosswalk candidates',bullets(p.relatedTopics.map(x=>x.id+' — '+x.title+' [textual proximity only]')));
    line('Source inspection leads',bullets(p.sources.map(s=>s.title+' — '+s.publisher+' — '+s.url+' ['+s.kind+': '+s.evidenceStatus+']')));
    line('Next acquisition / decision steps',bullets(p.nextSteps));
    line('Constraints',bullets(p.limitations.concat(['Not a completed investigation, legal finding, risk score, operational twin, or validated forecast.','Specific second/third-order entity links require independent source verification.'])));
    return text.join('\n');
  }
  function download(filename,data,type){
    const blob=new Blob([data],{type}),u=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),3000);
  }
  form.addEventListener('submit',async event=>{event.preventDefault();await briefsReady;packet=build();markdown=toMarkdown(packet);render(packet);});
  $('wb-reset').addEventListener('click',()=>{
    form.reset();role.value='resident';level.value='investigate';lens.value='balanced';output.value='snapshot';
    search.value='';issueOptions();roleChange();packet=null;markdown='';
    $('wb-output-section').hidden=true;$('wb-output-body').replaceChildren();$('wb-toast').hidden=true;
  });
  $('wb-copy').addEventListener('click',async()=>{
    if(!packet)return;try{await navigator.clipboard.writeText(markdown);msg('Markdown research packet copied.');}
    catch{msg('Clipboard unavailable; download the Markdown file instead.');}
  });
  $('wb-download-md').addEventListener('click',()=>{if(packet)download('QP-'+packet.issue.id+'-research.md',markdown,'text/markdown;charset=utf-8');});
  $('wb-download-json').addEventListener('click',()=>{if(packet)download('QP-'+packet.issue.id+'-research.json',JSON.stringify(packet,null,2)+'\n','application/json');});
  $('wb-print').addEventListener('click',()=>{if(packet)window.print();});
  // Optional deep link uses public canonical IDs only. No private state or custom text in URL.
  const param=new URLSearchParams(location.search).get('issue');
  if(param){
    const found=issues.find(i=>i.id===param);
    if(found){search.value=found.id;issueOptions();issue.value=found.id;showIssue();}
  }
})();
