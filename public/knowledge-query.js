'use strict';
// Q-Pueblo universal query boundary. Read-only browser mode: NEVER claims a live source check.
(() => {
 const roles=Object.freeze({
  citizen:{title:'Resident',focus:'Plain-language impact, geography, choices and follow-up',needs:['What is established and when?','What affects residents?','Who is responsible?','What remains unknown?']},
  researcher:{title:'Researcher',focus:'Claims, opposing evidence, provenance, chronology and reproducibility',needs:['Controlling documents and exact scope','Claim-to-source ledger and historical editions','Contrary sources and unresolved conflicts','Methods, assumptions and exportable records']},
  engineer:{title:'Engineer',focus:'Verified asset geometry, technical constraints and engineering assumptions',needs:['Asset IDs, jurisdiction and geometry','Applicable standards and design stage','Quantities, utilities, sequencing and risk','Validated measurements or missing technical inputs']},
  journalist:{title:'Journalist',focus:'Attributable statements, corroboration, counterevidence and corrections',needs:['Original quotes and publication dates','Documentary timeline and contradictions','Independent confirmation and right of reply','Corrections and update history']},
  decision_maker:{title:'Decision-maker',focus:'Authority, resource stages, alternatives, impacts and tradeoffs',needs:['Decision and legal authority','Proposed, appropriated, obligated, paid and outcome stages','Costs, externalities and alternative options','Risks, public concerns and review gates']}
 });
 const cleanDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value.slice(0,10))?value.slice(0,10):null;
 const validUrl=value=>typeof value==='string'&&/^https:\/\/[^\s<>"']+$/i.test(value);
 const validRole=value=>Object.prototype.hasOwnProperty.call(roles,value)?value:'citizen';
 function freshness(report,asOf){
  if(!report)return {state:'NO_PREPARED_MATCH',label:'No prepared answer for this exact question.',checked:null,reviewDue:null,recheckedDuringSearch:false};
  const checked=cleanDate(report.sourceChecked),due=cleanDate(report.reviewDue),day=cleanDate(asOf);
  const state=due&&day&&day>=due?'REVIEW_DUE':checked?'DATED_SOURCE_ANALYSIS':'SOURCE_CHECK_UNKNOWN';
  const label=state==='REVIEW_DUE'?'Earlier source analysis is due for review; it is not current verification.':state==='DATED_SOURCE_ANALYSIS'?'Earlier source analysis is available; it was not rechecked during this search.':'Source-check date is unavailable; treat this as historical information.';
  return {state,label,checked,reviewDue:due,recheckedDuringSearch:false};
 }
 function compose(input){
  const role=validRole(input&&input.role),report=input&&input.matchedReport||null,asOf=input&&input.searchedAt||new Date().toISOString();
  const related=Array.isArray(input&&input.relatedReports)?input.relatedReports:[];
  const issues=Array.isArray(input&&input.issues)?input.issues:[];
  const sourceCount=report&&Array.isArray(report.sources)?report.sources.filter(s=>s&&validUrl(s.url)).length:0;
  return {
   schema:'qp-universal-query-result-v0.1',
   question:String(input&&input.question||''),
   searchedAt:asOf,
   role,
   audience:roles[role],
   coverage:report?'DATED_PREPARED_ANSWER':'AVAILABLE_LEADS_NO_PREPARED_ANSWER',
   matchedReportId:report?report.id:null,
   relatedReportIds:related.map(r=>r.id).filter(Boolean),
   historicalIssueIds:issues.map(i=>i.id).filter(Boolean),
   sourceCount,
   freshness:freshness(report,asOf),
   liveCheck:{attempted:false,completed:false,state:'NOT_CONNECTED',checkedAt:null},
   limitations:[
    'This public page searches its dated local catalog; it does not query current outside records.',
    'Search time is not a source verification time.',
    'No review, source reconciliation, amendment or publication is triggered by this search.'
   ],
   permission:'PUBLIC_CATALOG_ONLY'
  };
 }
 // Candidate source amendments must remain pending until an authorized human review.
 // Existing facts and previous editions are never overwritten by this pure function.
 function compareClaims(previous,incoming){
  const old=new Map((Array.isArray(previous)?previous:[]).filter(x=>x&&typeof x.id==='string').map(x=>[x.id,x]));
  const events=[];
  for(const claim of (Array.isArray(incoming)?incoming:[])){
   if(!claim||typeof claim.id!=='string'||typeof claim.claim!=='string')continue;
   const prior=old.get(claim.id)||null,kind=!prior?'ADD':prior.claim!==claim.claim?'CONFLICT_OR_CORRECTION':'UNCHANGED';
   if(kind==='UNCHANGED')continue;
   const supporting=Array.isArray(claim.sources)&&claim.sources.some(s=>s&&validUrl(s.url));
   events.push({
    claimId:claim.id,kind,status:'PENDING_HUMAN_REVIEW',
    previous:prior?prior.claim:null,candidate:claim.claim,
    sourced:supporting,
    publishable:false,
    reason:supporting?'Source-linked candidate, not independently verified.':'No valid source URL; cannot publish as evidence.'
   });
  }
  return events;
 }
 const api=Object.freeze({roles,validRole,validUrl,freshness,compose,compareClaims});
 if(typeof window!=='undefined')window.QPKnowledge=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})();
