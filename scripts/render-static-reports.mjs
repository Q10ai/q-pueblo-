import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const dir=path.resolve('public'),read=f=>fs.readFileSync(path.join(dir,f),'utf8');
const scope={window:{}};vm.runInNewContext(read('report-core.js'),scope);const core=scope.window.QPReport;
const reports=JSON.parse(read('data/qp-current-reports.json')).reports;
const template=read('report-budget-2026.html');
const start=template.indexOf('<article class="qp-report-detail" id="qified-report">'),end=template.lastIndexOf('</article><p><a href="reports.html?report=');
if(start<0||end<start)throw Error('Static report template boundary missing');
const prefix=template.slice(0,start),suffix=template.slice(end);
const check=process.argv.includes('--check');let failures=0;
const output=(file,content)=>{const p=path.join(dir,file);if(check){if(!fs.existsSync(p)||fs.readFileSync(p,'utf8')!==content){console.error('STALE static report',file);failures++;}}else fs.writeFileSync(p,content);};
for(const r of reports){
 if(!/^[a-z0-9-]+$/.test(r.slug))throw Error('Invalid report slug');
 const title=core.esc(r.title),desc=core.esc(r.summary.slice(0,220)),url='https://qpueblo.pages.dev/report-'+r.slug;
 let pre=prefix.replace(/<title>[^<]*<\/title>/,'<title>'+title+' | Q-Pueblo</title>').replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="'+desc+'">').replace(/<meta property="og:title" content="[^"]*">/,'<meta property="og:title" content="'+title+'">').replace(/<meta property="og:description" content="[^"]*">/,'<meta property="og:description" content="'+desc+'">').replace(/<meta property="og:url" content="[^"]*">/,'<meta property="og:url" content="'+url+'">').replace(/<link rel="canonical" href="[^"]*">/,'<link rel="canonical" href="'+url+'">').replace(/<h1>[^<]*<\/h1>/,'<h1>'+title+'</h1>');
 pre=pre.replace(/<strong>Source checked:<\/strong> [^·]+ · <strong>Recheck due:<\/strong> [^<]+\./,'<strong>Source checked:</strong> '+core.esc(r.sourceChecked)+' · <strong>Recheck due:</strong> '+core.esc(r.reviewDue)+'.');
 const body=core.render(r).replace(/reports\.html\?report=([a-z0-9-]+)#qified-report/g,'report-$1.html').replace(/(<span data-qp-checked="[^"]+" data-qp-review-due="[^"]+">)[^<]*(<\/span>)/g,'$1Check the listed review date.$2');
 output('report-'+r.slug+'.html',pre+'<article class="qp-report-detail" id="qified-report">'+body+(r.slug==='county-budget-2027'?suffix.replace('</main>',"<section class=\"qp-container qp-v3-section\"><h2>Newer November 18 analysis</h2><p><a href=\"nov18-county-fiscal-recovery.html\">Read the expanded current fiscal recovery report</a>. Earlier figures on this page are preserved as a historical edition, not a replacement for the updated proposal.</p></section>"+'</main>'):suffix).replaceAll('report=budget-2026','report='+r.slug));
}
const directory=read('reports-static.html'),list='<ul id="qp-static-report-list">'+reports.map(r=>'<li><a href="report-'+r.slug+'.html">'+core.esc(r.title)+'</a> — source checked '+core.esc(r.sourceChecked)+'; recheck due '+core.esc(r.reviewDue)+'</li>').join('')+'</ul>';
const next=directory.replace(/<ul(?: id="qp-static-report-list")?><li><a href="report-[\s\S]*?<\/ul>/,list).replace(/(<span data-qp-count="reports">)\d+(<\/span>)/,(m,a,b)=>a+reports.length+b);
if(!next.includes(list))throw Error('Static directory boundary missing');
output('reports-static.html',next);
if(failures)process.exitCode=1;else console.log('PASS '+reports.length+' canonical reader-first static reports and directory are synchronized');
