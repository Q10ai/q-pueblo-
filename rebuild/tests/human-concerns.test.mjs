import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createKOSContext} from "../src/kos/index.mjs";
const fixture=JSON.parse(readFileSync(new URL("../fixtures/synthetic-water.json",import.meta.url),"utf8"));
const clone=v=>JSON.parse(JSON.stringify(v));
const concern=()=>({
 visibility:"PUBLIC",disclosure:"PUBLIC_CONTEXT_ALLOWED",kind:"PUBLIC_CONCERN",
 evidenceStatus:"EVIDENCE_SUPPORTED",
 question:"Does the imagined water pump need maintenance, and what might happen if the work is delayed?",
 explanation:"This is an invented teaching example about how maintenance, cost and public services can be connected.",
 whatIsKnown:"In the fictional record, an inspection identified work that the example pump needed.",
 whatIsUncertain:"The example contains no measurements that could establish a failure date or a specific household impact.",
 whatItMeans:"The sample shows why residents should compare inspection findings with budget approvals and service plans.",
 practicalPaths:["Ask the responsible institution for public inspection and spending records."],
 groundingClaimIds:["qp:claim:demo-early","qp:claim:demo-later"],
 documentedPerspectives:[
 {context:"Public utility budget staff",explanation:"The example budget document concerns approval, not completed work.",
  visibility:"PUBLIC",disclosure:"PUBLIC_CONTEXT_ALLOWED",claimIds:["qp:claim:demo-early"]},
 {context:"Maintenance planning",explanation:"The example inspection identifies a need, not a guaranteed failure.",
  visibility:"PUBLIC",disclosure:"PUBLIC_CONTEXT_ALLOWED",claimIds:["qp:claim:demo-later"]}
 ]
});
test("human concerns output as cited, provisional grade-ten explanations without private profiles",()=>{
 const f=clone(fixture);f.productionInputs={concerns:[concern()]};
 const {production}=createKOSContext(f);
 const c=production.products.find(x=>x.productType==="CONCERN_EXPLAINER");
 assert(c,"A supported concern should produce an explainer");
 assert.equal(c.reviewState,"PROVISIONAL_NOT_APPROVED");
 assert.equal(c.publicPublished,false);
 assert.equal(c.content.evidenceStatus,"EVIDENCE_SUPPORTED");
 assert.equal(c.content.readerLevel,"approximately grade 10");
 assert.deepEqual(c.provenance.supportingClaimIds,["qp:claim:demo-early","qp:claim:demo-later"]);
 assert.deepEqual(c.provenance.sourceIds,["qp:source:demo-one","qp:source:demo-two"]);
 assert.equal(c.content.documentedPerspectives.length,2);
 assert.equal(production.publicPublished,false);
 assert.equal(production.provenance.reviewState,"HUMAN_APPROVAL_REQUIRED");
 assert.match(c.content.interpretationRule,/do not manufacture balance/i);
 assert(!JSON.stringify(production).includes("memoryPointers"));
 assert(!JSON.stringify(production).includes("internalOnly"));
 assert(!JSON.stringify(production).includes("planeMembership"));
});
test("private, restricted and absent disclosure concerns are excluded",()=>{
 const f=clone(fixture);
 const hidden={...concern(),visibility:"PRIVATE"};
 const restricted={...concern(),sensitivity:"RESTRICTED"};
 const unspecified={...concern()};delete unspecified.disclosure;
 f.productionInputs={concerns:[hidden,restricted,unspecified]};
 const p=createKOSContext(f).production;
 assert(!p.products.some(x=>x.productType==="CONCERN_EXPLAINER"));
});
test("a rumor or unknown source ID does not become equal evidence",()=>{
 const f=clone(fixture);
 const unsupported={...concern(),kind:"COMMON_MISUNDERSTANDING",
   groundingClaimIds:["qp:claim:missing"]};
 const inventedPerspective={...concern(),documentedPerspectives:[
  {context:"Unverified sources",explanation:"This statement has no independently admitted evidence.",
   visibility:"PUBLIC",disclosure:"PUBLIC_CONTEXT_ALLOWED",claimIds:["qp:claim:missing"]}
 ]};
 f.productionInputs={concerns:[unsupported,inventedPerspective]};
 assert(!createKOSContext(f).production.products.some(p=>p.productType==="CONCERN_EXPLAINER"));
});
test("secret-bearing concern is rejected, not exposed in the public product",()=>{
 const f=clone(fixture);
 const injected={...concern(),question:"Could this affect us? API_KEY=DO_NOT_SHOW_THIS_TOKEN_12345"};
 f.productionInputs={concerns:[injected]};
 const p=createKOSContext(f).production;
 assert(!JSON.stringify(p).includes("DO_NOT_SHOW_THIS_TOKEN_12345"));
 assert(!p.products.some(x=>x.productType==="CONCERN_EXPLAINER"));
});
test("evidence disagreement stays explicit rather than becoming a claim of equal truth",()=>{
 const f=clone(fixture);
 const c=concern();
 c.kind="DOCUMENTED_DISAGREEMENT";c.evidenceStatus="EVIDENCE_MIXED";
 c.whatIsUncertain="The two invented records describe budget approval and later inspection, not comparable measurements.";
 f.productionInputs={concerns:[c]};
 const products=createKOSContext(f).production.products;
 const result=products.find(p=>p.productType==="CONCERN_EXPLAINER");
 assert.equal(result.content.evidenceStatus,"EVIDENCE_MIXED");
 assert.match(result.content.whatIsUncertain,/not comparable measurements/);
 assert.equal(result.provenance.humanApproved,false);
});
test("all products share stable provenance and do not grant private Q access",()=>{
 const f=clone(fixture);
 f.productionInputs={concerns:[concern()],privateBuildRequest:true};
 const one=createKOSContext(f).production;
 const two=createKOSContext(f).production;
 assert.deepEqual(one.products.map(p=>p.contentFingerprint),two.products.map(p=>p.contentFingerprint));
 for(const p of one.products){
   assert.match(p.contentFingerprint,/^sha256:[0-9a-f]{64}$/);
   assert(p.provenance.sourceIds.length>0);
   assert(p.provenance.supportingClaimIds.length>0);
   assert.equal(p.publicPublished,false);
 }
 assert.equal(one.privateBuild.available,"NOT_CONNECTED");
 assert(!JSON.stringify(one).includes("authorizedBy"));
 assert(!JSON.stringify(one).includes("provenanceIds"));
});
