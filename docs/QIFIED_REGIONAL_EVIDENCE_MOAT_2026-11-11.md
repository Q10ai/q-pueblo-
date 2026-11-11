# Q-Pueblo competitive thesis — Qified Regional Evidence Protocol

**Document ID:** QP-PRODUCT-2026-MOAT-001  
**Version:** 0.1.0 | **Prepared:** 2026-11-11 (America/Denver)  
**Scope:** Product architecture and strategic hypothesis, not a claim of unique intellectual property, production maturity or validated user outcomes.  
**Status:** Research/design draft; no website deployment, secrets, billing, automations, model runtime or Twin Pueblo activation.  
**Companion:** [QP-REGION-2026-ENTITY-SYSTEM-001](../research/packets/QP-REGION-2026-ENTITY-SYSTEM-001.md) and [QP-FIN-2026-AUDIT-001](../research/packets/QP-FIN-2026-AUDIT-001.md).

## Executive proposition

**Q-Pueblo is not a budget dashboard, official records system, new auditor, judicial authority, investigation agency or generic chatbot.** Its proposed differentiator is a public, jurisdiction-spanning, evidence-controlled **Qified Regional Evidence Protocol** that turns disparate records and a resident's question into a dated, contestable, actionable and durable issue packet.

**Moat hypothesis:** durable, legally contextualized cross-source connections + carefully validated source-to-claim mappings + public amendments and challenge process + reusable open-standard interoperability + community trust, not any single AI model or public dataset. Every part must be earned and validated in deployment. The Qified name/brand does not confer novelty or exclusive rights in civic fact checking or graph analysis.

## What to reuse, not reinvent

| Existing capability | External examples | Q-Pueblo reuse / differentiation |
| --- | --- | --- |
| Government ERP, budget book, financial reporting, transparent reporting and AI | OpenGov / ClearGov | Do not reproduce an ERP; provide independent external evidence joins and ordinary-language interpretations |
| Payments, vendor and contract browsing | Checkbook NYC | Link outward to transactions and qualify accounting stage; Q does not invent payment history |
| Procurement lifecycle and common ID | Open Contracting Data Standard (OCDS) | Use published fields and OCIDs, extend with authority, evidence, public impact and contested-claim relations |
| Auditors' corrective-action tracking | Seattle / Portland municipal auditors | Track independent auditees and recommendation closures based on documentary review, without declaring them 'fixed' by elapsed time |
| Federal award and subaward data | USAspending.gov | Join awards to recipients, local programs, subrecipients and observed expenditures, preserving federal obligation ≠ payment |
| Pueblo County priority dashboard | Pueblo County | Link to official status and dated context; never silently replace official record |

References: https://opengov.com/platform/ ; https://opengov.com/products/financial-management/financial-reporting/ ; https://cleargov.com/rc/news/engagement-launch ; https://www.checkbooknyc.com/ ; https://www.open-contracting.org/data-standard/ ; https://www.seattle.gov/city-auditor/recommendations ; https://www.usaspending.gov/ ; https://www.pueblocounty.gov/what-we-are-working

## The Qified process — reproducible, bounded state machine

1. **ASK / SCOPE:** natural-language question; audience, geography, jurisdiction, time period, harm sensitivity, desired output; offer available evidence even when a full investigation is not finished.
2. **FIND / IDENTIFY:** search existing approved packets and authoritative primary records first; resolve official entity IDs and name aliases; note absent/inaccessible records.
3. **VALIDATE / DATE:** preserve source URL, title, publisher, retrieval/access date, publication/effective date, cryptographic digest for locally held artifacts where possible, precise quotation or page locator, and legal/accounting scope. An award, ordinance, audit and allegation are different evidence types.
4. **CROSSWALK:** construct issue/entity/funding/contract/event links; distinguish direct/indirect/third-order relationships and actual legal authority. Stage financial figures: proposed → authorized → obligated → invoiced → paid → delivered → measured outcome, with pass-through anti-double-count groups.
5. **CHALLENGE:** identify contrary evidence, alternative explanations, conflicts in dates/methods, missing evidence and review owner. Avoid inferred motives or allegations as facts.
6. **QIFY / EXPLAIN:** provide sourced facts, interpretation labelled as analysis, uncertainties, scenario assumptions, practical options, child/family/service effects, EE / T2Y eligibility checks and RX/continuity; tailor vocabulary to reader without changing the underlying fact ledger.
7. **ACT / ENABLE:** give the resident the correct responsible office, underlying originals, optional records-request draft, public-meeting participation, accessible format, correction mechanism and decision trade-offs. No automatic advocacy, targeted pressure or enforcement decision.
8. **AMEND / PRESERVE:** append new evidence/amendments, retain historical versions and provenance, mark time-sensitive findings for recheck. TTL expiry marks **review due**, never hides established historical information or fabricates up-to-date verification.
9. **RELEASE:** only after evidence, legal/privacy and human editorial gates. Default to research draft. User-facing live AI drafts must be clearly labelled unreviewed until approved.

### Invariants

