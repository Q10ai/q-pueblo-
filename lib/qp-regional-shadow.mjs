// Regional twin/evidence-shadow reference engine.
// Pure functions; no network, no personal data ingestion, no authorization, no publication.
// Intended for a controlled, human-reviewed extension of the Q-Pueblo evidence registry.
const date = (s,label)=>{
  if(typeof s!=='string'||! /^\d{4}-\d\d-\d\d$/.test(s)||Number.isNaN(Date.parse(s+'T00:00:00Z')))throw new Error(label+': ISO date required');
  return s;
};
const key = (s,label)=>{
  if(typeof s!=='string'||! /^[\w.:-]{2,120}$/.test(s))throw new Error(label+': nonblank identifier required');
  return s;
};
const allUnique=(rows,label)=>{
  const ids=rows.map(x=>key(x.id,label));
  if(new Set(ids).size!==ids.length)throw new Error(label+': duplicate ID');
};
const safePublicValue=v=>{
  if(typeof v==='string'&&v.length>4000)throw new Error('Claim value too long for evidence display');
  if(typeof v==='number'&&!Number.isFinite(v))throw new Error('Invalid numeric value');
  if(typeof v==='object'&&v!==null)throw new Error('Structured private objects not accepted as claim values');
  return v;
};
export const CLASSES=Object.freeze(['OFFICIAL','INDEPENDENT','AFFECTED_PARTY','RESPONSE','OTHER_ATTRIBUTED']);
export const STATES=Object.freeze(['REPORTED','PARTIALLY_CORROBORATED','DOCUMENTED','DISPUTED','SUPERSEDED','WITHDRAWN','UNKNOWN']);
export const EVENTS=Object.freeze(['PROPOSAL','AUTHORIZATION','OBLIGATION','CONTRACT','PAYMENT','IMPLEMENTATION','OBSERVED_OUTCOME','RESPONSE','CORRECTION']);
export function resolveGeographyAt(geographies,geoId,at){
  const time=date(at,'Query date'), id=key(geoId,'Geography ID');
  const versions=geographies.filter(g=>g.id===id&&date(g.valid_from,'Geometry valid_from')<=time&&(!g.valid_to||date(g.valid_to,'Geometry valid_to')>time));
  if(versions.length>1)throw new Error('Overlapping geography versions: cannot silently select');
  if(!versions.length)return {state:'GEOMETRY_UNAVAILABLE_FOR_DATE',geography_id:id,valid_at:time};
  const item=versions[0];
  if(!item.boundary_version||!item.source_id||!item.crs||!item.geometry_uri)throw new Error('Incomplete geography provenance');
  return {state:'SOURCE_LINKED_GEOMETRY_REFERENCE',geography_id:id,valid_at:time,boundary_version:item.boundary_version,source_id:item.source_id,crs:item.crs,geometry_uri:item.geometry_uri,validated:false};
}
export function shadowSnapshot({claims=[],events=[],asOf,sourceIds=[]}){
  const time=date(asOf,'Snapshot date');
  allUnique(claims,'claim');allUnique(events,'event');
  const sources=new Set(sourceIds);
  const checkSourceRefs=(row,label)=>{
    if(!Array.isArray(row.source_ids)||row.source_ids.length<1)throw new Error(label+': source reference required');
    for(const s of row.source_ids)if(!sources.has(s))throw new Error(label+': missing source '+s);
  };
  const includedClaims=[];
  for(const c of claims){
    key(c.subject_id,'Claim subject');key(c.predicate,'Claim predicate');
    date(c.valid_at,'Claim valid_at');date(c.observed_at,'Claim observed_at');
    if(!CLASSES.includes(c.account_class)||!STATES.includes(c.state))throw new Error('Unsupported attributed account or claim state');
    checkSourceRefs(c,'claim');
    safePublicValue(c.value);
    if(c.valid_at<=time&&c.observed_at<=time)includedClaims.push({...c});
  }
  const includedEvents=[];
  for(const e of events){
    key(e.actor_id,'Event actor');key(e.project_id,'Event project');
    date(e.event_at,'Event event_at');date(e.observed_at,'Event observed_at');
    if(!EVENTS.includes(e.type))throw new Error('Unsupported event type');
    checkSourceRefs(e,'event');
    if(e.amount_cents!==undefined&&!Number.isSafeInteger(e.amount_cents))throw new Error('Event amount must be integer minor units');
    if(e.event_at<=time&&e.observed_at<=time)includedEvents.push({...e});
  }
  // Preserve historical source versions; supersession is a visible lineage, not deletion.
  const superseded=new Set(includedClaims.filter(x=>x.supersedes_id).map(x=>x.supersedes_id));
  const visibleClaims=includedClaims.map(c=>({...c,revision_note:superseded.has(c.id)?'SUPERSEDED_BY_LATER_OBSERVED_CLAIM':''}));
  const contradictions=[];
  const groups=new Map();
  for(const claim of visibleClaims){
    const group=[claim.subject_id,claim.predicate,claim.valid_at,claim.geography_id||''].join('|');
    const g=groups.get(group)||[];g.push(claim);groups.set(group,g);
  }
  for(const [comparison_key,g] of groups){
    if(g.length<2)continue;
    const active=g.filter(x=>!superseded.has(x.id)&&x.state!=='WITHDRAWN');
    const distinct=new Set(active.map(x=>JSON.stringify(x.value)));
    if(distinct.size>1)contradictions.push({
      comparison_key,
      state:'COMPETING_ATTRIBUTED_CLAIMS_NO_AUTOMATIC_VERDICT',
      claim_ids:active.map(x=>x.id).sort()
    });
  }
  return {
    schema:'qp-shadow-snapshot-v1',
    as_of:time,
    publication_state:'CONTROLLED_DRAFT_NOT_APPROVED',
    sources_count:sources.size,
    claims:visibleClaims.sort((a,b)=>a.id.localeCompare(b.id)),
    events:includedEvents.sort((a,b)=>(a.event_at+'|'+a.id).localeCompare(b.event_at+'|'+b.id)),
    contradictions:contradictions.sort((a,b)=>a.comparison_key.localeCompare(b.comparison_key)),
    caveat:'Snapshot is an evidence reconstruction of source-attributed records, not proof of causation, fault, payment completion or legal interpretation.'
  };
}
export function qifyIssueFromSnapshot({packet_id,issue_id,title,asOf,snapshot,open_questions=[],prior_version_id=null,review_due_at=null}){
  key(packet_id,'Packet ID');key(issue_id,'Issue ID');
  const time=date(asOf,'As-of');
  if(snapshot?.publication_state!=='CONTROLLED_DRAFT_NOT_APPROVED'||snapshot.as_of!==time)throw new Error('Unreviewed or mismatched shadow snapshot');
  if(!Array.isArray(open_questions))throw new Error('Open questions array required');
  if(review_due_at)date(review_due_at,'review due');
  const expired=Boolean(review_due_at&&review_due_at<time);
  return {
    schema:'qp-qified-controlled-packet-v1',
    packet_id,issue_id,title:String(title||''),as_of:time,
    previous_version_id:prior_version_id,
    status:expired?'EXPIRED_REVIEW_TTL':'ACTIVE_RESEARCH_DRAFT',
    release_approved:false,
    public_publish_allowed:false,
    linked_claim_ids:snapshot.claims.map(c=>c.id),
    linked_event_ids:snapshot.events.map(e=>e.id),
    competing_claim_groups:snapshot.contradictions,
    official_attributed_claim_ids:snapshot.claims.filter(c=>c.account_class==='OFFICIAL').map(c=>c.id),
    independent_attributed_claim_ids:snapshot.claims.filter(c=>c.account_class==='INDEPENDENT').map(c=>c.id),
    unresolved_questions:open_questions.map(x=>String(x)),
    review_due_at,
    usable_partial_result:true,
    limitations:[
      'Source-attributed and time-scoped; not an independent legal or performance audit',
      'No automatic inference of causality, misconduct, individual voting preference, or final expenditure',
      'Open research and expired review intervals do not erase earlier evidence'
    ]
  };
}
export function isolateScenario({scenario_id,model_date,assumptions,outputs}){
  key(scenario_id,'Scenario ID');date(model_date,'Model date');
  if(!assumptions||typeof assumptions!=='object'||Array.isArray(assumptions))throw new Error('Documented assumptions required');
  if(!outputs||typeof outputs!=='object'||Array.isArray(outputs))throw new Error('Outputs required');
  return {schema:'qp-nonobserved-scenario-v1',scenario_id,model_date,simulation_only:true,not_observed:true,not_official_forecast:true,assumptions:structuredClone(assumptions),outputs:structuredClone(outputs),publication_state:'CONTROLLED_DRAFT_NOT_APPROVED'};
}
