import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {proposeAmendment} from './propose-report-amendment.mjs';
const report=JSON.parse(readFileSync('public/data/q-pueblo-qified-reports-v2-2026-11-09.json','utf8')).reports[0];
const incoming={schema:'qp-amendment-candidate-v1',reportId:report.id,baseVersion:report.version,observedAt:'2026-11-10',
 evidence:[{id:'new-record-2026',title:'New public record candidate',url:'https://example.org/candidate',role:'A0',checked:'2026-11-10',originGroup:'example-records-office'}],
 changes:[{claimId:report.claims[0].id,proposedClaim:'A submitted budget figure that differs from the prior source',proposedStage:'Paid',reason:'Compare new submitted source against prior authorized figure.',evidenceId:'new-record-2026'}]};
const p=proposeAmendment(report,incoming,'2026-11-10');
assert.equal(p.state,'CHALLENGE_PENDING_HUMAN_REVIEW');
assert.equal(p.publicationAllowed,false);
assert.equal(p.contradictions.length,1);
assert.equal(p.accountingFlags.length,1);
assert.equal(p.candidateEvidence[0].verification,'UNVERIFIED_NEW_SOURCE');
assert.equal(p.changes[0].prior.claim,report.claims[0].claim);
assert.equal(p.affectedIssueIds.length,report.issueIds.length);
assert.match(p.baseHash,/^[a-f0-9]{64}$/);
assert.equal(proposeAmendment(report,incoming,'2027-01-01').reviewOverdue,true);
assert.throws(()=>proposeAmendment(report,{...incoming,baseVersion:'0.0.1'}));
assert.throws(()=>proposeAmendment(report,{...incoming,evidence:[{...incoming.evidence[0],url:'javascript:alert(1)'}]}));
assert.throws(()=>proposeAmendment(report,{...incoming,changes:[{...incoming.changes[0],evidenceId:'missing'}]}));
assert.throws(()=>proposeAmendment(report,{...incoming,evidence:[incoming.evidence[0],incoming.evidence[0]]}));
assert.throws(()=>proposeAmendment(report,{...incoming,evidence:[{...incoming.evidence[0],id:report.sources[0].id}]}));
const fresh={...incoming,changes:[{...incoming.changes[0],claimId:'NEW-CLAIM-ID'}]};
assert.equal(proposeAmendment(report,fresh).contradictions.length,0);
console.log('PASS review-only amendment: original snapshot preserved, contradiction/finance flags, source validation, version conflict, stale due status.');
