import {createRequire} from 'node:module';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(path.join(process.env.AUDIT_TOOLS,'package.json'));
const {chromium}=require('playwright');
const axe=require('axe-core');
const browser=await chromium.launch({headless:true});
const routes=['/','/governance.html','/qify.html','/reports-static.html','/report-food-assistance.html','/now.html','/q-tools.html','/es.html','/method.html','/learn-pueblo.html','/twin.html','/participate.html','/areas.html','/connections.html','/topics.html'];
const rows=[];
const failures=[];
try{
 for(const width of [320,360,390,768,1280]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  await context.route('**/*',route=>new URL(route.request().url()).origin==='http://127.0.0.1:8765'?route.continue():route.abort());
  for(const route of routes){
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.name));
   try{
    const response=await page.goto('http://127.0.0.1:8765'+route,{waitUntil:'networkidle',timeout:30000});
    assert(response?.ok(),route+' HTTP');
    const layout=await page.evaluate(()=>({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,h1:[...document.querySelectorAll('h1')].filter(el=>el.getBoundingClientRect().width>1&&el.getBoundingClientRect().height>1).length,lang:document.documentElement.lang,fcp:Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime??0)}));
    await page.evaluate(axe.source);
    const a=await page.evaluate(async()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
    const issues=a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length}));
    const row={route,width,layout,errors,issues};rows.push(row);console.log(JSON.stringify(row));
    if(layout.scrollWidth>layout.width+2||!layout.h1||errors.length||issues.some(v=>['critical','serious'].includes(v.impact)))failures.push(route+' @'+width);
    if(route==='/' && width<=760){const header=await page.evaluate(()=>{const b=e=>e.getBoundingClientRect();const hero=document.querySelector('.qp-v3-hero'),img=hero.querySelector('img'),caption=hero.querySelector('.qp-mobile-hero-caption'),nav=document.querySelector('.qp-v3-nav'),word=nav.querySelector('.qp-v3-wordmark'),menu=nav.querySelector('.qp-v3-menu'),logo=word.querySelector('img'),primary=[...document.querySelectorAll('#entryways .qp-entry-art')]; const inside=e=>b(e).left>=-1&&b(e).right<=document.documentElement.clientWidth+1;return {source:img.currentSrc,natural:img.naturalWidth/img.naturalHeight,ratio:b(img).width/b(img).height,heroHeight:b(img).height,primaryHeight:Math.max(...primary.map(e=>b(e).height)),contained:[hero,img,caption,nav,word,menu,logo].every(inside),wordMenuClear:b(word).right<=b(menu).left+1,captionVisible:b(caption).height>0,logoRatio:b(logo).width/b(logo).height};});console.log('MOBILE_HEADER',width,JSON.stringify(header));assert(header.source.endsWith('q-pueblo-approved-logo.jpg'));assert(Math.abs(header.natural-header.ratio)<.02,'Logo preserves native proportions');assert(header.heroHeight>=header.primaryHeight,'Header artwork is primary');assert(header.contained&&header.wordMenuClear&&header.captionVisible,'Header and caption fit viewport without overlap');assert(Math.abs(header.logoRatio-1)<.03,'Navigation emblem is not squished');}
    if(route==='/'){
     const art=await page.evaluate(async()=>{
      const grid=document.querySelector('#entryways .qp-entry-grid');
      const cards=[...grid.querySelectorAll('.qp-entry-card')];
      const entries=[...grid.querySelectorAll('.qp-entry-art')];
      const major=[...document.querySelectorAll('#governance-intelligence h3 > .qp-subject-icon[data-qp-art]')];const collapsed=[...document.querySelectorAll('#governance-intelligence .qp-issue-more')];
      const checkImage=async(e)=>{const ratio=e.closest('#entryways')&&window.innerWidth<=760?3/4:2/3;const c=getComputedStyle(e),b=e.getBoundingClientRect(),u=c.backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1];if(!u)return false;try{const im=new Image();im.src=u;await im.decode();return b.width>0&&b.height>0&&Math.abs(b.height-b.width*ratio)<=2&&im.naturalWidth>=192&&im.naturalHeight>=192;}catch{return false;}};
      return {columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,primaryMinHeight:Math.min(...entries.map(e=>e.getBoundingClientRect().height)),issueMaxHeight:Math.max(...major.map(e=>e.getBoundingClientRect().height)),cards:cards.length,entryDistinct:new Set(entries.map(e=>getComputedStyle(e).backgroundImage)).size,fullWidth:entries.every(e=>Math.abs(e.getBoundingClientRect().width-e.parentElement.clientWidth)<=2),major:major.length,majorDistinct:new Set(major.map(e=>e.dataset.qpArt)).size,collapsed:collapsed.length===10&&collapsed.every(d=>!d.open),images:(await Promise.all([...entries,...major].map(checkImage))).every(Boolean),majorTiles:major.every(e=>!!e.closest('a.qp-major-tile[href]')&&e.getBoundingClientRect().width>=112),issueColumns:getComputedStyle(document.querySelector('#governance-intelligence>.qp-gov-grid')).gridTemplateColumns.split(' ').length};
     });
     console.log('HOME_ART',width,JSON.stringify(art));
     assert.equal(art.columns,width<=760?2:4);if(width<=760)assert(art.primaryMinHeight>art.issueMaxHeight+10,'Primary artwork must be visibly larger than issue artwork');assert.equal(art.cards,8);assert.equal(art.entryDistinct,8);assert(art.fullWidth,'Artwork spans full card width');assert.equal(art.major,10);assert.equal(art.majorDistinct,10);const connected=await page.locator('#governance-intelligence .qp-issue-connections').evaluateAll(groups=>groups.map(g=>({links:g.querySelectorAll('a.qp-issue-link[href]').length,art:g.querySelectorAll('a.qp-issue-link > [data-qp-art]').length})));assert.equal(connected.length,10);assert.equal(connected.reduce((n,g)=>n+g.links,0),35);assert(connected.every(g=>g.links===g.art&&g.links>=3));assert(art.images,'Landscape tile geometry and local image loading');assert(art.majorTiles,'Prominent clickable major artwork');assert(art.collapsed,'Compact default issue grid');if(width<=760)assert.equal(art.issueColumns,2);const disclosure=page.locator('#governance-intelligence .qp-issue-more').first();await disclosure.locator('summary').click();assert(await disclosure.evaluate(d=>d.open));const linked=await disclosure.locator('.qp-linked-art').evaluateAll(es=>es.every(e=>{const b=e.getBoundingClientRect();return b.width>=64&&Math.abs(b.width-e.parentElement.clientWidth)<=2&&Math.abs(b.height-b.width*2/3)<=2;}));assert(linked,'Expanded related illustrations fill tiles');await disclosure.locator('summary').click();
    }
    if(route==='/areas.html'&&width<=760){const areas=await page.locator('.qp-exp-section[id]>h2>.qp-subject-icon').evaluateAll(es=>es.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})));assert.equal(areas.length,8);assert(areas.every(x=>Math.abs(x.w-68)<=2&&Math.abs(x.h-x.w*2/3)<=2));}
    if(route==='/topics.html'){const t=await page.locator('.topic-card .qp-topic-tile[href] h2 > [data-qp-art]').evaluateAll(async es=>Promise.all(es.map(async e=>{const r=e.getBoundingClientRect(),url=getComputedStyle(e).backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1];try{const im=new Image();im.src=url;await im.decode();return r.width>=100&&Math.abs(r.height-r.width*2/3)<=2&&im.naturalWidth>=192;}catch{return false;}})));assert.equal(t.length,10);assert(t.every(Boolean),'All ten topic artworks are visible, linked and loaded');}
    if(route==='/now.html'){
     const ids=await page.locator('#new-findings article[id^="novdec-priority-"] h3 > [data-qp-art]').evaluateAll(es=>es.map(e=>e.dataset.qpArt));
     assert.equal(ids.length,8);assert.equal(new Set(ids).size,8);assert.equal(await page.locator('#new-findings article[id^="novdec-priority-"] > a.qp-major-tile[href]').count(),8);assert.equal(await page.locator('#new-findings article[id^="novdec-priority-"] > details.qp-issue-more:not([open])').count(),8);
    }
    if(route==='/'&&width===360){const positions=await page.evaluate(()=>{const rect=s=>document.querySelector(s).getBoundingClientRect();return {heroTop:rect('.qp-v3-hero').top,heroBottom:rect('.qp-v3-hero').bottom,introTop:rect('.qp-home-intro').top,introHeight:rect('.qp-home-intro').height,entryTop:rect('#entryways').top,entryBottom:rect('#entryways').bottom,searchTop:rect('#home-q').top,searchBottom:rect('#home-q').bottom}});console.log('HOME_LAYOUT',JSON.stringify(positions));assert(positions.heroTop<positions.introTop&&positions.heroBottom<=positions.introTop,'Banner first');assert(positions.introHeight<=180,'Compact intro');assert(positions.introTop<positions.entryTop&&positions.entryBottom<positions.searchTop,'Eight entryways before search');const menu=page.locator('#qp-menu-toggle');if(await menu.isVisible()){await menu.focus();await page.keyboard.press('Enter');assert.equal(await menu.getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await menu.getAttribute('aria-expanded'),'false');}}
   }catch(e){failures.push(route+' @'+width);console.error('BROWSER CHECK',route,width,e.message);}finally{await page.close();}
  }
  await context.close();
 }
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:900}});
 const p=await nojs.newPage();await p.goto('http://127.0.0.1:8765/reports-static.html');assert(await p.locator('a[href="report-food-assistance.html"]').isVisible());await p.locator('a[href="report-food-assistance.html"]').click();assert(await p.locator('h1').isVisible());await nojs.close();
}finally{await browser.close();}
console.log(JSON.stringify({tested:rows.length,failed:failures,scope:'Local Chromium rendering, automatic axe rules, no-JS report path and keyboard menu. Not a live-network performance, full manual accessibility or security audit.'}));
if(failures.length)process.exitCode=1;
