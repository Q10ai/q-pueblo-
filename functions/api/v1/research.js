// Candidate-only Cloudflare Pages D1 research intake. Disabled unless explicitly provisioned.
// No automatic investigation, public publication, user profiling or AI execution.
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const json=(v,status=200)=>new Response(JSON.stringify(v),{status,headers});
const ready=env=>env?.QP_INTAKE_ENABLED==='true' && env.QP_DB && env.QP_TURNSTILE_SECRET && env.QP_REVIEW_TOKEN;
const compact=(x,max)=>String(x||'').trim().replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,max);
const urlOK=x=>!x || /^https:\/\/[a-z0-9.-]+(?:\/[^\s<>"']*)?$/i.test(x);
const sha256=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(b=>b.toString(16).padStart(2,'0')).join('');
const token=()=>Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b=>b.toString(16).padStart(2,'0')).join('');
const sameOrigin=request=>{try{return request.headers.get('Origin')===new URL(request.url).origin}catch{return false}};
const likelyPersonal=x=>/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\b\d{3}[-. ]?\d{3}[-. ]?\d{4}\b|\b\d{3}-\d{2}-\d{4}\b/i.test(x);
const receiptKey=r=>r.headers.get('X-QP-Receipt')||'';
const receiptOK=async(r,row)=>{const k=receiptKey(r);if(!/^[0-9a-f]{64}$/.test(k))return false;return (await sha256(k))===row.receipt_sha256};
export async function onRequestPost({request,env}) {
  if(!ready(env))return json({state:'INTAKE_DISABLED',message:'Use the locally prepared research packet or reviewed email pathway.'},503);
  if(!sameOrigin(request))return json({error:'ORIGIN_REJECTED'},403);
  if(!/^application\/json\b/i.test(request.headers.get('Content-Type')||''))return json({error:'JSON_REQUIRED'},415);
  if(Number(request.headers.get('Content-Length')||0)>4096)return json({error:'REQUEST_TOO_LARGE'},413);
  let body;try{const raw=await request.text();if(raw.length>4096)throw Error();body=JSON.parse(raw)}catch{return json({error:'INVALID_JSON'},400)}
  if(!body || typeof body!=='object' || Array.isArray(body))return json({error:'INVALID_JSON'},400);
  const question=compact(body.question,500),kind=compact(body.kind,30),source=compact(body.sourceUrl,700);
  if(question.length<20 || String(body.question||'').length>500 || !['question','correction','public_source'].includes(kind) || !urlOK(source) || body.publicInformationOnly!==true)return json({error:'INVALID_PUBLIC_INTAKE'},400);
  if(likelyPersonal(question))return json({error:'PERSONAL_DETAILS_DETECTED',message:'Do not submit personal details to a public research intake.'},400);
  const challenge=compact(body.turnstileToken,2048);
  if(!challenge)return json({error:'BOT_CHECK_REQUIRED'},403);
  let bot;try{const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({secret:env.QP_TURNSTILE_SECRET,response:challenge})});bot=await r.json()}catch{return json({error:'BOT_CHECK_UNAVAILABLE'},503)}
  if(!bot?.success)return json({error:'BOT_CHECK_FAILED'},403);
  const id=crypto.randomUUID(),receipt=token(),now=new Date().toISOString();
  try{
    await env.QP_DB.batch([
      env.QP_DB.prepare('INSERT INTO research_cases(id,receipt_sha256,kind,question,public_source_url,state,revision,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)').bind(id,await sha256(receipt),kind,question,source||null,'unverified_lead',0,now,now),
      env.QP_DB.prepare('INSERT INTO research_events(event_id,case_id,revision,state,reviewer,reason,at) VALUES (?,?,?,?,?,?,?)').bind(crypto.randomUUID(),id,0,'unverified_lead','system','Public intake; no source verification performed',now)
    ]);
  }catch{return json({error:'INTAKE_UNAVAILABLE'},503)}
  return json({id,receipt,state:'unverified_lead',message:'Received for possible human triage. No investigation or publication promised.'},202);
}
export async function onRequestGet({request,env}) {
  if(!ready(env))return json({state:'INTAKE_DISABLED'},503);
  const id=new URL(request.url).searchParams.get('id')||'';
  if(!/^[0-9a-f-]{36}$/i.test(id))return json({error:'NOT_FOUND'},404);
  try{
    const row=await env.QP_DB.prepare('SELECT receipt_sha256,state,revision,updated_at FROM research_cases WHERE id=?').bind(id).first();
    if(!row || !await receiptOK(request,row))return json({error:'NOT_FOUND'},404);
    return json({id,state:row.state,revision:row.revision,updatedAt:row.updated_at,publication:'NONE_AUTOMATIC'});
  }catch{return json({error:'STATUS_UNAVAILABLE'},503)}
}
export async function onRequestDelete({request,env}) {
  if(!ready(env))return json({state:'INTAKE_DISABLED'},503);
  if(!sameOrigin(request))return json({error:'ORIGIN_REJECTED'},403);
  let body;try{body=await request.json()}catch{return json({error:'INVALID_JSON'},400)}
  const id=body?.id||'';
  if(!/^[0-9a-f-]{36}$/i.test(id))return json({error:'NOT_FOUND'},404);
  try{
    const row=await env.QP_DB.prepare('SELECT receipt_sha256 FROM research_cases WHERE id=?').bind(id).first();
    if(!row || !await receiptOK(request,row))return json({error:'NOT_FOUND'},404);
    await env.QP_DB.batch([
      env.QP_DB.prepare('DELETE FROM research_events WHERE case_id=?').bind(id),
      env.QP_DB.prepare('DELETE FROM research_cases WHERE id=? AND receipt_sha256=?').bind(id,row.receipt_sha256)
    ]);
    return json({state:'WITHDRAWN',message:'Case rows deleted from primary D1. Provider backups may have separate retention.'});
  }catch{return json({error:'WITHDRAWAL_UNAVAILABLE'},503)}
}
