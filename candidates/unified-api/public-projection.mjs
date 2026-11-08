/** Q-Pueblo review-gated, read-only projection. CONTROLLED CANDIDATE.
 * No Cloudflare binding, database connection, or production authority is created here.
 */
const CLASSES = new Set(['S0']);
const STAGES = new Set(['REQUESTED','PROPOSED','VOTER_AUTHORIZED','APPROPRIATED','CONTRACTED','OBLIGATED','INVOICED','PAID','RECOVERED','MEASURED_OUTCOME']);
const idOK = id => typeof id === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(id);
const iso = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)?$/.test(v) && !Number.isNaN(Date.parse(v));
const epoch = v => Date.parse(v);
const isoDay = v => v?.slice(0,10);
export function timing(record, asOf, knownAt) {
  if (!iso(asOf) || !iso(knownAt)) return false;
  const valid = record.valid_from || '1900-01-01';
  const end = record.valid_to;
  const observed = record.recorded_at || record.observed_at || valid;
  return iso(valid) && (!end || iso(end)) && iso(observed) &&
    epoch(valid) <= epoch(asOf) && (!end || epoch(end) > epoch(asOf)) &&
    epoch(observed) <= epoch(knownAt);
}
export function safePublic(record, now, {allowSynthetic=false}={}) {
  if (!record || typeof record !== 'object' || !CLASSES.has(record.security_class)) return false;
  const a = record.approval;
  if (!a || a.state !== 'APPROVED_PUBLIC' || !a.by || !iso(a.at) || !iso(a.expires_at) || !iso(now)) return false;
  if (epoch(a.at) > epoch(now) || epoch(a.expires_at) <= epoch(now)) return false;
  if (record.synthetic === true && !allowSynthetic) return false;
  if (record.review_state !== 'REVIEWED') return false;
  if (record.sensitive_person || record.precise_private_location || record.restricted_assertion) return false;
  const cis = record.child_impact;
  if (!cis || cis.status !== 'REVIEWED' || !cis.reviewed_by || !['past','present','future'].every(k =>
    typeof cis[k] === 'string' && cis[k].trim().length >= 8)) return false;
  return true;
}
const publicSource = (source, now, opts) => safePublic(source,now,opts) &&
  typeof source.sha256 === 'string' && /^[a-f0-9]{64}$/i.test(source.sha256) &&
  source.license_review === 'APPROVED';
