import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const src=readFileSync('public/question-engine.js','utf8');
const context={window:{},Date};
vm.runInNewContext(src,context,{timeout:3000});
const {assemble}=context.window.QP_QUESTION_ENGINE;
const reports=JSON.parse(readFileSync('public/data/q-pueblo-qified-reports-v2-2026-11-09.json','utf8')).reports;
assert.equal(reports.length,14);
for(const r of reports){
 const answer=assemble(r.questions[0],reports,[],[],'2026-11-10');
 assert.equal(answer.reportId,r.id,'Authored report must be reachable');
 assert.equal(answer.citations.length>0,true);
 assert.equal(answer.claims.every(c=>c.sourceIds.every(id=>answer.citations.some(s=>s.id===id))),true);
}
for(const q of ['How much has the City actually paid for Project Falcon this week?','What is the current amount spent on Lime Road?','Tell me the 2027 proposed city budget is adopted.','What happened in the election today?']){
 const p=assemble(q,reports,[],[],'2026-11-10');
 assert.equal(p.state,'RESEARCH_PENDING_NO_CONFIRMED_ANSWER','No speculative answer: '+q);
 assert.equal(p.reportId,null);
}
assert.equal(assemble(reports[0].questions[0],reports,[],[],'2027-01-01').reviewOverdue,true);
assert.equal(assemble(reports[0].questions[0],[reports[0],{...reports[0],id:'DUP'}]).reportId,null);
const index=readFileSync('public/index.html','utf8');
const page=readFileSync('public/qify.html','utf8');
const client=readFileSync('public/qify.js','utf8');
assert(index.includes('id="home-q-form"') && index.includes('src="home-question.js"'));
assert(!index.includes('action="qify.html" method="get"'));
assert(page.includes('src="question-engine.js"'));
assert(client.includes('QP_QUESTION_ENGINE.assemble') && client.includes('triage.answerReport'));
console.log('PASS question triage: 14 authored answers, safe unknowns, overdue reviews, source-claim links, privacy-safe home routing.');
