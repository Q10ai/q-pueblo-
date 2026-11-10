'use strict';
(() => {
 const homeForm=document.querySelector('.qp-searchstrip form');
 if(homeForm)homeForm.addEventListener('submit',e=>{e.preventDefault();const query=document.getElementById('home-q').value.trim();if(query)location.href='qify.html#q='+encodeURIComponent(query)});
 const menu=document.getElementById('qp-menu-toggle'),nav=document.getElementById('qp-global-nav');
 if(menu&&nav){menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)});nav.addEventListener('click',e=>{if(e.target.closest('a')){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open')}})}
})();
