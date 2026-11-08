"use strict";
/* Source-aware descriptive guides. Not certified current-state reports. */
const URLS={
 city:"https://www.pueblo.us/1137/Council-Agenda",code:"https://library.municode.com/co/pueblo/codes/code_of_ordinances",county:"https://www.pueblocounty.gov/",pura:"https://puebloura.org/",pedco:"https://www.pedco.org/",west:"https://www.pueblowestmetro.us/",water:"https://pueblowater.org/",puc:"https://puc.colorado.gov/",epa:"https://www.epa.gov/",bls:"https://www.bls.gov/",census:"https://data.census.gov/",cdot:"https://www.codot.gov/",fa:"https://www.faa.gov/",d60:"https://www.pueblod60.org/",d70:"https://www.district70.org/",pcc:"https://pueblocc.edu/",library:"https://www.pueblolibrary.org/",history:"https://www.historycolorado.org/",oedit:"https://oedit.colorado.gov/",assessor:"https://www.pueblocounty.gov/assessor-department",fema:"https://www.fema.gov/"
};
const PACKS={
 half:["Half-Cent fund and projects","legacy.html#issue/half-cent"],
 falcon:["Project Falcon","legacy.html#issue/falcon"],
 road:["Lime Road","legacy.html#issue/lime-road"],
 airport:["Airport lease and authority chain","research-atlas.html#QRX-REG-058-01"],
 pura:["City/PURA financial reconciliation","research-atlas.html#QRX-RTA-001"],
 pw:["Pueblo West road responsibilities","research-atlas.html#QRX-REG-060-01"],
 water:["Arkansas Valley water system","research-atlas.html#QRX-WATER-REG-001"],
 black:["Black Hills utility rates","research-atlas.html#QRX-REG-064-01"],
 steel:["Pueblo steel transition","research-atlas.html#QRX-REG-072-02"],
 housing:["Homelessness service and funding","research-atlas.html#QRX-REG-068-01"],
 schools:["Regional school finance","research-atlas.html#QRX-SCHOOL-001"],
 disaster:["Post-fire watershed recovery","research-atlas.html#QRX-REG-067-01"],
 procurement:["Regional public procurement","research-atlas.html#QRX-PROC-REG-001"],
 e911:["E-911 financial and service system","research-atlas.html#QRX-E911-001"],
 ballot:["2026 ballot measure implementation","research-atlas.html#QRX-REG-063-03"],
 county:["County finance and organizational state","research-atlas.html#QRX-REG-069-01"],
 safety:["Public safety / grant governance","research-atlas.html#QRX-REG-066-01"],
 rate:["Pueblo West water/wastewater rates","research-atlas.html#QRX-REG-061-01"]
};
const C={
people:{title:"People, Places & Pueblo History",domains:"QP-01 · QP-02 · QP-04 · QP-27",
lead:"Explore the people, neighborhoods and histories that shape Pueblo—alongside the lived conditions and measurable changes that affect daily life.",
explain:["Pueblo is not one homogeneous community. City neighborhoods, Pueblo West, rural County areas and smaller local districts operate under different government and service boundaries. A question about taxes, water, schools or safety can have a different answer depending on the precise location and date.","Our people-and-place research connects population statistics, historic records, local institutions, property context and residents' experiences. Historical narrative is identified as history; current claims are checked against the governing record and dated data rather than assumed to apply everywhere."],
facts:[["Where you live matters","Property-tax districts, schools, water and public services can overlap differently across nearby addresses."],["Evidence has multiple forms","Census data measures populations; oral histories and lived experiences add context but are not interchangeable with official statistics."],["History connects to today","Housing patterns, land use, workforce transitions and environmental exposure can have long-lived effects worth tracing."]],
packets:["housing","water","county"],sources:[["U.S. Census data",URLS.census],["History Colorado",URLS.history],["Pueblo County records",URLS.county]],
cross:["government","housing","health","culture"],gaps:["Neighborhood-level indicator and historic GIS source refresh","Structured Pueblo archive and oral-history source review","Updated demographic series with precise geography"]},
government:{title:"Government, Law & Civic Action",domains:"QP-07 · QP-16 · QP-29",
lead:"Understand who has legal authority, what was proposed versus adopted, and how people can take part in Pueblo public decisions.",
explain:["Pueblo's City, County, metropolitan districts, school districts, independent authorities, and state and federal agencies have different statutory powers. Meeting discussion, a first reading, a passed ordinance, a signed contract and an implemented program are different stages.","This section tracks the decision record: governing body, lawful authority, agenda item, motion, effective date, execution, funding source and practical results. Residents can start with a short explanation and open the controlling documents when needed."],
facts:[["Authority comes first","Identify the actual institution and effective rule before assigning responsibility."],["A proposal is not an action","Meeting agendas and public comments are not proof that a measure passed or that money was spent."],["People can verify the chain","Council agendas, codes, board minutes, votes and contracts connect policy to implementation."]],
packets:["airport","ballot","county","pw"],sources:[["Pueblo City Council agendas",URLS.city],["Pueblo Municipal Code",URLS.code],["Pueblo County government",URLS.county]],
cross:["money","people","health","future"],gaps:["Effective-dated public office and board roster reconciliation","Meeting-to-vote-to-contract status for major initiatives","A public-safe guide to comment and record-request procedures"]},
money:{title:"Follow the Money",domains:"QP-13 · Cross-domain financial control",
lead:"See where public money starts, where it is legally allowed to go, who receives it and what measurable results follow.",
explain:["Public money passes through different legal stages. A ballot authorization can establish a source, a budget can allocate a maximum amount, a contract can create obligations, and an invoice can produce an actual payment. Money labeled as approved is not necessarily money paid.","QPueblo's financial research connects city/county funds, grants, debt, incentives, development agreements, tax-increment finance, public assets and long-term operating costs. A useful financial packet separates publicly authorized amounts, private commitments and realized outcomes without adding unlike figures together."],
facts:[["Payer, recipient, obligation","Every financial record needs a fund, authorizing document, beneficiary, amount, period and source."],["Legal restrictions matter","Restricted tax revenues, grants and capital accounts cannot automatically fund recurring general operations."],["Return is an outcome","Job announcements, proposed investment and forecast taxes are not realized payroll or fiscal return."]],
packets:["half","pura","falcon","procurement","county"],sources:[["City Council and appropriations",URLS.city],["Pueblo Urban Renewal Authority",URLS.pura],["Pueblo County financial records",URLS.county]],
cross:["economy","government","infrastructure","health"],gaps:["Project-by-project paid and recovered amount joins","Contract amendments, invoice and outcome matching","Lifecycle cost and public/private benefit comparisons"]},
infrastructure:{title:"Housing, Land & Infrastructure",domains:"QP-10 · QP-17 · QP-18",
lead:"Trace public and private assets from the parcel and permit through construction, maintenance, ownership and neighborhood effects.",
explain:["A building, road, land sale or development incentive is more than a project announcement. Decision responsibility depends on land ownership, infrastructure agreements, zoning, permits, restricted financing and the asset operator after completion.","Housing access also depends on affordability terms, utility capacity, services, transportation and household income. QPueblo links capital decisions to who pays to maintain the asset and who receives—or misses—the resulting benefit."],
facts:[["The asset has an owner","Construction funding, ownership and long-term maintenance can belong to different entities."],["Full cost exceeds construction","Debt service, utilities, staffing, repairs and replacement require a lifecycle view."],["Housing supply has stages","Proposed units, permitted units, completed units and genuinely affordable occupied units must be tracked separately."]],
packets:["road","housing","pw","pura","falcon"],sources:[["Pueblo County Assessor",URLS.assessor],["City Council and planning actions",URLS.city],["PURA redevelopment records",URLS.pura]],
cross:["money","people","environment","economy"],gaps:["Parcel-to-contract-to-ownership joins","Verified housing pipeline by stage and affordability period","Maintenance backlogs and capital replacement schedules"]},
economy:{title:"Jobs, Business & Industry",domains:"QP-11 · QP-12 · QP-13 · QP-28",
lead:"Understand Pueblo's businesses, steel, agriculture, jobs, training, startups and industrial investments—measured by real outcomes.",
explain:["Economic development includes local small firms and entrepreneurs as well as large employers, industrial sites, institutions and public incentive programs. A region can announce projects without immediately achieving permanent jobs, higher wages or resilient suppliers.","An evidence-based economic packet follows the path from employer plans and available land to public assistance, contracts, hiring, wages, workforce training, local purchasing and long-term tax receipts. Outcomes should be dated and independently verifiable."],
facts:[["Count the right jobs","Projected, promised, hired, net-new, retained and long-term positions are not equivalent."],["Include small-business effects","Procurement access, utilities, rent, taxes, customers and regulations affect local firms."],["Track workforce pathways","Training seats, graduates, placements, wages and retention show whether investments serve residents."]],
packets:["falcon","steel","half","procurement"],sources:[["Pueblo Economic Development Corporation",URLS.pedco],["Bureau of Labor Statistics",URLS.bls],["Pueblo Community College",URLS.pcc]],
cross:["money","infrastructure","culture","environment"],gaps:["Project-level realized hiring and pay data","Local supply-chain and small-business participation","Historic investment and payroll comparisons by sector"]},
environment:{title:"Water, Energy & Environment",domains:"QP-19 · QP-20 · QP-21",
lead:"Explore the region's water, energy, air, land, food systems and environmental health as connected infrastructure and living systems.",
explain:["Water availability, treatment and conservation affect residents, agriculture, industry and emergency resilience. Energy rates and power infrastructure influence household budgets and major employers. Environmental investigations require precise contaminant, place, time and exposure evidence.","This category connects utilities, environmental agencies, property history, conservation, agriculture, wildlife and long-term infrastructure. Regulated proposals, adopted requirements, measured conditions and final remediation outcomes remain different records."],
facts:[["Water systems are interconnected","Rights, storage, treatment, distribution, drought and growth determine different parts of reliability."],["Regulatory filings have stages","A proposed utility tariff or cleanup threshold is not yet a final approved decision."],["Exposure claims require precision","Specific parcels, samples, health pathways, dates and regulatory records matter."]],
packets:["water","black","rate","disaster"],sources:[["Pueblo Water",URLS.water],["Colorado Public Utilities Commission",URLS.puc],["U.S. Environmental Protection Agency",URLS.epa]],
cross:["health","economy","money","infrastructure"],gaps:["Current tariff and rate-class comparisons","Watershed and contaminant mapping with source metadata","Project energy/water use and long-run resilience effects"]},
health:{title:"Health, Safety & Families",domains:"QP-03 · QP-09 · QP-15 · QP-26",
lead:"Connect public health, family wellbeing, behavioral health, safety, youth opportunities, justice and disaster recovery.",
explain:["Health and safety arise across agencies: public health offices, emergency response, courts, providers, schools, shelters and neighborhood services. Program announcements should be evaluated against actual access, cost, quality, response performance and outcomes.","For safety and recovery, QPueblo distinguishes official findings from allegations, reported incidents from population-wide rates, approved recovery funding from actual assistance, and aggregate statistics from protected personal records. Sensitive individual-level material is excluded."],
facts:[["Needs cross agency boundaries","Public health, law enforcement, social services and housing providers often interact without sharing identical authority."],["Rights are part of safety","Privacy, fair process, due process and complaint remedies matter alongside operational effectiveness."],["Recovery has a long tail","Households, property, insurance, infrastructure, grants and flood exposure may recover on different timelines."]],
packets:["disaster","housing","safety","e911"],sources:[["Pueblo County government",URLS.county],["FEMA disaster programs",URLS.fema],["City Council records",URLS.city]],
cross:["people","housing","government","environment"],gaps:["Public-safe provider and program directory","Service access and outcome baselines","Disaster assistance and long-term recovery stage joins"]},
culture:{title:"Education, Culture & Community",domains:"QP-04 · QP-05 · QP-06 · QP-08 · QP-14 · QP-22",
lead:"Explore Pueblo's history, schools, arts, creators, food traditions, community organizations, parks, sports and ways to participate.",
explain:["Community life is not just government. Culture, informal networks, arts, faith communities, libraries, schools, recreation and local events influence belonging, youth opportunities, small-business income and the quality of everyday life.","QPueblo should make these resources discoverable alongside funding and outcomes. An event listing is different from a preservation project, an institution's budget and a longitudinal measure of participation. Historical and cultural material is sourced without reducing people to a single identity or a simplistic category."],
facts:[["Learning spans a lifetime","Schools, colleges, apprenticeship programs and libraries support different ages and needs."],["Culture has economic value","Creators, venues, heritage assets, public art and visitor activity can produce local opportunities."],["Access should be measured","Availability, cost, geography, disability access and participation affect community benefit."]],
packets:["schools","housing","county"],sources:[["Pueblo School District 60",URLS.d60],["Pueblo County School District 70",URLS.d70],["Pueblo City-County Library District",URLS.library]],
cross:["people","economy","health","money"],gaps:["Arts and cultural institution packets requiring source review","Accessible calendar and verified event-directory feeds","Historic neighborhoods, preservation and public-space inventories"]},
airport:{title:"Transportation, Airport & Connections",domains:"QP-17 · QP-25",
lead:"Follow Pueblo's roads, aviation, transit, freight, rail and regional transportation dependencies.",
explain:["The same transportation corridor can involve local road owners, federal aviation requirements, state transport agencies, rail firms, commercial tenants and private property. A route or facility is therefore not explained by one contract alone.","Pueblo's transportation research separates infrastructure ownership, maintenance responsibility, rights-of-way, project financing, safety metrics, permits, operations and regional economic effects. Leases and draft policies must be compared using signed instrument versions and their effective dates."],
facts:[["Authority changes by asset","An airport, state highway and local road follow different management and funding systems."],["Contracts can overlap","Lessee, subtenant, property owner, maintenance operator and regulator may have distinct obligations."],["Transport effects cross domains","Workforce access, emergency response, industry, emissions and business location are all connected."]],
packets:["airport","road","pw","steel"],sources:[["Pueblo City Council records",URLS.city],["Colorado Department of Transportation",URLS.cdot],["Federal Aviation Administration",URLS.fa]],
cross:["infrastructure","economy","money","environment"],gaps:["Current airport lease-version and federal obligation review","Rail and freight-source refresh","Road and mobility lifecycle spending by corridor"]},
future:{title:"Technology, Information & Future",domains:"QP-23 · QP-24 · QP-30",
lead:"See how AI, surveillance, digital infrastructure, information quality and long-term regional decisions interact.",
explain:["New digital systems can affect procurement, privacy, workforce, reliability, cybersecurity and public trust. QPueblo distinguishes a technology vendor's promises from implemented capabilities, governing rules, performance data and measured social effects.","Digital-twin and agent features are models and tools, not public authorities. Any simulation must explain its input vintages, assumptions, uncertainty, limitations and rollback. Historical claims, news and social posts also require source independence and correction trails."],
facts:[["Data governance precedes automation","Purpose, retention, access, sharing, human override and audit need explicit controls."],["Models are not outcomes","A simulation is conditional until validated against measured results."],["Information has provenance","Quote origin, date, legal context, corroboration and correction history must remain visible."]],
packets:["e911","procurement","county","safety"],sources:[["Pueblo County records",URLS.county],["Colorado legislature and laws",URLS.code],["Colorado utility regulation",URLS.puc]],
cross:["government","money","health","people"],gaps:["Current contract and data-retention schedules","Digital twin input quality, geometry and model validation","Transparent false-hit/redress and AI vendor performance audits"]}
};
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const params=new URLSearchParams(location.search),selected=params.get("topic")||"people",key=Object.hasOwn(C,selected)?selected:"people",d=C[key];
const put=(id,s)=>document.getElementById(id).innerHTML=s;
document.title=d.title+" | Q-Pueblo";
put("catTitle",safe(d.title));put("catLead",safe(d.lead));put("catDomains",safe(d.domains));
put("catExplain",d.explain.map(p=>"<p>"+safe(p)+"</p>").join(""));
put("catFacts",d.facts.map(x=>'<div class="mini-card"><strong>'+safe(x[0])+'</strong><p>'+safe(x[1])+'</p></div>').join(""));
put("catPackets",d.packets.map(id=>'<a href="'+safe(PACKS[id][1])+'">'+safe(PACKS[id][0])+'<small>Living research · Verify source and status</small></a>').join(""));
put("catCross",'<div class="crosses">'+d.cross.map(x=>'<a href="category.html?topic='+encodeURIComponent(x)+'">'+safe(C[x].title)+' →</a>').join("")+'</div>');
put("catGaps",'<ul class="checks">'+d.gaps.map(x=>'<li>'+safe(x)+'</li>').join("")+'</ul>');
put("catSources",d.sources.map(x=>'<a target="_blank" rel="noopener noreferrer" href="'+safe(x[1])+'">'+safe(x[0])+' ↗</a>').join(""));
