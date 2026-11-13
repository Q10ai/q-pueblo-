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
