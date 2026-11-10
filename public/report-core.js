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
 function render(r){return '<p class="qp-qa-label">'+esc(status(r))+'</p><p class="report-meta">'+esc(r.id)+' · Edition '+esc(r.version)+' · Source check '+esc(r.sourceChecked)+' · Review due '+esc(r.reviewDue)+'</p><h2>'+esc(r.title)+'</h2><p><strong>'+esc(r.summary)+'</strong></p><div class="fact-grid">'+r.keyFacts.map(f=>'<div class="fact"><span>'+esc(f.label)+'</span><b>'+esc(f.value)+'</b><small>'+esc(f.stage)+' · source '+esc(f.source)+'</small></div>').join('')+'</div>'+
  sections(r).map(([h,v])=>'<section class="report-section"><h3>'+esc(h)+'</h3>'+(Array.isArray(v)?list(v):'<p>'+esc(v)+'</p>')+'</section>').join('')+
  '<section class="report-section"><h3>Claim-to-source ledger</h3>'+list(r.claims.map(c=>c.id+' | '+c.claim+' | '+c.classification+' | Sources: '+c.sourceIds.join(', ')+' | '+c.boundary))+'</section>'+
  '<section class="report-section"><h3>Original sources</h3><ol>'+r.sources.map(s=>{const url=safeUrl(s.url);return '<li><strong>'+esc(s.title)+'</strong> · '+esc(s.kind)+' · '+esc(s.asOf)+'<br>'+esc(s.locator)+'<br>Checked '+esc(s.checked)+' · '+esc(s.role)+(url?'<br><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Read original source ↗</a>':'')+'</li>';}).join('')+'</ol></section><p class="report-meta">Public explanatory subset. Independent audit, full historical packet reconciliation and outcome verification remain open. <a href="participate.html">Submit a correction or contrary source</a>.</p>';}
 function markdown(r){const lines=['# '+r.title,'',r.id+' | '+r.version+' | '+status(r),'Source check: '+r.sourceChecked+' | Review due: '+r.reviewDue,'',r.summary];
  const add=(h,v)=>lines.push('','## '+h,...(Array.isArray(v)?v.map(x=>'- '+x):[v]));
  add('Source-attributed figures',r.keyFacts.map(f=>f.label+': '+f.value+' | '+f.stage+' | Source '+f.source));
  sections(r).forEach(([h,v])=>add(h,v));
  add('Claim ledger',r.claims.map(c=>c.id+' | '+c.claim+' | '+c.classification+' | Sources: '+c.sourceIds.join(', ')+' | '+c.boundary));
  add('Sources',r.sources.map(s=>s.id+' | '+s.title+' | '+s.url+' | '+s.asOf+' | '+s.locator+' | Checked '+s.checked+' | Role '+s.role));
  add('Review boundary','Public explanatory subset; independent audit, full historical packet reconciliation and outcome verification remain open. No live research agent is implied. Corrections: Q10pueblo@gmail.com.');return lines.join('\n')+'\n';}
 function requestDraft(r){return 'DRAFT — review recipient, scope and cost before sending. This draft has not been sent.\n\nSubject: Existing records concerning '+r.title+'\n\nTo the appropriate records custodian,\n\nPlease identify whether your office holds existing records concerning:\n'+r.recordsNeeded.map(x=>'- '+x).join('\n')+'\n\nDate range and project identifiers: [complete before sending].\nPlease provide available electronic copies and identify redactions, withheld records and applicable basis. Please provide a written cost estimate before chargeable work; this request does not authorize charges. If another custodian holds the records, please identify that office if known.\n\n[Name and reply contact]\n';}
 const download=(name,body,type)=>{const url=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 window.QPReport={esc,safeUrl,norm,words,matchReports,status,render,markdown,requestDraft,download};
})();
