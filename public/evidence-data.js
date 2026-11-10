'use strict';
/* Dated, public-source snapshots only. Values are not live expenditure or performance data. */
(function(root){
  const data={
    schema:'qp-resident-evidence-v1',
    snapshot:'2026-11-10',
    disclaimer:'These dated official-source records are not an independently audited current ledger.',
    budget:{
      title:'City of Pueblo FY2026 adopted General Fund appropriations',
      ordinance:'11075',period:'FY2026',stage:'ADOPTED_APPROPRIATION_NOT_PAID',
      source:'https://www.pueblo.us/DocumentCenter/View/39357/Ordinance11075-Adopted-Budget',
      adopted:'2025-11-24',total:128202143,
      groups:[
        {id:'general',name:'General Government',amount:19615324},
        {id:'police',name:'Police',amount:43655487},
        {id:'fire',name:'Fire',amount:29883192},
        {id:'works',name:'Public Works',amount:8852584},
        {id:'parks',name:'Parks',amount:8691830},
        {id:'other',name:'Non-Departmental',amount:8119344},
        {id:'transfer',name:'Transfers Out',amount:9384382}
      ]
    },
    county:{
      title:'Pueblo County BOCC Smart Priorities Dashboard',
      source:'https://www.pueblocounty.gov/what-we-are-working',
      updated:'2026-08-08',stage:'COUNTY_SELF_REPORTED_STATUS_NOT_VERIFIED_DELIVERY',
      initiatives:[
        ['2025 audit close and filing','Financial Strategy','Underway'],
        ['2026 budget amendment and supplemental appropriations','Financial Strategy','Underway'],
        ['Standing financial reporting rhythm','Financial Strategy','Underway'],
        ['Grant management system','Financial Strategy','Underway'],
        ['Old detention center mothballing','Correctional Services & Safety Support','Underway'],
        ['New detention center, first year','Correctional Services & Safety Support','Underway'],
        ['Recovery manager position','Correctional Services & Safety Support','Underway'],
        ['Community corrections FY27 allocation','Correctional Services & Safety Support','Underway'],
        ['HR consolidation implementation','Workforce & Organization','Underway'],
        ['Performance snapshot rollout','Workforce & Organization','Underway'],
        ['Agenda intake redesign','Workforce & Organization','Underway'],
        ['Dotted-line reporting structure','Workforce & Organization','Underway'],
        ['Debris removal program','Growth & Development','Waiting'],
        ['Watershed protection (USDA EWP and NOAA)','Growth & Development','Underway'],
        ['Assistance-center operations','Growth & Development','Underway'],
        ['Post-fire flooding in Beulah and Rye','Growth & Development','Underway'],
        ['Loose propane tanks in drainages','Growth & Development','Underway'],
        ['Fire declaration renewals and August meetings','Growth & Development','Underway'],
        ['Memorial contribution from 1A funds','Economic Development','Underway'],
        ['Preventive maintenance reset','Infrastructure','Underway'],
        ['Pueblo West Metro District roads agreement','Infrastructure','Underway'],
        ['Public roads and bridges dashboard','Infrastructure','Waiting'],
        ['Detention center solar PPA','Infrastructure','Waiting'],
        ['Housing trust project checks','Housing','Complete'],
        ['Short-term rental sheltering','Housing','Underway'],
        ['DHS fire roles','Human Services','Underway']
      ]
    },
    reviewDocket:[{
      id:'QP-RX-2026-001',title:'City mill levy: estimated revenue year',
      state:'SOURCE_CONFLICT_UNRESOLVED',
      source:'https://www.pueblo.us/DocumentCenter/View/39356/Ordinance11074-Mill-Levy',
      summary:'The 2026 mill-levy background paper associates the $21,280,697 revenue estimate with the 2026 levy; the ordinance recital labels that amount FY2024. The adopted 15.633-mill rate is not the dispute.',
      next:'Seek documentary clarification from the City Clerk or Finance Director. Do not label the estimate actual 2026 collections.'
    }]
  };
  if(typeof module!=='undefined'&&module.exports)module.exports=data;
  if(root)root.QP_RESIDENT_EVIDENCE=data;
})(typeof window!=='undefined'?window:null);
