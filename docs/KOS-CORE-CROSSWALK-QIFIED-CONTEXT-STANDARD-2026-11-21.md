# Q Pueblo KOS — Q Core, Crosswalk, Qified Context and Output Contract

Version: QP-KOS-STORY.v1.0
Date: 2026-11-21
Status: human-review candidate; not an operating autonomous research service
Authority: humans decide on publication, data access, action and release

## The purpose

**Context is the product.** A resident should finish reading a paper with a coherent understanding of the subject, rather than a pile of headings, research instructions, unrelated excerpts or unanswered questions.

The KOS must connect Q Core, exact source-bounded Qification and evidence-grounded crosswalking. Those are the core differentiated methods. Do not claim an exclusive competitive moat without comparative validation, audited results and sustained measurable benefit.

## The three central engines

**1. Q Core — truth, authority, options and continuity.**
- Separate observations, claims, source evidence, inference, uncertainty, authority, action and outcome.
- Source provenance, independence, version, dates and typed TTL; last updated is not automatically last verified.
- Q10 method families where actually supported by a particular packet: QIFY, GLEAN, SUPRA, evidence health, consequence gates, Child Zero, T2Y, EE_INTEL, RX, SHOCK, BACKUP, Zero Autopsy, and LEAP.
- Human governance is a hard boundary. Q10 controlled candidate and Q Pueblo public static website are different operating environments. Engineering test receipts do not authorize production.

**2. Crosswalk — a sourced regional relationship graph.**
- Record canonical stable IDs for subject, issue, study, organization, official role, individual, funding instrument, public project, asset, geography, law, event, source and learning product.
- Organize entities in three tiers: major domain, institution, department/role/program/person, with dated effective terms.
- Crosswalk across municipality → county → state → federal, and neighborhood → regional economy → downstream effects.
- For each meaningful edge, store relation type, direction, time window, source ID, claim IDs, identity resolution state and uncertainty. A repeated name or topic alone is not an actual relationship.
- Reuse crosswalk links, not duplicated articles. Keep unknown associations unresolved. Include money from origin → authorization → award → commitment → invoice → payment → delivered result; do not equate these states.
- Explore consequences two and three steps out where evidence supports them, including burdens on families, contractors, services and future operations.

**3. Qified synthesis — full contextual reading and reusable products.**
- Resolve the specific question and canonical subject, not a nearby topic.
- Seek original authority, documents, dates, amounts and historical records; old Q Pueblo pages can locate leads, never independently prove the claim.
- Reconcile differing primary accounts; say what is established and what is contested without false equivalence.
- Turn the evidence and graph into one readable narrative: setting → origins → key events → who did what → money → effects → present situation → options → consequences → sourced conclusion.
- Explain unfamiliar words; target a reader in approximately 10th grade. Complex analysis can remain in secondary methods/appendices. Preserve nuance and uncertainty.
- Deliver a full paper only when materially supported. Do not create a page of promises, placeholder bullets, requests for user research, repetitive 40-section boilerplate or fake completeness.
- Do not construct imaginary quotes, people, personal stories, motives or scenes to make narrative feel vivid. Quote only source-confirmed text under usage rules.
- The reader's paper stands alone. Links extend evidence and learning; they do not replace the explanation.

## Publication acceptance — required controls

A candidate paper must pass **all**:
1. Subject identity, scope, region, as-of date, intended audience and version are recorded.
2. The first two paragraphs explain the issue and why the subject matters; paragraphs connect in narrative order.
3. The important timeline is accurately reconstructed from original material, including any disagreement in records.
4. Major factual, numerical and attribution claims are mapped to checkable external sources; no Q-Pueblo self-citation as sole support.
5. Financial amounts state currency, unit, period and accounting stage; uncertain or private values are not invented.
6. Named entity/role crosswalk edges are sourced and dated; relatives and associations are not inferred.
7. Historical LL, local people, institutions, human impact and downstream effects are present where materially relevant, not padded into every report.
8. Q methods are *applied only when supported*; never fabricate calculations or claim a complete Twin model from a scenario sketch.
9. Contradictions and important unknowns are explained in the story concisely; not an empty questions section.
10. Options have feasible mechanisms, limits, costs and accountable decision-makers; preserve human agency and rights.
11. Source access and publication rights are checked; privacy, child safety and high-stakes communication protections enforced.
12. Editorial review, current link check, readability, keyboard/screen-reader check and release approval are recorded.
13. All accessible output assets derive from the same canonical verified claim ledger and crosswalk IDs.
14. Expiration triggers rechecking and versioning, never silent deletion or retroactive alteration.

**Failure condition:** If evidence is insufficient, publish an honest narrower finding or retain the candidate privately. Do not fill a public page with missing headings, checklists of what to investigate or requests that the reader perform the investigation. No automatic publication.

## Output inventory — production classes

Primary:
- Canonical, human-readable Qified full research paper, contextual story, substantive investigation and full source bibliography.
- Canonical issue and study crosswalk, dated entity graph, role/authority table, linked legal and policy chronology.
- Financial flow, funded-versus-spent reconciliation, life-cycle analysis and evaluated options, only with records.

Derived from the same checked core (not copy/paste of a separate narrative):
- Short plain-language summary and current update with date/source links.
- LL historical account, annotated timeline, map and picture/archive gallery where rights permit.
- Classroom lesson, age-adapted guide and five-level/three-challenge-per-level games when the question bank is actually built and reviewed.
- Human-reviewed RX solutions and planning comparisons, preparedness/SHOCK/BACKUP diagrams, and LEAP scenarios where evidence supports them.
- Downloadable source ledger, appendix, glossary references, machine-readable claims and amendments, version history and correction record.

