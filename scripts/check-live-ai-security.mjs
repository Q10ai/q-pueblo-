import { test } from "node:test";
import assert from "node:assert/strict";
import { onRequestGet, onRequestOptions, onRequestPost } from "../functions/api/v1/report-draft.js";

const payload = {
  public_only: true,
  human_source_approval: true,
  question: "What does the adopted source state about the Pueblo General Fund?",
  sources: [{ id: "S1", title: "City budget", url: "https://www.pueblo.us/example",
    excerpt: "Adopted appropriation is a budget authorization, not a verified payment." }]
};
const operator = "a".repeat(64);
const env = {
  QP_LIVE_DRAFTS_ENABLED: "true", QP_API_BILLING_APPROVED: "true",
  QP_OPERATOR_TOKEN: operator, OPENAI_API_KEY: "test-key-not-real-00000000",
  QP_USAGE_DB: { prepare: sql => ({
    bind: (...args) => ({
      first: async () => ({ day_attempts: 1, month_attempts: 1 })
    })
  }) }
};
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
    await checkStatus(await onRequestPost({ request: request(), env: limited }), 429, "DAILY_OR_MONTHLY_QUOTA_REACHED");
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
    assert.equal(body.model, "gpt-4.1-mini");
    assert.match(body.instructions, /UNVERIFIED/);
    return new Response(JSON.stringify({ output: [{ content: [{ type: "output_text", text: "Source S1 supports an appropriation, not payment." }] }] }), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  };
  try {
    const response = await onRequestPost({ request: request(), env });
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.status, "DRAFT_UNVERIFIED");
    assert.equal(data.publication_approved, false);
    assert.equal(data.human_review_required, true);
    assert.deepEqual(data.source_ids, ["S1"]);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
    assert.match(response.headers.get("Cache-Control"), /no-store/);
    assert.equal(calls, 1);
  } finally { globalThis.fetch = old; }
});
