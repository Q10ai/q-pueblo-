# Q-Pueblo V3 Design and Tools — Release Handover
As-of: 2026-11-09.

This is a *candidate* release built in the local working folder for review, not automatically published to Cloudflare. The candidate preserves the user's Q-Pueblo approved wide header and source catalog. It does NOT operationalize private Q10 platforms or autonomous agents.

## Main changes
- Original proportion-preserving 2172 × 724 Q-Pueblo header, uniform navigation including Q Tools, source-index deep links.
- New interactive `tools.html`, `q-tools-core.mjs`, `q-tools.mjs` and `tools.css`: EE, T2Y and Money Stages, with portable user-supplied JSON estimates and explicit unknown energy state.
- Updated `updates.js`, `updates-strip.js`, official RSS/Atom parser, change observer and GitHub workflow so all use a single data contract with review-gated publisher metadata.
- Fixed three mobile overflow defects, and removed the double-clicking menu handler.
- 13 Node tests, 5 Python tests and isolated browser QA of 16 responsive page views passed. This is not a security or Cloudflare publication certificate.

## Host deployment reality
`qpueblo.pages.dev` last verified earlier in this chat with the older static pages live. The candidate branch must be merged after CI and reviewer approval, then deployed to the right Cloudflare Pages production project. A new GitHub commit by itself cannot update that Direct Upload project. Read back exact routes after deployment.

## Configuration and security requirements
- No AI agent, quantum backend or private intake is live.
- Do not enable `QP_CONTRIBUTIONS_ENABLED` without protected D1, Turnstile, privacy review, retention policy, abuse protection and authorized moderator queue.
- Official source-page changes and RSS titles are review-queue signals, not verified factual reporting.
- Source publisher names are not a canonical government entity graph.
- Attribution, legal scope, and license checks remain mandatory for source data and third-party code references.

## How to test locally
```
python3 scripts/check-release.py
node --test scripts/q-tools.test.mjs backend/official-monitor.test.mjs
python3 -m unittest discover -s scripts -p 'test_*.py' -v
```

## Note on dynamic ingestion
The restricted GitHub Actions source watchers run at scheduled intervals only if enabled in the repository and configured with proper PR permissions. Both write candidate metadata for human review, never directly publish an unverified vote, subsidy, finding, or community accusation.
