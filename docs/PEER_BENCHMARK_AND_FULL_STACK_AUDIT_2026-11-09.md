# Q-Pueblo — Peer Architecture Benchmark, Gap Audit and Remediation Register

**Record:** QP-BENCHMARK-AUDIT-20261109-01  
**As-of:** 2026-11-09  
**Scope:** Public Q-Pueblo beta and separately staged Q10 modules, not a field-certified real-time digital twin.  
**Source of truth:** Original Q-Pueblo identity; public Q-Pueblo GitHub source; Q10-controlled reference specifications and externally inspected primary public repositories.  
**Status:** A working v3 static-plus-optional-Functions candidate; peer-reviewed patterns, not copied applications. A host deployment and editorial approval remain separate gates.

## I. Peer reference projects and transferable practice

| Reference | Verified capability to learn from | Q-Pueblo translation | Constraints |
|---|---|---|---|
| Decidim (https://github.com/decidim/decidim) | Public participatory processes, proposals, tracking and participatory governance, authorization mechanisms; Rails app; AGPL-3.0 | Human-moderated observation/correction lifecycle with transparent disposition and appeal, never automatic consensus | Do not wholesale adopt Rails or AGPL code without license/legal review; participation count does not prove a claim |
| FixMyStreet (https://github.com/mysociety/fixmystreet) | Location-oriented reports and follow-through workflows | Report → owner/jurisdiction → acknowledged → resolved/reopened state transitions; public/private intake boundaries | An unofficial civic report is not an authorized municipal work order |
| DocumentCloud (https://github.com/MuckRock/documentcloud) | Research source docs, annotation, publication and correction workflows | A Q report has claim-to-source anchors, provenance, dated original material, independent counterevidence and versioned corrections | Preserve source copyright, personal-data rights, journalist notes and editorial independence |
| CKAN (https://github.com/ckan/ckan) | Datasets, metadata catalogs, APIs, harmonized organization and resource IDs | A public Q-Pueblo dataset manifest with schema, organization, freshness, license and link health | Do not assume a specific hosted portal still uses CKAN; Data.gov replaced its catalog app in 2025 (GSA Data.gov architecture wiki) |
| PolicyEngine (https://github.com/PolicyEngine/policyengine-us) | Formal rules and explicit scenario calculations; clear caveat that model estimates require validation and calibration | Bounded Q calculators display inputs, formula, assumption/source, uncertainty, and no unearned policy claim | Do not copy models without license review; Q does not claim local calibrated economic impact forecasts |
| Open Referral (https://github.com/openreferral/specification) | Standardized human-services directory and accessibility fields | Entity/service organization, program eligibility, public contact, geography, accessibility and last-verified fields | Do not infer that each source publisher is an entity, operator or program provider |
| USAspending (https://api.usaspending.gov/docs/endpoints) | API exposing awards, accounts, transactions and recipient/agency views | Join public money by source-defined IDs and lifecycle states without double-counting; separate congressional/state/local finance | Federal award obligations do not equal City of Pueblo disbursements |
| Open States (https://docs.openstates.org/contributing/scrapers/) | Independently maintained jurisdiction-specific legislative scrapers with provenance | Source-specific parsers, failure isolation, tests and official-document change queues | Avoid mixing county, municipal, district or state legislative authority |
| OWASP API Security (https://owasp.org/www-project-api-security/) | Threat model for broken object/function authorization, abuse, SSRF, resource exhaustion and unsafe external data | Disabled-by-default write APIs, allowlisted sources, bounded payloads, review gates, rate/retention requirements | One green source-code test does not equal a penetration test |
| W3C WCAG 2.2 (https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) | Keyboard focus visibility, navigation, target size and responsive accessibility | Exact-aspect logo, focus style, mobile overflow regression, no forced horizontal scroll | Isolated browser checks do not establish full WCAG AA conformance |

**Adoption rule:** Copy *principles* and compatible interface/data patterns, not third-party protected code or branding. License due diligence and data/terms reviews precede implementation of source packages.

## II. Reproduced audit findings and fixes

| ID | Severity | Observed failure/gap | Remediation in candidate | Validation | Residual risk |
|---|---|---|---|---|---|
| QP-P0-01 | Critical | Feed sync expected `qp-public-notice-feed-v1`, but site/feed contained `qp-official-source-watch-v1`; direct runtime mismatch | Unified RSS/Atom ingester and both front-end displays on current schema; fail closed on mismatches | 5 Python tests and release gate | Official publisher feed availability and dates still require real source checks |
| QP-P0-02 | Critical | Scheduled metadata workflow originally pushed automatically to production `main` and attempted Cloudflare deployment without editorial review | Changed to review-branch PR only, no direct deploy; separate page-change watcher PR | Workflow source inspection | GitHub Actions configuration and human approver still needed |
| QP-P0-03 | High | Official monitor wrote `workspace/data/updates.json` although deployable repo uses `public/` | Corrected path and added hash to signal ID for multiple distinct changes | Node monitor tests | Live feed is still not an interpreted official agenda database |
| QP-P1-01 | High | Visual brand was not the original user-selected wide header; duplicate mark/wordmark and possible cropping | Added original wide Q-Pueblo header image at natural 3:1 ratio and explicit `object-fit:contain` on marks | Browser screenshot and static gate | Exact visual approval and device/browser combinations remain review tasks |
| QP-P1-02 | High | Front-end offered links and research prompts but not executable EE/T2Y/money stage tools | Added deterministic browser-only calculator suite and portable JSON | 7 instrument tests; browser input submission | User-provided values are scenarios, not field findings |
| QP-P1-03 | High | Updates script attached a second mobile-menu event listener, canceling first toggle | Removed redundant handler and standardized single navigation component | Mobile browser click check | Menu still needs manual assistive technology testing |
| QP-P1-04 | High | Issue index, report index and observation form overflowed 390px viewport (419/432/1142px) | Min-width and grid containment CSS fixes | 8 pages × mobile/desktop = 16 rendered layout observations, no horizontal scroll on tested viewport | 320px and locale/zoom conformance not yet verified |
| QP-P1-05 | Medium | Header and reports had wrong or ineffective deep links | Repaired dossier and scenario links; standardized Q Tools nav and index entry | Static internal link auditor | Anchor behavior on Cloudflare must be rechecked |
| QP-P1-06 | High | Described 54 source publisher labels as if equivalent to 50+ verified government entities | Public navigation and notes now label them as publishers; entity registry not invented | Dataset readback | Separate canonical civic entity registry/relations graph still open |
| QP-P1-07 | High | Most issue summaries are research scopes with conditional advice, not independently established case results | Preserve 3 detailed starter source-backed briefs, label remaining as open dossiers, provide source links, specific unknowns and paths | Manual structure check | Full fact verification of hundreds of packets remains a major workstream |
| QP-P2-01 | High | User-submission backend is optional and disabled; local draft does not send a correction | Retain local-first drafts, disabled-by-default Cloudflare write API, quarantine SQL | Static config and API module syntax | Turnstile, rate limits, retention/erasure, privacy audit, editorial operator and D1 binding not operational |
| QP-P2-02 | High | Cloudflare static upload lacked active `/api/v1/config` (historical 404) | Include read-only Pages Functions candidates in source; do not publish availability claim | Source and route contract inspection | Cloudflare deployment/login and production readback needed |
| QP-P2-03 | Medium | Digital twin, neural agents, adversarial LLM comparisons are conceptual | Keep scenario lab bounded and truthful; define model/receipt interface with source and human gates | Scenario JS syntax + public UX review | Real data ingestion, stateful back end and verified AI runtime absent |
| QP-P2-04 | Medium | Two source watchers can produce noisy duplicate PRs | Separate host-page fingerprint changes from RSS title extraction, both as proposals | Code review | Consolidation/dedup across source types and actual observability needed |

## III. Cross-layer verified checks (local candidate)

- 13 Node test cases passed (6 official-monitor + 7 deterministic Q Tools).
- 5 Python feed-source tests passed (RSS, Atom, spoofed URL rejection, failure preservation, schema failure).
- Static release gate passed: mandatory public assets, internal file links, no duplicate primary-nav URLs, official source schema, human-gated contribution route, source directory, natural aspect brand and basic CSP.
- Isolated Chromium DOM and layout checks passed at 390 × 844 and 1440 × 900 for Home, Explore, Reports, Entities, Updates, Observations, Q Tools and Scenario Lab. Previously detected 3 mobile overflow defects were fixed and retested. Browser interaction verified one mobile menu activation and all three public calculators.
- These checks are local page-content execution on an isolated headless browser, not actual DNS/Cloudflare route checks, site security penetration tests, privacy audit, assistive technology testing, data freshness certification, or independent editorial audit.

## IV. User-facing Q tools available in v3 candidate

1. **EE minimum-sufficient planning:** monthly tasks, manual/tool time, required review, labor-value, subscription/per-task cost, optional user-supplied energy assumptions. Shows human time and financial deltas without pretending to measure energy. Reference: Q10 `EE_T2Y_SPEC.md`; Q10 Public Web Fabric entry calculator.
2. **T2Y truth-to-yield:** normalized product of truth support × realized yield × human agency × reversibility × (1 − harm); noncompensatory truth floor 0.80, harm ceiling 0.20, reference score 0.35; no publication or safety authority granted. Historical Q10 score variations exist; this candidate explicitly identifies the Q10 agent-ledger EE_T2Y reference, not a universal definition.
3. **Follow the Money stage reconciler:** input proposed, authorized, contracted, paid, recovered, benefit stages; avoids summing stages, flags amounts requiring period/scope/contract reconciliation, exports assumptions only.
4. **Reusable issue reports:** 174 indexed scopes and exactly 3 starter source-backed briefs; full source list and options where actually present. No claim that 171 other open dossiers are completed cases.
5. **Meeting and publisher monitor:** official-source discovery and changed-page/RSS metadata, staged for editorial review. Specific meeting times/votes require independent corroboration.
6. **Observation/correction draft:** local-first portable signal, no silent transmission. Live intake remains restricted pending privacy/security release gates.

## V. Next publication and operational gates

A. Human editorial owner must review source-backed claims and image/brand assets in PR; verify citations and review statuses.

B. CI must pass on the exact GitHub PR head. Merge to `main` only when release reviewer has inspected PR changes and no private Q10 material is in public paths.

C. The existing Cloudflare Direct Upload project will not deploy from GitHub automatically unless its account owner configures the restricted `Wrangler pages deploy` workflow (valid project name, `CLOUDFLARE_ACCOUNT_ID`, scoped API token, approved environment). **Never disclose secrets in Git/Drive.**

D. Independently read back `index`, `explore`, `reports`, `entities`, `tools`, `updates`, `observations`, `methods`, `twin` and optional read-only `/api/v1/config`. Check mobile/menu, JSON/schema, HTTP headers, accessibility, original source links, visual fidelity and rollback path.

E. For live corrections: security/privacy/legal review, protected data retention, D1/TURNSTILE deployment and tested role-based editor portal must precede enabling contribution writes; no anonymous direct publication or automated AI learning from unverified user content.

F. Expand reports with controlling original documents, itemized money stages, times, jurisdictions, alternative positions, child impacts and actionable outputs; build a stable civic entity registry independently of the 54 source-publisher label snapshot.

## VI. Proposed next independent acceptance suite

- Official source link health, notice/agenda extraction and legal-entity authority crosswalk with source date and TTL;
- reports audit sampled against primary documents and contrary evidence;
- full keyboard/screen reader and WCAG 2.2 AA verification including 200% and 400% zoom;
- security adversarial inputs: URL spoofing, prompt injection, CSRF/Turnstile bypass, output encoding, PII suppression, API rate limits, data deletion, branch tampering, stale-source promotion;
- resilience: publish-rollback rehearsals, offline source index, schema migrations, incident logs and signed artifacts;
- full Cloudflare route/data parity from the released commit SHA;
- operational EE cost telemetry, reviewer effort and meaningful community outcome measures.

**Operational contract:** Q gathers and compares, supports choices, tracks corrections, preserves history and includes sources, but never substitutes for the actual people and institutions with lawful authority.
