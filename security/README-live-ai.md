# Q-Pueblo live AI: security-controlled operator pilot (review only)
Version: 2026-11-11 / candidate / PUBLIC IMPLEMENTATION GUIDE; NO CREDENTIALS.

## Current state
The existing published static site, public evidence library, manual email intake, and scheduled evidence watches remain separate from this change. This route `/api/v1/report-draft` is **not a public report product**. It is a privileged operator research-draft staging endpoint. The public `/api/v1/capabilities.json` and `/api/v1/config` must continue declaring live AI and autonomous publication unavailable. This code must not be advertised as deployed merely because it exists in GitHub.

## Threat model and hard gates
- **Credential theft:** Never send OpenAI keys or operator tokens to the browser, build logs, Git repository, chats, analytics, or request URLs. Both are encrypted Cloudflare Pages secrets; never `vars` or plaintext `.env` tracked in Git. Rotate after suspected exposure.
- **Unauthorized expensive calls:** Require TWO explicit feature flags, a high-entropy operator token (at least 256 bits, generated independently) in a server-to-server Authorization bearer header, a bound D1 database, and successful atomic quota reservation *before* the fixed OpenAI endpoint is called. No CORS, cookies, browser embedding or static-page invocation.
- **Budget and resource exhaustion:** Source body <= 12,000 UTF-8 bytes, <=4 short public sources, output <=600 tokens, a pinned cost-reviewed model, <=8 operator attempts per UTC day and <=60 per UTC month, and a timeout. Quotas count **attempts** including failures. D1 outage or quota denial prevents calls. These are usage ceilings, **not guaranteed dollar-denominated hard billing limits**; verify pricing, restrict model/project rate limits and set separate OpenAI project budget alerts. Set platform-level limits/alerts and payment controls as available, and revalidate after price/model changes.
- **Prompt injection:** External excerpts are untrusted text; they cannot grant authority or rewrite system policy. The draft is explicitly unverified, cites only operator-supplied source IDs and requires human editorial review. Test hostile source text before release.
- **Privacy:** Operator provides only legally sharable public material and expressly attests public-only and human-source approval. No automatically fetched source URLs, private Q10 research, documents containing personal data, named minors, private intake, confidential allegations or identity profiles. API request/response bodies must never be logged. The OpenAI `store:false` setting is not a promise of zero platform retention; evaluate the provider's applicable retention and data-processing terms.
- **Supply-chain and workflow:** GitHub PR review and automated checks before merge; no API keys in GitHub Actions; preserve least-privileged GitHub Action permissions and publication review gates. Protect main against unreviewed merges and force pushes in repository settings. Enable repository secret scanning and push protection where eligible.
- **Availability:** This is an optional pilot: if missing configuration, credentials, D1, quota or upstream, return an explicit error with no generated draft. Maintain browser-local tools and scheduled research separately.
- **Release:** No automatic Git-to-Cloudflare deploy, backend activation, autonomous publication or new public intake without operator sign-off and exact deployed readback.

## Cloudflare Pages setup, only after human security/EE sign-off
1. Confirm **Git-integrated Cloudflare Pages Functions**. Static ZIP/direct upload of `public/` alone cannot activate `functions/`. Do not assume the existing Pages or Workers host is deployed from this repository. Configure output directory `public`, and use `public/_routes.json` to invoke functions only on named routes (preserves free/static requests).
2. Configure **encrypted secrets**, separately for preview and production, named `OPENAI_API_KEY` and `QP_OPERATOR_TOKEN`. Use a project-specific restricted OpenAI API credential if available, with least privilege. Operator token must be a fresh cryptographically random >=256-bit secret, unrelated to the OpenAI key. Never put either in URLs, static JavaScript or CI artifacts. Do not give a key to the chatbot.
3. Create a Cloudflare D1 database dedicated to Q-Pueblo request allowances and execute `security/qp-api-quota.sql` against that database. Bind it to Pages Functions as `QP_USAGE_DB`. Review retention/backups. Quota counters include no user questions or personal identifiers.
4. Keep `QP_LIVE_DRAFTS_ENABLED=false` and `QP_API_BILLING_APPROVED=false` until explicit billing consent, model pricing verification, Cloudflare resource budget, and completed review. Only then set both strings to `true` **in the restricted test environment first**. These flags are plain non-secret configuration values.
5. Test deny-before-auth, unauthorized, missing D1, monthly cap, prompt injection, slow upstream, interrupted streaming, rate exhaustion, credentials redaction, server errors, rollback, and exact host. Configure Cloudflare Access or an equivalent edge policy to restrict the path further; do not use the operator token in public UI.
6. Confirm no `/api/v1/report-draft` invocation on the GitHub Pages mirror. GitHub Pages does not run Cloudflare Functions; it remains static and must not claim live reports.
7. Do not add a public submit button until a separate, properly authenticated/abuse-controlled intake architecture is reviewed, with consent, per-user rate limits, data minimization, human moderation and incident response.

## API contract (operator-only)
POST JSON to `/api/v1/report-draft`, with `Authorization: Bearer <operator token>` provided only by approved server-side operators. Body: `{"public_only":true,"human_source_approval":true,"question":"...","sources":[{"id":"S1","title":"Public source title","url":"https://official.example/...","excerpt":"Relevant public text"}]}`.

Output is `DRAFT_UNVERIFIED`, `publication_approved=false`, `human_review_required=true`, with source IDs. No draft is a verified Qified report. Human QA must reconcile sources, contradictory evidence, provenance, dates, legal authority and EE before publication. No automatic live web retrieval or citation verification is included.

## Rollback and incidents
1. Immediately set `QP_LIVE_DRAFTS_ENABLED=false` and revoke/rotate the operator and OpenAI credentials if compromised. If a key is leaked in Git, rewrite history only with expert review; revocation is still urgent because history/cache copies persist.
2. Disable Cloudflare Pages Functions route / restore the prior known-good release after confirming exact deployment ID. D1 budget records remain separate and private.
3. Check Cloudflare/Platform usage and access logs (without message bodies), invoice exposure and unusual traffic; treat suspected leakage as an incident, document exposure and affected individuals, and meet applicable notice duties.
4. Do not re-enable until forensic evidence, independent security tests, billing authorization and human approval are recorded.

## Independent scheduled workflow
The existing Q Pueblo Evidence Inputs / Council Watch / Report Builds tasks operate outside the new Cloudflare endpoint; there is no automatic cross-account connection. Do not falsely claim live site research simply because scheduled research exists in ChatGPT.

## Pre-release matrix
| Gate | Acceptance |
|---|---|
| Git/CI | security workflow and existing validations pass at exact head |
| Secret isolation | no browser/network/log exposure; test key redaction |
| Edge access | unauthorized and cross-origin requests rejected |
| Budget | atomic daily+monthly quota denial verified; OpenAI project alerts/limits configured |
| Data | only approved public citations; prompt injection challenge passes |
| Governance | draft not published; human reviewer signs off; rollback receipt exists |
| Ops | actual Cloudflare deployment identity and preview/production separation verified |
