import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const json=JSON.parse(readFileSync('public/data/q-pueblo-issue-index-2026-11-09.json','utf8'));
const topicPage=readFileSync('public/topics.html','utf8');
const home=readFileSync('public/index.html','utf8');
const js=readFileSync('public/issues.js','utf8');
const names=Object.keys(json.categoryCounts);
assert.equal(names.length,10);
assert.equal(Object.values(json.categoryCounts).reduce((a,b)=>a+b,0),json.issues.length);
for(const name of names){
 const url='issues.html?topic='+encodeURIComponent(name);
 assert(topicPage.includes(url),'Missing category destination: '+name);
 assert(home.includes(url),'Homepage topic menu missing: '+name);
}
assert(home.includes('href="topics.html"'),'No full topic directory link');
assert(js.includes("searchParams.get('topic')"),'Issue filter must accept shareable topic query parameter');
assert(topicPage.includes('Counts describe a dated index'),'Missing scope limit');
assert(topicPage.includes('independent ID'),'No deduplication boundary');
console.log('Q Pueblo topic navigation: PASS; '+names.length+' public categories; '+json.issues.length+' dated issue records');
