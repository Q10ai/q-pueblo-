'use strict';
(()=>{
  const pre=document.getElementById('qt-report');if(!pre)return;
  const panel=document.createElement('section');panel.className='qp-qt-result-card';panel.setAttribute('aria-label','Plain-language tool result');panel.hidden=true;
  const heading=document.createElement('h3');heading.textContent='Your result';
  const verdict=document.createElement('p');verdict.className='qp-qt-verdict';
  const meta=document.createElement('p');meta.className='qp-qt-detail';
  const explanation=document.createElement('p');explanation.textContent='This is a reference result computed from values you entered. It is not an independent verification of the underlying evidence, dollar costs or public outcomes.';
  panel.append(heading,verdict,meta,explanation);pre.parentNode.insertBefore(panel,pre);
  const details=document.createElement('details');details.className='qp-qt-raw';const summary=document.createElement('summary');summary.textContent='Show detailed calculation and audit text';pre.parentNode.insertBefore(details,pre);details.append(summary,pre);
  function update(){const s=pre.textContent||'';if(!s||s==='Your results will appear here.'||s.startsWith('Correct the')){panel.hidden=true;return}
    panel.hidden=false;heading.textContent=s.split('\n')[0].replace(/^#+\s*/,'').slice(0,130)||'Q Tools output';
    const disp=s.match(/\*\*Disposition:\*\*\s*(.+)/i)||s.match(/Disposition:\s*(.+)/i);verdict.textContent=disp?'Result: '+disp[1].trim().replace(/\*\*/g,''):'A local report was generated. Read its inputs and qualifying conditions below.';
    const lines=s.split('\n').filter(x=>/T2Y score:|Absolute cost difference:|EE score:|Eligibility:|Lowest nominal total:|Least cost among eligible/i.test(x)).slice(0,7);
    meta.textContent=lines.join(' · ').replace(/\*\*/g,'')||'See detailed calculation for scores, constraints and evidence gates.';
  }
  new MutationObserver(update).observe(pre,{childList:true,characterData:true,subtree:true});update();
})();
