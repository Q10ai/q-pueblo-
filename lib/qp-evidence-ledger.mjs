// Controlled, deterministic civic evidence linkage. No network I/O and no publication.
import {createHash} from 'node:crypto';

export const STAGES = Object.freeze(['estimated','proposed','authorized','appropriated','obligated','invoiced','paid','reconciled','audited','observed_outcome']);
const sha = value => createHash('sha256').update(String(value)).digest('hex');
const uniq = arr => [...new Set(arr)];
const sort = arr => [...arr].sort((a,b)=>String(a).localeCompare(String(b),'en'));
const asText = v => String(v??'');
function failIfDuplicate(ids,label){
  if(new Set(ids).size!==ids.length) throw new Error(label+': duplicate identifier');
}
function cleanHttps(input){
  const value=asText(input).trim();
  let u;
  try {u=new URL(value);}catch {throw new Error('Not a valid URL');}
  if(u.protocol!=='https:' || u.username || u.password) throw new Error('Source must be HTTPS without credentials');
  return value; // Do not alter original source URLs or erase fragment locators.
}
function id(s,label){
  if(!/^[A-Za-z0-9][A-Za-z0-9._:-]{1,130}$/.test(asText(s)))throw new Error(label+': invalid ID');
  return String(s);
}
export function digest(raw){return sha(raw);}
export function buildCandidateRegistry({issues,reports,issueDigest,reportDigest,asOf='2026-11-12'}){
  if(!Array.isArray(issues)||!Array.isArray(reports))throw new Error('Array inputs required');
  if(!/^\d{4}-\d\d-\d\d$/.test(asOf))throw new Error('Date required');
  failIfDuplicate(issues.map(v=>id(v.id,'issue')), 'issue');
  failIfDuplicate(reports.map(v=>id(v.id,'report')), 'report');
  const issueIds=new Set(issues.map(v=>v.id));
  const sourceMap=new Map(), candidateLinks=[];
  const reportIndex=reports.map(report=>{
    const rid=id(report.id,'report');
    const refs=[], matchedIds=[];
    for(const source of report.sources||[]){
      if(!source.url)continue;
      const url=cleanHttps(source.url);
      const sid='URL-'+sha(url).slice(0,20);
      if(!sourceMap.has(sid))sourceMap.set(sid,{id:sid,url,appearances:[]});
      const entry=sourceMap.get(sid);
      if(entry.url!==url)throw new Error('Unexpected source fingerprint collision');
      entry.appearances.push({
        report_id:rid,
        local_source_id:asText(source.id),
        checked_at:asText(source.checked||report.sourceChecked||''),
        record_as_of:asText(source.asOf),
        kind:asText(source.kind),
        source_role:asText(source.role)
      });
      refs.push(sid);
    }
    for(const issueId of uniq(report.issueIds||[])){
      if(!issueIds.has(issueId))throw new Error('Report '+rid+' references missing historical issue '+issueId);
      matchedIds.push(issueId);
      candidateLinks.push({
        issue_id:issueId,report_id:rid,
        source_ref_ids:sort(uniq(refs)),
        state:'EXPLICIT_REPORT_LINK_NEEDS_EVIDENCE_REVIEW',
        basis:'Existing dated report issueIds (not a source-to-claim audit)',
        public_finding:false
      });
    }
    return {
      id:rid,slug:asText(report.slug),stage:asText(report.stage),
      date:asText(report.date),source_checked:asText(report.sourceChecked),
      review_due:asText(report.reviewDue),
      source_ref_ids:sort(uniq(refs)),
      explicitly_linked_issue_ids:sort(matchedIds)
    };
  });
  const linkMap=new Map();
  for(const link of candidateLinks){const a=linkMap.get(link.issue_id)||[];a.push(link.report_id);linkMap.set(link.issue_id,a);}
  const records=issues.map(issue=>{
    const iid=id(issue.id,'issue');
    const original=uniq(issue.sourceIds||[]);
    const knownUrls=(issue.availableSourceUrls||[]).map(x=>({
      id:asText(x.id),url:cleanHttps(x.url),
      publisher:asText(x.publisher),source_date:asText(x.sourceDate)
    }));
    return {
      id:iid,title:asText(issue.title),domain:asText(issue.domain),
      category:asText(issue.category),geography:asText(issue.geography),
      last_reviewed:asText(issue.lastReviewed),
      original_source_ids:sort(original),
      original_source_urls:knownUrls.sort((a,b)=>a.url.localeCompare(b.url,'en')),
      candidate_report_ids:sort(uniq(linkMap.get(iid)||[])),
      coverage_state:original.length?'SOURCE_MAPPED_REQUIRES_CLAIM_REVIEW':
        linkMap.has(iid)?'UNMAPPED_WITH_EXPLICIT_REPORT_LEAD':'UNMAPPED_NO_EXPLICIT_REPORT_LEAD',
      independent_verification:false
    };
  });
  const reportLeads=records.filter(i=>i.coverage_state==='UNMAPPED_WITH_EXPLICIT_REPORT_LEAD').length;
  const mapped=records.filter(i=>i.original_source_ids.length>0).length;
  return {
    schema:'qp-controlled-evidence-registry-v1',
    as_of:asOf,
    boundary:{
      classification:'CONTROLLED_RESEARCH_CANDIDATE',
      original_source_mapping_is_not_verification:true,
      candidate_links_are_not_approved_source_mappings:true,
      automatic_publication:false,
      human_approval:'PENDING',
      source_snapshots_not_downloaded_by_this_build:true,
      individual_voter_data_included:false
    },
    input_hashes:{issue_json_sha256:asText(issueDigest),report_json_sha256:asText(reportDigest)},
    counts:{
      historical_issues:records.length,
      originally_source_mapped:mapped,
      originally_unmapped:records.length-mapped,
      explicit_report_lead_issues:reportLeads,
      remaining_unmapped_without_explicit_report_lead:records.length-mapped-reportLeads,
      current_reports:reportIndex.length,
      distinct_report_source_urls:sourceMap.size,
      explicit_issue_report_edges:candidateLinks.length
    },
    historical_issues:records.sort((a,b)=>a.id.localeCompare(b.id,'en')),
    reports:reportIndex.sort((a,b)=>a.id.localeCompare(b.id,'en')),
    source_url_refs:[...sourceMap.values()].map(s=>({...s,appearances:s.appearances.sort((a,b)=>a.report_id.localeCompare(b.report_id,'en'))})).sort((a,b)=>a.id.localeCompare(b.id,'en')),
    candidate_links:candidateLinks.sort((a,b)=>(a.issue_id+'|'+a.report_id).localeCompare(b.issue_id+'|'+b.report_id,'en'))
  };
}
export function ensureControlled(registry){
  if(registry?.boundary?.automatic_publication!==false)throw new Error('Auto publication not disabled');
  if(registry?.boundary?.human_approval!=='PENDING')throw new Error('Unexpected approval state');
  if(registry?.boundary?.candidate_links_are_not_approved_source_mappings!==true)throw new Error('Candidate boundary missing');
  const issues=registry.historical_issues||[], sources=registry.source_url_refs||[];
  failIfDuplicate(issues.map(x=>x.id),'historical issues');
  failIfDuplicate(sources.map(x=>x.id),'source refs');
  const iSet=new Set(issues.map(x=>x.id)),rSet=new Set((registry.reports||[]).map(x=>x.id)),sSet=new Set(sources.map(x=>x.id));
  for(const l of registry.candidate_links||[]){
    if(!iSet.has(l.issue_id)||!rSet.has(l.report_id)||l.public_finding!==false)throw new Error('Invalid candidate linkage');
    if(!l.source_ref_ids.every(x=>sSet.has(x)))throw new Error('Missing source reference');
  }
  const n=registry.counts;
  if(n.historical_issues!==n.originally_source_mapped+n.originally_unmapped)throw new Error('Historical issue coverage accounting inconsistent');
  if(n.originally_unmapped!==n.explicit_report_lead_issues+n.remaining_unmapped_without_explicit_report_lead)throw new Error('Candidate coverage accounting inconsistent');
  return true;
}
export function appendCandidateRevision(existing,decision){
  // Local draft lineage only; this function cannot authorize or publish a finding.
  if(!existing?.revisions||!Array.isArray(existing.revisions))throw new Error('Revisions array required');
  if(!decision||!decision.review_note||!decision.source_id||!decision.reviewed_at)throw new Error('Provenance required');
  if(!/^\d{4}-\d\d-\d\d/.test(decision.reviewed_at))throw new Error('Dated decision required');
  const next=structuredClone(existing);
  const revId='REV-'+sha(JSON.stringify(decision)).slice(0,16);
  if(next.revisions.some(x=>x.revision_id===revId))return next;
  next.revisions.push({revision_id:revId,review_note:decision.review_note,source_id:decision.source_id,reviewed_at:decision.reviewed_at,state:'REVIEW_CANDIDATE_ONLY'});
  next.publication_state='NOT_APPROVED';
  return next;
}
export function financialStageTotals(rows,{agency,jurisdiction,fiscalYear,currency}){
  // No rolled-up all-stage public-investment total: totals by stage have different meanings.
  if(!agency||!jurisdiction||!fiscalYear||!currency)throw new Error('Complete accounting scope required');
  const result=Object.fromEntries(STAGES.map(s=>[s,{amount:0,records:0}]));
  const seen=new Set();
  for(const row of rows){
    if(row.agency!==agency||row.jurisdiction!==jurisdiction||row.fiscalYear!==fiscalYear||row.currency!==currency)throw new Error('Cross-scope aggregation prohibited');
    if(!STAGES.includes(row.stage))throw new Error('Unknown financial state');
    if(!row.source_id||!row.transaction_id)throw new Error('Source and transaction ID required');
    const key=row.stage+'|'+row.transaction_id;
    if(seen.has(key))throw new Error('Duplicate stage transaction');
    seen.add(key);
    if(!Number.isSafeInteger(row.amount_cents))throw new Error('Amounts require integer minor currency units');
    result[row.stage].amount+=row.amount_cents;
    if(!Number.isSafeInteger(result[row.stage].amount))throw new Error('Unsafe accumulated amount');
    result[row.stage].records++;
  }
  return {scope:{agency,jurisdiction,fiscalYear,currency},totals_by_stage_in_minor_units:result,all_stage_total_is_not_meaningful:true};
}
export function requireAggregateElectionRows(rows,{minimumCell=10}={}){
  if(!Number.isSafeInteger(minimumCell)||minimumCell<10)throw new Error('Minimum cell floor 10');
  const forbidden=['voterid','personname','streetaddress','householdid','fulladdress','ballotreturnid','individualid','latitude','longitude'];
  for(const row of rows){
    if(Object.keys(row).some(k=>forbidden.includes(k.replaceAll('_','').toLowerCase())))throw new Error('Individual-level field prohibited');
    if(!row.geography_id||!row.source_id||!row.observed_at||!row.boundary_version)throw new Error('Aggregate provenance required');
    if(!Number.isSafeInteger(row.count)||row.count<minimumCell)throw new Error('Suppress small cells');
  }
  return rows.map(x=>({...x,privacy_status:'AGGREGATE_CELL_CHECK_ONLY'}));
}
