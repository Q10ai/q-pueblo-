# Q-Pueblo Q Tools public-beta release contract — 2026-11-09

## Deliverables
- `public/q-tools.html` / `q-tools.css` / `q-tools.js`: static, accessible, responsive, browser-local Q Tools.
- `scripts/check-q-tools.mjs`: deterministic reference-math, negative-gate, privacy and navigation checks.
- Entry links from homepage, original workbench and Start Here. No new backend or API keys.

## Grounded Q10 lineage
Internal source: `Q10ai/q10-core/packages/q10-agent-ledger/docs/EE_T2Y_SPEC.md` and namespace contract `docs/q10/governance/NAMESPACE_AND_TTL_CONTRACT_v1.md`.
- EE_INTEL: normalized cost = compute + energy + latency + error + review + rework + trust + public burden. Only eligible safety, evidence and human-authorized routes may be cost-ranked. Relative EE score = expected yield / (1 + cost).
- T2Y: truth support × realized useful yield × agency × reversibility × (1 − harm). Illustrative thresholds: truth ≥ .80; harm ≤ .20; T2Y ≥ .35. Provenance, human review and correction/rollback remain independent conjunctive controls. These are reference simulated normalized numbers, NOT measured efficacy or authorization.
- Cost comparison: nominal, undiscounted horizon, user-entered USD; no fabricated government accounting, discount assumptions or project-specific cash flows.
- RX challenge: local draft; records no claims or uploads and does not notify a moderator.

## Explicitly not implemented
Continuous ingestion; validated source/fact graph; live AI answer generation; authenticated moderated evidence submissions; cross-source money reconciliation; hosted database; controlled Q10 runtime access; production user-data retention; official case management. Do not use a GitHub link as evidence of deployed availability.

## Privacy and security
No fetch/XHR, persistence, inline scripts, telemetry, secret tokens, or automatic publication. Existing restrictive CSP applies. User input goes into plain text only; export occurs on explicit click. GitHub issue submission is a separate voluntary user action without prefilled sensitive data.

## Acceptance and release
Run `node --check public/q-tools.js` and `node scripts/check-q-tools.mjs`, existing public catalog/workbench/release scripts, keyboard/mobile browser inspection, privacy review and live host readback. Release operator must verify host /q-tools.html, /q-tools.js, /q-tools.css and existing /explore.html /workbench.html return 200 with correct assets. If tests fail, HOLD; roll back to parent release SHA. Cloudflare production deployment remains a separate host-owner action.
