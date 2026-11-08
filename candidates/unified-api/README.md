# Q-Pueblo Wiki–VISOR–Shadow reference only

- **No Cloudflare Pages Function routes are deployed.** This folder is not under `functions/`.
- **No D1 database migration has been applied.** The SQL file is a logical schema proposal, not an authorized migration against the hardened candidate schema.
- `public-projection.mjs` exports `createProjection(data, {now,allowSynthetic})` and `routeRequest()`. The latter returns `{status,body}` as pure data, and has no network capability.
- In production `allowSynthetic` defaults to **false**. The test-only approval strings and sample records cannot authenticate an actual human reviewer or authorize public release.
- The data argument is an in-memory, human-reviewed snapshot. Real source ingestion, append-only evidentiary storage, external license verification, signed release manifests, auth, logging, backups, and service-level monitoring remain separate guarded tasks.
- All public results exclude S1–S4 classifications, unapproved or expired records, unsupported sources, missing original sha256, missing licensed publication rights, missing past/present/future child review, personal nodes and precise household geometry.
- Money stages are separate and cannot be added together as a fiscal total. Graph edges never establish misconduct. Scenario outputs carry no probability or observed-outcome claim.
- Temporal queries distinguish `valid_from` (world date) and `recorded_at` (knowledge date) with `as_of` and `known_at` parameters.

## Read-only candidate API catalog

| Design route | Projection | Status |
|---|---|---|
| `GET /api/v1/wiki/search?q=` | Human-reviewed wiki search | REFERENCE ONLY |
| `GET /api/v1/wiki/pages/{slug}` | Source-linked explanation | REFERENCE ONLY |
| `GET /api/v1/visor/graph?root=&depth=&as_of=&known_at=` | Depth-bounded approved graph | REFERENCE ONLY |
| `GET /api/v1/shadow/features?layer=&as_of=` | Aggregate-only public features | REFERENCE ONLY |
| `GET /api/v1/money/traces?issue=&stage=` | Stage-specific fiscal records | REFERENCE ONLY |
| `GET /api/v1/scenarios/{id}` | Conditional, explicitly hypothetical | REFERENCE ONLY |
| `GET /api/v1/perspectives/compare?issue=` | Five sourced or fictional lens categories | REFERENCE ONLY |
| `GET /api/v1/history/timeline?subject=` | Bitemporal amendment trail | REFERENCE ONLY |
| `GET /api/v1/sources/{id}` | Allowlisted provenance metadata | REFERENCE ONLY |

### Test

```bash
node --test tests/public-projection.test.mjs
```
