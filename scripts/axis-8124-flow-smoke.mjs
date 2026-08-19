import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:417,height:896},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
await page.addInitScript(()=>{try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{throw new Error('AXIS_TEST_CAMERA_OFFLINE')}}})}catch{}});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
await page.route('**/api/cloud-status**',r=>json(r,{cloud:{configured:false,enabled:false}}));
await page.route('**/api/ai-capabilities**',r=>json(r,{ai:{enabled:false,capabilities:{vision:false,insight:false,voice:false,dialogue:false}}}));
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:9000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:12000});await page.waitForFunction(()=>window.__AXIS_8124_QUICK_FLOW__?.version==='8.12.4'&&window.__AXIS_8124_SETTINGS_GEOMETRY__?.version==='8.12.4',undefined,{timeout:7000})};
const seed=async(fn)=>{await page.evaluate(fn);await page.reload({waitUntil:'domcontentloaded'});await ready()};
const center=async sel=>page.locator(sel).evaluate(el=>{const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height}});
const localY=(child,row)=>child.y-(row.y-row.h/2);

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});await ready();
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.4');

 console.log(`[AXIS 8.12.4 ${ENGINE}] project gap follows latest real activity, not event insertion order`);
 await seed(()=>{const t=Date.now(),day=86400000;localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[{id:'H',start:t-day,end:t-day+1800000,events:[{id:'HL',equipmentId:'lateral',name:'侧平举',kind:'strength',pattern:'push',muscles:['肩部'],time:t-day+600000,weight:20,reps:10,sets:3}]}],active:{id:'A',start:t-30*60000,events:[{id:'ELL',equipmentId:'elliptical',name:'椭圆机',kind:'cardio',pattern:'cardio',muscles:['心肺'],time:t-30*60000,duration:30,intensity:5},{id:'ABS',equipmentId:'crunch',name:'卷腹',kind:'strength',pattern:'core',muscles:['核心'],time:t-13*60000,weight:20,reps:10,sets:3}]},profile:{customEq:[],memories:[]},prefs:{}}));localStorage.setItem('axis_v8_meta',JSON.stringify({prefs:{},events:{ELL:{activity:{status:'finished',startedAt:t-30*60000,lastResumedAt:t-5*60000,finishedAt:t-60000,pausedAt:null,estimateMs:30*60000,intervals:[{start:t-30*60000,end:t-14*60000},{start:t-5*60000,end:t-60000}],completedSets:0,setDoneAt:[],restStartedAt:null,actualMs:20*60000}},ABS:{sets:[{weight:20,reps:10,state:'done',doneAt:t-11*60000},{weight:20,reps:10,state:'done',doneAt:t-9*60000},{weight:20,reps:10,state:'done',doneAt:t-7*60000}],activity:{status:'finished',startedAt:t-13*60000,finishedAt:t-6*60000,pausedAt:null,estimateMs:7*60000,intervals:[{start:t-13*60000,end:t-6*60000}],completedSets:3,setDoneAt:[t-11*60000,t-9*60000,t-7*60000],restStartedAt:null,actualMs:7*60000}}}}));});
 const hs=await page.evaluate(()=>window.__AXIS_HOME_STATE__);assert.equal(hs.scope,'transition');assert.ok(/^0?1:0[0-5]$/.test(hs.value),`gap should be about one minute, got ${hs.value}`);assert.ok(hs.meta.includes('椭圆机'),`latest real activity should be 椭圆机: ${hs.meta}`);
 const tm=await page.locator('#v8Time').innerText();assert.ok(tm.includes('跨度')&&tm.includes('有效训练'),'session time model missing');

 console.log(`[AXIS 8.12.4 ${ENGINE}] Recent is direct Quick Record with no catalog hop`);
 await tap(page.locator('#quickRecordBtn'));await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'));
 const recent=page.locator('#v8Recent [data-qid="lateral"]').first();assert.equal(await recent.count(),1,'侧平举 recent item missing');await tap(recent);
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#scanSheet')?.classList.contains('v8-quick'),undefined,{timeout:2500});
 assert.equal(await page.locator('#eqSheet.show').count(),0,'Recent incorrectly routed through catalog');assert.equal((await page.locator('#equipmentName').textContent()).trim(),'侧平举');
 await page.locator('#scanSheet [data-close="scanSheet"]').click().catch(()=>{});await page.evaluate(()=>document.querySelector('#scanSheet')?.classList.remove('show'));

 console.log(`[AXIS 8.12.4 ${ENGINE}] Live Route is actionable but remains read-only until the user saves`);
 await page.waitForFunction(()=>document.querySelector('#axis813Route:not(.hidden) [data-axis-route-id]'),undefined,{timeout:4000});
 const before=await page.evaluate(()=>({core:localStorage.getItem('axis_v60_state'),meta:localStorage.getItem('axis_v8_meta'),route:{recordingOwner:window.__AXIS_813_ROUTE__?.recordingOwner,storageWrites:window.__AXIS_813_ROUTE__?.storageWrites,delegate:window.__AXIS_813_ROUTE__?.actionDelegate}}));
 const route=page.locator('#axis813Route [data-axis-route-id]').first();await tap(route);
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#scanSheet')?.classList.contains('v8-quick'),undefined,{timeout:2500});
 const after=await page.evaluate(()=>({core:localStorage.getItem('axis_v60_state'),meta:localStorage.getItem('axis_v8_meta')}));assert.equal(after.core,before.core,'Live Route click wrote core state');assert.equal(after.meta,before.meta,'Live Route click wrote meta state');assert.deepEqual(before.route,{recordingOwner:false,storageWrites:0,delegate:'quick-record'});
 await page.evaluate(()=>document.querySelector('#scanSheet')?.classList.remove('show'));

 console.log(`[AXIS 8.12.4 ${ENGINE}] Settings Learning / Cloud rows match native vertical geometry`);
 await tap(page.locator('#settingsBtn'));await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'));await page.waitForTimeout(220);
 const nativeRow=await center('#profileBtn'),nativeText=await center('#profileBtn>span'),nativeArrow=await center('#profileBtn>i'),nativeTextY=localY(nativeText,nativeRow),nativeArrowY=localY(nativeArrow,nativeRow);
 for(const [name,row] of [['learning','#v810ConfigEntry'],['service','#v811ServiceEntry']]){const rr=await center(row),tx=await center(`${row}>span`),ar=await center(`${row}>i`),txY=localY(tx,rr),arY=localY(ar,rr);assert.ok(Math.abs(rr.h-nativeRow.h)<=.5,`${name} row height ${rr.h} vs ${nativeRow.h}`);assert.ok(Math.abs(txY-nativeTextY)<=.5,`${name} text local center Y ${txY} vs ${nativeTextY}`);assert.ok(Math.abs(arY-nativeArrowY)<=.5,`${name} arrow local center Y ${arY} vs ${nativeArrowY}`)}
 await page.locator('#settingsSheet [data-close="settingsSheet"]').click().catch(()=>{});

 console.log(`[AXIS 8.12.4 ${ENGINE}] total-workout finish preserves distinct real start/end`);
 await seed(()=>{const t=Date.now();localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'FIN',start:t-25*60000,events:[{id:'F1',equipmentId:'elliptical',name:'椭圆机',kind:'cardio',pattern:'cardio',muscles:['心肺'],time:t-24*60000,duration:30,intensity:5}]},profile:{customEq:[],memories:[]},prefs:{}}));localStorage.setItem('axis_v8_meta',JSON.stringify({prefs:{},events:{F1:{activity:{status:'active',startedAt:t-24*60000,lastResumedAt:t-5*60000,finishedAt:null,pausedAt:null,estimateMs:30*60000,intervals:[{start:t-24*60000,end:t-12*60000},{start:t-5*60000,end:null}],completedSets:0,setDoneAt:[],restStartedAt:null,actualMs:null}}}}));});
 const hold=page.locator('#finishHold'),holdBox=await hold.boundingBox();assert.ok(holdBox,'finish hold button is not measurable');await page.mouse.move(holdBox.x+holdBox.width/2,holdBox.y+holdBox.height/2);await page.mouse.down();try{await page.waitForFunction(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return !c.active&&c.sessions?.[0]?.end>c.sessions?.[0]?.start},undefined,{timeout:3000})}finally{await page.mouse.up().catch(()=>{})}
 await page.locator('#finishDone').click().catch(()=>{});await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.scope==='complete'&&/开始\s+\d\d:\d\d/.test(window.__AXIS_HOME_STATE__?.meta||'')&&/完成\s+\d\d:\d\d/.test(window.__AXIS_HOME_STATE__?.meta||''),undefined,{timeout:2200});const completed=await page.evaluate(()=>({state:window.__AXIS_HOME_STATE__,session:JSON.parse(localStorage.getItem('axis_v60_state')||'{}').sessions?.[0]}));assert.ok(completed.session.end-completed.session.start>20*60000,'session end collapsed onto start');assert.equal(completed.state.scope,'complete');const facts=completed.state.meta;const match=facts.match(/开始\s+(\d\d:\d\d).*完成\s+(\d\d:\d\d)/);assert.ok(match,`start/end facts missing: ${facts}`);assert.notEqual(match[1],match[2],`displayed start/end collapsed: ${facts}`);

 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.12.4 ${ENGINE}] PASS · truthful intervals · direct Recent · actionable read-only route · native Settings geometry · real session bounds`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
