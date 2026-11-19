import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { onRequestGet, onRequestOptions, onRequestPost } from "../functions/api/v1/report-draft.js";

const payload = {
  approval_id: "synthetic_approval_001",
  public_only: true,
  human_source_approval: true,
  question: "What does the adopted source state about the Pueblo General Fund?",
  sources: [{ id: "S1", title: "City budget", url: "https://www.pueblo.us/example",
    excerpt: "Adopted appropriation is a budget authorization, not a verified payment." }]
};
const operator = "a".repeat(64);
const digest = body => createHash("sha256").update(JSON.stringify(body)).digest("hex");
const env = {
  QP_LIVE_DRAFTS_ENABLED: "true", QP_API_BILLING_APPROVED: "true",
  QP_APPROVED_MODEL_ID: "gpt-6-luna", QP_APPROVED_MODEL_POLICY: "2026-11-19.v0.2",
  QP_APPROVED_PAYLOAD_SHA256: digest(payload),
  QP_APPROVED_PAYLOAD_EXPIRES_UTC: new Date(Date.now()+3600000).toISOString().replace(/\.\d{3}Z$/, "Z"),
  QP_OPERATOR_TOKEN: operator, OPENAI_API_KEY: "test-key-not-real-00000000",
  QP_USAGE_DB: { prepare: sql => ({
    bind: (...args) => ({
      first: async () => ({ approval_digest: args[0] })
    })
  }) }
};
const valid = {claims:[{claim:"Appropriation is not a verified payment.",source_id:"S1",quote:"Adopted appropriation is a budget authorization, not a verified payment."}],unknowns:["Actual payment not verified."],alternative_interpretations:[],verification_steps:["Read the official appropriation and payment ledger."]};
const upstream = (draft=valid) => new Response(JSON.stringify({status:"completed",output:[{type:"message",role:"assistant",status:"completed",content:[{type:"output_text",text:JSON.stringify(draft)}]}]}),{status:200});
const request = (body = payload, token = operator, type = "application/json") =>
  new Request("https://example.org/api/v1/report-draft", {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": type },
    body: JSON.stringify(body)
  });
async function checkStatus(response, code, status) {
  assert.equal(response.status, code);
  assert.equal((await response.json()).status, status);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
  assert.match(response.headers.get("Cache-Control"), /no-store/);
}
test("fails closed with missing feature flags and no model request", async () => {
  let called = false;
  const old = globalThis.fetch;
  globalThis.fetch = async () => { called = true; throw Error("should not call"); };
  try {
    await checkStatus(await onRequestPost({ request: request(), env: { ...env, QP_LIVE_DRAFTS_ENABLED: "false" } }), 503, "DISABLED");
    await checkStatus(await onRequestPost({ request: request(), env: { ...env, QP_API_BILLING_APPROVED: undefined } }), 503, "DISABLED");
    assert.equal(called, false);
  } finally { globalThis.fetch = old; }
});
test("fails closed when a secret or D1 is missing", async () => {
  for (const key of ["OPENAI_API_KEY", "QP_OPERATOR_TOKEN", "QP_USAGE_DB"]) {
    await checkStatus(await onRequestPost({ request: request(), env: { ...env, [key]: undefined } }), 503, "CONFIG_INCOMPLETE");
  }
});
test("denies incorrect operator token and browser methods", async () => {
  await checkStatus(await onRequestPost({ request: request(payload, "x".repeat(64)), env }), 401, "UNAUTHORIZED");
  await checkStatus(onRequestGet(), 405, "METHOD_NOT_ALLOWED");
  await checkStatus(onRequestOptions(), 405, "METHOD_NOT_ALLOWED");
});
test("requires approved public-source input and safe URL", async () => {
  await checkStatus(await onRequestPost({ request: request({ ...payload, human_source_approval: false }), env }), 422, "PUBLIC_EVIDENCE_REQUIRED");
  await checkStatus(await onRequestPost({ request: request({ ...payload, sources: [{ ...payload.sources[0], url: "http://169.254.169.254/latest" }] }), env }), 422, "PUBLIC_EVIDENCE_REQUIRED");
  await checkStatus(await onRequestPost({ request: request(payload, operator, "text/plain"), env }), 415, "JSON_REQUIRED");
});
test("rate-limit refusal does not contact the model", async () => {
  let called = false;
  const old = globalThis.fetch;
  globalThis.fetch = async () => { called = true; throw Error("should not call"); };
  try {
    const limited = { ...env, QP_USAGE_DB: { prepare: () => ({ bind: () => ({ first: async () => null }) }) } };
    await checkStatus(await onRequestPost({ request: request(), env: limited }), 429, "QUOTA_OR_APPROVAL_ALREADY_USED");
    const broken = { ...env, QP_USAGE_DB: { prepare: () => { throw Error("D1 unreachable"); } } };
    await checkStatus(await onRequestPost({ request: request(), env: broken }), 503, "USAGE_GATE_UNAVAILABLE");
    assert.equal(called, false);
  } finally { globalThis.fetch = old; }
});
test("draft response is explicitly unverified, private, source-bound and capped", async () => {
  const old = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async (url, options) => {
    calls++;
    assert.equal(url, "https://api.openai.com/v1/responses");
    assert.equal(options.method, "POST");
    const body = JSON.parse(options.body);
    assert.equal(body.store, false);
    assert.equal(body.max_output_tokens, 600);
    assert.equal(body.model, "gpt-6-luna");
    assert.equal(body.reasoning.effort,"none");
    assert.equal(body.text.format.strict,true);
    assert.equal(body.text.format.type,"json_schema");
    assert.match(body.instructions, /UNVERIFIED/);
    return upstream();
  };
  try {
    const response = await onRequestPost({ request: request(), env });
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.status, "DRAFT_UNVERIFIED");
    assert.equal(data.publication_approved, false);
    assert.equal(data.human_review_required, true);
    assert.deepEqual(data.source_ids, ["S1"]);
    assert.deepEqual(data.draft,valid);
    assert.equal(data.evidence_check,"SOURCE_ID_AND_QUOTE_MEMBERSHIP_ONLY");
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
    assert.match(response.headers.get("Cache-Control"), /no-store/);
    assert.equal(calls, 1);
  } finally { globalThis.fetch = old; }
});

