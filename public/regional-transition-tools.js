'use strict';
(function(root){
const rules={
golfRepayment:({payment=250000})=>({notes:7613306,years:payment>0&&payment<=500000?Math.ceil(7613306/payment):null}),
exactBudget:({loss=1,achievement=100,extra=0})=>({balance:1264763-122666601*loss/100-9811472*(1-achievement/100)-extra}),
budget:({revenueLoss=1,savings=100,extra=0})=>({annual:1.26-122.67*revenueLoss/100-9.81*(1-savings/100)-extra}),
opening:({sale=7,cop=15})=>({balance:.9-(7-sale)-(15-cop)}),
compensation:({official=158669,employee=50000,benefits=25})=>({equivalent:official/employee,officialCost:official*(1+benefits/100),threeCost:3*official*(1+benefits/100),employeeCost:employee*(1+benefits/100)}),
pension:()=>({liability:314240583-169141289,funded:169141289/314240583*100,shortfall:12403537-8188507,discount6:181528875,discount7:145099294,discount8:114433124}),
reuse:({entities=8,hours=20,rate=50,reuse=40,operation=25000,setup=60000})=>{const avoided=entities*hours*12*reuse/100,net=avoided*rate-operation;return {avoided,net,payback:net>0?setup/net:null};}
};
if(typeof module!=='undefined')module.exports=rules;if(!root)return;root.QPRegionalCalculations=rules;
const forms=root.document.querySelectorAll('[data-regional-model]');const us=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});const m=v=>us.format(v*1e6);
const formats={golfRepayment:r=>['Notes principal: '+us.format(r.notes),'Modeled repayment: '+(r.years===null?'No repayment modeled':r.years+' annual payments')],exactBudget:r=>['Modeled annual balance: '+us.format(r.balance)],budget:r=>['Modeled annual balance: '+m(r.annual)],opening:r=>['Modeled 2026 ending budgetary balance: '+m(r.balance)],compensation:r=>['Salary equivalents: '+r.equivalent.toFixed(2),'Official total cost: '+us.format(r.officialCost),'Three officials scenario: '+us.format(r.threeCost),'Comparison employee cost: '+us.format(r.employeeCost)],pension:r=>['Net liability: '+us.format(r.liability),'Fiduciary position / liability: '+r.funded.toFixed(2)+'%','2024 contribution shortfall: '+us.format(r.shortfall),'Published 6%, 7%, 8% discount-rate liabilities: '+[r.discount6,r.discount7,r.discount8].map(v=>us.format(v)).join(' / ')],reuse:r=>['Hours potentially recovered annually: '+Math.round(r.avoided).toLocaleString(),'Modeled annual benefit: '+us.format(r.net),'Simple payback: '+(r.payback===null?'Not achieved':r.payback.toFixed(2)+' years')]};
for(const form of forms){const out=form.querySelector('[data-result]'),key=form.dataset.regionalModel;function update(){if(!form.checkValidity()){out.textContent='Enter values within the stated range.';return;}const vals={};for(const field of form.querySelectorAll('input[type=number]'))vals[field.name]=field.valueAsNumber;if(Object.values(vals).some(v=>!Number.isFinite(v))){out.textContent='Enter valid numbers.';return;}out.replaceChildren(...formats[key](rules[key](vals)).map(v=>{const p=root.document.createElement('p');p.textContent=v;return p;}));}form.addEventListener('input',update);form.addEventListener('submit',e=>{e.preventDefault();update();});form.addEventListener('reset',()=>root.setTimeout(update,0));update();}
})(typeof window!=='undefined'?window:null);
