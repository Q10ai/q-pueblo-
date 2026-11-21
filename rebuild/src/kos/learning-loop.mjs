// Evidence-based continuous-learning candidate register. Deliberately not a
// self-modifying feedback loop or a source of execution/publication authority.
import {day} from "./planes.mjs";
const KINDS=new Set([
 "SOURCE_RECHECK","CORRECTION","FALSIFICATION","MISSING_EVIDENCE",
 "NEW_DOCUMENT","OUTCOME_COMPARISON","SHADOW_TEST_RECEIPT",
 "TWIN_VALIDATION","MODEL_DISAGREEMENT","READER_CHALLENGE",
 "PUBLIC_DESIGN_FEEDBACK","RED_TEAM_FINDING","HISTORICAL_AMENDMENT"
]);
const states=new Set(["CANDIDATE","HELD","REJECTED","REVIEW_ELIGIBLE"]);
const isPublic=x=>x?.visibility==="PUBLIC"&&x?.disclosure==="PUBLIC_CONTEXT_ALLOWED"&&
 x.sensitivity!=="PRIVATE"&&x.sensitivity!=="RESTRICTED";
const valid=(id,prefix)=>typeof id==="string"&&new RegExp("^qp:"+prefix+":[a-z0-9-]{3,100}$").test(id);
const safeText=x=>typeof x==="string"&&x.trim().length>=8&&x.length<=1200&&
 !/(?:\bsk-[a-z0-9_-]{12,}|\b(?:password|api[_-]?key|secret|token)\s*[:=]\s*\S{5,})/i.test(x);
export function stageLearning(breakdown,candidates=[],{maxCandidates=60}={}){
 if(breakdown?.schema!=="qp.kos.breakdown.v1")throw new TypeError("Checked KOS breakdown required");
 const src=new Set(breakdown.sources.map(s=>s.id));
 const claims=new Set(breakdown.claims.map(s=>s.id));
 const admitted=[],skipped={private:0,invalid:0,missingEvidence:0};
 for(const c of (Array.isArray(candidates)?candidates:[]).slice(0,Math.min(maxCandidates,120))){
   if(!isPublic(c)){skipped.private++;continue;}
   if(!valid(c.id,"learning")||c.subjectId!==breakdown.subjectId||
     !KINDS.has(c.kind)||!states.has(c.reviewStatus)||
     !safeText(c.description)||!day(c.observedAt)||!day(c.recordedAt)||
     c.observedAt>breakdown.asOf||c.recordedAt>breakdown.asOf ||
     c.autonomousPromotion===true||c.actionExecuted===true){
     skipped.invalid++;continue;
   }
   const sources=c.sourceIds||[],sourceFound=Array.isArray(sources)&&sources.length>0&&sources.length<=24&&
     sources.every(id=>src.has(id));
   const related=c.claimIds||[],claimFound=Array.isArray(related)&&related.length<=24&&related.every(id=>claims.has(id));
   if(!sourceFound||!claimFound){skipped.missingEvidence++;continue;}
   admitted.push({
      id:c.id,kind:c.kind,description:c.description,
      subjectId:breakdown.subjectId,observedAt:c.observedAt,recordedAt:c.recordedAt,
      sourceIds:[...new Set(sources)],claimIds:[...new Set(related)],
      reviewStatus:c.reviewStatus,disposition:"AWAITING_HUMAN_AMENDMENT_REVIEW",
      acceptedAsFact:false,appliedToProduction:false,
      modelPromoted:false,changedSiteContent:false
   });
 }
 return Object.freeze({
   schema:"qp.kos.learning-candidates.v1",subjectId:breakdown.subjectId,
   asOf:breakdown.asOf,candidates:admitted,skipped,
   nextStep:"Independent source and contradiction check, human reviewer and separately versioned amendment.",
   sourceBoundary:"Checked source IDs here are ledger-declared, not independent verification.",
   autoLearn:false,autoPublish:false,autoExecute:false,
   historyImmutable:true,correctionBySupersessionOnly:true
 });
}
