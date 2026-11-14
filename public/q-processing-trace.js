'use strict';
// Static Q report processing trace; maps existing report fields to canonical Q10 layer responsibilities.
// THIS DOES NOT RUN OR CLAIM TO RUN the Q10 core engines.
(() => {
 const nonempty=v=>Array.isArray(v)?v.length>0:typeof v==='string'?v.trim().length>0:!!(v&&typeof v==='object'&&Object.keys(v).length);
 const layers=Object.freeze([
  {id:'PROVENANCE',label:'External evidence admission',owner:'Source/claim ledger',fields:['sources','claims']},
  {id:'QIFY',label:'QIFY structured evidence',owner:'QIFY',fields:['whatKnown','keyFacts','claims']},
  {id:'GLEAN',label:'GLEAN relationship and consequence insights',owner:'GLEAN',fields:['relations','child']},
  {id:'SUPRA',label:'SUPRA cross-system possibility synthesis',owner:'SUPRA',fields:['qification.temporal','qification.shock']},
  {id:'RX',label:'RX challenge and counterevidence',owner:'RX Council',fields:['counter','rx']},
  {id:'EE_INTEL',label:'Minimum-sufficient intelligence/resource analysis',owner:'EE_INTEL',fields:['ee']},
  {id:'EH_EVID',label:'Evidence Health',owner:'EH_EVID',fields:['sourceChecked','reviewDue']},
  {id:'EH_CONS',label:'Event Horizons — thresholds, consequences, irreversible decisions and cascading effects',owner:'EH_CONS',fields:['qification.temporal.future','qification.shock','rx']},
  {id:'T2Y',label:'Truth-to-Yield assessment',owner:'T2Y',fields:['t2y']},
  {id:'LEAP',label:'Alternative options and future branches',owner:'LEAP',fields:['options','qification.alternatives']},
  {id:'TSLP',label:'Simulation, red-team and learning receipts',owner:'TSLP',fields:[]},
  {id:'HUMAN_GATE',label:'Human release/authority gate',owner:'Human',fields:[]}
 ]);
 const get=(r,path)=>path.split('.').reduce((v,k)=>v&&typeof v==='object'?v[k]:undefined,r);
 function trace(report,asOf){
  const day=(typeof asOf==='string'?asOf:new Date().toISOString()).slice(0,10);
  const sources=new Set(Array.isArray(report?.sources)?report.sources.filter(s=>s&&typeof s.id==='string').map(s=>s.id):[]);
  const claims=Array.isArray(report?.claims)?report.claims:[];
  const unmapped=claims.filter(c=>!c||!Array.isArray(c.sourceIds)||!c.sourceIds.length||c.sourceIds.some(id=>!sources.has(id))).map(c=>c?.id||'UNNAMED_CLAIM');
  return {
   schema:'qp-q10-report-processing-trace-v0.1',
   reportId:report?.id||null,edition:report?.version||null,
   assembledFrom:'EXISTING_DATED_PUBLIC_REPORT_FIELDS_ONLY',
   newSourceRetrieval:false,coreEnginesExecuted:false,externalEffectsAuthorized:false,
   sourceMapping:{claims:claims.length,sourceRecords:sources.size,unmappedClaimIds:unmapped},
   layers:layers.map(l=>{
    const found=l.fields.filter(path=>nonempty(get(report,path)));
    let state=found.length?'PRIOR_REPORT_CONTENT_AVAILABLE':'NOT_EVALUATED_HERE';
    if(l.id==='EH_EVID'&&found.length){
     state=report?.reviewDue&&day>=report.reviewDue?'PREVIOUS_SOURCE_REVIEW_DUE':'DATED_SOURCE_INFO_ONLY';
    }
    if(l.id==='EE_INTEL'&&found.length)state='PREPARED_NARRATIVE_NO_OPTIMIZATION_RUN';
    if(l.id==='T2Y'&&found.length)state='PREPARED_NARRATIVE_NO_SCORE_VALIDATION';
    if(l.id==='SUPRA'&&found.length)state='PREPARED_POSSIBILITY_ANALYSIS_NOT_ENGINE_EXECUTION';
    if(l.id==='LEAP'&&found.length)state='PREPARED_OPTIONS_NOT_SIMULATED';
    if(l.id==='EH_CONS')state=found.length?'PREPARED_EVENT_HORIZONS_NARRATIVE_NO_GATE_EXECUTION':'NOT_EVALUATED_HERE';
    if(l.id==='TSLP'||l.id==='HUMAN_GATE')state='NOT_EVALUATED_HERE';
    return {id:l.id,label:l.label,owner:l.owner,state,availableFields:found,engineRan:false};
   }),
   limitations:[
    'This is a static trace of Q-style content already present in a published report, not proof of Q10 core harness execution.',
    'External research and provider results remain untrusted until admitted under source, evidence and privacy controls.',
    'Individual inference-to-source provenance and scored validation must be established before qualifying a full Q10-layer execution receipt.',
    'No source refresh, external-effect authorization, live simulation or automatic publication happens in this client.'
   ]
  };
 }
 const api=Object.freeze({layers,trace});
 if(typeof window!=='undefined')window.QPProcessingTrace=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})();
