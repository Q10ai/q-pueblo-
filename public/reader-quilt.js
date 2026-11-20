'use strict';
(function(root){
 const safeLocal=u=>typeof u==='string'&&/^[a-z0-9_/-]+\.html(?:#[a-z0-9_-]+)?$/i.test(u)&&!u.includes('..')&&!u.startsWith('/');
 const clean=items=>[...new Set((items||[]).filter(x=>typeof x==='string'&&x.trim()))];
 const links=items=>{const seen=new Set();return (items||[]).filter(x=>safeLocal(x.route)&&x.title&&!seen.has(x.route)&&seen.add(x.route));};
 const normalize=s=>String(s??'').toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const relatedLiving=(q,rows)=>{const tokens=normalize(q).split(' ').filter(t=>t.length>2&&!['pueblo','what','where','which','about','does','the','and','how','can','for','when','with','are'].includes(t));return rows.map(r=>({r,n:tokens.filter(w=>(' '+normalize(r.title+' '+r.keywords)+' ').includes(' '+w+' ')).length})).filter(x=>x.n>=Math.min(2,Math.max(1,tokens.length))).sort((a,b)=>b.n-a.n).slice(0,6).map(x=>({title:x.r.title,route:x.r.route,context:'Related living research; not an exact answer'}));};
 function project({question='',report=null,story=null,related=[],prior=[],coverage=[]}={}){
  const known=!!(report||story),r=report||{},s=story||{},t=r.qification?.temporal||{};
  const findings=clean(report?[r.summary,...(r.whatKnown||[]),r.qification?.assessment]:story?[s.summary,...(s.chapters||[]).filter(c=>['fact','finding','evidence'].includes(c.kind)).map(c=>c.text)]:[]);
  const historical=clean(report?[t.past]:story?(s.chapters||[]).filter(c=>/histor|timeline|past|background|develop|earlier|origins/i.test(c.heading)).map(c=>c.text):[]);
  const lessonLinks=links(prior);
  const quilt=report?coverage.map(x=>({title:x.title,text:x.answer,state:x.classification,group:x.group})):story?(s.coverage40?.length?s.coverage40.map(x=>({title:x.title,text:x.answer,state:x.classification,group:'Research perspectives'})):s.chapters.map(c=>({title:c.heading,text:c.text,state:c.kind,group:'Story sections'}))):[];
  return {schema:'qp-reader-quilt-v1',question,evidenceState:known?'DATED_PREPARED_FINDINGS':'NO_EXACT_PREPARED_ANSWER',answer:findings[0]||'No prepared, source-supported answer matches this exact question.',findings,legacyLearning:{historical,prior:lessonLinks,scope:'Dated findings and linked prior work in the available collection. The wider Legacy Learning archive is not certified reconciled.'},quilt,related:links(related),unknowns:clean(report?[r.counter,...(r.unknowns||[])]:story?s.unknowns:[]),twin:'twin.html',learn:'learn-pueblo.html'};
 }
 const node=(tag,text)=>{const e=document.createElement(tag);if(text!=null)e.textContent=String(text);return e;};
 const para=(p,t)=>{if(t)p.append(node('p',t));};
 const anchor=(p,label,route)=>{if(!safeLocal(route)&&!/^#[a-z0-9_-]+$/i.test(route||''))return;const x=node('a',label);x.href=route;p.append(x);};
 const linkList=(p,arr)=>{for(const x of arr){const li=node('p');anchor(li,x.title,x.route);if(x.context)li.append(document.createTextNode(' — '+x.context));p.append(li);}};
 function view(data,{includeFindings=true,includeQuilt=true}={}){
  const out=node('section');out.className='qp-story';out.dataset.qpReaderQuilt='true';
  if(includeFindings){out.append(node('h3','Findings'));if(data.findings.length)for(const f of data.findings)para(out,f);else para(out,data.answer);}
  const ll=node('details');ll.append(node('summary','Legacy Learning (LL) — earlier evidence and findings'));for(const h of data.legacyLearning.historical)para(ll,h);linkList(ll,data.legacyLearning.prior);if(!data.legacyLearning.historical.length&&!data.legacyLearning.prior.length)para(ll,'No earlier case-specific findings are established in this linked collection.');para(ll,data.legacyLearning.scope);out.append(ll);
  if(includeQuilt){const quilt=node('details');quilt.append(node('summary','Quilted research sections — evidence and connections'));if(data.quilt.length){let last='';for(const x of data.quilt){if(x.group&&x.group!==last){quilt.append(node('h4',x.group));last=x.group;}const d=node('details');d.append(node('summary',x.title));para(d,x.text);if(x.state)para(d,x.state);quilt.append(d);}}else para(quilt,'No case-specific analytical findings are available for this exact question. Related research below does not establish an answer.');out.append(quilt);}
  if(data.related.length){const d=node('details');d.append(node('summary','Connected research and earlier editions'));linkList(d,data.related);out.append(d);}
  const p=node('p');anchor(p,'Twin Pueblo — relationships and scenarios',data.twin);p.append(document.createTextNode(' · '));anchor(p,'Learn Pueblo',data.learn);out.append(p);return out;
 }
 function markdown(p){return '\n\n## Legacy Learning (LL)\n'+(p.legacyLearning.historical.join('\n\n')||'No earlier case-specific finding established in the linked collection.')+'\n'+p.legacyLearning.prior.map(x=>x.title+' — '+x.route).join('\n')+'\n'+p.legacyLearning.scope+'\n\n## Connected quilted sections\n'+(p.quilt.map(x=>x.title+' — '+x.text+(x.state?' ['+x.state+']':'')).join('\n')||'No case-specific findings established.')+'\n\n## Related research (not proof of an exact answer)\n'+p.related.map(x=>x.title+' — '+x.route).join('\n')+'\n\nTwin: '+p.twin+' · Learning: '+p.learn;}
 const api={project,view,markdown,relatedLiving,safeLocal};if(root)root.QPReaderQuilt=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:null);
