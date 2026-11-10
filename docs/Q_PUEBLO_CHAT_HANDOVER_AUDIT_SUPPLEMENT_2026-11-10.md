# Q-Pueblo — consolidated release and archive handover

**Audit date:** 2026-11-10  
**Canonical public repository:** `Q10ai/q-pueblo-` (trailing hyphen)  
**Audited GitHub main SHA:** `19d8114e42d52e99f1c586ed9f5797d86e323343`  
**Canonical public hostname:** <https://qpueblo.pages.dev/>; separately observed Worker hostname: <https://raspy-bar-4291.q10agi.workers.dev/>  
**Controlled Drive folder:** `1RJ-630fpZnz2ckTNzGDqSBS2UBKT8nQC`  
**Q10 core:** `Q10ai/q10-core`, a separate controlled/non-operational engineering portfolio; this handover does not authorize activating its agents or publishing private records.

## Executive disposition

**SOURCE-INTEGRATED / STATIC-LAUNCH-CANDIDATE / PRODUCTION-PARITY-BLOCKED / AGENTS-NOT-OPERATIONAL**.

GitHub `main` already contains more recent improvements than the earlier November 9 launch ZIPs. Do **not** overwrite it with an older ZIP. The latest audited Actions production artifact was downloaded from run **42810897549**, at source SHA `19d8114e...`. The validation and launch-integrity workflows both passed on that exact SHA (**42810897549** and **42810897756**). The optional GitHub Pages mirror is not required for Cloudflare and failed independently.

Live readback on 2026-11-10: `https://qpueblo.pages.dev/` HTTP 200; `/reports.html` HTTP 404; `/packets.html` HTTP 404; `/api/v1/capabilities.json` HTTP 404. The separate Worker hostname `/reports.html` also returned 404. **No production parity or backend operation is established.** The Cloudflare owner must deploy the approved `public/` output and test these routes, including mobile and keyboard functionality, before claiming public launch.

## Design and civic mission preserved

- Q-Pueblo is a living, independent, nonpartisan, human-reviewed civic knowledge system: *Know Pueblo. Help Shape Its Future.* The original full Q-Pueblo brand artwork leads the site, using its navy/teal/gold/purple visual identity without distortions or duplicate name beside the logo.
- The public workflow starts with a question, then directs to source-connected issues, entities, money trails, Qified reports, historical packet families, updates, corrections and public participation.
- Core discipline: evidence provenance and dates; distinguish proposed/authorized/appropriated/contracted/paid/results; state uncertainties and counterevidence; no defamation by association, no improper-intent inference; apply child/community lens and human sign-off.
- Community corrections and alternative AI outputs are leads for review, **not** automatic truth or automatic model updates. Users retain consent and human override.

## Public inventories — do not add these together

| Collection | Audited count | Meaning and caveat |
|---|---:|---|
| Indexed issue IDs | 174 | Historical November 8 catalog, not all current Pueblo issues |
| Source-mapped IDs | 82 | Of those 174; other 92 lack an explicit direct mapping |
| Catalog source links | 141 | Dated collection; not a guarantee that all URLs are currently live |
| Source publishers | 54 | Distinct historical publisher labels in issue inventory |
| Topic categories | 10 | Current navigation taxonomy; expansion/reconciliation remains open |
| Pending coverage candidates | 12 | Not new counted issue IDs until deduplication and evidence review |
| Curated Qified public analyses | 14 | Source-attributed explanatory layer; limitations and review dates vary |
| Earlier core report summaries | 5 | Included within the broader Qified development; **not additive** |
| Historical draft packet families | 55 | External historical families; not fully revalidated |
| Historical variants | 109 | July 22 inventory variants, not 109 independent verified findings |
| Archived public case summaries | 8 | Original-link summaries with preserved dates and review limits |

Files to ground the counts: `public/data/q-pueblo-issue-index-2026-11-09.json`, `public/data/q-pueblo-qified-reports-v2-2026-11-09.json`, `public/data/q-pueblo-qified-briefs-2026-11-09.json`, `public/data/q-pueblo-historical-library-2026-11-10.json` and `docs/PACKET_LIBRARY_INTEGRATION_2026-11-10.md`.

## Implemented public functions

- Homepage, Topics, Issues, Explore, Qify, Qified Reports, Packets/Archive, Institutions, Sources, Updates, Participate, Q Tools, Workbench, Methods, Spanish orientation, Support & Services.
- Search within the dated issue catalog; exact scoped Qified reports and printable/downloadable reports where source-backed.
- Local EE, T2Y, monetary-stage and evidence comparison tools; inputs calculated client-side unless separately enabled in future.
- User-directed email inquiry service to **Q10pueblo@gmail.com** for Qified custom work, corrections, merchandise, sponsorship and support; user must press send in their own email app. No Stripe or online payment processing, no card capture; no donations tax-deductible claim. Human quote, terms, sponsor independence and fulfillment remain owner's responsibility.
- Read-only GitHub checks for site integrity and public-source availability; these are **not** autonomous Q research agents or self-updating production knowledge.