**No output may make a higher reliability claim than the underlying evidence and human approval.** Empty inventory slots do not count as products.

## Actual public/core status

Q Pueblo currently supports static dated reports, local search and Qify matching, bounded browser tools and existing entity/issue associations. The public website does **not** run Q10 Core's autonomous processing, live primary-record ingestion, a complete operational Twin or automatic source verification/publication. The Q10 Core repository separately documents bounded implemented/tested capabilities with outstanding independent domain and operational release gates.

Q10 reference documentation:
- https://github.com/Q10ai/q10-core/blob/main/docs/q10/architecture/CAPABILITY_MAP.md
- https://github.com/Q10ai/q10-core/blob/main/docs/q10/strategy/VALUE_AND_MOAT.md
- https://github.com/Q10ai/q10-core/blob/main/docs/q10/governance/CLAIM_BOUNDARY.md

## Subject-entry resolution and dynamic context path (review branch)

The same KOS entry route accepts all 25 subject-family IDs, their 77 documented subtopics, or a free-form user idea. A user clicking **Enter KOS** should not have to choose individual source files or reconnect a system. The selected subject is the lookup key.

- `public/areas.html`: links a family or a numbered subtopic to `kos.html?family=<id>&topic=<index>`.
- `public/kos-subject.js`: safely renders connected reading and original-source discovery links. User-entered ideas use a browser fragment, not a query-string navigation history. No untrusted HTML is inserted directly.
- `functions/api/kos/links.js`: read-only, source-discovery endpoint for a family, subtopic or public idea.
- `functions/api/kos/resolve.js`: resolves against the dated family register, KOS resource mapping, 35-resource public library, 53 living research routes, the 18-report register, priority group associations, the 211-issue / 56-entity graph, the independent 174 historical issue register, the issue-identity candidate crosswalk and the full public site-route inventory. A route, label, date or topic association is a **lead**, not an original source check or a verified directed relationship.
- `public/data/qp-kos-resource-links-2026-11-21.json`: stable catalogue-ID and family mapping from the public resource registry. Test receipts compare its item IDs, URLs and review dates to the existing JavaScript resource catalogue to prevent silent drift.
- `functions/api/kos/paper.js`: an **optional, default-OFF** on-demand gateway. Requires explicit enabled flag, real provider URL/token, actual Cloudflare rate-limit binding, a consented on-demand action, and schema-valid source-linked paragraphs. Upstream must fetch/verify original material and produce a complete narrative. This gateway never automatically publishes; a service-claimed source-check date is not independent public certification.
- `scripts/check-kos-connections.mjs`: deterministic coverage and fail-closed test; included in public release CI.

For connected resources that are not public web material (private uploads, external providers, partner systems), a separate explicit authorization, data-use contract, connector and privacy review are required. The current resolver cannot magically reach those systems.

This implementation is a source-discovery and gated paper-generation path, **not evidence that a live generative research provider has been configured**. The public page must be honest about that at every step.

### Connection-to-paper contract

1. Exact subject or selected subcategory, plus dated coverage identity.
2. Follow linked source registry, relevant original documents, report citations, organizations, money states, historical archives, other entities and affected systems.
3. Rank evidence by topical relevance and most recently checked substantive date, preserving old versions for LL.
4. Retrieve original sources using permitted connectors. Validate date, document identity, jurisdiction and what each passage actually supports.
5. Reconcile conflicts without automatically merging historic IDs or treating related groups as confirmed actors.
6. Qify a plain-language, approximately tenth-grade narrative, with original-source IDs supporting every substantial paragraph and claim. Include human impact, money, downstream effects and realistic options wherever material.
7. Send a user-visible provisional paper; keep any public publishing action separate under human authority.
8. Reopen the packet when TTL, corrections, contradicting evidence or source updates require it.

### Verification gaps

The resolver and crosswalk index are implemented on the review branch. Independent accuracy testing of on-demand synthesis, external source retrieval, current content rights, user consent language, provider credentials and Cloudflare rate limiting are **not yet complete**. No production claim is allowed until the actual service is configured, simulated under failures and verified.

## Current concrete sample

`public/kos-story-pueblo-flood-1921.html` is a separate contextual account of the 1921 Pueblo flood. It links historical river geography, people and uncertain casualty records, engineering, public financing, the Pueblo Conservancy District and current resilience lessons. Its sources must be independently read and the paper reviewed before publication. It is not an automatically generated Q10 production output or evidence of a fully automated subject-wide research process.

## Non-goals and failure modes

- Do not use site directories as evidence authorities; route availability is not substantive coverage.
- Do not assert that all 25 subject families already have a full paper.
- Do not auto-merge homonymous people, locations, organizations or funds.
- Do not confuse proposed budgets, grant awards, issued debt, actual cash payments or measured results.
- Do not score political actors, legal guilt, medical eligibility or personal capability based on unverified inference.
- Do not let readability erase uncertainty or diverse documented experiences.
- Do not publish technical internals, log dumps, empty metadata blocks, TODO content or development chatter to readers.
- Do not treat checked-in code, CI success or a GitHub PR as production verification.

## Version changes

2026-11-21: established KOS as core intelligence and context-production layer, distinct from the topic directory and static Qify lookup. The earlier subject-family registry remains a navigational scope list, not evidence or a publishable finished-paper list.
