# KOS v2 — Interdisciplinary Expert Panels, Multi-Model Challenge and Human Review

**Date:** 2026-11-21  
**Status:** source-bounded role planner, read-only review reconciler, external capsule preparation and automated tests. **No external models or credentialed human specialists have actually been contacted by this implementation.**

## Why this is a core KOS ability

A resident asking about a Pueblo utility rate, county budget, public-health concern, housing redevelopment, election transition, AI proposal, school or industrial facility needs more than one narrow perspective. A finance-only answer can miss workers and law. A legal-only answer can miss physical infrastructure. An engineering-only answer can miss historical decisions, service affordability or public rights.

KOS should privately assemble the **minimum sufficient specialist panel** for the subject's actual complexity and consequences. The panel examines different methods, evidence and plausible interpretations. The published output is still one clear, coherent, source-grounded story at approximately tenth-grade reading level, with optional deeper forensic records. A visitor never has to manage expert roles, agents or models.

## Panel design and selection

The new registry defines **23 disciplinary and critical-review roles** and maps them to **all 25 separate public subjects**. Roles include governance, law, public finance, systems engineering, hydrology, power, environmental science, medicine, education, labor, housing, food systems, local history, digital/cyber systems, emergency resilience, community impacts, child rights and RX solutions.

Every sufficiently consequential research task also needs source auditing, skeptical/falsification review, alternative hypotheses, consequence assessment and plain-language editing. These roles investigate **different questions**, not different personalities acting as authority. The default panel generally uses eight perspectives, adding specialist protection/resilience reviews for higher-consequence situations. Budget-driven exclusions must be recorded, not concealed. A case can require a real human reviewer rather than more AI repetitions.

### Distinguish reviewers precisely

- **AI specialist role:** an AI model prompted to apply a disciplinary review method; useful for finding omissions or alternative explanations but **not** a credentialed specialist or original evidence.
- **External LLM / agent:** may be appropriate for genuinely independent tools or strengths, but requires a reviewed provider agreement, explicit public-data permission, source-rights approval, bounded costs and provider-specific authorization. Different model brands do not necessarily mean statistically independent reasoning.
- **Real human expert:** professional/academic/community practitioner whose role, relevant expertise, scope, potential conflicts and permission to participate have been checked by a designated human. KOS cannot infer or impersonate their credentials. Names, opinions and quotations are not published without approval.
- **Institutional or affected-community perspective:** grounded in actual dated source documents or consented testimony. KOS does not invent a representative voice, presume a resident's belief or convert stakeholder advocacy into impartial factual authority.

No reviewer can approve its own evidence, decide legal guilt, make personal medical determinations, grant protected Q capabilities or publish without the human editorial gate.

## Six passes, held behind the story

1. **Frame and gather:** identify subject, jurisdiction, temporal scope, original sources and the reason the question matters to people.
2. **Parallel specialist review:** independent roles inspect the same sealed, minimally necessary source-bounded question and document specific claim/source concerns rather than copying a lead agent's conclusion.
3. **Challenge and falsify:** skeptic, alternative-hypothesis and consequence reviewers attempt to find overlooked records, mismatched dates/financial states, technical assumptions and effects on people.
4. **Reconcile against records:** separate supported facts, contested accounts, source gaps and proposed explanations. Compare claims to the issuer and version of each document, not a majority of model votes. Source and citation IDs survive every iteration.
5. **Human-gated research amendment:** new material is a source *lead* until retrieved, checked, admitted and reconciled; reviewer disagreement can create a learning candidate, not directly rewrite an accepted claim or historical record.
6. **Qified production:** one readable contextual narrative, real examples where evidenced, relevant positive/negative impacts, risks, needs, gaps, RX options, credible futures and optional institutional/technical details, with metadata and a clear as-of date.

### Case example: Pueblo water

A water-related investigation may draw on hydrology, engineering, environmental science, public finance, historical records, public health, source auditors, skeptics, alternative explanations and consequences review. If a water treatment issue involves acute health risk, greater human/specialist review is needed. A panel **must not** convert a model-generated prediction into a confirmed outage, contamination finding or official public warning. Dates, monitoring stations, treatment records, permits and actual operator authority must remain distinct.

### Case example: public budget and employee benefits

Finance examines money stages; governance checks who approved decisions; legal checks contract rights and administrative process; labor reviews workforce consequences; community context considers families; the skeptic verifies what was actually decided rather than rumored. KOS explains both documented objections and institution explanations fairly but proportionately to evidentiary support. Missing records do not automatically demonstrate wrongdoing.

## Operational status and output lineage

**Implemented in the v2 clean-rebuild branch:**

