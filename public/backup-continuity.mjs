export function evaluateContinuity(input){
 if(!input||!Array.isArray(input.options)||!Array.isArray(input.failedDependencies)||!Number.isFinite(input.maxOutageHours)||input.maxOutageHours<0||!Number.isFinite(input.maxDataLossHours)||input.maxDataLossHours<0)throw Error("Invalid continuity contract");
 const failed=new Set(input.failedDependencies);const seen=new Set();
 const results=input.options.map(o=>{
  if(!o||typeof o.id!=="string"||!o.id.trim()||seen.has(o.id))throw Error("Missing or duplicate option id");seen.add(o.id);
  const reasons=[];
  if(!Array.isArray(o.dependencies)||!o.dependencies.length||o.dependencies.some(d=>typeof d!=="string"||!d.trim()))reasons.push("Dependencies unknown");
  else if(o.dependencies.some(d=>failed.has(d)))reasons.push("Shared failed dependency");
  if(o.tested!==true)reasons.push("Restore or exercise not verified");
  if(o.authorized!==true)reasons.push("Authority not established");
  if(o.meetsMinimumService!==true)reasons.push("Minimum service not verified");
  if(o.integrityVerified!==true)reasons.push("Integrity not verified");
  if(!Number.isFinite(o.recoveryHours)||o.recoveryHours<0||o.recoveryHours>input.maxOutageHours)reasons.push("Recovery target unmet or unknown");
  if(!Number.isFinite(o.dataLossHours)||o.dataLossHours<0||o.dataLossHours>input.maxDataLossHours)reasons.push("Data loss target unmet or unknown");
  return {id:o.id,status:reasons.length?"BLOCKED":"HUMAN_REVIEW",reasons};
 });
 return {state:results.some(r=>r.status==="HUMAN_REVIEW")?"OPTIONS_FOR_HUMAN_REVIEW":"NO_VERIFIED_OPTION_ESCALATE",automaticActivation:false,results};
}


/* Browser-only exercise; no real service control, persisted data, or external calls. */
export function exerciseInput(maxOutageHours,maxDataLossHours,failed,checks){
 const flags=['tested','authorized','meetsMinimumService','integrityVerified'];
 if(!['none','cloud-a','internet-a','local-power','trained-staff'].includes(failed))throw Error('Unknown dependency selection');
 if(!Array.isArray(checks)||checks.length!==2||checks.some(x=>!x||flags.some(k=>typeof x[k]!=='boolean')))throw Error('Invalid exercise checks');
 const rows=[{id:'Shared cloud alternate',dependencies:['cloud-a','internet-a'],recoveryHours:1,dataLossHours:0},{id:'Local offline alternate',dependencies:['local-power','trained-staff'],recoveryHours:2,dataLossHours:1}];
 return {maxOutageHours,maxDataLossHours,failedDependencies:failed==='none'?[]:[failed],options:rows.map((r,i)=>({...r,...Object.fromEntries(flags.map(k=>[k,checks[i][k]]))}))};
}
if(typeof document!=='undefined'){
 const form=document.getElementById('backup-exercise');
 if(form){
  const field=id=>document.getElementById(id);
  const flags=['tested','authorized','meetsMinimumService','integrityVerified'];
  const result=field('backup-result');
  form.addEventListener('submit',event=>{
   event.preventDefault();result.replaceChildren();
   try{
    const input=exerciseInput(field('backup-rto').valueAsNumber,field('backup-rpo').valueAsNumber,field('backup-failure').value,[0,1].map(i=>Object.fromEntries(flags.map(k=>[k,field('backup-'+i+'-'+k).checked]))));
    const r=evaluateContinuity(input);
    const paragraph=document.createElement('p');paragraph.textContent=r.state==='OPTIONS_FOR_HUMAN_REVIEW'?'At least one hypothetical option meets the entered conditions for human review. No activation is authorized.':'No option has passed the exercise conditions. Escalate to the responsible person; do not activate an unverified backup.';result.append(paragraph);
    const list=document.createElement('ul');
    for(const row of r.results){const item=document.createElement('li');item.textContent=row.id+': '+(row.status==='HUMAN_REVIEW'?'Human review required — all entered checks satisfied':row.reasons.join('; '));list.append(item);}result.append(list);
   }catch(error){result.textContent=error.message;}
  });
  form.addEventListener('reset',()=>{result.textContent='Exercise cleared. Nothing was activated.';});
 }
}
