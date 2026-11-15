import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const read=p=>fs.readFileSync('public/'+p,'utf8');
const ctx={window:{},URL};for(const p of ['qify-match.js','report-core.js','rumor-core.js'])vm.runInNewContext(read(p),ctx,{timeout:3000});
const {QPReport:core,QP_QIFY_MATCH:matcher,QPRumor:mill}=ctx.window;
const reports=JSON.parse(read('data/qp-current-reports.json')).reports;
const run=(q,l='all',r=reports,t='2026-11-14',c='Other')=>mill.assess(q,c,l,r,core,matcher,t);
let checked=0;
for(const r of reports){for(const q of r.questions){const a=run(q);assert.equal(a.state,'DATED_Q_ANSWER',q);assert.equal(a.report.slug,r.slug);assert.equal(a.summary,r.summary);checked++;}}
for(const q of ['How much cash was paid to Project Falcon?','Pueblo housing is all corrupt','Did they steal the budget?','Is the 2027 adopted city budget $128,202,143?','Has the half-cent money actually been spent?','Is the Arkansas River safe right now?','<img src=x onerror=alert(1)>']){const a=run(q);assert.equal(a.state,'UNRESOLVED',q);assert.equal(a.report,null);}
for(const g of mill.guidance){const a=run(g.q);assert.equal(a.state,'GENERAL_Q_GUIDANCE');assert.equal(a.summary,g.answer);assert.equal(a.report,null);}
const q=reports[0].questions[0];assert.equal(run(q,'all',reports,'2030-01-01').freshness,'REVIEW_DUE');assert.equal(run(q,'all',reports,'2020-01-01').state,'UNRESOLVED');assert.equal(run(q,'all',[]).state,'UNRESOLVED');assert.equal(run(q,'all',[reports[0],{...reports[0],slug:'duplicate'}]).state,'UNRESOLVED');
const bad={...reports[0],sources:[{title:'Unsafe',url:'javascript:alert(1)'}]};assert.equal(run(q,'all',[bad]).state,'UNRESOLVED');
assert.equal(run('x').state,'INVALID');assert.equal(run('x'.repeat(601)).state,'INVALID');assert.equal(run(q,'unknown').state,'INVALID');assert.equal(run(q,'all',reports,'2026-11-14','invalid').state,'INVALID');
for(const l of Object.keys(mill.lenses)){const a=run(q,l);assert.equal(a.lensTitle,mill.lenses[l][0]);assert.equal(a.state,'DATED_Q_ANSWER');}
const html=read('rumor-mill.html'),js=read('rumor-answer.js');for(const id of ['mill-form','mill-category','mill-example','mill-question','mill-lens','mill-submit','mill-clear','mill-status','mill-result'])assert(html.includes('id="'+id+'"'),id);assert(html.indexOf('id="mill-form"')<html.indexOf('Optional: submit a public claim'));assert(html.includes('src="report-core.js"'));assert(html.includes('aria-live="polite"'));assert(html.includes('not sent to an AI provider'));assert(html.includes('not anonymous'));assert(!/localStorage|sessionStorage|sendBeacon|XMLHttpRequest|document\.cookie|innerHTML|location\.hash|location\.search/.test(js));assert.equal((js.match(/\bfetch\s*\(/g)||[]).length,1);assert(js.includes("fetch('data/qp-current-reports.json'"));assert(js.includes("e.preventDefault()"));assert(js.includes('if(seq!==sequence)return'));assert(js.includes('sequence++;form.reset()'));assert(js.includes('textContent'));assert(js.includes('core.safeUrl'));assert(js.includes('Related research — not proof of this claim'));
console.log('PASS Rumor Mill: '+checked+' authored questions, seven general examples, false-match, source/date, input and privacy checks; simulated logic, not browser/production acceptance.');
