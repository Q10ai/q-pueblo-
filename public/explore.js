
'use strict';
(function(){
  const data=window.QP_PUBLIC_CATALOG,one=s=>document.querySelector(s),esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  if(!data||!Array.isArray(data.issues)){one('#result-count').textContent='Catalogue file unavailable. Please use the main Q Pueblo research page.';return;}
  const list=one('#issue-results'),category=one('#category-select'),search=one('#issue-search'),counts=one('#result-count'),chips=one('#category-overview'),sourceSearch=one('#source-search'),sources=one('#source-results'),dialog=one('#issue-dialog');
  const srcById=new Map(data.sources.map(s=>[s.id,s]));one('#issue-count').textContent=String(data.issues.length);one('#source-count').textContent=String(data.sources.length);
  for(const c of data.categories){const op=document.createElement('option');op.value=c;op.textContent=c;category.appendChild(op);}
  function filtered(){const q=search.value.trim().toLowerCase(),cat=category.value;return data.issues.filter(i=>(cat==='all'||i.category===cat)&&(!q||[i.id,i.title,i.domain,i.category,i.geography].join(' ').toLowerCase().includes(q)));}
  function draw(){const rows=filtered();counts.textContent=rows.length+' of '+data.issues.length+' dated research records';chips.innerHTML=data.categories.map(c=>{const count=data.issues.filter(i=>i.category===c).length;return '<button type="button" data-category="'+esc(c)+'" aria-pressed="'+(category.value===c)+'">'+esc(c)+' · '+count+'</button>';}).join('');
    list.innerHTML=rows.length?rows.map(i=>'<article class="catalog-card"><div class="card-top"><span class="card-id">'+esc(i.id)+'</span><span class="card-category">'+esc(i.category)+'</span></div><h3>'+esc(i.title)+'</h3><p class="card-domain">'+esc(i.domain||'Multi-domain research')+'</p><button type="button" data-open="'+esc(i.id)+'" aria-label="Open dated record '+esc(i.id)+'">Read record and sources</button></article>').join(''):'<div class="catalog-empty">No records match those filters. Try a broader topic or category.</div>';
  }
  function details(id){const i=data.issues.find(x=>x.id===id);if(!i)return;one('#detail-title').textContent=i.title;one('#detail-meta').textContent=i.id+' • '+i.category;
    const linked=i.sourceIds.map(x=>srcById.get(x)).filter(Boolean);
    const links=linked.length?'<h3>Original-source leads</h3><ul class="detail-sources">'+linked.map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a> <small>('+esc(s.publisher)+')</small></li>').join('')+'</ul>':'<p>No public primary-source link is yet crosswalked to this exact index record. Use the source directory and official institutional portals; this is an open evidence task, not a finding.</p>';
    one('#detail-body').innerHTML='<p><strong>Research scope:</strong> '+esc(i.title)+'. The registered topic does not itself assert an outcome, wrongdoing or current project status.</p><div class="detail-grid"><div><small>Research domain</small><strong>'+esc(i.domain||'Cross-domain')+'</strong></div><div><small>Registry review date</small><strong>'+esc(i.lastReviewed||'Not recorded')+'</strong></div><div><small>Geography</small><strong>'+esc(i.geography||'Regional')+'</strong></div><div><small>Editorial state</small><strong>Current source review required</strong></div></div><h3>Past, present and future</h3><p>Past: keep the dated source and historical decisions. Present: compare current official materials, roles and money stages. Future: model alternatives only with stated assumptions, risks and uncertainty.</p><h3>Child and community effects</h3><p>'+esc(i.childImpact)+' Consider direct and indirect effects on residents, workers, children, household costs, public services and future obligations; do not infer results without evidence.</p>'+links+'<p><small>Source links are leads for inspection, not automatic corroboration of a particular proposition. Newer versions may supersede this snapshot.</small></p>';
    if(typeof dialog.showModal==='function'){dialog.showModal();}else{dialog.setAttribute('open','');}
    history.replaceState(null,'','#'+encodeURIComponent(i.id));
  }
  list.addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(b)details(b.getAttribute('data-open'));});
  chips.addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b){category.value=b.dataset.category;draw();}});
  search.addEventListener('input',draw);category.addEventListener('change',draw);
  one('#clear-search').addEventListener('click',()=>{search.value='';category.value='all';draw();search.focus();});
  one('#detail-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{if(location.hash.startsWith('#REG-')||location.hash.startsWith('#QRX-'))history.replaceState(null,'',location.pathname+location.search);});
  function drawSources(){const q=sourceSearch.value.trim().toLowerCase();const rows=data.sources.filter(s=>!q||[s.title,s.publisher,s.id,s.type].join(' ').toLowerCase().includes(q));one('#source-count-label').textContent=rows.length+' of '+data.sources.length+' public institutional source links (199 registered sources in the historical ledger).';
    sources.innerHTML=rows.length?rows.map(s=>'<article class="source-card"><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a><small>'+esc(s.publisher)+' • '+esc(s.asOf||'Date check required')+' • '+esc(s.id)+'</small></article>').join(''):'<div class="catalog-empty">No source matches this search.</div>';
  }
  sourceSearch.addEventListener('input',drawSources);draw();drawSources();
  const hash=decodeURIComponent(location.hash.slice(1));if(data.issues.some(i=>i.id===hash))details(hash);
})();
