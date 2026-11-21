// KOS connections resolve existing *public* Pueblo registries into research leads.
// Edges and links are discovery context, not original-source verification or claims.
const paths=Object.freeze({
 families:'data/qp-subject-families-2026-11-21.json',
 mapping:'data/qp-kos-resource-links-2026-11-21.json',
 priority:'data/qp-priority-navigation-2026-11-19.json',
 graph:'data/qp-three-hop-2026-11-13.json',
 living:'data/qp-living-research-discovery-2026-11-19.json',
 reports:'data/qp-current-reports.json',
 site:'data/qp-site-inventory.json',
 historical:'data/q-pueblo-issue-index-2026-11-09.json',
 identity:'data/qp-issue-identity-crosswalk-2026-11-19.json',
 shock:'data/qp-kos-shock-lens-2026-11-21.json',
 depth:'data/qp-kos-depth-profiles-2026-11-21.json'
});
const load=async(env,request,path)=>{
 if(!env?.ASSETS?.fetch)throw new Error('Static research asset service unavailable');
 const url=new URL('/'+path,new URL(request.url).origin);
 const res=await env.ASSETS.fetch(new Request(url.toString(),{method:'GET'}));
 if(!res.ok)throw new Error('Required public registry missing: '+path);
 return res.json();
};
const tokens=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu,' ').split(' ').filter(w=>w.length>3&&!['pueblo','county','colorado','issues','history','people','regional','public','about','their','from','with','what','local','city','current'].includes(w));
const score=(s,term)=>{const x=String(s||'').toLowerCase();return tokens(term).reduce((n,t)=>n+(x.includes(t)?1:0),0);};
const sourceDay=x=>{const v=x.sourceChecked||x.checked||x.date||'';return /^\d{4}-\d{2}-\d{2}$/.test(v)?v:'';};
const ranked=(arr,term,max)=>arr.map((x,i)=>({
 ...x,_score:term?score([x.title,x.name,x.keywords,x.category,x.description].join(' '),term):0,
 _date:sourceDay(x),_order:i
})).sort((a,b)=>b._score-a._score||b._date.localeCompare(a._date)||a._order-b._order)
 .slice(0,max).map(({_score,_date,_order,...row})=>row);
