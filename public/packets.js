'use strict';
(() => {
 const input=document.getElementById('packet-search'),status=document.getElementById('packet-count'),cards=[...document.querySelectorAll('[data-packet-family]')];
 const filter=()=>{const words=input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);let count=0;for(const card of cards){const show=words.every(w=>card.textContent.toLowerCase().includes(w));card.hidden=!show;if(show)count++;}status.textContent=count+' of '+cards.length+' historical draft families shown.';};
 input.addEventListener('input',filter);filter();
})();
