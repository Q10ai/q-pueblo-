# Publish Q-Pueblo (Cloudflare Pages Git integration)

Repository: https://github.com/Q10ai/q-pueblo-

1. Sign into https://dash.cloudflare.com/ and open **Workers & Pages**.
2. Select **Create application** > **Pages** > **Connect to Git**.
3. Authorize the **Q10ai** GitHub account and select repository **q-pueblo-**.
4. Production branch: **main**. Framework: **None**.
5. Build command: **leave empty**. Build output directory: **public**. Root directory: repository root.
6. Deploy. Copy the actual Cloudflare *.pages.dev URL once Cloudflare reports success; do not guess a URL.
7. Verify the homepage, issue cards, search, prompt builder, report outline, RX, Pueblo Challenge, and mobile menu. Test keyboard navigation and external links.
8. Check **/api/v1/config**. It must return contributions_enabled=false, ai_agents_live=false and review_gate=human_required. Pages Functions works only when deployed through Pages with the functions/ directory.
9. Do not add database credentials or API keys to Git. Cloudflare authentication and any future secrets belong in protected platform settings.
10. Require editorial approval and security/privacy testing before accepting private submissions or enabling any live agents.

## Reality check

This is a working **static-first public beta**, not a completed live Q10 evidence-graph portal. Research issue pages contain dated source-discovery links and verification questions, not certified findings. Users can draft prompts and report outlines, but no AI model is running behind the site. Claimed figures from old visual mockups are intentionally not displayed as live data.

**No Cloudflare deployment occurs merely by pushing GitHub files.** The repository owner must authorize the GitHub integration and confirm production deployment.

## Low-cost operating model

The website runs without external AI calls. When free tiers or AI quotas are exhausted, static pages, source links, client-side search, research prompts, report outlines and quiz remain accessible. Optional paid/online services must be added only after EE spend caps and human release review.
