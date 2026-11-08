# Q-Pueblo Living Packet Contract — v2 review

Status: design review only · 2026-11-07 · no automatic publication

## Core experience

Users choose the level of detail independently of research completeness:

1. **Quick answer** — 1–3 plain-language paragraphs, what happened, why it matters, data vintage.
2. **Essential facts** — authority, boundaries, time, key institutions, high-value numeric facts with status.
3. **Evidence and money** — provenance, decisions, contracts, funding stages, corroboration, contrary sources, uncertainty.
4. **Connections and effects** — first-, second-, and third-order entity dependencies; cross-domain exposures, Q Effect, competing scenarios, tracked outcomes.

A packet is useful before every section is complete. **No percentage-complete score** and no fake certainty. A packet may be PARTIAL indefinitely, while verified material is readable.

## Independent packet-section statuses

Every section carries one of:

- **NOT_INDEXED**: not present in indexed archive; show "Not yet available."
- **INDEXED**: topic and metadata exist, evidence not yet reviewed.
- **SOURCE_LINKED**: source pointers registered but claim validation is pending.
- **REVIEWED_PARTIAL**: supported portion may appear, with explicit limitations.
- **VERIFIED_FOR_RELEASE**: dated, claim-scoped approval completed.
- **DISPUTED**: incompatible source accounts, retain competing interpretations.
- **STALE_RECHECK**: review TTL expired or a material event occurred.
- **SUPERSEDED**: replaced by linked newer revision, archived version remains accessible.
- **REDACTED**: protected personal/sensitive fields blocked from public access.

Section statuses are not a universal verdict on the entire packet. Source-link existence never automatically promotes claims.

## Stable packet interface

```json
{
  "packet_id": "QP-ISSUE-STABLE-ID",
  "title": "Human-readable title",
  "domain": ["public_finance", "infrastructure"],
  "jurisdictions": ["City of Pueblo", "Pueblo County"],
  "as_of": "2026-10-16",
  "publication_state": "INDEXED",
  "revision_id": "v1.0",
  "sections": {
    "quick_answer": {"status": "REVIEWED_PARTIAL", "content": "...", "source_ids": [], "as_of": null},
    "essential_facts": {"status": "SOURCE_LINKED", "facts": [], "source_ids": []},
    "authority": {"status": "INDEXED", "institution_ids": []},
    "money": {"status": "SOURCE_LINKED", "instrument_ids": []},
    "evidence": {"status": "SOURCE_LINKED", "source_ids": []},
    "relationships": {"status": "INDEXED", "edge_ids": []},
    "effects": {"status": "NOT_INDEXED", "model_ids": []},
    "corrections": {"status": "INDEXED", "amendment_ids": []}
  },
  "next_update_triggers": ["official_vote", "signed_contract", "paid_invoice"],
  "human_review": {"release_approved": false, "reviewer": null, "reviewed_at": null}
}
```

## Traceable relationship edge

Each institutional or financial edge has `source_id`, `target_id`, `predicate`, `legal_basis`, `effective_date`, `observed_at`, `source_ids`, `evidence_state`, `hop` and `impact_mechanism`.

- Hop 1 = direct party or exposure supported by a record.
- Hop 2 = documented intermediary dependency.
- Hop 3 = downstream exposure/modelled consequence; explicitly conditional.
- A shared organization, person or web link alone is **not** proof of a legal, financial or causal relation.

## Funding records

Do not collapse states: requested → appropriated → authorized → contracted → invoiced → disbursed → reimbursed/recovered → realized benefit. Each entry needs payer, recipient, authority, fund restriction, instrument, amount/currency, event date, source and source vintage. Do not sum maximum contract exposure, actual cash paid, grants, guarantees, and private investment as one spend total.

## Intake and updating

1. New signal or packet request enters private quarantine; no automatic publication.
2. Deduplicate aliases and identify canonical objects without overwriting older records.
3. Assign sources with origin, content date, effective date, observation date, publisher and preservation locator.
4. Run legal, privacy, person-safety and attribution checks.
5. Reconcile with prior evidence, contradictions and source TTL.
6. Human editor approves claim-scoped public fields. Unsafe claims remain HOLD.
7. Append a versioned amendment; preserve old snapshot and rollback.
8. UI refreshes only the released subset; "what's new" and "what's missing" remain visible.

Public uploads, confidential allegations, private submissions and live AI agents remain disabled until their own security and editorial gates pass. The static Pages ZIP must not be represented as a live data API.

## Mobile UI gate

- Search before complexity; no dense navigation required to reach an issue.
- Four visible, keyboard-accessible level controls; keep reader-selected depth when switching packets.
- Readable 16px body, high-contrast labels, 44px touch targets and focus indicators.
- Source links open externally, clearly labeled; packet relationships stay in-app.
- Distinguish "unknown" from "no effect"; never hide missing evidence.
- Progressive enhancement: core research text must remain readable without online AI.
