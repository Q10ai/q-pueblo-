# Q-Pueblo regional entity and issue-coverage architecture

**Packet:** QP-REGION-2026-ENTITY-SYSTEM-001 · **Version:** 0.1.0 · **As of:** 2026-11-11 America/Denver  
**Classification:** Public-safe architecture and documentary leads; human review; not a verified full regional inventory.  
**Activation:** Public website static/review-first; **no autonomous investigation, private intake, public auto-publication, operational Twin Pueblo changes or paid API services**.  
**Relationship:** Companion to QP-FIN-2026-AUDIT-001. More than one open packet can address a shared entity without implying equivalence or shared responsibility.

## Mission and coverage boundary

Every Pueblo resident should be able to ask about an **issue**, **place**, **institution**, **project**, **funding stream**, **contract**, or **service** and receive the current available, dated, cited answer even while questions remain open. Treat Pueblo region as a **jurisdiction-spanning service/funding graph**, not a single City administration.

## Entity / authority graph — initial coverage

| Layer | Initial nodes | Records to obtain | Governance boundary |
| --- | --- | --- | --- |
| Municipal | City of Pueblo, Council, Mayor, finance, public works, utilities, planning, airport, police/fire, enforcement | ACFR/Single Audit, budget amendments, contracts, council agenda, permits, payments | City financial/legal authority not attributable to County by proximity |
| County | Pueblo County BOCC, finance, Treasurer, Assessor, Clerk, Sheriff, roads/bridges, human services, planning | ACFR plus distinct Single Audit, county budget, fund ledgers, BOCC votes, audits, priority dashboard | County financial authority, including unincorporated service area |
| Districts | Pueblo West Metropolitan District, Pueblo Water, sanitation/water/fire districts, Colorado City and other special districts | Audit/exemption, rates, debt, budgets, board minutes, capital projects | Each entity independent; test service boundaries and legal status individually |
| Education | Pueblo School District 60, Pueblo County School District 70, CSU Pueblo, PCC | school transparency files, audits, mill levies, grants, facility and workforce programs | State higher education and elected school boards have different governance |
| Regional / quasi-public | PACOG MPO, PURA, development intermediaries, public health, building permit bodies, PuebloPlex and regional collaborations | IGAs, procurement, grant and subsidy awards, meeting decisions, annual reports | Legally verify public vs nonprofit vs joint entity for every node |
| State / Federal | Colorado OSA/DOLA/CDOT/CDE/CDPHE, HUD, DOT, EPA, Treasury, federal grantmakers | audits, subawards, TIPs, state allocations, compliance and environmental records | Grant maker ≠ prime awardee ≠ subrecipient ≠ payment recipient |
| Outside / private effects | developers, contractors, utilities, employers, nonprofits, hospitals, local businesses | lawful public contracts, outcomes, audited grant transactions, project milestones | Public-interest links do not turn private entities into public agencies |

