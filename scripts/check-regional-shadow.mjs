import assert from 'node:assert/strict';
import {resolveGeographyAt,shadowSnapshot,qifyIssueFromSnapshot,isolateScenario} from '../lib/qp-regional-shadow.mjs';
const geos=[{id:'REGION-A',valid_from:'2025-01-01',valid_to:'2026-01-01',boundary_version:'v1',source_id:'SRC-GEO',geometry_uri:'internal://licensed-region-v1',crs:'EPSG:26913'}, {id:'REGION-A',valid_from:'2026-01-01',boundary_version:'v2',source_id:'SRC-GEO',geometry_uri:'internal://licensed-region-v2',crs:'EPSG:26913'}];
assert.equal(resolveGeographyAt(geos,'REGION-A','2025-06-01').boundary_version,'v1');
assert.equal(resolveGeographyAt(geos,'REGION-A','2026-06-01').boundary_version,'v2');
assert.equal(resolveGeographyAt(geos,'MISSING','2026-06-01').state,'GEOMETRY_UNAVAILABLE_FOR_DATE');
assert.throws(()=>resolveGeographyAt([...geos,{...geos[1],boundary_version:'v3'}],'REGION-A','2026-06-01'),/Overlapping/);
const claims=[
{id:'CLM-1',subject_id:'PROJECT-A',predicate:'announced_cost',value:65000000,valid_at:'2026-10-26',observed_at:'2026-10-27',account_class:'OFFICIAL',state:'REPORTED',source_ids:['S-OFF']},
{id:'CLM-2',subject_id:'PROJECT-A',predicate:'announced_cost',value:61000000,valid_at:'2026-10-26',observed_at:'2026-10-28',account_class:'INDEPENDENT',state:'REPORTED',source_ids:['S-IND']},
{id:'CLM-3',subject_id:'PROJECT-A',predicate:'announced_cost',value:65000000,valid_at:'2026-10-26',observed_at:'2026-11-09',account_class:'OFFICIAL',state:'DOCUMENTED',source_ids:['S-OFF'],supersedes_id:'CLM-1'}
];
const events=[
{id:'EVT-1',actor_id:'CITY',project_id:'PROJECT-A',type:'AUTHORIZATION',event_at:'2026-10-26',observed_at:'2026-10-27',source_ids:['S-OFF'],amount_cents:100000000},
{id:'EVT-2',actor_id:'CITY',project_id:'PROJECT-A',type:'PAYMENT',event_at:'2026-11-01',observed_at:'2026-11-03',source_ids:['S-OFF'],amount_cents:125000}
];
const params={claims,events,sourceIds:['S-OFF','S-IND']};
const early=shadowSnapshot({...params,asOf:'2026-10-27'});
assert.equal(early.claims.length,1);
assert.equal(early.events.length,1);
const mid=shadowSnapshot({...params,asOf:'2026-10-29'});
assert.equal(mid.contradictions.length,1);
const late=shadowSnapshot({...params,asOf:'2026-11-12'});
assert.equal(late.claims.length,3);
assert.equal(late.claims.find(c=>c.id==='CLM-1').revision_note,'SUPERSEDED_BY_LATER_OBSERVED_CLAIM');
assert.equal(late.events.find(x=>x.type==='PAYMENT').amount_cents,125000);
assert.equal(late.contradictions.length,1); // Current official figure remains different from independent figure.
const packet=qifyIssueFromSnapshot({packet_id:'QP-TEST-001',issue_id:'REG-001',title:'Synthetic case',asOf:'2026-11-12',snapshot:late,open_questions:['Independent official invoice?'],review_due_at:'2026-11-11'});
assert.equal(packet.status,'EXPIRED_REVIEW_TTL');
assert.equal(packet.usable_partial_result,true);
assert.equal(packet.release_approved,false);
assert.deepEqual(packet.unresolved_questions,['Independent official invoice?']);
assert.throws(()=>shadowSnapshot({...params,claims:[...claims,{...claims[0]}],asOf:'2026-11-12'}),/duplicate ID/);
assert.throws(()=>shadowSnapshot({...params,claims:[{...claims[0],source_ids:['S-UNKNOWN']}],asOf:'2026-11-12'}),/missing source/);
assert.throws(()=>shadowSnapshot({...params,events:[{...events[0],amount_cents:1.5}],asOf:'2026-11-12'}),/integer/);
assert.throws(()=>qifyIssueFromSnapshot({packet_id:'QP-TEST-1',issue_id:'REG-1',title:'Synthetic',asOf:'2026-11-01',snapshot:late}),/mismatched/);
const scenario=isolateScenario({scenario_id:'SCN-001',model_date:'2026-11-12',assumptions:{rainfall:'synthetic'},outputs:{cost_usd:1000}});
assert.equal(scenario.not_observed,true);
assert.equal(scenario.not_official_forecast,true);
console.log(JSON.stringify({result:'PASS',sample_claims:late.claims.length,competing_claim_groups:late.contradictions.length,revision_visibility:true,as_of_replay:true,geo_versioning:true,simulation_isolation:true},null,2));
