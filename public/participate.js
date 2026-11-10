'use strict';
(()=>{
 const $=id=>document.getElementById(id),clean=(s,m)=>String(s||'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,m);let text='';
 $('contrib-form').addEventListener('submit',e=>{e.preventDefault();if(!$('contrib-form').reportValidity())return;
 const type=clean($('input-type').value,100),issue=clean($('input-issue').value,65),claim=clean($('input-claim').value,2500),url=clean($('input-source').value,600),date=clean($('input-date').value,10),counter=clean($('input-counter').value,1300);
 if(url&&!/^https:\/\/[a-z0-9.-]+(?:\/|$)/i.test(url)){$('contrib-result').hidden=false;$('contrib-status').textContent='Please provide a public HTTPS source URL or leave it blank.';return}
 const subject='Q-Pueblo public input: '+type+(issue?' ['+issue+']':'');text='To: Q10pueblo@gmail.com\nSubject: '+subject+'\n\nContribution type: '+type+'\nRelated issue: '+(issue||'New or unknown')+'\nDocument/observation date: '+(date||'Not provided')+'\nPublic URL: '+(url||'Not supplied')+'\n\nClaim or observation:\n'+claim+'\n\nCounterevidence / limitation:\n'+(counter||'Not provided')+'\n\nI request human review and understand that this message is an unverified lead, not automatic publication.';
 $('contrib-result').hidden=false;$('contrib-text').textContent=text;$('contrib-status').textContent='Prepared locally. No submission has occurred; use the email action and press Send in your email application.';
 const body=text.split('\n').slice(3).join('\n').slice(0,2200);$('contrib-send').href='mailto:Q10pueblo@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);$('contrib-result').scrollIntoView({block:'start',behavior:'smooth'});
 });
 $('contrib-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text);$('contrib-status').textContent='Copied. Nothing was automatically submitted.'}catch{$('contrib-status').textContent='Copy permission unavailable. Select the prepared text and copy manually.'}});
})();
