import {computeEE,computeT2Y,computeMoney} from './q-tools-core.mjs';
const $=s=>document.querySelector(s),usd=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n),dec=n=>new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(n);
const results=new Map();
function write(id,model,html){const region=$('#'+id+'-result'),status=$('#'+id+'-status');region.textContent='';const p=document.createElement('p');p.textContent=html;region.append(p);status.textContent='Calculated locally from your inputs; no data was transmitted.';results.set(id,model)}
function field(form,id){return form.elements.namedItem(id).value}
const actions={
 ee(form){const p={tasks:field(form,'tasks'),manual:field(form,'manual'),automation:field(form,'automation'),review:field(form,'review'),rate:field(form,'rate'),subscription:field(form,'subscription'),perTask:field(form,'perTask'),wh:field(form,'wh'),pue:field(form,'pue'),kwhPrice:field(form,'kwhPrice')};const r=computeEE(p);
  let msg=`Current: ${dec(r.currentHours)} person-hours and ${usd(r.currentCost)} assumed labor value per month. Proposed: ${dec(r.proposedHumanHours)} person-hours including review and ${usd(r.proposedCost)} in human-plus-tool cost. Difference: ${dec(r.timeSavedHours)} human hours and ${usd(r.costDifference)} (positive means lower cost).`;
  if(r.energy)msg+=` Operational electricity estimate: ${dec(r.energy.kwhEstimate)} kWh/month${r.energy.monthlyElectricityCost===null?'':', '+usd(r.energy.monthlyElectricityCost)+' assumed electricity expense'}. These are not measured emissions or certified savings.`;
  else msg+=' No task-energy input was supplied, so energy use remains unknown.';
  write('ee',r,msg);
 },
 t2y(form){const r=computeT2Y({truth:field(form,'truth'),yieldValue:field(form,'yieldValue'),agency:field(form,'agency'),reversibility:field(form,'reversibility'),harm:field(form,'harm')});write('t2y',r,`Normalized reference score: ${dec(r.score)} (range 0–1). Status: ${r.gate.replaceAll('_',' ')}. This is a subjective simulation: not a proof of truth, safety, real-world benefit or authority.`)},
 money(form){const r=computeMoney({proposed:field(form,'proposed'),authorized:field(form,'authorized'),contracted:field(form,'contracted'),paid:field(form,'paid'),recovered:field(form,'recovered'),benefit:field(form,'benefit')});write('money',r,`Entered authorization: ${usd(r.authorized)}; contracted: ${usd(r.contracted)}; cash disbursed: ${usd(r.paid)}; recoveries: ${usd(r.recovered)}; illustrative net disbursement: ${usd(r.netDisbursement)}. These amounts are NOT additive. ${r.warnings.join(' ')||'No arithmetic inconsistency detected; this does not verify the underlying source data.'}`)}
};
for(const id of ['ee','t2y','money']){
 const form=$('#'+id+'-form');if(!form)continue;
 form.addEventListener('submit',e=>{e.preventDefault();try{actions[id](form)}catch(err){$('#'+id+'-status').textContent='Input check: '+err.message;$('#'+id+'-result').textContent=''}});
 const btn=$('#'+id+'-export');btn?.addEventListener('click',()=>{const model=results.get(id);if(!model)return;const data={...model,createdAt:new Date().toISOString(),source:'Q-Pueblo browser-only user-entered planning tool',measurementStatus:'NOT_VERIFIED'};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='qp-'+id+'-planning-assumptions.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
}
