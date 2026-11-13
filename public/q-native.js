'use strict';
// Q-native intelligence projection: extracts pre-existing, dated Q analyses.
// It does NOT autonomously discover new findings, verify sources, or publish claims.
(() => {
 const trimmed=v=>typeof v==='string'&&v.trim()?v.trim():null;
 const list=v=>Array.isArray(v)?v.flatMap(list):trimmed(v)?[trimmed(v)]:[];
 const findReport=report=>report&&typeof report==='object'?report:null;
 function derive(report){
  const r=findReport(report);
  const q=r&&r.qification&&typeof r.qification==='object'?r.qification:{};
  const insights=[];
  function add(id,title,items,evidenceClass){
   const answer=list(items);
   insights.push({
    id,title,
    state:answer.length?'PREVIOUSLY_PREPARED_Q_ANALYSIS':'NOT_YET_EVIDENCED',
    evidenceClass:answer.length?evidenceClass:'UNKNOWN',
    answer,
    sourceScope:r?.id||null,
    reviewedAt:r?.sourceChecked||null,
    note:answer.length?'Prior report analysis; not a new query-time discovery or independent validation.':'Not answered by the available prepared report. Do not invent or treat a question as a finding.'
   });
  }
  // Q's independent analytical questions should become supplied answers.
  // Values are transcribed from prepared report fields, never inferred by code.
  add('underlying','What is the underlying problem beyond the headline?',[
   q.assessment,...list(q.reasoning)
  ],'PREPARED_INFERENCE_AND_ASSESSMENT');
  add('hidden_links','Which less-visible systems and parties are implicated?',
   r?.relations||[],'PREPARED_RELATIONSHIP_ANALYSIS');
  add('second_order','What consequences might affect others or later generations?',[
   r?.child, q.childImpact&&typeof q.childImpact==='object'?q.childImpact.present:null,
   q.childImpact&&typeof q.childImpact==='object'?q.childImpact.future:null
  ],'PREPARED_CONDITIONAL_IMPACT');
  add('failure','How might this fail under stress or produce an unintended effect?',[
   q.shock,r?.rx
  ],'CONDITIONAL_STRESS_AND_REVERSIBILITY');
  add('better_routes','What alternatives could produce a better, verifiable result?',
   Array.isArray(q.alternatives)?q.alternatives.map(x=>[x.option&&'Option: '+x.option,x.tradeoff&&'Tradeoff: '+x.tradeoff,x.verification&&'How to validate: '+x.verification].filter(Boolean).join(' | ')):[],
   'PREPARED_ALTERNATIVES_NOT_AUTHORIZATION');
  add('efficiency','What is the least costly responsible intelligence or action path?',[
   r?.ee,r?.t2y
  ],'EE_T2Y_METHOD_AS_PREPARED');
  add('falsification','What evidence could change or overturn this conclusion?',[
   ...(Array.isArray(q.reopen)?q.reopen:[]),
   ...(Array.isArray(r?.unknowns)?r.unknowns:[])
  ],'REVIEW_REOPEN_TRIGGERS');
  add('path','What useful result can be delivered and verified next?',
   r?.actions||[],'PREPARED_PRACTICAL_ACTIONS');
  return {
   schema:'qp-native-insight-projection-v0.1',
   reportId:r?.id||null,
   reportEdition:r?.version||null,
   sourceChecked:r?.sourceChecked||null,
   reviewDue:r?.reviewDue||null,
   derivedNow:false,
   claimsIndividuallyMapped:false,
   disclaimer:'These are the existing Qified report analyses, including inferences and conditional possibilities. Report-level original sources are linked in the complete report; the original claim ledger does not yet prove each analytical insight individually. No live fact checking, autonomous insight generation, or source reconciliation occurred here.',
   insights
  };
 }
 const api=Object.freeze({derive});
 if(typeof window!=='undefined')window.QPNative=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})();
