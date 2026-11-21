// Q Pueblo v2: LEAP is a read-only KOS foresight / options lens.
// The engine does not decide policy, change reality, publish or forecast probabilities.
const goodState=new Set(["CONSIDERED","PROPOSED","SOURCE_DOCUMENTED"]);
const status=new Set(["SCENARIO_ONLY","PROVISIONAL_OPTION_REVIEW"]);
const safeWord=x=>typeof x==="string"&&x.trim().length>=4&&x.length<=750&&
 !/(?:sk-[a-z0-9_-]{12,}|(?:password|api[_-]?key|secret|token)\s*[:=]\s*\S{5,}|-----BEGIN .*PRIVATE KEY-----)/i.test(x);
const list=(a,max=12)=>Array.isArray(a)&&a.length<=max&&a.every(safeWord);
const unique=a=>[...new Set(a)];
function evaluate(p,claims,sources,nodes,asOf){
 if(!p||p.visibility!=="PUBLIC"||p.disclosure!=="PUBLIC_CONTEXT_ALLOWED"||
 p.sensitivity==="PRIVATE"||p.sensitivity==="RESTRICTED")return null;
 if(!/^qp:leap:[a-z0-9-]{3,100}$/.test(p.id||"")||!safeWord(p.title)||
 !safeWord(p.decisionOwner)||!safeWord(p.mechanism)||!goodState.has(p.stage)||
 !["LOW","MODERATE","HIGH","UNKNOWN"].includes(p.complexity)||!list(p.positiveEffects)||
 !list(p.negativeEffects)||!list(p.risks)||!list(p.needs)||!list(p.gaps)||
 !list(p.rightsConstraints)||!list(p.outcomeChecks)||!list(p.actions))return null;
 if(!Array.isArray(p.claimIds)||p.claimIds.length===0||p.claimIds.length>20||
 !p.claimIds.every(id=>claims.has(id)))return null;
 if(!Array.isArray(p.sourceIds)||p.sourceIds.length===0||p.sourceIds.length>20||
 !p.sourceIds.every(id=>sources.has(id)))return null;
 if(!p.sourceIds.every(id=>p.claimIds.some(cl=>claims.get(cl).sourceIds.includes(id))))return null;
 if(!Array.isArray(p.nodeIds)||p.nodeIds.length===0||p.nodeIds.length>20||
 !p.nodeIds.every(id=>nodes.has(id)))return null;
 if(p.currentIncident===true||p.certifiedForecast===true||p.autonomousDecision===true||
 p.externalActionExecuted===true||p.requiresPrivateData===true)return null;
 if(p.reviewBy!=null&&!/^\d{4}-\d{2}-\d{2}$/.test(p.reviewBy))return null;
 const pros=unique(p.positiveEffects),cons=unique(p.negativeEffects),risks=unique(p.risks);
 if(!pros.length&&!cons.length&&!risks.length)return null;
 return {
  id:p.id,title:p.title,decisionOwner:p.decisionOwner,mechanism:p.mechanism,
  stage:p.stage,complexity:p.complexity,epistemicState:"SCENARIO_ONLY",
  positives:pros,negatives:cons,risks,needs:unique(p.needs),gaps:unique(p.gaps),
  rightsConstraints:unique(p.rightsConstraints),outcomeChecks:unique(p.outcomeChecks),
  nextSteps:unique(p.actions),reviewBy:p.reviewBy||null,
  claimIds:unique(p.claimIds),sourceIds:unique(p.sourceIds),nodeIds:unique(p.nodeIds),
  outcomeMeasured:false,implementationApproved:false
 };
}
export function compileLEAP(breakdown,candidates=[],{maxOptions=12}={}){
 if(breakdown?.schema!=="qp.kos.breakdown.v1")
  throw new TypeError("Checked KOS breakdown required");
 const claims=new Map(breakdown.claims.map(x=>[x.id,x]));
 const sources=new Set(breakdown.sources.map(x=>x.id));
 const nodes=new Set(breakdown.nodes.map(x=>x.id));
 const accepted=[],rejected={unsupported:0,duplicate:0};
 const seen=new Set();
 const cap=Math.min(Math.max(Number.isInteger(maxOptions)?maxOptions:12,1),24);
 for(const p of (Array.isArray(candidates)?candidates:[]).slice(0,60)){
  if(seen.has(p?.id)){rejected.duplicate++;continue;}
  seen.add(p?.id);
  const option=evaluate(p,claims,sources,nodes,breakdown.asOf);
  if(!option){rejected.unsupported++;continue;}
  accepted.push(option);
  if(accepted.length>=cap)break;
 }
 return Object.freeze({
   schema:"qp.kos.leap-review.v1",subjectId:breakdown.subjectId,
   asOf:breakdown.asOf,status:"PROVISIONAL_HUMAN_REVIEW_REQUIRED",
   optionCount:accepted.length,options:accepted,rejected,
   futureClaimsAreEvidence:false,
   evidenceRule:"Source-linked prior facts ground the option's context; proposed outcomes are not established or probable facts.",
   compareRule:"Disclose positives, negatives, costs where real, rights, implementation constraints, risks, needs, gaps and measurable checks; do not rank by unsupported scores.",
   humanDecisionRequired:true,
   publishAuthorized:false,actionAuthorized:false,
   privacy:"PUBLIC_AGGREGATE_ONLY"
 });
}
