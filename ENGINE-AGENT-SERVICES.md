# QPueblo — Launch Engines, Agents, and Public Service Contract

**Version:** 0.2.0 · **State:** draft review only · **Baseline date:** 2026-11-07 · **Production:** not activated

## Design law

- Categories answer **where visitors enter**. A resident should never need to choose an agent before reading a useful answer.
- Packets answer **what is known about the issue**, progressing through plain-language summary → essential facts → primary evidence and money → direct and networked effects.
- Shared engines answer **how evidence is handled**. They must work across subjects and jurisdictions.
- Agents answer **what assisted workflow is requested**. They are constrained clients of engines, not sources of authority.
- A visual network edge is not proof of causation, a financial transfer, legal power, or improper association.
- User privacy, human editorial authority and rollback are mandatory. No autonomy by implication.

## Public entry points

| Landing interface | Purpose | Connected domain group |
|---|---|---|
| People, Places & History | Place, neighborhood, identity, lived conditions, trends | QP-01/02/04/27 |
| Government, Law & Civic Action | Who governs; what law and vote applied on what date | QP-07/16/29 |
| Follow the Money | Payer, receiver, restriction, transaction and outcome | QP-13 cross-cutting |
| Housing, Land & Infrastructure | Parcels, buildings, affordable access, roads and lifecycle costs | QP-10/17/18 |
| Jobs, Business & Industry | Businesses, work, skills, earnings, sector transitions | QP-11/12/13/28 |
| Water, Energy & Environment | Water, energy, nature, agriculture, environmental health | QP-19/20/21 |
| Health, Safety & Families | Health, children, civil liberties, justice and recovery | QP-03/09/15/26 |
| Education, Culture & Community | Schooling, recreation, arts, heritage, voluntary groups | QP-04/05/06/08/14/22 |
| Transportation, Airport & Connections | Airport, rail, roads, freight, jurisdictional interfaces | QP-17/25 |
| Technology, Information & Future | AI/privacy, information integrity, longitudinal outcomes | QP-23/24/30 |

Multiple entries for a domain are intentional: it is better for "energy" to be discoverable under household bills and industry than to force a single silo. Every domain QP-00..QP-30 has at least one mapped surface in SITE-TAXONOMY.json; QP-00 and other control domains are cross-cutting.

## Shared engines: operational contract

| Engine | Input | Response | Beta status | Gate for production |
|---|---|---|---|---|
| **E1 Search & Retrieval** | Query, locality, timeframe | Indexed topics + known source links | Static search/navigation working in review build | Fast indexes, public-only projection, query safety |
| **E2 Source & Truth (T2Y)** | Source, claim, date | Provenance, evidence grade, contradictions, TTL | Controlled evidence directory + guided checks; no live review automation | Citation-level validation, source archive, human release |
| **E3 QIFY Packet Compiler** | Issue ID, approved statements | Four-depth packet, holes, versions, corrections | Working prototype with partial packet state | Release schema, editorial queue, claim-level access |
| **E4 Entity/Authority Graph** | Entities, legal date, predicate | Direct relations, second/third-order paths, effective legal scope | Static limited registry associations only | Link provenance, date-bounded legal basis, privacy, identity merges |
| **E5 Money Trace** | Fund/contract/grant/tax IDs | Stage-separated sources/uses/obligations/beneficiaries | Structured methodology & curated archives, not transaction-complete | Receipts, amendments, de-dup, audited payment join |
| **E6 Impact & Scenario** | Baselines, proposed choice, model | Assumptions, 1st–3rd-order conditional consequences, uncertainty | Q Effect framework only; no validated regional forecast | Calibrated models, uncertainty, invariants, human counterfactual review |
| **E7 Learning & Prompt Builder** | User goal, civic level | Guided prompts, activity, verification steps | Static prompts and initial quiz | Source-approved Pueblo question bank, accessibility audit |
| **E8 Timeline & Change** | Issue, event, active version, TTL | What's new, what's superseded, what's stale | Date labels only | Scheduled monitors, authoritative diffing, append-only ledger |
| **E9 Spatial/Digital Twin** | Geometry, address/asset, scenario | Layered civic map + optional impact animation | **NOT OPERATIONAL** | Licensed GIS, provenance, validated model, data security and QA |
| **E10 Cost-to-Live / Cost-to-Build** | User-controlled assumptions, local tariffs/rates | Transparent itemized scenario and uncertainty | Concept design only | Exact rates+vintages, unit tests, scenario disclaimers, no invented quotes |

**Constraint:** E1–E8 are not autonomous agents. In the current Cloudflare Direct Upload public beta, no server-side agent runtime or scheduled event processing is deployed. E9 and E10 must not be labeled usable until independently tested.

## Agent placement and permissions

