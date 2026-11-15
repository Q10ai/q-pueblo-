'use strict';
(() => {
  // Static route checks. No input, credentials, storage, analytics, publication, or external requests.
  const releaseId = 'QP-PUBLIC-2026-11-14-ILLUSTRATED-R2';
  const assets = [
    ['release-manifest.json', releaseId, 'json'],
    ['index.html', 'Get to Know Pueblo', 'text'],
    ['assets/pueblo-riverwalk-hero.webp', null, 'image'],
    ['assets/pueblo-riverwalk-hero-mobile.webp', null, 'image'],
    ['assets/pueblo-entry-art.webp', null, 'image'],
    ['assets/pueblo-report-art.webp', null, 'image'],
    ['public-experience.css', 'qp-art-card', 'text'],
    ['home-search.js', 'data-search-mode', 'text'],
    ['assets/q-pueblo-approved-logo.jpg', null, 'image'],
    ['launch-system.css', '.qp-site-header', 'text'],
    ['launch-system.js', 'qp-menu-toggle', 'text'],
    ['issues.html', 'Issue Index', 'text'],
    ['reports.html', 'Qified Reports', 'text'],
    ['qify.html', 'Find dated research answers', 'text'],
    ['project-falcon.html', 'Civic Decision Timeline', 'text'],
    ['reports-static.html', 'Read Pueblo research', 'text'],
    ['about.html', 'About Q-Pueblo', 'text'],
    ['sitemap.xml', 'urlset', 'text'],
    ['q-tools.html', 'Q Tools | Q-Pueblo', 'text'],
    ['q-tools.js', 'QP_TOOLS_CORE', 'text'],
    ['workbench.html', 'Q Pueblo Workbench', 'text'],
    ['entities.html', 'Institutions', 'text'],
    ['updates.html', 'Updates', 'text'],
    ['participate.html', 'Contribute', 'text'],
    ['es.html', 'lang="es"', 'text'],
    ['api/v1/capabilities.json', 'server_side_contribution_intake', 'json'],
    ['now.html', "What's Happening Now", 'text'],
    ['areas.html', 'Eight ways to understand Pueblo', 'text'],
    ['connections.html', 'Pueblo Connections — How it all connects', 'text'],
    ['connections.js', 'Public static graph exploration', 'text'],
    ['case-library.html', 'Explore more Pueblo issues', 'text'],
    ['discover.html', 'Discover &amp; Play', 'text'],
    ['rumor-mill.html', 'Rumor Mill', 'text'],
    ['learn-pueblo.html', 'Learn Pueblo', 'text'],
    ['resource-library.html', 'Resource Library', 'text'],
    ['learning-library.html', 'Learning Library &amp; Classrooms', 'text'],
    ['subject-learning.js', 'subject-choice', 'text'],
    ['data/qp-resource-registry.js', 'QPResource', 'text'],
    ['hot-topics.html', 'Hot Topics &amp; Continuing Stories', 'text'],
    ['who-governs.html', 'Who governs?', 'text'],
    ['follow-money.html', 'Follow the Money', 'text'],
    ['investigative-story-core.js', 'QPInvestigativeStory', 'text'],
    ['finance-visual-core.js', 'QPFinanceVisual', 'text'],
    ['data/qp-story-editions.js', 'infr-005', 'text'],
    ['data/qp-discoveries.js', 'QPDiscovery', 'text'],
    ['decision-tools.html', 'Evidence time machine', 'text'],
    ['guided-tools-core.js', 'QPGuidedTools', 'text'],
    ['tool-visuals.js', 'QPToolVisual', 'text'],
    ['assets/pueblo-mark.webp', null, 'image'],
    ['ai-learn.html', 'AI, QIFY', 'text'],
    ['rx.html', 'Q-RX', 'text'],
    ['twin.html', 'Twin Pueblo', 'text'],
    ['exit.html', 'Your Work', 'text'],
    ['experience.css', 'qp-exp-card', 'text'],
    ['data/qp-three-hop-2026-11-13.json', '211', 'json'],
    ['data/qp-now-2026-11-13.json', '2026-11-13', 'json'],
    ['release-check.js', 'QP-PUBLIC-2026-11-14-ILLUSTRATED-R2', 'text']
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
