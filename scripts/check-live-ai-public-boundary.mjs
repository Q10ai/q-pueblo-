import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const get=path=>readFileSync(path,"utf8");
const routes=JSON.parse(get("public/_routes.json"));
assert.equal(routes.version,1);
assert.deepEqual(routes.include,["/api/v1/config","/api/v1/report-draft"]);
assert.deepEqual(routes.exclude,[]);
const headers=get("public/_headers");
for(const h of ["Content-Security-Policy","X-Content-Type-Options: nosniff","X-Frame-Options: DENY"])
  assert.ok(headers.includes(h),"missing "+h);
assert.ok(!headers.includes("'unsafe-inline'"),"unsafe-inline CSP");
const fn=get("functions/api/v1/report-draft.js");
for(const gate of ["QP_LIVE_DRAFTS_ENABLED","QP_API_BILLING_APPROVED","QP_OPERATOR_TOKEN","QP_USAGE_DB","OPENAI_API_KEY","store: false","MAX_DAILY","MAX_MONTHLY","readLimitedBody","DRAFT_UNVERIFIED","human_review_required"])
  assert.ok(fn.includes(gate),"missing fail-closed policy "+gate);
assert.ok(fn.indexOf("USAGE_GATE_UNAVAILABLE")<fn.indexOf('fetch("https://api.openai.com/v1/responses"'),"quota must run before provider");
const c=JSON.parse(get("public/api/v1/capabilities.json"));
assert.equal(c.autonomous_public_research_agents,false);
assert.equal(c.live_external_web_search,false);
const cfg=get("functions/api/v1/config.js");
assert.ok(cfg.includes("ai_agents_live: false"));
const publicFiles=[];
function walk(dir){
 for(const ent of readdirSync(dir,{withFileTypes:true})){
  const path=join(dir,ent.name);
  if(ent.isDirectory()) walk(path);
  else if(/\.(?:js|json|html|css|txt|md)$/.test(ent.name)) publicFiles.push(path);
 }
}
walk("public");
for(const file of publicFiles){
 const raw=get(file);
 assert.ok(!/sk-proj-[A-Za-z0-9_-]{16,}/.test(raw),"possible embedded provider key in "+file);
 assert.ok(!/OPENAI_API_KEY|QP_OPERATOR_TOKEN/.test(raw),"server-only key name in public asset "+file);
}
console.log("PUBLIC_BOUNDARY_READ_ONLY_TEST_PASS",publicFiles.length,"text assets inspected");
