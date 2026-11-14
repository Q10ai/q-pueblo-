'use strict';
// Q-Pueblo crossover synthesis of EXISTING report passages only.
// Deterministic assembly is not a new independent fact, causal inference, or Q10 runtime execution.
(() => {
 const txt=v=>typeof v==='string'&&v.trim()?v.trim():null;
 const first=v=>Array.isArray(v)?v.map(first).find(Boolean)||null:txt(v);
 const objectText=v=>v&&typeof v==='object'&&!Array.isArray(v)?Object.values(v).map(first).filter(Boolean):[];
 const outcome=v=>first(v)||null;
 const clip=(value,max=620)=>typeof value==='string'?value.slice(0,max):'';
 const combine=(o,keys)=>keys.map(k=>[k,o[k]]).filter(x=>x[1]);
 function synthesize(report,trace,native){
  const present=!!(report&&typeof report==='object'&&typeof report.id==='string');
  const id=present?report.id:null;
  const crossovers=[];
  const q=present&&report.qification&&typeof report.qification==='object'?report.qification:{};
  const pick=(path)=>path.split('.').reduce((v,k)=>v&&typeof v==='object'?v[k]:undefined,report);
  function add(key,title,inputs,conclusion,limits){
   if(!present||inputs.some(x=>!x.text))return;
   crossovers.push({
    key,title,
    state:'SOURCE_ATTRIBUTED_CROSSOVER_ASSEMBLY',
    interpretation:conclusion,
    supportingPassages:inputs.map(x=>({field:x.field,text:clip(x.text)})),
    reportId:id,sourceChecked:txt(report.sourceChecked),
    limitations:limits||'Combined passages are a report-level synthesis, not proof of a new causal, contractual, financial or legal link.',
    claimLevelProvenanceVerified:false,
    newExternalSourcesChecked:false,
    independentlyCorroborated:false
   });
  }
  const money=Array.isArray(report?.money)?report.money:[];
  const moneyText=first(money.map(m=>[m.stage,m.detail,m.status].filter(Boolean).join(' | ')));
  const who=outcome(report?.who), relations=first(report?.relations),
    action=first(report?.actions), alternate=Array.isArray(q.alternatives)?q.alternatives[0]:null;
  const timing=first(objectText(q.temporal)),future=txt(q.temporal?.future);
  const shock=outcome(q.shock),counter=first(report?.counter),reopen=first(q.reopen),
    assessment=txt(q.assessment),children=first(objectText(q.childImpact))||outcome(report?.child);
  const state=txt(report?.reviewDue)&&txt(report.reviewDue)<=(new Date().toISOString()).slice(0,10)?'REVIEW_DUE':'DATED';
  add('authority_resource_delivery','Authority × public resources × delivery',[
   {field:'who',text:who},{field:'money',text:moneyText},{field:'qification.assessment',text:assessment}
  ],'These report passages must be read together: the named parties and money stage establish neither a verified disbursement nor a delivered public result unless the underlying source records explicitly do so. The dated assessment provides the supported boundary.',
  'The report does not independently reconcile all contracts, payments and physical outcomes; retain each stage and scope.');
  add('institution_community','Institutional network × community effects',[
    {field:'relations',text:relations},{field:'qification.childImpact',text:children}
   ],'The documented or qualified institutional relationships and described community effects belong in one impact assessment. The effect passage remains conditional unless the report includes compatible outcome evidence.',
  'An entity graph or observed coexistence does not establish causation or individual household impact.');
  add('time_horizon','History × future uncertainty × Event Horizons',[
    {field:'qification.temporal',text:timing},{field:'qification.temporal.future',text:future},{field:'qification.shock',text:shock}
  ],'The historical baseline and future stress condition together identify a decision-horizon comparison; the future passage is conditional, not a forecast, quantified probability, or proven threshold.',
  'No calibrated event threshold, causal hazard model or live scenario run has been supplied to this page.');
  add('challenge_update','Counterevidence × falsification × recheck',[
    {field:'counter',text:counter},{field:'qification.reopen',text:reopen}
  ],'The contrary account must remain visible alongside the specified recheck triggers. Reopening the finding requires fresh source evidence, not confidence gained from repetition.',
  'Neither a contradiction nor a research lead is equivalent to an adjudicated false statement.');
  add('option_validation','Alternative route × tradeoff × measurable verification',[
    {field:'qification.alternatives.option',text:txt(alternate?.option)},
    {field:'qification.alternatives.tradeoff',text:txt(alternate?.tradeoff)},
    {field:'qification.alternatives.verification',text:txt(alternate?.verification)}
  ],'The proposed alternative is usable only with its documented tradeoff and verification method. It is not an approved decision or a measured improvement.',
  'No implementation authority, cost-efficiency superiority or actual performance is implied.');
  add('practical_accountability','Findings × responsible action × measurable accountability',[
   {field:'qification.assessment',text:assessment},{field:'actions',text:action}
  ],'The assessment and practical action form a testable accountability path: the next action should check the records and outcomes that could change the conclusion.',
  'The action is a report suggestion; completion, approval or service impact is not established.');
  const levels=Array.isArray(trace?.layers)?trace.layers.map(l=>({id:l.id,state:l.state,engineRan:!!l.engineRan,fields:(l.availableFields||[]).slice()})):[];
  const suite=Array.isArray(native?.insights)?native.insights.map(i=>({id:i.id,state:i.state,evidenceClass:i.evidenceClass,answers:i.answer||[]})):[];
  const missing=levels.filter(x=>x.state==='NOT_EVALUATED_HERE');
  const sourceLinks=Array.isArray(report?.sources)?report.sources.filter(s=>s&&typeof s.url==='string'&&/^https:\/\//i.test(s.url)).length:0;
  return {
   schema:'qp-qified-final-crossovers-v0.1',
   reportId:id,
   edition:present?report.version||null:null,
   sourceChecked:present?report.sourceChecked||null:null,
   reviewDue:present?report.reviewDue||null:null,
   freshnessState:present?state:'NO_PREPARED_REPORT',
   reportStatus:'QIFIED_DATED_ANALYSIS_CANDIDATE_NOT_FULL_RUNTIME_CERTIFICATION',
   fullQifiedVerified:false,
   sourceLinks,
   crossoverCount:crossovers.length,
   crossovers,
   layerCoverage:levels,
   qNativeCoverage:suite,
   unevaluatedLevels:missing.map(x=>x.id),
   criticalLimits:[
    'The crossover assembly combines existing dated report passages; it does not add verified facts or prove causal relationships.',
    'A true Full Qified label requires applicable Q10 suite execution and independent source/claim receipts, validated crossovers, human approval and published version history.',
    'The current static client does not call Q10 private engines, source adapters, simulators or approval services.',
    'The dates, source citations, analysis classes and unknowns in the original report remain controlling.'
   ]
  };
 }
 const api=Object.freeze({synthesize});
 if(typeof window!=='undefined')window.QPCrossovers=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})();
