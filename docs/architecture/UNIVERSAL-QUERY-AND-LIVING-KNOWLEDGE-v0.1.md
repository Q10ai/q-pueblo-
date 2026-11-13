# Q-Pueblo Universal Search and Living Knowledge Contract
Version: v0.1.0 | Date: 2026-11-13 | Status: REVIEW CANDIDATE, NOT LIVE RESEARCH BACKEND
Owner: Human Q-Pueblo editorial/operator governance. Scope: every topic, entity and geography within authorized regional coverage.

## Product invariants
1. Any supported question receives best available evidence immediately; never block useful partial answers on a completed packet.
2. Search runs first against the approved public knowledge baseline. Relevant historical research, entity graph and issue family are consulted only when access permits. Private documents are never silently published or retrieved in a public session.
3. At query time determine whether evidence is current for the specific claim, not whether the overall packet is 'finished'. A query timestamp is not a source-check timestamp.
4. Where authorized source adapters exist, revalidate or discover using bounded, auditable requests. If no adapter is connected, explicitly say 'live source check not performed'. A later search without a connector cannot refresh the baseline.
5. New evidence becomes a provisional candidate; compare with previous claims, maintain both editions and explicit status. A materially contested or consequential conclusion requires human review before Qified publication.
6. Display a useful response with citations, precise known/unknown boundaries, date, jurisdiction, financial stage, dissent/counterevidence and review/update history.
7. Audience selection changes wording, structure and analytic tooling only. It never changes the underlying claim, evidence threshold or access authorization.
8. Citizens can open sources and deeper public research. Restricted evidence stays restricted; no open-public search leaks private Drive content.
9. All outputs remain corrigible, reversible, versioned and exportable. Expiry/review due marks evidence for recheck; it never silently deletes the history or 'completes' a packet.

## Universal query lifecycle
GET REQUEST -> Access & jurisdiction scope -> Resolve issues / canonical entities -> Load latest approved evidence snapshot -> Determine claim-level freshness -> Serve immediate baseline -> OPTIONAL authorized source recheck (rate/energy/privacy bounded) -> Extract source-dated candidates -> Deterministic comparison & contradiction checks -> Flag pending review and visible new leads -> Human review/publish amendment -> Version/graph/cache invalidation -> Revised response on subsequent requests.

The optional source checks may be carried out during the query if available within an EE budget, or returned as separate follow-up revisions when the platform actually supports authorized, scheduled processing. Do not promise background work from a static site.
A submission or a retrieval hit cannot authorize publication. No AI system may vote, appropriate money, decide eligibility, make punitive rankings, or overwrite public records.

## Claim and issue event model
Canonical issue: issueId, aliases, jurisdiction, topicTaxonomy[], entities[], spatialScope, accessClass, version, state, lastPublicationDate.
Claim: claimId, issueId, statement, subject, predicate, object, unit, timeframe, evidenceClass (verified | source-attributed | inference | contested | unknown), sourceIds[], validFrom/validTo, observedAt, sourceCheckedAt, reviewDueAt, jurisdiction, financialStage, currentVersion, supersedes[], confidenceExplanation, humanReview.
Source: sourceId, publisher, authoritativeRole, kind, url/locator, issueDate, fetchedAt, contentHash, privacyClass, license, retrievalReceipt, discrepancyFlags.
Event: eventId, claimId, eventType (add | correction | contradiction | supersede | retract | annotation), priorVersion, candidateVersion, sourceIds[], submittedAt, actorClass, reviewState, reviewer, approvedAt, auditHash.
Query receipt: queryId (non-PII), exact scope, public role, sourceSnapshotIds, recheckAttempted, recheckStatus, checkedSources[], checkFailures[], renderedAt, lastVerifiedAt, privacyMode, computeCostClass, responseVersion.

Event storage append-only; source snapshots immutable; materialized claim head atomically advances only after authorized review. Corrections propagate to derivative reports and invalidate affected summaries; historical versions remain traceable. A contradiction is not automatically a retraction. Use exact IDs and scoped version semantics to prevent stale overwrites and duplicate articles becoming separate independent evidence.

## Response envelope
States: VERIFIED_WITHIN_SCOPE, SOURCE_ATTRIBUTED, HISTORICAL_REVIEW_DUE, RESEARCH_PENDING, CONTRADICTED, NO_RECORD_FOUND, SOURCE_RECHECK_UNAVAILABLE. These apply at individual claim level; a response may contain mixed states.
Sections: short answer; what we know; what's new and source checked when; source records; past versions; what remains unconfirmed; who has authority; money stages; direct/second/third order effects; options; audience tools; how to correct; source/response as-of.
Return best available even with unknowns. Never turn 'not found' into evidence that the event never happened.

