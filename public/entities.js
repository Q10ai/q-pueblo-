'use strict';(()=>{
const d=window.QP_PUBLIC_CATALOG;if(!d)return;
const $=s=>document.querySelector(s),esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const srcGroups=new Map(),issueMatches=new Map();for(const s of d.sources){if(!srcGroups.has(s.publisher))srcGroups.set(s.publisher,[]);srcGroups.get(s.publisher).push(s)}
for(const i of d.issues){for(const id of i.sourceIds||[]){if(!issueMatches.has(id))issueMatches.set(id,[]);issueMatches.get(id).push(i)}}
const publisherRows=[...srcGroups].map(([name,links])=>({name,links,issueCount:new Set(links.flatMap(x=>(issueMatches.get(x.id)||[]).map(i=>i.id))).size})).sort((a,b)=>a.name.localeCompare(b.name));
const kinds=[...new Set(d.sources.map(s=>s.type))].sort();for(const k of kinds){const op=document.createElement('option');op.value=k;op.textContent=k.replaceAll('_',' ');$('#entity-kind').append(op)}
function render(){const q=$('#entity-search').value.toLowerCase().trim(),kind=$('#entity-kind').value;const arr=publisherRows.filter(r=>(kind==='all'||r.links.some(s=>s.type===kind))&&(!q||[r.name,...r.links.map(s=>s.title)].join(' ').toLowerCase().includes(q)));
$('#entity-count').textContent=`${arr.length} of ${publisherRows.length} publisher labels · ${d.sources.length} unique source URLs in the dated public directory`;
$('#entity-list').innerHTML=arr.length?arr.map(r=>`<article class="qp-entity-row"><h3>${esc(r.name)}</h3><small>${r.links.length} public source link(s) · ${r.issueCount} index topics with explicit source crosswalk</small><details><summary>Inspect original records</summary><ul>${r.links.map(s=>{const related=issueMatches.get(s.id)||[];return `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a> <small>(${esc(s.asOf||'date unknown')}, ${esc(s.type)})</small>${related.length?`<div>${related.slice(0,5).map(i=>`<a href="reports.html?issue=${encodeURIComponent(i.id)}#dossier">${esc(i.id)}</a>`).join(' · ')}${related.length>5?` +${related.length-5} more`:''}</div>`:''}</li>`}).join('')}</ul></details></article>`).join(''):'<p class="qp-empty">No publisher matches. Broaden the name or classification.</p>';
}
$('#entity-search').addEventListener('input',render);$('#entity-kind').addEventListener('change',render);$('#domain-list').innerHTML=d.domains.map(x=>`<li>${esc(x)}</li>`).join('');render();
})();
