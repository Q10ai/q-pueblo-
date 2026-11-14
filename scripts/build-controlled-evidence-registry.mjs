// Generate a controlled source/issue linkage from existing repo source snapshots.
// Usage: node scripts/build-controlled-evidence-registry.mjs
// Default: validate and print counts. --write: create/update research/derived candidate only.
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {dirname} from 'node:path';
import {buildCandidateRegistry,ensureControlled,digest} from '../lib/qp-evidence-ledger.mjs';
const paths={
  issues:'public/data/q-pueblo-issue-index-2026-11-09.json',
  reports:'public/data/q-pueblo-qified-reports-v2-2026-11-09.json',
  output:'research/derived/qp-controlled-evidence-registry-v1.json'
};
const issuesRaw=readFileSync(paths.issues,'utf8');
const reportsRaw=readFileSync(paths.reports,'utf8');
const registry=buildCandidateRegistry({
  issues:JSON.parse(issuesRaw).issues,
  reports:JSON.parse(reportsRaw).reports,
  issueDigest:digest(issuesRaw),reportDigest:digest(reportsRaw)
});
ensureControlled(registry);
const encoded=JSON.stringify(registry,null,2)+'\n';
if(process.argv.includes('--write')){
  mkdirSync(dirname(paths.output),{recursive:true});
  writeFileSync(paths.output,encoded);
}
if(process.argv.includes('--check')){
  if(readFileSync(paths.output,'utf8')!==encoded)throw new Error('Committed controlled evidence register has drifted from source snapshots');
}
console.log(JSON.stringify({result:'PASS',wrote:process.argv.includes('--write'),checked:process.argv.includes('--check'),...registry.counts},null,2));