## Tiered source freshness
Freshness policies are per claim/source and event, not globally applied: emergency notices and meeting votes need fast rechecks; procurement, finance and agency notices need periodic checks; audited historical reports and geography have slower cadence; regulatory standards recheck on use and at version events. A due date only triggers review; no claim that results were checked without a fresh source receipt.
Throttling controls: allowlisted sources, ethical robots/rate terms, per-host budgets, backoff, cache, source risk score, no excessive crawling, user-visible freshness disclosures. Prefer cheapest sufficient approved snapshot. High impact sources are independently corroborated where possible.
Never send personally identifying user queries, private addresses, confidential submissions, credentials or protected data to unapproved search services. No individualized election persuasion, voter targeting or private voter record exposure.

## Role projections from same canonical evidence
Citizen: plain language, geography, impacts, status, ways to participate.
Researcher: source graph, method, provenance, version diffs, counterevidence, citations and export.
Engineer: validated geometry, specs, quantities, constraints, scope and assumptions; label missing inputs.
Journalist: dated timeline, quotes, attribution, corrections, contrary accounts and right-of-reply leads.
Decision maker: authority, policy alternatives, proposed/authorized/obligated/paid/outcome, risks and review gates.
Role switch must never privilege a finding or restrict lawful public evidence.

## Operational stages and honest present state
Implemented in candidate branch: Qify UI role selection, date/review-due warning, local-index answer where exact matched, related records and export, pure candidate-diff review gate.
Not implemented: unified secure index of all private/public Drive and Git material; adapters for query-time browsing; refresh pipeline; source snapshots/content hashes; human review workstation; exact claim version ledger; event bus; GIS digital twin; deployed end-to-end freshness confirmation.
Public site's present static mode must remain explicit until backend is authenticated, deployed, monitored and audited.

## Verification gates
- Empty topic -> partial response and coverage gap, no fabricated answer.
- Historical exact match -> dated answer, not fresh or current claim.
- Review due -> warning; recheck status false until a source receipt exists.
- New contradictory source -> candidate pending review, previous claim preserved.
- Role switches -> claim IDs, sources and access control invariant.
- Missing source, broken link, adapter timeout -> answer last known with visible warning.
- Private evidence in a public session -> zero leak.
- Manipulated documents or prompt injection -> inert untrusted data.
- Concurrent corrections -> CAS/optimistic locking, deterministic diff and full audit trail.
- Repeated search -> bounded cost, reuse source receipts, no duplicate history.
- Accessibility/multilingual tests, mobile testing, legal/record retention, rollback, human signoff before public publication.

## Handover
Base repository: Q10ai/q-pueblo-. Candidate branch: feature/universal-knowledge-query-20261113. Do not merge or deploy without tests and editorial review.
Related Q-Pueblo case example: docs/research/2026-11-13-pueblo-2027-street-repaving-review.md on independent research branch; it is a reference for the intended workflow, not automatically indexed in public search.


## Mandatory answer-completeness amendment — 2026-11-13

Acceptance rule: Previously listed investigation questions are not the public deliverable. Each is a required research and answer field. The engine must compile and present the best substantive answer to every supported field using available trusted evidence, without making citizens or professionals ask each subquestion again.

Covered dimensions for every Qified report:
- Direct answer and sourced factual findings, dates, relevant units, denominators, evidence status and financial stage.
- Who, what, when, where, why and how, including authority and jurisdiction.
- Past history; present verified state; conditional future, clearly separated.
- Money and resources: proposed, appropriated, contracted/obligated, paid, physical results and open reconciliations.
- Direct, second- and third-order entity relationships, community effects, children and long-term obligations.
- Counterevidence, alternative explanations, failure modes, measurable risks, options and tradeoffs.
- An explicit supported conclusion and usable next actions or decisions, with calculations where evidence allows.
- Claim/source ledger, exact receipts, review dates, amendments and unverified boundaries.

Every field is marked either ANSWERED_IN_DATED_REPORT or NOT_ESTABLISHED_IN_AVAILABLE_PUBLIC_EVIDENCE at projection time; future production evidence should additionally capture claim-specific evidence class and verification dates. Missing evidence requires an explicit limitation rather than a fabricated answer or the empty question originally used as a research instruction.

