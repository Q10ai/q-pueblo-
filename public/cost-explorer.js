"use strict";
/* All calculations run locally. No APIs, storage, analytics or transfers. */
const MODELS={
 household:{name:"Monthly household expenses",note:"Enter monthly amounts in dollars. The tool estimates your entered monthly total and multiplies by 12; it does not supply current local prices.",fields:[
 ["housing","Housing / rent / mortgage","Monthly housing payment"],
 ["utilities","Utilities and internet","Electricity, gas, water, sewer, internet"],
 ["food","Food and groceries","Groceries plus any other food budget"],
 ["transport","Transportation","Fuel, transit, insurance, maintenance"],
 ["care","Health and care","Medical out-of-pocket and care costs"],
 ["family","Child and family costs","Childcare and education needs"],
 ["debt","Debt payments","Only payments not counted in housing"],
 ["other","Other expenses","Clothing, fees, recreation and incidentals"]
 ]},
 business:{name:"Monthly small-business operating costs",note:"Enter monthly costs in dollars. This is a user-input expense total, not a tax return, profitability estimate or market quote.",fields:[
 ["rent","Rent and property costs","Lease, property service fees"],
 ["payroll","Payroll and staff costs","Gross employer payroll and benefits"],
 ["power","Utilities and energy","Electricity, heating, water and waste"],
 ["insurance","Insurance and licenses","Recurring coverage and permit costs"],
 ["supplies","Inventory and supplies","Regular purchases"],
 ["transport","Logistics and delivery","Fuel, freight, maintenance"],
 ["systems","Software and communications","Recurring digital services"],
 ["taxfees","Taxes and regulatory fees","Use a separately determined figure"],
 ["other","Other fixed / variable costs","Do not double count listed expenses"]
 ]},
 project:{name:"Public-project lifecycle cost scenario",note:"Enter a one-time capital cost, annual operating costs and time horizon. Discounted present value is a model, not an official budget, debt value or public-benefit finding.",fields:[
 ["capital","Upfront capital cost","One-time dollars at year 0"],
 ["annual","Annual operations and maintenance","Same amount each year, in constant dollars"],
 ["years","Operating horizon in years","1 to 50 years",1,50,1],
 ["rate","Annual discount rate (%)","0 to 25% annual discount",0,25,.25],
 ["replacement","One-time future replacement cost","Enter 0 if no replacement modeled"],
 ["replacement_year","Replacement occurs in year","1 to horizon; 0 means no replacement",0,50,1]
 ]}
};
let mode="household",copyText="";
const $=s=>document.querySelector(s),escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
function fieldHtml([id,label,help,min=0,max=1000000000,step=.01]){
 return '<div class="field"><label for="'+id+'">'+escapeHtml(label)+'</label><input id="'+id+'" name="'+id+'" type="number" min="'+min+'" max="'+max+'" step="'+step+'" placeholder="0" inputmode="decimal"><small>'+escapeHtml(help)+'</small></div>'
}
function switchMode(id){
 mode=id;const m=MODELS[mode];
 document.querySelectorAll("[data-mode]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.mode===mode)));
 $("#model-title").textContent=m.name;$("#model-note").textContent=m.note;
 $("#fields").innerHTML=m.fields.map(fieldHtml).join("");
 $("#result-label").textContent="Total modeled cost";$("#result-total").textContent="—";
 $("#breakdown").innerHTML="";$("#result-explanation").textContent="Enter your own values and select Calculate.";
 $("#copyresult").disabled=true;copyText="";
}
const val=(id)=>{let el=$("#"+id),str=el?.value.trim()||"";if(str==="")return null;const n=Number(str);if(!Number.isFinite(n)||n<0)throw Error("Check "+id+": enter a nonnegative number.");return n;};
function run(){
 const m=MODELS[mode],values={};let entered=0;for(const f of m.fields){const v=val(f[0]);values[f[0]]=v??0;if(v!==null)entered++;}
 if(!entered)throw Error("Enter at least one value to calculate.");
 if(mode!=="project"){
  const total=Object.values(values).reduce((a,b)=>a+b,0);
  if(!Number.isFinite(total)||total>1e12)throw Error("Cost exceeds supported range.");
  const rows=m.fields.filter(f=>values[f[0]]!==0).map(f=>[f[1],money(values[f[0]])]);
  const explanation="Your entered amounts total "+money(total)+" per month, or "+money(total*12)+" across 12 identical months. Values are not official local prices and do not include unspecified costs.";
  return {primary:money(total)+"/month",rows:[...rows,["Annualized total",money(total*12)]],explanation,summary:[m.name,explanation,...rows.map(x=>x.join(": "))].join("\n")};
 }
 const capital=values.capital,annual=values.annual,years=values.years,rate=values.rate/100,repl=values.replacement,replYear=values.replacement_year;
 if(!Number.isInteger(years)||years<1||years>50)throw Error("Project horizon must be a whole number from 1 to 50.");
 if(rate<0||rate>.25)throw Error("Discount rate must be between 0% and 25%.");
 if(repl>0&&(!Number.isInteger(replYear)||replYear<1||replYear>years))throw Error("Replacement year must be from 1 through the project horizon.");
 const annuity=rate===0?years:(1-Math.pow(1+rate,-years))/rate;
 const pvOperating=annual*annuity,pvReplacement=repl?repl/Math.pow(1+rate,replYear):0;
 const pv=capital+pvOperating+pvReplacement,nominal=capital+annual*years+repl;
 if(!Number.isFinite(pv)||pv>1e14)throw Error("Cost exceeds supported range.");
 const rows=[["Year-0 capital",money(capital)],["Present value of annual operating costs",money(pvOperating)],["Present value of replacement",money(pvReplacement)],["Undiscounted nominal sum",money(nominal)],["Modeled years",String(years)],["Discount rate",(rate*100).toFixed(2)+"%"]];
 const explanation="Present value = capital + sum of annual operations discounted for "+years+" years + separately discounted one-time replacement. This calculation excludes inflation changes, debt-service schedule, benefits, contingent liabilities and unentered costs.";
 return {primary:money(pv)+" PV",rows,explanation,summary:[m.name,"Present value: "+money(pv),explanation,...rows.map(x=>x.join(": "))].join("\n")};
}
$("#cost-form").addEventListener("submit",e=>{
 e.preventDefault();
 try{const r=run();$("#result-total").textContent=r.primary;$("#result-explanation").textContent=r.explanation;$("#breakdown").innerHTML=r.rows.map(x=>'<div class="break-row"><span>'+escapeHtml(x[0])+'</span><b>'+escapeHtml(x[1])+'</b></div>').join("");copyText=r.summary;$("#copyresult").disabled=false;}catch(err){$("#result-total").textContent="Check inputs";$("#result-explanation").textContent=err.message;$("#breakdown").innerHTML="";$("#copyresult").disabled=true;}
});
$("#copyresult").addEventListener("click",()=>{if(copyText&&navigator.clipboard)navigator.clipboard.writeText(copyText)});
document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>switchMode(b.dataset.mode)));
switchMode(mode);
