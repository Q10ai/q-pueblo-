# Q-Pueblo — Election Atlas, Regional Twin & Independent Evidence Shadow
Version: 0.1 RESEARCH / CONTROLLED DRAFT
As-of: 2026-11-12 (America/Denver)
Status: Research and proposed architecture only. No production deployment or operational ingestion is asserted.
Scope: Pueblo City, Pueblo County, metropolitan/regional partners, state and federal interactions.
Owner: Human governed Q-Pueblo project. Independent, nonpartisan, not an official government website.
Relationship: Extend the existing regional twin/shadow and Qified issue packets; avoid duplicate application or data authority.

## Executive finding
Curator Atlas, described by its author as a locally hosted election mapping and campaign-finance analysis tool, is a useful case study for spatial joins, auditability, and restricted data access, but its source code, security implementation, and impact have not been independently examined. A campaign system is not an appropriate public model for voter-level data. The Q-Pueblo opportunity is to compose a physical regional digital twin with an **independent evidence shadow** of decisions, spending, obligations, amendments, and observed results. Every public conclusion must be source-linked, time-scoped, correctable, and reviewed.

## Definitions and boundaries
REGIONAL TWIN: Geospatial, temporal, and institutional model of parcels, roads, utilities (where publishable), projects, jurisdiction boundaries, fiscal flows, and service measures. Simulation outputs are explicitly labeled scenarios, not observations.
EVIDENCE SHADOW: Independently reconstructed event ledger from source records: what an entity stated/planned/authorized, what it contracted, what was actually paid or implemented, and which evidence supports each stage. “Shadow” means external verification, not access to hidden systems.
DUAL VIEW: Preserve official explanation and independent/critical interpretation, plus response/rebuttal and missing evidence. Neither is automatically true by virtue of its proponent. Apply symmetric evidence rules across parties, offices, agencies, and private proponents.
ELECTION RETROSPECTIVE: Historical district and precinct aggregate outcomes and committee-level campaign finance, not person/household-level political profiles, persuasion, or individual vote inference.
QIFIED PACKET: An evolving, versioned evidence packet. Do not mark an issue “complete” merely because initial research is done; sources and claims have review/refresh TTLs, with accessible current findings and open questions.

## Verified source candidates and comparisons
1. Pueblo County Election Results for November 2026: official dated updates, with next announced update November 13 and countywide estimate of 1,036 ballots outstanding on the visited version (as of November 12). Do not use that countywide estimate as a State Senate District 3 race count. https://pueblocounty.gov/clerk-and-recorder-department/election-results-november-2026
2. Pueblo County historical results and cast-vote-record landing page: historic official comparisons, subject to availability of each granular extract. https://www.pueblocounty.gov/clerk-and-recorder-department/previous-election-results-cast-vote-records
3. Pueblo County GIS: parcels and municipal/regional geospatial infrastructure. Check dataset currency, legal use, and sensitivity before combining. https://www.pueblocounty.gov/information-technology/geographic-information-gis
4. PACOG maps/GIS: entry point to City and County geographic portals. https://www.pacog.net/maps-gis
5. Colorado TRACER: original candidate/committee records; detailed reports and annual extracts (source page was dated 2026-10-12 in web snapshot, so NOT presumed current to election day). https://tracer.sos.colorado.gov/PublicSite/DataDownload.aspx
6. #FollowtheMoneyCO: Sandra Fish's Datasette-derived finance tables; independent transformation of TRACER with update and scope caveats. https://www.followingthemoneyco.com/ and https://www.followingthemoneyco.com/about
7. OpenElections Colorado: standardized public results and original source preservation, with an established CSV convention (county,precinct,office,district,party,candidate,votes). https://github.com/openelections/openelections-data-co
8. Redistricting Data Hub: precinct/geometry joins with availability varying by year/state. https://redistrictingdatahub.org/data/about-our-data/precinct-boundaries-and-election-results/
9. Open States / Plural: public legislators, legislative bills, votes and versioned bulk files; verify recency for each jurisdiction. https://open.pluralpolicy.com/data/
10. Open Contracting Data Standard: processes, stages, awards, implementation, and immutable releases with compiled records. Apply OCDS model as *internal crosswalk*, not claim local agencies publish conformant OCDS. https://standard.open-contracting.org/latest/en/primer/releases_and_records/
11. Aachen digital twin case study: municipal data platform plus surface and subsurface infrastructure, with governance/interoperability difficulties. https://urban-mobility-observatory.transport.ec.europa.eu/resources/case-studies/digital-twins-lessons-learned-city-aachen_en
12. Helsinki 3D city: a reference visualization and urban-model precedent, not a ready-to-run Pueblo implementation. https://www.hel.fi/en/decision-making/information-on-helsinki/maps-and-geospatial-data/helsinki-3d

