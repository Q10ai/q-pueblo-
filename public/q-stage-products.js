'use strict';
// Q-Pueblo transparent stage products: visible evidence, methods, trace, not private model deliberation.
// No live search, new Q10 engine execution, monitoring, publication or forecast is implied.
(() => {
 const valid=v=>typeof v==='string'&&v.trim()?v.trim():null;
 const flatten=v=>Array.isArray(v)?v.flatMap(flatten):valid(v)?[valid(v)]:[];
 const fields=(r,keys)=>keys.flatMap(p=>{
  const v=p.split('.').reduce((a,k)=>a&&typeof a==='object'?a[k]:undefined,r);
  return flatten(v).map(x=>({field:p,statement:x}));
 });
 const first=v=>flatten(v)[0]||null;
 const records=(items,keyFields)=>Array.isArray(items)?items.map(x=>{
  if(typeof x==='string')return x;
  if(!x||typeof x!=='object')return '';
  return keyFields.map(k=>x[k]&&k+': '+x[k]).filter(Boolean).join(' | ');
 }).filter(Boolean):[];
 const stages=Object.freeze([
  {id:'ANSWER',title:'Immediate answer',product:'Public answer snapshot',reason:'People need usable answers, not a list of research questions.'},
  {id:'EVIDENCE',title:'Evidence and source health',product:'Source register with dates and provenance',reason:'False, stale, copied or contradictory sources distort everything downstream.'},
  {id:'AUTHORITY',title:'Who, what, how, money and accountability',product:'Responsibility, timeline and funding-stage explanation',reason:'Owners, regulators, contractors, appropriations, payments and results must never be conflated.'},
  {id:'CHILD_ZERO',title:'Child Zero and future generations',product:'Child impact and intergenerational protection assessment',reason:'Children, dependents and future generations are often not represented when decisions are made.'},
  {id:'GOVERNANCE',title:'Governance, rights, safety and review gates',product:'Authority and public-safety boundary statement',reason:'Knowing what is legally, operationally and ethically permissible matters even when no one asks.'},
  {id:'Q_NATIVE',title:'Q-native overlooked findings',product:'Systemic connections, counterevidence and independent Q analysis',reason:'Single-topic explanations miss cross-domain effects and less visible alternatives.'},
  {id:'EVENT_HORIZONS',title:'Event Horizons and reversibility',product:'Conditional thresholds, escalation pathways and recovery considerations',reason:'Delay and irreversible commitments can remove otherwise available choices.'},
  {id:'OPTIONS_FIXES',title:'Options, repairs, tradeoffs and accountable fixes',product:'Alternatives with their validation criteria',reason:'Research is incomplete as decision support when it does not explain feasible choices and consequences.'},
  {id:'LEAP',title:'LEAP: anticipate and prepare',product:'Preparation horizons, change signals, fallback and next-review triggers',reason:'Reacting only after harm, deadlines or project commitments is too late.'},
  {id:'EE_T2Y',title:'EE_INTEL and Truth-to-Yield',product:'Resource-efficiency and measurable-benefit bounds',reason:'Intelligence, energy, public resources, time, attention and trust are scarce.'},
  {id:'OUTCOME',title:'Reality audit and continual correction',product:'How to verify actual results and reopen the analysis',reason:'An announcement or proposal does not prove a delivered outcome.'},
  {id:'CROSSOVERS',title:'Final Qified crossover synthesis',product:'Integrated scope, dependencies, options and uncertainty',reason:'Isolated findings do not reveal total public consequences or opportunity costs.'}
 ]);
 function build({question='',report=null,scope=null,qNative=null,crossovers=null,asOf=null}={}){
  const r=report&&typeof report==='object'?report:null;
  const q=r?.qification||{};
  const sourceDate=valid(r?.sourceChecked)||null;
  const text=first(r?.summary);
  const sourceItems=records(r?.sources,['title','url','asOf','checked']);
  const facts=[...flatten(r?.whatKnown),...records(r?.keyFacts,['label','value','stage','source'])];
  const money=records(r?.money,['stage','detail','status']);
  const alternatives=records(q?.alternatives,['option','tradeoff','owner','verification']);
  const external=Array.isArray(qNative?.insights)?qNative.insights.filter(x=>x.state==='PREVIOUSLY_PREPARED_Q_ANALYSIS'):[];
  const impacts=flatten([r?.child,q?.childImpact?.past,q?.childImpact?.present,q?.childImpact?.future]);
  const horizon=flatten([q?.temporal?.future,q?.shock,r?.rx]);
  const reopen=flatten([q?.reopen,r?.unknowns]);
  const actions=flatten(r?.actions);
  const cross=Array.isArray(crossovers?.crossovers)?crossovers.crossovers:[];
  const preparation=[
   {id:'NOW',label:'What can be done with today's evidence',items:actions.slice(0,3),basis:'Prior report suggestions, not completed actions'},
   {id:'CHANGE',label:'Developments to watch and verify',items:reopen.slice(0,5),basis:'Existing report recheck triggers; no monitoring is active'},
   {id:'FUTURE',label:'Conditional future and resilience',items:flatten([q?.temporal?.future,q?.shock]),basis:'Scenarios, not calibrated predictions or probabilities'},
   {id:'ALTERNATIVES',label:'Fallback choices and tradeoffs',items:alternatives.slice(0,3),basis:'Prepared options, not authorization or economic superiority'}
  ];
  const raw={
   ANSWER:flatten([text]),
   EVIDENCE:sourceItems,
   AUTHORITY:[...flatten([r?.who,r?.what,r?.when,r?.where,r?.how]),...money,...facts.slice(0,4)],
   CHILD_ZERO:impacts,
   GOVERNANCE:flatten([r?.who,r?.rx,q?.assessment]).slice(0,6),
   Q_NATIVE:external.flatMap(x=>x.answer.map(t=>x.id+': '+t)).slice(0,22),
   EVENT_HORIZONS:horizon,
   OPTIONS_FIXES:[...alternatives,...actions],
   LEAP:preparation.flatMap(x=>x.items.map(t=>x.id+': '+t)),
   EE_T2Y:flatten([r?.ee,r?.t2y]),
   OUTCOME:[...actions,...reopen],
   CROSSOVERS:cross.map(x=>x.title+': '+x.interpretation)
  };
  const items=stages.map(stage=>{
   const passages=(raw[stage.id]||[]).filter(Boolean);
   const state=passages.length?'PREPARED_DATED_REPORT_CONTENT':'NO_EVIDENCED_ANSWER_IN_PREPARED_REPORT';
   const sourceBounded=!!r&&!!sourceItems.length;
   return {...stage,state,sourceBounded,sourceChecked:sourceDate,executedNow:false,liveVerified:false,
    answer:passages.length?passages:['This dimension cannot be established from the available prepared public report. No answer or completion is invented.'],
    limitations:stage.id==='CHILD_ZERO'?'This assessment is always required. An absence of measured child harm/benefit is not proof of no child impact.':
    stage.id==='LEAP'?'These are proposals, conditional futures and review triggers, not active monitoring or guaranteed predictions.':
    stage.id==='CROSSOVERS'?'Crossovers combine prior report passages. Their causal status and supporting claim chains require independent validation.':
    'Previously prepared report content, not an independent source check or live Q10 module execution.'};
  });
  const child=items.find(x=>x.id==='CHILD_ZERO');
  const prepared=items.find(x=>x.id==='LEAP');
  const last=items[items.length-1];
  return {
   schema:'qp-qification-stage-products-v0.1',
   question:String(question||''),reportId:r?.id||null,
   sourceChecked:sourceDate,queryAsOf:valid(asOf)||new Date().toISOString(),
   qificationStarted:true,fullQifiedVerified:false,
   scope:scope?.assetKind||'GENERAL_UNRESOLVED_SCOPE',
   productCount:items.length,
   stages:items,
   childAssurance:{mandatory:true,state:child.state,measuredImpact:false,statement:child.answer[0],futureGenerationCoverage:!!q.childImpact?.future},
   leapPlan:{state:prepared.state,preparation,activeMonitoring:false,futureForecastVerified:false},
   finalCrossover:{state:last.state,count:cross.length,causalityEstablished:false},
   humanReviewRequired:true,
   auditBoundary:'This is a publishable explanatory method and source/evidence trace, NOT hidden model chain-of-thought. It provides dated record excerpts, assumptions, decision criteria, stage outcomes and explicit limitations; no private internal deliberation or undocumented engine execution is claimed.'
  };
 }
 const api=Object.freeze({build,stages});
 if(typeof window!=='undefined')window.QPStageProducts=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})();
