# Q-Pueblo release supersession and final chat handover addendum — 2026-11-10

**This record amends, rather than deletes, the historical [346686b handover](2026-11-10-full-chat-closure-audit.md).** Other Q-Pueblo changes landed in main after the earlier frozen ZIP was created. Public bundle metadata must track actual bytes, not a loosely defined “latest.”

## Current frozen, validated site package

- **Source Git commit:** `a273e922237e901d709d750a5549991118cb3e75` — includes merged [PR #25](https://github.com/Q10ai/q-pueblo-/pull/25) workbench parity, [PR #26](https://github.com/Q10ai/q-pueblo-/pull/26) Resident Evidence Desk, and [PR #32](https://github.com/Q10ai/q-pueblo-/pull/32) handover documentation.
- **Current direct-host upload package:** `Q-Pueblo-Current-Validated-Main-a273e92-Cloudflare-Upload-2026-11-10.zip`; 75 public files; SHA-256 `03a015f46f9607f8e3b9be7d0342f3f64711a3eab0936d55748b0d6f361b1d0c`; `unzip -t` PASS.
- CI: [Public Beta Validation](https://github.com/Q10ai/q-pueblo-/actions/runs/42813363539) PASS; [Launch Candidate Integrity](https://github.com/Q10ai/q-pueblo-/actions/runs/42813363657) PASS; optional GitHub Pages mirror still not configured to publish successfully.
- **Deployment archive Drive receipt:** https://drive.google.com/file/d/1YFCulXZoMQzZXRAhYsBCOe8Ue58QR1Sy/view?usp=drivesdk
- **Controlled full-chat handover archive:** https://drive.google.com/file/d/1tPABWXzaGEeDCYj_NtIZ7fIJ8Px-TohG/view?usp=drivesdk — new archive SHA-256 `34e7111bf1d6caf7ba642c89f20aa282fdf7abdc2d7e26b1e266de520d61dc01`, 2,360,408 bytes; contains exact direct-upload site ZIP, per-file hashes, report/claim audit, source coverage gaps, and historical packet register.
- **Readable status handover:** https://drive.google.com/file/d/1wi4iZ4Tc4BwSKcmphLAL_SHuLGwEe6v_/view?usp=drivesdk

## Drive receipt supersession transparency

The two Drive file IDs for the full-chat archive and handover remain the same, but their **raw file contents were replaced and renamed** with the newer `a273e92` archive. The earlier GitHub handover recorded archive hash `42a32de6575ab0a28344817974b30ebae15913fbe4cd6c0e5d6d23868c3d4888` for the prior `346686b` snapshot. **That earlier hash does not apply to the current bytes at the Drive link.** It remains an historical receipt of the former package. This dated addendum records the change rather than silently erasing the older record.

## Current source inventory and functions

| Item | Count / condition |
| --- | --- |
| Dated historical issue IDs | 174 |
| Issue IDs with a mapped source lead | 82 |
| Issue IDs without mapped source lead | 92 |
| Dated source URL catalog entries | 141 |
| Publishers in catalog | 54 |
| Source-attributed current V2 Qified reports | 14 |
| Internal report claim ledger records | 49 |
| Independent audits of all 14 v2 reports | 0 (`independentAudit: false`) |
| Historical packet families | 55 |
| Counted historical packet variants | 109 |
| Selected case capture summaries | 8 |
| Static website files in current ZIP | 75 |
| Local HTML pages checked for relative link gaps | 20; none missing |

The current source includes a Resident Evidence Desk for sourced FY2026 City adopted-budget category comparisons and the County's 26 self-reported August priorities; the 14-report search, deterministic local Q Tools, original claim/source provenance links, reports, historical packets, and a public release-check page. That is **real browser functionality**, but still not live autonomous research or independent adjudication.

## Production remains blocked

Independently checked `https://withered-pond-dc03.q10agi.workers.dev/workbench.html` and `https://qpueblo.pages.dev/workbench.html`: both HTTP 200 but served the older static research assembly layout. Both `/data/q-pueblo-qified-reports-v2-2026-11-09.json` requests returned HTTP **404**. This means the new data and resident-answer release are **not deployed to those public hosts**. Source CI does not prove live parity, and a deployment to an unverified project must not be attempted. Authorized Cloudflare operator intervention and independent post-deploy readback are required. See [issue #11](https://github.com/Q10ai/q-pueblo-/issues/11).

## Open P0 gates

Production host parity; human editorial reviewer and funding/conflict disclosure; independently reconciled decisions/contracts/payments; 92 unmatched issue leads; source recency and corrections history; safe structured contribution intake with consent and privacy; live official-record retrieval with provenance; security/privacy review; continuity/rollback tests. [Issue #21](https://github.com/Q10ai/q-pueblo-/issues/21) tracks the real service implementation. Do not call a case independently verified merely because it is in a report or a historical packet.

**Deployment rule:** Check `main` before publishing. If main has newer approved public code than `a273e92`, generate and validate a newer ZIP; do not overwrite a newer build with this snapshot. Document any new artifact in a superseding dated receipt.