test("bounded streaming rejects oversized bodies without model contact", async () => {
  const large = { ...payload, question: "x".repeat(14000) };
  const old = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => { called = true; throw Error("unexpected upstream"); };
  try {
    const response = await onRequestPost({ request: request(large), env });
    await checkStatus(response, 413, "REQUEST_TOO_LARGE");
    assert.equal(called, false);
  } finally { globalThis.fetch = old; }
});

test("approval cannot be self-issued, changed, extended, or browser-submitted", async () => {
  const old = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw Error("not allowed"); };
  try {
    for (const overrides of [
      {QP_APPROVED_PAYLOAD_SHA256: undefined},
      {QP_APPROVED_PAYLOAD_EXPIRES_UTC: "2000-01-01T00:00:00Z"},
      {QP_APPROVED_PAYLOAD_EXPIRES_UTC: "2099-01-01T00:00:00Z"}
    ]) await checkStatus(await onRequestPost({request:request(),env:{...env,...overrides}}),503,"APPROVAL_NOT_CONFIGURED_OR_EXPIRED");
    await checkStatus(await onRequestPost({request:request({...payload,question:"changed"}),env}),403,"PAYLOAD_NOT_APPROVED");
    await checkStatus(await onRequestPost({request:request({...payload,extra:"not allowed"}),env}),422,"PUBLIC_EVIDENCE_REQUIRED");
    const browser=request(); browser.headers.set("Origin","https://example.org");
    await checkStatus(await onRequestPost({request:browser,env}),403,"BROWSER_REQUEST_DENIED");
    assert.equal(calls,0);
  } finally { globalThis.fetch=old; }
});
test("consumed approval remains consumed after provider failure; no automatic retry", async () => {
  const old = globalThis.fetch;
  let calls=0, used=false;
  const once={...env, QP_USAGE_DB:{prepare:()=>({bind:(d)=>({first:async()=>{
    if(used)return null;
    used=true;return {approval_digest:d};
  }})})}};
  globalThis.fetch=async (url,opts)=>{calls++;assert.equal(opts.redirect,"error");return new Response("",{status:503});};
  try {
    await checkStatus(await onRequestPost({request:request(),env:once}),502,"MODEL_UNAVAILABLE");
    await checkStatus(await onRequestPost({request:request(),env:once}),429,"QUOTA_OR_APPROVAL_ALREADY_USED");
    assert.equal(calls,1);
  } finally { globalThis.fetch=old; }
});
test("oversize provider response cannot become a draft",async()=>{
  const old=globalThis.fetch;
  globalThis.fetch=async()=>new Response("x".repeat(70000),{status:200});
  try {await checkStatus(await onRequestPost({request:request(),env}),502,"INVALID_MODEL_OUTPUT");}
  finally{globalThis.fetch=old;}
});

test("unapproved model or changed policy stops before quota/provider",async()=>{
  let calls=0;const old=globalThis.fetch;globalThis.fetch=async()=>{calls++;throw Error("must not call")};
  try{
    for(const override of [{QP_APPROVED_MODEL_ID:"gpt-4.1-mini"},{QP_APPROVED_MODEL_POLICY:"old"},{QP_APPROVED_MODEL_ID:undefined}]){
      await checkStatus(await onRequestPost({request:request(),env:{...env,...override}}),503,"MODEL_POLICY_NOT_APPROVED");
    }
    assert.equal(calls,0);
  }finally{globalThis.fetch=old;}
});
test("rejects invented sources, altered quotations, missing review steps and extra fields",async()=>{
  const old=globalThis.fetch;
  try{
    for(const draft of [
      {...valid,claims:[{...valid.claims[0],source_id:"S99"}]},
      {...valid,claims:[{...valid.claims[0],quote:"A quotation that is not in the supplied excerpt."}]},
      {...valid,verification_steps:[]},
      {...valid,claims:[],unknowns:[]},
      {...valid,publication_approved:true}
    ]){
      globalThis.fetch=async()=>upstream(draft);
      await checkStatus(await onRequestPost({request:request(),env}),502,"INVALID_MODEL_OUTPUT");
    }
  }finally{globalThis.fetch=old;}
});
test("refusal or incomplete result cannot be accepted as a draft",async()=>{
  const old=globalThis.fetch;
  try{
    for(const data of [{status:"incomplete",output:[]},{status:"completed",output:[{type:"message",role:"assistant",status:"completed",content:[{type:"refusal",refusal:"refused"}]}]}]){
      globalThis.fetch=async()=>new Response(JSON.stringify(data),{status:200});
      await checkStatus(await onRequestPost({request:request(),env}),502,"INVALID_MODEL_OUTPUT");
    }
  }finally{globalThis.fetch=old;}
});
