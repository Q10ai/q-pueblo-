// Q-Pueblo human-gated report amendment proposal.
// This module never writes published data or approves an assertion.
import {createHash} from 'node:crypto';
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const clean=s=>String(s??'').trim();
const https=u=>/^https:\/\/[^\s<>"']+$/i.test(clean(u));
const date=s=>/^\d{4}-\d{2}-\d{2}$/.test(clean(s))&&!Number.isNaN(new Date(clean(s)+'T00:00:00Z').getTime());
const roles=new Set(['A0','A1','A2','B','C','D']);
const digest=o=>createHash('sha256').update(JSON.stringify(o)).digest('hex');
const stageKind=s=>/paid|disbursed|spent|expenditure|collections|received/i.test(s)?'PAID_OR_ACTUAL':/authorized|appropriat|approved|budget/i.test(s)?'AUTHORIZATION':/commit|obligat|contract|award/i.test(s)?'OBLIGATION':/proposed|forecast|estimate/i.test(s)?'PROPOSAL_OR_ESTIMATE':'UNCLASSIFIED';

export function proposeAmendment(report, incoming, now='2026-11-10') {
  if(!report || !Array.isArray(report.claims) || !Array.isArray(report.sources) || !report.id || !report.version) throw Error('Baseline report/version/claims/sources required.');
  if(!incoming || incoming.schema!=='qp-amendment-candidate-v1'||incoming.reportId!==report.id || incoming.baseVersion!==report.version) throw Error('Report identity/version mismatch; rebase candidate onto current report.');
  if(!date(now) || !date(incoming.observedAt)) throw Error('Valid observation and review dates required.');
  if(!Array.isArray(incoming.evidence) || !incoming.evidence.length || !Array.isArray(incoming.changes)||!incoming.changes.length)throw Error('At least one evidence source and proposed claim change required.');
  if(incoming.evidence.length>20 || incoming.changes.length>30)throw Error('Candidate exceeds review bounds.');
  const original=new Map(report.claims.map(c=>[c.id,c]));
  if(original.size!==report.claims.length)throw Error('Duplicate baseline claim IDs.');
  const knownIds=new Set(report.sources.map(s=>s.id));
  const sources=new Map();
  for(const s of incoming.evidence){
    if(!s || typeof s.id!=='string'||!/^[-A-Za-z0-9_]{3,80}$/.test(s.id)||!clean(s.title)||!https(s.url)||!roles.has(s.role)||!date(s.checked)||sources.has(s.id))throw Error('Invalid or duplicate candidate evidence.');
    if(knownIds.has(s.id))throw Error('Reuse baseline source by citation; new evidence must have a new source ID.');
    sources.set(s.id,s);
  }
  const ids=new Set();
  const proposedChanges=[],contradictions=[],accountingFlags=[];
  for(const c of incoming.changes){
    if(!c || !/^[-A-Za-z0-9_]{3,100}$/.test(clean(c.claimId))||ids.has(c.claimId)||!clean(c.proposedClaim)||!clean(c.reason)||!sources.has(c.evidenceId))throw Error('Invalid claim amendment or absent candidate evidence.');
    ids.add(c.claimId);
    const prior=original.get(c.claimId)||null;
    const oldStage=prior?clean(prior.boundary):null;
    const nextStage=clean(c.proposedStage);
    if(!nextStage)throw Error('Proposed accounting/evidence stage required.');
    const changed=Boolean(prior && clean(prior.claim)!==clean(c.proposedClaim));
    const oldType=stageKind(oldStage),newType=stageKind(nextStage);
    if(changed)contradictions.push({claimId:c.claimId,previous:prior.claim,proposed:c.proposedClaim,disposition:'OPEN_CONTRADICTION_NOT_RESOLVED'});
    if(prior && oldType!==newType && oldType!=='UNCLASSIFIED' && newType!=='UNCLASSIFIED')accountingFlags.push({claimId:c.claimId,previousStage:oldStage,proposedStage:nextStage,status:'ACCOUNTING_STAGE_CANNOT_BE_IMPLICITLY_CONVERTED'});
    proposedChanges.push({claimId:c.claimId,prior:prior?{claim:prior.claim,boundary:prior.boundary,sourceIds:prior.sourceIds}:null,proposedClaim:clean(c.proposedClaim),proposedStage:nextStage,reason:clean(c.reason),evidenceId:c.evidenceId,disposition:'HUMAN_SOURCE_REVIEW_REQUIRED'});
  }
  const reviewDue=date(report.reviewDue)?report.reviewDue:null;
  return Object.freeze({
    schema:'qp-amendment-proposal-v1',state:'CHALLENGE_PENDING_HUMAN_REVIEW',publicationAllowed:false,
    reportId:report.id,reportSlug:report.slug,baseVersion:report.version,baseHash:digest(report),
    proposalHash:digest({reportId:incoming.reportId,baseVersion:incoming.baseVersion,evidence:incoming.evidence,changes:incoming.changes,observedAt:incoming.observedAt}),
    observedAt:incoming.observedAt,preparedAt:now,sourceChecked:report.sourceChecked||null,reviewDue,reviewOverdue:Boolean(reviewDue && now>reviewDue),
    candidateEvidence:incoming.evidence.map(s=>({id:s.id,title:s.title,url:s.url,role:s.role,checked:s.checked,provenance:s.originGroup||null,verification:'UNVERIFIED_NEW_SOURCE'})),
    changes:proposedChanges,contradictions,accountingFlags,
    affectedIssueIds:Array.isArray(report.issueIds)?report.issueIds:[],
    requiredReview:['Check validity and scope of each original/new source, provenance, publication date and source role.',
     'Compare independent counterevidence; record disagreement and origin groups so repeated copies do not count as corroboration.',
     'Reconcile authorization, obligations, payments and outcome data separately.',
     'Record human reviewer, formal disposition, prior hash, new version and publicly accessible supersession only after approval.'],
    limitations:['No external retrieval or source verification performed.','The original report is unchanged.','No approved public report or automatic model-training update created.']
  });
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const [reportFile,candidateFile,outputFile]=process.argv.slice(2);
  if(!reportFile || !candidateFile || !outputFile){console.error('Usage: node scripts/propose-report-amendment.mjs baseline-report.json candidate.json output-proposal.json');process.exit(2);}
  const proposal=proposeAmendment(JSON.parse(readFileSync(reportFile,'utf8')),JSON.parse(readFileSync(candidateFile,'utf8')),new Date().toISOString().slice(0,10));
  writeFileSync(outputFile,JSON.stringify(proposal,null,2)+'\n',{flag:'wx',mode:0o600});
  console.log('Created controlled REVIEW-ONLY proposal: '+outputFile+'; no published report modified.');
}
