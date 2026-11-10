import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import assert from 'node:assert/strict';
const ROOT=resolve('public');
const files=readdirSync(ROOT).filter(n=>n.endsWith('.html'));
let links=0;
const errors=[];
for(const name of files){
  const html=readFileSync(join(ROOT,name),'utf8');
  for(const m of html.matchAll(/<a\b[^>]*?\bhref\s*=\s*(["'])(.*?)\1/gi)){
    const href=m[2].trim();
    if(!href || /^(https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(href))continue;
    if(href==='#') { errors.push(`${name}: empty anchor target`);continue; }
    if(href.startsWith('#'))continue;
    let u;try{u=new URL(href,`https://qpueblo.local/${name}`);}catch{errors.push(`${name}: invalid URL ${href}`);continue;}
    const dest=resolve(ROOT,decodeURIComponent(u.pathname.slice(1)));
    if(!dest.startsWith(ROOT)){errors.push(`${name}: path escape ${href}`);continue;}
    if(!existsSync(dest)){errors.push(`${name}: missing ${href}`);continue;}
    if(u.hash && dest.endsWith('.html')){
      const id=decodeURIComponent(u.hash.slice(1));
      const content=readFileSync(dest,'utf8');
      if(!content.includes(`id="${id}"`) && !content.includes(`id='${id}'`) && !content.includes(`name="${id}"`)) errors.push(`${name}: missing fragment ${href}`);
    }
    links++;
  }
}
assert.equal(errors.length,0,'Broken internal links:\n'+errors.join('\n'));
console.log(`PASS: ${files.length} HTML pages, ${links} cross-page links and fragments`);
