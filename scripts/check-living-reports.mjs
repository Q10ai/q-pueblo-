import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const root='public/';
const page=readFileSync(root+'living-reports.html','utf8');
const script=readFileSync(root+'living-reports.js','utf8');
const registry=JSON.parse(readFileSync(root+'data/qp-public-living-report-registry.json','utf8'));
assert.equal(registry.schema,'qp-public-living-report-registry-v1');
assert.deepEqual(registry.reports,[], 'New review candidate cannot appear publicly');
assert(page.includes('Living report availability'));
assert(page.includes('reports.html'));
assert(page.includes('evidence remains visible') || page.includes('EVIDENCE REMAINS VISIBLE'));
assert(!/localStorage|sessionStorage|sendBeacon|XMLHttpRequest|eval\(/.test(script));
assert(!/api[_-]?key|private[_-]?key|sk-proj-/i.test(script+page));
const ctx={window:{},document:{getElementById:()=>null}};
vm.runInNewContext(script,ctx,{timeout:2000});
const {validEntry,isStale}=ctx.window.QP_LIVING_REPORTS;
const good={status:'PUBLIC_APPROVED',slug:'budget-2026',title:'Budget 2026',
 version:'0.2.0',as_of:'2026-11-01',review_due:'2026-11-20',unknowns:['spending not proven'],
 approval_receipt_id:'human-approved-001',public_file:'reports.html?report=budget-2026'};
assert.equal(validEntry(good),true);
assert.equal(validEntry({...good,status:'PRIVATE_DRAFT'}),false);
assert.equal(validEntry({...good,approval_receipt_id:''}),false);
assert.equal(validEntry({...good,public_file:'https://evil.example/'}),false);
assert.equal(validEntry({...good,unknowns:['x',42]}),false);
assert.equal(isStale(good,'2026-11-21'),true);
assert.equal(isStale(good,'2026-11-20'),false);
console.log('PASS: public living-report accessibility, legacy report links, non-disclosure, human approval and TTL warnings');
