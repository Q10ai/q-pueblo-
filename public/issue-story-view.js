'use strict';
(function(root){
 const node=(tag,text)=>{const e=document.createElement(tag);if(text!=null)e.textContent=String(text);return e;};
 const link=(text,url)=>{const e=node('a',text);e.href=url;return e;};
 const safe=u=>{try{const x=new URL(u);return x.protocol==='https:'?x.href:null;}catch{return null;}};
 const para=(p,t)=>{if(t)p.append(node('p',t));};
 const detail=(p,title,lines)=>{if(!lines?.filter(Boolean).length)return;const d=node('details');d.append(node('summary',title));for(const line of lines)para(d,line);p.append(d);};
 function render(s,today=new Date().toISOString().slice(0,10)){
 const card=node('section');card.className='qp-issue-story';card.append(node('h3','The story — what Q can tell you'));
 if(s.priority)para(card,'2027 editorial focus: '+s.priority+' (proposed focus, not a severity or popularity score).');
 para(card,s.evidenceDate?'Latest linked evidence review: '+s.evidenceDate+' · Not live verification.':'No dated report evidence linked to this record yet.');
 if(s.historyDate)para(card,'Index review date: '+s.historyDate+' · Not the date of the underlying event.');
 for(const u of s.updates){const d=node('section');d.append(node('h4',u.title));para(d,u.finding);para(d,u.meaning);para(d,u.milestone?'What to watch: '+u.milestone:'');para(d,'Checked '+u.checkedDate+' · '+(today>=u.recheckDate?'Review due; verify with original sources.':'Recheck by '+u.recheckDate));for(const x of u.sources||[]){const url=safe(x.url);if(url){const p=node('p');p.append(link(x.title,url));d.append(p);}}card.append(d);}
 for(const {report:r,relation} of s.reports){const sec=node('section');sec.append(node('h4',r.title));para(sec,relation);para(sec,r.summary);const t=r.qification?.temporal||{};detail(sec,'How the story developed',[t.past,r.when]);detail(sec,'What the evidence shows',[...(r.whatKnown||[]),t.present,r.qification?.assessment]);detail(sec,'People, institutions and consequences',[r.who,r.where,r.why,...(r.relations||[])]);detail(sec,'Facts, figures and funding stages',(r.keyFacts||[]).map(x=>x.label+': '+x.value+' — '+x.stage));detail(sec,'What remains unknown and competing explanations',[r.counter,...(r.unknowns||[])]);detail(sec,'Options and what comes next',[t.future,r.rx,...(r.actions||[])]);para(sec,'Source checked '+r.sourceChecked+' · '+(today>=r.reviewDue?'Review due: confirm before relying on this.':'Review by '+r.reviewDue));const sources=node('details');sources.append(node('summary','Original sources'));for(const x of r.sources||[]){const url=safe(x.url);if(url){const p=node('p');p.append(link(x.title,url));sources.append(p);}}sec.append(sources,link('Read the full dated Q report and 40 perspectives','reports.html?report='+encodeURIComponent(r.slug)+'#qified-report'));card.append(sec);}
 if(!s.updates.length&&!s.reports.length){para(card,'This issue is recorded under '+s.category+'. The existing public index establishes a research topic, but not its outcome. No factual narrative for this exact issue has been approved in the linked collection. Earlier research may exist and needs reconciliation.');}
 if(s.sourceLeads.length){const d=node('details');d.append(node('summary','Original index source leads — not verified findings'));for(const u of s.sourceLeads){const url=safe(u);if(url){const p=node('p');p.append(link('Open original record',url));d.append(p);}}card.append(d);}
 if(s.graphId){const p=node('p');p.append(link('People, organizations and issue connections','connections.html?issue='+encodeURIComponent(s.graphId)));card.append(p);}
 const p=node('p');p.append(link('Ask Q using existing research','qify.html?q='+encodeURIComponent(s.title)),document.createTextNode(' · '),link('Request missing research or offer a public record','participate.html'));card.append(p);
 return card;
 }
 root.QPIssueStoryView={render};
})(window);
