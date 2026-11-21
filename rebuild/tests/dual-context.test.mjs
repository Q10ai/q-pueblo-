import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createKOSContext} from "../src/kos/index.mjs";
import {createBreakdown} from "../src/kos/breakdown.mjs";
import {createLinear} from "../src/kos/linear.mjs";
import {PLANES} from "../src/kos/planes.mjs";
const data=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const fixture=data("../fixtures/synthetic-water.json");
const clone=o=>JSON.parse(JSON.stringify(o));
test("two builds share a sourced canonical subject and cannot publish",()=>{
 const result=createKOSContext(fixture);
 assert.equal(result.releaseState,"HUMAN_REVIEW_REQUIRED");
 assert.equal(result.breakdown.subjectId,"qp:subject:water");
 assert.equal(result.linear.subjectId,result.breakdown.subjectId);
 assert.equal(result.breakdown.publicationAuthorized,false);
 assert.equal(result.linear.publicationAuthorized,false);
 assert.equal(result.linear.humanEditorialReviewRequired,true);
 assert.equal(result.linear.status,"PROVISIONAL_CONTEXT");
 assert.equal(result.linear.story.length,2);
 assert.deepEqual(result.linear.story.map(x=>x.claimIds[0]),[
 "qp:claim:demo-early","qp:claim:demo-later"]);
 assert(result.linear.story.every(x=>x.sourceIds.length));
 assert(!result.linear.story.some(x=>/stale|private|archive suggested/i.test(x.text)));
 assert.equal(result.breakdown.boundaries.excludedClaims,3);
});
test("source-checked graph edges, plane projections and source IDs connect",()=>{
 const b=createBreakdown(fixture);
 assert.equal(b.nodes.length,3);
 assert.equal(b.edges.length,2);
 assert(b.planes.some(x=>x.id==="physical"));
 assert(b.planes.some(x=>x.id==="economic"));
 assert(b.planes.every(x=>PLANES.includes(x.id)));
 assert(b.edges.every(x=>x.claimIds.every(id=>b.claims.some(y=>y.id===id))));
 assert(b.sources.length===2);
 assert(b.sources.every(x=>x.url.startsWith("https://")));
});
test("memory is a non-evidentiary pointer, private memory is excluded",()=>{
 const b=createBreakdown(fixture);
 assert.deepEqual(b.memoryPointers.map(x=>x.id),["qp:memory:demo-warning"]);
 assert.equal(b.memoryPointers[0].boundary,"MEMORY_IS_NOT_CLAIM_EVIDENCE");
 assert(!b.claims.some(x=>x.id==="qp:memory:demo-warning"));
 const result=createLinear(b);
 assert(result.internalOnly.memoryIsNotEvidence);
 assert(!result.story.some(x=>x.claimIds.includes("qp:memory:demo-warning")));
});
test("candidate archive claims and contested statements cannot certify a graph link",()=>{
 const f=clone(fixture);
 f.edges[0].claimIds=["qp:claim:demo-lead"];
 f.claims.push({id:"qp:claim:demo-dispute",nodeIds:["qp:subject:water"],
  text:"These fictional sources disagree about the duration of the outage.",
  state:"CONTESTED",eventDate:"2026-10-01",planes:["physical"],
  sourceIds:["qp:source:demo-one"],visibility:"PUBLIC",disclosure:"PUBLIC_CONTEXT_ALLOWED"});
 const b=createBreakdown(f);
 assert.equal(b.edges.length,0); // an unverified first hop cannot bridge to the second edge
 assert(b.leads.some(x=>x.id==="qp:claim:demo-lead"));
 assert(b.unresolved.some(x=>x.id==="qp:claim:demo-dispute"));
 assert(!createLinear(b).story.some(x=>x.text.includes("disagree")));
});
test("unreviewed or stale sources fail closed, not promoted by recency",()=>{
 const f=clone(fixture);
 f.sources[0].evidenceReview="NOT_REVIEWED";
 const b=createBreakdown(f);
 assert.equal(b.claims.length,1);
 assert.equal(b.edges.length,0); // an unreviewed first source severs the graph
 assert.equal(createLinear(b).status,"LIMITED_SUPPORTED_CONTEXT");
 const expired=clone(fixture);
 expired.claims[1].validUntil="2026-02-01";
 assert.equal(createBreakdown(expired).claims.length,1);
});
test("invalid subject, duplicate identities and absent public node fail closed",()=>{
 const f=clone(fixture);f.subjectId="water";
 assert.throws(()=>createBreakdown(f),/stable canonical subject/);
 const dup=clone(fixture);dup.sources.push({...dup.sources[0]});
 assert.throws(()=>createBreakdown(dup),/Duplicate sources/);
 const priv=clone(fixture);priv.nodes[0].visibility="PRIVATE";
 assert.throws(()=>createBreakdown(priv),/not present or not public/);
});
test("resource ceilings prevent runaway graph expansion",()=>{
 const b=createBreakdown(fixture,{maxNodes:1,maxEdges:1,maxHops:1,maxClaims:1,maxMemory:1});
 assert.equal(b.nodes.length,1);assert.equal(b.edges.length,0);
 assert.equal(b.claims.length,1);
 assert.equal(b.memoryPointers.length,1);
});
test("capabilities never grant execution or substitute for original records",()=>{
 const b=createBreakdown(fixture);
 assert.deepEqual(b.capabilities,[{id:"local-graph-traverse",status:"LOCAL_IMPLEMENTED",authority:"READ_ONLY"}]);
 const f=clone(fixture);f.capabilities=[{id:"pretend-live",status:"NOT_CONNECTED",authority:"NONE",modes:["BREAKDOWN"]}];
 assert.equal(createBreakdown(f).capabilities.length,0);
});
test("identity is separate from tile order; SHOCK is a universal method",()=>{
 const reg=data("../data/subjects.v1.json");
 const ids=new Set(reg.subjects.map(x=>x.id));
 assert.equal(ids.size,25);
 assert.deepEqual(reg.subjects.slice(0,4).map(x=>x.slug),["governance","ai","money","water"]);
 assert(!ids.has("qp:subject:shock"));
 assert(reg.sitewideMethods.some(x=>x.id==="qp:method:shock"));
 assert(reg.subjects.every(x=>x.route.startsWith("/subjects/")&&x.id.startsWith("qp:subject:")));
});
