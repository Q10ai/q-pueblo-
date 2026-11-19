(() => {
"use strict";
const form=document.getElementById("qp-model-check");
const out=document.getElementById("qp-model-review-result");
if(!form||!out)return;
form.addEventListener("submit",event=>{
event.preventDefault();
const mode=document.getElementById("qp-model-use").value;
const checks=Array.from(form.querySelectorAll('input[name="review"]'));
const remaining=checks.filter(x=>!x.checked).length;
const missing=checks.filter(x=>!x.checked).map(x=>x.closest("label").textContent.trim().split(":")[0]);
const risk=mode==="impact"||mode==="pilot";
out.textContent=(remaining?"More evidence needed: "+missing.join(", ")+". ":"All questions marked by you; evidence has not been verified. ")+(risk?"Independent, qualified review is required before any pilot or high-impact use. ":"Use this only for learning and comparing evidence. ")+"This is not a safety rating, compliance finding or authorization.";
});
form.addEventListener("reset",()=>{out.textContent="";});
})();
