"use strict";
(() => {
 const form=document.getElementById("jail-model"), out=document.getElementById("model-out");
 if(!form||!out)return;
 const n=id=>document.getElementById(id).valueAsNumber;
 const dollars=n=>n.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2});
 function calculate(){
  if(!form.checkValidity())return;
  const a=n("admissions"),s=n("stay"),r=n("rate"),c=n("county"),o=n("other"),b=n("staffed"),base=n("baseline");
  if(![a,s,r,c,o].every(Number.isFinite))return;
  const d=a*s, city=d*r, county=d*c, other=a*o, regional=county+other, average=d/365;
  const values=[["Occupied bed-days",d.toLocaleString("en-US")],["Average additional occupied beds",average.toFixed(2)],["City housing payments",dollars(city)],["Other city/court costs",dollars(other)],["City total",dollars(city+other)],["County incremental costs",dollars(county)],["County net after reimbursement",dollars(county-city)],["Combined regional incremental cost",dollars(regional)],["Two-year nominal regional cost",dollars(2*regional)],["Capacity check",Number.isFinite(b)&&Number.isFinite(base)?(base+average>b?"Average modeled demand exceeds entered staffed capacity.":"Average modeled demand fits entered staffed capacity; peaks and classification remain unknown."):"Unknown — enter both staffed beds and baseline occupancy."]];
  const dl=document.createElement("dl");for(const [key,value] of values){const dt=document.createElement("dt"),dd=document.createElement("dd");dt.textContent=key;dd.textContent=value;dl.append(dt,dd)}out.replaceChildren(dl);
 }
 form.addEventListener("submit",e=>{e.preventDefault();calculate()});
 form.addEventListener("reset",()=>queueMicrotask(calculate));calculate();
})();