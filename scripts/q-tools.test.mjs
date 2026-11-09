import test from 'node:test';import assert from 'node:assert/strict';
import {computeEE,computeMoney,computeT2Y} from '../public/q-tools-core.mjs';
test('EE includes mandatory human review cost and avoids claiming energy without input',()=>{
 const r=computeEE({tasks:100,manual:20,automation:4,review:7,rate:25,subscription:35,perTask:0.02,wh:''});
 assert.equal(r.currentHours,100/3);assert.equal(r.proposedHumanHours,100*11/60);assert.equal(r.energy,null);assert.equal(r.evidence,'USER_ASSUMPTIONS_NOT_FIELD_MEASUREMENTS')});
test('EE optional energy is explicitly user supplied, not measured',()=>{const r=computeEE({tasks:100,manual:30,automation:5,review:4,rate:20,subscription:0,perTask:0,wh:2,pue:1.4,kwhPrice:.2});assert.equal(r.energy.kwhEstimate,.28);assert.equal(r.energy.evidence,'USER_SUPPLIED_ASSUMPTION')});
test('T2Y weak truth cannot be rescued by perfect yield',()=>{const r=computeT2Y({truth:.79,yieldValue:1,agency:1,reversibility:1,harm:0});assert.equal(r.gate,'HOLD_WEAK_TRUTH')});
test('T2Y high harm cannot be rescued by high truth',()=>{const r=computeT2Y({truth:1,yieldValue:1,agency:1,reversibility:1,harm:.21});assert.equal(r.gate,'HOLD_HARM_THRESHOLD')});
test('money stages never sum authorization with payment',()=>{const r=computeMoney({proposed:10,authorized:5,contracted:4,paid:3,recovered:0,benefit:0});assert.equal(r.netDisbursement,3);assert.equal(r.authorityRemaining,2);assert(!('totalCost' in r));assert.match(r.rule,/Do NOT sum/)});
test('money scope warning triggers but no accusation is inferred',()=>{const r=computeMoney({proposed:10,authorized:2,contracted:4,paid:5,recovered:0,benefit:0});assert.equal(r.warnings.length,2);assert(!JSON.stringify(r).includes('fraud'))});
test('rejects negative and malformed assumptions',()=>{assert.throws(()=>computeMoney({proposed:'-1',authorized:2,contracted:1,paid:1,recovered:0,benefit:0}));assert.throws(()=>computeT2Y({truth:'not a number',yieldValue:1,agency:1,reversibility:1,harm:0}))});
