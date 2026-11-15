'use strict';
(()=>{
 const $=id=>document.getElementById(id),core=window.QPReport,matcher=window.QP_QIFY_MATCH,engine=window.QPRumor;
 const form=$('mill-form'),question=$('mill-question'),preset=$('mill-example'),result=$('mill-result'),status=$('mill-status');
 if(!form||!engine||!core||!matcher)return;
 let reports=[],sequence=0;
 const add=(parent,tag,txt)=>{const e=document.createElement(tag);if(txt!==undefined)e.textContent=String(txt);parent.append(e);return e;};
 const link=(parent,label,url)=>{const a=add(parent,'a',label);a.href=url;return a;};
 const bullet=(p,values)=>{const ul=add(p,'ul');for(const v of values||[])add(ul,'li',v);return ul;};
 const section=(p,title,values)=>{if(!values?.length)return;const d=add(p,'details');add(d,'summary',title);bullet(d,values);};
 const option=(parent,q,label)=>{const e=add(parent,'option',label||q);e.value=q;};
 for(const g of engine.guidance)option(preset,g.q);
 const load=fetch('data/qp-current-reports.json',{cache:'no-cache',credentials:'same-origin'}).then(r=>{if(!r.ok)throw Error('library');return r.json();}).then(d=>{if(!Array.isArray(d.reports))throw Error('library');reports=d.reports;const group=add(preset,'optgroup');group.label='Dated questions from the Q research library';for(const r of reports)for(const q of r.questions||[])option(group,q);return true;}).catch(()=>false);
 preset.addEventListener('change',()=>{if(preset.value){question.value=preset.value;question.focus();}});
 question.addEventListener('input',()=>{preset.value='';});
 function render(a,loaded){
 result.replaceChildren();result.hidden=false;
 add(result,'h3',a.state==='DATED_Q_ANSWER'?'What the available evidence shows':a.state==='GENERAL_Q_GUIDANCE'?'What Q can explain':'What is known — and what is not');
 add(result,'p',a.summary);
 if(!loaded)add(result,'p','The dated report library could not load. General guidance is still available; retry to search reports.');
 add(result,'h4',a.lensTitle);add(result,'p',a.lensBoundary);
 const r=a.report;
 if(r){
 add(result,'p','Dated evidence checked '+r.sourceChecked+' · Review by '+r.reviewDue+' · '+(a.freshness==='REVIEW_DUE'?'Review overdue; verify before relying on the result.':'Not a live check.'));
 add(result,'h4','What Q finds');add(result,'p',r.qification.assessment);
 section(result,'Facts and figures',(r.keyFacts||[]).map(f=>f.label+': '+f.value+' ('+f.stage+')'));
 section(result,'What is supported',r.whatKnown);
 if(a.lens==='law'||a.lens==='all')section(result,'Authority and responsibility',[r.who,r.where].filter(Boolean));
 if(a.lens==='fairness'||a.lens==='all')section(result,'People, tradeoffs and future generations',[r.child,...(r.options||[])].filter(Boolean));
 section(result,'Other explanations and unknowns',[r.counter,...r.unknowns].filter(Boolean));
 section(result,'RX — useful options and next steps',[r.rx,...(r.actions||[])].filter(Boolean));
 section(result,'EE and T2Y — cost and value considerations',[r.ee,r.t2y].filter(Boolean));
 const sources=add(result,'details');add(sources,'summary','Original sources');const ul=add(sources,'ul');for(const s of r.sources){const li=add(ul,'li');const u=core.safeUrl(s.url);if(u){const a=link(li,s.title,u);a.rel='noopener noreferrer';a.target='_blank';}else add(li,'span',s.title);add(li,'span',' · '+(s.checked||r.sourceChecked));}
 const p=add(result,'p');link(p,'Read the full Qified 40-section report','reports.html?report='+encodeURIComponent(r.slug)+'#qified-report');
 }else if(a.guidance){add(result,'p',a.guidance.limit);}
 else{add(result,'p','No truth, legal or moral verdict has been assigned. Check the exact date, location, claim and original source.');}
 if(a.related.length){add(result,'h4','Related research — not proof of this claim');for(const r of a.related){const card=add(result,'article');card.className='qp-exp-card';link(card,r.title,'reports.html?report='+encodeURIComponent(r.slug)+'#qified-report');add(card,'p',r.summary);add(card,'small','Source check: '+r.sourceChecked+' · Related only');if(r.questions?.[0]){const b=add(card,'button','Ask this documented question');b.type='button';b.addEventListener('click',()=>{question.value=r.questions[0];preset.value='';run();});}}}
 const next=add(result,'p');link(next,'Explore source records','sources.html');add(next,'span',' · ');link(next,'Explore RX options','rx.html');add(next,'span',' · ');link(next,'Request human review or correction','participate.html');
 add(result,'p','This is a local, evidence-bounded educational answer. No external AI call, fresh investigation, submission or publication has occurred.');
 status.textContent=a.state==='DATED_Q_ANSWER'?'Dated Q answer ready.':a.state==='GENERAL_Q_GUIDANCE'?'General Q guidance ready.':'No direct answer verified in the dated library.';
 result.focus();
 }
 async function run(){const seq=++sequence;const q=question.value.trim(),category=$('mill-category').value,lens=$('mill-lens').value;if(q.length<3||q.length>600){status.textContent='Enter a question from 3 to 600 characters.';return;}result.hidden=true;status.textContent='Checking the Q knowledge library…';const loaded=await load;if(seq!==sequence)return;try{const a=engine.assess(q,category,lens,reports,core,matcher);if(a.state==='INVALID')throw Error('input');render(a,loaded);}catch{result.replaceChildren();status.textContent='The review could not be completed. The original research library is still available.';}}
 form.addEventListener('submit',e=>{e.preventDefault();run();});
 $('mill-clear').addEventListener('click',()=>{sequence++;form.reset();result.replaceChildren();result.hidden=true;status.textContent='Cleared on this page.';question.focus();});
})();
