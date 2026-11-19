# Q Pueblo — source-grounded live AI security and Qified readiness report
**ID:** QP-LIVE-AI-SECURITY-001 | **Version:** 0.1.0 | **Date:** 2026-11-12
**Status:** Public review-only documentation; NOT a live report service; NOT deployed or editorially approved for publication.

## Quick view for a Pueblo resident
Today the public research tools can show dated, published evidence and help draft research questions without sending those questions to a paid model. A proposed new AI assistant must be verified against real public records before anything it writes is published. It must distinguish a source, a factual assertion, a conditional calculation and an unknown. No AI program gets authority over municipal decisions.

## Two-minute QIFIED Applied assessment
**Question:** Can Q Pueblo safely generate a new report for every visitor question right now?
**Finding:** Not established. The existing source repository contains read-only/public educational features; live generation is an operator-only candidate requiring the separate account and infrastructure controls below.
**Source:** Public code repository and its existing `README.md`, `EDITORIAL-PROTOCOL.md`, `public/_headers`, `public/api/v1/capabilities.json`; official Cloudflare/OpenAI docs referenced below.
**Contrary possibility:** Future qualified servers could handle bounded operator requests. There is not yet evidence that the operator-only draft endpoint is deployed, or that its output has an independently verified original-source match.
**Decision:** Keep scheduled research and the free static site; prohibit unverified automated public publication. Stage but do not enable live API use without exact-host tests and named human approval.
**Review date:** whenever provider/model, source corpus, code, costs, Cloudflare deployment or security configuration changes.

## Security / evidence requirements
| Control | Reason | Current demonstration |
|---|---|---|
| No browser API keys | prevent unauthorized bills or leaks | code design staged, secrets not inspected |
| Separate project budget with enforced ceiling | prevent cost runaway | operator account configuration unverified |
| Limited server access and database quota | rate/cost integrity | source and synthetic tests, real D1/Access unverified |
| Public source and claim provenance | distinguish evidence from inference | required of draft, human source reconciliation still mandatory |
| Human publication approval | prevent AI authority impersonation | policy exists; real sign-off not recorded |
| Prompt injection resistance | prevent instructions hidden in source pages | model restrictions staged; independent holdout not done |
| Current fiscal/election dates | prevent false recency | ongoing editorial responsibility, not live certification |
| Static-safe fallback | protect free access during outages | architecture design, exact host not tested |
| Privacy and corrections | prevent sensitive disclosure and silent rewriting | operator-only approved-public-input boundary proposed |
| Release/rollback | preserve ability to stop and correct | separate production procedure required |

## What a genuine Qified public report must show
1. **Resident answer (plain English).** A direct answer, with effective date and jurisdiction.
2. **Claims and source links.** Each consequential claim has source publisher, original document locator, extraction date, and evidence state.
3. **How Q assessed it.** The type of fiscal statement, alternative interpretations, contradictions, confidence rationale, and limitations are presented, not just a summary.
4. **EE and T2Y.** Identify model/data costs, expected vs observed outcomes, and explicitly say UNMEASURED when not verified.
5. **LEAP and RX.** Near-term actions, long-term risks, other options, correction path, human editorial accountability and report version.
6. **Human controls.** Clear approval status, corrections log, shutdown and appeal route. A generated draft is not a reviewed finding.

