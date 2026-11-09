# Q-Pueblo Public V3 Release & Controlled Ingestion

Source of truth for static public UX: `public/`. Operational source observer: `backend/`.

## Release boundaries

* 174 dated issue index records, 141 linked source URLs, 54 distinct **source publisher labels** (not 54 municipal agencies), 27 domains, 10 research categories.
* Three dated starter briefings with source-anchored statements. Other 171 records have open dossiers with metadata, optional exact source crosswalks, limitations, conditional options and review route; DO NOT describe these as certified case analyses.
* A strictly browser-side, bounded NPV scenario calculator, not a live digital twin or AI model.
* Updates page uses `public/data/updates.json`: official publisher hubs. A meeting time, vote, agenda or other event must be extracted, attributed and checked before it becomes a public Q-Pueblo report.
* Community observations are drafted locally; no PII is silently transmitted. A public GitHub issue form may be used for PUBLIC SOURCE links only. Private intake requires a separately audited authenticated backend.
* Image assets in `public/assets/` are original approved Q-Pueblo visual identity, rendered at natural aspect ratio without duplicate oversized logo text.

## Operational automation (admin one-time setup)

1. Create a controlled GitHub Actions policy for `Q10ai/q-pueblo-`: enabled workflows, permitted action `peter-evans/create-pull-request@v7`, and permit Actions to create PRs. Human reviews source-watch PRs. **Never automatically merge machine-generated factual claims.**
2. `watch-official-sources.yml` observes four preapproved official source sites twice on business days and opens or updates an editorial review PR only on new baseline or verified page hash changes. RSS or structured machine-readable event parsing remains an optional future module; a page change alone is not an event.
3. To deploy to the existing Cloudflare Direct Upload project on `main` updates (not Git integration, which cannot be attached to an existing Direct Upload project), add GitHub Actions secrets `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, set repository variables `CLOUDFLARE_PAGES_PROJECT=<actual current project>` and `QP_CLOUDFLARE_AUTO_DEPLOY=enabled`. The `production` environment should require human release approval. Never place credentials in source code.
4. `deploy-cloudflare-direct.yml` deploys the `public/` directory through Wrangler; when not configured the job is safely skipped. Do not set `QP_CLOUDFLARE_AUTO_DEPLOY=enabled` until release tests pass and the correct hosting project is confirmed.
5. The only background activity occurs on configured GitHub Actions schedules. A static uploaded ZIP does not become self-updating without a deployment connection.

## Required commands

```
node --test backend/official-monitor.test.mjs
node scripts/check-site-v3.mjs
node scripts/check-public-catalog.mjs
node scripts/check-workbench.mjs
```

## Publishing & rollback

Package `public/` with files at ZIP root, upload through Cloudflare Pages Direct Upload or deploy with Wrangler. Verify `/`, `/explore.html`, `/reports.html`, `/entities.html`, `/updates.html`, `/methods.html`, `/twin.html`, `/observations.html`, `/launch.html` and `data/updates.json`. Retain a deployment record with SHA/time, 200 responses, exact public URL and the previous release for rollback. A successful Git commit or GitHub Actions check is not proof of live host parity.
