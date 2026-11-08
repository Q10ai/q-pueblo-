#!/usr/bin/env node
"use strict";
/* Q-Pueblo draft static-publication integrity audit.
   Coverage: referential integrity, navigation, schema and safety controls.
   DOES NOT certify current facts, legal claims, security penetration, or visual fidelity. */
const fs = require("node:fs");
const assert = require("node:assert/strict");
const path = require("node:path");
const root = path.join(__dirname, "..");
const read = name=>fs.readFileSync(path.join(root,name),"utf8");
const atlas = read("public/research-atlas.js");
const idx = atlas.indexOf("const D=");
const end = atlas.indexOf(";\nconst ITEMS=",idx);
assert(idx>=0 && end>idx,"Atlas JSON block must exist before const ITEMS");
const D=JSON.parse(atlas.slice(idx+"const D=".length,end));
const T=JSON.parse(read("SITE-TAXONOMY.json"));
const html=read("public/research-atlas.html");
const home=read("public/index.html");
const headers=read("public/_headers");
const errors=[];
const warn=[];
const unique=(arr,label)=>{const s=new Set();for(const x of arr){if(s.has(x))errors.push("duplicate "+label+": "+x);s.add(x)}return s};
assert(Array.isArray(D.issues)&&D.issues.length>0,"Atlas contains issues");
assert(D.entities && typeof D.entities==="object","Atlas entities present");
assert(D.sources && typeof D.sources==="object","Atlas source directory present");
const issues=unique(D.issues.map(x=>x.id),"issue");
const entities=new Set(Object.keys(D.entities));
const sources=new Set(Object.keys(D.sources));
for(const x of D.issues){
 if(!x.t || !x.d || !x.g)errors.push("missing title/domain/geography "+x.id);
 if(!Array.isArray(x.e)||!Array.isArray(x.s))errors.push("missing entity/source arrays "+x.id);
 for(const e of x.e||[])if(!entities.has(e))errors.push("dangling entity "+x.id+" -> "+e);
 for(const s of x.s||[])if(!sources.has(s))errors.push("dangling source "+x.id+" -> "+s);
 if(!x.as)warn.push("issue needs dated snapshot: "+x.id);
 if(!(x.s||[]).length)warn.push("issue has no public source locator: "+x.id);
 if(!(x.e||[]).length)warn.push("issue has no public institutional association: "+x.id);
}
for(const [id,s] of Object.entries(D.sources)){
 if(!/^https:\/\//i.test(s.u))errors.push("source must use HTTPS: "+id);
 if(/[?&](access_token|secret|token|key|signature)=/i.test(s.u))errors.push("sensitive URL query token: "+id);
}
const allDomains=Array.from({length:31},(_,i)=>"QP-"+String(i).padStart(2,"0"));
const tileIds=unique(T.home_tiles.map(x=>x.id),"tile");
const present= new Set(T.home_tiles.flatMap(x=>x.domain_ids).concat(T.cross_cutting_domains.map(x=>x.id)));
for(const d of allDomains)if(!present.has(d))errors.push("unmapped archive domain: "+d);
for(const d of present)if(!allDomains.includes(d))errors.push("unknown domain identifier: "+d);
if(T.home_tiles.length!==10)errors.push("ten visual sections required to preserve provided visual layout");
if(!T.header_navigation.includes("Digital Twin")||!T.header_navigation.includes("Learn & Play"))errors.push("featured tools missing");
for(const token of ['id="detail"','id="search"','id="category"','id="area"','id="results"','id="matchcount"','src="research-atlas.js"','href="research-atlas.css"']){
 if(!html.includes(token))errors.push("missing HTML binding "+token);
}
for(const token of ['Quick answer','Essential facts','Evidence & money','Connections & effects','data-depth']){
 if(!atlas.includes(token))errors.push("missing progressive-disclosure UI "+token);
}
if(!home.includes("research-atlas.html"))errors.push("review homepage does not reach atlas");
if(!headers.includes("Content-Security-Policy"))errors.push("CSP unavailable");
const screenNames=new Set([...home.matchAll(/data-screen="([^"]+)"/g)].map(x=>x[1]));
const homeNav=[...home.matchAll(/data-go="([^"]+)"/g)].map(x=>x[1]);
for(const v of homeNav)if(!screenNames.has(v))warn.push("navigation target not listed as screen (review): "+v);
const entBackrefs=new Map([...entities].map(id=>[id,[]]));
const srcBackrefs=new Map([...sources].map(id=>[id,[]]));
for(const issue of D.issues){
 for(const e of issue.e||[])entBackrefs.get(e)?.push(issue.id);
 for(const s of issue.s||[])srcBackrefs.get(s)?.push(issue.id);
}
for(const [id,refs]of entBackrefs)if(refs.length===0)errors.push("orphan entity "+id);
for(const [id,refs]of srcBackrefs)if(refs.length===0)errors.push("orphan source "+id);
const related=new Set();
for(const refs of entBackrefs.values())if(refs.length>1)refs.forEach(x=>related.add(x));
const report={control:"QPueblo static atlas graph/route audit (NOT factual verification)",issues:issues.size,entities:entities.size,sources:sources.size,
  domains_mapped:present.size,home_tiles:tileIds.size,issue_with_shared_institution:related.size,
  issues_without_entity:D.issues.filter(x=>!x.e.length).length,
  issues_without_source:D.issues.filter(x=>!x.s.length).length,
  errors,warnings:warn.slice(0,20),warning_count:warn.length};
console.log(JSON.stringify(report,null,2));
if(errors.length)process.exit(1);