## Learning from external standards (official locators)
- [OWASP LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) — malicious instructions in evidence, hidden context, unbounded resource usage, misinformation and output safety
- [OWASP ASVS 5.0](https://asvs.owasp.org/) — testable web/API requirements
- [NIST SSDF SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final) — secure software change and supply-chain controls
- [NIST AI RMF 600-1](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) — AI lifecycle risk/quality
- [Cloudflare Pages Functions routing](https://developers.cloudflare.com/pages/functions/routing/) and [bindings](https://developers.cloudflare.com/pages/functions/bindings/) — static/Function route separation and encrypted bindings
- [OpenAI spending limits](https://developers.openai.com/api/docs/guides/spend-limits) and [API data controls](https://developers.openai.com/api/docs/guides/your-data) — project-level controls and retention caveats

## Minimal-cost/EE example — NOT observed prices
At purely illustrative input price $0.40 per million tokens, output price $1.60 per million tokens, an **assumed** 2,000 input tokens (not a runtime enforcement bound) and a maximum 600 output tokens per request: illustrative model token-cost estimate = $0.00176 per request; 60 such scenario attempts = $0.10560. **The endpoint enforces 12,000 request bytes, not a 2,000-token input ceiling, so these numbers are not guaranteed maximum charges.** These are **assumptions, not current OpenAI prices or total monthly cost**. Real costs require dated provider pricing and full Cloudflare/D1, retrieval, review and tax overhead; separate enforced hard spending limits and resource guards are mandatory.

## Next TSLP gates
MUST TEST: invalid/missing token, missing secret, public-input rejection, atomic quota under concurrency, separate Q10/Q-Pueblo credential boundaries, provider spend cap, prompt-injection holdout, safe display of model text, exact deployed commit readback, accessible review, false citations, provider data retention, emergency shutdown and rollback. Synthetic tests never equal independent production certification.

## Civic protections and status
All proposed AI notes remain `DRAFT_UNVERIFIED`; no automatic collection of citizen records, no automatic publication, no election endorsements and no AI municipal authority. The published static tools remain free. Source changes, model choices and fiscal calculations must be re-reviewed by a human editor. A question with insufficient evidence is a research lead, not an asserted fact.

**Publishing decision:** HUMAN HOLD for live AI functionality; preservation and open review of existing safe static features is permitted subject to the separate release process.

## Amendment 2026-11-19 — v0.2 disabled preview candidate (not published or live-qualified)

The research now distinguishes **an approved input**, **a generated draft**, **a validated source locator**, **an independently corroborated claim**, and **a human-published report**. None is interchangeable with the next. A draft's citation ID and exact quote must match a supplied public excerpt; this does not prove the quotation is authentic, current, correctly interpreted, or sufficient to support the claim.

New candidate safeguards: independently configured short-lived exact-payload approval; unique approval digest consumed in one atomic SQLite statement using database UTC day/month; no automatic retry after a consumed reservation; restricted operator-only request; bounded provider response; no redirects; strict structured output with source ID, verbatim quote, unknowns, alternatives and verification steps. Empty evidence does not become a confirmed finding. The previous quota table is preserved and may not be reset to manufacture a fresh allowance. Actual D1, Access, retention, provider billing and rollback are separate unperformed deployment tests.

Provider lifecycle: OpenAI lists GPT-4.1 mini as deprecated, with announced retirement January 14, 2027. The disabled branch now proposes GPT-6 Luna (gpt-6-luna) for low-cost bounded extraction/drafting, not as an independently validated model for civic analysis. Explicit configuration of the model and policy version is required; no automatic model escalation or replacement. The published standard short-context text prices on November 19 are $0.10/M input and $0.50/M output tokens. At ASSUMED 2,000 input and 600 output tokens, 60 attempts would cost $0.03 in model token charges, excluding platform overhead, possible pricing variation and other costs. The 12,000-byte request limit is not a token ceiling, the schema/instructions add input, and the scenario is not a guaranteed bill bound.

Sources: https://developers.openai.com/api/docs/deprecations ; https://developers.openai.com/api/docs/models/gpt-6-luna ; https://developers.openai.com/api/docs/guides/structured-outputs ; https://developers.openai.com/api/docs/guides/spend-limits ; https://developers.openai.com/api/docs/guides/your-data ; https://api-security.owasp.org/editions/2023/en/0xa4-unrestricted-resource-consumption/ (checked 2026-11-19).

Verification witness at commit 38d2e3e6483f880355f9d434cbb0a5cd17bba7ca: 13 mocked Node tests PASS, 5 local SQLite tests PASS (including 100 concurrent reservations with exactly 8 admissions, and replay challenge with exactly 1 admission), 194 static text assets inspected. CI witness https://github.com/Q10ai/q-pueblo-/actions/runs/44542872464 ; deployment job skipped, not a live-host certification. T2Y real-world claim correctness, civic understanding and human-accepted outcomes remain UNMEASURED. Production HOLD.