- No claim is VERIFIED without checkable supporting evidence and statement-specific scope.
- Public access is not conditioned on a packet being complete; **open questions remain visible**.
- A model response, changed page hash or shared assertion cannot automatically become a published finding.
- No conflation of City vs County, payment vs appropriation, current vs historic jurisdiction, or entity vs private recipient.
- No citizen profiling, inference of protected traits, doxxing, retaliation workflows, black-box citizen scores or autonomous governance.
- User owns choices; editorial reviewer owns publication; site and AI can be disabled independently.
- Privacy by default: public submissions are not presumed public; no ingestion of private documents into public LLM context without permission and protection.
- No AI provider claim, production status claim or live twin claim without an actual operational receipt.

## Proposed normalized data contracts

```json
{
  "packet_id": "QP-FIN-2026-AUDIT-001",
  "version": "0.1.0",
  "status": "RESEARCH_DRAFT",
  "as_of": "2026-11-11",
  "jurisdictions": ["city-pueblo", "pueblo-county"],
  "claims": [
    {
      "claim_id": "example:financial-audit-vs-compliance-scope",
      "classification": "ANALYSIS",
      "evidence_refs": [],
      "limitations": ["Opinions and compliance findings have distinct scopes"],
      "counterevidence_refs": [],
      "review_state": "OPEN"
    }
  ],
  "money_flows": [],
  "responsible_offices": [],
  "last_reviewed": "2026-11-11",
  "review_due": null,
  "editorial_approval": false,
  "history": []
}
```

Schema is illustrative, not a production registry. In deployed versions, enforce schemas with validators, stable machine IDs, access scopes and cryptographic object provenance. Historical case IDs are not assertions of verified content.

## Interface choices — cross-platform must be real, not a promise

- **Inputs:** official websites/PDFs, public spreadsheets, government APIs, public meeting documents, Git/Drive controlled archives; no blanket crawling, uncertain legal permissions or unauthorized private accounts.
- **Normalizers/adapters:** standardized jurisdiction, authority, time, fund, contract and source anchors. Use OCDS when applicable and USAspending recipient/award identifiers when source licenses allow.
- **Evidence store:** immutable original/evidence reference plus append-only claim ledger; preserve source content and rights, amendments and review history; reconcile authorized redactions.
- **Reasoner:** cheapest eligible method (local exact lookup, deterministic calculation, then optional API model). AI cannot independently assert its own claims as verified. If API down/quota hit, serve source-backed existing packets.
- **Surfaces:** mobile web, accessible public pages, user-generated downloadable packets, optional RSS/email signals subject to user opt-in, interfaces to future authorized civic tools. A link to Git/Drive is not proof of a live integration.

## Why this may be defensible

Defensible assets are **validated evidence crosswalks, domain-specific reconciliation rules, trust and correction history, public participation process, and reliable distribution**. These compound with use and history. A vendor can copy superficial AI output or dashboards; copying a verified historical graph with correction lineage and community adoption is harder. However those data products may be reproducible, and user trust must be continually earned. Do not make exclusivity claims.

## First proof: test on three real, jurisdiction-spanning issues

1. **City/County audits:** same request answered from distinct auditees with financial opinion vs control finding vs federal Single Audit, and open corrective-action chain; no allegations attributed across agencies.
2. **Lime Road/Falcon/transport:** connect road jurisdiction, past appropriations, incentive commitments, expenditure/asset stages, PACOG/CDOT/state links, private contracts and traffic outcomes; explicitly label unknowns.
3. **Water/land-development/permits:** show the actual permitting office on date, water authority, utility capacity, project fees, and relevant City vs County boundaries, with conditional impacts not ungrounded forecasts.

**User contract test:** for a question not in the index, immediately return the most reliable available dated record(s), what remains unknown, where to obtain the next record, and a draft usable next action. Never answer only 'no packet exists'.

## Evaluation before claiming a moat

Baseline each outcome against ordinary search, an off-the-shelf AI chat and existing government portals. Measure **claim-level source support**, jurisdiction and date correctness, financial stage errors, effective counterevidence treatment, coverage of unknowns, user usefulness, accessibility, moderation fairness, correction turnaround, cost per *verified useful answer*, and whether a human can reproduce the answer from linked sources. Require independent review of a blind issue sample; publish failure cases, not just successful demos.

No target precision, adoption, cost saving or error rate has been empirically established. Set numerical acceptance thresholds only after a benchmark and operating budget exist. Gate full release on security/privacy, human correction appeal, source legal permissions, dry-run tests and a recorded rollback target.

## Launch maturity snapshot as of this draft

**Already in Q-Pueblo Git:** public static issue/report library, dated source-attributed briefs, guarded lexical Qify matching, EE/T2Y browser-local reference tools, editable packets and reviewed public documents.  
**Not established:** robust multi-agency live ingestion, authoritative cross-source entity graph, ongoing fact validation, automatic corrections, deployed AI research backend, hosted private intake, live digital twin or exact production site parity.  
**Decision:** differentiate via verifiable Qified procedure and citizen utility, not by claiming that novel AI architecture is operational today.
