import assert from 'node:assert/strict';
import {onRequestPost,onRequestGet,onRequestDelete} from '../functions/api/v1/research.js';
import {onRequestPost as adminPost,onRequestGet as adminGet} from '../functions/api/v1/admin/research.js';
const root='https://example.test';
const input={question:'Which ordinance establishes the operating budget for next year?',kind:'question',sourceUrl:'https://example.org/public-record',publicInformationOnly:true};
function post(path,body,headers={}){
 return new Request(root+path,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)});
}
const gone=await onRequestPost({request:post('/api/v1/research',input,{'Origin':root}),env:{}});
assert.equal(gone.status,503,'intake must fail closed without D1 and secrets');
assert.equal((await gone.json()).state,'INTAKE_DISABLED');
assert.equal((await onRequestGet({request:new Request(root+'/api/v1/research?id=none'),env:{}})).status,503);
assert.equal((await onRequestDelete({request:new Request(root+'/api/v1/research',{method:'DELETE'}),env:{}})).status,503);
const configured={QP_INTAKE_ENABLED:'true',QP_DB:{},QP_TURNSTILE_SECRET:'test-not-a-real-secret',QP_REVIEW_TOKEN:'A'.repeat(40)};
assert.equal((await onRequestPost({request:post('/api/v1/research',input),env:configured})).status,403,'reject cross-origin and missing origin');
assert.equal((await onRequestPost({request:post('/api/v1/research',{...input,question:'Person email test@example.com'}, {'Origin':root}),env:configured})).status,400,'reject obvious personal details');
assert.equal((await onRequestPost({request:post('/api/v1/research',{...input,publicInformationOnly:false},{'Origin':root}),env:configured})).status,400,'consent must be explicit');
assert.equal((await adminGet({request:new Request(root+'/api/v1/admin/research'),env:configured})).status,401,'never permit anonymous review');
const db={prepare:sql=>({bind:(...v)=>({first:async()=>({state:'human_review',revision:4})})})};
const env={QP_DB:db,QP_REVIEW_TOKEN:'A'.repeat(40)};
const h={'Authorization':'Bearer '+env.QP_REVIEW_TOKEN};
let review={id:'d7d1f372-c346-4ab1-942a-c60c19201cef',expectedRevision:4,state:'approved_for_release',reviewer:'Editorial review',reason:'Checked the original material independently and recorded limitations.'};
assert.equal((await adminPost({request:post('/api/v1/admin/research',review,h),env})).status,422,'dual-source review required');
const notPublished=await adminPost({request:post('/api/v1/admin/research',{...review,verifiedSourceUrl:'https://example.org/source-a',counterSourceUrl:'https://example.org/source-b',humanCheckedEvidence:true,humanCheckedCounterevidence:true},h),env:{...env,QP_DB:{...db,batch:async()=>[{meta:{changes:1}},{meta:{changes:1}}]}}});
assert.equal(notPublished.status,200);
assert.equal((await notPublished.json()).automaticPublication,false,'review approval must never publish');
console.log('PASS research API: fail-closed intake, same-origin, privacy validation, admin auth, dual human review, no auto-publication.');
