'use strict';
// Q-Pueblo universal scope assurance. A question initiates Qification, never proves completion.
// Risk must be verified with evidence; text-only indicators are intake signals, not facts.
(() => {
 const flags=Object.freeze([
  'life_safety','child_or_dependent_impact','critical_infrastructure','privacy_or_rights',
  'unrecoverable_environmental_harm','irreversible_commitment','cross_jurisdiction',
  'material_public_funds','resource_or_grid_stress','contested_authority'
 ]);
 const mandatory=Object.freeze([
  {id:'TRUTH_AND_SOURCES',purpose:'Separate supported facts, source claims, uncertainty and source dates'},
  {id:'QIFY_DIRECT_ANSWER',purpose:'Give the best current answer, covering responsibility, process, outcome, money and geography'},
  {id:'CHILD_ZERO',purpose:'Explicitly examine children, dependents and future-generation effects or explain none established'},
  {id:'EVENT_HORIZONS',purpose:'Test time thresholds, loss of options, cascading effects, reversibility and recovery'},
  {id:'GOVERNANCE_AND_HUMAN_RIGHTS',purpose:'Examine authority, safety gates, consent, appeal and oversight'},
  {id:'EE_INTEL_T2Y',purpose:'Respect energy, time, attention, public burden and measurable useful results'},
  {id:'Q_CROSSOVERS',purpose:'Connect verified findings across relevant agencies, resources, geography, time and systems'},
  {id:'UNCERTAINTY_AND_UPDATES',purpose:'Expose unknowns, evidence freshness, corrections and ongoing Qification'}
 ]);
 const examples=Object.freeze({
  streetlight:{
   kind:'SINGLE_PUBLIC_ASSET',
   dimensions:['Asset identity, location and maintenance jurisdiction','Current operational condition and public reporting route',
    'Electricity and maintenance funding, contracts and repair service level','Visibility, pedestrian/driver safety and accessibility',
    'Children, schools, bus stops and vulnerable road users where relevant',
    'Adjacent utilities, roadwork and neighborhood effects','Event Horizons: unresolved hazard escalation and reversible mitigation',
    'Options: inspection, temporary safety control, repair, upgrade and outcome verification']
  },
  data_center:{
   kind:'INDUSTRIAL_SITE_AND_REGIONAL_DEPENDENCIES',
   dimensions:['Applicant, site, ownership, permit and jurisdiction records','Electricity demand, grid interconnection, backup energy and resilience',
    'Water source, projected versus actual consumption and wastewater','Land use, zoning, air/noise, construction and environmental controls',
    'Public incentives, infrastructure commitments, costs, contracts, payments and opportunity cost',
    'Employment claims versus verified jobs, suppliers, wages and community benefits',
    'Children, neighborhoods, public health, long-term maintenance and distribution of impacts',
    'Event Horizons: capacity cliffs, infrastructure lock-in, deadlines, reversibility and recovery',
    'Options: design variants, contractual performance gates, alternatives, verification and human review']
  }
 });
 const clean=s=>typeof s==='string'?s.toLowerCase():'';
 function create({question='',riskEvidence=[],reportedRisk=[],assetKind=null}={}){
  const q=clean(question);
  const guess=assetKind==='streetlight'||assetKind==='data_center'?assetKind:
   /\b(street\s?light|streetlamp|lamp post|light pole|street lighting)\b/.test(q)?'streetlight':
   /\b(data\s?cent(er|re)|server farm|hyperscale campus|colocation facilit)/.test(q)?'data_center':null;
  const evidence=Array.isArray(riskEvidence)?[...new Set(riskEvidence.filter(f=>flags.includes(f)))]:[];
  const reported=Array.isArray(reportedRisk)?[...new Set(reportedRisk.filter(f=>flags.includes(f)&&!evidence.includes(f)))]:[];
  // Supplied 'riskEvidence' must itself be screened by the actual source-admission pipeline.
  // The browser has no source verifier and therefore cannot certify an evidence claim.
  const status=evidence.length?'SOURCE_VALIDATION_REQUIRED':reported.length?'UNVERIFIED_RISK_SIGNAL':'RISK_NOT_ASSESSED';
  const suggestedDepth=evidence.length>=2?'HEIGHTENED_REVIEW_CANDIDATE':evidence.length||reported.length?'EXPANDED_REVIEW_CANDIDATE':'BASELINE_PENDING_RISK_ASSESSMENT';
  return {
    schema:'qp-qification-universal-scope-v0.1',question,assetKind:guess||'GENERAL_UNRESOLVED_SCOPE',
    assetKindVerified:false,
    riskStatus:status,sourceVerifiedRisk:false,
    suppliedRiskEvidence:evidence,reportedRisk:reported,
    recommendedDepth:suggestedDepth,
    dimensions:guess?examples[guess].dimensions.slice():[],
    alwaysRequired:mandatory.map(x=>({...x,state:'NOT_EVALUATED_BY_SCOPE_CLASSIFIER'})),
    qificationStarted:true,fullQifiedVerified:false,liveResearchPerformed:false,
    nextGate:'Verify identity, jurisdiction, risk indicators and sources; execute eligible Q10 modules; produce dated Q answers plus final crossovers and human publication review.',
    note:'One asset or a regional system follows the same assurance obligations. No lexical clue or reported risk is proof of jurisdiction, harm, project status, fiscal impact or cause. Depth depends on verified consequences and uncertainty, not asset size.'
  };
 }
 const api=Object.freeze({create,mandatory,flags,examples});
 if(typeof window!=='undefined')window.QPUniversalScope=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})();
