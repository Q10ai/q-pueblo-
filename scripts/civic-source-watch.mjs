// Read-only, review-gated public source availability monitoring.
// Emits a dated artifact only. Never autonomously changes published findings.
import {writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const entries=[
 {id:'pueblo-council-agendas',name:'City Council agenda hub',url:'https://www.pueblo.us/list.aspx'},
 {id:'pueblo-finance',name:'City of Pueblo Finance budget reports',url:'https://www.pueblo.us/92/Finance'},
 {id:'pueblo-county',name:'Pueblo County official meeting and information hub',url:'https://www.pueblocounty.gov/'},
 {id:'pueblo-west',name:'Pueblo West Metropolitan District',url:'https://www.pueblowestmetro.us/'},
 {id:'pueblo-water',name:'Pueblo Water',url:'https://pueblowater.org/'},
 {id:'pacog',name:'Pueblo Area Council of Governments',url:'https://www.pacog.net/'}
];
const time=new Date().toISOString(),results=[];
for(const entry of entries){try{const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);let r;try{r=await fetch(entry.url,{redirect:'follow',signal:controller.signal,headers:{'User-Agent':'Q-Pueblo-public-source-availability-monitor/0.1 (research only; contact Q10pueblo@gmail.com)','Accept':'text/html'}})}finally{clearTimeout(timer)}
 const content=(await r.text()).slice(0,500000);const hash=createHash('sha256').update(content).digest('hex');const safeurl=new URL(r.url);
 results.push({...entry,status:r.status,checkedAt:time,bodySha256:hash,bytesSampled:content.length,lastModified:r.headers.get('last-modified'),redirectHost:safeurl.hostname,disposition:r.ok?'REVIEW_RECOMMENDED_IF_CHANGED':'SOURCE_UNAVAILABLE'});
}catch(e){results.push({...entry,checkedAt:time,status:'FETCH_ERROR',error:String(e).slice(0,130),disposition:'MANUAL_FALLBACK'})}}
const doc={schema:'qp-public-source-watch-v1',checkedAt:time,mode:'READ_ONLY_NO_PUBLIC_AUTO_UPDATES',humanReviewRequired:true,warning:'A changed hash is a detection signal, not an established new fact or a reason to publish. Comparisons with a prior saved artifact require human review.',sources:results};
mkdirSync('watch-artifacts',{recursive:true});const name='watch-artifacts/public-source-watch-'+time.slice(0,10)+'.json';writeFileSync(name,JSON.stringify(doc,null,2));console.log('Wrote '+name+', '+results.length+' sources; never published.');
