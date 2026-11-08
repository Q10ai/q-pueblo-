'use strict';
// Only filters existing, already-public navigation labels in the browser.
// No telemetry, cookies, profiles, network requests, or storage.
const input=document.getElementById('query');
const kind=document.getElementById('kind');
const records=Array.from(document.querySelectorAll('#records .record'));
const summary=document.getElementById('live-count');
function filterCatalog(){
  const needle=input.value.normalize('NFKC').trim().toLowerCase();
  const category=kind.value;
  let count=0;
  for(const card of records){
    const matches=(category==='ALL'||card.dataset.kind===category)&&card.textContent.normalize('NFKC').toLowerCase().includes(needle);
    card.hidden=!matches;
    if(matches)count++;
  }
  summary.textContent=`${count} visible navigation ${count===1?'entry':'entries'} — no verified case findings implied`;
}
input.addEventListener('input',filterCatalog);
kind.addEventListener('change',filterCatalog);
