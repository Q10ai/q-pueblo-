import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createKOSContext} from "../src/kos/index.mjs";
import {planExpertPanel,reconcileExpertReports,prepareExternalPanelCapsule} from "../src/kos/expert-panel.mjs";
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const fixture=read("../fixtures/synthetic-water.json");
const clone=x=>JSON.parse(JSON.stringify(x));
const sourceId="qp:source:demo-one";
const claimId="qp:claim:demo-early";
const report=(roleId,stance="CHALLENGES",group="sim-a")=>({
 reportId:"review-"+roleId+"-"+stance,roleId,reviewerType:"AI_ROLE_SIMULATION",
 reviewedAt:"2026-11-21",authorization:"READ_ONLY",publicDataOnly:true,
 externalActionExecuted:false,aiAutopromotion:false,
 independenceGroup:group,providerVersion:"TEST_MODEL_NO_LIVE_PROVIDER",
 conflictOfInterest:"NOT_ASSESSED",
 findings:[{
   claimId,stance,sourceIds:[sourceId],
   explanation:"In this deliberately fictional budget exercise, source support must be reexamined rather than treated as a final finding."
 }]
});
test("each of 25 Pueblo subject families has distinct relevant disciplinary reviewers",()=>{
 const register=read("../data/expert-panel-registry.v1.json");
 const subjects=read("../data/subjects.v1.json").subjects;
 assert.equal(register.roles.length,23);
 assert.equal(Object.keys(register.subjectDomainRoles).length,25);
 const roles=new Set(register.roles.map(r=>r.id));
 assert.equal(roles.size,23);
 for(const subject of subjects){
   const configured=register.subjectDomainRoles[subject.slug];
   assert(configured?.length>=2);
   assert(configured.every(x=>roles.has(x)));
 }
 assert.deepEqual(register.subjectDomainRoles.water.slice(0,3),["hydrology","engineering","environment"]);
 assert.deepEqual(register.subjectDomainRoles.money.slice(0,2),["finance","governance"]);
 assert.equal(register.externalProviderState,"NOT_CONNECTED");
});
test("KOS routes expert panel privately: planned roles are not claims of consultation",()=>{
 const context=createKOSContext(fixture);
 const p=context.internalOnly.expertPanel.plan;
 const reviews=context.internalOnly.expertPanel.reviews;
 assert.equal(p.status,"ROLES_PLANNED_NO_REVIEWS_PERFORMED");
 assert.equal(p.independentExpertContacted,false);
 assert.equal(p.externalLLMContacted,false);
 assert.equal(p.finalAuthority,"HUMAN_EDITORIAL_REVIEW_REQUIRED");
 assert.equal(reviews.reports.length,0);
 assert.equal(reviews.missingRoleIds.length,p.roles.length);
 assert(p.roles.some(r=>r.roleId==="skeptic"));
 assert(p.roles.some(r=>r.roleId==="alternative"));
 assert(p.roles.some(r=>r.roleId==="consequences"));
 assert(p.roles.some(r=>r.roleId==="narrative"));
 assert(p.roles.some(r=>r.roleId==="hydrology"));
 assert(!JSON.stringify(context.production).includes("expertPanel"));
 assert(!JSON.stringify(context.production).includes("ROLES_PLANNED_NO_REVIEWS_PERFORMED"));
});
test("consequence class increases specialist planning, not automatic authority",()=>{
 const breakdown=createKOSContext(fixture).breakdown;
 const low=planExpertPanel(breakdown,{consequence:"C0",maxRoles:5});
 const high=planExpertPanel(breakdown,{consequence:"C5",maxRoles:5});
 assert(low.roles.length>=5);
 assert(high.roles.length>=low.roles.length);
 assert(high.roles.some(r=>r.roleId==="child-rights"));
 assert(high.roles.some(r=>r.roleId==="resilience"));
 assert.equal(high.toolAuthority,"READ_ONLY");
 assert.equal(high.independentExpertContacted,false);
 assert.throws(()=>planExpertPanel(breakdown,{consequence:"C9"}),/consequence/);
});
test("independent source-linked reviewers may disagree but cannot decide truth by voting",()=>{
 const breakdown=createKOSContext(fixture).breakdown;
 const plan=planExpertPanel(breakdown);
 const result=reconcileExpertReports(breakdown,plan,[
   report("source-forensics","SUPPORTS","source-checker"),
   report("skeptic","CHALLENGES","second-reviewer")
 ]);
 assert.equal(result.reports.length,2);
 assert.equal(result.independenceGroups,2);
 assert.equal(result.contestedClaims.length,1);
 assert.equal(result.contestedClaims[0].claimId,claimId);
 assert.equal(result.contestedClaims[0].status,"REQUIRES_ORIGINAL_SOURCE_RECONCILIATION_NOT_A_VOTE");
 assert(result.missingRoleIds.length>0);
 assert.equal(result.claimLedgerAmended,false);
 assert.equal(result.published,false);
 assert.equal(result.humanReleaseRequired,true);
});
test("several AI personas using one provider are one independence group, not independent fact-checks",()=>{
 const breakdown=createKOSContext(fixture).breakdown,plan=planExpertPanel(breakdown);
 const result=reconcileExpertReports(breakdown,plan,[
   report("source-forensics","SUPPORTS","same-provider"),
   report("skeptic","CHALLENGES","same-provider")
 ]);
 assert.equal(result.reports.length,2);
 assert.equal(result.independenceGroups,1);
 assert.equal(result.contestedClaims.length,1);
 assert.match(result.qualityBoundary,/not independent factual verification/);
});
test("forged professional credentials and unsourced reviewer conclusions are rejected",()=>{
 const breakdown=createKOSContext(fixture).breakdown,plan=planExpertPanel(breakdown);
 const forged={...report("hydrology"),reviewerType:"HUMAN_REVIEW_ATTESTED"};
 const missing={...report("skeptic"),reportId:"missing-source",
   findings:[{claimId,stance:"SUPPORTS",sourceIds:["qp:source:not-admitted"],
     explanation:"Pretend an unrelated original source proves the statement."}]};
 const result=reconcileExpertReports(breakdown,plan,[forged,missing]);
 assert.equal(result.reports.length,0);
 assert.equal(result.rejected.unproven,2);
});
test("unauthorized actions, future reviews, malicious snippets and duplicate receipts are excluded",()=>{
 const breakdown=createKOSContext(fixture).breakdown,plan=planExpertPanel(breakdown);
 const action={...report("skeptic"),reportId:"action-run",externalActionExecuted:true};
 const future={...report("skeptic"),reportId:"future-run",reviewedAt:"2028-01-01"};
 const poisoned={...report("skeptic"),reportId:"secret-run",
   findings:[{claimId,stance:"CHALLENGES",sourceIds:[sourceId],
     explanation:"The response contains password=ABSOLUTELY_NO_PUBLIC_EXPOSURE"}]};
 const duplicate=report("skeptic");
 const result=reconcileExpertReports(breakdown,plan,[action,future,poisoned,duplicate,duplicate]);
 assert.equal(result.reports.length,1);
 assert.equal(result.rejected.unsafe,2);
 assert.equal(result.rejected.unproven,1);
 assert.equal(result.rejected.duplicate,1);
 assert(!JSON.stringify(result).includes("ABSOLUTELY_NO_PUBLIC_EXPOSURE"));
});
test("external provider capsule is disabled until explicit provider and privacy gates are satisfied",()=>{
 const b=createKOSContext(fixture).breakdown,p=planExpertPanel(b);
 assert.equal(prepareExternalPanelCapsule(b,p).status,"BLOCKED_UNAUTHORIZED_EXTERNAL_ACCESS");
 const partially=prepareExternalPanelCapsule(b,p,{
   explicitConsent:true,providerAllowlisted:true,providerContractReviewed:true,
   dataUseReviewed:true,sourceRightsReviewed:false,approvedPublicOnly:true
 });
 assert.equal(partially.capsule,null);
 const complete=prepareExternalPanelCapsule(b,p,{
   explicitConsent:true,providerAllowlisted:true,providerContractReviewed:true,
   dataUseReviewed:true,sourceRightsReviewed:true,approvedPublicOnly:true
 });
 assert.equal(complete.status,"PREPARED_NOT_SENT");
 const c=complete.capsule;
 assert.equal(c.noPrivilegedInputs,true);
 assert.equal(c.noMemoryPointers,true);
 assert.equal(c.noPrivateQMethods,true);
 assert.equal(c.noToolExecution,true);
 assert(c.claims.every(x=>x.sourceIds.length>0));
 assert(c.sources.every(x=>x.url.startsWith("https://")));
 assert(!JSON.stringify(c).includes("authorizedBy"));
 assert(!JSON.stringify(c).includes("memoryPointers"));
 assert(!JSON.stringify(c).includes("providerToken"));
 assert(!JSON.stringify(c).includes("productionInputs"));
});
test("review can introduce a source lead but never mutate or verify the claim ledger",()=>{
 const f=clone(fixture);
 f.expertPanelInputs={reports:[{
   ...report("environment","NEEDS_SOURCE"),reportId:"external-lead",
   newSourceLeads:["https://example.org/possible-new-report","http://localhost/private","https://example.org/?api_key=private-secret"],
 }]};
 const before=JSON.stringify(f.claims);
 const result=createKOSContext(f);
 const review=result.internalOnly.expertPanel.reviews;
 assert.equal(review.reports.length,1);
 assert.deepEqual(review.reports[0].unverifiedSourceLeads,["https://example.org/possible-new-report"]);
 assert.equal(JSON.stringify(f.claims),before);
 assert.equal(result.linear.story.length,2);
 assert.equal(review.claimLedgerAmended,false);
});