## Tests and remaining defects

- GitHub Public Beta Validation: PASS on audited `main` SHA 19d8114e, Actions run `42810897549`.
- GitHub Launch Candidate Integrity: PASS on audited SHA, Actions run `42810897756`.
- Direct analysis of exact zipped production files: 20 JavaScript syntax checks PASS; 6 JSON parse checks PASS; 18 HTML pages; 945 local links/assets located, **0 missing files**.
- 14 old fragment links on `explore.html`, `launch.html`, and `workbench.html` referenced retired homepage anchors (`#home`, `#money`, `#research`, `#sources`, `#trust`). The accompanying GitHub issue/PR changes replace them with actual destination pages and add a regression test; only mark this resolved after the PR check/merge receipt.
- Real browser screenshots and independent WCAG testing **not completed**: the current environment lacks the required Playwright browser executable. Do not claim mobile/browser QA certification.
- No verified Cloudflare deployment of the complete candidate, no dependable automatic web-search Q agent, no live civic-intake API, no cross-institution source ingestion, no external security penetration test, no tested operational disaster recovery.

## Deployment runbook (owner action)

1. Use the **latest** verified GitHub `main` Actions artifact named `q-pueblo-cloudflare-upload` (the inner `q-pueblo-cloudflare-pages.zip`); do not use the November 9 older ZIP. Deploy the ZIP **contents** at the root of the existing Cloudflare site (not as an extra nested directory). Alternatively connect Cloudflare Pages to GitHub `Q10ai/q-pueblo-`, output directory `public`, correct project/environment. Do not assume a Workers static-assets domain is the same as a Pages project.
2. Verify `index.html`, `reports.html`, `packets.html`, `qify.html`, `issues.html`, `support.html`, `updates.html`, `assets/q-pueblo-header-wide.png`, and `data/q-pueblo-qified-reports-v2-2026-11-09.json` return HTTP 200 on the **intended** hostname. Verify case-sensitive paths.
3. Test mobile brand size and navigation, Qify search results, reports and exports, 174 issue records, working email draft, and keyboard access. Send a test mail from a different account to Q10pueblo@gmail.com. Check privacy wording.
4. Record deployment ID, date, URL, approved GitHub commit, screenshots, and rollback artifact. If deployment fails, restore the previous known-good Cloudflare version; do not silently rewrite public conclusions.
5. Update the GitHub/live parity receipt once the site is actually verified. A passing repository CI is not proof of deployed service.

## Backend agent and research next phase (gated)

Proposed (not operational): source-watch/record retrieval, deduplication and provenance, entity/issue knowledge graph, Qified packet assembly, scenario/solutions and consequence comparisons, community correction moderation, and review-gated report publisher. Required gates: source-specific permissions, rate limits, validated parsers, current-source checks, licensing/privacy/security review, human control, external model output challenge protocols, rollback, cost telemetry and monitoring. Public Q10 core should not be activated by implication.

## Memory and archiving boundary

The durable handover records are **GitHub, Google Drive and this chat**. This conversation does not establish that ChatGPT project memory was updated or that cross-repository private Q10 knowledge was automatically merged. Preserve links, commit hashes, data schemas, source dates, open requirements and test results as explicit versioned references; any Q10-core incorporation must go through the separate human-controlled Q10 candidate/publication process. The chat can be archived as a **handover record** once the files and receipts below are verified, but archiving is not a declaration of production completion.

## Filing receipts and locations

- Canonical repository: <https://github.com/Q10ai/q-pueblo->
- Public integration PR #18: <https://github.com/Q10ai/q-pueblo-/pull/18>
- Qified challenge and five-report follow-up PR #20: <https://github.com/Q10ai/q-pueblo-/pull/20>
- Recovered packet integration PR #23: <https://github.com/Q10ai/q-pueblo-/pull/23>
- Agenda role/evidence reconciliation PR #24: <https://github.com/Q10ai/q-pueblo-/pull/24>
- Full earlier source-and-audit ZIP in controlled Drive: <https://drive.google.com/file/d/1hJSvqsOnDYkZ6uiZGutBMYhqa98fLS_2/view>
- Full earlier static candidate in controlled Drive: <https://drive.google.com/file/d/1sAoOL_YQK6NC7ANfYXSujx4PqVlQUtw0/view>
- **Latest audited `main` Cloudflare static ZIP** in controlled Drive: <https://drive.google.com/file/d/1xT-wrrkNY75DXiTCHKjM0rdPHYWSM8RL/view> (2,332,071 bytes; SHA-256 `6b2731ec9302fedaa372aebf9febec0a6b2fd009e4434ec1c8652d6fd762f011`).
- This document and accompanying JSON receipt are also archived to the controlled Drive folder; see the final filing verification message for their exact IDs.

**Release decision:** archive-ready as a recorded engineering handover, **not** certified production/fully operational. Never claim Q agents or continuous live updates are active until independent evidence exists.
