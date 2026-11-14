import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const context={window:{},Date,Map,Object,Array,String};
vm.runInNewContext(readFileSync('public/knowledge-query.js','utf8'),context,{timeout:3000});
const K=context.window.QPKnowledge;
const source={title:'Public record',url:'https://example.org/record'};
const report={id:'RP-001',sourceChecked:'2026-11-01',reviewDue:'2026-11-10',sources:[source]};
let item=K.compose({question:'Roads?',role:'engineer',matchedReport:report,relatedReports:[],issues:[{id:'REG-001'}],searchedAt:'2026-11-13T12:00:00Z'});
assert.equal(item.role,'engineer');assert.equal(item.coverage,'DATED_PREPARED_ANSWER');
assert.equal(item.freshness.state,'REVIEW_DUE');
assert.equal(item.liveCheck.attempted,false);assert.equal(item.freshness.recheckedDuringSearch,false);
assert.equal(item.sourceCount,1);assert.equal(item.historicalIssueIds[0],'REG-001');
let unknown=K.compose({question:'Unindexed topic',role:'invalid',searchedAt:'2026-11-13T12:00:00Z'});
assert.equal(unknown.role,'citizen');assert.equal(unknown.coverage,'AVAILABLE_LEADS_NO_PREPARED_ANSWER');assert.equal(unknown.freshness.state,'NO_PREPARED_MATCH');
let diff=K.compareClaims([{id:'A',claim:'Earlier statement'}],[{id:'A',claim:'Updated statement',sources:[source]},{id:'B',claim:'New claim',sources:[{url:'javascript:alert(1)'}]}]);
assert.equal(diff.length,2);assert.equal(diff[0].kind,'CONFLICT_OR_CORRECTION');assert.equal(diff[0].publishable,false);assert.equal(diff[0].sourced,true);
assert.equal(diff[1].sourced,false);assert.equal(diff[1].status,'PENDING_HUMAN_REVIEW');
assert.deepEqual(Array.from(K.compareClaims([{id:'A',claim:'Same'}],[{id:'A',claim:'Same'}])),[]);
const html=readFileSync('public/qify.html','utf8'),client=readFileSync('public/qify.js','utf8');
assert(html.includes('src="knowledge-query.js"')&&html.indexOf('src="knowledge-query.js"')<html.indexOf('src="qify.js"'));
assert(html.includes('id="qify-role"'));
assert(client.includes('QP Knowledge')||client.includes('QP Knowledge'.replace(' ','K')));
assert(client.includes('window.QPKnowledge.compose'));
assert(client.includes('No live source check was performed'));
console.log('PASS universal read-only query, role view, revision gate and no false source freshness.');


const answerScript=readFileSync('public/answer-coverage.js','utf8');
vm.runInNewContext(answerScript,context,{timeout:3000});
const A=context.window.QPAnswerCoverage;
const reports=JSON.parse(readFileSync('public/data/q-pueblo-qified-reports-v2-2026-11-09.json','utf8')).reports;
assert.equal(reports.length,14);
for (const report of reports){
  const resident=A.create(report,[], 'citizen');
  const technical=A.create(report,[], 'engineer');
  const journalism=A.create(report,[], 'journalist');
  const sectionIds=resident.sections.map(s=>s.id);
  for(const field of ['short','facts','who','what','when','where','why','how','money','history','entities','effects','alternatives','risks','counter','conclusions','next','unknowns','source']) assert(sectionIds.includes(field), 'Missing answer field '+report.id+': '+field);
  assert.equal(resident.answeredCount+resident.missingCount,resident.sections.length);
  assert(resident.answeredCount>=14,'Too few answered report facets: '+report.id);
  assert.equal(resident.reportId,report.id);
  assert.equal(technical.reportId,resident.reportId);
  assert.equal(journalism.reportId,resident.reportId);
  for(const section of resident.sections){
    assert(section.answers.length,'Blank answer '+report.id+': '+section.id);
    assert.equal(section.state,'ANSWERED_IN_DATED_REPORT','Missing report field '+report.id+': '+section.id);
    const other=technical.sections.find(x=>x.id===section.id);
    assert.equal(JSON.stringify(other.answers),JSON.stringify(section.answers),'Role changes answer content '+report.id+': '+section.id);
  }
  assert.equal(resident.sections.find(s=>s.id==='money').answers.length,report.money.length,'All finance stages must be shown');
}
const unidentified=A.create(null,[{id:'REG-001',title:'Existing historical issue',date:'2026-10-05',sources:[source]}]);
assert.equal(unidentified.reportId,null);
assert.equal(unidentified.sections.find(s=>s.id==='what').state,'NOT_ESTABLISHED_IN_AVAILABLE_PUBLIC_EVIDENCE');
assert(unidentified.sections.find(s=>s.id==='facts').answers[0].includes('REG-001'));
const changed=A.create(reports[0],[], 'engineer');
assert.equal(changed.sections.length,A.create(reports[0],[], 'citizen').sections.length);
assert.notEqual(changed.sections.map(x=>x.id).join(','),A.create(reports[0],[], 'citizen').sections.map(x=>x.id).join(','));
const qify=readFileSync('public/qify.js','utf8');
assert(qify.includes('window.QPAnswerCoverage.create'));
assert(qify.includes('Full Qified answers by subject'));
assert(!qify.includes('Investigation packet requirements'));
assert(!qify.includes('Useful angles to check'));
assert(!qify.includes('Object.entries(packet.investigation).map'));
console.log('PASS answer-first reports: 14 records, all dimensions, financial stages, missing evidence, equal facts across roles.');


