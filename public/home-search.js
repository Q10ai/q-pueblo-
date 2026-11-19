"use strict";
(() => {
 const form=document.querySelector('[data-search-mode="local"]');if(!form)return;
 const $=id=>document.getElementById(id),input=$('home-q'),k=$('home-kind'),area=$('home-results'),status=$('home-result-status'),list=$('home-result-list');
 const pathSources=['data/qp-current-reports.json','data/q-pueblo-issue-index-2026-11-09.json','data/qp-three-hop-2026-11-13.json','data/qp-now-2026-11-13.json','data/q-pueblo-public-case-summaries.json','data/qp-governance-index-input-v1.json','data/qp-governance-profiles-2026-11-14.json'];
 const words=s=>String(s??'').toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 let loading=null;
 const row=(type,title,text,href,date='')=>({type,title:String(title),text:String(text||''),href,date:String(date||'')});
 async function load(){const results=await Promise.allSettled(pathSources.map(p=>fetch(p,{credentials:'same-origin'}).then(r=>{if(!r.ok)throw Error('Read failed');return r.json()})));const [a,b,c,d,e,f,g]=results.map(x=>x.status==='fulfilled'?x.value:{});if(results.every(x=>x.status==='rejected'))throw Error('No data available');
 const out=[];
 out.push(row('Analysis','How much of Q-Pueblo’s research is backed by evidence?','research progress accountability original 107 backlog living packets evidence gaps 40 sections coverage QIFY verification data sources reports completion corrections', 'research-progress.html','2026-11-18'));
 out.push(row('Analysis','Project Falcon — civic decision timeline','project falcon land option manufacturing incentives water jobs lime road st charles county public decision timeline','project-falcon.html','2026-11-15'));
 for(const r of a.reports||[])out.push(row('Analysis',r.title,[r.summary,r.topic,...(r.aliases||[]),...(r.questions||[])].join(' '),'report-'+encodeURIComponent(r.slug)+'.html',r.sourceChecked));
 for(const i of b.issues||[])out.push(row('Issue',i.title,[i.domain,i.category,i.geography].join(' '),'issues.html#'+encodeURIComponent(i.id),i.lastReviewed));
 for(const i of c.issues||[])out.push(row('Issue',i.title,[i.category,i.kind].join(' '),'connections.html?issue='+encodeURIComponent(i.id),i.source_date));
 const roles=new Map();for(const issue of c.issues||[])for(const edge of issue.edges||[]){if(!roles.has(edge.entity_id))roles.set(edge.entity_id,new Set());roles.get(edge.entity_id).add(edge.role)}
 for(const ent of c.entities||[])out.push(row('Organization',ent.name,[ent.kind,ent.identity_state,...(roles.get(ent.id)||[])].join(' '),'entities.html#find='+encodeURIComponent(ent.name),''));
 for(const n of d.records||[])out.push(row('Update',n.heading,[n.agency,n.display_when,n.what].join(' '),'now.html#'+encodeURIComponent(n.id),n.last_checked));
 for(const x of e.caseSummaries||[])out.push(row('Case summary',x.title,'Public case summary','packets.html#'+encodeURIComponent(x.slug),x.captured));
 for(const u of f.lifecycle?.updates||[])out.push(row('Update',u.title,u.finding+' '+u.meaning,'now.html#'+encodeURIComponent(u.id),u.checkedDate));
 for(const ent of f.additions||[])out.push(row('Organization',ent.name,ent.description,'governance-entities.html#'+encodeURIComponent(ent.id),''));
 for(const p of g.profiles||[]){out.push(row('Organization',p.name,[p.work,p.scope,...p.topics].join(' '),'who-governs.html#'+encodeURIComponent(p.id),g.checked));for(const [name,role] of p.members||[])out.push(row('Organization',name,role+' · '+p.name,'who-governs.html#'+encodeURIComponent(p.id),g.checked));}
 for(const s of window.QPStoryEditions?.allStories||[])out.push(row('Analysis',s.title,[s.summary,...s.questions].join(' '),s.route,s.checked));
 for(const v of window.QPResource?.items||[])out.push(row('Resource',v.title,[v.publisher,v.description,v.format,...v.tags].join(' '),'resource-library.html#'+encodeURIComponent(v.id),v.checked));
 return {rows:out, failed:results.filter(x=>x.status==='rejected').length};
 }
 function element(tag,txt,cls){let o=document.createElement(tag);if(txt!=null)o.textContent=txt;if(cls)o.className=cls;return o}
 let serial=0;
 async function search(){const q=input.value.trim(),v=words(q);if(!v)return;const seq=++serial;area.hidden=false;list.replaceChildren();status.textContent='Searching Q-Pueblo’s indexed information…';$('home-ask-q').href='qify.html#q='+encodeURIComponent(q);
 try{loading ||= load();const pending=loading;const {rows,failed}=await pending;if(failed&&loading===pending)loading=null;if(seq!==serial)return;
 const stop=new Set(['a','an','about','pueblo','the','what','who','when','where','how','is','are','of','to','in','and','for','does']);const terms=v.split(' ').filter(x=>x.length>1&&!stop.has(x));if(!terms.length){status.textContent='Try a topic, organization or project name.';return}
 const scored=rows.filter(x=>k.value==='all'||x.type===k.value).map(x=>{const title=words(x.title),all=words(x.title+' '+x.text);const match=terms.filter(t=>all.includes(t));return {...x,score:match.length?match.length*3+terms.filter(t=>title.includes(t)).length*5+(title.includes(terms.join(' '))?10:0):0,matched:match.length}}).filter(x=>x.score>0&&(terms.length<3||x.matched>=2)).sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title));
 const unique=[];const seen=new Set();for(const r of scored){const id=r.type+':'+words(r.title)+':'+r.href;if(seen.has(id))continue;seen.add(id);unique.push(r)}
 status.textContent=unique.length?`Found ${unique.length} related results; showing ${Math.min(unique.length,30)}. Select a result for its source information.`:'No matching indexed information was found. Try a different term or explore the question in Q.';
 if(failed)status.textContent+=` ${failed} of ${pathSources.length} data collections could not load; results may be incomplete. Search again to retry.`;
 for(const r of unique.slice(0,30)){const a=element('a',null,'qp-search-result');a.href=r.href;a.append(element('small',r.type+(r.date?' · '+r.date:'')),element('strong',r.title),element('span',r.text.length>170?r.text.slice(0,167)+'…':r.text));list.append(a)}
 }catch(e){loading=null;if(seq===serial)status.textContent='Search could not load. Browse the issue directory, reports, or ask Q.';}
 }
 form.addEventListener('submit',e=>{e.preventDefault();search()});k.addEventListener('change',()=>{if(input.value.trim())search()});
})();
