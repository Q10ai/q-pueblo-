'use strict';
(() => {
 const $=id=>document.getElementById(id), core=window.QPReport;
 let current=null;
 function render(report,userAction=false){
  current=report;
  for(const b of document.querySelectorAll('[data-report]'))b.setAttribute('aria-pressed',String(b.dataset.report===report.slug));
  $('qified-report').innerHTML=core.render(report);
  $('report-message').textContent='Selected: '+report.title+'.';
  for(const id of ['report-download','report-json','report-print','report-records'])$(id).disabled=false;
  const url=new URL(location.href);url.searchParams.set('report',report.slug);history.replaceState(null,'',url);
  if(userAction)$('qified-report').scrollIntoView({block:'start',behavior:'smooth'});
 }
 fetch('data/qp-current-reports.json').then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json();}).then(data=>{
  const reports=data.reports;if(!Array.isArray(reports)||!reports.length)throw Error('No reports');
  const artwork={"county-budget-2027":{"n":10,"t":"County budget 2027","d":"$38.55M lower proposed total before recommended General Fund reductions."},"food-assistance":{"n":5,"t":"Food assistance","d":"Text FOOD to 1-877-644-3663."},"d60-preschool-2026":{"n":18,"t":"District 60 preschool","d":"Direct enrollment, hours and family resources."},"aspen-recovery-costs":{"n":7,"t":"Aspen Acres recovery costs","d":"Dated recovery assistance and County cost figures."},"budget-2026": {"n": 0, "t": "2026 City budget", "d": "Budget authority and spending"}, "half-cent-2026": {"n": 1, "t": "Half-Cent Jobs Fund", "d": "What the jobs tax authorizes"}, "lime-road-costs": {"n": 2, "t": "Lime Road & St. Charles", "d": "Commitments, ownership and funding"}, "pueblo-boulevard-agenda": {"n": 3, "t": "Pueblo Boulevard", "d": "Project financing and agenda evidence"}, "water-budget-evidence": {"n": 4, "t": "Pueblo Water", "d": "Rates, budgets and financial records"}, "housing-pipeline": {"n": 5, "t": "Housing in Pueblo", "d": "From permits to occupied homes"}, "wastewater-2026": {"n": 6, "t": "Arkansas River sewage incident", "d": "Repair, testing and public health"}, "aspen-recovery": {"n": 7, "t": "Aspen Acres recovery", "d": "Disaster recovery and assistance"}, "city-mill-levy-2026": {"n": 8, "t": "Property tax & mill levy", "d": "Understand your city tax instrument"}, "csac-2027": {"n": 9, "t": "Nonprofit funding", "d": "2027 requests versus proposed support"}, "county-priorities-2026": {"n": 10, "t": "County priorities", "d": "Understand current county service priorities"}, "permits-jurisdiction": {"n": 11, "t": "Building permits", "d": "Who issues permits where?"}, "records-request": {"n": 12, "t": "Access public records", "d": "How to resolve a spending question"}, "pueblo-flood-history": {"n": 13, "t": "The 1921 Pueblo flood", "d": "Historical evidence and resilience"}};
  $('report-links').innerHTML=reports.map(r=>{const a=artwork[r.slug];return '<button type="button" class="qp-art-card qp-paper-card" data-report="'+core.esc(r.slug)+'" aria-pressed="false">'+(a?'<div class="qp-report-art art-report-'+a.n+'" aria-hidden="true"></div>':'')+'<div class="qp-art-caption"><strong>'+core.esc(a?.t||r.title)+'</strong><span>'+core.esc(a?.d||r.topic)+'</span></div></button>'}).join('');
  $('report-links').addEventListener('click',e=>{const b=e.target.closest('[data-report]');if(b)render(reports.find(r=>r.slug===b.dataset.report),true);});
  render(reports.find(r=>r.slug===new URLSearchParams(location.search).get('report'))||reports[0]);
  if(location.hash==='#original-sources')document.getElementById('original-sources')?.scrollIntoView({block:'start'});
  $('report-download').addEventListener('click',()=>core.download('q-pueblo-'+current.slug+'.md',core.markdown(current),'text/markdown;charset=utf-8'));
  $('report-json').addEventListener('click',()=>core.download('q-pueblo-'+current.slug+'.json',JSON.stringify({schema:data.schema,report:current},null,2),'application/json;charset=utf-8'));
  $('report-records').addEventListener('click',()=>core.download('q-pueblo-'+current.slug+'-records-draft.txt',core.requestDraft(current),'text/plain;charset=utf-8'));
  let oldDetails=[];window.addEventListener('beforeprint',()=>{oldDetails=[...document.querySelectorAll('#qified-report details')].map(d=>[d,d.open]);for(const [d] of oldDetails)d.open=true;});window.addEventListener('afterprint',()=>{for(const [d,o] of oldDetails)d.open=o;oldDetails=[]});$('report-print').addEventListener('click',()=>window.print());
 }).catch(()=>{$('report-message').textContent='Reports could not load. Try again or browse the research library.';});
})();
