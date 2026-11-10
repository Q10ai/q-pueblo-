# Q-Pueblo public launch candidate · 2026-11-09

## Release scope

- Full original approved Q-Pueblo header banner (no extra wordmark, CSS `height:auto`, `object-fit:contain`).
- Simplified, mobile-ready navigation on 10 new pages; older routes gain the same header through `legacy-shell.js` while preserving their original functions.
- Start with a question; local Qification matches the historical issue index and the three source-attributed public reports.
- 174 historical issue records with preserved ID/date and direct Qify links. Not a verified complete current issue count.
- 141 dated catalog source links and separate 54-publisher classification; 12 official institution starting points.
- Three source-attributed Qified public reports: FY2026 adopted city General Fund, April/May 2026 Half-Cent fund report, and 2027 CSAC request and proposed City funding.
- Browser EE, T2Y, lifecycle comparison; a plain-language report panel rather than only raw Markdown.
- Email-only custom Q packet requests, merchandise, sponsorships, voluntary support and public corrections at owner-designated Q10pueblo@gmail.com; no Stripe, payment collection, remote submission API or background transmission.
- Human-reviewed, dated update ledger and Spanish-language orientation page.
- Read-only daily source-availability workflow in GitHub Actions. The workflow only writes review artifacts, never live site updates or conclusions.

## Release gates that are NOT satisfied by a static package

1. Cloudflare Pages/Workers actual production deployment and live readback of routes and assets.
2. Provider account setup and reliable delivery of Q10pueblo@gmail.com must be independently tested.
3. Security penetration testing, high-load testing, WCAG independent audit and reliable rollback drill.
4. Live external search, corpus ingestion, AI agents and Q10 core production permissions; do not claim these live.
5. Comprehensive historical issue/entity registry reconciliation and final fiscal/audit confirmations; current catalog is historically dated.
6. Real community submissions backend requires authentication, storage, moderation, privacy and incident controls; site uses user-directed email only.
7. Future live monitoring and notifications need source-specific parsers, deduplication, operator action, queue and review-gated publications.
8. Commercial quotes, merchandise fulfillment, sponsorship documentation, legal entity/payment terms, and tax status must be established by owner before taking funds.

## Publishing to Cloudflare

Direct Upload: upload contents of the `public/` folder in `Q-Pueblo-Launch-Candidate-2026-11-09.zip` to the existing Cloudflare site. This static package does NOT include deployable Cloudflare Pages Functions; the read-only `/api/v1/capabilities.json` is static only. Do not advertise the project as having a functional server AI backend. Confirm exact expected hostname and every route.

Git-connected: use repository `Q10ai/q-pueblo-`, output directory `public`, deploy only after merging reviewed, passing exact-head changes into `main`; Cloudflare project settings must match its deployment mode. Preserve previous known-good ZIP and deployment ID. Note that the current separate `raspy-bar-4291.q10agi.workers.dev` and `qpueblo.pages.dev` must be checked independently.

## Dated official source receipts

- City of Pueblo Ordinance 11075 FY2026 General Fund appropriation: https://www.pueblo.us/DocumentCenter/View/39357/Ordinance11075-Adopted-Budget
- April 2026 Economic Development Half-Cent recap: https://www.pueblo.us/ArchiveCenter/ViewFile/Item/5528 (as of May 13, 2026)
- City official CSAC applications: https://www.pueblo.us/m/newsflash/home/detail/4996
- City official public statement on 2027 CSAC: https://www.pueblo.us/m/newsflash/Home/Detail/5027
- City Finance source hub: https://www.pueblo.us/92/Finance
- Public entity authority hub: https://www.pacog.net/whoispacog

## Integrity safeguards

No user input automatically changes public findings. Unknown sources are marked as leads. Official statements remain attributed to the speaker; absence of reply or counterevidence is not proof of misconduct. Credentials and private Q10 records remain outside this public project. Backups require public/private separation.
