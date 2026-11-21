import {day} from "./planes.mjs";
const priority=s=>s==="VERIFIED_HISTORICAL"?0:s==="VERIFIED_CURRENT"?1:2;
export function createLinear(breakdown,{maxParagraphs=80}={}){
 if(!breakdown||breakdown.schema!=="qp.kos.breakdown.v1")
   throw new TypeError("Requires the breakdown output");
 const cited=new Set(breakdown.sources.map(s=>s.id));
 const findings=breakdown.claims.filter(c=>c.sourceIds.length>0&&
   c.sourceIds.every(id=>cited.has(id))&&
   ["VERIFIED_CURRENT","VERIFIED_HISTORICAL","CONTESTED"].includes(c.state));
 findings.sort((a,b)=>{
   const da=day(a.eventDate)||"9999-12-31",db=day(b.eventDate)||"9999-12-31";
   return da.localeCompare(db)||priority(a.state)-priority(b.state)||a.id.localeCompare(b.id);
 });
 // This module NEVER creates new factual prose. A governed synthesis service
 // can later refine transitions while preserving these atomic citations.
 const paras=findings.slice(0,Math.min(Math.max(1,maxParagraphs),120)).map(c=>({
   text:c.text.trim(),claimIds:[c.id],sourceIds:c.sourceIds,
   time:c.eventDate,classification:c.state
 }));
 const linkedSourceCount=new Set(paras.flatMap(p=>p.sourceIds)).size;
 return Object.freeze({
   schema:"qp.kos.linear.v1",
   subjectId:breakdown.subjectId,title:breakdown.title,asOf:breakdown.asOf,
   readabilityTarget:"plain language, approximately grade 10",
   product:"linear narrative evidence sequence, not a completed AI-authored investigative paper",
   status:paras.length>=2&&linkedSourceCount>=2?"PROVISIONAL_CONTEXT":"LIMITED_SUPPORTED_CONTEXT",
   story:paras,
   crosswalkSummary:{
     connectedNodes:breakdown.nodes.length,
     supportedRelations:breakdown.edges.length,
     relevantPlanes:breakdown.planes.map(p=>p.id)
   },
   sources:breakdown.sources,
   sourceIdsUsed:[...new Set(paras.flatMap(p=>p.sourceIds))],
   memoryPointers:breakdown.memoryPointers,
   humanEditorialReviewRequired:true,
   publicationAuthorized:false,
   internalOnly:{
     planeMembership:breakdown.planes,
     capabilities:breakdown.capabilities,
     evidenceHealth:breakdown.boundaries,
     memoryIsNotEvidence:true
   }
 });
}