- `rebuild/data/expert-panel-registry.v1.json`: subject-to-discipline coverage, specialist roles and explicit non-authority boundaries.
- `rebuild/src/kos/expert-panel.mjs`: `planExpertPanel`, `reconcileExpertReports` and `prepareExternalPanelCapsule`.
- `rebuild/src/kos/index.mjs`: panel plan and reconciliation attached to `internalOnly.expertPanel`, not copied to the public production object.
- `rebuild/tests/expert-panel.test.mjs`: synthetic, non-real-world tests against unverified sources, false expertise, duplicate/correlated models, unsupported findings, protected data and external opt-in.
- `rebuild/contracts/production-harness.v1.json`: internal panel review gate added to the production sequence.

Each accepted review receipt preserves role, kind of reviewer, independent-group label, source/claim IDs, dated receipt, disclosed conflict state, model version if available, source leads and explicit limitation: **not independent factual certification**.

**Not connected or demonstrated:** live internal/external LLM orchestration, provider account contracts, billing/rate controls, an authenticated credentialed-human panel, professional quality benchmarks, a production source-verification process or published human-reviewed panel conclusions.

### External-provider minimum disclosure contract

Without explicit provider-specific permission **nothing is sent**. A candidate external package can be prepared only after all permission flags are asserted. Its contents are limited to a scrubbed **public subject ID, public claim text, original-source titles/URLs/dates and assigned review roles**. Do not send private histories, raw Q10 ability or governance data, memory pointers, confidential prompts, auth tokens, user information, protected institutional data, executable control instructions or unpublished internal Q processes.

The candidate package says **PREPARED_NOT_SENT**. It is not an external request or proof of secure transport. A future actual connector requires authenticated provider identity, data classification and DLP review, legal retention and licensing terms, independent egress controls, token/cost limits, abuse monitoring, revocation, secure audit and readback.

#
## Governed provider-adapter harness (reference implementation)

`rebuild/src/kos/panel-runner.mjs` adds `runApprovedPanel` as an **asynchronous integration boundary**. KOS itself does not contain provider keys, endpoint addresses, provider SDKs, AI system instructions or user-specific private records.

A separately authenticated backend may register adapters with an explicit provider ID, independence group, approved specialist roles, read-only/public-data classification and review callback. A role is assigned to a permitted adapter only after (1) the feature is enabled, (2) a genuine budget guard can reserve the call, (3) source rights and provider/data-use permissions are approved, and (4) a sanitized public-source capsule has passed its disclosure gate.

Reviewers receive the same evidence capsule independently—no previous AI answer, hidden private memory or other agent's draft. The harness limits roles, calls and concurrency, validates receipt role and provider identity, and runs the source-ledger reconciliation. Failed adapters are recorded rather than silently replaced with simulated expertise. A return value of `externalContacted: true` is meaningful **only when an actual independently connected approved adapter performed a call**. The current repository has no such provider adapter configured; its tests use fictional mock callbacks.

An injected adapter is a privileged boundary controlled by the future server integrator. **A caller's Boolean approval flags alone are not proof of legal authorization**; a production implementation must obtain and verify those permissions through actual account and consent records, provider agreements, technical egress/DLP enforcement, key custody, per-provider spend limits, measured cost and rate limits, cancellation, privacy audits and human review. Do not put executable adapters in the browser.

**Harness tests:** `rebuild/tests/panel-runner.test.mjs` verifies disabled-by-default behavior, mock internal/external reviewer independence, rejected provider identities, missing budget guard, denied permission, wrong reviewer roles and false action claims. They are engineering checks, not independent model-quality evaluation or penetration testing.

The actual public research workflow must still retrieve original evidence, calibrate model quality, validate source provenance, check reviewer independence, run adversarial samples and ensure high-stakes cases have qualified human specialists before any production release.

## Tests and release rules

- Every subject has directly relevant specialist coverage, and at least source/skeptic/alternative/consequence/editorial checks as appropriate to the topic.
- No false equivalence: evidence quality and authority, not AI voting, determine admissible claims.
- Reviewer conflicts and unknowns remain visible internally and are explained clearly when material to the public conclusion.
- False real-human credentials or unreviewed external model output never confer expertise.
- Unverified new links remain candidate leads, even if several agents repeat them.
- The panel never makes an automatic correction, runs external tools, publishes, diagnoses or directs coercive action.
- People can challenge findings; their concerns do not change the standard of evidence.
- Review coverage, source health, counterexamples, model disagreement, provenance, cost and human approval remain auditable and versioned.
- Expired TTL, new documents and real-world outcome differences can reopen a human-gated panel review without deleting older editions.

## Q10 reference relationship

This follows the Q10 Critical Reasoning & Learning Plane's distinction between **solver, skeptic/falsifier, alternative-hypothesis analyst and consequence reviewer**. It also honors the Context Engineering constraint that a context compiler or reviewer cannot become a new authority kernel. External model comparisons are candidates, not proof of a live multi-provider service.
