'use strict';
(() => {
 const $=id=>document.getElementById(id),core=window.QPReport,catalog=window.QP_PUBLIC_CATALOG;
 let reports=[],packet=null;
 const briefsReady=fetch('data/q-pueblo-qified-reports-v2-2026-11-09.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(d=>{reports=d.reports;return true;}).catch(()=>false);
 const sourceLink=s=>{const u=core.safeUrl(s.url);return u?'<a href="'+core.esc(u)+'" target="_blank" rel="noopener noreferrer">'+core.esc(s.title)+' ↗</a>':core.esc(s.title);};
 const investigation={
  'Question and scope':'Record the exact question, geography, jurisdiction and valid date. No current answer is established by a related title.',
  'Research already built':'Check the historical packet library and preserve prior IDs, original editions, sources and corrections.',
  'Evidence and counterevidence':'Retrieve the controlling record and a materially contrary account; keep claims, estimates, facts and unknowns separate.',
  'Facts, figures and finance':'Preserve units, denominators, dates and proposed/authorized/contracted/paid/outcome states.',
  'Authority and effects':'Confirm who can act; examine direct, secondary and systemic impacts, including children and families over time.',
  'Alternatives and practical result':'Compare supported options, constraints, costs, reversibility, implementation evidence and the smallest useful next step.',
  'Q review and reopening':'Document applicable EE/T2Y/RX/LEAP/TSLP checks actually performed, gaps, human review, freshness and correction triggers.'
 };
 async function render(question){
  $('qify-status').textContent='Loading the dated report collection…';const loaded=await briefsReady;
  const terms=core.words(question), candidates=core.matchReports(question,reports);
  const gatedMatch=window.QP_QIFY_MATCH.selectReport(question,reports);
  const exact=candidates.find(x=>x.exact)?.report||gatedMatch?.report;
  const matches=(catalog?.issues||[]).map(i=>{const tokens=new Set(core.words(i.title+' '+i.category+' '+i.domain));return {i,score:terms.filter(w=>tokens.has(w)).length};}).filter(x=>x.score>=2||core.norm(question)===core.norm(x.i.id)).sort((a,b)=>b.score-a.score).slice(0,8).map(({i})=>({id:i.id,title:i.title,date:i.lastReviewed,sources:(i.sourceIds||[]).map(id=>catalog.sources.find(s=>s.id===id)).filter(Boolean)}));
  const answer=exact?exact.summary:'No prepared, source-supported answer matches this exact question. Related research below may help, but it does not establish the answer to your question.';
  const experience=window.QPKnowledge.compose({question,role:$('qify-role')?.value||'citizen',matchedReport:exact,relatedReports:candidates.filter(x=>!x.exact).map(x=>x.report),issues:matches,searchedAt:new Date().toISOString()});
  const coveragePanel='<section aria-label="Evidence search and freshness"><h3>What Q knows at this search</h3><p><strong>'+core.esc(experience.freshness.label)+'</strong></p><p>Search performed '+core.esc(experience.searchedAt)+' · '+(experience.freshness.checked?'Source analysis checked '+core.esc(experience.freshness.checked)+' · ':'')+(experience.freshness.reviewDue?'Review due '+core.esc(experience.freshness.reviewDue)+' · ':'')+core.esc(experience.sourceCount)+' valid cited sources in the matched brief.</p><p><strong>No live source check was performed.</strong> The search uses Q-Pueblo’s dated public catalog. New information is not fetched or committed by this page.</p></section>';
  const rolePanel='<section aria-label="Audience detail"><h3>'+core.esc(experience.audience.title)+' view — same evidence, different depth</h3><p>'+core.esc(experience.audience.focus)+'</p><p>Useful angles to check (not additional verified findings):</p><ul>'+experience.audience.needs.map(n=>'<li>'+core.esc(n)+'</li>').join('')+'</ul></section>';
  packet={schema:'qp-question-packet-v2',prepared:new Date().toISOString(),question,evidenceState:exact?'PREPARED_ANSWER_WITH_DATED_SOURCES':'INVESTIGATION_DRAFT_NO_CONFIRMED_ANSWER',answer,matchedReport:exact||null,relatedReports:candidates.filter(x=>!x.exact).map(x=>x.report),issues:matches,investigation,experience,publication:'Local research draft. No external investigation, records request or publication has been performed by this page.'};
  $('qify-output').innerHTML='<h2>Answer and evidence boundary</h2><p><strong>'+core.esc(answer)+'</strong></p>'+coveragePanel+rolePanel+(!loaded?'<p>Prepared reports could not load. Existing index matches cannot substitute for them.</p>':'')+(exact?'<h3>Dated sources in matched brief</h3>'+core.render(exact):'')+
   (candidates.some(x=>!x.exact)?'<h3>Related prepared analyses — each has its own scope</h3>'+candidates.filter(x=>!x.exact).map(x=>'<details><summary>'+core.esc(x.report.title)+'</summary>'+core.render(x.report)+'</details>').join(''):'')+
   '<h3>Related dated issue records</h3>'+(matches.length?'<ul>'+matches.map(i=>'<li><a href="issues.html#'+encodeURIComponent(i.id)+'">'+core.esc(i.id+' — '+i.title)+'</a><small> · historical review '+core.esc(i.date)+'</small>'+(i.sources.length?'<ul>'+i.sources.map(s=>'<li>'+sourceLink(s)+'</li>').join('')+'</ul>':'<p>Record-specific source crosswalk remains open.</p>')+'</li>').join('')+'</ul>':'<p>No confident issue match. This is a coverage gap.</p>')+
   '<h3>Investigation packet requirements</h3>'+Object.entries(investigation).map(([h,v])=>'<section><h4>'+core.esc(h)+'</h4><p>'+core.esc(v)+'</p></section>').join('')+'<p><a href="packets.html">Search the historical packets and Q10ASI Pueblo collection →</a></p>';
  $('qify-output').hidden=false;$('qify-actions').hidden=false;
  $('qify-status').textContent=(exact?'Prepared dated answer found. ':'Investigation draft; no confirmed answer. ')+candidates.length+' related/prepared analyses and '+matches.length+' historical issues. External research is not connected.';
  $('qify-email').href='mailto:Q10pueblo@gmail.com?subject='+encodeURIComponent('Q-Pueblo research request: '+question.slice(0,90))+'&body='+encodeURIComponent('Please review this research question:\n'+question+'\n\nI understand scope, any cost and evidence needs must be confirmed before work begins.');
 }
 $('qify-form').addEventListener('submit',e=>{e.preventDefault();const q=$('qify-query').value.trim();if(q.length>=3)render(q);});
 $('qify-role').addEventListener('change',()=>{const current=$('qify-query').value.trim();if(current.length>=3)render(current);});
 const initial=new URLSearchParams(location.hash.slice(1)).get('q')||new URLSearchParams(location.search).get('q');
 if(initial&&initial.length>=3){$('qify-query').value=initial.slice(0,180);render($('qify-query').value);}
 const md=()=>packet?'# Q-Pueblo question\n\n'+packet.question+'\n\n'+packet.evidenceState+'\n\n'+packet.answer+'\n\n## QP Knowledge search boundary\nAudience: '+packet.experience.audience.title+'\nSearch: '+packet.experience.searchedAt+'\nSource check: '+(packet.experience.freshness.checked||'unknown')+'\nReview due: '+(packet.experience.freshness.reviewDue||'unknown')+'\nNo live source check was performed.\n\n'+Object.entries(packet.investigation).map(([h,v])=>'## '+h+'\n'+v).join('\n\n')+'\n\n## Related issue records\n'+packet.issues.map(i=>'- '+i.id+' — '+i.title+'\n'+i.sources.map(s=>'  - '+s.title+' '+s.url).join('\n')).join('\n')+'\n\n'+[packet.matchedReport,...packet.relatedReports].filter(Boolean).map(core.markdown).join('\n\n---\n\n')+'\n\n'+packet.publication:'';
 $('qify-download').addEventListener('click',()=>packet&&core.download('Q-Pueblo-Question-Packet.md',md(),'text/markdown;charset=utf-8'));
 $('qify-copy').addEventListener('click',async()=>{if(!packet)return;try{await navigator.clipboard.writeText(md());$('qify-status').textContent='Packet copied.';}catch{$('qify-status').textContent='Copy unavailable; download the packet instead.';}});
})();
