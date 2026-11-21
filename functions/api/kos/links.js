import {resolveKOS} from './resolve.js';
const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{
 'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',
 'X-Content-Type-Options':'nosniff'
}});
export async function onRequestGet({request,env}){
 const params=new URL(request.url).searchParams;
 const family=params.get('family'),rawTopic=params.get('topic'),idea=params.get('idea');
 const topic=rawTopic===null?null:Number(rawTopic);
 if(rawTopic!==null&&(!/^\d{1,2}$/.test(rawTopic)||!Number.isInteger(topic)))return reply({error:'Invalid topic'},400);
 if(family&&!/^[a-z0-9-]{2,55}$/.test(family))return reply({error:'Invalid family'},400);
 if(!family&&(!idea||idea.trim().length<3||idea.length>240))return reply({error:'Select a Pueblo subject'},400);
 try{
  const result=await resolveKOS({env,request,familyId:family||null,topicIndex:topic,idea:idea||null});
  return reply({...result,generationStatus:'connected-research-leads-only',paperGenerated:false});
 }catch{return reply({error:'KOS connections could not be resolved from the public research registers'},503)}
}
