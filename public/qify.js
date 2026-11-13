'use strict';
(() => {
 const $=id=>document.getElementById(id),core=window.QPReport,catalog=window.QP_PUBLIC_CATALOG;
 let reports=[],packet=null;
 const briefsReady=fetch('data/q-pueblo-qified-reports-v2-2026-11-09.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(d=>{reports=d.reports;return true;}).catch(()=>false);
 const sourceLink=s=>{const u=core.safeUrl(s.url);return u?'<a href="'+core.esc(u)+'" target="_blank" rel="noopener noreferrer">'+core.esc(s.title)+' ↗</a>':core.esc(s.title);};
 async function render(question){
  $('qify-status').textContent='Loading the dated report collection…';const loaded=await briefsReady;
  const terms=core.words(question), candidates=core.matchReports(question,reports);
  const gatedMatch=window.QP_QIFY_MATCH.selectReport(question,reports);
  const exact=candidates.find(x=>x.exact)?.report||gatedMatch?.report;
  const matches=(catalog?.issues||[]).map(i=>{const tokens=new Set(core.words(i.title+' '+i.category+' '+i.domain));return {i,score:terms.filter(w=>tokens.has(w)).length};}).filter(x=>x.score>=2||core.norm(question)===core.norm(x.i.id)).sort((a,b)=>b.score-a.score).slice(0,8).map(({i})=>({id:i.id,title:i.title,date:i.lastReviewed,sources:(i.sourceIds||[]).map(id=>catalog.sources.find(s=>s.id===id)).filter(Boolean)}));
  const answer=exact?exact.summary:'No prepared, source-supported answer matches this exact question. Related research below may help, but it does not establish the answer to your question.';
  const experience=window.QPKnowledge.compose({question,role:$('qify-role')?.value||'citizen',matchedReport:exact,relatedReports:candidates.filter(x=>!x.exact).map(x=>x.report),issues:matches,searchedAt:new Date().toISOString()});
  const coverage=window.QPAnswerCoverage.create(exact,matches,experience.role);
  const answered=coverage.sections.filter(s=>s.state==='ANSWERED_IN_DATED_REPORT');
  const unknown=coverage.sections.filter(s=>s.state!=='ANSWERED_IN_DATED_REPORT');
  const sectionsPanel='<section aria-label="Comprehensive answers"><h3>Full Qified answers by subject</h3><p>All available answer areas are shown. The order is adapted to your selected audience; source facts remain unchanged.</p>'+
    answered.map(s=>'<section class="report-section"><h4>'+core.esc(s.label)+'</h4><ul>'+s.answers.map(a=>'<li>'+core.esc(a)+'</li>').join('')+'</ul></section>').join('')+
    (unknown.length?'<section class="report-section"><h4>Not established by the available public evidence</h4><p>'+unknown.map(s=>core.esc(s.label)).join('; ')+'. Q cannot provide a factual answer for these areas without further evidence. No current result is implied.</p></section>':'')+
    '</section>';
  const coveragePanel='<section aria-label="Evidence search and freshness"><h3>What Q knows at this search</h3><p><strong>'+core.esc(experience.freshness.label)+'</strong></p><p>Search performed '+core.esc(experience.searchedAt)+' · '+(experience.freshness.checked?'Source analysis checked '+core.esc(experience.freshness.checked)+' · ':'')+(experience.freshness.reviewDue?'Review due '+core.esc(experience.freshness.reviewDue)+' · ':'')+core.esc(experience.sourceCount)+' valid cited sources in the matched brief.</p><p><strong>No live source check was performed.</strong> The search uses Q-Pueblo’s dated public catalog. New information is not fetched or committed by this page.</p></section>';
  const rolePanel='<section aria-label="Audience detail"><h3>'+core.esc(experience.audience.title)+' view</h3><p>'+core.esc(experience.audience.focus)+'. This view changes the order of answers, not the evidence or access rights.</p></section>';
  packet={schema:'qp-question-packet-v2',prepared:new Date().toISOString(),question,evidenceState:exact?'PREPARED_ANSWER_WITH_DATED_SOURCES':'INVESTIGATION_DRAFT_NO_CONFIRMED_ANSWER',answer,matchedReport:exact||null,relatedReports:candidates.filter(x=>!x.exact).map(x=>x.report),issues:matches,experience,coverage,publication:'Local research draft. No external investigation, records request or publication has been performed by this page.'};
  $('qify-output').innerHTML='<h2>Answer and evidence boundary</h2><p><strong>'+core.esc(answer)+'</strong></p>'+coveragePanel+rolePanel+sectionsPanel+(!loaded?'<p>Prepared reports could not load. Existing index matches cannot substitute for them.</p>':'')+(exact?'<details><summary>Complete original published analysis, source links, claims and methods</summary>'+core.render(exact)+'</details>':'')+
   (candidates.some(x=>!x.exact)?'<h3>Related prepared analyses — each has its own scope</h3>'+candidates.filter(x=>!x.exact).map(x=>'<details><summary>'+core.esc(x.report.title)+'</summary>'+core.render(x.report)+'</details>').join(''):'')+
   '<h3>Related dated issue records</h3>'+(matches.length?'<ul>'+matches.map(i=>'<li><a href="issues.html#'+encodeURIComponent(i.id)+'">'+core.esc(i.id+' — '+i.title)+'</a><small> · historical review '+core.esc(i.date)+'</small>'+(i.sources.length?'<ul>'+i.sources.map(s=>'<li>'+sourceLink(s)+'</li>').join('')+'</ul>':'<p>Record-specific source crosswalk remains open.</p>')+'</li>').join('')+'</ul>':'<p>No confident issue match. This is a coverage gap.</p>')+
   '<p><a href="packets.html">Browse the dated public report and historical evidence library</a> · <a href="workbench.html">Optional Q Prompt Engine for new analyses and challenges</a> · <a href="q-tools.html">Run Q Tools comparisons</a></p>';
  $('qify-output').hidden=false;$('qify-actions').hidden=false;
  $('qify-status').textContent=(exact?'Prepared dated answer found. ':'Investigation draft; no confirmed answer. ')+candidates.length+' related/prepared analyses and '+matches.length+' historical issues. External research is not connected.';
  $('qify-email').href='mailto:Q10pueblo@gmail.com?subject='+encodeURIComponent('Q-Pueblo research request: '+question.slice(0,90))+'&body='+encodeURIComponent('Please review this research question:\n'+question+'\n\nI understand scope, any cost and evidence needs must be confirmed before work begins.');
 }
 $('qify-form').addEventListener('submit',e=>{e.preventDefault();const q=$('qify-query').value.trim();if(q.length>=3)render(q);});
 $('qify-role').addEventListener('change',()=>{const current=$('qify-query').value.trim();if(current.length>=3)render(current);});
 const initial=new URLSearchParams(location.hash.slice(1)).get('q')||new URLSearchParams(location.search).get('q');
 if(initial&&initial.length>=3){$('qify-query').value=initial.slice(0,180);render($('qify-query').value);}
 const md=()=>packet?'# Q-Pueblo question\n\n'+packet.question+'\n\n'+packet.evidenceState+'\n\n'+packet.answer+'\n\n## QP Knowledge search boundary\nAudience: '+packet.experience.audience.title+'\nSearch: '+packet.experience.searchedAt+'\nSource check: '+(packet.experience.freshness.checked||'unknown')+'\nReview due: '+(packet.experience.freshness.reviewDue||'unknown')+'\nNo live source check was performed.\n\n'+packet.coverage.sections.map(s=>'## '+s.label+' ['+s.state+']\n'+s.answers.map(a=>'- '+a).join('\n')).join('\n\n')+'\n\n## Related issue records\n'+packet.issues.map(i=>'- '+i.id+' — '+i.title+'\n'+i.sources.map(s=>'  - '+s.title+' '+s.url).join('\n')).join('\n')+'\n\n'+[packet.matchedReport,...packet.relatedReports].filter(Boolean).map(core.markdown).join('\n\n---\n\n')+'\n\n'+packet.publication:'';
 $('qify-download').addEventListener('click',()=>packet&&core.download('Q-Pueblo-Question-Packet.md',md(),'text/markdown;charset=utf-8'));
 $('qify-copy').addEventListener('click',async()=>{if(!packet)return;try{await navigator.clipboard.writeText(md());$('qify-status').textContent='Packet copied.';}catch{$('qify-status').textContent='Copy unavailable; download the packet instead.';}});
})();
