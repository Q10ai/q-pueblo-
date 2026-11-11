document.addEventListener('DOMContentLoaded',()=>{
 const $=id=>document.getElementById(id);
 const help={surplus:['What does surplus mean?','An annual surplus means planned funding exceeds planned spending for that year. It is different from cash in the bank and from the accumulated balance of a fund. A proposed surplus has not yet been earned.'],fund:['What is a fund?','A fund keeps money for a defined purpose in a separate set of accounts. Restrictions and obligations can prevent money in one fund from being used elsewhere. A fund balance is not automatically unrestricted cash.']};
 let lastFocus;
 document.querySelectorAll('[data-term]').forEach(button=>button.addEventListener('click',()=>{const t=help[button.dataset.term];if(!t)return;lastFocus=button;$('help-title').textContent=t[0];$('help-body').textContent=t[1];$('help-dialog').showModal();}));
 $('close-help').addEventListener('click',()=>$('help-dialog').close());$('help-dialog').addEventListener('close',()=>lastFocus?.focus());
 const box=document.querySelector('.scenario');
 const format=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
 function update(){const a=Number($('revenue-loss').value),b=Number($('savings-delivered').value);if(!Number.isFinite(a)||!Number.isFinite(b)||a<0||a>20||b<0||b>100){$('scenario-result').textContent='Use a revenue shortfall from 0% to 20% and delivery from 0% to 100%.';return;}const result=Number(box.dataset.surplus)-Number(box.dataset.revenue)*a/100-Number(box.dataset.reductions)*(1-b/100);$('scenario-result').textContent='Illustrative annual '+(result<0?'shortfall: ':'surplus: ')+format.format(Math.abs(result))+'. Other assumptions unchanged; not a forecast.';}
 ['revenue-loss','savings-delivered'].forEach(id=>$(id).addEventListener('input',update));
 $('copy-questions').addEventListener('click',async()=>{const text=Array.from($('questions').querySelectorAll('li')).map((li,i)=>(i+1)+'. '+li.textContent).join('\n\n');$('copy-status').textContent='You can select and copy the questions above. Nothing was submitted.';try{await navigator.clipboard.writeText(text);$('copy-status').textContent='Copied. Nothing was submitted.';}catch{$('copy-status').textContent='Select and copy the questions above. Nothing was submitted.';}});
 $('print-report').addEventListener('click',()=>window.print());
});