| Agent | Appears inside | May do initially | Must not do without separate activation |
|---|---|---|---|
| Pueblo Guide | Every category/packet | Route to plain-language context and source links | Assert unreviewed claims as truth |
| Evidence Researcher | Evidence tab / source trail | Generate verifiable research/checklist prompts | Crawl/upload/release autonomously |
| Money Tracer | Finance views | Explain accounting stages and where to verify | Infer corruption from a relationship |
| Authority Navigator | Government and legal pages | Point to laws, agency scope and original decisions | Give dispositive legal findings |
| Entity/Effect Analyst | Entity/impact panes | Expose qualified static associations and conditional second/third-order pathways | Profile private people or assert causal chain without sources |
| Civic Learning Coach | Learn/Play and newcomer flow | Quiz, explain civic concepts, trace where to look | Impersonate public services or claim civic authority |
| Claim Checker | Controversy and packet correction | Create neutral competing-hypothesis checklist | Publish determinations on a person without evidence/human review |
| Update Monitor | Packet-change panel | Manual update guidance | Fetch/run scheduled checks without audited backend and source consent |

All agent outputs must distinguish **quotation, verified source statement, inference, scenario and unknown**. They must offer a source locator and last-checked date; no undisclosed private-information processing.

## Launch visitor services

**Always free public layer:** search; browse source links; read public packet summaries and registered issue metadata; study civic terms; locate official laws/records; understand money-stage process; explore linked topics; use static prompt builder, outline builder and the starter Pueblo learning challenge; download public research outlines when generated by client-side tools.

**Available as packets mature:** full fact tables, audited contract and payment chain, official-actor effective-dated role map, evidence-by-claim views, issue updates/corrections, source-linked comparisons and downloadable versioned reports.

**Not launch-day capabilities:** authenticated public submissions, full conversational live agents, payment/bank/PII processing, live alerts, automated grant/contract ingestion, guaranteed current officeholder roster, reliable digital twin or outcome prediction.

**Later opt-in:** tailored QIFY regional analyses, public or organizational training, custom research deliveries; keep original civic information free and avoid using sensitive private data.

## Device and accessibility contract

Mobile search at top; ten image/brand tiles; entry into a real issue without login; four-depth control, compact source table and progress states in each packet; visible exact source freshness and gaps; adequate text contrast; buttons reachable by keyboard; reduced-motion respect; no hover-only explanations; optional low-data mode; imagery cannot substitute for selectable readable text.

## Back-front/front-back verification

**Forward chain:** original source record → vintage → evidence excerpt → explicit claim state → issue/entity/finance ledger → public packet level → category/search entry.

**Reverse chain:** user clicks card/amount/person/statement → packet ID → claim ID → primary source locator and date → authorizing record → version/amendment chain → reviewer and publication gate.

**Cross-domain traversal:** source edges must carry IDs, relation type, evidence, effective date and confidence. Distinguish institutional overlap from direct contract, ownership, appointment, money transfer and modeled causal effects.

**Blocks public release when:** absent controlling public document, legal status unverified, amount units/stages mixed, private-person or client material exposed, unsupported wrongdoing claims, expired source TTL, missing corrections or contradictory source state, failed accessibility/navigation tests, or live artifact differs from approved build.

## Source and snapshot boundary

The Oct 16 2026 workbook reports: 102 issue/subissue rows, 289 registered entities, 184 registered source records, 210 relationship edges, and 435 assertions held for human review. The Oct 16 controls report **0 human-reviewed migrated assertions**. Current review UI exposes 94 selected issue-index records, 113 institutional associations and 73 public source locators; those are NOT a full authoritative live data feed, do not represent 100% verified packets and must not be summed into the master counts.

The Nov 1 pre-election freeze and Nov 6 post-election input are separate controlled candidates. They do not automatically supersede evidence or authorize current role changes. Maintain dates and human editorial gates.

## Release sequence

1. Verify and lock final supplied logo/banner source files; use consistent assets on every page, not screen captures of controls.
2. Perform visual/mobile audit of ten-topic dashboard; verify artwork is illustrative where composite.
3. Complete source-per-claim minimum for featured pages and ensure all icons and CTA links work.
4. Run graph integrity tests, security/CSP tests, legal/privacy/publication checks, regression tests and no-credential scan.
5. Create a versioned static ZIP from exact approved GitHub commit with release manifest/hash, preserving backend-disabled status.
6. Human operator uploads to Cloudflare Pages Direct Upload and records deployment receipt.
7. Read back live address, compare actual deployed content/version with release manifest and run cross-device/keyboard tests.
8. Preserve previous ZIP and rollback instructions, then enable content changes in reversible increments.

Do not merge an unreviewed draft PR as a substitute for launch authorization. GitHub CI green is necessary, not sufficient.