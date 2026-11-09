import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const json = JSON.parse(readFileSync('public/data/q-pueblo-issue-index-2026-11-09.json','utf8'));
const html = readFileSync('public/issues.html','utf8');
const csv = readFileSync('public/data/q-pueblo-issue-index-2026-11-09.csv','utf8');
const home = readFileSync('public/index.html','utf8');
const explorer = readFileSync('public/explore.html','utf8');
assert.equal(json.schema,'qp-issue-index-v1');
assert.equal(json.issues.length,json.counts.historicalIssueRecords);
assert.equal(new Set(json.issues.map(x=>x.id)).size,json.issues.length);
assert.equal(json.issues.filter(x=>x.sourceIds.length).length,json.counts.sourceMappedIssueRecords);
assert.equal(json.issues.filter(x=>!x.sourceIds.length).length,json.counts.unmappedIssueRecords);
assert.equal(json.issues.length,174,'Snapshot denominator changed; reconcile provenance and regen page before proceeding');
assert.equal(json.coverageCandidates.length,12);
assert.equal((html.match(/class="issue" id="/g)||[]).length,json.issues.length,'Static issue details incomplete');
assert.equal(csv.split(/\r?\n/).filter(Boolean).length,json.issues.length+1,'CSV row count mismatch');
for(const i of json.issues){
 assert(html.includes(`id="${i.id}"`),'No deep link for '+i.id);
 assert(html.includes(i.title.replace(/&/g,'&amp;').replace(/</g,'&lt;')),'Missing topic '+i.id);
 for(const s of i.availableSourceUrls)assert(s.url.startsWith('https://')||s.url.startsWith('http://'),'Source URL invalid');
}
assert(home.includes('href="issues.html"'),'Missing homepage issue-index link');
assert(explorer.includes('href="issues.html"'),'Missing explorer index link');
assert(html.includes('not a verified current finding'),'No provisional status label');
assert(html.includes('not</strong> added to the 174'),'No candidate exclusion disclaimer');
console.log('Q Pueblo issues index: PASS; source mapped '+json.counts.sourceMappedIssueRecords+'; unmapped '+json.counts.unmappedIssueRecords+'; candidate staging '+json.coverageCandidates.length);
