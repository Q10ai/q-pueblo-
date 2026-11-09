'use strict';(()=>{
// Navigation menu is controlled ONCE by portal-v2.js. Do not attach a second toggle here.
const q=s=>document.querySelector(s);
const term=q('#updates-search'),kind=q('#updates-kind'),list=q('#updates-list'),status=q('#updates-status');
if(!term||!kind||!list||!status)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const secure=u=>{try{const p=new URL(u);return p.protocol==='https:'&&!p.username&&!p.password?p.href:null}catch{return null}};
let records=[];
function render(){
 const t=term.value.trim().toLowerCase(),filter=kind.value;
 const rows=records.filter(x=>(filter==='all'||x.kind===filter)&&(!t||[x.title,x.publisher,x.kind].join(' ').toLowerCase().includes(t)));
 status.textContent=`${rows.length} of ${records.length} original-source notices and official directories. Unreviewed titles do not establish a meeting decision or outcome.`;
 list.innerHTML=rows.map(x=>{const url=secure(x.url);const directory=x.kind==='source_directory';return `<article class="qp-event"><small>${esc(x.publisher)} · ${directory?'Source directory':'Feed metadata; editorial review pending'} · ${esc(x.publishedAt||'No update date')}</small><h3>${esc(x.title)}</h3><p>${directory?'Publisher directory — inspect the exact dated original record to confirm current meetings.':'Automated publisher title; not independently reviewed or a Q-Pueblo finding.'}</p>${url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">Open original source ↗</a>`:'<p>Source URL is not approved for display.</p>'}</article>`}).join('')||'<div class="qp-empty">No matching notices; try a broader term.</div>';
}
term.addEventListener('input',render);kind.addEventListener('change',render);
fetch('data/updates.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('status '+r.status);return r.json()}).then(d=>{
 if(d.schema!=='qp-official-source-watch-v1'||!Array.isArray(d.sources)||!Array.isArray(d.items))throw Error('unsupported source schema');
 const sources=d.sources.filter(x=>x&&x.url&&x.name).map(x=>({id:x.id,title:x.name,publisher:x.publisher,url:x.url,kind:'source_directory',publishedAt:d.publishedAsOf,status:'source_directory'}));
 const notices=d.items.filter(x=>x?.title&&x.url&&x.publishedAt).map(x=>({...x,kind:'official_feed_item'}));
 records=[...notices,...sources];render();
 }).catch(()=>{status.textContent='Source metadata is temporarily unavailable; no conclusions about current meeting activity are inferred.';list.innerHTML='<p>Use <a href="https://www.pueblo.us/">City of Pueblo</a> or <a href="https://www.pueblocounty.gov/">Pueblo County</a> official records.</p>';});
})();
