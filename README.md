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
Production is the existing Direct Upload Pages project **qpueblo**, at **https://qpueblo.pages.dev**. Keep its address and history. The manual GitHub Actions / Wrangler workflow packages every committed public asset plus the read-only configuration Function, requires an approved main SHA, verifies the existing project and current deployment, and checks live asset hashes. A merge does not publish. See [DEPLOY-CLOUDFLARE.md](DEPLOY-CLOUDFLARE.md) for setup, review and rollback.

## Developer checks
Run `node scripts/check-launch.mjs`, `node scripts/check-qify.mjs`, `node scripts/check-q-tools.mjs`, `node scripts/check-workbench.mjs` and other checks configured in `.github/workflows/validate.yml`.

## Brand and responsive preview

The supplied banner, navy/purple theme, locally bundled Phosphor icons and original illustrative thumbnails support desktop and mobile. Run `npm ci --ignore-scripts`, then `npm run dev -- --host 0.0.0.0 --port 4173 --strictPort`. Production assets remain dependency-free static files.
