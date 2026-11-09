# Q Pueblo live deployment parity watch
Status: source-available daily workflow with GitHub-only permissions (no Cloudflare access).
Purpose: Detect stale Cloudflare deployments independently from passing source-code CI.
Scheduled: daily 15:17 UTC (approximately morning in Pueblo); manually runnable with workflow_dispatch.
Checks: /index.html, /explore.html, /workbench.html, /packet-schema.json. HTTP 200 + expected content marker. Records UTC timestamp, source SHA and HTTP statuses. A failed check returns nonzero and uploads a report artifact.
Deployment ownership: GitHub main merge does NOT automatically prove Cloudflare upload; Cloudflare Pages account integration or direct upload of the verified root-level static ZIP remains separately required.
Known baseline 2026-11-09: live homepage 200; /explore.html and /workbench.html 404 by direct independent live browser retrieval.
This watch verifies only public-route parity, not evidence freshness, content accuracy, API availability, legal review, source link reachability or cybersecurity compliance.
