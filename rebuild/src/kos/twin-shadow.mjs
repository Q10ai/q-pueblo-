// KOS v2: bounded candidate twins & read-only shadows. This module does
// not ingest private Q10 models, query external providers, run simulations,
// impersonate people or declare a live operational Digital Twin.
import {PLANES,day} from "./planes.mjs";
export const TWIN_TYPES=Object.freeze([
 "infrastructure","water-energy","operations","governance","finance",
 "health-population","education","housing-community","food-agriculture",
 "environment","transport","digital-cyber","economy-workforce","history-futures"
]);
export const SHADOW_TYPES=Object.freeze([
 "observation","baseline-comparator","counterfactual","risk-failure",
 "cyber-adversarial","data-quality","governance-policy","fiscal",
 "ecological","social-aggregate","model-comparator","historical-version",
 "human-functional"
]);
const PUBLIC_SHADOW_TYPES=new Set(SHADOW_TYPES.filter(k=>k!=="human-functional"));
const STATES=new Set(["REFERENCE_CANDIDATE","SHADOW_TEST_ONLY","SIMULATED_UNVALIDATED","VALIDATION_REVIEW"]);
const PUBLIC="PUBLIC_CONTEXT_ALLOWED";
const okId=(id,prefix)=>typeof id==="string"&&new RegExp("^qp:"+prefix+":[a-z0-9-]{3,100}$").test(id);
const safeText=t=>typeof t==="string"&&t.length>=3&&t.length<=320&&
 !/(?:\bsk-[a-z0-9_-]{12,}|\b(?:password|api[_-]?key|secret)\s*[:=]\s*\S{5,})/i.test(t);
const unique=xs=>[...new Set(xs)];
const isPublic=r=>r?.visibility==="PUBLIC"&&r?.disclosure===PUBLIC&&
 r?.sensitivity!=="PRIVATE"&&r?.sensitivity!=="RESTRICTED";
const rangeOK=(id,arr)=>Array.isArray(arr)&&arr.length>0&&arr.length<=24&&
 arr.every(x=>id.has(x));
const validDate=(date,asOf)=>!!day(date)&&date<=asOf;
function modelList(candidates,kind,breakdown,limits){
 const allowed=kind==="twin"?new Set(TWIN_TYPES):PUBLIC_SHADOW_TYPES;
 const allNodes=new Map(breakdown.nodes.map(n=>[n.id,n]));
 const claimIds=new Set(breakdown.claims.map(c=>c.id));
 const sourceIds=new Set(breakdown.sources.map(s=>s.id));
 const edgeIds=new Set(breakdown.edges.map(e=>e.id));
 const accepted=[];
 const rejected={private:0,unverified:0,unsupported:0,unsafe:0};
 for(const r of (Array.isArray(candidates)?candidates:[]).slice(0,Math.min(limits.maxCandidates||100,200))){
   if(!isPublic(r)){rejected.private++;continue;}
   if(!allowed.has(r.type)||!okId(r.id,kind)||r.subjectId!==breakdown.subjectId||
      !safeText(r.title)||!STATES.has(r.status)||!validDate(r.recordedAt,breakdown.asOf)){
     rejected.unsafe++;continue;
   }
   if(!rangeOK(sourceIds,r.sourceIds)||!rangeOK(claimIds,r.claimIds)||
      !rangeOK(new Set(allNodes.keys()),r.nodeIds)){
     rejected.unverified++;continue;
   }
   if(r.edgeIds!=null && (!Array.isArray(r.edgeIds)||!r.edgeIds.every(id=>edgeIds.has(id)))){
     rejected.unverified++;continue;
   }
   // Never include personal, patient, household, minor or individual replicas
   // in a public/aggregate context, even if the caller mislabels visibility.
   if(r.nodeIds.some(id=>["person","patient","child","individual","household"].includes(
      (allNodes.get(id).kind||"").toLowerCase()))){
      rejected.private++;continue;
   }
   if(r.planes!=null && (!Array.isArray(r.planes)||!r.planes.every(p=>PLANES.includes(p)))){
      rejected.unsafe++;continue;
   }
   if(r.currentIncident===true||r.executionAuthority===true||r.identityAuthority===true||
      r.forecastCertified===true||r.modelEquatedWithReality===true){
     rejected.unsafe++;continue;
   }
   if(r.externalModel===true && r.licenseReviewed!==true){
     rejected.unsupported++;continue;
   }
   accepted.push({
      id:r.id,type:r.type,title:r.title,status:r.status,
      recordedAt:r.recordedAt,subjectId:r.subjectId,
      nodeIds:unique(r.nodeIds),edgeIds:unique(r.edgeIds||[]),
      claimIds:unique(r.claimIds),sourceIds:unique(r.sourceIds),
      planes:unique(r.planes||[]),
      limitation:"MODEL_OR_SHADOW_CANDIDATE_NOT_OBSERVED_TRUTH",
      independentOutcomeValidation:false,
      mayAct:false,mayPublish:false
   });
   if(accepted.length>=Math.min(limits.maxAccepted||32,64))break;
 }
 return {accepted,rejected};
}
export function compileTwinShadow(breakdown,{twins=[],shadows=[]}={},limits={}){
 if(breakdown?.schema!=="qp.kos.breakdown.v1")throw new TypeError("Checked KOS breakdown required");
 const twin=modelList(twins,"twin",breakdown,limits);
 const shadow=modelList(shadows,"shadow",breakdown,limits);
 return Object.freeze({
   schema:"qp.kos.twin-shadow-candidate.v1",
   subjectId:breakdown.subjectId,asOf:breakdown.asOf,
   status:"READ_ONLY_REVIEW_CANDIDATE",operational:false,
   twins:twin.accepted,shadows:shadow.accepted,
   reviewCounts:{twins:twin.rejected,shadows:shadow.rejected},
   coverage:{
     twinTypes:unique(twin.accepted.map(x=>x.type)),
     shadowTypes:unique(shadow.accepted.map(x=>x.type)),
     coveredPlanes:unique([...twin.accepted,...shadow.accepted].flatMap(x=>x.planes)),
     linkedNodes:unique([...twin.accepted,...shadow.accepted].flatMap(x=>x.nodeIds)).length,
     sourceRecords:unique([...twin.accepted,...shadow.accepted].flatMap(x=>x.sourceIds)).length
   },
   boundary:{
     sourceLedger:"SOURCE_CHECKED_IS_CALLER_DECLARED_NOT_INDEPENDENT_CERTIFICATION",
     noPersonalReplica:true,learningRequiresHumanReview:true,
     noModelExecution:true,noLiveSystemControl:true,noPublicPublication:true,
     noSecretQProcesses:true
   }
 });
}
