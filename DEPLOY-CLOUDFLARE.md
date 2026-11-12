# Release to the existing Q-Pueblo Pages project

Project: **qpueblo**. Address: **https://qpueblo.pages.dev**. Keep the existing
project, address and deployment history. Do not delete, recreate, convert it to
Workers, or attempt to attach native Git integration to its Direct Upload setup.

## Confirmed upload gap

The owner supplied the full inventory for production deployment
`4b4087b8-85d1-41de-bc58-571a986189b8`: 18 files. Compared with main commit
`d06699e2d6f12a1d23817a24fae3e183846ba990`, 57 of its 75 public files were absent,
including reports, Q Tools, security headers and both branding images. This is an
inventory comparison, not a current live-host audit. Later changes add more assets.

## Prepare and review

Review and merge only approved public changes into main. Unmerged draft PRs and
private Q10 research are excluded. Run `npm ci --ignore-scripts`, `npm run check`
and `npm test`. Commit reviewed changes, then run `npm run release:prepare` and
`npm run release:compile`. The builder copies every tracked public file and the
single permitted read-only Function into `.pages-release/`, adds exact-source
provenance and hashes, and blocks untracked public files and new backend routes.
Review desktop/mobile layouts, sources, artwork, the complete inventory and scope.

## Owner-controlled credential setup

Configure the GitHub environment `cloudflare-production`, restrict it to main,
and add required human reviewers with prevention of self-review where the plan
supports them. The workflow uses this environment but does not create or verify
reviewer rules. If reviewer enforcement is unavailable, restrict manual workflow
access to the owner and record approval in the release review.

Store `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` in that environment's
secrets. Token permission: **Account / Cloudflare Pages / Edit**, restricted to
the existing account. The permission is account-scoped; code additionally verifies
project name, subdomain, stable ID and current production deployment. Creating a
credential or granting CI access is an owner-controlled security action. Never
paste credentials into chat or put them in public files. An account ID is not the
deployment ID in the screenshots.

## Explicit publication

Run **Q Pueblo — Existing Cloudflare Pages Release** from main. Default mode
`prepare` does not publish. For production supply:

- Mode: `production`.
- `release_sha`: the full 40-character reviewed main commit SHA.
- `previous_deployment_id`: the full current successful qpueblo production ID,
  rechecked in the actual project immediately before release.
- `approval`: `PUBLISH qpueblo`.

The job repeats validation, checks the exact main revision, verifies the existing
project, records the current production ID for rollback, and reads the actual
Cloudflare production branch. Pinned Wrangler runs from the staged root containing
both public/ and functions/. No project create/delete/update commands are used.
Pushes, PRs, source watches and model outputs never publish. The optional GitHub
Pages mirror is manual-only and is not the production authority.

## Readback and human rollback

The job checks Cloudflare's canonical production source SHA, every served static
file's SHA-256, the logo/images, report data, security headers and the read-only
configuration Function. A 200 response containing a fallback homepage does not
pass. Deployment metadata such as _headers and _routes.json is checked through
its response effects, not by requesting it as an ordinary public file.

`/api/v1/config` must declare ai_agents_live=false, contributions_enabled=false,
and review_gate=human_required. _routes.json invokes the Function only for this
configuration route. No live AI service, database, API key, paid AI call, or public
intake is enabled by this release.

A failed post-deploy check can occur after production has changed. The job does
not silently roll back or declare success. Inspect the sanitized receipt, then
if necessary use qpueblo → Deployments → the prior successful production target
→ Rollback to this deployment. The preflight receipt records the prior ID.
No actual production release or rollback drill is implied by adding this code.

## Official references

- https://developers.cloudflare.com/pages/get-started/direct-upload/
- https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- https://developers.cloudflare.com/workers/wrangler/commands/pages/
- https://developers.cloudflare.com/api/resources/pages/subresources/projects/methods/get/
- https://developers.cloudflare.com/pages/configuration/rollbacks/

## Complete manual upload alternative

`npm run release:dashboard` builds a separate `.pages-dashboard/` folder from the
verified staged assets, compiles the single read-only Function into a plain
`_worker.js`, and tests the actual compiled configuration and static fallback.
Zip the *contents* of this folder, including _headers, _routes.json, _worker.js,
assets and data. Do not zip only the old eighteen files or the repository root.

This is a human review candidate. After visual QA and approval, use **the existing
qpueblo project → Create a new deployment** and upload the complete ZIP. Do not
create an application. Confirm the production environment and existing project
name/address before the final Deploy action. Cloudflare supports precompiled
_worker.js in dashboard Direct Upload; a raw functions/ directory in a ZIP does
not get compiled there. Recheck live pages, branding, headers, report data,
deployment-provenance.json and /api/v1/config after upload. A dashboard upload
may lack Git commit metadata even though the embedded provenance records it.
