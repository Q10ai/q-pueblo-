'use strict';(()=>{
const d=window.QP_PUBLIC_CATALOG;
if(!d)return;
const $=s=>document.querySelector(s),sel=$('#ob-issue');for(const i of d.issues){const o=document.createElement('option');o.value=i.id;o.textContent=i.id+' · '+i.title;sel.append(o)}
const fromQuery=new URLSearchParams(location.search).get('issue');if(fromQuery&&d.issues.some(i=>i.id===fromQuery))sel.value=fromQuery;
let prepared='';
const read=id=>$(id).value.trim();
$('#ob-form').addEventListener('submit',ev=>{ev.preventDefault();const url=read('#ob-url');if(url&&!/^https:\/\//i.test(url)){ $('#ob-result-status').textContent='Use an HTTPS original source URL, or leave this field blank.';$('#ob-output').hidden=false;return}
const record={schema:'qp-observation-draft-v1',status:'LOCAL_ONLY_NOT_SUBMITTED',builtAt:new Date().toISOString(),type:read('#ob-type'),issueId:read('#ob-issue'),statement:read('#ob-statement'),eventDate:read('#ob-date')||null,sourceUrl:url||null,evidenceDescription:read('#ob-evidence'),counterevidence:read('#ob-counter'),requestedAction:read('#ob-action'),editorialState:'unreviewed_signal',privacy:'No identifying personal data should be entered',verification:'Human editorial review required; sources and contrary evidence must be checked'};
prepared=JSON.stringify(record,null,2);$('#ob-json').textContent=prepared;$('#ob-result-status').textContent='Draft assembled in this browser only. Nothing has been transmitted or saved to Q-Pueblo.';$('#ob-output').hidden=false;$('#ob-output').scrollIntoView({behavior:'smooth',block:'start'});
});
$('#ob-copy').addEventListener('click',async()=>{if(!prepared)return;try{await navigator.clipboard.writeText(prepared);$('#ob-result-status').textContent='Draft copied. It has not been submitted.'}catch{$('#ob-result-status').textContent='Copy was unavailable. Select the record text manually.'}});
$('#ob-download').addEventListener('click',()=>{if(!prepared)return;const blob=new Blob([prepared],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='qp-observation-draft.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)});
$('#ob-form').addEventListener('reset',()=>{$('#ob-output').hidden=true;prepared=''})
})();
