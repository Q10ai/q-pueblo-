'use strict';
// Q10 capability crosswalk for Q-Pueblo: architecture discovery ONLY, not execution.
// Human-governed and source-attributed. Do not import private Q10 artifacts into the public client.
(() => {
 const catalog=Object.freeze([
  {id:'Q10-KNOWLEDGE-OS',name:'Q10 Knowledge OS',role:'governed evidence-to-knowledge lifecycle',scope:'core',state:'HISTORICAL_PROTOTYPE_NOT_BYTE_VERIFIED',origin:'docs/q10/q-pueblo/staging/Q_PUEBLO_2026-11-09_KNOWLEDGE_SUITE_SCOPE_CORRECTION_HANDOVER_v0.1.0.md'},
  {id:'Q10-CLEF-CTX',name:'Evidence CLEF and Context Library Convergence',role:'source admission, lineage and mandatory context obligations',scope:'core',state:'S2_CONTROLLED_CANDIDATE',origin:'docs/q10/architecture/Q10_CONTEXT_LIBRARY_CONVERGENCE_v0.3.md'},
  {id:'Q10-TRUTH',name:'Truth / Claim Boundary and Evidence Fabric',role:'separate original evidence, attributed claims, inferences and unknowns',scope:'core',state:'REPO_MIXED_PARTIAL',origin:'docs/modules/Q10_MODULE_CATALOG.md'},
  {id:'Q10-QIFY',name:'QIFY',role:'structured evidence-to-answer reasoning with claim boundaries',scope:'core',state:'IMPLEMENTED_PARTIAL_BOUNDED',origin:'docs/q10/registry/Q10_CAPABILITY_REGISTRY.json'},
  {id:'Q10-GLEAN',name:'GLEAN / Double-GLEAN',role:'discover omitted actors, benefits, burdens and negative branch lessons',scope:'core',state:'IMPLEMENTED_PACKET_WORKFLOWS',origin:'docs/q10/registry/Q10_CAPABILITY_REGISTRY.json'},
  {id:'Q10-SUPRA',name:'SUPRA Multi-Plane Recursive Dynamics',role:'cross-system possibilities, contradictions, time and tethered dependencies',scope:'core',state:'RECONCILED_NON_OPERATIONAL_ARCHITECTURE',origin:'docs/q10/architecture/SUPRA_MULTIPLANE_RECURSIVE_DYNAMICS_v0.1.md'},
  {id:'Q10-EVENT-HORIZON',name:'Event Horizons',role:'deadline cliffs, irreversible thresholds, option loss, cascades and recovery',scope:'core',state:'DESIGNED_SCENARIO_ANALYSIS_UNCALIBRATED',origin:'docs/q10/registry/Q10_CAPABILITY_REGISTRY.json'},
  {id:'Q10-RX',name:'RX Council / QRX',role:'adversarial evidence challenge, domain review and contrary explanation',scope:'core',state:'CANDIDATE_MAPPED',origin:'docs/modules/Q10_MODULE_CATALOG.md'},
  {id:'Q10-LEAP',name:'LEAP Fabric',role:'compare future pathways, alternative designs and bounded opportunity learning',scope:'core',state:'S2_CONTROLLED_CANDIDATE',origin:'docs/q10_leap/README.md'},
  {id:'Q10-EE-INTEL',name:'EE_INTEL Resource Economics',role:'minimum sufficient intelligence, energy, compute, cost, review and trust',scope:'core',state:'BOUNDED_REFERENCE',origin:'docs/q10/architecture/CAPABILITY_MAP.md'},
  {id:'Q10-T2Y',name:'Truth-to-Yield',role:'connect truth support to measurable usefulness and human agency',scope:'core',state:'BOUNDED_REFERENCE',origin:'docs/q10/architecture/CAPABILITY_MAP.md'},
  {id:'Q10-EH-EVID',name:'Evidence Health (EH_EVID)',role:'source health and typed TTL; separate from Event Horizons',scope:'core',state:'BOUNDED_REFERENCE',origin:'docs/q10/governance/NAMESPACE_AND_TTL_CONTRACT_v1.md'},
  {id:'Q10-MEMORY',name:'MemoryChain / Organizational Memory WorkGraph',role:'versioned amendments, provenance, history and graph-structured memory',scope:'core',state:'S2_CONTROLLED_CANDIDATE_PARTIAL',origin:'docs/q10/architecture/ORGANIZATIONAL_MEMORY_WORKGRAPH_v0.2.1.md'},
  {id:'Q10-HARNESS',name:'Governed Harness Fabric',role:'versioned model plus harness, tools, controlled workflows and review',scope:'core',state:'S2_CONTROLLED_CANDIDATE',origin:'Q10/Governed_Harness_Fabric/README.md'},
  {id:'Q10-TSLP',name:'Test Simulate Learn Patch',role:'bounded test and adversarial simulation, learning and retest',scope:'core',state:'MIXED_REFERENCE_IMPLEMENTATIONS',origin:'docs/neuromesh/GLOSSARY_BINDING_GATES_v0.1.md'},
  {id:'Q10-HUMAN',name:'Human Authority / Child Zero / Release Gates',role:'child-first protection, contestability, oversight and publication authority',scope:'core',state:'REPO_DOCUMENTED_AND_PARTIALLY_EXECUTABLE',origin:'docs/modules/Q10_MODULE_CATALOG.md'},
  {id:'Q10-SECOND-BRAIN',name:'Second Brain Universal Fabric',role:'knowledge pointers, identity, contradiction, correction and source validity',scope:'core',state:'CONTROLLED_CANDIDATE_WITH_UNVERIFIED_DRIVE_PARITY',origin:'docs/q10/q-pueblo/staging/Q_PUEBLO_2026-11-09_KNOWLEDGE_SUITE_SCOPE_CORRECTION_HANDOVER_v0.1.0.md'},
  {id:'Q10-CHILD-ZERO',name:'Child Zero and Future Generations Protection',role:'test child, dependent-person and intergenerational burdens by default',scope:'core',state:'CONTROLLED_ARCHITECTURE_MANDATORY_ASSURANCE_NOT_RUNTIME_VERIFIED',origin:'docs/q10/q-pueblo/staging/Q_PUEBLO_2026-11-09_KNOWLEDGE_SUITE_SCOPE_CORRECTION_HANDOVER_v0.1.0.md'},
  {id:'Q10-CROSSOVERS',name:'Qified Final Crossovers',role:'reconcile material linkages across analysis levels, domains, agencies, time and options',scope:'core',state:'STATIC_DATED_SYNTHESIS_REVIEW_CANDIDATE',origin:'docs/q10/q-pueblo/Q_PUEBLO_GENERIC_FORENSIC_ARCHITECTURE.md'},
  {id:'Q10-CIVIC-FORENSIC',name:'Q-Pueblo Generic Forensic Intelligence',role:'14-layer claims, timeline, rules, contradictions, hypotheses, impacts and verification',scope:'civic',state:'DOCUMENTED_ARCHITECTURE',origin:'docs/q10/q-pueblo/Q_PUEBLO_GENERIC_FORENSIC_ARCHITECTURE.md'},
  {id:'Q10-CIVIC-GRAPH',name:'Civic Infrastructure Layer Graph',role:'distinguish jurisdiction, operator, owner, contractor, financier and services',scope:'infrastructure',state:'MULTI_DOMAIN_SHADOW_CANDIDATE',origin:'docs/q10/q-pueblo/Q_PUEBLO_CIVIC_INFRASTRUCTURE_LAYER_GRAPH_v0.2.md'},
  {id:'Q10-PIP',name:'Process Intelligence Fabric',role:'declared versus observed workflows, bottlenecks and measurable improvement',scope:'operations',state:'S2_CONTROLLED_CANDIDATE',origin:'docs/q10/architecture/PROCESS_INTELLIGENCE_FABRIC_V02.md'},
  {id:'Q10-MPI',name:'Moral-Power Intelligence Plane',role:'rights, consent, vulnerability, institutional power and distribution of consequences',scope:'public_impact',state:'S2_CONTROLLED_CANDIDATE_NON_OPERATIONAL',origin:'docs/q10/architecture/MORAL_POWER_INTELLIGENCE_PLANE_v0.1.md'},
  {id:'Q10-SYN',name:'SYN / Synthetic Resilience Fabric',role:'defensive coordination and latent contingency analysis',scope:'systems',state:'CONTROLLED_CANDIDATE',origin:'docs/neuromesh/GLOSSARY_BINDING_GATES_v0.1.md'},
  {id:'Q10-QUANTUM-BRIDGE',name:'Quantum Bridge',role:'optional simulator-first specialized optimization with classical baseline',scope:'specialized',state:'S2_CONTROLLED_CANDIDATE_NO_LIVE_QPU',origin:'docs/q10/handover/MASTER_INDEX.md'}
 ]);
 const allowedScopes=new Set(['core','civic','infrastructure','operations','public_impact','systems','specialized']);
 const distinctIds=new Set(catalog.map(x=>x.id));
 if(distinctIds.size!==catalog.length||catalog.some(x=>!allowedScopes.has(x.scope)||!x.origin||!x.state))throw Error('Invalid Q10 candidate crosswalk');
 const string=v=>typeof v==='string'?v:'';
 function route(input){
  const text=[string(input?.topic),string(input?.question),string(input?.report?.title),string(input?.report?.topic)].join(' ').toLowerCase();
  const roles=new Set(['core']);
  if(/pueblo|county|civic|city|government|council|regional|budget|history|school|election|public|land|road|infrastructure|safety|water|energy|social|arts/.test(text))roles.add('civic');
  if(/road|street|water|sewer|fiber|transit|rail|bridge|utility|asset|traffic|industrial|construction|infrastructure|building|paving/.test(text))roles.add('infrastructure');
  if(/business|process|administration|workflow|project|service|budget|contract|permit|supply|operations|finance|procurement|maintenance/.test(text))roles.add('operations');
  if(/child|family|rights|harm|housing|safety|health|equity|ethic|consent|discrimination|surveillance|power|vulnerab|homeless|police/.test(text))roles.add('public_impact');
  if(/synthetic|agent|cyber|computer|model|automation|ai |digital twin|security/.test(text))roles.add('systems');
  if(/quantum|quantization|qpu/.test(text))roles.add('specialized');
  // Relevance does not assert an actual module call, completed analysis or operational availability.
  return {
   schema:'qp-q10-suite-candidate-crosswalk-v0.1',
   modules:catalog.filter(x=>roles.has(x.scope)).map(x=>({...x,selection:'RELEVANT_CANDIDATE_NOT_INVOKED',executed:false,authority:false})),
   fullCatalogSize:catalog.length,
   catalogExhaustive:false,
   verifiedConnections:0,
   sourceMode:'STATIC_POINTERS_TO_CONTROLLED_PRIVATE_Q10_CORE',
   runtimeExecuted:false,
   caveat:'Historical/candidate source pointers, not a full inventory, verified external connector count, production tool availability or proof that any Q10 module ran. Q10 module selection needs authorized admission, context and execution receipts.'
  };
 }
 const api=Object.freeze({catalog,route});
 if(typeof window!=='undefined')window.QPSuiteRegistry=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})();
