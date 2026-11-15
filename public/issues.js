"use strict";
(()=>{
 const $=id=>document.getElementById(id),all=[...document.querySelectorAll('.issue')],search=$('search'),cat=$('category'),mapped=$('mapped'),status=$('results-status'),none=$('none');
 let storyIndex=null;
 const sort=$('issue-story-sort');
 const reorder=()=>{if(!storyIndex)return;const rows=all.map(x=>storyIndex.story(x.id)).filter(Boolean);const ordered=QPIssueStory.order(rows,sort.value);const parent=all[0]?.parentNode;if(parent)for(const r of ordered){const el=$(r.id);if(el)parent.append(el);}};
 const filter=()=>{const q=search.value.trim().toLocaleLowerCase(),c=cat.value,m=mapped.value;let n=0;for(const x of all){const show=(!q||x.dataset.search.includes(q))&&(!c||x.dataset.category===c)&&(!m||x.dataset.mapped===m);x.hidden=!show;if(show)n++}reorder();status.textContent=`Showing ${n} matching issue records. Check each source date.`;none.hidden=n>0};
 search.addEventListener('input',filter);cat.addEventListener('change',filter);mapped.addEventListener('change',filter);$('reset').addEventListener('click',()=>{search.value='';cat.value='';mapped.value='';sort.value='newest';filter();search.focus()});
 document.querySelectorAll('[data-filter-category]').forEach(b=>b.addEventListener('click',()=>{cat.value=b.dataset.filterCategory;filter();$('records').scrollIntoView({block:'start'})}));
 document.querySelectorAll('[data-filter-mapped]').forEach(b=>b.addEventListener('click',()=>{mapped.value=b.dataset.filterMapped;filter();$('records').scrollIntoView({block:'start'})}));
 // Allow direct, shareable links from the Topics browser; reject unknown values.
 const params=new URLSearchParams(window.location.search);
 const requestedTopic=params.get('topic')||params.get('category')||'';
 if([...cat.options].some(option=>option.value===requestedTopic))cat.value=requestedTopic;
 const requestedQuery=params.get('q')||'';
 if(requestedQuery.length<=120)search.value=requestedQuery;
 filter();
 sort.addEventListener('change',filter);
 Promise.all(['data/q-pueblo-issue-index-2026-11-09.json','data/qp-three-hop-2026-11-13.json','data/qp-current-reports.json','data/qp-governance-index-input-v1.json'].map(p=>fetch(p,{credentials:'same-origin'}).then(r=>{if(!r.ok)throw Error('load');return r.json();}))).then(([l,g,r,c])=>{storyIndex=QPIssueStory.makeIndex(l,g,r.reports,c);let supported=0,companion=0;for(const el of all){const s=storyIndex.story(el.id);if(!s)continue;if(s.state==='DATED_EVIDENCE')supported++;if(s.state==='COMPANION_ONLY')companion++;const body=el.querySelector('.issue-body');if(body)body.prepend(QPIssueStoryView.render(s));} $('issue-story-status').textContent=supported+' records link to dated evidence; '+companion+' have cross-linked companion reading only. Remaining entries have research gaps. No live research performed.';filter();}).catch(()=>{$('issue-story-status').textContent='Research library unavailable. Original dated records and source leads remain below.';});
 const openHash=()=>{let id='';try{id=decodeURIComponent(location.hash.slice(1))}catch{return}if(!id)return;const x=document.getElementById(id);if(x?.classList.contains('issue')){search.value='';cat.value='';mapped.value='';filter();x.open=true}};
 window.addEventListener('hashchange',openHash);openHash();
 document.addEventListener('click',async e=>{const b=e.target.closest('[data-copy]');if(!b)return;const id=b.dataset.copy;const item=document.getElementById(id);if(!item)return;const text=`Q-Pueblo historical research record ${id}: ${item.querySelector('.issue-title').textContent} — dated 2026-11-08 public index, not a current verified finding. https://qpueblo.pages.dev/issues.html#${encodeURIComponent(id)}`;try{await navigator.clipboard.writeText(text);b.textContent='Copied'}catch{b.textContent='Copy unavailable'}});
})();