import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
// The same editorial/integrity checks run in PRs and immediately before release.
const checks = readdirSync('scripts').filter(p => /^check-.*\.mjs$/.test(p) && p !== 'check-all.mjs').sort();
for (const path of checks) {
  const run = spawnSync(process.execPath, ['scripts/' + path], { stdio: 'inherit' });
  if (run.status !== 0) process.exit(run.status ?? 1);
}
console.log(`PASS ${checks.length} public release checks`);
