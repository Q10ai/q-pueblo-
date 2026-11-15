'use strict';
(function(root){
 const n=(tag,txt)=>{const e=document.createElement(tag);if(txt!=null)e.textContent=txt;return e;};
 const p=(parent,txt)=>{if(txt)parent.append(n('p',txt));};
 const safe=u=>{try{const x=new URL(u);return x.protocol==='https:'?x.href:null}catch{return null}};
 function render(s,today=new Date().toISOString().slice(0,10)){
 if(!s)return null;const article=n('section');article.className='qp-issue-story qp-investigative-story';article.append(n('h2',s.title));p(article,s.answer);p(article,'Evidence reviewed '+s.checked+(today>=s.reviewBy?' — review due; verify current conditions.':' — dated account, not live verification.'));
 for(const part of s.parts){const section=n('section');section.append(n('h3',part.heading));for(const line of part.paragraphs)p(section,line);if(part.note)p(section,part.note);
 for(const f of part.facts||[]){const row=n('p');row.append(n('strong',f.label+': '+f.value),document.createTextNode(' · '+f.stage));const src=s.sources.find(x=>x.id===f.source);if(src){const u=safe(src.url);if(u){const a=n('a',' [source]');a.href=u;row.append(a);}}section.append(row);}
 if(part.stages?.length){const d=n('details');d.append(n('summary','Follow the funding and decision stages'));for(const line of part.stages)p(d,line);section.append(d);}
 if(part.options?.length){const d=n('details');d.append(n('summary','Compare alternatives and tradeoffs'));for(const x of part.options){p(d,x.option+' — '+x.tradeoff);p(d,'Responsible role to confirm: '+x.owner+'. Verify: '+x.verification);}section.append(d);}
 if(part.unknowns?.length){const d=n('details');d.open=true;d.append(n('summary','What remains unknown and what evidence would resolve it'));for(const line of part.unknowns)p(d,line);section.append(d);}article.append(section);}
 const d=n('details');d.append(n('summary','Original source records'));for(const src of s.sources){const u=safe(src.url);if(u){const a=n('a',src.title);a.href=u;const row=n('p');row.append(a);d.append(row);}}article.append(d);p(article,s.boundary);return article;
 }root.QPInvestigativeStoryView={render};
})(window);
