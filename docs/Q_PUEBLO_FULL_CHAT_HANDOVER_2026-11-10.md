# Q-Pueblo complete-chat build, source reconciliation and controlled handover — 2026-11-10

**Record ID:** QP-HO-20261110-001
**Class:** CONTROLLED OPERATIONAL HANDOVER / HUMAN RELEASE DECISION
**Owner:** Q-Pueblo human release owner
**State:** Source release candidate; live expanded site NOT verified; Q10 core is not remotely activated.

## 1. Decisions preserved from this chat

- Product: independent, source-first Pueblo civic knowledge site, not an official government or campaign website.
- Brand: original Pueblo/Q illustration and wide panoramic header, never distort the Q or append duplicate wordmarks; the slogan is “Know Pueblo. Help Shape Its Future.” Images are illustrative rather than literal evidence.
- Public tasks: ask/Qify, calculate, compare options, trace public funds, challenge and contribute evidence, prepare reports, review meeting/news source changes and learn about institutions.
- AI authority: never spend, enforce, issue binding findings, publish sensitive claims, or bypass human review. Source disagreement is captured rather than silently resolved.
- EE_INTEL means minimum-sufficient intelligence cost routing after safety/evidence/authority gates; T2Y means Truth-to-Yield, not latency. Scores remain normalized reference calculations unless independently calibrated.
- Continuous improvement: Discover → Compare → Challenge → Patch → Verify → Human Promote → Learn, with license/security reviews, reproducible tests, recovery and rollback.
- The older concept art is a visual reference, not a verified feature inventory. False live counters, unfounded automation, unsupported affiliations and unreviewed allegations must not be published.

## 2. Repository reconciliation: STOP the stale ZIP

The previous direct-upload file `Q-Pueblo-NEW-SITE-Cloudflare-Upload-2026-11-09.zip` (sha256 `786d81a641bf42919416639a6e85859c83f5e3e785390834309aa87af16f5e2e`) has **31 entries** and is superseded for production. It was created before later public GitHub improvements. Uploading it now would hide newer routes and Qified reports.

The canonical website repository `https://github.com/Q10ai/q-pueblo-` had verified branch `main` at baseline SHA `19d8114e42d52e99f1c586ed9f5797d86e323343` (2026-11-10). Its GitHub Actions public validation and launch integrity were green. The exact Actions artifact associated with that commit, `q-pueblo-cloudflare-upload` ID `13761723959`, contained a nested root-level static ZIP with **68 files** (plus 5 directory entries). GitHub artifact sha256: `a7c87b41713363aa0969fabd97214851f8d48e60afe0c6a973119f470ca1e518`. Inner Cloudflare ZIP sha256: `6b2731ec9302fedaa372aebf9febec0a6b2fd009e4434ec1c8652d6fd762f011`.

The newer source includes 174 dated historical issue IDs, 14 curated public analyses, 141 dated source-directory links in the original catalog, 54 *publishers* (not all government institutions), institution directory, reports, Qify, Q Tools, basic Spanish orientation, public updates, research packets and the approved header art. A historical issue title or catalog count is not a current, fully verified claim.

This handover adds **read-only public release-manifest and release-check** assets and independent static tests to that newer source. Following approval, rebuild static site from the current GitHub `main`; use the resulting build artifact, not either old archive, for Cloudflare publication. The manifest's `baseSourceCommit` is provenance, not the final post-merge deployment SHA.

## 3. Source vs deployment: distinct gates

At independent live readback during this work, `https://qpueblo.pages.dev/index.html` HTTP 200 served an old homepage; `/q-tools.html` and `/reports.html` returned HTTP 404. A Git commit, passing CI or saved ZIP is **not** proof of Cloudflare deployment.

Cloudflare account holder must check whether the existing Pages project uses **Git integration or Direct Upload**. If Git-linked, deploy the validated main branch through the connected provider; do not assume the dashboard accepts ZIP. If direct-upload, upload the inner root-level Cloudflare ZIP to the existing project, not the outer GitHub Actions wrapper and not an obsolete design ZIP. Preserve original hostname, HTTPS, security headers and ability to rollback.

After deployment verify `/release-check.html` on the real hostname and get the full pass result. Then separately check search/Qify behavior, one Q Tools calculation, exported reports, mobile and keyboard navigation, external source trails, correction policies and any exceptions; record Cloudflare deployment ID, full SHA, UTC time, human approver and rollback target.

## 4. Capability register (do not conflate)

| Capability | Implemented in public source | Tested | Deployed live at readback | Operational certification |
|---|---|---|---|---|
| Old homepage | Yes | Prior CI | Yes | Public beta only |
| Approved panoramic header / expanded navigation | Yes in canonical source | Source tests | Not confirmed | HOLD pending host readback |
| Dated issue library, institution records and report directory | Yes | Source tests | New pages not confirmed | Curated, limited scope |
| 14 Qified public reports / Qify matching | Yes | Static/logic checks | New routes not confirmed | Not live general AI |
| EE_INTEL / T2Y / lifecycle browser calculations | Yes | Unit tests | `/q-tools.html` 404 on last check | No measured efficacy or publication authority |
| Community corrections | User-directed email draft/process | Partial | Not confirmed | No authenticated moderation server |
| Automated source watch | GitHub read-only metadata workflow | Source tests | Not a host update service | Human review required |
| Live AI, automatic agenda processing, private intake, alerts, official digital twin | No | Not established | No | Disabled / future review |

## 5. Required open gates and ownership

**P0 — release operator**: publish current reviewed GitHub release to existing Cloudflare project; collect all host/asset/function statuses, dates, SHA, deployment ID and rollback.

**P0 — release operator**: confirm Q Tools and reports actually work in a real browser, including desktop/mobile, keyboard, source provenance and export.

**P1 — editor / civic fact checker**: review live meeting times, updated fiscal years and public-document conflicts; retain original and counterevidence. Do not import user-supplied outside research as verified fact without source-specific review.

**P1 — site maintainer**: validate intended public email account delivery, user-facing notices, Spanish content, privacy, accessibility WCAG and link health.

**P1 — security lead**: independent accessibility/security/abuse review, staged rollout and rollback drill; private intake must remain disabled.

**P2 — integration team**: only after designed/authorized gates, implement evidence freshness, public-record ingestion, user correction queue, log/audit integrity, validated AI and Q10 bridge interfaces.

## 6. Controlled knowledge / memory continuity

This document is the source-of-truth *handover artifact*, **not an automatic model-memory update**. Project chat memory is not writable from this workflow. Preserve the stable record ID, source URLs, hashes, conflicts, authorizations, review dates and versioned supersession rules in GitHub plus Drive. Q10 controlled projects may link this document as an external civic-site reference; nothing here activates Q10 runtime, changes public agency authority, or imports raw chats/sensitive evidence to the public repository.

**Final disposition:** STATIC_SOURCE_READY_TO_PUBLISH_AFTER_REVIEW; LIVE_Q_TOOLS_NOT_VERIFIED; HUMAN_OPERATOR_ACTION_PENDING; FULL_Q10_INTEGRATION_NOT_PROVEN. Chat may be archived as an evidence-bound design/implementation handover, **not** as certification that production is fully complete.
