'use strict';
(()=>{
 const $=id=>document.getElementById(id),clean=(s,m)=>String(s||'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,m);let text='';
 const requested=new URLSearchParams(window.location.search).get('issue')||'';
 if(/^PRIORITY-(0[1-9]|1[0-8])$/.test(requested)) $('input-issue').value=requested;
 $('contrib-form').addEventListener('submit',e=>{e.preventDefault();if(!$('contrib-form').reportValidity())return;
 const type=clean($('input-type').value,100),issue=clean($('input-issue').value,65),claim=clean($('input-claim').value,2500),url=clean($('input-source').value,600),date=clean($('input-date').value,10),counter=clean($('input-counter').value,1300);
 if(url&&!/^https:\/\/[a-z0-9.-]+(?:\/|$)/i.test(url)){$('contrib-result').hidden=false;$('contrib-status').textContent='Please provide a public HTTPS source URL or leave it blank.';return}
 const subject='Q-Pueblo public input: '+type+(issue?' ['+issue+']':'');text='To: Q10pueblo@gmail.com\nSubject: '+subject+'\n\nContribution type: '+type+'\nRelated issue: '+(issue||'New or unknown')+'\nDocument/observation date: '+(date||'Not provided')+'\nPublic URL: '+(url||'Not supplied')+'\n\nClaim or observation:\n'+claim+'\n\nCounterevidence / limitation:\n'+(counter||'Not provided')+'\n\nI request human review and understand that this message is an unverified lead, not automatic publication.';
 $('contrib-result').hidden=false;$('contrib-text').textContent=text;$('contrib-status').textContent='Prepared locally. No submission has occurred; use the email action and press Send in your email application.';
 const body=text.split('\n').slice(3).join('\n');const mail='mailto:Q10pueblo@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);if(mail.length>1800){$('contrib-send').href='mailto:Q10pueblo@gmail.com?subject='+encodeURIComponent(subject);$('contrib-status').textContent='Prepared locally. The message is too long for a reliable email link. Copy the full prepared text into your email app before sending; the email link contains only the subject.';}else{$('contrib-send').href=mail;}$('contrib-result').scrollIntoView({block:'start',behavior:'smooth'});
 });
 $('contrib-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text);$('contrib-status').textContent='Copied. Nothing was automatically submitted.'}catch{$('contrib-status').textContent='Copy permission unavailable. Select the prepared text and copy manually.'}});
})();
