'use strict';(()=>{
const el=document.getElementById('qp-now-list'),state=document.getElementById('qp-now-state');if(!el)return;
fetch('data/updates.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('unavailable');return r.json()}).then(d=>{
 if(d.schema!=='qp-official-source-watch-v1')throw Error('invalid schema');
 const notices=(d.items||[]).filter(x=>x.url&&x.title&&x.status==='source_metadata_unreviewed').slice(0,3);
 const dirs=(d.sources||[]).filter(x=>x.url&&x.name).slice(0,3);
 if(state)state.textContent=`Official links only · Dated snapshot ${d.publishedAsOf||'unknown'} · No certified live meeting feed`;
 const rows=notices.length?notices.map(x=>({url:x.url,title:x.title})):dirs.map(x=>({url:x.url,title:x.name}));
 for(const item of rows){try{const url=new URL(item.url);if(url.protocol!=='https:')continue;const a=document.createElement('a');a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=item.title;el.append(a)}catch{}}
 if(!rows.length)el.textContent='No verified publisher records available; view the dated updates directory.';
 }).catch(()=>{if(state)state.textContent='Update metadata temporarily unavailable';el.textContent='Use the official publisher directories for current notices.'});
})();
