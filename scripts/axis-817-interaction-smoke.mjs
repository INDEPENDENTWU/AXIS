import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});

await context.addInitScript(()=>{
 const DAY=864e5,now=Date.now(),base=new Date(now);base.setHours(9,0,0,0);const t=base.getTime();
 const sessions=[],meta={events:{},prefs:{}};
 const rowTimes=[t-15*DAY,t-10*DAY,t-5*DAY,t-DAY],weights=[25,27.5,30,32.5];
 for(let i=0;i<4;i++){
  const start=rowTimes[i],eid=`row-817-${i+1}`,ref=`F-817-${i+1}`;
  sessions.push({id:`s-row-817-${i+1}`,start,end:start+24*60000,events:[{id:eid,time:start+60000,kind:'strength',equipmentId:'row',name:'坐姿 / 胸托划船',weight:weights[i],reps:10+i,sets:3,muscles:['背部'],frameRefs:[ref],photoBytes:1200,videoBytes:0}]});
  meta.events[eid]={activity:{status:'finished',startedAt:start+10000,finishedAt:start+90000,intervals:[{start:start+10000,end:start+90000}]}};
 }
 const monthAgo=new Date(t);monthAgo.setMonth(monthAgo.getMonth()-1);const old1=monthAgo.getTime();
 const twoMonths=new Date(t);twoMonths.setMonth(twoMonths.getMonth()-2);const old2=twoMonths.getTime();
 for(const [i,start] of [[1,old1],[2,old2]]){
  const eid=`lat-archive-${i}`;sessions.push({id:`s-archive-${i}`,start,end:start+30*60000,events:[{id:eid,time:start+60000,kind:'strength',equipmentId:'lat',name:'高位下拉',weight:30+i*5,reps:10,sets:3,muscles:['背部'],frameRefs:[],photoBytes:0,videoBytes:0}]});
  meta.events[eid]={activity:{status:'finished',startedAt:start+10000,finishedAt:start+80000,intervals:[{start:start+10000,end:start+80000}]}};
 }
 sessions.sort((a,b)=>b.start-a.start);
 localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions,active:{id:'817-active',start:now-60000,events:[]},profile:{customEq:[]},prefs:{keepClip:false,scanSeconds:3,watermark:{photoMode:'raw',videoMode:'raw',name:true,data:true,time:true,brand:false,pos:'bl'}}}));
 localStorage.setItem('axis_v8_meta',JSON.stringify(meta));
 try{Object.defineProperty(HTMLMediaElement.prototype,'play',{configurable:true,value:function(){return Promise.resolve()}})}catch{}
 class Axis817Recorder{
  static isTypeSupported(){return true}
  constructor(stream,opts={}){this.stream=stream;this.mimeType=opts.mimeType||'video/webm';this.state='inactive';this.ondataavailable=null;this.onstop=null}
  start(){this.state='recording'}
  requestData(){if(this.state==='recording')this.ondataavailable?.({data:new Blob(['axis-817-video'],{type:this.mimeType})})}
  stop(){if(this.state==='inactive')return;this.requestData();this.state='inactive';queueMicrotask(()=>this.onstop?.())}
 }
 try{Object.defineProperty(window,'MediaRecorder',{configurable:true,writable:true,value:Axis817Recorder})}catch{window.MediaRecorder=Axis817Recorder}
 const mediaDevices={getUserMedia:async()=>new MediaStream()};
 try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:mediaDevices})}catch{try{navigator.mediaDevices.getUserMedia=mediaDevices.getUserMedia}catch{}}
});

const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async loc=>ENGINE==='webkit'?loc.tap():loc.click();

