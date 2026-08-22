import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN',reducedMotion:'no-preference'});
await context.addInitScript(()=>{
 const now=Date.now();
 localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'816-active',start:now-60000,events:[]},profile:{customEq:[]},prefs:{keepClip:false,scanSeconds:3,watermark:{photoMode:'raw',videoMode:'raw'}}}));
 localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
 try{Object.defineProperty(HTMLMediaElement.prototype,'play',{configurable:true,value:function(){return Promise.resolve()}})}catch{}
 class Axis816Recorder{
  static isTypeSupported(){return true}
  constructor(stream,opts={}){this.stream=stream;this.mimeType=opts.mimeType||'video/webm';this.state='inactive';this.ondataavailable=null;this.onstop=null}
  start(){this.state='recording'}
  requestData(){if(this.state==='recording')this.ondataavailable?.({data:new Blob(['axis-816-video'],{type:this.mimeType})})}
  stop(){if(this.state==='inactive')return;this.requestData();this.state='inactive';queueMicrotask(()=>this.onstop?.())}
 }
 try{Object.defineProperty(window,'MediaRecorder',{configurable:true,writable:true,value:Axis816Recorder})}catch{window.MediaRecorder=Axis816Recorder}
 const mediaDevices={getUserMedia:async()=>new MediaStream()};
 try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:mediaDevices})}catch{try{navigator.mediaDevices.getUserMedia=mediaDevices.getUserMedia}catch{}}
});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const svg=(name,text)=>({name,mimeType:'image/svg+xml',buffer:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="360" height="480"><rect width="360" height="480" fill="#1b2028"/><text x="24" y="250" fill="white" font-family="sans-serif" font-size="38">${text}</text></svg>`)});
let evidenceNetwork=0,armed=false;page.on('request',r=>{if(armed&&/\/api\//.test(new URL(r.url()).pathname))evidenceNetwork++});

async function seedEvidence(){await page.evaluate(async()=>{
 const DAY=864e5,latest=new Date();latest.setHours(9,0,0,0);const t4=latest.getTime(),starts=[t4-15*DAY,t4-10*DAY,t4-5*DAY,t4],weights=[30,32.5,34,35],sessions=[],meta={events:{}};
 for(let i=0;i<4;i++){const start=starts[i],eid=`row-816-${i+1}`,ref=`F-816-${i+1}`;sessions.push({id:`s-816-${i+1}`,start,end:start+24*60000,events:[{id:eid,time:start+60000,kind:'strength',equipmentId:'row',name:'坐姿划船机',weight:weights[i],reps:10+i,sets:3,muscles:['背部'],frameRefs:[ref]}]});meta.events[eid]={activity:{status:'finished',startedAt:start+10000,finishedAt:start+90000,intervals:[{start:start+10000,end:start+90000}]}}}
 localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions,active:null,profile:{customEq:[]},prefs:{}}));localStorage.setItem('axis_v8_meta',JSON.stringify(meta));
 const store=window.__AXIS_MEDIA_STORE__;if(!store?.put)throw new Error('media-store-unavailable');
 for(let i=0;i<4;i++)await store.put(`F-816-${i+1}`,new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="600" height="800" fill="#${['20242b','262b34','2b313b','313844'][i]}"/><text x="32" y="410" fill="white" font-size="54">E${i+1}</text></svg>`],{type:'image/svg+xml'}));
 window.dispatchEvent(new CustomEvent('axis:state-changed',{detail:{test:'816'}}));
});}

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:12000});
 const boot=await page.evaluate(()=>({release:window.__AXIS_RELEASE__,arch:window.__AXIS_ARCH__,captureField:window.__AXIS_816_CAPTURE_FIELD__||null,comparative:window.__AXIS_816_COMPARATIVE_EVIDENCE__||null,capture:window.__AXIS_CAPTURE__?{maxPhotos:window.__AXIS_CAPTURE__.maxPhotos,maxVideoMs:window.__AXIS_CAPTURE__.maxVideoMs,hasDraft:typeof window.__AXIS_CAPTURE__.draft==='function'}:null}));
 console.log('[AXIS 8.16 boot]',JSON.stringify(boot));
 assert.equal(boot.release,'8.16');
 assert.equal(boot.arch,'canonical-single-runtime');
 assert.equal(boot.captureField?.version,'8.16','8.16 Capture Field marker missing after canonical boot');
 assert.equal(boot.comparative?.version,'8.16','8.16 Comparative Evidence marker missing after canonical boot');
 assert.equal(boot.capture?.maxPhotos,12,'extended canonical Capture bridge missing photo bound');
 assert.equal(boot.capture?.maxVideoMs,60000,'extended canonical Capture bridge missing video bound');
 assert.equal(boot.capture?.hasDraft,true,'extended canonical Capture bridge missing draft API');
 const capMarker=await page.evaluate(()=>window.__AXIS_816_CAPTURE_FIELD__);
 assert.equal(capMarker.owner,'app.js');assert.equal(capMarker.persistenceOwner,'app.js');assert.equal(capMarker.mediaStore,'axis_v42_media');assert.equal(capMarker.maxPhotos,12);assert.equal(capMarker.maxVideoSeconds,60);assert.equal(capMarker.audio,false);assert.equal(capMarker.newStorage,false);

 await tap(page.locator('#scanBtn'));
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#captureStage')?.dataset.axisCaptureSurface==='v816-capture-field',undefined,{timeout:2000});
 assert.equal(await page.locator('#scanSheet').getAttribute('data-axis-capture-owner'),'app.js');
 assert.equal(await page.locator('#scanSheet').getAttribute('data-axis-capture-surface'),'v816-capture-field');
 assert.equal(await page.locator('#captureModes').isVisible(),false,'legacy capture controls should not compete with 8.16 surface');
 await tap(page.locator('#v816CaptureMode [data-v816-mode="photo"]'));
 const input=page.locator('#photoInput');
 await input.setInputFiles([svg('a.svg','A'),svg('b.svg','B'),svg('c.svg','C')]);
 await page.waitForFunction(()=>window.__AXIS_CAPTURE__.draft().photos.length===3,undefined,{timeout:3000});
 await input.setInputFiles([svg('d.svg','D'),svg('e.svg','E')]);
 await page.waitForFunction(()=>window.__AXIS_CAPTURE__.draft().photos.length===5,undefined,{timeout:3000});
 let d=await page.evaluate(()=>window.__AXIS_CAPTURE__.draft());assert.equal(d.photos.length,5);assert.equal(d.maxPhotos,12);assert.equal(await page.locator('#v816DraftRail .v816DraftItem').count(),5);
 const fifth=d.photos[4].url;await page.evaluate(()=>window.__AXIS_CAPTURE__.setCover(4));d=await page.evaluate(()=>window.__AXIS_CAPTURE__.draft());assert.equal(d.photos[0].url,fifth,'cover reorder did not move selected real frame to frameRefs[0] position');
 await page.evaluate(()=>window.__AXIS_CAPTURE__.removePhoto(1));await page.waitForFunction(()=>window.__AXIS_CAPTURE__.draft().photos.length===4);assert.equal(await page.locator('#v816DraftRail .v816DraftItem').count(),4);
 const captureGeometry=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:innerWidth,camera:document.querySelector('#captureStage .camera')?.getBoundingClientRect()}));assert.ok(captureGeometry.scroll<=captureGeometry.inner+1,`Capture Field overflow ${captureGeometry.scroll}/${captureGeometry.inner}`);assert.ok(captureGeometry.camera?.height>250,'camera field collapsed');

 await tap(page.locator('#v816CaptureMode [data-v816-mode="video"]'));
 await tap(page.locator('#v816Shutter'));await page.waitForFunction(()=>window.__AXIS_CAPTURE__.draft().recording===true,undefined,{timeout:1000});await page.waitForTimeout(120);
 d=await page.evaluate(()=>window.__AXIS_CAPTURE__.draft());assert.equal(d.maxVideoMs,60000);assert.ok(d.durationMs>=0&&d.durationMs<=60000);assert.equal(await page.locator('#v816Shutter').getAttribute('data-recording'),'1');
 await tap(page.locator('#v816Shutter'));await page.waitForFunction(()=>window.__AXIS_CAPTURE__.draft().recording===false&&!!window.__AXIS_CAPTURE__.draft().video,undefined,{timeout:1500});d=await page.evaluate(()=>window.__AXIS_CAPTURE__.draft());assert.ok(d.video);assert.ok(d.video.durationMs<=60000);assert.equal(await page.locator('#v816DraftRail .v816DraftVideo').count(),1);

 await tap(page.locator('#v816CaptureDone'));await page.waitForFunction(()=>!document.querySelector('#reviewStage')?.classList.contains('hidden'),undefined,{timeout:1500});assert.equal(await page.locator('#reviewStage #film img').count(),4);assert.equal(await page.locator('#reviewStage #film video').count(),1);assert.equal(await page.locator('#reviewStage #film video[autoplay]').count(),0);
 await page.evaluate(()=>window.__AXIS_CAPTURE__.prepareQuick('row'));
 await tap(page.locator('#saveScan'));await page.waitForFunction(()=>{try{return JSON.parse(localStorage.getItem('axis_v60_state')||'{}').active?.events?.length===1}catch{return false}},undefined,{timeout:5000});
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')).active.events[0]);assert.equal(saved.frameRefs.length,4,'canonical event did not preserve all deliberate photos');assert.ok(saved.clipRef,'explicit 8.16 video did not persist to the existing clipRef schema');assert.equal(saved.frameRefs[0].startsWith(`F-${saved.id}-`),true);assert.equal(saved.clipRef,`V-${saved.id}`);
 for(const ref of [...saved.frameRefs,saved.clipRef])assert.ok(await page.evaluate(async r=>!!(await window.__AXIS_MEDIA_READ__.get(r)),ref),`stored media missing ${ref}`);

 assert.equal(await page.evaluate(()=>window.__AXIS_CAPTURE__.openCanonicalCamera('photo','row',true)),true);await page.waitForFunction(()=>document.querySelector('#scanSheet')?.dataset.captureIntent==='quick-media'&&document.querySelector('#captureStage')?.dataset.axisCaptureSurface==='v816-capture-field');assert.ok((await page.locator('#v816CaptureContext').innerText()).includes('坐姿'),'Quick Record supplement did not enter the same context-aware Capture Field');await input.setInputFiles([svg('q1.svg','Q1'),svg('q2.svg','Q2')]);await page.waitForFunction(()=>window.__AXIS_CAPTURE__.draft().photos.length===2);assert.equal((await page.evaluate(()=>window.__AXIS_CAPTURE__.draft())).intent,'quick-media');await page.locator('#scanSheet [data-close="scanSheet"]').click();

 await seedEvidence();await tap(page.locator('nav.nav [data-view="insightsView"]'));await page.waitForFunction(()=>document.querySelector('#insightsView')?.classList.contains('active')&&document.querySelectorAll('.v813Node').length===4,undefined,{timeout:4000});await tap(page.locator('.v813Node.selected'));await page.waitForFunction(()=>document.querySelector('.v813Activity[data-v814-key="row"]'),undefined,{timeout:2000});await tap(page.locator('.v813Activity[data-v814-key="row"]'));await page.waitForFunction(()=>document.querySelectorAll('#v815Evidence .v815Rail [data-v815-encounter]').length===4,undefined,{timeout:3000});
 const bundle=await page.evaluate(()=>window.__AXIS_MEDIA_EVIDENCE__.resolve('row'));assert.equal(bundle.photoEncounters.length,4);assert.equal(bundle.compareAvailable,true);const compareMarker=await page.evaluate(()=>window.__AXIS_816_COMPARATIVE_EVIDENCE__);assert.equal(compareMarker.arbitraryPair,true);assert.deepEqual(compareMarker.presets,['ends','recent','adjacent']);assert.equal(compareMarker.factualOnly,true);assert.equal(compareMarker.replay,false);
 const rawBefore=await page.evaluate(()=>localStorage.getItem('axis_v60_state')),metaBefore=await page.evaluate(()=>localStorage.getItem('axis_v8_meta'));armed=true;
 await tap(page.locator('[data-v815-compare]'));await page.waitForFunction(()=>document.querySelectorAll('#v815Evidence .v815Compare figure').length===2,undefined,{timeout:2000});let text=(await page.locator('#v815Evidence .v815Compare').innerText()).trim();assert.ok(text.includes('最早影像')&&text.includes('最近影像'),`endpoint preset lost factual labels: ${text}`);
 await tap(page.locator('[data-v816-compare-side="right"]'));await tap(page.locator('#v815Evidence [data-v815-encounter="3"]'));await page.waitForFunction(()=>document.querySelector('#v815Evidence [data-v816-compare-side="right"]')?.textContent.includes('第3次'),undefined,{timeout:1800});text=(await page.locator('#v815Evidence .v815Compare').innerText()).trim();assert.ok(text.includes('最早影像')&&text.includes('第3次'),`arbitrary 1↔3 pair failed: ${text}`);assert.equal(await page.locator('#v815Evidence .v815Rail [data-v816-pair="1"]').count(),2);
 await tap(page.locator('[data-v816-compare-preset="recent"]'));await page.waitForFunction(()=>document.querySelector('#v815Evidence [data-v816-compare-side="left"]')?.textContent.includes('第3次')&&document.querySelector('#v815Evidence [data-v816-compare-side="right"]')?.textContent.includes('第4次'),undefined,{timeout:1800});
 await tap(page.locator('[data-v816-compare-side="left"]'));await tap(page.locator('#v815Evidence [data-v815-encounter="2"]'));await page.waitForFunction(()=>document.querySelector('#v815Evidence [data-v816-compare-side="left"]')?.textContent.includes('第2次'),undefined,{timeout:1800});text=(await page.locator('#v815Evidence .v815Compare').innerText()).trim();assert.ok(text.includes('第2次')&&text.includes('最近影像'),`arbitrary 2↔4 pair failed: ${text}`);
 await tap(page.locator('[data-v815-compare]'));await page.waitForFunction(()=>document.querySelector('#v815Evidence .v815Visual'));await tap(page.locator('#v815Evidence [data-v815-encounter="2"]'));await page.waitForFunction(()=>document.querySelector('#v815Evidence .v815Overlay')?.textContent.includes('第2/4次'),undefined,{timeout:1500});
 assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v60_state')),rawBefore,'comparative evidence mutated canonical training storage');assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v8_meta')),metaBefore,'comparative evidence mutated metadata storage');assert.equal(evidenceNetwork,0,'comparative evidence triggered API network ownership');assert.equal(await page.locator('#v815Evidence video[autoplay]').count(),0);assert.equal(await page.locator('.sheetWrap.show').count(),0,'comparative evidence escaped in-place surface');
 const evidenceGeometry=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:innerWidth}));assert.ok(evidenceGeometry.scroll<=evidenceGeometry.inner+1,`Comparative Evidence overflow ${evidenceGeometry.scroll}/${evidenceGeometry.inner}`);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(50);
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.16 Capture + Comparative Evidence ${ENGINE}] PASS · unified main/Quick Capture Field · multi-photo draft/cover/delete · one <=60s video · existing frameRefs/clipRef persistence · arbitrary factual two-point compare · no autoplay/network/storage drift · mobile-safe`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}