import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=JSON.parse(readFileSync('public/data/q-pueblo-issue-index-2026-11-09.json','utf8'));
const reports=JSON.parse(readFileSync('public/data/q-pueblo-qified-reports-v2-2026-11-09.json','utf8'));
const work=JSON.parse(readFileSync('docs/research/2026-11-12-source-gap-92-issue-review-worklist.json','utf8'));
const expected=source.issues.filter(x=>!(x.sourceIds||[]).length);
assert.equal(work.schema,'qp-source-gap-worklist-v1');
assert.equal(work.auto_source_attach,false);
assert.equal(work.auto_publication,false);
assert.equal(work.counts.unmapped_original,expected.length);
assert.equal(work.counts.unmapped_original,92);
assert.equal(work.counts.explicit_report_lead,11);
assert.equal(work.counts.unmapped_no_explicit_lead,81);
assert.equal(work.items.length,expected.length);
assert.deepEqual(new Set(work.items.map(x=>x.historical_issue_id)),new Set(expected.map(x=>x.id)));
for(const entry of work.items){
 assert.equal(entry.publication_allowed,false);
 assert.ok(Array.isArray(entry.required_steps)&&entry.required_steps.length>=4);
 assert.ok(entry.review_state==='EXPLICIT_EXISTING_REPORT_CROSSWALK_NEEDS_DOCUMENT_REVIEW'||entry.review_state==='PRIMARY_SOURCE_DISCOVERY_REQUIRED');
 for(const candidate of entry.existing_report_leads)assert.ok(reports.reports.some(r=>r.id===candidate.report_id&&(r.issueIds||[]).includes(entry.historical_issue_id)));
}
assert.equal(work.items.filter(x=>x.existing_report_leads.length).length,11);
console.log(JSON.stringify({result:'PASS',unmapped:work.items.length,explicit_report_leads:work.counts.explicit_report_lead,primary_source_discovery:work.counts.unmapped_no_explicit_lead,auto_attach:false},null,2));
