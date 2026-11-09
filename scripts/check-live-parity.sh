#!/usr/bin/env bash
set -euo pipefail
base="${QP_PUBLIC_URL:-https://qpueblo.pages.dev}"
base="${base%/}"
output="${1:-release-parity-report.txt}"
: > "$output"
printf 'Q Pueblo Live Parity Check\nUTC: %s\nExpected GitHub revision: %s\nTarget: %s\n\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "${GITHUB_SHA:-unknown}" "$base" >> "$output"
result=0
for spec in 'index.html:Q-PUEBLO' 'explore.html:Explore the Pueblo' 'workbench.html:Q Pueblo Workbench' 'q-tools.html:Q Tools | Q-Pueblo' 'q-tools.js:QP_TOOLS_CORE' 'q-tools.css:.qt-head' 'packet-schema.json:qp-research-workbench-v1'; do
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
printf '\nNote: a PASS means only these public pages/assets respond with expected markers. It does not prove source freshness, a production backend, security audit, or any case finding.\n' >> "$output"
cat "$output"
exit "$result"
