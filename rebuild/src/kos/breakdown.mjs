import {PLANES,LAYERS,CLAIM_STATES,day,unique,safeId,publicRecord,membership} from "./planes.mjs";
import {selectMemory} from "./memory.mjs";

const max=(x,defaultValue,ceiling)=>Number.isInteger(x)?Math.max(1,Math.min(x,ceiling)):defaultValue;
const byId=a=>new Map(a.map(x=>[x.id,x]));
const states=new Set(["VERIFIED_CURRENT","VERIFIED_HISTORICAL"]);
const isCurrent=(claim,asOf)=>claim.state!=="VERIFIED_CURRENT"||
 (!claim.validUntil||day(claim.validUntil)&&claim.validUntil>=asOf);

export function createBreakdown(packet,{maxNodes=80,maxHops=3,maxClaims=100,maxEdges=180,maxMemory=16}={}){
 if(!packet||!safeId(packet.subjectId)||!packet.subjectId.startsWith("qp:subject:"))
  throw new TypeError("A stable canonical subject ID is required");
 const date=day(packet.asOf);if(!date)throw new TypeError("Valid asOf date required");
 for(const field of ["sources","nodes","edges","claims"]){
   if(!Array.isArray(packet[field]))throw new TypeError(field+" array required");
   if(new Set(packet[field].map(x=>x.id)).size!==packet[field].length)
     throw new Error("Duplicate "+field+" IDs");
 }
 const sources=new Map(packet.sources.filter(s=>
   safeId(s.id)&&s.id.startsWith("qp:source:")&&publicRecord(s)&&
   s.evidenceReview==="SOURCE_CHECKED"&&day(s.checkedAt)&&
   s.checkedAt<=date&&typeof s.url==="string"&&/^https:\/\//.test(s.url)
 ).map(s=>[s.id,s]));
 const sourceOK=ids=>Array.isArray(ids)&&ids.length>0&&
   ids.every(id=>sources.has(id));
 const nodes=byId(packet.nodes.filter(n=>safeId(n.id)&&publicRecord(n)));
 const subjectNode=nodes.get(packet.subjectId);
 if(!subjectNode)throw new Error("Canonical subject node not present or not public");
 const claims=packet.claims.filter(c=>
   safeId(c.id)&&c.id.startsWith("qp:claim:")&&publicRecord(c)&&
   CLAIM_STATES.includes(c.state)&&typeof c.text==="string"&&
   c.text.trim().length>=18&&Array.isArray(c.nodeIds)&&sourceOK(c.sourceIds)&&
   isCurrent(c,date)&&(!c.eventDate||day(c.eventDate))&&
   (!c.planes||membership(c).length===c.planes.length)
 );
 // A discovered lead can be useful for recall without authorizing a graph edge.
 const substantiated=claims.filter(c=>states.has(c.state));
 const claimMap=byId(substantiated);
 const edges=packet.edges.filter(e=>safeId(e.id)&&
    nodes.has(e.fromId)&&nodes.has(e.toId)&&
    e.reviewState==="SOURCE_CHECKED"&&publicRecord(e)&&
    sourceOK(e.sourceIds)&&
    Array.isArray(e.claimIds)&&e.claimIds.length>0&&
    e.claimIds.every(id=>claimMap.has(id)&&
      claimMap.get(id).sourceIds.some(s=>e.sourceIds.includes(s)))&&
    typeof e.relation==="string"&&e.relation.length>=3);
 const adjacent=new Map();
 for(const e of edges){
   if(!adjacent.has(e.fromId))adjacent.set(e.fromId,[]);
   if(!adjacent.has(e.toId))adjacent.set(e.toId,[]);
   adjacent.get(e.fromId).push(e);adjacent.get(e.toId).push(e);
 }
 const seen=new Set([packet.subjectId]);const pickedEdges=new Map();
 let frontier=[packet.subjectId];
 for(let hop=0;hop<max(maxHops,3,5)&&frontier.length;hop++){
   const next=[];
   for(const id of frontier){
     for(const e of adjacent.get(id)||[]){
       if(pickedEdges.size>=max(maxEdges,180,350))break;
       const other=e.fromId===id?e.toId:e.fromId;
       if(!seen.has(other)&&seen.size>=max(maxNodes,80,150))continue;
       pickedEdges.set(e.id,e);
       if(!seen.has(other)){seen.add(other);next.push(other);}
     }
   }
   frontier=next;
 }
 const selectedClaims=substantiated.filter(c=>c.nodeIds.some(id=>seen.has(id)))
    .slice(0,max(maxClaims,100,220));
 const unresolved=claims.filter(c=>c.state==="CONTESTED"&&c.nodeIds.some(id=>seen.has(id)))
    .slice(0,20).map(c=>({id:c.id,sourceIds:unique(c.sourceIds),text:c.text}));
 const leads=claims.filter(c=>!states.has(c.state)&&c.state!=="CONTESTED"&&c.nodeIds.some(id=>seen.has(id)))
    .slice(0,20).map(c=>({id:c.id,state:c.state,sourceIds:unique(c.sourceIds),
     boundary:"CONTEXT_ONLY_NOT_PROOF"}));
 const cited=new Set([
  ...selectedClaims.flatMap(c=>c.sourceIds),
  ...[...pickedEdges.values()].flatMap(e=>e.sourceIds)
 ]);
 const memory=selectMemory(packet.memory||[],{subjectId:packet.subjectId,nodeIds:[...seen],asOf:date},maxMemory);
 const planes=PLANES.map(id=>({
   id,layerCoverage:unique(selectedClaims.filter(c=>membership(c).includes(id))
    .map(c=>LAYERS.includes(c.layer)?c.layer:"observation")),
   claimIds:selectedClaims.filter(c=>membership(c).includes(id)).map(c=>c.id),
   nodeIds:[...seen].filter(nodeId=>membership(nodes.get(nodeId)).includes(id))
 })).filter(p=>p.claimIds.length||p.nodeIds.length);
 const capabilityPlan=(packet.capabilities||[]).filter(c=>
   c?.status==="LOCAL_IMPLEMENTED"&&c.authority==="READ_ONLY"&&
   Array.isArray(c.modes)&&c.modes.includes("BREAKDOWN")
 ).map(c=>({id:c.id,status:c.status,authority:c.authority}));
 return Object.freeze({
  schema:"qp.kos.breakdown.v1",subjectId:packet.subjectId,
  title:subjectNode.label,asOf:date,mode:"SOURCE_BOUNDED_RESEARCH_DRAFT",
  publicationAuthorized:false,
  nodes:[...seen].map(id=>nodes.get(id)).map(n=>({
   id:n.id,label:n.label,kind:n.kind,planes:membership(n)
  })),
  edges:[...pickedEdges.values()].map(e=>({
   id:e.id,fromId:e.fromId,toId:e.toId,relation:e.relation,
   claimIds:unique(e.claimIds),sourceIds:unique(e.sourceIds)
  })),
  claims:selectedClaims.map(c=>({
   id:c.id,text:c.text,eventDate:c.eventDate||null,
   state:c.state,layer:LAYERS.includes(c.layer)?c.layer:"observation",
   nodeIds:unique(c.nodeIds),planes:membership(c),
   sourceIds:unique(c.sourceIds)
  })),
  unresolved,leads,
  sources:[...cited].map(id=>sources.get(id)).filter(Boolean).map(s=>({
    id:s.id,title:s.title,url:s.url,checkedAt:s.checkedAt,
    publisher:s.publisher||null
  })),
  planes,memoryPointers:memory,
  capabilities:capabilityPlan,
  boundaries:{
   originalSourceCheck:"Claims rely on source-ledger CHECKED declarations; document truth requires independent review",
   memory:"Pointers recall decisions and corrections, never certify facts",
   approval:"No public release or autonomous action without separately validated human approval",
   excludedClaims:packet.claims.length-selectedClaims.length,
   traversal:"Bounded by nodes, hops, edges and claims, no unlimited recursion"
  }
 });
}
