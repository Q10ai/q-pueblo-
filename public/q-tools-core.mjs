/** Q-Pueblo public planning instruments. Pure, bounded, no network or model calls.
 *  Financial/energy quantities are user assumptions, never case evidence.
 */
function num(v,{min=0,max=1e9,name='value'}={}){
 if(v===''||v===null||v===undefined)throw new RangeError(name+' is required');
 const n=Number(v);if(!Number.isFinite(n)||n<min||n>max)throw new RangeError(name+' must be between '+min+' and '+max);
 return n;
}
export function computeEE(p){
 const tasks=num(p.tasks,{min:1,max:1e6,name:'Monthly tasks'}),manual=num(p.manual,{max:1e4,name:'Current minutes per task'}),
 automation=num(p.automation,{max:1e4,name:'Tool-operation minutes'}),review=num(p.review,{max:1e4,name:'Human review minutes'}),
 rate=num(p.rate,{max:1e4,name:'Hourly labor-value assumption'}),subscription=num(p.subscription,{max:1e7,name:'Monthly subscription cost'}),
 perTask=num(p.perTask,{max:1e5,name:'Per-task tool cost'});
 const currentHours=tasks*manual/60,proposedHumanHours=tasks*(automation+review)/60,
 currentCost=currentHours*rate,proposedCost=proposedHumanHours*rate+subscription+tasks*perTask;
 let energy=null;
 if(p.wh!==undefined&&p.wh!==null&&String(p.wh).trim()!==''){
  const wh=num(p.wh,{max:1e6,name:'User-supplied Wh per task'});
  const pue=num(p.pue===''||p.pue==null?1:p.pue,{min:1,max:10,name:'Facility PUE'});
  const kwh=tasks*wh*pue/1000;
  const unitPrice=p.kwhPrice===''||p.kwhPrice==null?null:num(p.kwhPrice,{max:100,name:'Electricity price per kWh'});
  energy={kwhEstimate:kwh,monthlyElectricityCost:unitPrice===null?null:kwh*unitPrice,evidence:'USER_SUPPLIED_ASSUMPTION',boundary:'Operational electricity estimate excludes embodied infrastructure and unmeasured network effects.'};
 }
 return {kind:'QP_EE_ESTIMATE',evidence:'USER_ASSUMPTIONS_NOT_FIELD_MEASUREMENTS',tasks,currentHours,proposedHumanHours,timeSavedHours:currentHours-proposedHumanHours,currentCost,proposedCost,costDifference:currentCost-proposedCost,energy};
}
export function computeT2Y(p){
 const truth=num(p.truth,{max:1,name:'Truth support'}),yieldValue=num(p.yieldValue,{max:1,name:'Realized useful yield'}),
 agency=num(p.agency,{max:1,name:'Human agency'}),reversibility=num(p.reversibility,{max:1,name:'Reversibility'}),harm=num(p.harm,{max:1,name:'Harm risk'});
 const score=truth*yieldValue*agency*reversibility*(1-harm);
 // Reference gates from Q10 agent ledger EE_T2Y_SPEC.md v0.1; not an empirical safety certificate.
 const gate=truth<0.80?'HOLD_WEAK_TRUTH':harm>0.20?'HOLD_HARM_THRESHOLD':score<0.35?'HOLD_LOW_T2Y':'REVIEW_CANDIDATE_ONLY';
 return {kind:'QP_T2Y_REFERENCE',score,gate,truth,yieldValue,agency,reversibility,harm,causalClaim:false,authorityGranted:false,evidence:'SIMULATED_NORMALIZED_USER_INPUT'};
}
export function computeMoney(p){
 const proposed=num(p.proposed,{max:1e12,name:'Proposed funding'}),authorized=num(p.authorized,{max:1e12,name:'Authorized funding'}),
 contracted=num(p.contracted,{max:1e12,name:'Contracted amount'}),paid=num(p.paid,{max:1e12,name:'Disbursed cash'}),
 recovered=num(p.recovered,{max:1e12,name:'Recoveries'}),benefit=num(p.benefit,{max:1e12,name:'Measured benefit assumption'});
 const warnings=[];
 if(paid>contracted)warnings.push('Cash paid exceeds this entered contracted amount; check scope, amendments and source dates before drawing conclusions.');
 if(contracted>authorized)warnings.push('Contracted exceeds the entered authorization; reconcile accounting period, fund and approvals.');
 if(recovered>paid)warnings.push('Entered recoveries exceed disbursements; inspect periods and accounting definitions.');
 if(benefit>0)warnings.push('Benefits are entered claims or assumptions unless tied to independent measurement; never net unrelated outcomes into cash expenditures.');
 return {kind:'QP_MONEY_STATES',proposed,authorized,contracted,paid,recovered,benefit,
  netDisbursement:paid-recovered,authorityRemaining:authorized-paid,
  warnings,evidence:'USER_SUPPLIED_UNVERIFIED_NUMBERS',rule:'Do NOT sum proposed + authorized + contracted + paid; they are lifecycle states, not additive costs.'};
}