const redactSource = s => ({id:s.id,title:s.title,kind:s.kind,publisher:s.publisher,url:s.url,as_of:s.valid_from,sha256:s.sha256});
const visibleEntity = (e,now,opts) => safePublic(e,now,opts) && ['ORGANIZATION','PROJECT','ISSUE','PUBLIC_FACILITY'].includes(e.type);
const provenanceOk = (rec,bySource) => Array.isArray(rec.source_ids) && rec.source_ids.length > 0 && rec.source_ids.every(id=>bySource.has(id));
export function createProjection(data,{now='2026-11-08',allowSynthetic=false}={}) {
  if (!iso(now)) throw new Error('invalid clock');
  const take=k => Array.isArray(data[k]) ? data[k] : [];
  const sources=take('sources').filter(x=>publicSource(x,now,{allowSynthetic}));
  const src=new Map(sources.map(x=>[x.id,x]));
  const entities=take('entities').filter(x=>visibleEntity(x,now,{allowSynthetic}) && provenanceOk(x,src));
  const ent=new Map(entities.map(x=>[x.id,x]));
  const issues=take('issues').filter(x=>safePublic(x,now,{allowSynthetic})&&provenanceOk(x,src));
  const iss=new Map(issues.map(x=>[x.id,x]));
  const links=take('edges').filter(x=>safePublic(x,now,{allowSynthetic})&&provenanceOk(x,src)&&ent.has(x.from_id)&&ent.has(x.to_id));
  const wiki=take('wiki').filter(x=>safePublic(x,now,{allowSynthetic})&&provenanceOk(x,src));
  const money=take('money').filter(x=>safePublic(x,now,{allowSynthetic})&&provenanceOk(x,src)&&STAGES.has(x.stage)&&iss.has(x.issue_id));
  const features=take('features').filter(x=>safePublic(x,now,{allowSynthetic})&&provenanceOk(x,src)&&x.precision==='AGGREGATED'&&!x.geometry&&!x.coordinates);
  const scenarios=take('scenarios').filter(x=>safePublic(x,now,{allowSynthetic})&&provenanceOk(x,src)&&x.mode==='HYPOTHETICAL'&&x.real_world_outcome===false);
  const history=take('events').filter(x=>safePublic(x,now,{allowSynthetic})&&provenanceOk(x,src));
  const pov=take('perspectives').filter(x=>safePublic(x,now,{allowSynthetic})&&provenanceOk(x,src)&&x.kind==='ILLUSTRATIVE_ANALYTICAL_LENS');
  const clean=x=>JSON.parse(JSON.stringify(x));
  const inTime=(x,asOf,knownAt)=>timing(x,asOf,knownAt);
  return Object.freeze({
    searchWiki(q,asOf=now,knownAt=now){
      if(typeof q!=='string'||q.length>80)return [];
      const needle=q.trim().toLocaleLowerCase('en-US');if(needle.length<2)return [];
      return wiki.filter(x=>inTime(x,asOf,knownAt)&&(`${x.title} ${x.summary}`).toLocaleLowerCase('en-US').includes(needle))
        .slice(0,20).map(x=>({id:x.id,title:x.title,summary:x.summary,source_ids:x.source_ids,as_of:x.valid_from,classification:'PUBLIC_REVIEWED'}));
    },
    wikiPage(slug,asOf=now,knownAt=now){
      if(!idOK(slug))return null;
      const x=wiki.find(v=>v.slug===slug&&inTime(v,asOf,knownAt));
      return x?clean({id:x.id,slug:x.slug,title:x.title,summary:x.summary,source_ids:x.source_ids,as_of:x.valid_from,limitations:x.limitations}):null;
    },
    visor(root,depth=1,asOf=now,knownAt=now){
      if(!idOK(root)||!ent.has(root)||!Number.isInteger(depth)||depth<1||depth>2)return null;
      const seen=new Set([root]);let frontier=new Set([root]),used=[];
      for(let i=0;i<depth;i++){
        const next=new Set();
        for(const x of links){if(!inTime(x,asOf,knownAt)||!frontier.has(x.from_id))continue;
          used.push({id:x.id,from:x.from_id,to:x.to_id,type:x.relation,source_ids:x.source_ids,association_is_not_wrongdoing:true});
          next.add(x.to_id);seen.add(x.to_id);
        }frontier=next;
      }
      return {root,as_of:asOf,known_at:knownAt,depth,nodes:[...seen].map(id=>({id,name:ent.get(id).name,type:ent.get(id).type})),edges:used};
    },
    moneyTrace(issueId,stage=null,asOf=now,knownAt=now){
      if(!idOK(issueId)||!iss.has(issueId)||(stage&&!STAGES.has(stage)))return [];
      return money.filter(x=>x.issue_id===issueId&&(!stage||x.stage===stage)&&inTime(x,asOf,knownAt))
       .map(x=>({id:x.id,stage:x.stage,amount:x.amount,currency:x.currency,period:x.period,source_ids:x.source_ids,no_double_count_group:x.no_double_count_group,note:'Stages must not be summed together'}));
    },
    shadow(layer,asOf=now,knownAt=now){
      return features.filter(x=>(!layer||x.layer===layer)&&inTime(x,asOf,knownAt))
       .map(x=>({id:x.id,name:x.name,layer:x.layer,area_label:x.area_label,precision:'AGGREGATED',as_of:asOf,source_ids:x.source_ids}));
    },
    scenario(id,asOf=now,knownAt=now){
      if(!idOK(id))return null;
      const x=scenarios.find(s=>s.id===id&&inTime(s,asOf,knownAt));
      return x?{id:x.id,title:x.title,mode:x.mode,assumptions:x.assumptions,branches:x.branches,outcome_class:'SIMULATED_NOT_OBSERVED',probability:'NOT_ESTIMATED',child_impact:x.child_impact,source_ids:x.source_ids}:null;
    },
    compare(issueId,asOf=now,knownAt=now){
      if(!idOK(issueId)||!iss.has(issueId))return [];
      return pov.filter(x=>x.issue_id===issueId&&inTime(x,asOf,knownAt))
       .map(x=>({id:x.id,lens:x.lens,priority:x.priority,possible_benefit:x.possible_benefit,possible_burden:x.possible_burden,question:x.question,kind:'ILLUSTRATIVE_ANALYTICAL_LENS'}));
    },
    timeline(subject,asOf=now,knownAt=now){
      if(!idOK(subject))return [];
      return history.filter(x=>x.subject_id===subject&&inTime(x,asOf,knownAt))
       .sort((a,b)=>a.valid_from.localeCompare(b.valid_from)).map(x=>({id:x.id,date:x.valid_from,recorded_at:x.recorded_at,kind:x.kind,summary:x.summary,supersedes:x.supersedes||null,source_ids:x.source_ids}));
    },
    source(id){const x=src.get(id);return x?redactSource(x):null;},
    stats(){return {public_sources:sources.length,public_entities:entities.length,public_issues:issues.length,public_wiki:wiki.length,public_edges:links.length,public_money:money.length,public_scenarios:scenarios.length};}
  });
}
export function routeRequest(projection, pathname, query={}) {
  if(typeof pathname!=='string'||pathname.length>180)return {status:400,body:{error:'INVALID_REQUEST'}};
  const [p,idOrMore] = [pathname,pathname.split('/').filter(Boolean)];
  const asOf=query.as_of,knownAt=query.known_at;
  if((asOf&&!iso(asOf))||(knownAt&&!iso(knownAt)))return {status:400,body:{error:'INVALID_DATE'}};
  let body;
  if(p==='/api/v1/wiki/search')body=projection.searchWiki(query.q||'',asOf,knownAt);
  else if(p.startsWith('/api/v1/wiki/pages/'))body=projection.wikiPage(idOrMore[4],asOf,knownAt);
  else if(p==='/api/v1/visor/graph')body=projection.visor(query.root,Number(query.depth||1),asOf,knownAt);
  else if(p==='/api/v1/shadow/features')body=projection.shadow(query.layer,asOf,knownAt);
  else if(p==='/api/v1/money/traces')body=projection.moneyTrace(query.issue,query.stage||null,asOf,knownAt);
  else if(p.startsWith('/api/v1/scenarios/'))body=projection.scenario(idOrMore[3],asOf,knownAt);
  else if(p.startsWith('/api/v1/sources/'))body=projection.source(idOrMore[3]);
  else if(p==='/api/v1/perspectives/compare')body=projection.compare(query.issue,asOf,knownAt);
  else if(p==='/api/v1/history/timeline')body=projection.timeline(query.subject,asOf,knownAt);
  else return {status:404,body:{error:'NOT_FOUND'}};
  return {status:body===null?404:200,body:body===null?{error:'NOT_FOUND'}:body};
}
