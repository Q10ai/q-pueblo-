'use strict';
(function(root){
 const key=x=>String(x??'').trim().toUpperCase();
 const date=x=>/^\d{4}-\d{2}-\d{2}$/.test(String(x??''))?x:'';
 const priority={
 'REG-023':'Data centers and regional resource capacity',
 'REG-009':'Museum funding and public value',
 'REG-028':'Zoo funding, learning and conservation',
 'REG-069':'Public budgets and service continuity',
 'REG-063':'Election-linked funding and authority',
 'REG-071':'Election and governance transition',
 'REG-025':'Disaster recovery and human impacts',
 'REG-067':'Post-fire flooding and watershed recovery',
 'REG-068':'Housing and essential services',
 'REG-020':'Public safety and service outcomes',
 'REG-057':'Behavioral health and care capacity',
 'REG-001':'Public money and economic development',
 'REG-004':'Regional economic development transition',
 'REG-007':'Industrial development and public value',
 'REG-021':'Regional water reliability',
 'REG-061':'Water and wastewater capacity',
 'REG-064':'Energy affordability and reliability',
 'REG-072':'Industrial and workforce transition',
 'REG-074':'Permitting and development continuity',
 'REG-049':'Nonprofit services and public allocations',
 'REG-019':'Child and family protection',
 'REG-047':'Public safety technology and privacy',
 'REG-032':'Regional continuity and preparedness'
 };
 function makeIndex(legacy,graph,reports,cfg){
 const byReport=new Map(reports.map(r=>[r.slug,r])),byLegacy=new Map(legacy.issues.map(i=>[key(i.id),i])),byGraph=new Map(graph.issues.map(i=>[key(i.id),i]));
 const lookup=new Map();for(const r of reports)for(const id of r.issueIds||[]){const k=key(id);if(!lookup.has(k))lookup.set(k,[]);lookup.get(k).push(r);}
 const updates=new Map();for(const u of cfg.lifecycle?.updates||[])for(const id of u.topicIds||[]){const k=key(id);if(!updates.has(k))updates.set(k,[]);updates.get(k).push(u);}
 function story(id){
 const k=key(id),l=byLegacy.get(k),g=byGraph.get(k);if(!l&&!g)return null;
 const direct=lookup.get(k)||[],mapped=byReport.get(cfg.reportMap?.[l?.id??id]),rs=[...new Map([...direct,...(mapped?[mapped]:[])].map(r=>[r.slug,r])).values()];
 const narrative=typeof window!=='undefined'?window.QPStoryEditions?.byId(k):null;
 const us=updates.get(k)||[],recheck=[date(narrative?.checked),...rs.map(r=>date(r.sourceChecked)),...us.map(u=>date(u.checkedDate))].filter(Boolean).sort().at(-1)||'';
 return {id:l?.id||g.id,title:l?.title||g.title,category:l?.category||g.category,scope:l?.domain||g.category,historyDate:date(l?.lastReviewed)||date(g?.source_date),evidenceDate:recheck,priority:priority[k]||'',narrative,reports:rs.map(r=>({report:r,relation:direct.includes(r)?'Issue-linked dated analysis — scope may be narrower':'Editorially cross-linked companion — not proof of this issue'})),updates:us,sourceLeads:[...new Set([...(l?.availableSourceUrls||[]),g?.source_url].filter(Boolean))],graphId:g?.id||null,state:narrative||direct.length||us.length?'DATED_EVIDENCE':rs.length?'COMPANION_ONLY':'RESEARCH_GAP'};
 }
 return {story};
 }
 function order(rows,sort){
 return rows.slice().sort((a,b)=>{
 const evidence=(b.evidenceDate||'').localeCompare(a.evidenceDate||'');
 const history=(b.historyDate||'').localeCompare(a.historyDate||'');
 if(sort==='priority'){const p=Number(!!b.priority)-Number(!!a.priority);if(p)return p; if(evidence)return evidence;}
 if(sort==='newest'&&evidence)return evidence;
 if(sort==='indexed'&&history)return history;
 if(sort==='evidence'){const rating=x=>x.state==='DATED_EVIDENCE'?2:x.state==='COMPANION_ONLY'?1:0;const p=rating(b)-rating(a);if(p)return p;if(evidence)return evidence;}
 if(sort!=='title'&&history)return history;
 return a.title.localeCompare(b.title)||a.id.localeCompare(b.id);
 });
 }
 const api={makeIndex,order};if(root)root.QPIssueStory=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:null);
