'use strict';
(() => {
 const homeForm=document.querySelector('.qp-searchstrip form');
 if(homeForm && !homeForm.hasAttribute('data-search-mode'))homeForm.addEventListener('submit',e=>{e.preventDefault();const query=document.getElementById('home-q').value.trim();if(query)location.href='qify.html#q='+encodeURIComponent(query)});
 const caseOpen=()=>{if(!location.pathname.endsWith('packets.html'))return;try{let target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target?.classList.contains('qp-case-detail')){let d=target.querySelector('details');if(d)d.open=true}}catch{}};caseOpen();window.addEventListener('hashchange',caseOpen);
 const menu=document.getElementById('qp-menu-toggle'),nav=document.getElementById('qp-global-nav');
 if(menu&&nav){nav.classList.add('qp-js-nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)});nav.addEventListener('click',e=>{if(e.target.closest('a')){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open')}})}
})();
