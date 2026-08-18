import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:417,height:896},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
await page.addInitScript(()=>{try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{throw new Error('AXIS_TEST_CAMERA_OFFLINE')}}})}catch{}});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
await page.route('**/api/cloud-status**',r=>json(r,{cloud:{configured:false,enabled:false}}));
await page.route('**/api/ai-capabilities**',r=>json(r,{ai:{enabled:false,capabilities:{vision:false,insight:false,voice:false,dialogue:false}}}));
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAABAklEQVR4nO2asQ3CMBREHZRBKKiYgRlSMQIlYhhEmRGomIHBKNwgxU7Ad3CxfK90IudefvLlWOm2u32omY06AIoF1FhAjQXU9LkDw/H8zxyLPO635Hj1FbCAGguosYAaC6ixgJrsWgjkcjpMB6/jk34hvkAy+vshrgZTYCb69DSWBu0d+DB98fk5OAJlaSgOBAEkB+5QfRtFBfBbCM7QdgVYnQSZp+0KrAELqLGAGkiAtaJE5mm7AoFRBHCG5isQsFuIF5BTgbIclB5Ae4S+TcPqYMyP+phpcWm53l2JyIxGHftCkV9kTeI2qsYCaiygxgJqLKCm83+jYiygxgJqLKDmBVV6OVsV43ZUAAAAAElFTkSuQmCC','base64');
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:9000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:12000});await page.waitForFunction(()=>window.__AXIS_8123_EQUIPMENT_GALLERY__?.multiPhoto===true,undefined,{timeout:6000});await page.waitForFunction(()=>window.__AXIS_8123_PICKER_ROUTER__?.reentryStable===true,undefined,{timeout:6000});await page.waitForFunction(()=>window.__AXIS_8123_SETTINGS_SURFACE__?.reportFunctionUnchanged===true,undefined,{timeout:6000})};
const openPhotoReview=async()=>{await tap(page.locator('#scanBtn'));await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show'));await page.locator('#photoInput').setInputFiles({name:'axis-photo.png',mimeType:'image/png',buffer:png});await page.waitForFunction(()=>!document.querySelector('#reviewStage')?.classList.contains('hidden'),undefined,{timeout:3500})};
const openPicker=async()=>{await tap(page.locator('#equipmentRow'));await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:2500})};
const chooseByText=async text=>{let canonical=page.locator('#v8710Cards button:visible').filter({hasText:text}).first();if(await canonical.count()){await tap(canonical);return}const search=page.locator('#eqSearch');assert.equal(await search.count(),1,'equipment search missing');await search.fill(text);await page.waitForFunction(t=>[...document.querySelectorAll('#v8710Cards button')].some(b=>b.offsetParent!==null&&b.textContent.includes(t)),text,{timeout:2500});canonical=page.locator('#v8710Cards button:visible').filter({hasText:text}).first();assert.equal(await canonical.count(),1,`visible picker item ${text} missing after search`);await tap(canonical)};
const assertRecordingReview=async label=>{await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&!document.querySelector('#reviewStage')?.classList.contains('hidden')&&!document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:2500});assert.notEqual((await page.locator('#equipmentName').textContent()).trim(),'待确认',`${label}: selection did not remain in recording review`);assert.equal(await page.locator('#todayView.active').count(),1,`${label}: app should retain Today view without losing recording sheet`)};

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.evaluate(()=>{localStorage.clear();const now=Date.now();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[{id:'S-HISTORY',start:now-86400000,end:now-84000000,events:[{id:'E-CHEST',equipmentId:'chest',name:'胸推',pattern:'push',kind:'strength',muscles:['胸肌','肱三头肌','肩部'],effect:'胸部推力',time:now-86300000,weight:30,reps:10,sets:3,frameRefs:[],photoBytes:0,videoBytes:0}]}],active:{id:'S-ACTIVE',start:now-180000,events:[]},profile:{name:'Ray',weight:'92',customEq:[],memories:[]},prefs:{}}));localStorage.setItem('axis_v8_meta',JSON.stringify({prefs:{},events:{}}))});
 await page.reload({waitUntil:'domcontentloaded'});await ready();
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.3');

 console.log(`[AXIS 8.12.3 gallery/picker ${ENGINE}] recording picker repeat/back/re-entry`);
 await openPhotoReview();await openPicker();await chooseByText('胸推');await assertRecordingReview('first recording pick');
 await openPicker();await tap(page.locator('#eqSheet [data-close="eqSheet"]'));await page.waitForFunction(()=>!document.querySelector('#eqSheet')?.classList.contains('show'));
 await openPicker();await chooseByText('肩推');await assertRecordingReview('picker reopened after back');
 await tap(page.locator('#scanSheet [data-close="scanSheet"]'));await page.waitForFunction(()=>!document.querySelector('#scanSheet')?.classList.contains('show'));
 await openPhotoReview();await openPicker();await chooseByText('高位下拉');await assertRecordingReview('recording reopened from home');
 await tap(page.locator('#scanSheet [data-close="scanSheet"]'));await page.waitForFunction(()=>!document.querySelector('#scanSheet')?.classList.contains('show'));

 console.log(`[AXIS 8.12.3 gallery/picker ${ENGINE}] Quick Record -> other expanded catalog repeat`);
 for(let i=0;i<2;i++){
  await tap(page.locator('#quickRecordBtn'));await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'));
  await tap(page.locator('#v8Other'));await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show')&&document.querySelector('#eqSheet [data-v877-lib]'),undefined,{timeout:3000});
  const lib=page.locator('#eqSheet [data-v877-lib]').first();assert.ok(await lib.getAttribute('data-v877-lib'));await tap(lib);
  await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#scanSheet')?.classList.contains('v8-quick')&&!document.querySelector('#reviewStage')?.classList.contains('hidden')&&!document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:3500});
  assert.notEqual((await page.locator('#equipmentName').textContent()).trim(),'待确认',`quick iteration ${i+1} failed to select`);
  await tap(page.locator('#scanSheet [data-close="scanSheet"]'));await page.waitForFunction(()=>!document.querySelector('#scanSheet')?.classList.contains('show'));
 }

 console.log(`[AXIS 8.12.3 gallery/picker ${ENGINE}] dedicated multi-photo equipment gallery`);
 await tap(page.locator('#settingsBtn'));await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'));
 await tap(page.locator('#myEqBtn'));await page.waitForFunction(()=>document.querySelector('#manageEqList [data-my-eq-id="chest"]'),undefined,{timeout:2500});
 await tap(page.locator('#manageEqList [data-my-eq-id="chest"]'));await page.waitForFunction(()=>document.querySelector('#v8123EqDetailSheet')?.classList.contains('show'));
 assert.equal((await page.locator('#v8123EqDetailTitle').textContent()).trim(),'胸推');
 await page.locator('#v8123EqLibraryInput').setInputFiles([{name:'eq-a.png',mimeType:'image/png',buffer:png},{name:'eq-b.png',mimeType:'image/png',buffer:png}]);
 await page.waitForFunction(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return c.profile?.equipmentPhotos?.chest?.length===2},undefined,{timeout:5000});
 const refs=await page.evaluate(async()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),a=c.profile?.equipmentPhotos?.chest||[];const db=await new Promise((res,rej)=>{const q=indexedDB.open('axis_v42_media',1);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)});const keys=await new Promise((res,rej)=>{const tx=db.transaction('media','readonly'),q=tx.objectStore('media').getAllKeys();q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)});db.close();return{refs:a.map(x=>x.ref),memoryRefs:(c.profile?.memories||[]).filter(x=>x.equipmentId==='chest'&&x.source==='equipment-photo').map(x=>x.sourceRef),keys}});
 assert.equal(refs.refs.length,2);assert.ok(refs.refs.every(x=>refs.keys.includes(x)),'dedicated photo blobs must exist in canonical media store');assert.ok(refs.refs.every(x=>refs.memoryRefs.includes(x)),'dedicated photos must become confirmed visual memories');
 assert.equal(await page.locator('#v8123EqGallery [data-v8123-eq-photo]').count(),2);
 await tap(page.locator('#v8123EqGallery [data-v8123-eq-photo]').nth(1));await page.waitForFunction(()=>document.querySelector('#v8123EqPhotoPreviewSheet')?.classList.contains('show'));await tap(page.locator('#v8123EqCover'));
 await page.waitForFunction(ref=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return c.profile?.equipmentPhotos?.chest?.[0]?.ref===ref},refs.refs[1]);
 await tap(page.locator('#v8123EqGallery [data-v8123-eq-photo]').first());await page.waitForFunction(()=>document.querySelector('#v8123EqPhotoPreviewSheet')?.classList.contains('show'));await tap(page.locator('#v8123EqPhotoDelete'));
 await page.waitForFunction(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return c.profile?.equipmentPhotos?.chest?.length===1});
 const afterDelete=await page.evaluate(async deleted=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),remaining=c.profile?.equipmentPhotos?.chest?.[0]?.ref||'';const db=await new Promise((res,rej)=>{const q=indexedDB.open('axis_v42_media',1);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)});const exists=await new Promise((res,rej)=>{const tx=db.transaction('media','readonly'),q=tx.objectStore('media').get(deleted);q.onsuccess=()=>res(!!q.result);q.onerror=()=>rej(q.error)});db.close();return{remaining,deletedExists:exists}},refs.refs[1]);
 assert.equal(afterDelete.deletedExists,false,'deleted dedicated photo blob survived');assert.equal(afterDelete.remaining,refs.refs[0]);
 await tap(page.locator('#v8123EqDetailSheet [data-v8123-eq-detail-close]'));await page.waitForFunction(()=>!document.querySelector('#v8123EqDetailSheet')?.classList.contains('show'));
 await page.waitForFunction(ref=>document.querySelector('#manageEqList [data-my-eq-id="chest"] [data-my-eq-photo]')?.dataset.myEqPhoto===ref,afterDelete.remaining);

 console.log(`[AXIS 8.12.3 gallery/picker ${ENGINE}] Settings separators + report entry`);
 const settings=await page.evaluate(()=>{const bw=sel=>{const e=document.querySelector(sel);return e?parseFloat(getComputedStyle(e).borderBottomWidth)||0:null};const reminder=[...document.querySelectorAll('#settingsSheet button,#settingsSheet .settingLink')].find(el=>((el.querySelector(':scope>span')?.textContent||el.textContent||'').replace(/\s+/g,'')).startsWith('提醒与声音'));return{learning:bw('#v810ConfigEntry'),service:bw('#v811ServiceEntry'),report:bw('#reportBtn'),reminder:reminder?parseFloat(getComputedStyle(reminder).borderBottomWidth)||0:null,reminderText:reminder?.textContent||'',reportClass:document.querySelector('#reportBtn')?.className||'',reportText:document.querySelector('#reportBtn')?.textContent||''}});
 assert.equal(settings.learning,0);assert.equal(settings.service,0);assert.equal(settings.report,0);assert.notEqual(settings.reminder,null,'提醒与声音 Settings row missing');assert.equal(settings.reminder,0);assert.match(settings.reportClass,/v8123ReportEntry/);assert.match(settings.reportText,/训练报告/);
 await tap(page.locator('#reportBtn'));await page.waitForFunction(()=>document.querySelector('#reportSheet')?.classList.contains('show'),undefined,{timeout:2500});

 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.12.3 gallery/picker ${ENGINE}] PASS · stable repeated picker · Quick other catalog · multi-photo memory · divider-free Settings · report action preserved`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
