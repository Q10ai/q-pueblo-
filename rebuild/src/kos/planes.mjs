// Q Pueblo v2 plane/layer vocabulary. Architecturally aligned with Q10 SUPRA;
// a "possibility" plane is a scenario model, not quantum hardware or a truth claim.
export const PLANES=Object.freeze([
 "physical","biological","human-cognitive","synthetic","economic",
 "social-cultural","information-provenance","security-adversarial",
 "temporal","possibility"
]);
export const LAYERS=Object.freeze([
 "observation","state","interaction","control","assurance","history","recovery"
]);
export const CLAIM_STATES=Object.freeze([
 "VERIFIED_CURRENT","VERIFIED_HISTORICAL","CONTESTED","CONTEXT_ONLY",
 "RECHECK_REQUIRED","REJECTED","SUPERSEDED"
]);
export const PUBLIC="PUBLIC";
export function day(s){return typeof s==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))?s:null;}
export function unique(xs){return [...new Set(xs)];}
export function safeId(id){return typeof id==="string"&&/^qp:(?:subject|entity|role|issue|study|source|claim|edge|event|fund|asset|project|paper|place|memory):[a-zA-Z0-9-]{2,96}$/.test(id);}
export function publicRecord(r){return !!r&&r.visibility==="PUBLIC"&&r.disclosure==="PUBLIC_CONTEXT_ALLOWED"&&r.sensitivity!=="PRIVATE"&&r.sensitivity!=="RESTRICTED";}
export function membership(r){return unique((Array.isArray(r?.planes)?r.planes:[]).filter(x=>PLANES.includes(x)));}
