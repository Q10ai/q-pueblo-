'use strict';
// Answer-first coverage projection; no generated facts or inferred source verification.
(() => {
 const text=v=>typeof v==='string'&&v.trim()?v.trim():null;
 const lines=v=>Array.isArray(v)?v.flatMap(x=>lines(x)):text(v)?[text(v)]:[];
 const qText=v=>v&&typeof v==='object'&&!Array.isArray(v)?Object.entries(v).flatMap(([key,val])=>lines(val).map(t=>key+': '+t)):lines(v);
 function create(report,issues=[],role='citizen'){
  const parts=[];
  const push=(id,label,items)=>{
   const found=lines(items);
   parts.push({id,label,state:found.length?'ANSWERED_IN_DATED_REPORT':'NOT_ESTABLISHED_IN_AVAILABLE_PUBLIC_EVIDENCE',
    answers:found.length?found:['Not established in the published evidence available to this search.'],sourceBounded:!!report});
  };
  if(report){
   push('short','Answer in brief',report.summary);
   push('facts','Verified or source-attributed details, with evidence stage',[
    ...(Array.isArray(report.whatKnown)?report.whatKnown:[]),
    ...(Array.isArray(report.keyFacts)?report.keyFacts.map(f=>[f.label,f.value,f.stage,f.source].filter(Boolean).join(' | ')):[])
   ]);
   push('who','Who is responsible or affected',report.who);
   push('what','What is happening',report.what);
   push('when','When this applies',report.when);
   push('where','Where it applies and jurisdiction',report.where);
   push('why','Why it matters',report.why);
   push('how','How it works or was decided',report.how);
   push('money','Public money, resources and spending stages',(Array.isArray(report.money)?report.money:[]).map(m=>[m.stage,m.detail,m.status].filter(Boolean).join(' | ')));
   push('history','Past, present and future — with conditional forecasts',qText(report.qification?.temporal));
   push('entities','Connections across organizations and systems',report.relations);
   push('effects','Community, children and long-term effects',[...lines(report.child),...qText(report.qification?.childImpact)]);
   push('alternatives','Options and practical tradeoffs',[...(report.options||[]),...(report.qification?.alternatives||[]).map(a=>[a.option,a.tradeoff,a.verification].filter(Boolean).join(' | '))]);
   push('risks','Risks, resilience and stress conditions',[...lines(report.rx),...qText(report.qification?.shock)]);
   push('counter','Other explanations and counterevidence',report.counter);
   push('conclusions','Q assessment and what can be concluded',[...lines(report.qification?.assessment),...lines(report.qification?.reasoning),...lines(report.t2y)]);
   push('next','Practical outcomes and next steps',report.actions);
   push('unknowns','Limits, missing information and updates needed',report.unknowns);
   push('source','Original sources, dates and source checks',(Array.isArray(report.sources)?report.sources:[]).map(s=>[s.title,s.asOf&&'As of '+s.asOf,s.checked&&'Checked '+s.checked,s.url].filter(Boolean).join(' | ')));
  } else {
   const matching=Array.isArray(issues)?issues:[];
   push('short','What the public index currently establishes',matching.length?'The dated public index contains related topic records, but no prepared, source-supported answer matches this exact question. Their titles do not establish a current outcome.':'No matching, source-supported prepared answer or confident indexed issue was found in the public catalog.');
   push('facts','Available indexed records',matching.map(i=>[i.id,i.title,i.date&&'Last historical review: '+i.date].filter(Boolean).join(' — ')));
   push('source','Existing source leads',matching.flatMap(i=>(Array.isArray(i.sources)?i.sources:[]).map(s=>[s.title,s.url].filter(Boolean).join(' | '))));
   for(const [id,label] of [
    ['who','Who has authority or responsibility'],['what','What has happened'],['when','Dates and decision status'],['where','Locations and jurisdiction'],['why','Reason and public impact'],['how','Implementation and oversight'],['money','Funding, contracts and payments'],
    ['history','Historical change and future scenarios'],['entities','Relationships'],['effects','Community effects'],['alternatives','Tradeoffs'],['risks','Risks and resilience'],['counter','Contrary evidence'],['conclusions','Supported conclusion'],['next','Practical outcomes and next steps'],['unknowns','Remaining evidence gaps']])push(id,label,[]);
  }
  // Every audience can read all sections. The chosen role only changes reading order.
  const lead={
   citizen:['short','facts','what','where','when','who','effects','money','next'],
   researcher:['short','facts','source','history','counter','conclusions','unknowns'],
   engineer:['short','facts','where','how','money','risks','entities','source'],
   journalist:['short','facts','history','source','counter','who','unknowns'],
   decision_maker:['short','facts','who','money','alternatives','risks','conclusions','effects']
  };
  const preferred=lead[role]||lead.citizen;
  const priority=new Map(preferred.map((s,i)=>[s,i]));
  const ordered=parts.map((p,index)=>({...p,originalOrder:index})).sort((a,b)=>(priority.get(a.id)??100+a.originalOrder)-(priority.get(b.id)??100+b.originalOrder));
  return {schema:'qp-answer-coverage-v0.1',reportId:report?.id||null,role:lead[role]?role:'citizen',
   answeredCount:parts.filter(p=>p.state==='ANSWERED_IN_DATED_REPORT').length,
   missingCount:parts.filter(p=>p.state!=='ANSWERED_IN_DATED_REPORT').length,sections:ordered};
 }
 const api=Object.freeze({create});
 if(typeof window!=='undefined')window.QPAnswerCoverage=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})();