**Known live source anchors:** Pueblo County [ACFR](https://pueblocounty.gov/budget-and-finance-department/annual-comprehensive-financial-report-acfr), [Single Audits](https://county.pueblo.org/budget-and-finance-department/single-audit-reports), [budgets](https://pueblocounty.gov/budget-and-finance-department/county-budget), and [priorities dashboard](https://www.pueblocounty.gov/what-we-are-working); [Pueblo West budgets/audits](https://www.pueblowestmetro.us/548/Budget-and-Annual-Financial-Reports); [Pueblo Water financials](https://pueblowater.org/our-board/financials/); [D60 transparency](https://www.pueblod60.org/departments/business-services/financial-transparency); [D70 transparency](https://www.district70.org/district-information/district-departments/business-services/financial-transparency); [PACOG MPO transportation program](https://www.pacog.net/mpodocs).

## Ten interdependent public-issue lenses

1. Governance, audits, rule of law, representation and public participation.
2. Taxes, budgets, debt, grants, procurement and economic opportunity.
3. Jobs, industry, workforce, wages and business development.
4. Housing, land use, permits, redevelopment and affordability.
5. Roads, airport, freight, mobility and accessible transport.
6. Water, utilities, energy, climate, drainage and environmental protection.
7. Public safety, public health, behavioral health and emergency preparedness.
8. Schools, higher education, training, youth services and family impacts.
9. Culture, historic preservation, arts, recreation, agriculture and tourism.
10. Information systems, civic service access, privacy, resilience and technology.

Each issue records direct, secondary, tertiary and cross-jurisdictional effects; scenario analysis is always labelled as hypothetical, not a forecast. Record child/family effects without constructing personal profiles.

## Current regional signals — independently sourced, not misconduct findings

- **County FY2025 audit work:** County November 2026 priorities update records contracts for financial close and 2025 bank reconciliations, statement delivery and October 26 auditor fieldwork week. Track completion and OSA receipt separately. https://county.pueblo.org/board-county-commissioners-office/what-we-are-working
- **Permitting jurisdiction changed 2026:** City of Pueblo and Boone projects use Southern Colorado Building Department; unincorporated Pueblo County projects use County Building Division. Historical PRBD sources may still say otherwise. Store legal effective date per rule and preserve pre-2026 history. https://pueblopermits.com/ and https://web.prbd.com/transition.php
- **Transportation project chain:** PACOG's 2025–2028 TIP, FY2025 obligated projects, FY2026–27 work program and 2050 plan form a funding/delivery comparison. The plan is NOT a payment record. https://www.pacog.net/mpodocs
- **State fiscal verification:** Colorado OSA checks local audit filings and has special district fiscal-health assessments; do not treat the OSA as the auditor of every local transaction. https://content.leg.colorado.gov/agencies/office-state-auditor/local-government
- **Federal awards:** USAspending supplies federal prime/subaward and recipient data; obligations are not local cash disbursement or measured benefit. https://www.usaspending.gov/ and https://api.usaspending.gov/docs/endpoints

## Proven operating patterns that Q-Pueblo can emulate

| Model | Demonstrated real-world capability | Reusable Pueblo feature |
| --- | --- | --- |
| New York City Checkbook | Public agency/vendor spending and contracting search | Source-linked contract → disbursement explorer; clearly separate ceiling from paid |
| NYC Comptroller Late Contracts | Publicly visible contract registration delays | Timeliness metrics for purchase orders, contracts and payments, with exemptions |
| Seattle City Auditor | Public tracking of recommendations and documentary implementation follow-up | Audit finding → responsible custodian → due date → evidence of closure |
| Portland City Auditor | Multi-year audit recommendations and regular follow-up | Issue correction queue and review history |
| Pueblo County Smart Priorities | Locally published status dashboard | Mirror by pointer, track source date, compare funding and outcomes, never overwrite official record |
| USAspending | Federal award, subaward and recipient APIs | Award lineage across HUD / DOT / state intermediaries / Pueblo entities |
| Open Contracting Data Standard | Public procurement lifecycle model and change history | Interoperability ID, releases, planning → award → contract → implementation |
| Open Referral HSDS | Structured public human-services provider/location directory | Optional verified social services referral layer with freshness checks |

References: https://www.nyc.gov/site/mocs/resources/public-procurement-sites.page ; https://comptroller.nyc.gov/services/for-the-public/late-contracts-dashboard/ ; https://www.seattle.gov/city-auditor/recommendations ; https://www.portland.gov/auditor/audit-services ; https://www.open-contracting.org/data-standard/ ; https://docs.openreferral.org/en/3.0/hsds/about.html

## Data contracts

**Entity:** entity_id, official_name, aliases, entity_type, incorporation_or_authority_ref, governing_body, jurisdiction_polygon_ref, valid_from/valid_until, source_url, as_of, checked_at, confidence, human_reviewer.  
**Issue:** issue_id, title, ten_lens_tags, geography, linked_entity_ids, related_issue_ids, affected_service_ids, evidence_state, last_reviewed, next_review_due, source_refs, corrections, unresolved_questions, release_approval.  
**MoneyFlow:** flow_id, origin_entity, intermediary_entities, destination_entity, fund_id, appropriation/award/contract/obligation/invoice/payment/outcome amounts as **distinct** fields, fiscal_year, ledger_document_ref, restrictions, recorded_at, verified_at, confidence, anti_double_count_group.  
**AuditRecommendation:** recommendation_id, auditee, audit_fiscal_year, published_at, finding_text_ref, severity_as_reported, management_response_ref, owner, target_date, status, closure_evidence, verified_by, reopened_reason.  
**Event/Signal:** signal_id, issue_id, source_uri, source_published_at, observed_at, ingestion_method, hash, former_hash, status, review_decision, TTL and freshness banner, confidence, activation=false.  

**Core invariants:** no fact promotion from user allegation or changed hash; no silent record replacement; no auto-publication; no human-identity inference; no surveillance or retaliation targeting; jurisdiction must match event effective date; financial amount comparisons must share basis, fiscal period and fund scope; user-visible answers can state 'research open' and show established evidence without pretending an issue is finished.

## Reference workflow

1. Ask question → local packet/issue search → known answer with sources, status, last updated.
2. If insufficient: create a nonpublished research lead with authorized records-to-request and correct office; never invent findings.
3. Retrieve official/authorized records, preserve source provenance and prior versions; extract candidate claims.
4. Resolve jurisdiction/entity alias and date; map fund/contract/project, compare contradictory evidence, demand original instrument for claims about legality.
5. Present bounded Qified analysis: established / disputed / missing / implications / next action. Cost-bound API only if explicitly activated in later approved deployment.
6. Human publication or correction approval; maintain old versions and appeals / source counter-evidence.
7. Public site can show last verified snapshot and open gaps even if research service or AI quota unavailable.

## Prioritized pilot packets

- QP-FIN-2026-AUDIT-001 City + County audit findings as **separate auditees**.
- QP-PERMIT-2026-JURISDICTION: city/county 2026 permit authority and service effects.
- QP-TRANSPORT-PACOG-TIP: project plan → budget → obligation → construction → outcome.
- QP-UTIL-WATER-RATES: independent boards and user service outcomes.
- QP-EDU-D60-D70: audited finance, federal funding and learning/service outcomes.
- QP-HUMAN-SERVICES: verified referral/service directories; privacy-protective eligibility guidance.

## Exclusions and release gates

A public repo research packet is **not** a deployed website, activated source monitor, regulatory filing or finding of wrongdoing. No automatic ingest of private communications, personnel data or minors' records. Activation, secrets, billing, real-world service recommendations and irreversible actions require human approval and successful security/accuracy testing.
