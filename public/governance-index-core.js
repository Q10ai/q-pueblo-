'use strict';
(()=> {
 const norm=v=>String(v??'').toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const validUrl=u=>{try{return new URL(String(u)).protocol==='https:'}catch{return false}};
 function build(legacy,graph,reports,cfg){
  const byId=new Map(),topicById=new Map();
  const rMap=new Map(reports.map(r=>[r.slug,r]));
  const entities=[...graph.entities.map(e=>({id:e.id,name:e.name,kind:e.kind,description:e.identity_state,url:e.source_url})),...cfg.additions];
  for(const e of entities){if(byId.has(e.id))throw Error('Duplicate entity '+e.id);byId.set(e.id,{...e,issues:[],reports:[]})}
  for(const i of legacy.issues)topicById.set('legacy:'+i.id,{id:i.id,origin:'Dated issue registry',title:i.title,category:i.category,sourceLinked:!!i.availableSourceUrls.length,links:i.availableSourceUrls,report:rMap.get(cfg.reportMap[i.id]),href:'issues.html#'+encodeURIComponent(i.id)});
  const excluded=new Set(cfg.excludeFromFeatured);
  const eligible=[...topicById.values()].filter(i=>!excluded.has(i.id));
  // Stable source-linked first; original order for ties. This is a browse order, not a risk score.
  const featured=eligible.slice().sort((a,b)=>Number(b.sourceLinked)-Number(a.sourceLinked)).slice(0,cfg.prioritySize);
  const graphIssues=new Map(graph.issues.map(i=>[i.id,i]));
  for(const i of graph.issues)for(const edge of i.edges){const e=byId.get(edge.entity_id);if(!e)throw Error('Unknown entity');e.issues.push({id:i.id,title:i.title,role:edge.role,state:edge.state})}
  for(const [slug,ids] of Object.entries(cfg.reportEntities)){if(!rMap.has(slug))throw Error('Unknown report');for(const id of ids){const e=byId.get(id);if(!e)throw Error('Unknown report entity');e.reports.push(rMap.get(slug))}}
  const edges=cfg.relationships;for(const e of edges){if(!byId.has(e.from)||!byId.has(e.to)||!rMap.has(e.report)||!e.boundary||!e.asOf||!e.sourceIds.length||!e.sourceIds.every(id=>rMap.get(e.report).sources.some(s=>s.id===id)))throw Error('Invalid relationship');}
  const all=[...byId.values()].sort((a,b)=>a.name.localeCompare(b.name));
  function paths(id,direction,max=3){
   if(!byId.has(id)||!['up','down'].includes(direction))return [];
   const out=[];function walk(at,path,seen){if(path.length>=max)return;for(const edge of edges){const next=direction==='down'&&edge.from===at?edge.to:direction==='up'&&edge.to===at?edge.from:null;if(!next||seen.has(next))continue;const p=[...path,edge];out.push({id:next,name:byId.get(next).name,depth:p.length,path:p});walk(next,p,new Set([...seen,next]))}}
   walk(id,[],new Set([id]));return out.sort((a,b)=>a.depth-b.depth||a.name.localeCompare(b.name));
  }
  function associations(id){
   const e=byId.get(id);if(!e)return [];
   const linked=new Map();for(const i of e.issues){for(const edge of graphIssues.get(i.id)?.edges||[]){if(edge.entity_id===id)continue;if(!linked.has(edge.entity_id))linked.set(edge.entity_id,[]);linked.get(edge.entity_id).push(i.title)}}
   return [...linked].map(([k,v])=>({id:k,name:byId.get(k).name,via:[...new Set(v)]})).sort((a,b)=>a.name.localeCompare(b.name))
  }
  return {entities:all,featured,allTopics:[...topicById.values()],graphIssues:graph.issues,paths,associations,reportBySlug:rMap};
 }
 function freshness(record,now=new Date()){
  const observed=Date.parse(record.observedAt),until=Date.parse(record.recheckBy);
  if(!record.observedAt||!record.recheckBy||!Number.isFinite(observed)||!Number.isFinite(until)||until<=observed||observed>+now)return 'INVALID_OR_UNVERIFIED';
  return +now>=until?'RECHECK_DUE':'WITHIN_REVIEW_WINDOW';
 }
 const api={norm,validUrl,build,freshness};if(typeof window!=='undefined')window.QPGovernance=api;if(typeof module!=='undefined')module.exports=api;
})();
