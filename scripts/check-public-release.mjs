import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const read = (file) => readFileSync(file, 'utf8');
const home = read('public/index.html');
const guide = read('public/launch.html');
const lib = read('public/explore.html');
const bench = read('public/workbench.html');
const headers = read('public/_headers');
for (const name of ['index.html','explore.html','workbench.html','launch.html','release.css','site.css','site.js','explore.js','workbench.js','q-tools.html','q-tools.css','q-tools.js','packet-schema.json','data/q-pueblo-public-catalog-2026-11-08.js']) {
  assert(existsSync('public/' + name), 'missing public asset: ' + name);
}
for (const name of ['launch.html','explore.html','workbench.html','q-tools.html']) assert(home.includes('href="' + name + '"'), 'homepage missing link ' + name);
assert(guide.includes('not a live AI assistant'), 'missing truthful capability disclosure');
assert(guide.includes('Children and the future'), 'missing child impact guidance');
assert(guide.includes('SHOCK'), 'missing preparedness guidance');
assert(guide.includes('An issue title is not proof'), 'missing investigation caution');
assert(guide.includes('not a live AI assistant'), 'missing unsupported AI warning');
assert(guide.includes('href="explore.html"') && guide.includes('href="workbench.html"'), 'missing release paths');
assert(lib.includes('174'), 'expected historical index baseline absent');
assert(bench.includes('static') || bench.includes('no-login') || bench.includes('browser'), 'static-only disclosure missing');
assert(headers.includes('Content-Security-Policy:'), 'CSP missing');
assert(!guide.includes('PRIVATE Q10') && !guide.includes('q10agi@gmail.com'), 'unexpected private context in public guide');
console.log('PUBLIC_BETA_RELEASE_CHECK=PASS; STATIC_ONLY=TRUE; PUBLICATION_STATUS=SOURCE_ONLY_UNTIL_LIVE_READBACK');
