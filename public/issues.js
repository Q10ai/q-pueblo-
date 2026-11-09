"use strict";
(()=>{
 const $=id=>document.getElementById(id),all=[...document.querySelectorAll('.issue')],search=$('search'),cat=$('category'),mapped=$('mapped'),status=$('results-status'),none=$('none');
 const filter=()=>{const q=search.value.trim().toLocaleLowerCase(),c=cat.value,m=mapped.value;let n=0;for(const x of all){const show=(!q||x.dataset.search.includes(q))&&(!c||x.dataset.category===c)&&(!m||x.dataset.mapped===m);x.hidden=!show;if(show)n++}status.textContent=`Showing ${n} of ${all.length} historical public issue IDs (${all.length===174?'dated 2026-11-08 catalog':'count from the current index'}); not a complete current regional issue count.`;none.hidden=n>0};
 search.addEventListener('input',filter);cat.addEventListener('change',filter);mapped.addEventListener('change',filter);$('reset').addEventListener('click',()=>{search.value='';cat.value='';mapped.value='';filter();search.focus()});
 document.querySelectorAll('[data-filter-category]').forEach(b=>b.addEventListener('click',()=>{cat.value=b.dataset.filterCategory;filter();$('records').scrollIntoView({block:'start'})}));
 document.querySelectorAll('[data-filter-mapped]').forEach(b=>b.addEventListener('click',()=>{mapped.value=b.dataset.filterMapped;filter();$('records').scrollIntoView({block:'start'})}));
 // Allow direct, shareable links from the Topics browser; reject unknown values.
 const params=new URLSearchParams(window.location.search);
 const requestedTopic=params.get('topic')||params.get('category')||'';
 if([...cat.options].some(option=>option.value===requestedTopic))cat.value=requestedTopic;
 const requestedQuery=params.get('q')||'';
 if(requestedQuery.length<=120)search.value=requestedQuery;
 filter();
 const openHash=()=>{let id='';try{id=decodeURIComponent(location.hash.slice(1))}catch{return}if(!id)return;const x=document.getElementById(id);if(x?.classList.contains('issue')){search.value='';cat.value='';mapped.value='';filter();x.open=true}};
 window.addEventListener('hashchange',openHash);openHash();
 document.addEventListener('click',async e=>{const b=e.target.closest('[data-copy]');if(!b)return;const id=b.dataset.copy;const item=document.getElementById(id);if(!item)return;const text=`Q-Pueblo historical research record ${id}: ${item.querySelector('.issue-title').textContent} — dated 2026-11-08 public index, not a current verified finding. https://qpueblo.pages.dev/issues.html#${encodeURIComponent(id)}`;try{await navigator.clipboard.writeText(text);b.textContent='Copied'}catch{b.textContent='Copy unavailable'}});
})();