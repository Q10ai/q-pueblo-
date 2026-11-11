// Credentialed Q-Pueblo research review. Approval is not publication.
const h={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const reply=(v,s=200)=>new Response(JSON.stringify(v),{status:s,headers:h});
const esc=s=>String(s||'').trim().replace(/[\u0000-\u001f\u007f]/g,' ');
const urlOK=s=>/^https:\/\/[^\s<>"']+$/i.test(s);
const keyHash=async s=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)));
async function authorized(request,env){
  if(!env?.QP_DB||!env?.QP_REVIEW_TOKEN||env.QP_REVIEW_TOKEN.length<32)return false;
  const header=request.headers.get('Authorization')||'';
  const token=header.startsWith('Bearer ')?header.slice(7):'';
  if(!token || token.length>200)return false;
  const [a,b]=await Promise.all([keyHash(token),keyHash(env.QP_REVIEW_TOKEN)]);
  let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];return diff===0;
}
const transitions={
  unverified_lead:['triage','rejected'],
  triage:['researching','human_review','rejected'],
  researching:['human_review','triage','rejected'],
  human_review:['approved_for_release','researching','rejected'],
  approved_for_release:['researching','rejected'],
  rejected:['triage']
};
export async function onRequestGet({request,env}){
  if(!await authorized(request,env))return reply({error:'UNAUTHORIZED'},401);
  const id=new URL(request.url).searchParams.get('id');
  try{
    if(id){
      const record=await env.QP_DB.prepare('SELECT id,kind,question,public_source_url,state,revision,created_at,updated_at FROM research_cases WHERE id=?').bind(id).first();
      if(!record)return reply({error:'NOT_FOUND'},404);
      const events=await env.QP_DB.prepare('SELECT revision,state,reviewer,reason,verified_source_url,counter_source_url,at FROM research_events WHERE case_id=? ORDER BY revision').bind(id).all();
      return reply({record,events:events.results,automaticPublication:false});
    }
    const recent=await env.QP_DB.prepare('SELECT id,kind,state,revision,created_at,updated_at FROM research_cases ORDER BY created_at DESC LIMIT 50').all();
    return reply({cases:recent.results,automaticPublication:false});
  }catch{return reply({error:'REVIEW_READ_UNAVAILABLE'},503)}
}
export async function onRequestPost({request,env}){
  if(!await authorized(request,env))return reply({error:'UNAUTHORIZED'},401);
  if(Number(request.headers.get('Content-Length')||0)>4096)return reply({error:'TOO_LARGE'},413);
  let body;try{const raw=await request.text();if(raw.length>4096)throw Error();body=JSON.parse(raw)}catch{return reply({error:'INVALID_JSON'},400)}
  const id=esc(body?.id),to=esc(body?.state),reviewer=esc(body?.reviewer).slice(0,90),reason=esc(body?.reason).slice(0,900),source=esc(body?.verifiedSourceUrl).slice(0,700),counter=esc(body?.counterSourceUrl).slice(0,700),version=body?.expectedRevision;
  if(!/^[0-9a-f-]{36}$/i.test(id) || !Number.isInteger(version) || version<0 || reviewer.length<2 || reason.length<12 || (source&&!urlOK(source)) || (counter&&!urlOK(counter)))return reply({error:'REVIEW_VALIDATION_FAILED'},400);
  try{
    const prior=await env.QP_DB.prepare('SELECT state,revision FROM research_cases WHERE id=?').bind(id).first();
    if(!prior)return reply({error:'NOT_FOUND'},404);
    if(prior.revision!==version)return reply({error:'REVISION_CONFLICT',actualRevision:prior.revision},409);
    if(!transitions[prior.state]?.includes(to))return reply({error:'INVALID_TRANSITION',from:prior.state,to},409);
    if(to==='approved_for_release' && (!source || !counter || source===counter || body?.humanCheckedEvidence!==true || body?.humanCheckedCounterevidence!==true))return reply({error:'DUAL_SOURCE_HUMAN_REVIEW_REQUIRED'},422);
    const next=version+1,now=new Date().toISOString();
    const changes=await env.QP_DB.batch([
      env.QP_DB.prepare('UPDATE research_cases SET state=?,revision=?,updated_at=? WHERE id=? AND revision=? AND state=?').bind(to,next,now,id,version,prior.state),
      env.QP_DB.prepare('INSERT INTO research_events(event_id,case_id,revision,state,reviewer,reason,verified_source_url,counter_source_url,at) SELECT ?,?,?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM research_cases WHERE id=? AND revision=? AND state=?)').bind(crypto.randomUUID(),id,next,to,reviewer,reason,source||null,counter||null,now,id,next,to)
    ]);
    if(changes[0]?.meta?.changes!==1 || changes[1]?.meta?.changes!==1)return reply({error:'REVIEW_CONFLICT'},409);
    return reply({id,state:to,revision:next,automaticPublication:false,message:'Human-review record updated. No website or public report was changed.'});
  }catch{return reply({error:'REVIEW_WRITE_UNAVAILABLE'},503)}
}
