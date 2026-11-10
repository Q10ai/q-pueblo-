# Q-Pueblo full-chat closure / source-release handover — 2026-11-10

**Controlled scope:** This file is an engineering and provenance receipt. It is not a statement that the latest source was deployed to the public Worker, independently audited as civic fact, or that Q10 has been activated. This GitHub repository contains the public website; controlled Q10/Twin Pueblo materials remain separately governed.

## Frozen build and receipts
- Source build: `346686b699f4f63e6f34bad50afa3d78f9b3cc35`, [PR #25](https://github.com/Q10ai/q-pueblo-/pull/25), passed [Public Beta Validation](https://github.com/Q10ai/q-pueblo-/actions/runs/42812330171) and [Launch Candidate Integrity](https://github.com/Q10ai/q-pueblo-/actions/runs/42812330074).
- Direct Cloudflare site upload ZIP: `Q-Pueblo-Latest-Verified-346686b-Cloudflare-Upload-2026-11-10.zip`, SHA-256 `3f1fcae83702d683e105cd7ee124a75f61adb62115d3088adaa49ed4cf4c88ea`, 68 public files, ZIP integrity passed. [Drive-controlled deploy artifact](https://drive.google.com/file/d/19fXaY7h3X7JzBQgjwFypb6mutk9o5Nun/view?usp=drivesdk).
- Complete archive: [controlled audit ZIP](https://drive.google.com/file/d/1tPABWXzaGEeDCYj_NtIZ7fIJ8Px-TohG/view?usp=drivesdk); [human-readable handover](https://drive.google.com/file/d/1wi4iZ4Tc4BwSKcmphLAL_SHuLGwEe6v_/view?usp=drivesdk). Archive ZIP SHA-256 `42a32de6575ab0a28344817974b30ebae15913fbe4cd6c0e5d6d23868c3d4888`. Contains per-file SHA256, source-ledger report/claim audit, historical packet index, issue source gaps and embedded direct deploy ZIP.
- Hash receipts document bytes and provenance, **not a digital signature or independent source verification**. Subsequent GitHub commits may supersede this site build; always compare `main` and any open PR before deploying.

## Source inventory, all independently counted
| Component | Source-status count | Boundary |
| --- | ---: | --- |
| Historical issue IDs | 174 | Dated research titles; not 174 verified investigations |
| Issue IDs with mapped source leads | 82 | Mapping does not establish a claim |
| Issue IDs with no mapped source leads | 92 | Clear research backlog |
| Source link entries | 141 | Dated snapshot; not all live-verified |
| Source publishers | 54 | Not a current government-entity register |
| V2 dated source-attributed Qified reports | 14 | Every `independentAudit` flag is false |
| Claim ledger records inside those reports | 49 | Internally cross-linked to report source IDs; government facts not all independently reproduced |
| Historical packet families | 55 | 109 historical variants; do not equate with completed public audits |
| Selected case capture summaries | 8 | Curated sample, not exhaustive reconciliation |
| Original preserved v1 brief objects | 5 | Older snapshot; not additive to 14 current reports |

Automated ZIP internal-link audit: 18 HTML files, no missing relative targets. Source tests passed; CI is not a penetration test, uptime check or proof of live service.

## Functional history / work completed and reconciled
1. [PR #19](https://github.com/Q10ai/q-pueblo-/pull/19): Qify evidence matching and asynchronous source loading.
2. [PR #20](https://github.com/Q10ai/q-pueblo-/pull/20): evidence-first output with dated public records and source boundaries.
3. [PR #22](https://github.com/Q10ai/q-pueblo-/pull/22): preserve unresolved 2024-vs-2026 fiscal-year wording in the mill-levy ordinance rather than silently normalizing.
4. [PR #23](https://github.com/Q10ai/q-pueblo-/pull/23): historical packet archive and expanded report ledger, visible in main.
5. [PR #24](https://github.com/Q10ai/q-pueblo-/pull/24): Pueblo Boulevard source stages and entity roles reconciliation, visible in main.
6. [PR #25](https://github.com/Q10ai/q-pueblo-/pull/25): reconnect resident workbench to all 14 v2 reports; fix homepage packet styling and report counts, display claim IDs and source check/review due dates. Confirm that the existing browser-only search already safely uses `#q=` URL fragments, not GET query strings; no false claim it was broken. Exact authored questions can retrieve their respective dated reports; unverified payment questions remain unsupported.

Other concurrent work may be underway (e.g. [PR #26](https://github.com/Q10ai/q-pueblo-/pull/26)), so only SHA-bound delivery is reproducible.

## Host parity — NOT DEPLOYED, independently checked 2026-11-10
- [Existing Worker](https://withered-pond-dc03.q10agi.workers.dev/workbench.html): HTTP 200, but the older static research-assembly workbench.
- [Pages hostname](https://qpueblo.pages.dev/workbench.html): HTTP 200, also the older static research-assembly workbench.
- Both sites returned **HTTP 404** for `/data/q-pueblo-qified-reports-v2-2026-11-09.json`. Neither host has the tested 14-report release.
- Authorized Cloudflare project/operator credentials not connected in this chat; no publishing was performed by ChatGPT. Production blocking issue: [#11](https://github.com/Q10ai/q-pueblo-/issues/11).
- Needed: confirm target is correct existing Cloudflare Worker/Pages project; check whether deployment uses Git integration or direct upload; inspect destination configuration, production/preview branches, routes and custom domains; deploy **the latest approved revision**, preserve rollback; verify HTTP 200 of V2 source JSON and confirm exact report counts/claim IDs on both hostnames; log post-deploy snapshot and SHA evidence. Do not use an older ZIP if newer work is approved.

## Unmet capability requirements (P0–P2)
- **P0 evidence:** sources and citations at claim granularity, public meeting/activity refresh, hard proof of actual contract/payment/delivery stages for top civic cases (Half-Cent, Lime Road, Project Falcon, City budget, Pueblo Water and County actions), source-to-claim discrepancies surfaced.
- **P0 human governance:** editorial reviewer accountability, sign-off lineage, redaction, correction and supersession ledger, publication thresholds and funding/conflict disclosures.
- **P0 production:** Cloudflare parity and real post-deploy readback, documented backups/recovery, permissions/secret management, basic production logging and lifecycle cost.
- **P1 participation:** safe structured correction requests with consent, moderation, validation, rate limiting, retention/removal, receipt tracking and email fallback; **not** a public form that silently uploads private data.
- **P1 research platform:** read-only ingest and compare with source freshness, bounded queries, provenance and human review. Do not present unvalidated model reasoning as independent verified facts.
- **P2 Twin Pueblo / Q10:** optional, controlled and nonoperational until explicitly activated, gated by human override, energy budgets, security and independent validation.
- Overall P0 acceptance register: [#21](https://github.com/Q10ai/q-pueblo-/issues/21).

## Safe archival / handoff protocol
Keep this receipt with the audit ZIP, release SHA and live-host parity observations. Do not assume a chat was downloaded or a Cloudflare service deployed by a GitHub merge. Distinguish original public records, institutional assertions, AI-assisted inferences, counterevidence and unresolved questions. No secrets or private original Drive content is embedded in the public bundle. Archive this chat only with the deployment blocker and P0 backlog explicitly open.
