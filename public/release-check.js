'use strict';
(() => {
  // Static route checks. No input, credentials, storage, analytics, publication, or external requests.
  const releaseId = 'QP-PUBLIC-2026-11-13-EXPERIENCE-RC1';
  const assets = [
    ['release-manifest.json', releaseId, 'json'],
    ['index.html', 'Get to know Pueblo.', 'text'],
    ['assets/q-pueblo-header-wide.png', null, 'image'],
    ['assets/q-pueblo-approved-logo.jpg', null, 'image'],
    ['launch-system.css', '.qp-site-header', 'text'],
    ['launch-system.js', 'qp-menu-toggle', 'text'],
    ['issues.html', 'Issue Index', 'text'],
    ['reports.html', 'Qified Reports', 'text'],
    ['qify.html', 'Qify', 'text'],
    ['q-tools.html', 'Q Tools | Q-Pueblo', 'text'],
    ['q-tools.js', 'QP_TOOLS_CORE', 'text'],
    ['workbench.html', 'Q Pueblo Workbench', 'text'],
    ['entities.html', 'Institutions', 'text'],
    ['updates.html', 'Updates', 'text'],
    ['participate.html', 'Contribute', 'text'],
    ['es.html', 'lang="es"', 'text'],
    ['api/v1/capabilities.json', 'server_side_contribution_intake', 'json'],
    ['now.html', "What's Happening Now", 'text'],
    ['areas.html', 'Eight Ways to Understand Pueblo', 'text'],
    ['connections.html', 'Pueblo Connections: Three Hops', 'text'],
    ['connections.js', 'Public static graph exploration', 'text'],
    ['case-library.html', '20 Q-Pueblo Research Case Entry Points', 'text'],
    ['discover.html', 'Discover & Play', 'text'],
    ['rumor-mill.html', 'Rumor Mill', 'text'],
    ['ai-learn.html', 'AI, QIFY', 'text'],
    ['rx.html', 'Q-RX', 'text'],
    ['twin.html', 'Twin Pueblo', 'text'],
    ['exit.html', 'Your Work', 'text'],
    ['experience.css', 'qp-exp-card', 'text'],
    ['data/qp-three-hop-2026-11-13.json', '211', 'json'],
    ['data/qp-now-2026-11-13.json', '2026-11-13', 'json'],
    ['release-check.js', 'QP-PUBLIC-2026-11-13-EXPERIENCE-RC1', 'text']
  ];
  const $=id=>document.getElementById(id);
  const btn=$('run-check'),status=$('release-status'),list=$('release-results');
  async function run() {
    btn.disabled=true;
    list.textContent='';
    status.textContent='Checking '+assets.length+' assets from '+location.origin+'…';
    let passed=0;
    for(const [path,marker,kind] of assets) {
      const li=document.createElement('li');
      let good=false,desc='';
      try {
        const response=await fetch(path+'?releaseCheck='+encodeURIComponent(releaseId),{cache:'no-store',redirect:'follow'});
        good=response.ok;
        desc='HTTP '+response.status;
        if(good && kind==='image') {
          const type=(response.headers.get('content-type')||'').toLowerCase();
          const blob=await response.blob();
          good=type.startsWith('image/') && blob.size>1000;
          if(!good)desc+=' · invalid image';
        } else if(good) {
          const body=await response.text();
          if(marker && !body.includes(marker)) {good=false;desc+=' · wrong or stale content';}
          if(good && kind==='json') {try{JSON.parse(body);}catch{good=false;desc+=' · invalid JSON';}}
        }
      } catch {desc='Network request failed';}
      if(good)passed++;
      li.textContent=(good?'PASS — ':'FAIL — ')+path+' · '+desc;
      list.appendChild(li);
    }
    status.textContent=passed+'/'+assets.length+' assets matched on '+location.origin+'. '+(passed===assets.length?'Source assets are served; complete human functional and provenance checks before release.':'Publication is incomplete or stale. Do not claim this release is live.');
    btn.disabled=false;
  }
  btn.addEventListener('click',run);
  run();
})();
