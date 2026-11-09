# Q-Pueblo public beta: release and deployment handoff — 2026-11-09

**Audience:** site publisher / release operator. **Classification:** public operational instructions. **Status:** Source release candidate pending production readback. No verified public route should be claimed on the basis of a Git commit alone.

## Baseline and limitations

Canonical public repository: https://github.com/Q10ai/q-pueblo- (public, main). Static release root: `public/`. Source dated catalog: 2026-11-08, 174 issue scopes, 141 public source links, 27 research domains. These are historical navigation records and are not findings or fresh totals. `workbench.html` composes static reports; does not call live AI. The editorial protocol applies to all release records. Do not publish private Q10 controlled records, raw chat content, children or citizen profiles, unreviewed financial accusations, source secrets or speculative actor links.

Independent live network readback on 2026-11-09: https://qpueblo.pages.dev/index.html HTTP 200; /explore.html HTTP 404; /workbench.html HTTP 404; /packet-schema.json HTTP 404. The live Cloudflare Pages deployment is older than public source `main`. This is a release blocker, not a content issue. Pages Function /api/v1/config must be verified on the Cloudflare host after deployment.

## Deployment A: intended Cloudflare Pages production

If connected Git integration already exists: open Cloudflare Dashboard → Workers & Pages → project mapped to qpueblo.pages.dev; inspect production branch and latest successful deployment; trigger a new deployment of the validated `main` source using the host's published configuration. If integration is absent: connect GitHub Q10ai/q-pueblo-, production `main`, root repository root, framework None, build command blank, output directory `public`, deploy. The authorized Cloudflare account owner must sign in; there is no Cloudflare credential within this repository. Do not infer a live deployment from Git merge.

If using a static ZIP direct upload, use the generated `q-pueblo-cloudflare-upload` artifact from `.github/workflows/validate.yml`; check that index, explore, workbench, launch, and packet-schema files are at the ZIP root. **Caution:** direct upload of `public/` may not upload top-level Cloudflare Pages Functions from `functions/`; only claim the read-only `/api/v1/config` endpoint after a separate Cloudflare readback. Do not enable private intake.

## Deployment B: optional GitHub Pages static mirror

Workflow `.github/workflows/publish-pages.yml` validates and deploys only `public/`. GitHub Pages must be enabled once by a repository admin at Settings → Pages → Build and deployment → Source: GitHub Actions. The built-in `GITHUB_TOKEN` alone cannot auto-enable Pages using `actions/configure-pages` (requires broader permissions). After enabling Pages, push a release or run workflow manually. Verify the actual URL from the successful workflow and read back index, explore, workbench, launch, and packet-schema. Do not announce a GitHub Pages URL before it responds correctly.

## Exact publication gate

- [ ] GitHub public `main` has intended release commit after PR review/merge and no private exports.
- [ ] Required scripts run and pass, without claiming that this proves full accessibility/security.
- [ ] Host live `/index.html`, `/explore.html`, `/workbench.html`, `/launch.html`, `/packet-schema.json` each return HTTP 200 and expected content.
- [ ] Script / CSS / JSON assets load and navigation, mobile, keyboard, search, and workbench operate.
- [ ] External official links and source-as-of labels checked for consequential pages.
- [ ] Cloudflare `/api/v1/config` returns contributions_enabled:false, ai_agents_live:false, review_gate:human_required if Functions are deployed.
- [ ] Responsive headers, no indexing of private material, no forms that submit sensitive information.
- [ ] Record host URL, HTTP statuses, commit SHA, deployment ID, UTC time, open deficiencies, human approver, rollback procedure.
- [ ] No promotion of open review PRs #1 or #3 without separate source and privacy gates.

## Reconciliation

The public release deliberately does not import all historical chats/Drive packets automatically. Controlled research lives in Q10ai/q10-core and Google Drive, with separate human review. Use source citations and approved-public projections only. Child-impact and SHOCK/LEAP/RX guidance in launch.html is educational and not a tested dynamic prediction engine.

**Source is not the deployed site. Every public claim must be independently read back.**
