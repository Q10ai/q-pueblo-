import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createKOSContext} from "../src/kos/index.mjs";
import {runApprovedPanel} from "../src/kos/panel-runner.mjs";
const fixture=JSON.parse(readFileSync(new URL("../fixtures/synthetic-water.json",import.meta.url),"utf8"));
const {breakdown,internalOnly}=createKOSContext(fixture),plan=internalOnly.expertPanel.plan;
const enabled={
 enabled:true,explicitConsent:true,providerAllowlisted:true,
 providerContractReviewed:true,dataUseReviewed:true,
 sourceRightsReviewed:true,approvedPublicOnly:true,
 allowedProviderIds:["internal-a","external-b"]
};
function adapter(providerId,kind,roles,independenceGroup,calls,change={}){
 return {
  providerId,kind,independenceGroup,roles,readOnly:true,
  publicOnly:true,enabled:true,
  async review({roleId,capsule,guard}){
   calls.push({providerId,roleId,capsule,guard});
   return {
    reportId:"receipt-"+providerId+"-"+roleId,
    roleId,reviewerType:"AI_ROLE_SIMULATION",
    reviewedAt:"2026-11-21",authorization:"READ_ONLY",publicDataOnly:true,
    externalActionExecuted:false,aiAutopromotion:false,
    independenceGroup,conflictOfInterest:"NOT_ASSESSED",
    providerVersion:"MOCK_FOR_TEST_ONLY",findings:[{
      claimId:"qp:claim:demo-early",
      stance:roleId==="skeptic"?"CHALLENGES":"SUPPORTS",
      explanation:"The synthetic budget example needs the original checked source before a finding can be independently corroborated.",
      sourceIds:["qp:source:demo-one"]
    }],
    ...change
   };
  }
 };
}
test("panel runner is OFF unless explicitly enabled and does not contact adapters",async()=>{
 const calls=[];
 const a=adapter("internal-a","INTERNAL_AI",["hydrology"],"family-one",calls);
 const x=await runApprovedPanel(breakdown,plan,{adapters:[a]});
 assert.equal(x.status,"DISABLED");
 assert.equal(x.internalContacted,false);
 assert.equal(calls.length,0);
});
test("public-only approved internal and external mocked agents review source evidence independently",async()=>{
 const calls=[];
 const a=adapter("internal-a","INTERNAL_AI",["hydrology","skeptic"],"model-family-a",calls);
 const b=adapter("external-b","EXTERNAL_LLM",["engineering","source-forensics"],"model-family-b",calls);
 const x=await runApprovedPanel(breakdown,plan,{
  ...enabled,adapters:[a,b],maxReviews:8,maxConcurrency:2,
  budgetGuard:{async reserve(){return true;}}
 });
 assert.equal(x.status,"PROVISIONAL_PANEL_REPORTS");
 assert.equal(x.assigned.length,4);
 assert.equal(calls.length,4);
 assert.equal(x.review.reports.length,4);
 assert.equal(x.review.independenceGroups,2);
 assert(x.review.contestedClaims.some(c=>c.claimId==="qp:claim:demo-early"));
 assert(x.externalContacted&&x.internalContacted);
 assert.equal(x.humanExpertContacted,false);
 assert.equal(x.originalClaimLedgerModified,false);
 assert.equal(x.publicPublished,false);
 for(const call of calls){
  assert.equal(call.guard.noPublication,true);
  assert.equal(call.capsule.noPrivilegedInputs,true);
  assert.equal(call.capsule.noMemoryPointers,true);
  assert(call.capsule.claims.every(c=>c.sourceIds.length));
  assert(!JSON.stringify(call.capsule).includes("authorizedBy"));
  assert(!JSON.stringify(call.capsule).includes("private"));
 }
});
test("missing privacy approval blocks even a configured provider before dispatch",async()=>{
 const calls=[];
 const a=adapter("external-b","EXTERNAL_LLM",["hydrology"],"family-b",calls);
 const x=await runApprovedPanel(breakdown,plan,{
  ...enabled,explicitConsent:false,adapters:[a],
  budgetGuard:{async reserve(){return true;}}
 });
 assert.equal(x.status,"PRIVACY_OR_SOURCE_GATE");
 assert.equal(calls.length,0);
 assert.equal(x.externalContacted,false);
});
test("missing budget guard or negative reservation blocks model calls",async()=>{
 const calls=[];
 const a=adapter("internal-a","INTERNAL_AI",["hydrology"],"family-a",calls);
 let x=await runApprovedPanel(breakdown,plan,{...enabled,adapters:[a]});
 assert.equal(x.status,"NO_BUDGET_GUARD");
 x=await runApprovedPanel(breakdown,plan,{
  ...enabled,adapters:[a],
  budgetGuard:{async reserve(){return false;}}
 });
 assert.equal(x.status,"NO_ACCEPTED_PANEL_REPORTS");
 assert.equal(x.failed[0].reason,"BUDGET_NOT_RESERVED");
 assert.equal(calls.length,0);
});
test("adapter cannot forge another expert role or grant action authority",async()=>{
 const calls=[];
 const a=adapter("internal-a","INTERNAL_AI",["hydrology"],"family-a",calls,{
  roleId:"law-rights",externalActionExecuted:true
 });
 const x=await runApprovedPanel(breakdown,plan,{
  ...enabled,adapters:[a],budgetGuard:{async reserve(){return true;}}
 });
 assert.equal(x.review.reports.length,0);
 assert.equal(x.failed[0].reason,"INVALID_REVIEW_RECEIPT");
 assert.equal(x.publicPublished,false);
});
test("provider must be specifically allowed and registered as a read-only public reviewer",async()=>{
 const calls=[];
 const a=adapter("unlisted-agent","EXTERNAL_LLM",["hydrology"],"family-a",calls);
 const x=await runApprovedPanel(breakdown,plan,{
  ...enabled,adapters:[a],budgetGuard:{async reserve(){return true;}}
 });
 assert.equal(x.status,"NO_APPROVED_ADAPTERS");
 assert.equal(calls.length,0);
});
