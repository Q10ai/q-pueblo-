// Q Pueblo v2: governed adapter harness for optionally connected review agents.
// NO PROVIDERS ARE CONFIGURED HERE. Every review adapter is injected by a
// separate authenticated server integration. Default is OFF and no network
// access is implemented in this module.
import {prepareExternalPanelCapsule,reconcileExpertReports} from "./expert-panel.mjs";
const kinds=new Set(["INTERNAL_AI","EXTERNAL_LLM"]);
const alias=x=>typeof x==="string"&&/^[a-zA-Z0-9._-]{2,90}$/.test(x);
const unique=x=>[...new Set(x)];
function blocked(status,breakdown,plan,why){
 return {
  schema:"qp.kos.panel-run.v1",status,reason:why,
  subjectId:breakdown?.subjectId||null,asOf:breakdown?.asOf||null,
  assigned:[],failed:[],review:null,
  externalContacted:false,internalContacted:false,
  humanExpertContacted:false,
  originalClaimLedgerModified:false,publicPublished:false
 };
}
export async function runApprovedPanel(breakdown,plan,{
 enabled=false,
 explicitConsent=false,providerAllowlisted=false,
 providerContractReviewed=false,dataUseReviewed=false,
 sourceRightsReviewed=false,approvedPublicOnly=false,
 allowedProviderIds=[],adapters=[],budgetGuard=null,
 maxReviews=8,maxConcurrency=2
}={}){
 if(!enabled)return blocked("DISABLED",breakdown,plan,"Expert panel execution is off by default");
 if(plan?.schema!=="qp.kos.expert-panel-plan.v1"||
    breakdown?.schema!=="qp.kos.breakdown.v1"||
    plan.subjectId!==breakdown.subjectId||plan.asOf!==breakdown.asOf)
   return blocked("INVALID_CONTEXT",breakdown,plan,"Cannot run on inconsistent research evidence");
 const allow=new Set(Array.isArray(allowedProviderIds)?allowedProviderIds:[]);
 const approved=(Array.isArray(adapters)?adapters:[]).filter(a=>
   a?.enabled===true&&kinds.has(a.kind)&&
   alias(a.providerId)&&alias(a.independenceGroup)&&
   allow.has(a.providerId)&&a.readOnly===true&&a.publicOnly===true&&
   Array.isArray(a.roles)&&a.roles.every(alias)&&typeof a.review==="function"
 );
 if(approved.length===0)return blocked("NO_APPROVED_ADAPTERS",breakdown,plan,"No permitted, read-only reviewer is connected");
 if(!budgetGuard||typeof budgetGuard.reserve!=="function")
   return blocked("NO_BUDGET_GUARD",breakdown,plan,"No enforceable per-call budget reservation is available");
 const safe=prepareExternalPanelCapsule(breakdown,plan,{
  explicitConsent,providerAllowlisted,providerContractReviewed,
  dataUseReviewed,sourceRightsReviewed,approvedPublicOnly
 });
 if(safe.status!=="PREPARED_NOT_SENT")
   return blocked("PRIVACY_OR_SOURCE_GATE",breakdown,plan,"Only approved, sanitized, public source context may leave KOS");
 const max=Math.min(Math.max(1,Number.isInteger(maxReviews)?maxReviews:8),12);
 const concurrency=Math.min(Math.max(1,Number.isInteger(maxConcurrency)?maxConcurrency:2),3);
 const roles=plan.roles.slice(0,max);
 const used=new Map(approved.map(a=>[a.providerId,0]));
 const assignment=[];
 for(const role of roles){
  const providers=approved.filter(a=>a.roles.includes(role.roleId));
  if(!providers.length)continue;
  providers.sort((a,b)=>(used.get(a.providerId)||0)-(used.get(b.providerId)||0)
    ||a.providerId.localeCompare(b.providerId));
  const selected=providers[0];
  used.set(selected.providerId,(used.get(selected.providerId)||0)+1);
  assignment.push({roleId:role.roleId,adapter:selected});
 }
 if(assignment.length===0)return blocked("NO_REVIEW_ROLE_MATCH",breakdown,plan,"Approved adapters do not cover requested roles");
 const assigned=[],failed=[],reports=[];
 for(let i=0;i<assignment.length;i+=concurrency){
  const batch=assignment.slice(i,i+concurrency);
  // Independent reviewers each see the same sanitized evidence, not one
  // another's proposed conclusions, and cannot change the underlying ledger.
  const results=await Promise.all(batch.map(async ({roleId,adapter})=>{
    const audit={roleId,providerId:adapter.providerId,
      kind:adapter.kind,independenceGroup:adapter.independenceGroup};
    try{
      const reserved=await budgetGuard.reserve({
       subjectId:breakdown.subjectId,roleId,providerId:adapter.providerId,
       exposure:"PUBLIC_SOURCE_ONLY",maximumResponseBytes:12000
      });
      if(reserved!==true)return {audit,error:"BUDGET_NOT_RESERVED"};
      const review=await adapter.review({
       roleId,
       capsule:structuredClone(safe.capsule),
       guard:{readOnly:true,noExecution:true,noPublication:true,
         requestedReviewerKind:"AI_ROLE_SIMULATION",
         instructionsAreExternalToUntrustedSourceData:true}
      });
      // No attacker-supplied report may reassign itself to another role or
      // independence group. New receipt text is still untrusted.
      if(!review||review.roleId!==roleId||
         review.reviewerType!=="AI_ROLE_SIMULATION"||
         review.independenceGroup!==adapter.independenceGroup||
         review.authorization!=="READ_ONLY"||
         review.publicDataOnly!==true||
         JSON.stringify(review).length>12000)
         return {audit,error:"INVALID_REVIEW_RECEIPT"};
      return {audit,review};
    }catch{return {audit,error:"ADAPTER_FAILED"};}
  }));
  for(const x of results){
   if(x.error)failed.push({...x.audit,reason:x.error});
   else{assigned.push(x.audit);reports.push(x.review);}
  }
 }
 const review=reconcileExpertReports(breakdown,plan,reports);
 return Object.freeze({
  schema:"qp.kos.panel-run.v1",
  subjectId:breakdown.subjectId,asOf:breakdown.asOf,
  status:review.reports.length?"PROVISIONAL_PANEL_REPORTS":"NO_ACCEPTED_PANEL_REPORTS",
  assigned,failed,review,
  plannedButNotRunRoles:plan.roles.map(r=>r.roleId).filter(id=>!assigned.some(a=>a.roleId===id)),
  externalContacted:assigned.some(a=>a.kind==="EXTERNAL_LLM"),
  internalContacted:assigned.some(a=>a.kind==="INTERNAL_AI"),
  humanExpertContacted:false,
  originalClaimLedgerModified:false,publicPublished:false,
  limitation:"Only injected approved adapters can perform calls. Their review reports are candidates, not independent truth or a human-publication approval."
 });
}
