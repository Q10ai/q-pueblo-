// Q Pueblo v2 - deterministic *provisional* production. No model, retrieval,
// publication, memory admission, or private Q capability is invoked here.
import {createHash} from "node:crypto";
const TYPES=new Set(["STORY","REAL_EXAMPLE","RX_OPTION","CONFLICT_PATH","SCENARIO","EVIDENCE_VIEW","LEARNING","ENTITY_VIEW","FINANCE_VIEW","SOURCE_REGISTER","PRIVATE_BUILD_REFERRAL"]);
const STATUSES=new Set(["SUPPORTED_HISTORICAL","SUPPORTED_CURRENT","HYPOTHESIS_NOT_FORECAST","SOURCE_LEAD_NOT_VERIFIED"]);
const FORBIDDEN=/(?:\bsk-[a-z0-9]{12,}\b|\bbearer\s+[a-z0-9_.-]{12,}\b|\b(?:api[_-]?key|password|secret|access[_-]?token)\s*[:=]\s*["']?\S{5,}|\b\d{3}-\d{2}-\d{4}\b)/i;
const plain=s=>typeof s==="string"&&s.trim().length>0&&s.length<=5000&&!FORBIDDEN.test(s);
const all=(a,p)=>Array.isArray(a)&&a.every(p);
const safeId=s=>typeof s==="string"&&/^qp:(?:claim|source|subject|entity|issue|project|asset):[a-zA-Z0-9-]{2,96}$/.test(s);
const unique=a=>[...new Set(a)];
const order=s=>s==="VERIFIED_HISTORICAL"?"SUPPORTED_HISTORICAL":"SUPPORTED_CURRENT";
function fail(message){throw new TypeError(message)}
function makeProduct({kind,subjectId,asOf,data,claims,sources,reviewDue=null,scenario=false,limitations=[]}){
 if(!TYPES.has(kind))fail("Unrecognized product");
 const fingerprint=createHash("sha256").update(JSON.stringify({kind,subjectId,asOf,data,claims,sources})).digest("hex");
 return {
   schema:"qp.kos.public-product.v1",
   productType:kind,subjectId,asOf,revision:"1.0.0",contentFingerprint:"sha256:"+fingerprint,
   reviewState:"PROVISIONAL_NOT_APPROVED",publicPublished:false,
   evidenceClass:scenario?"HYPOTHESIS_NOT_FORECAST":"SOURCE_LEDGER_DECLARED",
   provenance:{supportingClaimIds:unique(claims),sourceIds:unique(sources),
    sourceLedgerReview:"CALLER_DECLARED_NOT_INDEPENDENTLY_RECHECKED",
    humanApproved:false,reviewDue},
   limitations,content:data
 };
}
const claimIndex=breakdown=>new Map(breakdown.claims.map(c=>[c.id,c]));
const sourceIndex=breakdown=>new Map(breakdown.sources.map(s=>[s.id,s]));
function citedClaims(ids,claims){
 if(!all(ids,safeId)||ids.length===0)return null;
 if(!ids.every(id=>claims.has(id)))return null;
 return ids.map(id=>claims.get(id));
}
function permittedText(fields){
 return all(fields,x=>plain(x)&&!/<(?:script|iframe|style)\b/i.test(x));
}
function buildOption(option,breakdown,ci,{minAttributes=3}={}){
 if(!option||option.visibility!=="PUBLIC"||option.sensitivity==="RESTRICTED"||option.sensitivity==="PRIVATE")return null;
 if(!plain(option.title)||!plain(option.summary)||!plain(option.responsibleDecisionMaker))return null;
 if(!["POSSIBILITY","PROPOSED","DOCUMENTED_OPTION"].includes(option.status))return null;
 const cited=citedClaims(option.groundingClaimIds,ci);if(!cited)return null;
 const props=["positives","negatives","risks","needs","gaps","tradeoffs"];
 const fields=Object.fromEntries(props.map(k=>[k,Array.isArray(option[k])?option[k]:[]]));
 if(props.filter(k=>fields[k].length>0).length<minAttributes)return null;
 if(!Object.values(fields).every(xs=>permittedText(xs)&&xs.length<=15))return null;
 const conflict=(option.conflict||null);
 if(conflict&&(typeof conflict!=="object"||!permittedText(conflict.interests||[])||
  !permittedText(conflict.rightsConstraints||[])||
  !permittedText(conflict.resolutionSteps||[])||
  !["NONE","VOLUNTARY_MEDIATION","INSTITUTIONAL_PROCESS","LEGAL_REMEDY"].includes(conflict.path)))return null;
 const sources=unique(cited.flatMap(c=>c.sourceIds));
 const content={
   title:option.title,summary:option.summary,status:option.status,
   responsibleDecisionMaker:option.responsibleDecisionMaker,
   positives:fields.positives,negatives:fields.negatives,
   risks:fields.risks,needs:fields.needs,gaps:fields.gaps,
   tradeoffs:fields.tradeoffs,
   conflict:conflict?{path:conflict.path,interests:conflict.interests||[],
      rightsConstraints:conflict.rightsConstraints||[],resolutionSteps:conflict.resolutionSteps||[],
      humanConsentRequired:true,neutrality:"NO_FAULT_ASSUMPTION"}:null,
   decisionRule:"Comparison only. Source-check costs, authority, rights, actual outcomes and consent before implementation.",
   numericClaimsAllowed:false
 };
 return makeProduct({kind:conflict?"CONFLICT_PATH":"RX_OPTION",
   subjectId:breakdown.subjectId,asOf:breakdown.asOf,data:content,
   claims:option.groundingClaimIds,sources,scenario:option.status==="POSSIBILITY",
   limitations:["Potential benefits and harms are assessments, not measured outcomes","No autonomous decision or action"]});
}
export function createProduction({breakdown,linear},{
 examples=[],options=[],scenarios=[],learning=[],privateBuildRequest=null
}={}){
 if(breakdown?.schema!=="qp.kos.breakdown.v1"||linear?.schema!=="qp.kos.linear.v1"||
  breakdown.subjectId!==linear.subjectId||breakdown.asOf!==linear.asOf)
   fail("Both aligned KOS builds are required");
 const ci=claimIndex(breakdown),si=sourceIndex(breakdown);
 const products=[];
 const story=linear.story.filter(p=>permittedText([p.text])&&
  citedClaims(p.claimIds,ci)&&all(p.sourceIds,id=>si.has(id)));
 if(story.length>0){
   const claimIds=unique(story.flatMap(p=>p.claimIds));
   const sourceIds=unique(story.flatMap(p=>p.sourceIds));
   products.push(makeProduct({kind:"STORY",subjectId:linear.subjectId,asOf:linear.asOf,
    data:{title:linear.title,readabilityTarget:"approximately grade 10",
      narrativeStatus:"CITED_SEQUENCE_NOT_HUMAN_EDITED_FULL_PAPER",
      paragraphs:story.map(p=>({text:p.text,claimIds:p.claimIds,sourceIds:p.sourceIds}))},
    claims:claimIds,sources:sourceIds,limitations:[
      "Not a complete independently fact-checked investigation",
      "Source ledger checks are caller declarations pending independent human review"
    ]}));
 }
 for(const x of (Array.isArray(examples)?examples:[]).slice(0,24)){
   if(!x||x.visibility!=="PUBLIC"||!plain(x.title)||!plain(x.context)||
    !["REAL_HISTORICAL","REAL_CURRENT"].includes(x.kind))continue;
   const cs=citedClaims(x.claimIds,ci);if(!cs||!permittedText([x.title,x.context]))continue;
   const external=unique(cs.flatMap(c=>c.sourceIds));
   if(external.length===0||!external.every(id=>si.has(id)))continue;
   // Real examples must be rooted in *this* breakdown's admitted claim ledger.
   products.push(makeProduct({kind:"REAL_EXAMPLE",subjectId:breakdown.subjectId,
    asOf:breakdown.asOf,data:{title:x.title,context:x.context,kind:x.kind},
    claims:x.claimIds,sources:external,limitations:["Illustrative case; verify whether it applies to another subject"]}));
 }
 for(const option of (Array.isArray(options)?options:[]).slice(0,40)){
   const product=buildOption(option,breakdown,ci);
   if(product)products.push(product);
 }
 for(const s of (Array.isArray(scenarios)?scenarios:[]).slice(0,20)){
   if(!s||s.visibility!=="PUBLIC"||!plain(s.title)||!plain(s.mechanism)||
    !permittedText([...(s.assumptions||[]),...(s.positiveEffects||[]),...(s.negativeEffects||[]),
       ...(s.risks||[]),...(s.unknowns||[])]))continue;
   const cs=citedClaims(s.groundingClaimIds,ci);if(!cs)continue;
   products.push(makeProduct({kind:"SCENARIO",subjectId:breakdown.subjectId,asOf:breakdown.asOf,
    data:{title:s.title,mechanism:s.mechanism,assumptions:s.assumptions||[],
      positives:s.positiveEffects||[],negatives:s.negativeEffects||[],
      risks:s.risks||[],gaps:s.unknowns||[],
      authority:"HUMAN_OWNED",state:"PLANNING_ONLY"},
    claims:s.groundingClaimIds,sources:unique(cs.flatMap(c=>c.sourceIds)),scenario:true,
    limitations:["Not an active hazard notification, verified forecast or authorized action"]}));
 }
 // Learning is only admitted when actual source-grounded educational content exists.
 for(const l of (Array.isArray(learning)?learning:[]).slice(0,20)){
   if(!l||l.visibility!=="PUBLIC"||!plain(l.title)||!plain(l.explanation)||l.status!=="REVIEWED_CONTENT")continue;
   const cs=citedClaims(l.claimIds,ci);if(!cs)continue;
   products.push(makeProduct({kind:"LEARNING",subjectId:breakdown.subjectId,asOf:breakdown.asOf,
    data:{title:l.title,explanation:l.explanation,readability:"grade-10",level:l.level||"GENERAL"},
    claims:l.claimIds,sources:unique(cs.flatMap(c=>c.sourceIds))}));
 }
 const selected=products.slice(0,40);
 const sources=unique(selected.flatMap(p=>p.provenance.sourceIds)).map(id=>si.get(id))
  .filter(Boolean).map(s=>({id:s.id,title:s.title,publisher:s.publisher,url:s.url,checkedAt:s.checkedAt}));
 const claimIds=unique(selected.flatMap(p=>p.provenance.supportingClaimIds));
 // An inquiry is a routing option, NOT an open invitation to paste private data.
 const privateReferral=privateBuildRequest===true?{
   type:"PRIVATE_BUILD_REFERRAL",available:"NOT_CONNECTED",
   message:"A customized private build requires a separately authenticated, consented channel and human scope review. Do not submit personal records, credentials, private Q processes or confidential files in the public site.",
   disclosure:"No full Q access, private data retrieval, or privileged ability is granted by this page."
 }:null;
 const publicView={
  schema:"qp.kos.public-output.v1",subjectId:breakdown.subjectId,asOf:breakdown.asOf,
  status:"PROVISIONAL_READ_ONLY",publicPublished:false,
  summary:"Source-linked draft materials only; independent review required.",
  products:selected,provenance:{
    sourceRecords:sources,claimIds,reviewState:"HUMAN_APPROVAL_REQUIRED",
    sourceCheckBoundary:"SOURCE_LEDGER_DECLARED_NOT_INDEPENDENTLY_RECHECKED",
    identityVersion:"qp.clean.identity.v1",
    toolRoute:"MINIMUM_SUFFICIENT_READ_ONLY",
    publicationAuthority:"HUMAN_ONLY",
    publicDataOnly:true
  },
  privateBuild:privateReferral
 };
 // The public projection has no memory pointer, raw Q skill, plane topology,
 // provider binding, private research prompts, secret or hidden reasoning.
 const str=JSON.stringify(publicView);
 if(FORBIDDEN.test(str))fail("Sensitive text in proposed public output");
 return Object.freeze(publicView);
}
