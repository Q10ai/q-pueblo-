'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const safeUrl=s=>{try{const u=new URL(String(s));return u.protocol==='https:'?u.href:null}catch{return null}};
 const list=arr=>'<ul>'+arr.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
 const section=(name,content)=>'<section class="report-section"><h3>'+name+'</h3>'+content+'</section>';
 let current=null;
 const source=s=>{const url=safeUrl(s.url);return '<li><b>'+esc(s.title)+'</b> · '+esc(s.kind)+' · '+esc(s.asOf)+(url?'<br><a target="_blank" rel="noopener noreferrer" href="'+esc(url)+'">Open original document ↗</a>':'')+'</li>'};
 function render(r){current=r;document.querySelectorAll('[data-report]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.report===r.slug)));
  const div=$('qified-report');
  div.innerHTML='<p class="qp-qa-label">'+esc(r.stage)+'</p><p class="report-meta">'+esc(r.id)+' · Prepared '+esc(r.date)+' · '+esc(r.review)+'</p><h2>'+esc(r.title)+'</h2><p class="report-status"><strong>Q finding and boundary:</strong> '+esc(r.summary)+'</p><div class="fact-grid">'+r.keyFacts.map(f=>'<div class="fact"><span>'+esc(f.label)+'</span><b>'+esc(f.value)+'</b><small>'+esc(f.stage)+'</small></div>').join('')+'</div>'+
  section('A. What original sources support',list(r.whatKnown))+
  section('B. Five Ws + How — scoped authority', '<dl>'+[['Who',r.who],['What',r.what],['When',r.when],['Where',r.where],['Why',r.why],['How',r.how]].map(([k,v])=>'<dt><strong>'+k+'</strong></dt><dd>'+esc(v)+'</dd>').join('')+'</dl>')+
  section('C. Follow the Money — do not add unlike stages','<table><thead><tr><th>Accounting stage</th><th>What the record says</th><th>Evidence boundary</th></tr></thead><tbody>'+r.money.map(m=>'<tr><td>'+esc(m.stage)+'</td><td>'+esc(m.detail)+'</td><td>'+esc(m.status)+'</td></tr>').join('')+'</tbody></table>')+
  section('D. Who is connected? Direct → second → third order',list(r.relations))+
  section('E. Competing explanations & RX', '<p>'+esc(r.counter)+'</p><p><strong>Reconciliation / backups:</strong> '+esc(r.rx)+'</p>')+
  section('F. Unknowns and evidence gaps',list(r.unknowns))+
  section('G. Solutions, alternatives and reversible next steps',list(r.options))+
  section('H. Child and community impacts','<p>'+esc(r.child)+'</p>')+
  section('I. Q10 evaluation lenses','<p><strong>EE / energy-effective approach:</strong> '+esc(r.ee)+'</p><p><strong>T2Y / truth to yield:</strong> '+esc(r.t2y)+'</p>')+
  section('J. What a resident, journalist or official can do next',list(r.actions))+
  section('K. Primary-source ledger','<ol>'+r.sources.map(source).join('')+'</ol><p class="report-meta">Each source establishes only its own contents. Original PDF text, financial totals, official interpretations, and later amendments need independent audit as material. Site branding artwork is illustrative.</p>');
  $('report-message').textContent='Showing '+r.id+' · '+r.stage+'. Read dates and source boundaries before sharing.';
  for(const id of ['report-download','report-json','report-print'])$(id).disabled=false;
  const url=new URL(location.href);url.searchParams.set('report',r.slug);history.replaceState(null,'',url.toString());
  if(location.search)div.scrollIntoView({block:'start',behavior:'smooth'});
 }
 const md=r=>{const block=(h,text)=>'\n\n## '+h+'\n'+(Array.isArray(text)?text.map(x=>'- '+x).join('\n'):text);return '# '+r.title+'\n\n'+r.id+' | '+r.stage+' | Prepared '+r.date+'\n\n'+r.summary+block('Q verified data and classification',r.keyFacts.map(x=>x.label+': '+x.value+' ('+x.stage+')'))+block('Source-backed facts',r.whatKnown)+block('Who / What / When / Where / Why / How',[r.who,r.what,r.when,r.where,r.why,r.how])+block('Funding stages',r.money.map(m=>m.stage+': '+m.detail+' ['+m.status+']'))+block('Direct to third order',r.relations)+block('Counterevidence',r.counter)+block('Unknowns',r.unknowns)+block('Options',r.options)+block('Child and community lens',r.child)+block('EE',r.ee)+block('T2Y',r.t2y)+block('RX',r.rx)+block('Actions',r.actions)+block('Sources',r.sources.map(s=>s.title+' — '+s.url+' — '+s.asOf))+'\n\nHuman-reviewed source-attributed brief, not a legal finding or a complete independent audit.\n'};
 const download=(name,body,type)=>{const blob=new Blob([body],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 fetch('data/q-pueblo-qified-briefs-2026-11-09.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(data=>{const reports=data.reports;if(!Array.isArray(reports)||!reports.length)throw Error('empty reports');$('report-links').innerHTML=reports.map(r=>'<button type="button" data-report="'+esc(r.slug)+'" aria-pressed="false"><small>'+esc(r.id)+'</small><strong>'+esc(r.title)+'</strong><small>'+esc(r.topic)+'</small></button>').join('');$('report-links').addEventListener('click',e=>{const b=e.target.closest('[data-report]');if(b)render(reports.find(r=>r.slug===b.dataset.report))});const initial=new URLSearchParams(location.search).get('report');render(reports.find(r=>r.slug===initial)||reports[0]);$('report-download').addEventListener('click',()=>current&&download('q-pueblo-'+current.slug+'.md',md(current),'text/markdown;charset=utf-8'));$('report-json').addEventListener('click',()=>current&&download('q-pueblo-'+current.slug+'.json',JSON.stringify({schema:data.schema,report:current},null,2),'application/json;charset=utf-8'));$('report-print').addEventListener('click',()=>current&&window.print())}).catch(e=>{$('report-message').textContent='Could not load source-checked reports. Return to the homepage or email Q10pueblo@gmail.com. '+e.message});
})();
