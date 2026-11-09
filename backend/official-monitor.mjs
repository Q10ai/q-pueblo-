/** Q-Pueblo: low-cost, traceable publisher change observer.
 *  No source text is asserted as a meeting, decision, or evidence finding.
 *  Do not place private identifiers, scraped personal data, or raw HTML in public output.
 *  Only publication via reviewed PR is allowed. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
export const normalizeHtml = html => String(html)
 .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,'')
 .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi,'')
 .replace(/<!--[^]*?-->/g,'')
 .replace(/<[^>]+>/g,' ')
 .replace(/&nbsp;|&#160;/gi,' ')
 .replace(/\s+/g,' ')
 .trim().slice(0,350000);
export const fingerprint = html => createHash('sha256').update(normalizeHtml(html),'utf8').digest('hex');
export function validateSource(s){
 if(!s||!/^[a-z0-9-]{3,80}$/.test(s.id))throw Error('Invalid source id');
 const u=new URL(s.url);
 if(u.protocol!=='https:'||u.username||u.password||u.port||u.hostname==='localhost'||u.hostname.endsWith('.local')||!(/(^|\.)pueblo\.us$|(^|\.)pueblocounty\.gov$|^pueblo\.granicus\.com$|^leg\.colorado\.gov$/i.test(u.hostname)))throw Error('Unapproved official source URL: '+u.hostname);
 return u;
}
export async function fetchOfficial(s,fetcher=fetch){
 let target=validateSource(s);
 for(let redirects=0;redirects<4;redirects++){
  const res=await fetcher(target,{method:'GET',redirect:'manual',signal:AbortSignal.timeout(16000),headers:{'User-Agent':'Q-PuebloOfficialSourceObserver/1.0 (public-document-metadata-only)','Accept':'text/html,application/xhtml+xml;q=0.9'}});
  if(res.status>=300&&res.status<400){const loc=res.headers.get('location');if(!loc)throw Error('Redirect missing location');target=new URL(loc,target);validateSource({...s,url:target.toString()});continue}
  if(!res.ok)throw Error('HTTP '+res.status+' for '+s.id);
  const contentType=res.headers.get('content-type')||'';if(!contentType.includes('text/html'))throw Error('Unexpected content type for '+s.id);
  let raw=await res.text();if(raw.length>2000000)throw Error('Oversized publisher page');
  return {sha256:fingerprint(raw),url:target.toString(),size:raw.length};
 }
 throw Error('Too many redirects for '+s.id);
}
export async function checkSources(config,prior={},fetcher=fetch,now=new Date().toISOString()){
 const next={schema:'qp-official-source-state-v1',sources:{...(prior.sources||{})}};
 const signals=[],errors=[];
 for(const s of config.sources){
  try{
   const found=await fetchOfficial(s,fetcher),old=prior.sources?.[s.id];
   if(old?.sha256&&old.sha256!==found.sha256)signals.push({id:s.id+'-'+now.slice(0,10)+'-'+found.sha256.slice(0,12),publisher:s.publisher,title:s.name+' — publisher page changed',status:'REQUIRES_EDITOR_REVIEW',observedAt:now,url:found.url,summary:'Publisher content changed. No specific agenda, decision, vote or outcome is established by this signal.'});
   next.sources[s.id]={sha256:found.sha256,url:found.url,firstObserved:old?.firstObserved||now,lastChanged:!old?.sha256||old.sha256!==found.sha256?now:old.lastChanged||old.firstObserved};
  }catch(e){errors.push({id:s.id,kind:'FETCH_FAILED',at:now,reason:String(e.message).slice(0,140)})}
 }
 return {next,signals,errors,changed:signals.length>0||config.sources.some(s=>!prior.sources?.[s.id]?.sha256)};
}
export async function run(){
 const config=JSON.parse(await readFile(resolve(here,'official-sources.json'),'utf8'));
 const pathState=resolve(here,'state.json'),publicPath=resolve(here,'../public/data/updates.json');
 const prior=await readFile(pathState,'utf8').then(JSON.parse).catch(()=>({sources:{}}));
 const {next,signals,errors,changed}=await checkSources(config,prior);
 if(!changed){console.log(JSON.stringify({changed:false,errors,signals:0}));return}
 await writeFile(pathState,JSON.stringify(next,null,2)+'\n');
 const cur=JSON.parse(await readFile(publicPath,'utf8'));
 if(signals.length){
  const old=cur.signals||[];
  const union=[...signals,...old].filter((s,i,all)=>all.findIndex(x=>x.id===s.id)===i).slice(0,50);
  cur.signals=union;
  cur.lastAutomatedCheck=signals[0].observedAt;
  cur.approvalState='AWAITING_EDITORIAL_REVIEW';
  cur.publicationState='OFFICIAL_PUBLISHER_CHANGE_SIGNALS_NOT_MEETING_FINDINGS';
  await writeFile(publicPath,JSON.stringify(cur,null,2)+'\n');
 }
 console.log(JSON.stringify({changed,signals:signals.length,errors,note:'Commit only to an editorial review PR, not to production main.'}));
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1]))run().catch(e=>{console.error(e);process.exitCode=1});
