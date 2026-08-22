import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN',reducedMotion:'no-preference'});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
let armed=false,evidenceNetwork=0;page.on('request',r=>{if(armed&&/\/api\//.test(new URL(r.url()).pathname))evidenceNetwork++});

const seed=()=>page.evaluate(async()=>{
 const DAY=864e5,latest=new Date();latest.setHours(9,0,0,0);const t3=latest.getTime(),starts=[t3-14*DAY,t3-7*DAY,t3],sessions=[],meta={events:{}};
 const rows=[{w:30,r:10,frames:['F-ROW-FIRST']},{w:32.5,r:10,frames:[]},{w:35,r:12,frames:['F-ROW-LATEST'],clip:'V-ROW-LATEST'}];
 starts.forEach((start,i)=>{
  const events=[],eid=`row-${i+1}`;
  events.push({id:eid,time:start+60000,kind:'strength',equipmentId:'row',name:'坐姿划船机',weight:rows[i].w,reps:rows[i].r,sets:3,muscles:['背部'],frameRefs:rows[i].frames,clipRef:rows[i].clip||null});
  meta.events[eid]={activity:{status:'finished',startedAt:start+10000,finishedAt:start+110000,intervals:[{start:start+10000,end:start+50000},{start:start+65000,end:start+110000}]}};
  if(i===2){const cid='cardio-no-media';events.push({id:cid,time:start+150000,kind:'cardio',equipmentId:'treadmill',name:'跑步机',duration:20,level:6,muscles:['心肺'],frameRefs:[]});meta.events[cid]={activity:{status:'finished',startedAt:start+120000,finishedAt:start+260000,intervals:[{start:start+120000,end:start+260000}]}}}
  sessions.push({id:`session-${i+1}`,start,end:start+30*60000,events});
 });
 localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions,active:null,profile:{customEq:[]},prefs:{}}));
 localStorage.setItem('axis_v8_meta',JSON.stringify(meta));
 const store=window.__AXIS_MEDIA_STORE__;
 if(!store?.put||store.format!=='axis-media-arraybuffer-v1')throw new Error('canonical-media-store-unavailable');
 const svg=(label,bg)=>new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="${bg}"/><text x="32" y="210" fill="white" font-size="42" font-family="sans-serif">${label}</text></svg>`],{type:'image/svg+xml'});
 await store.put('F-ROW-FIRST',svg('FIRST','#20242b'));
 await store.put('F-ROW-LATEST',svg('LATEST','#303640'));
 await store.put('V-ROW-LATEST',new Blob(['axis-test-video'],{type:'video/webm'}));
 window.dispatchEvent(new CustomEvent('axis:state-changed',{detail:{test:'815'}}));
});

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_814_EVOLUTION_OBJECTS__?.version==='8.14'&&window.__AXIS_815_MEDIA_EVIDENCE__?.version==='8.15'&&window.__AXIS_MEDIA_EVIDENCE__?.version==='8.15'&&window.__AXIS_MEDIA_READ__?.readOnly===true&&window.__AXIS_MEDIA_STORE__?.format==='axis-media-arraybuffer-v1',undefined,{timeout:12000});
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.15');
 assert.equal(await page.evaluate(()=>window.__AXIS_ARCH__),'canonical-single-runtime');
 assert.equal(await page.evaluate(()=>window.__AXIS_MEDIA_READ__.database),'axis_v42_media');
 await seed();
 await tap(page.locator('nav.nav [data-view="insightsView"]'));
 await page.waitForFunction(()=>document.querySelector('#insightsView')?.classList.contains('active')&&document.querySelectorAll('.v813Node').length===3,undefined,{timeout:4000});
 assert.equal(await page.locator('#insightsView').getAttribute('data-axis-media-evidence-owner'),'v815-media-evidence');
 assert.equal(await page.locator('#v814Object').getAttribute('data-axis-media-evidence-owner'),'v815-media-evidence');
 await tap(page.locator('.v813Node.selected'));
 await page.waitForFunction(()=>document.querySelectorAll('#v813Activities .v813Activity').length===2,undefined,{timeout:2000});
 const rawBefore=await page.evaluate(()=>localStorage.getItem('axis_v60_state'));
 const metaBefore=await page.evaluate(()=>localStorage.getItem('axis_v8_meta'));
 armed=true;

 const row=page.locator('.v813Activity[data-v814-key="row"]');
 await tap(row);
 await page.waitForFunction(()=>document.querySelector('#v815Evidence .v815Stage img')&&document.querySelectorAll('#v815Evidence .v815Rail button').length===2,undefined,{timeout:3000});
 const objectText=(await page.locator('#v814Object').innerText()).trim();
 for(const expected of ['坐姿划船机','3次 · 跨14天','影像证据 3','时间证据','2次留下影像','2张照片','1段视频'])assert.ok(objectText.includes(expected),`Media Evidence object missing ${expected}: ${objectText}`);
 assert.equal(await page.locator('#v815Evidence .v815Rail button').count(),2,'visual encounter rail must represent encounters, not every captured frame');
 assert.equal(await page.locator('#v815Evidence video[autoplay]').count(),0,'Media Evidence must not autoplay video');
 assert.equal(await page.locator('.sheetWrap.show').count(),0,'Media Evidence must remain in-place');
 assert.equal(evidenceNetwork,0,'Media Evidence unexpectedly requested an API');

 const bundle=await page.evaluate(()=>window.__AXIS_MEDIA_EVIDENCE__.resolve('row'));
 assert.equal(bundle.encounterCount,3);assert.equal(bundle.evidenceEncounterCount,2);assert.equal(bundle.evidenceAssetCount,3);assert.equal(bundle.photoCount,2);assert.equal(bundle.videoCount,1);assert.equal(bundle.compareAvailable,true);
 assert.equal(bundle.earliestVisual.index,1);assert.equal(bundle.latestVisual.index,3);
 assert.deepEqual(bundle.visualEncounters.map(x=>x.media),[['F-ROW-FIRST'],['F-ROW-LATEST','V-ROW-LATEST']]);

 await tap(page.locator('[data-v815-compare]'));
 await page.waitForFunction(()=>document.querySelectorAll('#v815Evidence .v815Compare figure').length===2,undefined,{timeout:2000});
 const compareText=(await page.locator('#v815Evidence .v815Compare').innerText()).trim();
 assert.ok(compareText.includes('最早影像')&&compareText.includes('最近影像'),'earliest/latest comparison labels missing');
 assert.equal(await page.locator('#v815Evidence .v815Compare img').count(),2,'endpoint comparison must use two real stored images');

 // 8.17 keeps timeline taps inside Compare bound to the active named slot.
 // Exit Compare explicitly before inheriting the 8.15 single-Encounter inspection contract.
 await tap(page.locator('[data-v815-compare]'));
 await page.waitForFunction(()=>document.querySelector('[data-v815-compare]')?.getAttribute('aria-pressed')==='false'&&!document.querySelector('#v815Evidence .v815Compare'),undefined,{timeout:2000});

 await tap(page.locator('#v815Evidence [data-v815-encounter="1"]'));
 await page.waitForFunction(()=>document.querySelector('#v815Evidence .v815Overlay')?.textContent.includes('第1/3次'),undefined,{timeout:1500});
 assert.ok((await page.locator('#v815Evidence .v815Overlay').innerText()).includes('30kg · 30次'),'earliest evidence lost factual encounter data');
 await tap(page.locator('#v815Evidence [data-v815-encounter="3"]'));
 await page.waitForFunction(()=>document.querySelectorAll('#v815Evidence [data-v815-ref]').length===2,undefined,{timeout:1500});
 await tap(page.locator('#v815Evidence [data-v815-ref="V-ROW-LATEST"]'));
 await page.waitForFunction(()=>!!document.querySelector('#v815Evidence video[controls]'),undefined,{timeout:1500});
 assert.equal(await page.locator('#v815Evidence video').getAttribute('autoplay'),null,'short video acquired autoplay attribute');

 const noMedia=page.locator('.v813Activity[data-v814-key="treadmill"]');
 await tap(noMedia);await page.waitForFunction(()=>{const x=document.querySelector('#v814Object');return x&&!x.hidden&&x.textContent.includes('跑步机')},undefined,{timeout:1500});await page.waitForTimeout(100);
 assert.equal(await page.locator('#v815Evidence').count(),0,'no-media Evolution Object should not receive an empty capture prompt');
 const noMediaText=(await page.locator('#v814Object').innerText()).trim();
 assert.ok(noMediaText.includes('第一次 · 也是最近一次'),'Level 0 data-only Evolution stopped working');
 for(const forbidden of ['请拍摄','添加照片','完善资料','创建作品','发布'])assert.ok(!noMediaText.includes(forbidden),`no-media object introduced creator/capture pressure: ${forbidden}`);

 assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v60_state')),rawBefore,'Media Evidence interaction mutated canonical training storage');
 assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v8_meta')),metaBefore,'Media Evidence interaction mutated canonical metadata storage');
 assert.equal(evidenceNetwork,0,'Media Evidence interaction triggered network ownership');
 const geometry=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:innerWidth,view:document.querySelector('#insightsView')?.getBoundingClientRect()}));
 assert.ok(geometry.scroll<=geometry.inner+1,`Media Evidence caused horizontal overflow ${geometry.scroll}/${geometry.inner}`);
 await page.emulateMedia({reducedMotion:'reduce'});
 await tap(row);await page.waitForTimeout(80);
 if(await row.getAttribute('aria-expanded')!=='true')await tap(row);
 await page.waitForFunction(()=>document.querySelector('#v815Evidence')!==null,undefined,{timeout:1500});
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.15 Media Evidence ${ENGINE}] PASS · encounter-bound photo/video · endpoint compare · evidence rail · data-only fallback · no autoplay/creator pressure · read-only/no-network · mobile-safe`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
