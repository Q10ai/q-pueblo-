'use strict';
(function () {
  const names = ['compute','energy','latency','error','review','rework','trust','public'];
  const number = (x,min,max) => {
    const n = Number(x);
    if (String(x).trim() === '' || !Number.isFinite(n) || n < min || n > max) throw new Error('Invalid number: value must be between '+min+' and '+max+'.');
    return n;
  };
  const route = o => {
    const costs = names.map(k => number(o[k],0,10));
    const total = costs.reduce((a,b)=>a+b,0);
    const eligible = !!o.safe && !!o.evidence && !!o.authority;
    const usefulYield = number(o.yield,0,1);
    return {name:String(o.name||'Unnamed route').slice(0,70),costs:Object.fromEntries(names.map((k,i)=>[k,costs[i]])),total,eligible,usefulYield,eeScore:usefulYield/(1+total)};
  };
  const ee = (a,b) => {
    const routes = [route(a),route(b)];
    const qualified = routes.filter(r=>r.eligible).sort((x,y)=>x.total-y.total);
    return {routes,disposition:qualified.length?'COMPARE_ELIGIBLE':'HOLD_NO_ELIGIBLE_ROUTE',leastCost:qualified.length?qualified[0].name:null,tie:qualified.length===2&&qualified[0].total===qualified[1].total};
  };
  const t2y = o => {
    const truth=number(o.truth,0,1), yieldValue=number(o.yield,0,1),agency=number(o.agency,0,1),reversibility=number(o.reversibility,0,1),harm=number(o.harm,0,1);
    const score=truth*yieldValue*agency*reversibility*(1-harm);
    const numericQualified=truth>=.8&&harm<=.2&&score>=.35;
    const reviewReady=!!o.provenance&&!!o.approval&&!!o.rollback;
    return {score,truth,yield:yieldValue,agency,reversibility,harm,numericQualified,reviewReady,disposition:numericQualified&&reviewReady?'CANDIDATE_FOR_HUMAN_REVIEW':'HOLD_EVIDENCE_OR_REVIEW'};
  };
  const lifecycle = (a,b,yearsInput) => {
    const years=number(yearsInput,1,100);
    if(!Number.isInteger(years)) throw new Error('Years must be a whole number.');
    const calc=o=>{
      const upfront=number(o.upfront,0,1e15),annual=number(o.annual,0,1e15),reserve=number(o.reserve,0,1e15);
      return {name:String(o.name||'Unnamed option').slice(0,70),upfront,annual,reserve,total:upfront+annual*years+reserve};
    };
    const options=[calc(a),calc(b)];
    if(!options.every(x=>Number.isFinite(x.total)&&x.total<=Number.MAX_SAFE_INTEGER)) throw new Error('Totals exceed safe numeric precision; reduce inputs.');
    return {years,options,absoluteDifference:Math.abs(options[0].total-options[1].total),lowerCost:options[0].total===options[1].total?null:options[0].total<options[1].total?options[0].name:options[1].name};
  };
  if(typeof window!=='undefined') window.QP_TOOLS_CORE={ee,t2y,lifecycle};
  if(typeof document==='undefined') return;
  const $=id=>document.getElementById(id);
  const val=id=>$(id).value;
  const flag=id=>$(id).checked;
  const fmt=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:4});
  const dollars=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n);
  const clean=(x,max)=>String(x||'').replace(/[\u0000-\u001F\u007F]/g,' ').trim().slice(0,max);
  let last=null;
  const report=(kind,title,text,data)=>{
    last={schema:'qp-qtools-report-v1',kind,title,generatedAt:new Date().toISOString(),methodVersion:'q-tools-v0.1',evidenceClass:'USER_SUPPLIED_OR_SIMULATED_UNVERIFIED',releaseAuthority:false,limitations:'Browser-only reference calculation. Inputs and source claims not independently verified. Human approval required.',data,markdown:'# '+title+'\n\n'+text+'\n\nMethod: Q-Pueblo Q Tools v0.1. Evidence class: USER_SUPPLIED_OR_SIMULATED_UNVERIFIED. No public-release authority. Human review required.\n'};
    $('qt-report').textContent=last.markdown;
    $('qt-status').textContent=title+' created locally. Verify inputs and provenance before use.';
    ['qt-md','qt-json','qt-copy','qt-print'].forEach(id=>$(id).disabled=false);
    $('deliverables').scrollIntoView({behavior:'smooth',block:'start'});
  };
  const safeRun=fn=>{try{fn()}catch(e){$('qt-status').textContent='Input error: '+e.message;$('qt-report').textContent='Correct the highlighted tool inputs and run again.';last=null;['qt-md','qt-json','qt-copy','qt-print'].forEach(id=>$(id).disabled=true);$('deliverables').scrollIntoView({block:'start'});}};
  const routeInput=p=>{
    const o={name:clean(val(p+'-name'),70),yield:val(p+'-yield'),safe:flag(p+'-safe'),evidence:flag(p+'-evidence'),authority:flag(p+'-authority')};
    names.forEach(n=>{o[n]=val(p+'-'+n);});
    return o;
  };
  $('run-ee').addEventListener('click',()=>safeRun(()=>{
    const out=ee(routeInput('ea'),routeInput('eb'));
    const rows=out.routes.map(r=>'**'+r.name+'**\nCost index: '+fmt(r.total)+' (sum of eight normalized costs)\nExpected useful yield: '+fmt(r.usefulYield)+'\nEE score: '+fmt(r.eeScore)+'\nEligibility: '+(r.eligible?'all three manually affirmed':'HOLD: one or more required gates absent')).join('\n\n');
    const verdict=out.leastCost?(out.tie?'Both eligible routes tie on cost.':'Least cost among eligible routes: '+out.leastCost):'HOLD. Neither route has all mandatory safety, evidence and authority gates.';
    report('ee','EE_INTEL route comparison',rows+'\n\n**Disposition:** '+verdict+'\n\nNo unit of the cost index is a measured dollar, kWh or hour.',out);
  }));
  $('run-t2y').addEventListener('click',()=>safeRun(()=>{
    const input={truth:val('t-truth'),yield:val('t-yield'),agency:val('t-agency'),reversibility:val('t-reversible'),harm:val('t-harm'),provenance:flag('t-provenance'),approval:flag('t-approval'),rollback:flag('t-rollback')};
    const out=t2y(input);
    const body='T2Y score: **'+fmt(out.score)+'**\nTruth support: '+out.truth+' | Yield: '+out.yield+' | Agency: '+out.agency+' | Reversibility: '+out.reversibility+' | Harm: '+out.harm+'\nReference numeric floors: '+(out.numericQualified?'MET':'NOT MET')+'\nProvenance / human review / rollback flags: '+(out.reviewReady?'ALL AFFIRMED':'INCOMPLETE')+'\n**Disposition:** '+out.disposition+'\n\nPassing does not establish actual truth or grant permission to publish.';
    report('t2y','T2Y Truth-to-Yield reference check',body,out);
  }));
  $('run-lifecycle').addEventListener('click',()=>safeRun(()=>{
    const inp=p=>({name:clean(val(p+'-name'),70),upfront:val(p+'-upfront'),annual:val(p+'-annual'),reserve:val(p+'-reserve')});
    const out=lifecycle(inp('la'),inp('lb'),val('lc-years'));
    const body='Comparison horizon: '+out.years+' years\n\n'+out.options.map(o=>'**'+o.name+'**\nOne-time: '+dollars(o.upfront)+'\nAnnual: '+dollars(o.annual)+'\nOne-time reserve: '+dollars(o.reserve)+'\nUndiscounted total: **'+dollars(o.total)+'**').join('\n\n')+'\n\nAbsolute cost difference: '+dollars(out.absoluteDifference)+'\nLowest nominal total: '+(out.lowerCost||'Tie')+'\n\nNo causal outcome or procurement recommendation is implied. Appropriation / obligation / payment are accounting stages, not additive cost components.';
    report('lifecycle','Lifecycle cost comparison',body,out);
  }));
  $('run-challenge').addEventListener('click',()=>safeRun(()=>{
    const source=clean(val('c-source'),1000);
    if(source && (!/^https:\/\//i.test(source)||/[<>"'\s]/.test(source))) throw new Error('Source URL must be a plain https:// URL.');
    const claim=clean(val('c-claim'),1400),counter=clean(val('c-counter'),1400),missing=clean(val('c-missing'),1400),request=clean(val('c-request'),1000),date=clean(val('c-date'),10);
    if(!claim)throw new Error('Enter a claim or observation.');
    const fields={claim,sourceUrl:source||null,sourceDate:date||null,counterevidence:counter||null,unknowns:missing||null,requestedReview:request||null,evidenceState:'UNVERIFIED_RESEARCH_LEAD',publicationStatus:'NOT_PUBLISHED'};
    const quote=s=>String(s||'Not supplied').replace(/\n/g,' ');
    const body='**Evidence state:** UNVERIFIED_RESEARCH_LEAD\n\n**Claim / observation:** '+quote(claim)+'\n\n**Original source:** '+quote(source)+'\n**Source date:** '+quote(date)+'\n\n**Strongest countercase:** '+quote(counter)+'\n\n**Unknowns / falsification:** '+quote(missing)+'\n\n**Requested human review:** '+quote(request)+'\n\n**Next action:** Independently verify original records, jurisdiction and date; preserve competing versions and record a human disposition. No automatic submission occurred.';
    report('challenge','RX evidence challenge / contribution draft',body,fields);
  }));
  function download(ext,content,mime) {
    const blob=new Blob([content],{type:mime}),url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='q-pueblo-'+last.kind+'-report.'+ext;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  $('qt-md').addEventListener('click',()=>{if(last)download('md',last.markdown,'text/markdown;charset=utf-8');});
  $('qt-json').addEventListener('click',()=>{if(last)download('json',JSON.stringify(last,null,2),'application/json;charset=utf-8');});
  $('qt-copy').addEventListener('click',async()=>{if(!last)return;try{await navigator.clipboard.writeText(last.markdown);$('qt-status').textContent='Report copied locally.';}catch(e){$('qt-status').textContent='Copy unavailable. Select the report text and copy manually.';}});
  $('qt-print').addEventListener('click',()=>{if(last)window.print();});
}());