await page.goto(BASE,{waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_RELEASE__==='8.17'&&window.__AXIS_816_CAPTURE_FIELD__?.version==='8.16'&&window.__AXIS_817_INTERACTION__?.version==='8.17',undefined,{timeout:15000});
const manifest=await (await page.request.get(`${BASE}/axis-build.json`)).json();
assert.equal(manifest.version,'8.17');assert.equal(manifest.baseVersion,'8.17');assert.equal(manifest.axis817?.evidence?.compareModel,'two-named-slots');

await page.evaluate(async()=>{
 const store=window.__AXIS_MEDIA_STORE__;if(!store?.put)throw new Error('media-store-unavailable');
 for(let i=1;i<=4;i++)await store.put(`F-817-${i}`,new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="600" height="800" fill="#${['20242b','262c35','2b323d','303947'][i-1]}"/><text x="36" y="420" fill="white" font-size="64">T${i}</text></svg>`],{type:'image/svg+xml'}));
 window.dispatchEvent(new CustomEvent('axis:state-changed',{detail:{test:'817'}}));
});

/* Quick Record has one current evidence entry and delegates to the canonical Capture Field. */
await page.waitForSelector('#quickRecordBtn',{state:'visible'});await tap(page.locator('#quickRecordBtn'));
await page.waitForSelector('#quickRecordSheet.show');
const rowQuick=page.locator('#v8Recent [data-qid="row"]');assert.ok(await rowQuick.count(),'row missing from Quick Record recent list');await tap(rowQuick);
await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#scanSheet')?.classList.contains('v8-quick')&&document.querySelector('#v882QuickMedia'),undefined,{timeout:2500});
const quickMedia=page.locator('#v882QuickMedia [data-v882-media]');assert.equal(await quickMedia.count(),1,'Quick Record should expose exactly one evidence entry');
assert.equal((await quickMedia.innerText()).trim(),'补拍照片 / 视频');
const quickText=await page.locator('#v882QuickMedia').innerText();assert.ok(!quickText.includes('3秒视频')&&!quickText.includes('5秒视频'),'legacy Quick video-duration buttons returned');
await tap(quickMedia);
await page.waitForFunction(()=>document.querySelector('#captureStage')&&!document.querySelector('#captureStage').classList.contains('hidden')&&document.querySelector('#v816CaptureMode [data-v816-mode="photo"]')?.getAttribute('aria-selected')==='true',undefined,{timeout:2500});
assert.equal(await page.evaluate(()=>window.__AXIS_CAPTURE__?.snapshot?.().intent),'quick-media');
assert.equal(await page.evaluate(()=>window.__AXIS_CAPTURE__?.draft?.().mode),'photo');

/* A deliberately recorded clip is retained even for users carrying the retired keepClip=false preference. */
const clipDraft=await page.evaluate(async()=>{const c=window.__AXIS_CAPTURE__;c.setMode('video');const started=await c.startVideo();await new Promise(r=>setTimeout(r,40));await c.stopVideo(false);return{started,draft:c.draft()}});
assert.equal(clipDraft.started,true);assert.ok(clipDraft.draft.video,'explicit video draft missing');
assert.equal(await page.evaluate(()=>window.__AXIS_CAPTURE__.finish()),true);
await page.waitForFunction(()=>!document.querySelector('#reviewStage')?.classList.contains('hidden'),undefined,{timeout:1500});
await tap(page.locator('#saveScan'));
await page.waitForFunction(()=>!document.querySelector('#scanSheet')?.classList.contains('show'),undefined,{timeout:3000});
const savedVideo=await page.evaluate(()=>{const x=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),e=x.active?.events?.at(-1);return{keepClip:x.prefs?.keepClip,event:e&&{clipRef:e.clipRef,videoBytes:e.videoBytes}}});
assert.equal(savedVideo.keepClip,false);assert.ok(savedVideo.event?.clipRef&&savedVideo.event.videoBytes>0,'explicit video was discarded by retired preference');

/* Settings describe the current Capture model rather than historical modes. */
await tap(page.locator('#settingsBtn'));await page.waitForSelector('#settingsSheet.show');
const settingsText=await page.locator('#settingsSheet').innerText();
assert.ok(settingsText.includes('扫描取样'),'current Scan sampling preference missing');
assert.ok(settingsText.includes('拍摄视频')&&settingsText.includes('最长60秒 · 自动保存'),'current video capability copy missing');
assert.ok(settingsText.includes('资料与收纳'),'archive entry missing');
assert.ok(!settingsText.includes('默认扫描')&&!settingsText.includes('保留现场视频'),'obsolete Capture preference copy returned');
assert.equal(await page.locator('#scanSeconds [data-sec]').count(),2);assert.equal(await page.locator('#keepClipSwitch:visible').count(),0,'retired keepClip switch remains visible');
await tap(page.locator('[data-close="settingsSheet"]'));

/* Trend Compare is a two-slot model. Timeline taps replace the active slot directly. */
await tap(page.locator('nav.nav [data-view="insightsView"]'));
await page.waitForFunction(()=>document.querySelector('#insightsView')?.dataset.axisTrendsOwner==='v8131-evolution-field',undefined,{timeout:2500});
const activity=page.locator('.v813Activity[data-v814-key]').filter({hasText:'坐姿'}).first();assert.ok(await activity.count(),'Evolution activity row missing');await tap(activity);
await page.waitForFunction(()=>document.querySelector('#v814Object')&&!document.querySelector('#v814Object').hidden&&document.querySelector('#v815Evidence [data-v815-compare]'),undefined,{timeout:3000});
await tap(page.locator('#v815Evidence [data-v815-compare]'));
await page.waitForSelector('#v815Evidence .v817CompareBar:not([hidden])');
const slots=page.locator('#v815Evidence .v817CompareSlots [data-v816-compare-side]');assert.equal(await slots.count(),2);
const left=slots.filter({has:page.locator('span:text("起点")')}).first(),right=slots.filter({has:page.locator('span:text("对照")')}).first();
assert.equal(await right.getAttribute('aria-pressed'),'true','Compare slot should be active by default');
const stage=page.locator('#v815Evidence .v815Stage');await stage.evaluate(el=>el.dataset.axis817Identity='stable');
assert.equal(await stage.evaluate(el=>getComputedStyle(el).opacity),'1');
const rail=page.locator('#v815Evidence .v815Rail [data-v815-encounter]');assert.ok(await rail.count()>=4,'not enough evidence points for direct selection');
const rightBefore=(await right.innerText()).trim(),leftBefore=(await left.innerText()).trim();
const targetRight=rail.nth(1);await tap(targetRight);
assert.equal(await stage.evaluate(el=>el.dataset.axis817Identity),'stable','comparison stage remounted during selection');
assert.ok(await stage.locator('img').count()>=2,'previous comparison disappeared while new local media was resolving');
await page.waitForFunction(v=>{const b=[...document.querySelectorAll('.v817CompareSlots [data-v816-compare-side]')].find(x=>x.dataset.v816CompareSide==='right');return b&&b.innerText.trim()!==v},rightBefore,{timeout:2500});
const rightAfter=(await right.innerText()).trim();assert.notEqual(rightAfter,rightBefore);assert.equal((await left.innerText()).trim(),leftBefore,'changing compare point also changed start point');
await tap(left);assert.equal(await left.getAttribute('aria-pressed'),'true');
const targetLeft=rail.nth(2);const rightLocked=(await right.innerText()).trim();await tap(targetLeft);
await page.waitForFunction(v=>{const b=[...document.querySelectorAll('.v817CompareSlots [data-v816-compare-side]')].find(x=>x.dataset.v816CompareSide==='left');return b&&b.innerText.trim()!==v},leftBefore,{timeout:2500});
assert.equal((await right.innerText()).trim(),rightLocked,'changing start point also changed compare point');
assert.equal(await stage.evaluate(el=>getComputedStyle(el).opacity),'1','comparison stage opacity pulse returned');

/* Time-first archive keeps long history compact without changing deletion semantics. */
await tap(page.locator('#settingsBtn'));await page.waitForSelector('#settingsSheet.show');await tap(page.locator('#storageBtn'));await page.waitForSelector('#storageSheet.show');
await page.waitForFunction(()=>document.querySelectorAll('#sessionDeleteList .v817ArchiveGroup').length>=3,undefined,{timeout:2500});
const groups=page.locator('#sessionDeleteList .v817ArchiveGroup');assert.ok(await groups.count()>=3);assert.ok(await groups.nth(0).getAttribute('open')!==null,'newest archive month should open');assert.equal(await groups.nth(1).getAttribute('open'),null,'older archive month should stay collapsed');
await groups.nth(1).locator('summary').click();const deleteRow=groups.nth(1).locator('[data-delete-session]').first();await tap(deleteRow);assert.ok((await deleteRow.getAttribute('class')||'').includes('selected'),'existing archive selection semantics broke');

const overflow=await page.evaluate(()=>({w:document.documentElement.scrollWidth,v:innerWidth}));assert.ok(overflow.w<=overflow.v+1,`horizontal overflow ${overflow.w}/${overflow.v}`);
assert.deepEqual(errors,[],`page errors: ${errors.join('\n')}`);
console.log(`[AXIS 8.17 Interaction Convergence ${ENGINE}] PASS · one Quick evidence entry · current Capture prefs · explicit video retained · direct two-slot compare · stable stage · time-first archive`);
await browser.close();