Citizens get concise conclusions plus full expandable detail. Researchers, engineers, journalists and decision-makers get the same content sorted by relevance, plus appropriate public tools. No role-based omission or substituted truth. Source and claims must be traceable at every depth.

Prompt templates and follow-up questions remain optional research tools: scenario generation, adversarial challenge, contradiction checks, new hypothesis exploration, comparison to external models and responsible red-team tests. They must never become the default response in place of established findings. A new topic without matched analysis receives every available dated indexed fact and source lead, and precisely labeled material gaps; that is not a verified full report.

The first browser review candidate implements deterministic answer-coverage.js projection from 14 prepared public reports. It does not create new research, fill missing source records, merge private archives or run live searches. Future backend work must populate the canonical claim graph and report-quality gate before any packet is advertised as full Qified research.

Adversarial acceptance tests:
1. A single headline question produces substantive answers across all supported dimensions, not generic questions.
2. Role switch preserves all answer statements and facts; only reading priority changes.
3. Every financial stage is independently labeled; missing disbursements are never inferred from commitments.
4. Every answer retains source edition and review dates; query time cannot substitute for source freshness.
5. Unanswered areas are grouped as transparent limitations rather than repeated empty checklists.
6. An indexed historical issue without a full report cannot be presented as a verified current answer.
7. User challenges, unusual queries and contradictory public submissions remain permissible inputs, subject to normal access and safety rules.
8. Untrusted documents and fabricated links do not promote claims without source review.


## Q-native intelligence: additional answers people did not know to ask — November 13, 2026

Requirement: Q must not stop at the explicit user's question or at conventional Who/What/When/Where/Why/How. Each eligible full Qified report also provides Q's own **substantive analytical findings**, which may identify connections, constraints, misleading assumptions, risk concentrations, and improvement routes that were not in the user's prompt. Q does not simply list its own questions; it seeks to answer them with checked evidence and explicit reasoning.

Eight distinct, default-visible answer dimensions:
1. UNDERLYING: The deeper systemic or measurement problem behind the headline, as far as source data support.
2. HIDDEN LINKS: Relationships among entities, agreements, obligations, infrastructure, geographies and upstream/downstream dependencies.
3. SECOND/THIRD ORDER: Indirect and future effects, distribution of costs and benefits, child and multigenerational impacts—labeled conditional where causal evidence is absent.
4. FAILURE/RESILIENCE: Failure modes, scenario shocks, leading warning signs, reversibility, mitigations and recovery.
5. BETTER ROUTES: Alternatives with real constraints, tradeoffs, accountable roles and measurements that would validate success.
6. EE/T2Y: Lowest-intelligence/energy/resource cost sufficient for a truthful, safe result; truth-to-useful-yield tests, not unmeasured marketing scores.
7. FALSIFICATION: Which controlling records, counterexamples or new measurements could change Q's conclusion, plus triggers to reopen the case.
8. PRACTICAL PATH: The smallest justified next step and how to verify outcomes, including differences between commitments and actual delivery.

Q's synthesized output must differentiate: OBSERVED_SOURCE_FACT; SOURCE_ATTRIBUTED_STATEMENT; EXPLICIT_DEDUCTION; HYPOTHESIS; CONDITIONAL_SCENARIO; COUNTEREVIDENCE; and NOT_ESTABLISHED. Never present AI inference as a direct citation. Claim-level sourceIds, derivation links, review versions, dates and machine-readable amendment receipts are the target production implementation.

Do not conflate 'unasked answers' with **invented findings**. The engine must seek under-investigated connections, but only surface a substantive answer when evidence or transparent computation supports it. Where a well-grounded answer cannot be derived, state the exact missing fact and whether Q has identified a hypothesis; do not pass a generic interview checklist back to the resident.

Current build: public/q-native.js projects existing, already prepared Qified report fields into eight visible insights. It is deterministic and query-local, does not discover new facts, lacks individual insight-to-sourceIds mapping, and does not automatically update any controlled archive. The legacy full original report remains accessible. Live cross-issue causal investigations, source graph traversal, source refresh, simulation validation and human-reviewed publication remain future gates.

Verification target: using identical underlying source versions, an ordinary reader must receive the same Q-native substantive insights as an expert, in language that is useful to their role. A report without Q analysis must say none is established; role or adversarial questioning must never cause claims to drift.