vm.runInNewContext(readFileSync('public/q-native.js','utf8'),context,{timeout:3000});
const Q=context.window.QPNative;
for(const report of reports){
 const insight=Q.derive(report);
 assert.equal(insight.reportId,report.id);
 assert.equal(insight.sourceChecked,report.sourceChecked);
 assert.equal(insight.derivedNow,false,'Never falsely imply a new insight discovery');
 assert.equal(insight.claimsIndividuallyMapped,false,'Report provenance alone is not claim-level provenance');
 assert.equal(insight.insights.length,9,'Every report should answer Q-native extra dimensions including Event Horizons');
 for(const x of insight.insights){
  assert.equal(x.state,'PREVIOUSLY_PREPARED_Q_ANALYSIS', 'Missing Q-native answer on '+report.id+' '+x.id);
  assert(x.answer.length,'No Q-native answer content');
  assert(x.evidenceClass!== 'UNKNOWN','Missing analytical evidence class');
  assert.equal(x.sourceScope,report.id);
 }
 assert(insight.insights.some(x=>x.id==='underlying'&&x.answer.some(v=>v.includes(report.qification.assessment))));
 assert(insight.insights.some(x=>x.id==='falsification'&&x.answer.length));
 assert(insight.insights.some(x=>x.id==='event_horizons'&&x.answer.length&&x.evidenceClass==='PREPARED_CONDITIONAL_EVENT_HORIZONS_ANALYSIS'), 'EH Event Horizons must receive substantive conditional answers');
}
const unknownQ=Q.derive(null);
assert.equal(unknownQ.reportId,null);
assert.equal(unknownQ.insights.length,9);
assert(unknownQ.insights.every(x=>x.state==='NOT_YET_EVIDENCED'&&x.answer.length===0));
const clientQ=readFileSync('public/qify.js','utf8');
assert(clientQ.includes('window.QPNative.derive(exact)'));
assert(clientQ.includes('What Q found beyond the question'));
assert(clientQ.includes('qPanel+sectionsPanel'));
assert(clientQ.includes('packet.qNative.insights'));
assert(readFileSync('public/qify.html','utf8').includes('src="q-native.js"'));
console.log('PASS Q-native: nine extra substantive answer dimensions including Event Horizons, uncertainty and export boundaries.');

const traceCtx={window:{},Date,Set,Object,Array,String,Map};
vm.runInNewContext(readFileSync('public/q-processing-trace.js','utf8'),traceCtx,{timeout:3000});
const trace=traceCtx.window.QPProcessingTrace.trace(reports[0],'2026-11-13T10:00:00Z');
const eh=trace.layers.find(x=>x.id==='EH_CONS'), ehealth=trace.layers.find(x=>x.id==='EH_EVID');
assert(eh.label.includes('Event Horizons'));
assert.equal(eh.state,'PREPARED_EVENT_HORIZONS_NARRATIVE_NO_GATE_EXECUTION');
assert.equal(eh.engineRan,false);
assert(ehealth.label.includes('Evidence Health'));
assert.equal(trace.coreEnginesExecuted,false);
console.log('PASS EH Event Horizons and EH_EVID separated; no Q10 runtime execution asserted.');
