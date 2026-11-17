import {createRequire} from 'node:module';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(path.join(process.env.AUDIT_TOOLS,'package.json'));
const {chromium}=require('playwright');
const axe=require('axe-core');
const browser=await chromium.launch({headless:true});
const routes=['/','/governance.html','/qify.html','/reports-static.html','/report-food-assistance.html','/now.html','/q-tools.html','/es.html','/method.html','/learn-pueblo.html','/twin.html','/participate.html'];
const rows=[];
const failures=[];
try{
 for(const width of [360,1280]){
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
