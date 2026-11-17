import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=path.resolve('public');
const textExt=new Set(['.html','.htm','.js','.mjs','.cjs','.json','.jsonl','.csv','.tsv','.txt','.md','.css','.svg','.xml','.yaml','.yml','.toml','.ini','.map','.webmanifest']);
const forbiddenName=/(?:^|\/)(?:\.git|\.env(?:\.[^/]+)?|\.dev\.vars|id_rsa|id_ed25519|credentials\.json|secrets\.json)(?:\/|$)/i;
const secretRules=[
['internal-account-locator',/\bQ10ai\b|\bq10-core\b|\bq10agi@gmail\.com\b/i],
['pem-private-key',/-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/],
['github-token',/\bgh[pousr]_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{35,}\b/],
['aws-access-key',/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
['openai-project-key',/\bsk-proj-[A-Za-z0-9_-]{40,}\b/],
['private-workspace-locator',/(?:\/workspace\/scratch\/|sandbox:\/mnt\/data\/|file:\/\/\/|\/home\/oai\/share\/)/i]
];
const detect=content=>secretRules.filter(([,p])=>p.test(content)).map(([id])=>id);
assert(detect('-----BEGIN '+'PRIVATE KEY-----').includes('pem-private-key'));
assert(detect('ghp_'+'x'.repeat(35)).includes('github-token'));
assert(detect('AKIA'+'Z'.repeat(16)).includes('aws-access-key'));
assert(detect('sk-proj-'+'A'.repeat(45)).includes('openai-project-key'));
assert(detect('sandbox:'+'/mnt/data/'+'example.txt').includes('private-workspace-locator'));
assert.equal(detect('Use API keys safely. No secret values are included.').length,0);
assert(forbiddenName.test('nested/.env.local'));assert(!forbiddenName.test('environment.html'));
const failures=[];let files=0,textFiles=0,otherFiles=0;function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name),rel=path.relative(root,p).split(path.sep).join('/');if(e.isSymbolicLink()){failures.push([rel,'symbolic-link']);continue;}if(forbiddenName.test(rel)){failures.push([rel,'restricted-filename']);continue;}if(e.isDirectory()){walk(p);continue;}if(!e.isFile())continue;files++;if(!textExt.has(path.extname(rel).toLowerCase())&&!['_headers','_redirects','robots.txt'].includes(rel)){otherFiles++;continue;}textFiles++;for(const rule of detect(fs.readFileSync(p,'utf8')))failures.push([rel,rule]);}}
walk(root);for(const [p,rule] of failures)console.error('BLOCK '+rule+' '+p);console.log(JSON.stringify({files,textFiles,otherFiles,failures:failures.length,scope:'public tree only; common secret signatures and restricted paths; binary contents, full history, cloud logs and general personal data not assessed'}));assert.equal(failures.length,0,'Public exposure scan blocked; inspect findings privately, never log secret contents.');
