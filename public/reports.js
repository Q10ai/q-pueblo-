'use strict';
(() => {
 const $=id=>document.getElementById(id), core=window.QPReport;
 let current=null;
 function render(report,userAction=false){
  current=report;
  for(const b of document.querySelectorAll('[data-report]'))b.setAttribute('aria-pressed',String(b.dataset.report===report.slug));
  $('qified-report').innerHTML=core.render(report);
  $('report-message').textContent='Showing '+report.id+'. Source check '+report.sourceChecked+'; review due '+report.reviewDue+'.';
  for(const id of ['report-download','report-json','report-print','report-records'])$(id).disabled=false;
  const url=new URL(location.href);url.searchParams.set('report',report.slug);history.replaceState(null,'',url);
  if(userAction)$('qified-report').scrollIntoView({block:'start',behavior:'smooth'});
 }
 fetch('data/q-pueblo-qified-reports-v2-2026-11-09.json').then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json();}).then(data=>{
  const reports=data.reports;if(!Array.isArray(reports)||!reports.length)throw Error('No reports');
  $('report-links').innerHTML=reports.map(r=>'<button type="button" data-report="'+core.esc(r.slug)+'" aria-pressed="false"><small>'+core.esc(r.id)+'</small><strong>'+core.esc(r.title)+'</strong><small>'+core.esc(r.topic)+'</small></button>').join('');
  $('report-links').addEventListener('click',e=>{const b=e.target.closest('[data-report]');if(b)render(reports.find(r=>r.slug===b.dataset.report),true);});
  render(reports.find(r=>r.slug===new URLSearchParams(location.search).get('report'))||reports[0]);
  $('report-download').addEventListener('click',()=>core.download('q-pueblo-'+current.slug+'.md',core.markdown(current),'text/markdown;charset=utf-8'));
  $('report-json').addEventListener('click',()=>core.download('q-pueblo-'+current.slug+'.json',JSON.stringify({schema:data.schema,report:current},null,2),'application/json;charset=utf-8'));
  $('report-records').addEventListener('click',()=>core.download('q-pueblo-'+current.slug+'-records-draft.txt',core.requestDraft(current),'text/plain;charset=utf-8'));
  $('report-print').addEventListener('click',()=>window.print());
 }).catch(()=>{$('report-message').textContent='Reports could not load. Try again or open the packet and research library below.';});
})();
