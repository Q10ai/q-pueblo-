// Controlled Qified packet generator from the versioned master candidate.
 // No external fetch, automatic source promotion, publication, or AI inference.
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {dirname} from 'node:path';
import {createHash} from 'node:crypto';
const srcPath='docs/research/2026-11-12-qpueblo-master-crosswalk-v0.2.json';
const jsonPath='research/derived/qp-controlled-qified-cases-v1.json';
const mdPath='research/derived/qp-controlled-qified-cases-v1.md';
const raw=readFileSync(srcPath,'utf8');
const data=JSON.parse(raw);
const srcMap=new Map(data.sources.map(x=>[x.id,x]));
if(srcMap.size!==data.sources.length)throw new Error('Duplicate master source IDs');
const cases=data.qified_examples.map(c=>{
 if(!c.id||!c.question||!c.scope||!c.status||!c.next)throw new Error('Incomplete controlled case');
 if(!Array.isArray(c.known)||!c.known.length||!Array.isArray(c.positions)||c.positions.length<2||!Array.isArray(c.unknowns)||!c.unknowns.length)throw new Error('Insufficient issue balance/uncertainty');
 if(!Array.isArray(c.sources)||!c.sources.length)throw new Error('Missing source pool');
 const sources=c.sources.map(s=>{
   const ref=srcMap.get(s);
   if(!ref||!ref.url?.startsWith('https://'))throw new Error('Missing or invalid source '+s);
   return {id:s,url:ref.url,source_type:ref.type,scope_note:ref.topic};
 });
 return {
  packet_id:c.id,
  source_edition:data.edition,
  status:'SOURCE_ATTRIBUTED_CANDIDATE_NOT_APPROVED',
  original_evidence_status:c.status,
  as_of:data.edition,
  geography_or_institution_scope:c.scope,
  user_question:c.question,
  known_or_reported:c.known,
  distinct_perspectives:c.positions,
  unknown_or_not_proven:c.unknowns,
  proposed_next_evidence_step:c.next,
  source_pool:sources,
  source_to_individual_assertion_mapping_verified:false,
  rights_and_privacy_review:'PENDING',
  human_editorial_approval:'PENDING',
  release_approved:false,
  caveat:'Partial research product. Claims are source-attributed within prior reports; each material assertion requires primary-record corroboration and right of reply.'
 };
});
if(new Set(cases.map(x=>x.packet_id)).size!==cases.length)throw new Error('Duplicate Qified packet IDs');
const output={
 schema:'qp-controlled-qified-cases-v1',
 edition:data.edition,
 source_manifest_sha256:createHash('sha256').update(raw).digest('hex'),
 publication_allowed:false,
 source_claim_audit_completed:false,
 case_count:cases.length,
 cases
};
const encoded=JSON.stringify(output,null,2)+'\n';
const markdown=['# Q-Pueblo — Qified Controlled Research Packets','Edition: '+data.edition,'State: CANDIDATE / HUMAN EVIDENCE AND PUBLICATION REVIEW PENDING','Source edition SHA256: '+output.source_manifest_sha256,'','These are partial-source research summaries, not a live public audit. No automated data collection, private voter data, or publication is authorized.',''];
for(const p of cases){
 markdown.push('## '+p.packet_id+' — '+p.user_question,
 'Scope: '+p.geography_or_institution_scope,
 'Evidence classification: '+p.original_evidence_status+' / SOURCE-ATTRIBUTED, NOT INDEPENDENTLY AUDITED',
 '### Known or attributed',
 ...p.known_or_reported.map(x=>'- '+x),
 '### Distinct accounts and affected positions',
 ...p.distinct_perspectives.map(x=>'- '+x),
 '### Unknown / not established',
 ...p.unknown_or_not_proven.map(x=>'- '+x),
 '### LEAP: next controlling records','- '+p.proposed_next_evidence_step,
 '### Source pool (source-to-assertion matching requires human review)',
 ...p.source_pool.map(s=>'- '+s.id+' ['+s.source_type+'] '+s.url),
 '### Release boundary','- Source-to-assertion audit: NOT DONE','- Publication: NOT APPROVED','');
}
const md=markdown.join('\n')+'\n';
if(process.argv.includes('--write')){for(const [path,value] of [[jsonPath,encoded],[mdPath,md]]){mkdirSync(dirname(path),{recursive:true});writeFileSync(path,value);}}
if(process.argv.includes('--check')){
 if(readFileSync(jsonPath,'utf8')!==encoded)throw new Error('Controlled Qified JSON drift');
 if(readFileSync(mdPath,'utf8')!==md)throw new Error('Controlled Qified Markdown drift');
}
console.log(JSON.stringify({result:'PASS',cases:cases.length,sources:new Set(cases.flatMap(x=>x.source_pool.map(s=>s.id))).size,write:process.argv.includes('--write'),check:process.argv.includes('--check'),human_approval:'PENDING',publication:false},null,2));
