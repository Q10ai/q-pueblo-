/* Q Pueblo living-report static public register — no PII, telemetry or private registry access. */
(function(){
  'use strict';
  function validEntry(e){
    if (!e || e.status!=='PUBLIC_APPROVED' || !/^[a-z0-9-]{2,80}$/i.test(e.slug||'')) return false;
    if (typeof e.title!=='string' || e.title.length>160 || typeof e.version!=='string') return false;
    if (!/^\d{4}-\d\d-\d\d$/.test(e.as_of||'') || !/^\d{4}-\d\d-\d\d$/.test(e.review_due||'')) return false;
    if (!Array.isArray(e.unknowns) || e.unknowns.some(x=>typeof x!=='string')) return false;
    if (!e.approval_receipt_id || !/^[a-z0-9-]{6,100}$/i.test(e.approval_receipt_id)) return false;
    if (e.public_file !== 'reports.html?report='+e.slug) return false;
    return true;
  }
  function isStale(e, today){ return e.review_due < today; }
  window.QP_LIVING_REPORTS={validEntry,isStale};
  var list=document.getElementById('qpl-list');
  if(!list) return;
  function para(s){var p=document.createElement('p'); p.textContent=s; return p;}
  function render(data){
    list.replaceChildren();
    if(!data || data.schema!=='qp-public-living-report-registry-v1' || !Array.isArray(data.reports)) {
      list.append(para('Public register is unavailable. See existing dated reports.')); return;
    }
    var seen=new Set();
    var approved=data.reports.filter(function(e){
      if(!validEntry(e) || seen.has(e.slug)) return false;
      seen.add(e.slug);return true;
    });
    if(!approved.length){list.append(para('No additional approved living reports in this dated register yet. Existing Qified reports remain available through the link below.'));return;}
    var today=new Date().toISOString().slice(0,10);
    approved.forEach(function(e){
      var section=document.createElement('section'); section.className='qpl-card';
      var heading=document.createElement('h3'); var link=document.createElement('a');
      link.href=e.public_file;link.textContent=e.title;heading.append(link);section.append(heading);
      section.append(para('Version '+e.version+' · Evidence as of '+e.as_of+(isStale(e,today)?' · REFRESH DUE':' · within stated review window')));
      section.append(para('Known limitations: '+(e.unknowns.length?e.unknowns.join('; '):'None recorded in public summary; consult full report.')));
      list.append(section);
    });
  }
  fetch('data/qp-public-living-report-registry.json',{credentials:'omit',cache:'no-cache'})
    .then(function(r){if(!r.ok) throw new Error('read failed');return r.json();})
    .then(render)
    .catch(function(){render(null);});
})();