const urlOK=s=>{try{const u=new URL(s);return u.protocol==='https:'&&!u.username&&!u.password&&u.hostname.includes('.')&&u.href.length<1600}catch{return false}};
export async function resolveKOS({env,request,familyId,topicIndex=null,idea=null}){
 const [families,mapping,priority,graph,living,reports,site,historical,identity,shock,depth]=await Promise.all(
  Object.values(paths).map(path=>load(env,request,path))
 );
 if(families.schema!=='qp-subject-families-v1'||mapping.schema!=='qp-kos-resource-links-v1')throw new Error('KOS registry version mismatch');
 const family=familyId?families.families.find(f=>f.id===familyId):null;
 if(familyId&&!family)throw new Error('Unknown subject family');
 if(topicIndex!==null && (!family||!Number.isInteger(topicIndex)||topicIndex<0||topicIndex>=family.topics.length))throw new Error('Unknown subtopic');
 if(!family && (!idea||typeof idea!=='string'||idea.length<3||idea.length>240))throw new Error('Subject required');
 const title=family?(topicIndex===null?family.title:family.topics[topicIndex]):idea.trim();
 const matchPhrase=topicIndex!==null?title:(!family?title:'');
 const groups=family?mapping.familyMapping[family.id]?.groups||[]:[];
 const tags=family?mapping.familyMapping[family.id]?.tags||[]:[];
 const priorityGroups=priority.groups.filter(g=>groups.includes(g.id));
 // An issue or organization association can be historical or unresolved.
 // Never upgrade it to independently established institutional authority.
 const issueIds=new Set(priorityGroups.flatMap(g=>g.primaryIssueIds||[]));
 const entityIds=new Set(priorityGroups.flatMap(g=>g.entityIds||[]));
 const validReports=new Set(priorityGroups.flatMap(g=>g.routes||[]).filter(r=>/^report-[a-z0-9-]+\.html$/i.test(r)));
 const connectedIssues=ranked(graph.issues.filter(r=>issueIds.has(r.id)||(!family&&score(r.title,title)>=2)).map(r=>({
  id:r.id,title:r.title,category:r.category,date:r.source_date||null,
  sourceUrl:urlOK(r.source_url)?r.source_url:null,
  claimState:r.state||'historical-association-not-verified',
  entityIds:(r.edges||[]).map(e=>e.entity_id)
 })),matchPhrase,topicIndex===null?16:12);
 const seenEntities=new Set([...entityIds,...connectedIssues.flatMap(r=>r.entityIds)]);
 const connectedEntities=ranked(graph.entities.filter(r=>seenEntities.has(r.id)||(!family&&score(r.name,title)>=2)).map(r=>({
  id:r.id,name:r.name,kind:r.kind,identityState:r.identity_state,
  sourceUrl:urlOK(r.source_url)?r.source_url:null
 })),matchPhrase,12);
 const research=ranked(living.rows.filter(r=>groups.includes(r.group)||(!family&&score([r.title,r.keywords].join(' '),title)>=2)).map(r=>({
  id:r.id,title:r.title,route:r.route,group:r.group,keywords:r.keywords,
  edition:r.edition,review:r.review,status:r.status
 })),matchPhrase,12);
 const canonical=ranked(reports.reports.filter(r=>validReports.has('report-'+r.slug+'.html')||
  (!family&&score([r.title,r.summary,...(r.aliases||[])].join(' '),title)>=2)).map(r=>({
   id:r.id,title:r.title,route:'report-'+r.slug+'.html',
   sourceChecked:r.sourceChecked,reviewDue:r.reviewDue,
   status:r.stage,sourceLeads:(r.sources||[]).filter(s=>urlOK(s.url)).slice(0,6).map(s=>({
    title:s.title,url:s.url,checked:s.checked,scope:s.scope||null
   }))
 })),matchPhrase,8);
 const resources=ranked(mapping.resources.filter(r=>tags.some(t=>r.tags.includes(t))||
  (!family&&score([r.title,r.description,...r.tags].join(' '),title)>=2)).map(r=>({
  id:r.id,title:r.title,publisher:r.publisher,role:r.role,format:r.format,
  url:urlOK(r.url)?r.url:null,checked:r.checked,reviewBy:r.reviewBy,
  rights:r.rights,description:r.description
 })).filter(r=>r.url),matchPhrase,20);
 const editorial=family?(family.links||[]).filter(s=>/^(?:[a-z0-9-]+\/)*[a-z0-9-]+\.html(?:#[a-z0-9-]+)?$/i.test(s)).slice(0,9):[];
 // Keep the legacy issue index separate; matching titles are not resolved identity proof.
 const relatedGraphIds=new Set(connectedIssues.map(r=>r.id));
 const historicalCrosswalk=identity.rows.filter(r=>r.graphId&&relatedGraphIds.has(r.graphId)&&r.historicalId)
  .slice(0,28).map(r=>({historicalId:r.historicalId,graphId:r.graphId,state:r.state,
   identityStatus:'candidate-not-verified'}));
 const histIds=new Set(historicalCrosswalk.map(r=>r.historicalId));
 const historicalIssues=ranked(historical.issues.filter(r=>histIds.has(r.id)||
  (!family&&score(r.title,title)>=2)).map(r=>({
   id:r.id,title:r.title,domain:r.domain,category:r.category,
   lastReviewed:r.lastReviewed,status:r.status,
   sourceUrls:(r.availableSourceUrls||[]).filter(urlOK).slice(0,3)
  })),matchPhrase,16);
 const editorialRoutes=new Set(editorial.map(r=>r.split('#')[0]));
 const siteRoutes=ranked(site.rows.filter(r=>r.route!=='404.html' &&
  (groups.includes(r.group)||editorialRoutes.has(r.route)||
  (!family&&score(r.title,title)>=2))).map(r=>({
   route:r.route,title:r.title,group:r.group,
   canonicalId:r.canonicalId||null,livingId:r.livingId||null,
   type:'published-route-link-not-evidence'
  })),matchPhrase,18);
 const subjectRiskIds=family?shock.familyEventPriorities[family.id]||[]:[];
 const impactLens={
   scope:'sitewide-subject-impact-analysis',
   frameworkVersion:shock.schema,
   status:'PLANNING_SCENARIO',
   activeIncident:false,
   sourceStatus:'unverified-planning-possibilities-not-current-alerts',
   rule:shock.recognitionRules.notEveryChangeIsShock,
   relevantDisruptions:shock.eventTypes.filter(e=>subjectRiskIds.includes(e.id))
     .slice(0,5).map(e=>({id:e.id,title:e.title,mechanism:e.mechanism})),
   dimensions:shock.recognitionRules.humanImpactDimensions,
   requiredNextStep:'Before any active-impact claim, establish original source, current date, area, affected people, responsible authority and what actually failed.'
 };
 // Research depth scales to actual source-backed institutional complexity.
 // Registry associations are candidates and must not establish an institution's legal identity.
 const normalized=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const exactEntity=connectedEntities.find(e=>normalized(e.name)===normalized(title));
 const focusIsEntity=!!exactEntity || (!family &&
  /\b(department|school district|university|hospital|medical center|energy company|utility|county government|city government|authority|commission|corporation|inc|llc)\b/i.test(title));
 const researchMode=focusIsEntity?'institutional-full-context':
  (family&&topicIndex===null?'multi-entity-system':'everyday-subject');
 const depthPlan={
  standard:depth.schema,
  audience:depth.reader.target,
  primaryOutput:depth.reader.defaultProduct,
  mode:researchMode,
  institutionIdentity:exactEntity?{id:exactEntity.id,name:exactEntity.name,
   status:exactEntity.identityState||'candidate-not-verified'}:null,
  contextDimensions:depth.research.entityDimensions,
  sourceRule:depth.research.depthPolicy,
  presentationRule:'Explain the full supported story in plain language. Include deep institutional records only when their documented evidence is material; never create empty headings or invent relationships.',
  completenessBoundary:'The link registry is not enough to certify completion; source-check original records, chronology, authority, finances and downstream effects.'
 };
 const sourceCandidates=[];
 const add=(kind,title,url,checkedAt=null,sourceStatus='discovery-lead')=>{
  if(!urlOK(url)||sourceCandidates.some(c=>c.url===url)||sourceCandidates.length>=45)return;
  sourceCandidates.push({kind,title,url,checkedAt,sourceStatus});
 };
 for(const r of canonical)for(const s of r.sourceLeads)add('report-original-source',s.title,s.url,s.checked,'attributed-in-dated-report-not-rechecked');
 for(const i of connectedIssues)add('issue-public-record',i.title,i.sourceUrl,i.date,'historical-registry-association');
 for(const e of connectedEntities)add('entity-public-record',e.name,e.sourceUrl,null,'entity-identity-not-verified');
 for(const r of resources)add('external-resource',r.title,r.url,r.checked,'catalogued-link-content-not-verified');
 for(const r of historicalIssues)for(const url of r.sourceUrls)add('historical-issue-source',r.title,url,r.lastReviewed,'historical-index-link-not-rechecked');
 return {
  schema:'qp-kos-resolved-context-v1',subject:title,
  family:family?{id:family.id,title:family.title,coverage:family.coverage}:null,
  subtopic:family&&topicIndex!==null?{index:topicIndex,title}:null,
  matchMethod:matchPhrase?'topic-keyword-ranking-among-catalogue-links':'editorial-family-crosswalk',
  evidenceBoundary:'Connections are research leads only. Content, timing, attribution, jurisdiction and causal edges must be checked against original records before supporting a claim. No autonomous authority.',
  asOf:{families:families.asOf,mapping:mapping.asOf,living:living.asOf,priority:priority.asOf},
  connectedIssues,connectedEntities,canonical,research,resources,editorial,
  historicalIssues,historicalCrosswalk,siteRoutes,impactLens,depthPlan,
  sourceCandidates
 };
}
