// Closed by default. This endpoint accepts nothing unless the owner configures reviewed D1 + Turnstile controls.
// No publication, model-training or outbound notification is performed by this handler.
const json=(body,status)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function onRequestPost({request,env}){
 if(env?.QP_CONTRIBUTIONS_ENABLED!=='true'||!env?.QP_D1||!env?.QP_TURNSTILE_SECRET) return json({error:'contributions_disabled',message:'Use the browser-only local observation draft.'},503);
 if((request.headers.get('content-type')||'').split(';')[0].trim()!=='application/json')return json({error:'json_required'},415);
 if(Number(request.headers.get('content-length')||0)>8500)return json({error:'too_large'},413);
 const referer=request.headers.get('origin');const host=new URL(request.url).origin;if(referer&&referer!==host)return json({error:'origin_mismatch'},403);
 let x;try{x=await request.json()}catch{return json({error:'invalid_json'},400)};
 const text=(v,max)=>typeof v==='string'&&v.trim().length>0&&v.trim().length<=max?v.trim():null;
 const statement=text(x.statement,2000),type=text(x.type,40),token=text(x.turnstileToken,2000);
 if(!statement||!token||!['observation','source','correction','perspective','gap'].includes(type)||x.consent!==true)return json({error:'invalid_fields_or_consent'},422);
 const source=x.sourceUrl?text(x.sourceUrl,1500):null;
 if(source){try{let u=new URL(source);if(u.protocol!=='https:'||u.username||u.password)return json({error:'public_https_source_required'},422)}catch{return json({error:'invalid_source_url'},422)}}
 // Text may still contain sensitive information: quarantined and inaccessible from public routes.
 const verify=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.QP_TURNSTILE_SECRET,response:token})}).then(r=>r.json()).catch(()=>({success:false}));
 if(verify.success!==true)return json({error:'anti_spam_check_failed'},403);
 const id=crypto.randomUUID(),ts=new Date().toISOString();try{await env.QP_D1.prepare('INSERT INTO q_observations (id,created_at,kind,statement,issue_id,source_url,status) VALUES (?,?,?,?,?,?,?)').bind(id,ts,type,statement,typeof x.issueId==='string'?x.issueId.slice(0,80):null,source,'quarantined').run();}catch{return json({error:'storage_unavailable'},503)}
 return json({accepted:true,trackingId:id,status:'quarantined_for_human_review',published:false},202)
}
export async function onRequestGet(){return json({error:'method_not_allowed'},405)}
