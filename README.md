# Q-Pueblo — Regional Civic Knowledge Service

Independent, nonpartisan civic evidence, source-linked local research and decision support for the Pueblo region. This public website is separate from controlled Q10 systems.

## Actual capabilities
- Dated historical issue index and source directory; curated, human-reviewed explanatory briefs.
- Qify a question: conservative lexical matching to a dated published brief, direct source links and a locally generated research-lead packet. A match is **not** fresh verification.
- Q Tools: browser-local normalized EE / T2Y, nominal lifecycle comparison, and challenge draft exports.
- Institution directory, update snapshots and user-directed email inquiries.
- Read-only source availability watch; no automatic public edits.

## Not enabled
Live AI research, autonomous crawlers/publication, verified live fiscal ledgers, public contributions backend, full digital twin, or Cloudflare Pages Functions. Public safety and source review remain human-governed.

## Deployment
Cloudflare Pages: repository `Q10ai/q-pueblo-`, production branch `main`, framework None, no build command, output `public`. A GitHub merge does not deploy or verify the host. Gate launch on the exact deployed commit, HTTP readback of all major pages/scripts, mobile and keyboard checks, source checks and a documented rollback. Refer to `docs/LAUNCH-RELEASE-NOTES.md`.

## Developer checks
Run `node scripts/check-launch.mjs`, `node scripts/check-qify.mjs`, `node scripts/check-q-tools.mjs`, `node scripts/check-workbench.mjs` and other checks configured in `.github/workflows/validate.yml`.
