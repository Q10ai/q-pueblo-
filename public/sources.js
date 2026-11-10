'use strict';
(()=>{
const data=window.QP_PUBLIC_CATALOG, $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){if(!data){$('source-status').textContent='Catalog unavailable. Try again.';return}const q=$('source-query').value.toLowerCase().trim();let a=data.sources.filter(s=>!q||[s.id,s.title,s.publisher,s.type,s.asOf].join(' ').toLowerCase().includes(q));$('source-status').textContent='Showing '+a.length+' of '+data.sources.length+' dated public source links; original pages may change.';$('source-results').innerHTML=a.map(s=>'<article><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+' ↗</a><small>'+esc(s.publisher)+' · '+esc(s.type)+' · '+esc(s.asOf)+' · Source ID: '+esc(s.id)+'</small></article>').join('')||'<p>No matching source. Try another search term.</p>'}
$('source-query').addEventListener('input',render);render();
})();
