# Q Pueblo — master subject reconciliation
Date: 2026-11-21
Status: review candidate, not published or deployed by this document
Source branch: q-pueblo/subject-reconciliation-2026-11-21
Repository: Q10ai/q-pueblo-

## Problem and design boundary

Historical discussions enumerated 28 principal sections, including overlapping subjects and cross-cutting methods. An unchecked 28-button homepage would bury the highest-value local stories and repeat research. The public structure therefore distinguishes an eight-entry navigation architecture, a single 25-family subject directory, four inventory types, and transversal Q methods. No existing issue identity or study has been merged, deleted, or restated as new evidence.

## Public route hierarchy

1. What's Happening Now — dated editorial discoveries, with current-status and effective-date caveats.
2. Major Stories & Investigations — editorially selected substantive findings, not duplicates.
3. Explore Pueblo by Subject + Ask Q — `areas.html#subject-families`, plus the eight existing illustrated systems and local question/search.
4. Entities, Issues & Connections — `governance-entities.html`, `priorities.html`, `connections.html`.
5. Research, Studies & Evidence — `living-research.html`, `reports-static.html`, `site-inventory.html`.
6. Follow the Money — `follow-money.html` and source-bound civic finance studies.
7. Learn, History & Play — `learn-pueblo.html`, `learning-library.html`, `discover.html`.
8. Q, Abilities, KOS, AI, Practical Help & Documentation — `about.html`, `q-tools.html`, `method.html`, `ai-world.html`, `resource-library.html`.

These are conceptual visitor pathways, not a claim that eight navigational URLs or all intended capabilities have been fully implemented. Keep the homepage concise.

## Authoritative editorial taxonomy

`public/data/qp-subject-families-2026-11-21.json` is the 25-family editorial navigation registry; `public/areas.html` renders the same 25 IDs and source routes with expandable bullet topics. `scripts/check-subject-families.mjs` validates referential integrity, family coverage, route presence, and the core special requests.

Five user-facing groupings:
- Civic: local government, state/federal, law, law enforcement.
- Livelihoods: finance, economy, agriculture, housing, regional places.
- People: families/social issues, healthcare, education, culture/churches, recreation/tourism.
- Place: environment, water/energy, infrastructure, SHOCK and BACKUP.
- Knowledge: media, AI era, AI governance, conflict solutions, LL history/learning/games, practical help, Q/KOS/inventories.

## Inventories (one identity; multiple navigation views)

Entity: family (level 1), organization (level 2), verified roles/departments/people/projects (level 3). Preserve roles and effective dates.
Issue: family (level 1), subject (level 2), source-supported report and crosswalk (level 3). Existing identity crosswalk is not silently re-keyed.
Study: original publication, revisions, methods, uncertainty, source bibliography, connected entities and issues; 18 canonical and 53 living routes in dated 2026-11-20 inventory are not 71 unique independent studies.
Ability: name, what works locally, what is simulated, designed, blocked, human authority, and test evidence. No live autonomous Q or operational full digital twin claimed.
Financial: sources, authority, award vs approval vs contract vs invoice vs disbursement, liabilities, lifecycle, measured outcomes and plans. Missing amounts are null/unknown, not zero.

## Cross-cutting methods

LL: historical and primary-source provenance; TTL: latest relevant verified date first with archived lineage; Quilt: cross-domain links; Child Zero: human and child safety gate; T2Y: verified useful yield; EE: lowest-cost safe qualifying method; SHOCK: cascading dependencies; BACKUP: independent alternatives, contingencies and manual fallback; RX: lawful and safe remedies; LEAP: future alternatives, measurable outcomes; Twin: hypothetical scenarios with evidence boundaries. No capability is a current runtime claim merely because its concept appears.

## Explicit outstanding depth backlog

P0:
- Confirm legal entities, officeholders, contacts, source as-of dates and levels 1–3.
- Expand source-backed studies for agriculture and food, regional places/demographics, local government, whole regional economy/workforce, housing and land use.
- Establish per-family issue IDs and shared report links; do not create duplicate canonical reports.
- Build entity-linked financial profiles, verified figures and accounting stages.
P1:
- Deep healthcare and social services, including grandfamilies/kinship, substance-use recovery and youth opportunities.
- Churches and living faith cultures with public institutional details, not private membership information.
- Environment, tourism/sports/recreation, communication/media and practical resource contacts.
- Five-level, at-least-three-challenges-per-level educational games for each *completed* game; suitable ages, learning rubrics and licensed sources.
- Complete methods glossary, handbooks, appendix index, status register and user documentation.
P2:
- Review every TTL date, original source, privacy disclosure and conflicting evidence.
- User-test navigation, keyboard, screen reader, reduced motion and mobile layout.
- Independent safety/security/accessibility and publication review; deployment readback against exact approved commit, rollback drill.

## Evidence and release safeguards

- This change is editorial navigation and does not establish new verified real-world facts.
- New topic links point to existing dated source materials; they are not equivalent to comprehensive studies of every family.
- Q does not fetch private records by itself; original records are provided/published by their owning entities or authorized users.
- Automatic source watch, if running, supplies read-only leads; no live conclusions or autonomous publication.
- Preserve the site's release manifest, existing research identities, original artwork and eight illustrated topic pathways.
- `node scripts/check-subject-families.mjs` and the existing site test suite are required before a release is approved.
- A GitHub pull request, merge or CI green check is not evidence of Cloudflare deployment or production parity.
