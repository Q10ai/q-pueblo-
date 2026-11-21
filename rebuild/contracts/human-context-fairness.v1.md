# Q Pueblo v2 — Human Context, Concerns, Fairness and Evidence Policy

**Design date:** 2026-11-21
**Status:** deterministic production contract and regression candidate, not autonomous human modeling or a complete fact-checking service.

## Objective

KOS must help people understand difficult or unsettling public subjects by addressing **real, documented concerns and common misunderstandings** with the strongest supportable evidence. It must not dismiss fears, assign people beliefs or motives, manufacture agreement, sensationalize risks, or present an unsupported rumor as a peer of a verified public record.

People bring different experiences, needs, knowledge and priorities. We can examine **multiple plausible perspectives and outcomes** as a background analytic discipline. The project's phrase “each human is quantum” is used only as an analogy for uncertainty, non-determinism and respect for each person's unique agency. It is **not** a scientific assertion that quantum mechanical processes determine an individual's opinions or that Q can read hidden mental states.

## Human-context lens (internal, not public profiling)

1. **Scope**: What situation, location, time, institutions and household/service consequences actually concern the reader? Only use details they explicitly provide or that are appropriate to the public subject; no inference of sensitive traits or private beliefs.
2. **Possible perspectives**: Residents, workers, service recipients, institution operators, funders and regulators may face different tradeoffs. Include only perspectives grounded in source materials or explicitly framed as hypothetical decision contexts.
3. **Evidence weighting**: Evaluate primary source quality, issuer authority, dates, independence, scope, disagreements and proof status. Do not assume two sides deserve equal weight when one claim lacks support. Distinguish factual disputes from values or policy preferences.
4. **Misunderstanding clarification**: Explain terms, rates, causal claims, accounting stages, procedure and limitations with concrete examples. Correct an error without shaming the person who asks.
5. **Concern response**: Answer the material question in ordinary language. Explain what is known, what is uncertain and what the consequences mean in real life. Where supported, identify realistic protective/participation steps.
6. **Options and rights**: Show potential positives, negatives, risks, costs, needs and gaps, plus RX pathways for disagreements. Preserve due process, consent, lawful labor rights and individual agency.
7. **SHOCK and time**: Only evaluate material dangers with credible relevance; a planning scenario is not an active emergency. Use original official alerts where emergency decisions depend on current conditions.
8. **Follow-through**: Track corrections, changes and meaningful outcomes. TTL rechecks cannot silently rewrite the historical record.

## Output shape — behind-the-scenes data to readable explanation

A `CONCERN_EXPLAINER` product is emitted only for a PUBLIC_CONTEXT_ALLOWED concern with a substantive explanation, a reasoned evidence status, admitted claim/source IDs, explicit limitations and optional source-linked documented perspectives. Input statuses:

- `EVIDENCE_SUPPORTED`: an evidence-led answer, subject to independent source review.
- `EVIDENCE_MIXED`: supporting records disagree or cover different dates/scopes; explain what each does and does not establish.
- `NOT_YET_ESTABLISHED`: the concern is legitimate to ask about, but the specific claim is not demonstrated by the checked material.

These are **provisional labels**, not final truth rankings. A concern without adequate evidence is not filled with boilerplate or fictional quotes. Unknowns remain visible without treating them as evidence of wrongdoing.

The public narrative should naturally answer: *What is happening? Why are people concerned? What do records show? What is still uncertain? What does it mean for people in Pueblo? What can be done, and by whom?*

Do not add mandatory empty sections to every paper. Concerns and misunderstandings are included only where relevant.

## Fairness, neutrality and accuracy

- Neutrality is not neutrality between evidence and invention. Weight records according to support.
- Describe allegations, arrests, charges, proceedings, proven findings and appeals separately.
- Show policy tradeoffs and legitimate value differences without endorsing a political party or assigning hidden motives.
- Show institutional views alongside affected people's source-documented experiences, but do not invent representative quotations or personalize a model of a reader.
- Separate predicted consequences, source-reported impacts, lived accounts, administrative data and statistically measured outcomes.
- Be clear about confidence and gaps when these affect the real-world decision; do not overstate precision or imply certainty that is not attainable.
- Do not infer sensitive personal attributes, diagnoses, ideology, vulnerability or psychological profile from browsing habits, entered questions or private memories.

## Privacy and Q boundaries

All public inputs must explicitly declare public visibility and PUBLIC_CONTEXT_ALLOWED release classification. References to children, victims, patients, private family histories, membership lists, confidential Q processes, credentials, prompts, private connectors and protected infrastructure details must not be copied into public output. Automated leak scanning is a defense-in-depth control, **not a proof of complete privacy**; independent review, minimization, authentication and consent remain mandatory.

Public-facing explanations identify their original, independently reviewed sources, version, dates, material uncertainties and corrections. Internal plane assignments, memory admission details, ability selection, hidden safety gates and confidential Q implementation should not be displayed.

## Implementation and verification status

- Implemented: source-bound deterministic concern/misunderstanding product in v2 production pipeline; provisional evidence status, source/claim provenance, privacy classification, suppression of unsourced or private submitted concerns.
- In validation: regression tests, leakage controls, fairness/false-balance cases, readable narrative integration.
- Not implemented: a source-retrieving live AI engine, behavioral modeling of individuals, guaranteed impartiality, automatic fact-checking of user-supplied claims or automated public publication.
