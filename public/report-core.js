'use strict';
(() => {
 const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const safeUrl = value => { try { const u = new URL(String(value)); return u.protocol === 'https:' ? u.href : null; } catch { return null; } };
 const norm = value => String(value ?? '').toLowerCase().normalize('NFKD').replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();
 const stop=new Set(['the','what','does','pueblo','about','how','who','why','with','from','and','can','for','are','was','this','that','has','have','get']);
 const words = value => [...new Set(norm(value).split(' ').filter(w => w.length > 2 && !stop.has(w)))];
 function matchReports(question, reports) {
  const input=norm(question), terms=words(question), years=input.match(/\b20\d\d\b/g)||[];
  return reports.map(report=>{
   const exact=report.questions.some(q=>norm(q)===input);
   const phrases=report.aliases.map(norm).filter(a=>a.length>3&&(' '+input+' ').includes(' '+a+' '));
   const indexed=new Set(words([report.title,report.topic,...report.aliases].join(' ')));
   const overlap=terms.filter(w=>indexed.has(w));
   const mismatch=years.some(y=>!new RegExp('\\b'+y+'\\b').test(report.title+' '+report.when+' '+report.aliases.join(' ')+' '+report.questions.join(' ')));
   return {report,exact:exact&&!mismatch,score:(exact?100:0)+phrases.length*10+overlap.length,related:!mismatch&&(exact||phrases.length||overlap.length>=2)};
  }).filter(x=>x.related).sort((a,b)=>b.score-a.score).slice(0,5);
 }
 const status=(report,today=new Date().toISOString().slice(0,10))=>today>report.reviewDue?'REVIEW DUE — HISTORICAL SOURCE ANALYSIS':report.stage;
 function sections(r){const q=r.qification;return [
  ['Q assessment',q.assessment],['Reasoning — analytical inferences',q.reasoning],['Source-supported facts',r.whatKnown],
  ['Who, what, when, where, why and how',['who','what','when','where','why','how'].map(k=>k+': '+r[k])],
  ['Money and resource stages',r.money.map(m=>m.stage+': '+m.detail+' ['+m.status+']')],
  ['Direct, second and third order connections',r.relations],['Past, present and conditional future',Object.entries(q.temporal).map(([k,v])=>k+': '+v)],
  ['Contrary evidence and competing explanations',r.counter],['Unknowns',r.unknowns],['Records needed to reopen',r.recordsNeeded],
  ['Options, accountable roles and verification',q.alternatives.map(o=>o.option+' — '+o.tradeoff+' | Responsible role to confirm: '+o.owner+' | Verification: '+o.verification)],
  ['Children, families and future generations',Object.entries(q.childImpact).map(([k,v])=>k+': '+v)],
  ['EE',r.ee],['T2Y',r.t2y],['RX',r.rx],['Conditional stress',q.shock],['Practical next steps',r.actions]
 ];}
 const list=items=>'<ul>'+items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
 function render(r){
  const freshness = new Date().toISOString().slice(0,10)>r.reviewDue?'Source review due; findings are dated.':'Source check date: '+r.sourceChecked;
  const details=(h,v)=>'<details class="qp-report-popout"><summary>'+esc(h)+'</summary><div>'+(Array.isArray(v)?list(v):'<p>'+esc(v)+'</p>')+'</div></details>';
  const labels={'Q assessment':'What these findings mean','Reasoning — analytical inferences':'Reasoning and possible explanations','Source-supported facts':'What the sources show','Who, what, when, where, why and how':'Who is involved, why and how','Money and resource stages':'Follow the money and resources','Direct, second and third order connections':'Connections and effects','Past, present and conditional future':'Past, present and possible future','Contrary evidence and competing explanations':'Other explanations and contrary evidence','Unknowns':'What we still do not know','Records needed to reopen':'Records that could clarify the issue','Options, accountable roles and verification':'What can be done, by whom, and how to verify','Children, families and future generations':'Children, families and future generations','EE':'Resource efficiency (EE)','T2Y':'From evidence to useful results (T2Y)','RX':'Practical remedies and continuity (RX)','Conditional stress':'Risks and scenarios','Practical next steps':'What you can do'};
  return '<header class="qp-paper-heading"><h2>'+esc(r.title)+'</h2><p class="qp-reading-type">'+esc(r.topic)+' · '+esc(r.sourceChecked)+' · '+esc(freshness)+'</p></header><section class="qp-paper-findings"><h3>At a glance</h3><p><strong>'+esc(r.summary)+'</strong></p><div class="fact-grid">'+r.keyFacts.map(f=>'<div class="fact"><span>'+esc(f.label)+'</span><b>'+esc(f.value)+'</b><small>'+esc(f.stage)+'</small></div>').join('')+'</div><h3>What the sources show</h3>'+list(r.whatKnown)+'<h3>What this means</h3><p>'+esc(r.qification.assessment)+'</p><h3>What you can do</h3>'+list(r.actions)+'</section><section class="qp-paper-more"><h3>Explore the details</h3><p>Open any section for the supporting explanation.</p>'+sections(r).filter(([h])=>!['Source-supported facts','Q assessment','Practical next steps'].includes(h)).map(([h,v])=>details(labels[h]||h,v)).join('')+details('Evidence behind each claim',r.claims.map(c=>c.claim+' | '+c.classification+' | Sources: '+c.sourceIds.join(', ')+' | '+c.boundary))+details('About this analysis',[r.stage,r.review,'Edition '+r.version+'; review by '+r.reviewDue])+'</section><section class="report-section" id="original-sources"><h3>Original sources</h3><ol>'+r.sources.map(s=>{const url=safeUrl(s.url);return '<li><strong>'+esc(s.title)+'</strong> · '+esc(s.kind)+' · '+esc(s.asOf)+'<br>'+esc(s.locator)+'<br>Checked '+esc(s.checked)+(url?'<br><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Read original source ↗</a>':'')+'</li>';}).join('')+'</ol></section><p class="report-meta"><a href="participate.html">Question a finding or submit a source.</a></p>';
 }
 function markdown(r){const lines=['# '+r.title,'',r.id+' | '+r.version+' | '+status(r),'Source check: '+r.sourceChecked+' | Review due: '+r.reviewDue,'',r.summary];
  const add=(h,v)=>lines.push('','## '+h,...(Array.isArray(v)?v.map(x=>'- '+x):[v]));
  add('Source-attributed figures',r.keyFacts.map(f=>f.label+': '+f.value+' | '+f.stage+' | Source '+f.source));
  sections(r).forEach(([h,v])=>add(h,v));
  add('Claim ledger',r.claims.map(c=>c.id+' | '+c.claim+' | '+c.classification+' | Sources: '+c.sourceIds.join(', ')+' | '+c.boundary));
  add('Sources',r.sources.map(s=>s.id+' | '+s.title+' | '+s.url+' | '+s.asOf+' | '+s.locator+' | Checked '+s.checked+' | Role '+s.role));
  add('Review boundary','Dated explanatory analysis. Check original records and updated outcomes before relying on it. Corrections: Q10pueblo@gmail.com.');return lines.join('\n')+'\n';}
 function requestDraft(r){return 'DRAFT — review recipient, scope and cost before sending. This draft has not been sent.\n\nSubject: Existing records concerning '+r.title+'\n\nTo the appropriate records custodian,\n\nPlease identify whether your office holds existing records concerning:\n'+r.recordsNeeded.map(x=>'- '+x).join('\n')+'\n\nDate range and project identifiers: [complete before sending].\nPlease provide available electronic copies and identify redactions, withheld records and applicable basis. Please provide a written cost estimate before chargeable work; this request does not authorize charges. If another custodian holds the records, please identify that office if known.\n\n[Name and reply contact]\n';}
 const download=(name,body,type)=>{const url=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 window.QPReport={esc,safeUrl,norm,words,matchReports,status,render,markdown,requestDraft,download};
})();
