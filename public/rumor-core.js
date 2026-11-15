'use strict';
(function(root){
const lenses=Object.freeze({
truth:['Is it true?','Separate a documented fact from inference, hearsay or prediction.'],
fairness:['Is it fair or right?','Facts do not settle every ethical disagreement. Compare burdens, benefits, rights, access and competing values.'],
law:['Is it legal?','The applicable law, authority and specific facts matter. A related report is not a legal ruling.'],
belief:['Why do people believe it?','Repetition, trust, experience, identity and uncertainty can affect beliefs. These are general possibilities, not diagnoses of individuals.'],
trust:['Who can I trust?','Compare original records, independent corroboration and corrections. Institutional trust cannot be established by a single claim.'],
options:['What can be done?','Compare lawful, feasible and reversible responses; verify responsibility and costs.'],
all:['Full Q review','Separate facts, uncertainty, perspectives, authority and options.']
});
const categories=['History and folklore','Money and taxes','Government and accountability','Law and public safety','Housing and community','Business and development','Health and education','AI and digital safety','Environment and infrastructure','Other'];
const guidance=[
{q:'Does a grant announcement prove that the money has been spent?',answer:'No. An announcement, appropriation, commitment, payment and verified outcome are different stages. A payment ledger or equivalent record is needed to establish actual disbursement.',reports:['half-cent-2026','budget-2026'],limit:'This explains the distinction; it does not establish what any specific project has paid.'},
{q:'Does repeating a rumor make it true?',answer:'No. Repetition alone is not independent corroboration. Look for the original claim, its date, and evidence from independent sources.',reports:[],limit:'General evidence principle, not verification of a specific Pueblo story.'},
{q:'Does disagreement prove someone is dishonest?',answer:'No. People may disagree about facts, goals, priorities, experiences or values. Disagreement alone does not establish dishonesty or motive.',reports:[],limit:'No assessment of any named person or group.'},
{q:'Does an AI answer with citations prove the claim is true?',answer:'No. Citations need to be checked against the actual sources, dates and scope. AI confidence is not evidence.',reports:[],limit:'General AI literacy guidance, not a review of a particular answer.'},
{q:'Does a scenario prove that a disaster will happen?',answer:'No. A scenario describes a conditional possibility. Its assumptions and results must be examined separately from observed events.',reports:[],limit:'Not a forecast or emergency assessment.'},
{q:'Do I have to prove my feelings?',answer:'You can describe how you feel without proving an emotion. A factual explanation of what caused it is a separate question that requires evidence.',reports:[],limit:'General educational guidance; not a psychological evaluation.'},
{q:'Does an organization tagged to an issue control the decision?',answer:'No. An issue association does not establish legal authority, financial responsibility, causation or wrongdoing.',reports:[],limit:'Check the actual role, jurisdiction and controlling documents.'}
];
const valid=(r,matcher)=>matcher.reportValid(r)&&/^[a-z0-9-]+$/.test(r.slug)&&typeof r.sourceChecked==='string'&&typeof r.reviewDue==='string'&&Array.isArray(r.questions)&&Array.isArray(r.unknowns)&&r.qification&&typeof r.qification.assessment==='string'&&r.sources.every(s=>s&&typeof s.title==='string'&&/^https:\/\/[^\s<>"']+$/.test(s.url));
function assess(question,category,lens,reports,core,matcher,today){
 if(typeof question!=='string'||question.trim().length<3||question.length>600||!Object.hasOwn(lenses,lens)||!categories.includes(category))return {state:'INVALID'};
 const q=question.trim(),norm=core.norm(q), day=today||new Date().toISOString().slice(0,10);
 const list=(Array.isArray(reports)?reports:[]).filter(r=>valid(r,matcher));
 const g=guidance.find(x=>core.norm(x.q)===norm);
 const exact=list.filter(r=>r.questions.some(x=>core.norm(x)===norm));
 const select=matcher.selectReport(q,list);
 // Only a unique author-reviewed question may produce a direct dated report answer.
 // Lexical matches are navigation, never a verdict on arbitrary claims.
 const r=exact.length===1&&select?.status==='EXACT_AUTHORED_QUESTION_DATED_REPORT_NOT_LIVE_VERIFICATION'&&select.report.slug===exact[0].slug?exact[0]:null;
 const related=core.matchReports(q,list).map(x=>x.report).filter(x=>x.slug!==r?.slug);
 if(select?.report&&select.report.slug!==r?.slug&&!related.some(x=>x.slug===select.report.slug))related.unshift(select.report);
 if(g)for(const slug of g.reports){const x=list.find(y=>y.slug===slug);if(x&&!related.some(y=>y.slug===slug))related.unshift(x);}
 const result={state:r?'DATED_Q_ANSWER':g?'GENERAL_Q_GUIDANCE':'UNRESOLVED',question:q,category,lens,lensTitle:lenses[lens][0],lensBoundary:lenses[lens][1],report:r,related:related.slice(0,4),guidance:g||null,summary:r?r.summary:g?g.answer:'Q does not have a direct, source-supported answer to this exact claim or question in the current collection. Related findings below may help; they do not prove or disprove it.',freshness:r?(day>r.reviewDue?'REVIEW_DUE':day<r.sourceChecked?'DATE_CONFLICT':'DATED_NOT_LIVE'):null};
 if(r&&result.freshness==='DATE_CONFLICT'){result.state='UNRESOLVED';result.summary='The recorded evidence date is later than the current date. This answer is held for review.';result.report=null;}
 return result;
}
const api=Object.freeze({assess,lenses,categories,guidance});if(root)root.QPRumor=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:null);
