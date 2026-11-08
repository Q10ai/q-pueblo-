// Cloudflare Pages Functions: read-only public feature declaration.
// No database, private submissions, external AI calls or user profiling enabled.
export async function onRequestGet() {
  return new Response(JSON.stringify({
    project: "Q-Pueblo Regional Governance & Transparency",
    release: "public-beta-2026-11",
    public_research: true,
    local_prompt_builder: true,
    local_report_outlines: true,
    source_directory: true,
    rx_perspective_challenge: "static_explanation_only",
    civic_simulation: "non_predictive_guidance_only",
    ai_agents_live: false,
    contributions_enabled: false,
    verified_live_news: false,
    primary_record_sync: false,
    review_gate: "human_required",
    uses_personal_profiles: false,
    policy: "Evidence-backed interpretation only; no political endorsements, automatic claims or autonomous civic authority."
  }), {status:200,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"public, max-age=3600","X-Content-Type-Options":"nosniff","Access-Control-Allow-Origin":"*"}});
}