## Election retrospective: balanced evidence protocol
- Preserve exactly the reported unofficial SD3 snapshot separately from certified outcomes: November 10/11 public feeds reported Aaron Gutierrez 36,624 and Dana Charles 30,759 (67,383 candidate votes), a 5,865-vote spread. **Do not treat as certified; recheck official site after canvass.** Comparative secondary evidence: https://saveyourstate.com/results/us/2026-general/co/
- Query TRACER candidate committees for **both** candidates with equal date window, committee IDs, cash-on-hand treatment, liabilities/refunds, and corrected report handling.
- Include outside-spending committees supporting OR opposing each candidate, disaggregate independent expenditures from direct candidate spend, avoid double counting transfers through 527s or IECs, and provide traceable filing IDs.
- Store the Atlas-author technical description as an attributed account only. Without code or system access, security claims (Google OAuth, LAN, offline geocoding) and campaign impact are UNVERIFIED.
- Nonpartisan interpretation: money differences, turnout timing, registration-class shares, ad effects, and electoral outcomes are different variables; no causal inference from the outcome alone.

## Data architecture / version contracts
Separation: 1 raw immutable evidence, 2 normalized claims and entity registry, 3 geographic identity/temporal boundaries, 4 interpretation and cross-check, 5 public reviewed views, 6 optional simulation with isolated scenario store.
RawEvidence = {source_id, publisher, canonical_uri, retrieved_at, published_at, valid_from, valid_to?, content_sha256, source_type, license, sensitivity, extract_version}.
Claim = {claim_id, subject_entity_id, predicate, object_value, unit?, spatial_unit?, observed_at, valid_at?, evidence_support_ids[], evidence_dispute_ids[], verification_state, explanation, review_due_at, packet_id, supersedes_claim_id?}.
Entity = {entity_id, legal_name, aliases[], entity_kind, jurisdiction, provenance[], valid_from, valid_to?}. Never silently merge entities based only on fuzzy names.
Event = {event_id, case_id, actor_entity_id, action, event_date, record_received_at, contract_process_id?, amount?, status, evidence_ids[]}.
Claim states = REPORTED, PARTIALLY_CORROBORATED, DOCUMENTED, DISPUTED, SUPERSEDED, WITHDRAWN, UNKNOWN. Differentiate source existence from factual truth and from legal conclusion.
Issue packet states = OPEN, ACTIVE_REVIEW, MONITORING, EXPIRED_REVIEW_TTL, ARCHIVED_HISTORY. Archive preserves history; TTL expiry triggers re-check, not evidence deletion.
Every aggregate observation records denominator, unit of geography, reporting coverage, time window, source version, and disclosure/suppression notes.

## System behavior / user interaction
Map (2D first) -> select geographic area -> open linked issue/project/financial trace -> compare official account, independent source claims and rebuttal -> examine source PDFs/records and dates -> challenge a specific claim -> reviewed amendment and version bump -> show what changed.
All views support “as of date”, filter by jurisdiction and evidence status, and accessible text-table alternatives.
A color-coded map MUST not imply voting preference from registration or ballot return. Default to public precinct/district aggregates, and suppress risky small cells and differencing queries.
Use real, documented boundaries; overlay geometry versions across redistricting or annexation rather than treating labels as static.

## Proposed pilots (synthetic before real-world data)
A. SD3 2026 retrospective: official snapshots vs later certified total; TRACER committee & independent spending on both sides; no individual voter roll or proprietary ballot-return data.
B. Project Falcon / Lime Road: compare pre-Falcon road planning, ownership assertions, grant/incentive commitments, ordinances, payment evidence, engineering milestones; include city and counterparty positions.
C. Pueblo Heritage Center building: location and property history, ownership/lease terms, administration proposals, institutional response, council proceedings, disposition and preservation impacts.
D. Regional infrastructure/service test: county parcel, project and GIS layers with uncertainty/latency labels, as availability allows.
Pilots are proposals; no claims that data has been ingested or reconciled.

