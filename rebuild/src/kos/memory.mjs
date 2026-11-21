import {day,publicRecord,unique} from "./planes.mjs";

// Memory is recall context, not factual support. Admissions and corrections
// require human authority. Contradictions are kept as separate review signals.
export function selectMemory(entries=[],scope={},budget=16){
 if(!Array.isArray(entries))throw new TypeError("Memory entries must be an array");
 const ids=new Set([scope.subjectId,...(scope.nodeIds||[])]);
 const asOf=day(scope.asOf)||"9999-12-31";
 return entries.filter(x=>
   publicRecord(x)&&x.admission==="HUMAN_ADMITTED"&&
   typeof x.authorizedBy==="string"&&x.authorizedBy.length>0&&
   day(x.recordedAt)&&x.recordedAt<=asOf&&
   (!x.validUntil||day(x.validUntil)&&x.validUntil>=asOf)&&
   Array.isArray(x.scopeIds)&&x.scopeIds.some(id=>ids.has(id))&&
   Array.isArray(x.provenanceIds)&&x.provenanceIds.length>0
 ).sort((a,b)=>{
    const pa=(a.scopeIds||[]).includes(scope.subjectId)?1:0;
    const pb=(b.scopeIds||[]).includes(scope.subjectId)?1:0;
    return pb-pa||b.recordedAt.localeCompare(a.recordedAt)||a.id.localeCompare(b.id);
 }).slice(0,Math.min(Math.max(budget,0),64)).map(x=>({
   id:x.id,kind:x.kind||"CONTEXT",recordedAt:x.recordedAt,
   scopeIds:unique(x.scopeIds),provenanceIds:unique(x.provenanceIds),
   supersedesId:x.supersedesId||null,
   contradictsIds:unique(x.contradictsIds||[]),
   boundary:"MEMORY_IS_NOT_CLAIM_EVIDENCE"
 }));
}
