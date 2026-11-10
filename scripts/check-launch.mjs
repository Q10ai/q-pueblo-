import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
const root=resolve('public');const pages=readdirSync(root).filter(x=>x.endsWith('.html'));const violations=[],links=[];
const read=x=>readFileSync(resolve(root,x),'utf8');
for(const name of pages){const html=read(name);assert(/<html\s+lang=/i.test(html),`${name}: missing language`);assert(/<title>[^<]+<\/title>/.test(html),`${name}: missing title`);assert(/name="viewport"/.test(html),`${name}: missing viewport`);
 for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  let val=m[1].replaceAll('&amp;','&');if(!val||val.startsWith('#')||val.startsWith('mailto:')||val.startsWith('tel:')||val.startsWith('data:')||/^https?:\/\//i.test(val))continue;
  const u=val.split(/[?#]/)[0];if(!u)continue;
  if(u.startsWith('/')){if(!existsSync(resolve(root,u.slice(1))))violations.push(`${name}: missing absolute ${u}`)}
  else if(!existsSync(resolve(root,dirname(name),u)))violations.push(`${name}: broken local link ${u}`);
  links.push({page:name,to:u});
 }
 if(/href=["']#["']/.test(html))violations.push(name+': inert href=#');
}
const q=JSON.parse(read('data/q-pueblo-issue-index-2026-11-09.json'));
const reports=JSON.parse(read('data/q-pueblo-qified-briefs-2026-11-09.json'));
assert.equal(q.issues.length,174,'historical records count changed without reconciliation');
assert.equal(new Set(q.issues.map(i=>i.id)).size,q.issues.length,'duplicate IDs');
assert.equal(reports.reports.length,5,'Five source-scoped public briefs required');
for(const r of reports.reports){for(const k of ['id','slug','summary','who','what','when','where','why','how','money','relations','counter','options','child','ee','t2y','rx','sources','unknowns','actions'])assert(k in r,r.id+': missing '+k);assert(r.sources.some(s=>/https:\/\//.test(s.url)),r.id+': no primary source');assert(!/CERTIFIED|PROVEN GUILTY/i.test(r.stage));}
for(const name of ['index.html','qify.html','reports.html','entities.html','updates.html','sources.html','participate.html','support.html','method.html','es.html','q-tools.html','issues.html','topics.html','explore.html','workbench.html'])assert(pages.includes(name),'required page missing: '+name);
assert(read('support.js').includes('Q10pueblo@gmail.com'),'public inbox missing');
assert(read('qify.html').includes('qify.js'),'qification page not wired');
assert(read('reports.html').includes('reports.js'),'report browser not wired');
assert(read('index.html').includes('q-pueblo-header-wide.png'),'approved hero graphic not used');
assert(read('index.html').includes('Not a government website'),'independent site disclaimer missing');
assert(!/\bfetch\s*\(/.test(read('support.js')),'Support requests must not transmit data without user email action');
console.log(JSON.stringify({result:violations.length?'FAIL':'PASS',htmlPages:pages.length,localLinksChecked:links.length,historicalIssues:q.issues.length,sourceLinkedIssueRecords:q.counts.sourceMappedIssueRecords,qifiedReports:reports.reports.length,violations},null,2));
if(violations.length)process.exit(1);