## Technical direction (subject to repo audit)
Mapping: MapLibre GL JS + OSM/Protomaps where licensing permits; Postgres + PostGIS for spatial joins.
Data: source-specific adapters with deterministic parsing, schema validation, SHA-256 raw snapshots, dedupe and source-permission metadata. Always preserve original documents.
Relationships: normalized relational store with explicit entity/claim/event link tables before any specialized graph database.
Finance: OCDS crosswalk to obligations, awards, contracts, payments, invoices and changes; finance ledgers must distinguish authorized, appropriated, encumbered, expended, paid and reimbursed values.
Public service: read-only, reviewed static snapshots first; no autonomous publication or direct user uploads into public knowledge.
Security: ACL at ingest, restricted processing, public data minimization, suppression audits, rate limits, append-only events, access log, rollback and editorial sign-off.
Energy-effective implementation (EE): prefer batch retrieval, stable cache and human-assisted exception workflows, not 24/7 expensive crawling. Truth-to-Yield (T2Y): prioritize observable decisions and reusable evidence over decorative 3D renders.

## Acceptance / adversarial tests
- Replaying same source snapshot yields same normalized claims and digest.
- A corrected TRACER filing reverses/replaces prior amount without duplicate totals; raw versions remain intact.
- Two candidates receive identical committee matching and outside-spending treatment.
- Small cells or repeated map filters cannot reveal individual participation or an address.
- Countywide outstanding ballots cannot be displayed as SD3-specific.
- User can see a current partial packet while further evidence is pending.
- Contradicting sources remain visible and correctly attributed; contested allegation is not displayed as finding.
- As-of historical query reproduces old claim state and sources after an amendment.
- Jurisdiction and vintage mismatch triggers an explicit warning (e.g. changed precinct bounds).
- A simulated scenario is never displayed as an observed fact or an official forecast.
- Broken source URLs retain archived metadata and retrieve-at timestamps; do not invent cached content.

## Integration and control
Cross-reference pre-existing Q-Pueblo Regional Twin/Shadow Situation & Investigative Benchmark, Signal Register, Regional Entity Coverage, and Issue Packets. This document is a new research addendum, NOT a declaration that the site supports these features.
Recommended phase order: source/inventory crosswalk -> SD3 neutral historical demonstration -> evidence/finance process model -> issue-map overlay -> challenge/amendment review -> spatial simulations only after trust/quality tests.
Potential automatic refresh: official file hash or record-date change -> diff -> mark stale claims -> review queue -> publish authorized new version. Do not silently overwrite historical packets.
Publication gate: explicit human sign-off, privacy screening, source-citation and temporal validation, provenance/audit receipt, rollback tested.
Open questions: Atlas source/code availability; county cast-vote-record granularity; TRACER independent expenditure currency; infrastructure source licensing; existing code model compatibility.

## Addendum: direct comparators discovered 2026-11-12
13. Colorado Files / State Files: comprehensive independent state records crosswalk for PFDs, TRACER finance and outside-spending notices, bill positions, lobbyists, gifts, and votes. Its disclosed privacy methods include masking addresses and withholding family details. Its scope explicitly says City and County officials are not yet covered. Direct duplication risk HIGH for state-level finance, donor and legislative join features; Q-Pueblo should link and independently verify rather than copy the whole system. https://coloradofiles.org/methodology
14. Colorado Files SD3 retrospective: published snapshot as of 2026-11-03 includes both candidate committee totals and independent spending segmented FOR/AGAINST each candidate, plus its own explicit splitting rule for spending mentioning multiple candidates. Those figures are a site-calculated historical snapshot (not certified official totals or full late-filing reconciliation). https://coloradofiles.org/race/2026-general-state-senate-district-3
15. Colorado Works Better: independent expenditure/project and bills/votes public-records service with explicit FACT/CALC/SAMPLE/PENDING classifications, reproducible aggregation criteria, publication dates, corrections and limits. Direct duplication risk HIGH for generic state public-spend dashboards. Pueblo-specific multi-institution decisions, cross-jurisdiction source traces, open case packets, and dynamic geographic issue context are the recommended Q-Pueblo scope boundary. https://colorado.worksbetter.org/findings
16. Colorado Newsline's October 23 report (financial records as of morning October 22) states outside groups had spent over $1.2m in October to support Dana Charles and a smaller amount for Aaron Gutierrez; this is a dated statement of the publication's definitions, not a complete election-cycle or current accounting. https://sentinelcolorado.com/state-and-region-news/colorado-news-state-and-region-news/outside-partisan-groups-pour-millions-into-key-colorado-legislative-contests/

Differentiation rule: Q-Pueblo must not claim unique value for data that Colorado Files, Works Better, TRACER, OpenElections or Pueblo GIS already make accessible. Instead use federated links, normalized provenance, jurisdiction-aware connections, regional case tracking, comparable official/independent explanations, and the right to challenge findings. Cross-reference and cite the original publisher, preserve license restrictions, and never silently enrich with residential identification.
