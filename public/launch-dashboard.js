"use strict";
/* QPueblo public dashboard prototype: static navigation/guided workflows only.
   Never imply connected agents, live sources, submissions or digital-twin runtime. */
const CATEGORIES=[
 {id:"people",icon:"🏘️",name:"People, Places & Pueblo History",desc:"History · Neighborhoods · Quality of life",query:"Pueblo",count:"QP-01/02/04/27"},
 {id:"government",icon:"⚖️",name:"Government, Law & Civic Action",desc:"City · County · Districts · Elections",query:"governance",count:"QP-07/16/29"},
 {id:"money",icon:"🪙",name:"Follow the Money",desc:"Budgets · Contracts · Taxes · Incentives",query:"finance",count:"QP-13"},
 {id:"infrastructure",icon:"🏗️",name:"Housing, Land & Infrastructure",desc:"Roads · Buildings · Property · Growth",query:"infrastructure",count:"QP-10/17/18"},
 {id:"economy",icon:"📈",name:"Jobs, Business & Industry",desc:"Small Business · Steel · Wages · Investment",query:"workforce",count:"QP-11/12/13/28"},
 {id:"environment",icon:"💧",name:"Water, Energy & Environment",desc:"Water · Air · Utilities · Food Systems",query:"water",count:"QP-19/20/21"},
 {id:"health",icon:"🛡️",name:"Health, Safety & Families",desc:"Health · Recovery · Children · Civil Rights",query:"health",count:"QP-03/09/15/26"},
 {id:"culture",icon:"🎭",name:"Education, Culture & Community",desc:"History · Schools · Arts · Recreation",query:"education",count:"QP-04/05/06/08/14/22"},
 {id:"airport",icon:"✈️",name:"Transportation, Airport & Connections",desc:"Aviation · Rail · Mobility · Region",query:"airport",count:"QP-17/25"},
 {id:"future",icon:"🌐",name:"Technology, Information & Future",desc:"AI · Privacy · News · Long-term Outcomes",query:"technology",count:"QP-23/24/30"}
];
const PACKS=[
 {name:"Half-Cent Economic Development",desc:"Public capital, permitted uses, commitments, project agreements and measurable outcomes.",tag:"Budget and legal stages",href:"index.html#issue/half-cent"},
 {name:"Project Falcon",desc:"Industrial proposal, incentives, jobs, infrastructure, latest official status and public-value tests.",tag:"Development",href:"index.html#issue/falcon"},
 {name:"Lime Road Corridor",desc:"Who owns, maintains, funds and uses this industrial corridor? Review agreements and project phases.",tag:"Infrastructure",href:"index.html#issue/lime-road"},
 {name:"Airport Leases and Governance",desc:"Multiple lease versions, airport funds, federal duties and Council authority.",tag:"Legal / contracts",href:"research-atlas.html#QRX-REG-058-01"},
 {name:"PURA and City Financing",desc:"Tax-increment financing, public assets, reimbursement and intergovernmental debt.",tag:"Follow the money",href:"research-atlas.html#QRX-RTA-001"},
 {name:"Pueblo West Roads",desc:"County–district responsibility, tax proceeds, stormwater and maintenance results.",tag:"Cross-jurisdiction",href:"research-atlas.html#QRX-REG-060-01"},
 {name:"Black Hills Utility Rates",desc:"Proposal versus final approval; electric tariffs, costs and customer impact.",tag:"Energy",href:"research-atlas.html#QRX-REG-064-01"},
 {name:"Arkansas Valley Water",desc:"Water delivery, infrastructure obligations and local long-term cost exposure.",tag:"Water",href:"research-atlas.html#QRX-WATER-REG-001"},
 {name:"Aspen Acres Recovery",desc:"Public recovery, watershed protection, households and funding responsibilities.",tag:"Disaster & people",href:"research-atlas.html#QRX-REG-067-01"},
 {name:"Mission Foods Transition",desc:"Closure records, worker pathways, site reuse, payroll and supplier effects.",tag:"Jobs",href:"research-atlas.html#QRX-REG-043-MISSION-01"},
 {name:"Regional Housing Services",desc:"Shelters, affordable access, providers, funding and measured housing outcomes.",tag:"Housing & health",href:"research-atlas.html#QRX-REG-068-01"},
 {name:"Schools and Public Investment",desc:"District financing, enrollment, capital investment, taxes and public results.",tag:"Education",href:"research-atlas.html#QRX-SCHOOL-001"}
];
const ENGINES=[
 {name:"Evidence & Source Finder",desc:"Browse dated primary-source directories, then inspect sources attached to living packets.",status:"Available now",kind:"ready",href:"index.html#sources",action:"Browse sources"},
 {name:"Living Packet Explorer",desc:"Ninety-four selected archived research entries with four depths and visible gaps.",status:"Available for review",kind:"limited",href:"research-atlas.html",action:"Browse issue packets"},
 {name:"Money & Contract Navigator",desc:"Separate requested, approved, executed, paid and recovered amounts in financial research.",status:"Guided / partial",kind:"limited",href:"index.html#money",action:"Trace money"},
 {name:"Institution & Relationship Graph",desc:"Move across registered institutions and issue connections. Association alone proves no causation.",status:"Indexed / partial",kind:"limited",href:"research-atlas.html",action:"Explore connections"},
 {name:"Q Effect Analysis",desc:"Examine people, money, time, trust, alternatives, consequences, resilience and learning.",status:"Guided / static",kind:"ready",href:"index.html#research/effect",action:"Explore Q Effect"},
 {name:"Research Outline Builder",desc:"Generate structured research outlines and source-request checklists without a live AI account.",status:"Available now",kind:"ready",href:"index.html#research/report",action:"Create an outline"},
 {name:"Prompt Builder",desc:"Create evidence-aware prompts for an independent research assistant, with review controls.",status:"Available now",kind:"ready",href:"index.html#research/prompt",action:"Build a prompt"},
 {name:"Pueblo Digital Twin",desc:"A future integrated scenario model. The current static view does not provide validated forecasts.",status:"Not operational",kind:"future",href:"research-atlas.html",action:"View model inputs"}
];
const AGENTS=[
 {name:"Pueblo Guide",desc:"Explains an issue in ordinary language and routes you to its packet and sources.",status:"Guided workflow",href:"research-atlas.html",action:"Choose an issue"},
 {name:"Evidence Researcher",desc:"Provides sourcing questions, date checks, contrary-evidence prompts and public-record routes.",status:"Prompt-based",href:"index.html#research/prompt",action:"Create research prompt"},
 {name:"Money Tracer",desc:"Supports financial-stage reconciliation, payer/recipient mapping and lifecycle-cost questions.",status:"Guided workflow",href:"index.html#money",action:"Review money trail"},
 {name:"Authority & Legal Navigator",desc:"Locates offices, jurisdictions, public regulations and decision records. No legal determinations.",status:"Source guide",href:"index.html#governance",action:"Find authority"},
 {name:"Entity & Effects Analyst",desc:"Explores first-, second- and third-order issue connections and conditional impact pathways.",status:"Indexed / conditional",href:"research-atlas.html",action:"Trace connections"},
 {name:"Community Learning Coach",desc:"Supports civic literacy, public-source navigation and the Pueblo challenge.",status:"Guided activity",href:"index.html#research/learn",action:"Start learning"},
 {name:"Fact Check Assistant",desc:"Produces a claim-verification checklist; no autonomous factual verdicts.",status:"Prompt-based",href:"index.html#research/rx",action:"Challenge a claim"},
 {name:"Updates & Monitoring Agent",desc:"Would identify changed sources, dates, public notices and amendments after audited automation is enabled.",status:"Not operational",href:"index.html#sources",action:"Check sources manually"}
];
const safe=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function tile(x){return '<a class="tile" href="research-atlas.html?q='+encodeURIComponent(x.query)+'" data-category="'+safe(x.id)+'"><span class="tile-badge">EXPLORE</span><span class="tile-icon" aria-hidden="true">'+x.icon+'</span><span class="tile-title">'+safe(x.name)+'</span><span class="tile-desc">'+safe(x.desc)+'</span></a>'}
function pack(x){return '<article class="pack"><span class="flag">◈ '+safe(x.tag)+' · REVIEWED CONTEXT VARIES</span><h3>'+safe(x.name)+'</h3><p>'+safe(x.desc)+'</p><a href="'+safe(x.href)+'">Open research →</a></article>'}
function engine(x,agent=false){return '<article class="'+(agent?"agent":"tool")+'"><span class="status '+(x.kind==="future"||x.status==="Not operational"?"future":x.kind==="limited"?"limited":"")+'">'+safe(x.status)+'</span><h3>'+safe(x.name)+'</h3><p>'+safe(x.desc)+'</p><a href="'+safe(x.href)+'">'+safe(x.action)+' →</a></article>'}
document.getElementById("categories").innerHTML=CATEGORIES.map(tile).join("");
document.getElementById("featuredPacks").innerHTML=PACKS.map(pack).join("");
document.getElementById("engineCards").innerHTML=ENGINES.map(x=>engine(x)).join("");
document.getElementById("agentCards").innerHTML=AGENTS.map(x=>engine(x,true)).join("");
document.getElementById("searchForm").addEventListener("submit",e=>{
  e.preventDefault(); const q=document.getElementById("site-search").value.trim().slice(0,140);
  location.href="research-atlas.html"+(q?"?q="+encodeURIComponent(q):"");
});
const menu=document.getElementById("menuToggle"),nav=document.getElementById("primary-nav");
menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});
nav.addEventListener("click",e=>{if(e.target.closest("a")){nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}});
