#!/usr/bin/env bash
set -euo pipefail
base="${QP_PUBLIC_URL:-https://qpueblo.pages.dev}"
base="${base%/}"
output="${1:-release-parity-report.txt}"
: > "$output"
printf 'Q Pueblo Live Parity Check\nUTC: %s\nExpected GitHub revision: %s\nTarget: %s\n\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "${GITHUB_SHA:-unknown}" "$base" >> "$output"
result=0
for spec in 'index.html:Get to Know Pueblo' 'public-experience.css:qp-entry-grid' 'home-search.js:home-result-list' 'packets.html:Pueblo research library' 'explore.html:Explore the Pueblo' 'workbench.html:Q Pueblo Workbench' 'q-tools.html:Q Tools | Q-Pueblo' 'q-tools.js:QP_TOOLS_CORE' 'q-tools.css:.qt-head' 'packet-schema.json:qp-research-workbench-v1' 'release-manifest.json:QP-PUBLIC-2026-11-18-AI-EDUCATION-RC1' 'release-check.html:Verify Q-Pueblo Release' 'release-check.js:QP-PUBLIC-2026-11-18-AI-EDUCATION-RC1' 'reports.html:Qified Reports' 'qify.html:Qify' 'issues.html:Issue Index' 'entities.html:Institutions' 'updates.html:Updates' 'api/v1/capabilities.json:server_side_contribution_intake' 'now.html:What' 'connections.html:Three Hops' 'connections.js:Public static graph exploration' 'areas.html:Eight Ways to Understand Pueblo' 'case-library.html:Explore more Pueblo issues' 'discover.html:Discover' 'ai-learn.html:AI' 'ai-world.html:AI &amp; Our World' 'ai-citizen-learning.html:AI Education for Everyone' 'ai-education.html:AI in Education' 'digital-twins.html:Digital Twins' 'ai-readiness.html:Is Pueblo ready for the AI era?' 'edu-review.html:Practice an AI education review' 'ai-readiness-worksheet.txt:AI ERA PREPAREDNESS' 'rumor-mill.html:Rumor Mill' 'rx.html:Q-RX' 'twin.html:Twin Pueblo' 'exit.html:Your Work' 'data/qp-now-2026-11-13.json:2026-11-13' 'data/qp-three-hop-2026-11-13.json:211' 'experience.css:qp-exp-card'; do
  path="${spec%%:*}"
  marker="${spec#*:}"
  filename="$(mktemp)"
  status="$(curl --silent --show-error --location --max-time 25 --output "$filename" --write-out '%{http_code}' "$base/$path" || true)"
  if [[ "$status" == '200' ]] && grep --fixed-strings --quiet "$marker" "$filename"; then
    printf 'PASS %-25s HTTP %s marker=%s\n' "$path" "$status" "$marker" >> "$output"
  else
    printf 'FAIL %-25s HTTP %s marker=%s\n' "$path" "${status:-unavailable}" "$marker" >> "$output"
    result=1
  fi
  rm -f "$filename"
done
if rev="$(curl -fsSL --max-time 25 -H 'Cache-Control: no-cache' "$base/deployment-revision.json?sha=${GITHUB_SHA:-unknown}")" && [[ -n "${GITHUB_SHA:-}" ]] && python -c 'import json,sys; d=json.loads(sys.argv[1]); assert d["commit"]==sys.argv[2] and d["target"]=="qpueblo"' "$rev" "$GITHUB_SHA"; then
  printf 'PASS exact deployment revision %s\n' "$GITHUB_SHA" >> "$output"
else
  printf 'FAIL exact deployment revision not established\n' >> "$output"; result=1
fi
for path in index.html living-research.html qify.js reader-quilt.js report-core.js data/qp-living-research-discovery-2026-11-19.json; do
  tmp="$(mktemp)"
  if curl -fsSL --compressed --max-time 25 -H 'Cache-Control: no-cache' "$base/$path?sha=${GITHUB_SHA:-unknown}" -o "$tmp" && cmp -s "public/$path" "$tmp"; then
    printf 'PASS exact bytes %s\n' "$path" >> "$output"
  else
    printf 'FAIL exact bytes %s\n' "$path" >> "$output"; result=1
  fi
  rm -f "$tmp"
done
printf '\nNote: a PASS verifies listed markers, revision receipt and selected exact file bytes. It does not prove source freshness, a production backend, security audit, or any case finding.\n' >> "$output"
cat "$output"
exit "$result"
