import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createKOSContext} from "../src/kos/index.mjs";
import {compileTwinShadow,TWIN_TYPES,SHADOW_TYPES} from "../src/kos/twin-shadow.mjs";
import {stageLearning} from "../src/kos/learning-loop.mjs";
const load=(path)=>JSON.parse(readFileSync(new URL(path,import.meta.url),"utf8"));
const fixture=load("../fixtures/synthetic-water.json");
const clone=x=>JSON.parse(JSON.stringify(x));
const model=()=>({
 id:"qp:twin:sample-water-model",type:"water-energy",subjectId:"qp:subject:water",
 title:"Fictional water operations comparison",status:"SIMULATED_UNVALIDATED",
 visibility:"PUBLIC",disclosure:"PUBLIC_CONTEXT_ALLOWED",recordedAt:"2026-11-20",
 sourceIds:["qp:source:demo-one"],claimIds:["qp:claim:demo-early"],
 nodeIds:["qp:subject:water","qp:entity:demo-utility"],edgeIds:["qp:edge:demo-connection"],
 planes:["physical","economic"],currentIncident:false,executionAuthority:false
});
const shadow=()=>({...model(),id:"qp:shadow:sample-comparator",type:"baseline-comparator",
 title:"Fictional historical comparator",status:"SHADOW_TEST_ONLY"});
