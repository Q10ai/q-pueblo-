# Q-Pueblo question-to-report capability — candidate implementation and release gate
Date: 2026-11-10. Repository: Q10ai/q-pueblo-. Status: SOURCE CANDIDATE; NOT AUTHORIZED FOR LIVE INTAKE.

## Working source paths
1. public/question-engine.js supplies exact authored-question answer gates, source-check dates, claim/source crosswalks, related issue discovery and investigation steps.
2. public/home-question.js routes homepage questions through fragment navigation instead of an HTTP query parameter. It does not persist questions.
3. public/qify.js remains browser-only and generates a downloadable local research packet with the triage evidence record.
4. functions/api/v1/research.js is OPTIONAL Cloudflare Pages D1 public intake, blocked until configuration, origin, consent and bot-challenge checks succeed. No user identities or contact fields are stored.
5. functions/api/v1/admin/research.js is an authorized review-only state machine with optimistic revisions, source receipts and an event log. Approval never publishes. Only signed, reviewed Git changes should be released publicly.
6. migrations/0001_research_intake.sql is a D1 candidate schema. Never paste submission records into the public Git repository.

## Exact expected behavior
Existing evidence: a question exactly matching one unambiguous report-authored question returns its dated, source-attributed summary with original record links, verified-claim mapping, accounting stages and review due date.
Related material: a lexical report or historical issue match remains a lead, never a confirmed answer.
Unknown material: the user gets a source investigation packet with unknowns, alternatives, responsible records, effects and an explicit research-pending status.
New information: correction is a draft until authorized review. No autonomous writing to reports, persistent memory, model training or public knowledge graph.

## Required activation work (not completed)
- Create Cloudflare D1 database; apply migrations/0001_research_intake.sql to the correct database, and bind it as QP_DB in the intended Cloudflare Pages environment.
- Set secret QP_REVIEW_TOKEN to a unique 32+ character high-entropy value. Set QP_TURNSTILE_SECRET to the production Turnstile secret. Integrate the corresponding client widget, accessibility alternatives and explicit consent before exposing a submit control.
- Perform security testing of bot protection, quotas, origin handling, prompt injection, database access, credential rotation, failed writes, data deletion and recovery.
- Define approved retention and deletion windows, data-controller privacy notice, breach response and case export. A receipt bearer token allows withdrawal from the primary database only; backups follow provider retention rules.
- Add a reviewer-facing UI with role separation and signed review receipts. The admin endpoint alone is not a complete reviewer product.
- Connect independent authorized source collection, rescan, provenance hashing, de-duplication, source date/fact checks and evidence contradiction detection.
- Add a constrained background queue, retries, dead letter handling, EE and T2Y budgets, content moderation, and operator-visible operational metrics. Model invocation is currently absent.
- Establish dual editorial sign-off and a public append-only amendments registry before public release. No unsupervised Git push from a user lead.
- Verify production Cloudflare Routes /index.html, /qify.html, /question-engine.js, /api/v1/config and route behavior, including actual version and proper Content Security Policy. Read back exact host. Test mobile screen readers, navigation and data export. Record the rollback deployment ID.

## Operator-facing candidate API
POST /api/v1/research: Same-origin application/json body with kind question | correction | public_source, question 20-500 characters, optional sourceUrl HTTPS, publicInformationOnly:true and turnstileToken. Returns 202 with case UUID and secret receipt. Default is HTTP 503 INTAKE_DISABLED. No email, IP or contact data is intentionally stored.
GET /api/v1/research?id=UUID: Requires X-QP-Receipt secret header. Returns non-public case state only.
DELETE /api/v1/research: Requires same-origin, X-QP-Receipt and JSON body containing id. Removes case and associated event rows from primary D1; backups are not controlled here.
GET /api/v1/admin/research?id=UUID or no id: Requires Authorization: Bearer reviewer token. Displays internal case, event log or bounded queue.
POST /api/v1/admin/research: Requires id, expectedRevision, reviewer, reason and a permitted target state. For approval, also requires verifiedSourceUrl, counterSourceUrl and explicit humanCheckedEvidence and humanCheckedCounterevidence flags. No public update occurs.

Transitions: unverified_lead -> triage/rejected; triage -> researching/human_review/rejected; researching -> human_review/triage/rejected; human_review -> approved_for_release/researching/rejected; approved_for_release -> researching/rejected; rejected -> triage. Approval means eligible for separate editorial release, NOT posted.

## Verification and boundaries
Node tests: scripts/check-question-pipeline.mjs and scripts/check-research-api.mjs, wired into Public Beta Validation. Test acceptance must be observed from GitHub Actions, not inferred from writing these scripts. Existing public site has 14 dated reports and a 174-issue historical index (source snapshot); those are not current verified civic-wide totals.

Operator public status must remain: server intake DISABLED; autonomous research DISABLED; automatic publication DISABLED; evidence still requires human review. Do not claim a completed production loop until bindings, bots, deletion, human review UX, investigation worker and live host validation are all demonstrated.

## Review-only amendments and contradiction pipeline

A new proposal compiler (`scripts/propose-report-amendment.mjs`) accepts the **specific baseline report object**, a new candidate JSON, and a new file destination. It pins baseline ID/version and SHA-256, keeps original claim snapshots, validates new HTTPS source IDs and role classifications, flags incompatible financial stages and text contradictions, and writes a 0600 review-only proposal under a new filename (exclusive create). It never touches public report JSON or promotes a lead into a finding. Tests: `node scripts/check-report-amendment.mjs`.

Input candidate contract: `schema: qp-amendment-candidate-v1`, `reportId`, `baseVersion`, `observedAt: YYYY-MM-DD`, `evidence: [{id,title,url,role,checked,originGroup}]` and `changes: [{claimId,proposedClaim,proposedStage,reason,evidenceId}]`. Distinct-origin evidence and original public records must be independently checked by a human before any subsequent authored-report version can supersede another.

The output includes `state=CHALLENGE_PENDING_HUMAN_REVIEW`, `publicationAllowed=false`, contradiction and accounting-stage flags, affected issue IDs, original and proposal hashes, source freshness status and review requirements. The proposal is deliberately not a publishing tool.
