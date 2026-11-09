'use strict';
(()=>{
 const data=window.QP_PUBLIC_CATALOG, briefs=window.QP_REVIEWED_BRIEFS||[];
 const q=s=>document.querySelector(s);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const menu=q('#qp-menu'),nav=q('#qp-nav');
 if(menu&&nav){menu.addEventListener('click',()=>{const on=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(on));nav.classList.toggle('open',on);});nav.addEventListener('click',e=>{if(e.target.closest('a')){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}})}
 if(data){
  const publishers=new Set(data.sources.map(x=>x.publisher)).size;
  const counts={'#qp-count-issues':data.issues.length,'#qp-count-sources':data.sources.length,'#qp-count-publishers':publishers,'#qp-count-domains':data.domains.length};
  for(const [key,val] of Object.entries(counts))if(q(key))q(key).textContent=String(val);
 }
 const cards=q('#qp-reports');
 if(cards){cards.innerHTML=briefs.map(b=>`<article class="qp-report-card"><span class="qp-report-tag">SOURCE-REVIEWED BRIEF</span><small>${esc(b.date)} · ${esc(b.label)}</small><h3>${esc(b.title)}</h3><p>${esc(b.summary)}</p><a href="reports.html?issue=${encodeURIComponent(b.id)}">Read Q-Pueblo findings, sources and options →</a></article>`).join('')||'<p>Reviewed brief catalog temporarily unavailable.</p>'}
 for(const button of document.querySelectorAll('[data-choice]'))button.addEventListener('click',()=>{
  const answer=q('#qp-answer'),selected=button.getAttribute('data-choice');
  answer.textContent=selected==='5'?'Correct: $5m was authorized; $3m paid against that authorization is not an additional $3m authorization. Still reconcile any later amendments.':'The authorized total is $5m. The $3m payment is one stage of that amount, not an extra appropriation.';
 });
})();
