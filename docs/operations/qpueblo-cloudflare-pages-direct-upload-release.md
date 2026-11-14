# Q-Pueblo Pages release operator setup — NOT ACTIVE

This review-only workflow targets the **existing** Direct Upload Pages project `qpueblo` (do not delete, rename, or recreate it). The November 9 deployment `4b4087b8-85d1-41de-bc58-571a986189b8` contained 18 assets and responded 404 for `q-tools.html` and `reports.html` (verified November 11). The GitHub `main/public` source has those pages. No production change is made by this pull request.

## Cloudflare architecture
Cloudflare docs: Direct Upload projects **cannot be switched to native Git integration**, but they **can** be updated by the Wrangler CLI from GitHub Actions. Retain existing `qpueblo.pages.dev` and its rollback deployments.

## Human setup, in this order
1. Review the public static sources and PRs; resolve security/content approvals. Do **not** assume any draft PR is merged or production-ready.
2. In GitHub repository `Q10ai/q-pueblo-` Settings → Environments, configure **qpueblo-production** with required human reviewers (if plan permits) and, ideally, a protected production branch rule. Configure **qpueblo-preview** for test releases. Do not rely on the environment name alone to provide approval.
3. Create a scoped Cloudflare account API token with **Account → Cloudflare Pages → Edit** permission and the project account ID. Do not send the token in chat, commit it, or put it in public assets.
4. Set GitHub repository or environment Actions secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` securely. Environment scope may require assigning secrets to both preview and production environments.
5. Merge this draft workflow **only after review**. It has **no push triggers**; nothing deploys automatically.
6. In GitHub Actions select **Q-Pueblo controlled Cloudflare Pages release**, Run workflow from `main`, select **preview**, paste the reviewed `main` full SHA and confirmation `QP_PREVIEW`. Verify `https://qp-controlled-review.qpueblo.pages.dev/` with all routes, linked assets, brand and content. This preview alias is expected, but must be confirmed from the returned deployment URL.
7. Independently review privacy, static-asset links, public issue/financial claims, accessibility and rollback target. For the approved exact SHA, run **production** manually with confirmation `QP_PRODUCTION`; the environment approval should be enforced.
8. Read back `https://qpueblo.pages.dev/` and `/explore.html`, `/q-tools.html`, `/reports.html`, `/release-check.html`. Preserve exact commit SHA, new Cloudflare deployment ID, route statuses and rollback target. If parity fails, use the Cloudflare Dashboard rollback option for the previous successful production deployment.

## Non-negotiables
- No Q10 private records in the public `public/` folder.
- No private intake, external AI, background scraping, paid endpoints, Cloudflare Pages Functions or automated publishing authorized by this workflow.
- No project deletion. Do not overwrite `withered-pond-dc03`, `raspy-bar-4291`, or `divine-dream-3f47`; they are separate Workers.
- Do not merge a PR or click production release merely because checks pass. A reviewer must verify editorial/public claims and source dates.
- The workflow intentionally refuses unknown commits, missing required pages, a Worker runtime and Pages Functions.

Cloudflare official sources:
https://developers.cloudflare.com/pages/get-started/direct-upload/
https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
https://developers.cloudflare.com/pages/configuration/rollbacks/