const learning=()=>({
 id:"qp:learning:sample-recheck",subjectId:"qp:subject:water",
 kind:"CORRECTION",description:"The fictional source suggests revisiting an earlier maintenance estimate.",
 visibility:"PUBLIC",disclosure:"PUBLIC_CONTEXT_ALLOWED",
 reviewStatus:"CANDIDATE",sourceIds:["qp:source:demo-one"],
 claimIds:["qp:claim:demo-early"],observedAt:"2026-11-19",
 recordedAt:"2026-11-20",actionExecuted:false
});
test("registry independently covers real-world twins, shadows and private exclusion",()=>{
 const r=load("../data/twin-shadow-types.v1.json");
 assert.equal(TWIN_TYPES.length,14);
 assert.equal(SHADOW_TYPES.length,13);
 assert.deepEqual(r.twinTypes.map(x=>x.key),TWIN_TYPES);
 assert.deepEqual(r.shadowTypes.map(x=>x.key),SHADOW_TYPES);
 assert.equal(r.shadowTypes.find(x=>x.key==="human-functional").publicEligible,false);
 assert(r.twinTypes.some(x=>x.key==="finance"));
 assert(r.twinTypes.some(x=>x.key==="environment"));
 assert(r.shadowTypes.some(x=>x.key==="risk-failure"));
 assert.equal(r.universalGuards.autonomousPublishing,false);
});
test("source-grounded twin and shadow feed KOS internally, never public products",()=>{
 const f=clone(fixture);
 f.twinShadowInputs={twins:[model()],shadows:[shadow()]};
 f.learningCandidates=[learning()];
 const all=createKOSContext(f);
 assert.equal(all.internalOnly.twinShadow.twins.length,1);
 assert.equal(all.internalOnly.twinShadow.shadows.length,1);
 assert.equal(all.internalOnly.learning.candidates.length,1);
 assert.equal(all.internalOnly.learning.candidates[0].acceptedAsFact,false);
 assert.equal(all.internalOnly.learning.autoLearn,false);
 assert.equal(all.internalOnly.learning.autoPublish,false);
 assert.equal(all.internalOnly.twinShadow.operational,false);
 const output=JSON.stringify(all.production);
 assert(!output.includes("sample-water-model"));
 assert(!output.includes("sample-comparator"));
 assert(!output.includes("sample-recheck"));
 assert(!output.includes("internalOnly"));
});
test("public individual and human-functional shadows are not eligible",()=>{
 const f=clone(fixture);
 const privateHuman={...shadow(),id:"qp:shadow:individual-shadow",type:"human-functional",
  title:"Person replication attempt"};
 const personal={...shadow(),id:"qp:shadow:patient-shadow",type:"social-aggregate",
  nodeIds:["qp:person:example-person"]};
 f.nodes.push({id:"qp:person:example-person",label:"Fictional Person",
  kind:"person",visibility:"PUBLIC",disclosure:"PUBLIC_CONTEXT_ALLOWED"});
 const result=createKOSContext(f);
 const b=result.breakdown;
 // Need an edge and claim to include a person before this privacy rejection
 // could even matter. Not having the node is also fail-closed.
 const t=compileTwinShadow(b,{shadows:[privateHuman,personal]});
 assert.equal(t.shadows.length,0);
 assert(t.reviewCounts.shadows.private+t.reviewCounts.shadows.unsafe+t.reviewCounts.shadows.unverified>=2);
});
test("unrelated citations, simulated live alerts and unauthorized execution fail",()=>{
 const b=createKOSContext(fixture).breakdown;
 const wrong={...model(),sourceIds:["qp:source:demo-two"]};
 const active={...model(),id:"qp:twin:sample-active",currentIncident:true};
 const exec={...shadow(),id:"qp:shadow:sample-exec",executionAuthority:true};
 const t=compileTwinShadow(b,{twins:[wrong,active],shadows:[exec]});
 assert.equal(t.twins.length,0);
 assert.equal(t.shadows.length,0);
 assert(t.reviewCounts.twins.unverified>=1);
 assert(t.reviewCounts.twins.unsafe>=1);
 assert(t.reviewCounts.shadows.unsafe>=1);
});
test("external unlicensed models cannot be silently incorporated",()=>{
 const b=createKOSContext(fixture).breakdown;
 const ext={...model(),externalModel:true,licenseReviewed:false};
 assert.equal(compileTwinShadow(b,{twins:[ext]}).twins.length,0);
});
test("learning retains candidate status without self-promotion or publication",()=>{
 const b=createKOSContext(fixture).breakdown;
 const result=stageLearning(b,[learning()]);
 assert.equal(result.candidates.length,1);
 assert.equal(result.candidates[0].disposition,"AWAITING_HUMAN_AMENDMENT_REVIEW");
 assert.equal(result.candidates[0].appliedToProduction,false);
 assert.equal(result.candidates[0].changedSiteContent,false);
 assert.equal(result.autoExecute,false);
 assert.equal(result.historyImmutable,true);
});
test("unproven reader challenge can be received elsewhere, not promoted as fact",()=>{
 const b=createKOSContext(fixture).breakdown;
 const notChecked={...learning(),id:"qp:learning:sample-unverified",kind:"READER_CHALLENGE",
  sourceIds:["qp:source:source-not-admitted"]};
 const z=stageLearning(b,[notChecked]);
 assert.equal(z.candidates.length,0);
 assert.equal(z.skipped.missingEvidence,1);
});
test("private, future-dated and action-executed learning is excluded",()=>{
 const b=createKOSContext(fixture).breakdown;
 const candidates=[
  {...learning(),visibility:"PRIVATE"},
  {...learning(),id:"qp:learning:sample-future",recordedAt:"2026-12-30"},
  {...learning(),id:"qp:learning:sample-action",actionExecuted:true}
 ];
 const z=stageLearning(b,candidates);
 assert.equal(z.candidates.length,0);
 assert.equal(z.skipped.private,1);
 assert.equal(z.skipped.invalid,2);
});
test("learning and shadow compilation preserve the source story and cannot change it",()=>{
 const f=clone(fixture);
 const result=createKOSContext(f);
 const before=JSON.stringify(result.linear.story);
 const b=compileTwinShadow(result.breakdown,{twins:[model()]});
 const l=stageLearning(result.breakdown,[learning()]);
 assert.equal(JSON.stringify(result.linear.story),before);
 assert(b.twins[0].sourceIds.every(id=>result.breakdown.sources.some(s=>s.id===id)));
 assert(l.candidates[0].claimIds.every(id=>result.breakdown.claims.some(c=>c.id===id)));
});
