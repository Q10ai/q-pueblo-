// Accessible subject search — no AI inference, tracking, private data or network requests.
const input=document.querySelector('#subject-search');
if(input){
 const tiles=[...document.querySelectorAll('[data-subject-card]')];
 const message=document.querySelector('#subject-search-message');
 input.addEventListener('input',()=>{
  const terms=input.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  let count=0;
  for(const card of tiles){
   const contents=(card.getAttribute('data-search')||'').toLocaleLowerCase();
   card.hidden=!terms.every(t=>contents.includes(t));
   if(!card.hidden)count++;
  }
  if(message)message.textContent=terms.length?
   (count?count+' matching Pueblo subject'+(count===1?'':'s')+' found.':'No matching subject. Try a broader word such as water, law, housing or health.'):
   'All 25 subjects are available below.';
 });
}
