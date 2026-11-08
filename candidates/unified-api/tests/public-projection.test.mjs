import test from 'node:test';
import assert from 'node:assert/strict';
import {createProjection, safePublic, timing, routeRequest} from '../public-projection.mjs';
const now='2026-11-08',future='2027-11-08',hash='a'.repeat(64);
const cis={status:'REVIEWED',reviewed_by:'FICTIONAL_REVIEWER',past:'Historical outcomes not established',present:'Effects require case evidence',future:'Intergenerational uncertainty recorded'};
const approval={state:'APPROVED_PUBLIC',by:'FICTIONAL_REVIEWER',at:'2026-10-01',expires_at:'2026-12-01'};
const base=(id,more={})=>({id,security_class:'S0',review_state:'REVIEWED',synthetic:true,child_impact:{...cis},approval:{...approval},valid_from:'2026-10-01',recorded_at:'2026-10-02',...more});
function sample(){
 const src=base('SRC1',{kind:'FICTIONAL_SOURCE',title:'Synthetic source',publisher:'Example only',url:'https://example.invalid/source',license_review:'APPROVED',sha256:hash});
 const e1=base('ORG1',{type:'ORGANIZATION',name:'Fictional Bureau',source_ids:['SRC1']});
 const e2=base('PRJ1',{type:'PROJECT',name:'Fictional Project',source_ids:['SRC1']});
 return {sources:[src],entities:[e1,e2],issues:[base('I1',{source_ids:['SRC1']})],
   edges:[base('E1',{source_ids:['SRC1'],from_id:'ORG1',to_id:'PRJ1',relation:'REFERENCE_ONLY'})],
   wiki:[base('W1',{source_ids:['SRC1'],slug:'fictional',title:'Sample Civic Source',summary:'Fictional examples for testing only',limitations:'Not real Pueblo evidence'})],
   money:[base('M1',{source_ids:['SRC1'],issue_id:'I1',stage:'PROPOSED',amount:100,currency:'USD',period:'2026',no_double_count_group:'G1'}),
          base('M2',{source_ids:['SRC1'],issue_id:'I1',stage:'PAID',amount:20,currency:'USD',period:'2026',no_double_count_group:'G1'})],
   features:[base('F1',{source_ids:['SRC1'],layer:'roads',area_label:'Illustrative region',name:'Synthetic public road corridor',precision:'AGGREGATED'})],
   scenarios:[base('SC1',{source_ids:['SRC1'],mode:'HYPOTHETICAL',real_world_outcome:false,title:'Illustrative repair choice',assumptions:['Synthetic'],branches:[{option:'A',result:'UNKNOWN'}]})],
   events:[base('EV1',{source_ids:['SRC1'],subject_id:'I1',kind:'INTERPRETATION',summary:'Synthetic view',valid_from:'2026-09-01',recorded_at:'2026-10-02'})],
   perspectives:[base('P1',{source_ids:['SRC1'],issue_id:'I1',kind:'ILLUSTRATIVE_ANALYTICAL_LENS',lens:'family',priority:'travel',possible_benefit:'safer crossing',possible_burden:'detours',question:'Which crossings?'})]
 };
}
const make=(o,opts={})=>createProjection(o,{now,...opts});
test('production blocks all synthetic mock records',()=>assert.equal(make(sample()).stats().public_sources,0));
test('staging test exposes only explicitly allowed synthetic records',()=>assert.deepEqual(make(sample(),{allowSynthetic:true}).stats(),{public_sources:1,public_entities:2,public_issues:1,public_wiki:1,public_edges:1,public_money:2,public_scenarios:1}));
test('S2 private source never returns',()=>{const d=sample();d.sources[0].security_class='S2';assert.equal(make(d,{allowSynthetic:true}).stats().public_wiki,0)});
test('unknown source license blocks',()=>{const d=sample();d.sources[0].license_review='UNKNOWN';assert.equal(make(d,{allowSynthetic:true}).stats().public_sources,0)});
test('invalid source fingerprint blocks',()=>{const d=sample();d.sources[0].sha256='none';assert.equal(make(d,{allowSynthetic:true}).stats().public_sources,0)});
test('future approval blocks',()=>{const d=sample();d.sources[0].approval.at='2026-11-09';assert.equal(make(d,{allowSynthetic:true}).stats().public_sources,0)});
test('expired approval blocks',()=>{const d=sample();d.sources[0].approval.expires_at='2026-11-01';assert.equal(make(d,{allowSynthetic:true}).stats().public_sources,0)});
test('no human approver blocks',()=>{const d=sample();d.sources[0].approval.by=null;assert.equal(make(d,{allowSynthetic:true}).stats().public_sources,0)});
test('child past review required',()=>{const d=sample();d.wiki[0].child_impact.past='';assert.equal(make(d,{allowSynthetic:true}).stats().public_wiki,0)});
test('child present review required',()=>{const d=sample();d.wiki[0].child_impact.present='';assert.equal(make(d,{allowSynthetic:true}).stats().public_wiki,0)});
test('child future review required',()=>{const d=sample();d.wiki[0].child_impact.future='';assert.equal(make(d,{allowSynthetic:true}).stats().public_wiki,0)});
test('child reviewer identity required',()=>{const d=sample();d.wiki[0].child_impact.reviewed_by='';assert.equal(make(d,{allowSynthetic:true}).stats().public_wiki,0)});
test('private person node never enters graph',()=>{const d=sample();d.entities[0].type='PERSON';assert.equal(make(d,{allowSynthetic:true}).visor('ORG1'),null)});
test('sensitive location blocks graph entity',()=>{const d=sample();d.entities[1].precise_private_location=true;assert.equal(make(d,{allowSynthetic:true}).visor('ORG1')?.nodes.length,1)});
test('unapproved edge does not create guilt by association',()=>{const d=sample();d.edges[0].review_state='HOLD';assert.equal(make(d,{allowSynthetic:true}).visor('ORG1').edges.length,0)});
test('graph caps traversal depth',()=>assert.equal(make(sample(),{allowSynthetic:true}).visor('ORG1',3),null));
test('graph includes provenance and no wrongdoing inference',()=>assert.equal(make(sample(),{allowSynthetic:true}).visor('ORG1').edges[0].association_is_not_wrongdoing,true));
test('proposal and paid are separate no summed total',()=>{const p=make(sample(),{allowSynthetic:true});assert.equal(p.moneyTrace('I1').length,2);assert.equal(p.moneyTrace('I1','PAID')[0].amount,20);});
test('invalid money stage rejected',()=>{const d=sample();d.money[0].stage='STOLEN';assert.equal(make(d,{allowSynthetic:true}).moneyTrace('I1').length,1)});
test('sources missing blocks claims',()=>{const d=sample();d.wiki[0].source_ids=['MISSING'];assert.equal(make(d,{allowSynthetic:true}).stats().public_wiki,0)});
test('geo feature excludes exact geometry',()=>{const d=sample();d.features[0].coordinates=[38,-104];assert.equal(make(d,{allowSynthetic:true}).shadow().length,0)});
test('shadow returns generalized area only',()=>{const x=make(sample(),{allowSynthetic:true}).shadow('roads')[0];assert.equal(x.precision,'AGGREGATED');assert.equal('coordinates' in x,false)});
test('scenario must be explicitly hypothetical',()=>{const d=sample();d.scenarios[0].mode='PREDICTION';assert.equal(make(d,{allowSynthetic:true}).stats().public_scenarios,0)});
test('scenario does not imply a probability',()=>assert.equal(make(sample(),{allowSynthetic:true}).scenario('SC1').probability,'NOT_ESTIMATED'));
test('POV are labeled fictional analytical lenses',()=>assert.equal(make(sample(),{allowSynthetic:true}).compare('I1')[0].kind,'ILLUSTRATIVE_ANALYTICAL_LENS'));
test('wiki excerpt is time-limited',()=>assert.equal(make(sample(),{allowSynthetic:true}).searchWiki('Sample','2026-09-01').length,0));
test('historical replay only includes what was known then',()=>assert.equal(make(sample(),{allowSynthetic:true}).timeline('I1','2026-10-02','2026-09-20').length,0));
test('history includes revision and event date',()=>{const v=make(sample(),{allowSynthetic:true}).timeline('I1');assert.equal(v.length,1);assert.equal(v[0].recorded_at,'2026-10-02');});
test('bad as_of request rejected',()=>assert.equal(routeRequest(make(sample(),{allowSynthetic:true}),'/api/v1/wiki/search',{q:'Sample',as_of:'tomorrow'}).status,400));
test('unknown route returns no data',()=>assert.equal(routeRequest(make(sample(),{allowSynthetic:true}),'/api/v1/admin/secrets').status,404));
test('source public API returns only allowlisted fields',()=>assert.deepEqual(Object.keys(make(sample(),{allowSynthetic:true}).source('SRC1')),['id','title','kind','publisher','url','as_of','sha256']));
test('normal routes return data',()=>assert.equal(routeRequest(make(sample(),{allowSynthetic:true}),'/api/v1/wiki/pages/fictional').body.title,'Sample Civic Source'));
test('unreviewed child risk can never clear',()=>assert.equal(safePublic(base('X',{child_impact:null}),now,{allowSynthetic:true}),false));
test('time model preserves observed vs effective dates',()=>assert.equal(timing({valid_from:'2026-01-01',recorded_at:'2026-11-08'},'2026-02-01','2026-02-01'),false));
