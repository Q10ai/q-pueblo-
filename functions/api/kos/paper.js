import {resolveKOS} from './resolve.js';
// Optional Cloudflare Pages Function for on-demand contextual papers.
// Default OFF. No configured provider, budget/rate protection, and source-verification
// authority means no generation. The browser is never given server credentials.
const json=(body,status=200)=>new Response(JSON.stringify(body),{
  status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}
});
const active=env=>env?.QP_KOS_ON_DEMAND==='enabled' &&
  env?.QP_KOS_RATE_GUARD==='enforced' &&
  typeof env?.QP_KOS_SERVICE_TOKEN==='string' && env.QP_KOS_SERVICE_TOKEN.length>=20 &&
  typeof env?.QP_KOS_SERVICE_URL==='string' && /^https:\/\//.test(env.QP_KOS_SERVICE_URL) &&
  !/^https:\/\/(?:localhost|127\.|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/i.test(env.QP_KOS_SERVICE_URL);
const validPaper=paper=>{
 if(!paper || typeof paper!=='object' || typeof paper.title!=='string' ||
    paper.title.length<12 || paper.title.length>240 || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(paper.asOf||''))return false;
 if(!Array.isArray(paper.sections)||!Array.isArray(paper.sources)||!Array.isArray(paper.claimEvidence))return false;
 if(paper.sources.length<2 || paper.sources.length>70 || paper.sections.length<1 || paper.sections.length>30)return false;
 const ids=new Set();
 for(const source of paper.sources){
  if(typeof source?.id!=='string'||!/^s[a-z0-9_-]{1,32}$/i.test(source.id) || ids.has(source.id) ||
     typeof source?.title!=='string'||source.title.length<4||source.title.length>250 ||
     typeof source?.url!=='string'||!/^https:\/\//i.test(source.url) ||
     source.url.length>1500 || !/^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt||'')) return false;
  try{const url=new URL(source.url);if(!url.hostname.includes('.')||url.username||url.password)return false;}catch{return false;}
  ids.add(source.id);
 }
 let length=0;
 for(const section of paper.sections){
  if(typeof section?.heading!=='string'||section.heading.length>180||
     !Array.isArray(section.paragraphs)||!section.paragraphs.length||section.paragraphs.length>25)return false;
  for(const paragraph of section.paragraphs){
   if(typeof paragraph?.text!=='string'||paragraph.text.length>4500||
      !Array.isArray(paragraph.sourceIds)||paragraph.sourceIds.length<1||
      !paragraph.sourceIds.every(id=>ids.has(id)))return false;
   length+=paragraph.text.length;
  }
 }
 if(length<1400||length>100000||paper.claimEvidence.length<3||paper.claimEvidence.length>250)return false;
 if(!paper.claimEvidence.every(c=>typeof c?.claim==='string'&&c.claim.length>20&&
  Array.isArray(c.sourceIds)&&c.sourceIds.length>0&&c.sourceIds.every(id=>ids.has(id))))return false;
 // The response is always a private on-demand provisional answer, never publication.
 return true;
};
export function onRequestGet({env}){
 return json({onDemandGeneration:active(env),publicPublishing:false,connectedResearchLinks:true,status:active(env)?'configured-conditional':'not-enabled'});
}
export async function onRequestPost({request,env}){
 if(!active(env))return json({error:'On-demand KOS generation is not enabled or not release-gated.'},503);
 const origin=request.headers.get('Origin');
 if(origin&&origin!==new URL(request.url).origin)return json({error:'Cross-origin request rejected'},403);
 if(request.headers.get('Sec-Fetch-Site')==='cross-site')return json({error:'Cross-site request rejected'},403);
 if(!(request.headers.get('Content-Type')||'').startsWith('application/json'))return json({error:'Expected JSON'},415);
 if(Number(request.headers.get('Content-Length')||0)>1600)return json({error:'Request too large'},413);
 let data;
 try{const input=await request.text();if(input.length>1600)return json({error:'Request too large'},413);data=JSON.parse(input);}
 catch{return json({error:'Invalid JSON'},400);}
 const family=data?.family,topic=data?.topic,idea=data?.idea;
 const scoped=typeof family==='string' && /^[a-z0-9-]{2,55}$/.test(family) &&
  (topic===null||topic===undefined||(Number.isInteger(topic)&&topic>=0&&topic<100));
 const requested=typeof idea==='string' && idea.trim().length>=3 && idea.trim().length<=240;
 if(!scoped&&!requested)return json({error:'Specify a valid subject'},400);
 if(data?.privacyConsent!==true)return json({error:'Consent is required for sending a request to the governed research service'},400);
 let connections;
 try{
  connections=await resolveKOS({env,request,familyId:scoped?family:null,topicIndex:scoped?topic??null:null,idea:requested?idea.trim():null});
 }catch{return json({error:'The public KOS connections could not be resolved. No unsupported paper will be produced.'},503);}
 const payload={
  schema:'qp-kos-on-demand-request-v1',
  task:'source-check-crosswalk-qify-context-paper',
  family:scoped?family:null,topic:scoped?topic??null:null,
  idea:requested?idea.trim():null,
  region:'Pueblo and Southern Colorado',readerLevel:'grade-10',
  requireOriginalSources:true,requireClaimEvidence:true,
  accountingStatesSeparate:true,avoidRecycledReportsAsProof:true,
  publicationAuthority:'human-only',outputStatus:'provisional-user-specific',
  noAutonomousActions:true,noPrivateData:true,
  connectedContext:connections,
  sourceRule:'Existing links are leads, not proof. Independently retrieve and check authoritative source documents; support every material claim with original source IDs. Do not cite a Q Pueblo report as independent evidence.',
  publicationState:'private-provisional-user-response-only'
 };
 let upstream;
 try{
  upstream=await fetch(env.QP_KOS_SERVICE_URL,{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+env.QP_KOS_SERVICE_TOKEN},
    body:JSON.stringify(payload),signal:AbortSignal.timeout(45000)
  });
  if(!upstream.ok)return json({error:'No source-supported paper was returned.'},502);
  const resultText=await upstream.text();
  if(resultText.length>220000)return json({error:'Paper exceeds the safe output limit'},502);
  const result=JSON.parse(resultText);
  if(!validPaper(result.paper))return json({error:'The proposed paper did not meet the evidence and narrative requirements.'},422);
  return json({status:'provisional-user-specific',publicPublished:false,sourceReviewStatus:'service-reported-not-independent-publication-audit',subject:connections.subject,contextReferences:{issues:connections.connectedIssues.length,entities:connections.connectedEntities.length,research:connections.research.length,resources:connections.resources.length,originalSourceLeads:connections.sourceCandidates.length},paper:result.paper});
 } catch {return json({error:'The research service could not complete a source-supported paper.'},503);}
}
