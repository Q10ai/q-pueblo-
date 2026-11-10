'use strict';
(function(root){
  const data=root&&root.QP_RESIDENT_EVIDENCE;
  const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
  const percentage=(amount,total)=>100*amount/total;
  const sum=a=>a.reduce((s,x)=>s+x.amount,0);
  const budgetValid=b=>!!b&&Array.isArray(b.groups)&&b.groups.length>0&&
    b.groups.every(x=>Number.isSafeInteger(x.amount)&&x.amount>=0)&&sum(b.groups)===b.total;
  const countyStats=items=>({total:items.length,complete:items.filter(x=>x[2]==='Complete').length,
    underway:items.filter(x=>x[2]==='Underway').length,waiting:items.filter(x=>x[2]==='Waiting').length});
  const comparison=(budget,a,b)=>{
    if(!budgetValid(budget))throw Error('Budget totals do not reconcile');
    const A=budget.groups.find(x=>x.id===a),B=budget.groups.find(x=>x.id===b);
    if(!A||!B)throw Error('Unknown appropriation category');
    return {a:A,b:B,total:budget.total,delta:A.amount-B.amount,
      shareA:percentage(A.amount,budget.total),shareB:percentage(B.amount,budget.total),
      spread:Math.abs(A.amount-B.amount),basis:'Adopted FY2026 appropriation only. This does not report actual spending.'};
  };
  const core=Object.freeze({sum,budgetValid,countyStats,comparison});
  if(typeof module!=='undefined'&&module.exports)module.exports=core;
  if(root)root.QP_RESIDENT_EVIDENCE_CORE=core;
  if(typeof document==='undefined'||!data)return;
  const byId=id=>document.getElementById(id);
  const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined&&text!==null)e.textContent=String(text);if(cls)e.className=cls;return e};
  const link=(label,url)=>{const a=el('a',label);if(/^https:\/\/[^<>"' ]+$/i.test(url)){a.href=url;a.target='_blank';a.rel='noopener noreferrer'}return a};
  const fmtPct=n=>n.toFixed(2)+'%';
  const budget=data.budget,county=data.county;
  let reports=[];
  if(!budgetValid(budget)||countyStats(county.initiatives).total!==26) {
    byId('desk-status').textContent='Evidence snapshot failed reconciliation. Figures are not displayed.';
    return;
  }
  const heading=(tag,value)=>el(tag,value);
  function budgetDisplay(){
    const container=byId('budget-rows');container.replaceChildren();
    budget.groups.forEach(item=>{
      const row=el('div',null,'budget-row');
      const top=el('div',null,'budget-row-label');
      top.append(el('strong',item.name),el('span',money(item.amount)+' · '+fmtPct(percentage(item.amount,budget.total))));
      const rail=el('div',null,'budget-rail'),bar=el('div',null,'budget-bar');
      bar.style.width=percentage(item.amount,budget.total).toFixed(4)+'%';
      bar.setAttribute('aria-label',item.name+': '+fmtPct(percentage(item.amount,budget.total))+' of FY2026 adopted General Fund');
      rail.append(bar);row.append(top,rail);container.append(row);
    });
    byId('budget-total').textContent=money(budget.total);
    const a=byId('desk-a'),b=byId('desk-b');
    budget.groups.forEach((g,i)=>{for(const c of [a,b]){const option=el('option',g.name);option.value=g.id;c.append(option)}});
    a.value='police';b.value='fire';
    const show=()=>{
      const c=comparison(budget,a.value,b.value);
      const d=c.delta===0?'equal appropriations':(c.delta>0?'higher':'lower')+' by '+money(c.spread);
      byId('desk-compare-result').textContent=c.a.name+': '+money(c.a.amount)+' ('+fmtPct(c.shareA)+') versus '+c.b.name+': '+money(c.b.amount)+' ('+fmtPct(c.shareB)+'). '+c.a.name+' is '+d+'. These are enacted budget figures, not cash paid.';
    };
    a.addEventListener('change',show);b.addEventListener('change',show);show();
  }
  function countyDisplay(){
    const stats=countyStats(county.initiatives);
    byId('county-totals').textContent=stats.total+' priorities · '+stats.complete+' complete · '+stats.underway+' underway · '+stats.waiting+' waiting · snapshot August 8, 2026';
    const status=byId('county-status'),portfolio=byId('county-portfolio');
    const portfolios=[...new Set(county.initiatives.map(x=>x[1]))].sort();
    portfolios.forEach(p=>{const o=el('option',p);o.value=p;portfolio.append(o)});
    const show=()=>{
      const selected=county.initiatives.filter(x=>(status.value==='all'||x[2]===status.value)&&(portfolio.value==='all'||x[1]===portfolio.value));
      const list=byId('county-list');list.replaceChildren();
      selected.forEach(x=>{
        const li=el('li',null,'county-entry');
        li.append(heading('strong',x[0]),el('span',x[1]+' · '+x[2]+' (County-reported August 2026)'));
        list.append(li);
      });
      byId('county-match').textContent=selected.length+' of 26 published initiatives match these filters. This is not proof of completion or expenditure.';
    };
    status.addEventListener('change',show);portfolio.addEventListener('change',show);show();
  }
  function showReports(){
    const q=byId('desk-search').value.trim().toLowerCase();
    const found=reports.filter(r=>[r.title,r.summary,r.topic,r.id,...(r.keyFacts||[]).map(x=>x.label+' '+x.value)].join(' ').toLowerCase().includes(q));
    const out=byId('desk-reports');out.replaceChildren();
    found.forEach(r=>{
      const card=el('article',null,'desk-report');
      const status=el('span',r.stage,'desk-kicker');
      const h=heading('h3',r.title);
      const p=el('p',r.summary);
      const jump=el('a','Open complete dated evidence packet');
      jump.href='reports.html?report='+encodeURIComponent(r.slug);
      const foot=el('p','Checked '+(r.sourceChecked||r.date)+' · review due '+(r.reviewDue||'unassigned')+' · '+r.sources.length+' originating source link(s). Not a current independent audit.','desk-meta');
      card.append(status,h,p,foot,jump);out.append(card);
    });
    byId('desk-search-count').textContent=found.length+' of '+reports.length+' published brief(s) match. The catalog is finite; this is not live search.';
    if(!found.length)out.append(el('p','No dated published brief matches. This does not establish that the topic or claim is false.'));
  }
  function reportLoad(){
    return fetch('data/q-pueblo-qified-reports-v2-2026-11-09.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(x=>{
      if(!Array.isArray(x.reports)||x.reports.length<14)throw Error('Incomplete published brief library');
      reports=x.reports.filter(r=>r.id&&r.slug&&Array.isArray(r.sources));showReports();
    }).catch(()=>{byId('desk-search-count').textContent='The fourteen published analyses could not be loaded. Open Reports directly; do not treat this as an empty evidence library.'});
  }
  function docket(){
    const list=byId('desk-docket');list.replaceChildren();
    data.reviewDocket.forEach(r=>{
      const article=el('article',null,'desk-docket-item');
      article.append(el('p',r.id+' · '+r.state,'desk-kicker'),heading('h3',r.title),
        el('p',r.summary),el('p','Next check: '+r.next),link('Inspect originating ordinance',r.source));
      list.append(article);
    });
  }
  function receipt(){
    const a=comparison(budget,byId('desk-a').value,byId('desk-b').value);
    const matching=county.initiatives.filter(x=>(byId('county-status').value==='all'||x[2]===byId('county-status').value)&&
      (byId('county-portfolio').value==='all'||x[1]===byId('county-portfolio').value));
    return [
      '# Q-Pueblo — dated resident evidence receipt',
      'Generated locally: '+new Date().toISOString(),
      'Snapshot: '+data.snapshot+'; status: ORIGINAL-SOURCE SNAPSHOT / NOT INDEPENDENTLY AUDITED.',
      '',
      '## Adopted City FY2026 General Fund',
      'Source: '+budget.source,
      'Ordinance: '+budget.ordinance+'; adopted: '+budget.adopted+'; stage: '+budget.stage,
      'Total: '+money(budget.total),
      ...budget.groups.map(x=>'- '+x.name+': '+money(x.amount)+' ('+fmtPct(percentage(x.amount,budget.total))+')'),
      '',
      'Comparison: '+a.a.name+' '+money(a.a.amount)+' vs '+a.b.name+' '+money(a.b.amount)+'. Absolute difference '+money(a.spread)+'.',
      'Important: Not actual paid expenditure; categories are parts of one adopted total and must not be added to other accounting stages.',
      '',
      '## Pueblo County published priorities',
      'Source: '+county.source,
      'Displayed update: '+county.updated+'; stage: '+county.stage,
      'Filter matched: '+matching.length+' / 26; original overall count: 1 Complete, 22 Underway, 3 Waiting.',
      ...matching.map(x=>'- '+x[0]+' | '+x[1]+' | '+x[2]),
      '',
      '## Open evidence challenge',
      ...data.reviewDocket.map(x=>'- '+x.id+': '+x.summary+' Source: '+x.source),
      '',
      'No private query was transmitted by this page. Source URLs are navigation links, not a live synchronization feed.',
      'Human review required for any new public conclusion.'
    ].join('\n');
  }
  byId('desk-download').addEventListener('click',()=>{
    const blob=new Blob([receipt()],{type:'text/markdown;charset=utf-8'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='Q-Pueblo-resident-evidence-receipt-2026-11-10.md';
    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  byId('desk-search').addEventListener('input',showReports);
  budgetDisplay();countyDisplay();docket();
  reportLoad();
  byId('desk-status').textContent='Dated records loaded. City budget categories reconcile to '+money(budget.total)+'; County index contains 26 entries. Neither is a live spending ledger.';
})(typeof window!=='undefined'?window:null);
