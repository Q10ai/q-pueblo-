// Q Pueblo public discovery: local filtering of dated public snapshots only.
export function normalize(value){return String(value??'').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().trim();}
export function buildRecords(historical,regional){
  const make=(rows,kind)=>rows.map(r=>({kind,id:String(r.id),title:String(r.title),category:String(r.category||r.domain||''),state:String(r.status||r.state||'Review required'),date:String(r.lastReviewed||r.source_date||''),needed:kind==='regional'?String(r.needed||''):''}));
  if(!Array.isArray(historical?.issues)||!Array.isArray(regional?.issues))throw new Error('Invalid snapshot');
  return [...make(historical.issues,'standalone'),...make(regional.issues,'regional')];
}
export function searchRecords(records,query,scope='all'){
  const terms=normalize(query).split(/\s+/).filter(Boolean);
  return records.filter(r=>(scope==='all'||r.kind===scope)&&terms.every(t=>normalize([r.id,r.title,r.category,r.needed].join(' ')).includes(t)));
}
export function recordHref(r){return r.kind==='standalone'?'issues.html?q='+encodeURIComponent(r.id):'connections.html?issue='+encodeURIComponent(r.id.toLowerCase());}
function mount(){
  const $=id=>document.getElementById(id), query=$('open-query'), scope=$('open-scope'), status=$('open-status'), results=$('open-results'), more=$('open-more'), answer=$('open-answer');
  let records=[],ready=false,limit=30;
  function render(reset=true){if(reset)limit=30;const q=query.value.trim();answer.href='qify.html'+(q?'#q='+encodeURIComponent(q):'');if(!ready)return;
    const matched=searchRecords(records,q,scope.value);results.replaceChildren();status.textContent=`${matched.length} matching record entries; overlapping catalogs are not a count of distinct issues. Showing ${Math.min(limit,matched.length)}.`;
    for(const r of matched.slice(0,limit)){
      const item=document.createElement('article');item.className='qp-exp-card';const meta=document.createElement('p');meta.className='qp-exp-tag';meta.textContent=(r.kind==='standalone'?'Standalone index':'Regional graph')+' · '+r.id;const h=document.createElement('h3');h.textContent=r.title;const p=document.createElement('p');p.textContent=[r.category,r.state,r.date?'Record date: '+r.date:'Record date not supplied'].filter(Boolean).join(' · ');const a=document.createElement('a');a.href=recordHref(r);a.textContent='Open evidence record →';item.append(meta,h,p,a);if(r.needed){const d=document.createElement('details');const s=document.createElement('summary');s.textContent='Evidence still needed';const e=document.createElement('p');e.textContent=r.needed;d.append(s,e);item.append(d);}results.append(item);
    }
    more.hidden=matched.length<=limit;
  }
  query.addEventListener('input',()=>render());scope.addEventListener('change',()=>render());more.addEventListener('click',()=>{limit+=30;render(false);});
  $('open-form').addEventListener('submit',e=>{e.preventDefault();render();});
  const get=async url=>{const r=await fetch(url);if(!r.ok)throw Error('Snapshot not available');return r.json();};
  Promise.all([get('data/q-pueblo-issue-index-2026-11-09.json'),get('data/qp-three-hop-2026-11-13.json')]).then(([h,g])=>{records=buildRecords(h,g);ready=true;render();}).catch(()=>{status.textContent='The combined snapshot could not load. Use the separate issue index and regional network links below; do not infer that no issue exists.';});
  render();
}
if(typeof document!=='undefined')mount();
