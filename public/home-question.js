'use strict';
(() => {
  const form=document.getElementById('home-q-form');
  if(!form)return;
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const input=document.getElementById('home-q'),q=String(input?.value||'').trim();
    if(q.length<3){input?.setCustomValidity('Enter at least three characters.');input?.reportValidity();return;}
    input.setCustomValidity('');
    // URL fragments are not transmitted in an HTTP request.
    location.assign('qify.html#q='+encodeURIComponent(q.slice(0,180)));
  });
})();
