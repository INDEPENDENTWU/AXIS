import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
let armed=false,network=0;page.on('request',r=>{if(armed&&/\/api\//.test(new URL(r.url()).pathname))network++});

const seed=()=>page.evaluate(async()=>{
 const DAY=864e5,now=new Date();now.setHours(9,0,0,0);const t2=now.getTime(),t1=t2-7*DAY;
 const sessions=[t1,t2].map((start,i)=>({id:`master-session-${i+1}`,start,end:start+30*60000,events:[{id:`master-row-${i+1}`,time:start+60000,kind:'strength',equipmentId:'row',name:'坐姿划船机',weight:i?35:30,reps:10,sets:3,muscles:['背部'],frameRefs:[i?'F-MASTER-LATEST':'F-MASTER-FIRST']}]}));
 const meta={events:{'master-row-1':{activity:{status:'finished',startedAt:t1+10000,finishedAt:t1+120000,intervals:[{start:t1+10000,end:t1+120000}]}},'master-row-2':{activity:{status:'finished',startedAt:t2+10000,finishedAt:t2+120000,intervals:[{start:t2+10000,end:t2+120000}]}}}};
 localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions,active:null,profile:{customEq:[]},prefs:{}}));
 localStorage.setItem('axis_v8_meta',JSON.stringify(meta));
 const store=window.__AXIS_MEDIA_STORE__;if(!store?.put)throw new Error('media-store-unavailable');
 const svg=label=>new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="#20242b"/><text x="28" y="210" fill="white" font-size="38">${label}</text></svg>`],{type:'image/svg+xml'});
 await store.put('F-MASTER-FIRST',svg('STAMPED-FIRST'));
 await store.put('F-RAW-MASTER-FIRST',svg('CLEAN-FIRST'));
 await store.put('F-MASTER-LATEST',svg('STAMPED-LATEST'));
 await store.put('F-RAW-MASTER-LATEST',svg('CLEAN-LATEST'));
 await store.put('F-FALLBACK',svg('CANONICAL-FALLBACK'));
 window.dispatchEvent(new CustomEvent('axis:state-changed',{detail:{test:'817-media-master'}}));
});

const blobText=locator=>page.evaluate(async sel=>{const el=document.querySelector(sel);if(!el?.src)return'';return fetch(el.src).then(r=>r.text())},locator);

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:14000}))?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_MEDIA_STORE__?.format==='axis-media-arraybuffer-v1'&&window.__AXIS_MEDIA_MASTER__?.nonDestructive===true&&window.__AXIS_817_MEDIA_MASTER_EVIDENCE__?.masterFirst===true&&window.__AXIS_817_MEDIA_MASTER_WATERMARK__?.nonDestructive===true,undefined,{timeout:14000});
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.17');
 assert.equal(await page.evaluate(()=>window.__AXIS_MEDIA_MASTER__.database),'axis_v42_media');
 assert.equal(await page.evaluate(()=>window.__AXIS_MEDIA_MASTER__.sameStore),true);
 assert.equal(await page.evaluate(()=>window.__AXIS_MEDIA_MASTER__.newSchema),false);
 assert.equal(await page.evaluate(()=>window.__AXIS_MEDIA_MASTER__.keyFor('F-ABC-0')),'F-RAW-ABC-0');
 assert.equal(await page.evaluate(()=>window.__AXIS_MEDIA_MASTER__.keyFor('V-ABC')),'V-RAW-ABC');
 await seed();
 const masterText=await page.evaluate(async()=>{const b=await window.__AXIS_MEDIA_MASTER__.get('F-MASTER-LATEST');return b?.text()});
 assert.ok(masterText.includes('CLEAN-LATEST'),'master bridge did not return clean photo');
 assert.equal(await page.evaluate(()=>window.__AXIS_MEDIA_MASTER__.has('F-MASTER-LATEST')),true);
 const fallbackText=await page.evaluate(async()=>{const b=await window.__AXIS_MEDIA_MASTER__.get('F-FALLBACK');return b?.text()});
 assert.ok(fallbackText.includes('CANONICAL-FALLBACK'),'master bridge lost canonical fallback');
 armed=true;
 await tap(page.locator('nav.nav [data-view="insightsView"]'));
 await page.waitForFunction(()=>document.querySelector('#insightsView')?.classList.contains('active')&&document.querySelectorAll('.v813Node').length>0,undefined,{timeout:4000});
 const row=page.locator('.v813Activity[data-v814-key="row"]');
 if(await row.count()===0){await tap(page.locator('.v813Node.selected'));await page.waitForTimeout(80)}
 await tap(page.locator('.v813Activity[data-v814-key="row"]'));
 await page.waitForFunction(()=>!!document.querySelector('#v815Evidence .v815Stage img'),undefined,{timeout:3000});
 const single=await blobText('#v815Evidence .v815Stage img');
 assert.ok(single.includes('CLEAN-LATEST'),`single Evidence did not prefer clean master: ${single.slice(0,160)}`);
 await tap(page.locator('[data-v815-compare]'));
 await page.waitForFunction(()=>document.querySelectorAll('#v815Evidence .v815Compare img').length===2,undefined,{timeout:2500});
 const pair=await page.evaluate(async()=>Promise.all(Array.from(document.querySelectorAll('#v815Evidence .v815Compare img')).map(x=>fetch(x.src).then(r=>r.text()))));
 assert.ok(pair[0].includes('CLEAN-FIRST'),`comparison start is not clean master: ${pair[0].slice(0,160)}`);
 assert.ok(pair[1].includes('CLEAN-LATEST'),`comparison target is not clean master: ${pair[1].slice(0,160)}`);
 assert.equal(network,0,'media master/Evidence unexpectedly acquired API ownership');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.17 Media Master ${ENGINE}] PASS · same-store clean master bridge · canonical fallback · Evidence clean-master-first · comparison clean-master-first · no network`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
