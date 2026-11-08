# Q-Pueblo integrated review candidate — 2026-11-08

**Status:** CONTROLLED_CANDIDATE / NON-OPERATIONAL / HUMAN_RELEASE_REQUIRED.

**Repository target:** `Q10ai/q-pueblo-` (public website) on a separate feature branch. Nothing here overwrites `public/index.html`, `public/site.js`, `public/site.css`, the production Cloudflare project, or the uncommitted hardened 16 MB release ZIP described in an adjacent Q-Pueblo session.

## Working components

- `public/learn/` — Q-Pueblo's five learning levels, 50 source-linked or fictional questions, scores computed in-page without user profiles, plus a link to Wiki/VISOR/Shadow. Reuses steel-mill Q shape derived from the existing public repository homepage; original vector master still requires parity check.
- `public/explore/` — mobile-first, brand-kit-aligned static demonstration of Wiki concepts, VISOR relations, city shadow, four fictional community exercises, five alternative POVs per exercise, three unranked scenario branches each, and mandatory past/present/future child impact.
- `candidates/unified-api/public-projection.mjs` — pure JavaScript, read-only evidence-screening and bitemporal query reference: wiki search and page, VISOR graph, aggregated shadow features, finance stage trace, scenarios, POV compare, time-line and source provenance. No live database or network access.
- `candidates/unified-api/schema-proposal.sql` — relational *proposal*, not a runnable production migration.
- `candidates/unified-api/packet.schema.json` and `q_packet_gate.py` — scoped Security/Child Core metadata gate reference, never grants final approval.
- `docs/brand-tokens.v1.json` — exact user-supplied palette and typography intent; art/vector identity parity unresolved.
- `docs/INTEGRATION_AND_RELEASE.md` — exact source registry mapping, open release gates, data-plane integration, and privacy boundaries.
- `tests/`, `candidates/unified-api/tests` — local static and core reference tests.

## Test (Node 22, Python 3)

```bash
node --test candidates/unified-api/tests/*.test.mjs
python3 -m unittest discover -s tests -v
python3 candidates/unified-api/q_packet_gate.py candidates/unified-api/example_synthetic_packet.json
```

The last command must fail closed with a nonzero exit for a fictional packet whose child reviews are not complete. `public/learn/` and `public/explore/` can be previewed through any local static server. No third-party requests are required for basic functioning.

## Integration truth boundary

The previously described 16 MB *hardened* candidate (frontend + D1 + QA + approved brand assets) is **not present in this workspace**. Its exact bytes, tests and logo cannot be reconciled here; this package does **not** claim to supersede it. The live site and actual D1 configuration are not changed.

The separate Q10 private draft [PR #1088](https://github.com/Q10ai/q10-core/pull/1088) contains the original Child Core/learning candidate. It is a dependency reference, **not** a public data feed or permission for private-to-public transfer.

Pueblo's 2025–2026 research archive and all 435 historically held assertions stay restricted until claim-by-claim evidence, privacy, freshness and human approvals. Existing controlled catalog counts do not become current published statistics because they appear in an internal inventory.
