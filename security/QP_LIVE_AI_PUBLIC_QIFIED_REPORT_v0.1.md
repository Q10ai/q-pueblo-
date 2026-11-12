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
At purely illustrative input price $0.40 per million tokens, output price $1.60 per million tokens, 2,000 input tokens and 600 output tokens per bounded request: model token estimate = $0.00176 per request; 60 such attempts = $0.10560. These are **assumptions, not current OpenAI prices or total monthly cost**. Real costs require dated provider pricing and full Cloudflare/D1, retrieval, review and tax overhead; separate enforced hard spending limits and resource guards are mandatory.

## Next TSLP gates
MUST TEST: invalid/missing token, missing secret, public-input rejection, atomic quota under concurrency, separate Q10/Q-Pueblo credential boundaries, provider spend cap, prompt-injection holdout, safe display of model text, exact deployed commit readback, accessible review, false citations, provider data retention, emergency shutdown and rollback. Synthetic tests never equal independent production certification.

## Civic protections and status
All proposed AI notes remain `DRAFT_UNVERIFIED`; no automatic collection of citizen records, no automatic publication, no election endorsements and no AI municipal authority. The published static tools remain free. Source changes, model choices and fiscal calculations must be re-reviewed by a human editor. A question with insufficient evidence is a research lead, not an asserted fact.

**Publishing decision:** HUMAN HOLD for live AI functionality; preservation and open review of existing safe static features is permitted subject to the separate release process.
