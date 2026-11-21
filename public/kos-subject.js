'use strict';
/* KOS subject entry is a fail-closed navigator, not a pretend generative engine.
   It uses the editorial subject registry only to identify topics and known
   archive routes. Source-verified full papers are whitelisted separately. */
(async function(){
 const root=document.getElementById('kos-subject-entry');
 if(!root)return;
 const params=new URLSearchParams(location.search);
 const familyId=params.get('family');
 const rawTopic=params.get('topic');
 if(!familyId)return;
 const set=(id,value)=>document.getElementById(id).textContent=value;
 const attach=(ul,title,href)=>{
   const li=document.createElement('li');
   const a=document.createElement('a');a.textContent=title;a.href=href;
   li.append(a);ul.append(li);
 };
 const safeRoute=href=>/^(?:[a-z0-9-]+\/)*[a-z0-9-]+\.html(?:#[a-z0-9-]+)?$/i.test(href);
 try {
   const response=await fetch('data/qp-subject-families-2026-11-21.json',{credentials:'same-origin',cache:'no-store'});
   if(!response.ok)throw new Error('Registry unavailable');
   const data=await response.json();
   const family=(data.families||[]).find(f=>f.id===familyId);
   if(!family)throw new Error('Unknown family');
   const topicN=rawTopic===null?null:Number(rawTopic);
   const validTopic=topicN===null||(Number.isInteger(topicN)&&topicN>=0&&topicN<family.topics.length&&String(topicN)===rawTopic);
   if(!validTopic)throw new Error('Unknown topic');
   const subject=topicN===null?family.title:family.topics[topicN];
   set('kos-selected-title',subject);
   set('kos-selected-description','KOS connects the historical story, people, organizations, decisions, money, consequences and possible options for this subject. The subject must be checked against original sources before a full paper can be represented as complete.');
   const full=document.getElementById('kos-verified-story');
   const existing=(family.links||[]).filter(href=>href==='kos-story-pueblo-flood-1921.html');
   // Never substitute a broad family story for a distinct narrower question.
   const exactFlood=topicN===null && existing.length && ['history','environment','shock'].includes(familyId);
   if(exactFlood){
     full.hidden=false;
     const a=document.getElementById('kos-full-paper');
     a.href='kos-story-pueblo-flood-1921.html';
     a.textContent='Read the 1921 Pueblo flood contextual paper';
   }
   set('kos-entry-limit','The current public website does not yet run live KOS investigation or on-demand paper generation. The reading links below are background only, not independent verification of the selected subject. A complete new paper cannot be claimed until the original evidence is checked and the KOS service is enabled.');
   const links=document.getElementById('kos-archival-links');
   for(const href of family.links||[]){
     if(!safeRoute(href) || href==='kos-story-pueblo-flood-1921.html')continue;
     attach(links,href.replace(/^.*\//,'').replace(/\.html(?:#.*)?$/,'').replace(/-/g,' '),href);
   }
   document.getElementById('kos-archival-leads').hidden=!links.children.length;
 } catch {
   set('kos-selected-title','Subject entry unavailable');
   set('kos-selected-description','The selected subject could not be resolved from the local directory.');
   set('kos-entry-limit','Return to the subject families for a working route. This page does not generate a paper from an unverified query.');
   document.getElementById('kos-archival-leads').hidden=true;
 }
 root.hidden=false;
})();
