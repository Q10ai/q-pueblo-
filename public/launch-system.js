'use strict';
(() => {
 const menu=document.getElementById('qp-menu-toggle'),nav=document.getElementById('qp-global-nav');
 if(menu&&nav){menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)});nav.addEventListener('click',e=>{if(e.target.closest('a')){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open')}})}
})();
