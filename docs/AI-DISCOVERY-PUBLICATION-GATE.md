# AI Search and Publication Safety — review candidate (2026-11-10)

**State: DRAFT / DO NOT MERGE OR DEPLOY without human release approval.**

The standalone Q-Pueblo repository is PUBLIC. Assume committed source and history are visible; never place private Q10 research, credentials, personal records, unpublished dossiers or restricted evidence here. `robots.txt` and `noindex` are voluntary discovery signals, NOT authentication. Remove sensitive content at source and follow incident response if exposed.

## Changes staged

- OpenAI and Anthropic search bots may index PUBLIC material; GPTBot, ClaudeBot, CCBot and Google-Extended are asked not to crawl for training.
- Three high-level public routes form a proposed minimal sitemap: homepage, Qified reports hub, Evidence Desk. Other pages stay reachable; sitemap omission does **not** guarantee deindexing.
- The historical packet archive and local research workbench are proposed for `noindex,follow` due to unverified/draft material. They remain publicly accessible and require separate review.
- Absolute canonical URLs assume **qpueblo.pages.dev**, as referenced in the existing project launch notes. Confirm this is the intended production canonical host before merge. If a custom hostname is established, change all canonical URLs, sitemap URLs, robots declarations, and verification expectations together.

## Manual release gates

1. Confirm owner-approved hostname and Cloudflare zone/project; test effective live robots response and any managed AI-bot overlays; protect access with Cloudflare/Auth where confidentiality is required.
2. Audit PUBLIC repository source/history for unwanted disclosures, drafts, private records, embedded credentials and asset rights (including old commits).
3. Review all three public hub pages, three source-attributed reports, source dates, legal disclaimers and Qified methodology; ensure report content does not imply an autonomous production civic agent.
4. Confirm sitemap URL returns 200 application/xml and correct file content on approved deployment; verify canonical tags and no unintended redirects.
5. Run `node scripts/check-ai-discovery.mjs` with all existing CI checks, review diff, record commit/deployment SHA, mobile and accessibility checks, release receipt and rollback ID.
6. Reconcile broader historical issue index and packet completeness before expanding the indexable URL inventory. Source references are leads until validated; do not expose private attachments.

No cloud changes, new crawlers, paid integrations or autonomously published content are authorized by this PR.
