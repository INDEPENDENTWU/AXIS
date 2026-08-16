import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [
 ['**/api/ai-status**',{ok:true,enabled:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{ok:false,disabled:true}],['**/api/insight**',{ok:false,disabled:true}],
 ['**/nominatim.openstreetmap.org/reverse**',{name:'测试健身房',namedetails:{'name:zh':'测试健身房'},address:{road:'测试路',house_number:'18号',neighbourhood:'测试社区',city_district:'测试区',city:'测试市'}}]
])await page.route(pattern,r=>json(r,obj));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:8000})};

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});await ready();

console.log(`[AXIS 8.8.4 ${ENGINE}] multi-item controls + one-owner timeline`);
await page.evaluate(()=>{
 const t=Date.now(),mk=(id,name,offset)=>({id,name,equipmentId:id.toLowerCase(),kind:'strength',time:t-offset,weight:20,reps:10,sets:1});
 const events=[mk('E1','蝴蝶机夹胸',420000),mk('E2','前平举',330000),mk('E3','杠铃深蹲',240000),mk('E4','反向飞鸟二合一机',150000),mk('E5','侧平举',90000)];
 const core={version:60,sessions:[],active:{id:'S884',start:t-480000,events},selectedEq:null,frames:[],clip:null,stream:null,ai:null,profile:{name:'',height:'',weight:'',bodyFat:'',years:'',freq:3,goal:'',memories:[],customEq:[]},prefs:{keepClip:true,scanSeconds:3,watermark:{name:true,data:true,time:true,brand:true,pos:'bl',photoMode:'wm',videoMode:'wm'}}};
 const act=(status,start,end=null)=>({status,startedAt:start,lastResumedAt:start,pausedAt:status==='paused'?(end||t-60000):null,finishedAt:status==='finished'?(end||t-60000):null,estimateMs:180000,completedSets:status==='finished'?1:0,intervals:[{start,end:status==='active'?null:(end||t-60000)}],restStartedAt:null});
 const meta={prefs:{v85WmName:true,v85WmData:true,v85WmLocation:false,v85WmTime:true,v876WmOpacity:18},events:{
  E1:{activity:act('finished',t-420000,t-360000),sets:[{state:'done',doneAt:t-360000}]},
  E2:{activity:act('paused',t-330000,t-300000),sets:[{state:'assumed',doneAt:null}]},
  E3:{activity:act('active',t-240000),sets:[{state:'assumed',doneAt:null}]},
  E4:{activity:act('paused',t-150000,t-120000),sets:[{state:'assumed',doneAt:null}]},
  E5:{activity:act('finished',t-90000,t-60000),sets:[{state:'done',doneAt:t-60000}]}
 }};
 localStorage.setItem('axis_v60_state',JSON.stringify(core));localStorage.setItem('axis_v8_meta',JSON.stringify(meta));
});
await page.reload({waitUntil:'domcontentloaded'});await ready();
await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show')&&window.__AXIS_ACTIVE_CONTROL__?.owner==='v87-direct-884',undefined,{timeout:2600});
assert.equal(await page.evaluate(()=>window.__AXIS_ACTIVE_CONTROL__?.owner),'v87-direct-884');
await page.waitForFunction(()=>document.querySelector('#v876Timeline')&&document.querySelector('#axis884ArchiveToggle'),undefined,{timeout:1800});
await page.waitForTimeout(180);
assert.equal(await page.locator('#v879More').count(),0,'legacy v879 timeline compactor returned');
assert.equal(await page.locator('#eventList.v879Compact').count(),0,'event list is still under legacy compact mode');
assert.equal(await page.locator('#eventList .v879Hide').count(),0,'legacy compactor still hides event rows');
assert.equal(await page.locator('.axis883TimelineSafe').count(),0,'dynamic timeline safe-zone class returned');
assert.ok(await page.locator('#v876Timeline').isVisible(),'训练轨迹 was removed');
const timelineGeom=await page.evaluate(()=>{const s=document.querySelector('#eventList')?.closest('.section');if(!s)return null;const cs=getComputedStyle(s),after=getComputedStyle(s,'::after'),head=s.querySelector('.sectionHead'),hs=head?getComputedStyle(head):null;return{overflowY:cs.overflowY,maxHeight:cs.maxHeight,transform:cs.transform,afterDisplay:after.display,headPosition:hs?.position}});assert.ok(timelineGeom,'timeline section missing');assert.notEqual(timelineGeom.overflowY,'auto','timeline became an inner scroller');assert.notEqual(timelineGeom.overflowY,'scroll','timeline became an inner scroller');assert.equal(timelineGeom.maxHeight,'none','timeline still has a dynamic max-height');assert.equal(timelineGeom.transform,'none','timeline still transforms its hit-test layer');assert.notEqual(timelineGeom.headPosition,'sticky','timeline header is still sticky');
assert.equal(await page.locator('#axis884ArchiveToggle').evaluate(el=>el.parentElement?.classList.contains('sectionHead')),true,'completed archive is not anchored to the real section header');
assert.match((await page.locator('#axis884ArchiveToggle').innerText()).replace(/\s+/g,' '),/5 · 已完成 2.*展开/);
for(const id of ['E1','E5'])assert.equal(await page.locator(`#eventList [data-event="${id}"]`).evaluate(el=>el.classList.contains('axis884Archived')),true,`${id} was not archived`);

assert.ok(await page.locator('#v87Paused button').count()>=2,'paused resume chips missing');
const oldActive=await page.locator('#v87Toggle').getAttribute('data-id');assert.equal(oldActive,'E3');
const resumeId=await page.locator('#v87Paused button').first().getAttribute('data-id');assert.ok(resumeId);
await page.locator('#v87Paused button').first().click();
await page.waitForFunction(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.status==='active',resumeId,{timeout:1400});
assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.E3?.activity?.status),'paused','previous active item was not auto-paused');
assert.equal(await page.locator('#v87Toggle').getAttribute('data-id'),resumeId,'active card did not move to resumed item');
await page.locator('#v87Toggle').click();
await page.waitForFunction(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.status==='paused',resumeId,{timeout:1400});
const nextResume=await page.locator('#v87Paused button').first().getAttribute('data-id');assert.ok(nextResume);
await page.locator('#v87Paused button').first().click();
await page.waitForFunction(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.status==='active',nextResume,{timeout:1400});
assert.equal(await page.locator('#v87Toggle').getAttribute('data-id'),nextResume,'second resumed item did not become current');

await page.locator('#axis884ArchiveToggle').click();
for(const id of ['E1','E5'])assert.equal(await page.locator(`#eventList [data-event="${id}"]`).evaluate(el=>el.classList.contains('axis884Archived')),false,`${id} did not expand`);
await page.locator('#axis884ArchiveToggle').click();
for(const id of ['E1','E5'])assert.equal(await page.locator(`#eventList [data-event="${id}"]`).evaluate(el=>el.classList.contains('axis884Archived')),true,`${id} did not collapse`);

console.log(`[AXIS 8.8.4 ${ENGINE}] active-card long press survives multi-item timeline`);
const finishId=await page.locator('#v87Finish').getAttribute('data-id');assert.equal(finishId,nextResume);
await page.locator('#v87Finish').dispatchEvent('pointerdown',{pointerId:41,pointerType:'touch',isPrimary:true,clientX:330,clientY:650,button:0,buttons:1});
await page.waitForFunction(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.status==='finished',finishId,{timeout:2600});
await page.waitForTimeout(180);
assert.match((await page.locator('#axis884ArchiveToggle').innerText()).replace(/\s+/g,' '),/5 · 已完成 3/,'completed archive did not absorb the long-pressed item');
assert.ok(await page.locator('#v87Toggle').count(),'active card disappeared after item finish');
const pausedTarget=await page.locator('#v87Toggle').getAttribute('data-id');assert.ok(pausedTarget&&pausedTarget!==finishId,'paused fallback target missing after finish');
await page.locator('#v87Toggle').click();
await page.waitForFunction(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.status==='active',pausedTarget,{timeout:1400});
assert.equal(await page.locator('#v87Toggle').getAttribute('data-id'),pausedTarget,'resume after long-press finish failed');

console.log(`[AXIS 8.8.4 ${ENGINE}] watermark ownership + 1..100 slider + explicit location`);
await page.evaluate(()=>{window.__AXIS_884_GEO_CALLS__=0;Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition(ok){window.__AXIS_884_GEO_CALLS__++;ok({coords:{latitude:22.52325,longitude:113.38381,accuracy:12}})}}})});
await page.locator('#settingsBtn').click();await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:1200});
if(!await page.locator('#axisConfigGate-watermark.open').count())await page.locator('#watermarkBtn').click();
await page.waitForFunction(()=>document.querySelector('#axisConfigGate-watermark')?.classList.contains('open')&&document.querySelector('#v877OpacityRange'),undefined,{timeout:1500});
await page.waitForTimeout(180);assert.equal(await page.evaluate(()=>window.__AXIS_884_GEO_CALLS__),0,'opening watermark settings unexpectedly requested location');
assert.equal(await page.locator('#v877OpacityRange').getAttribute('min'),'1');assert.equal(await page.locator('#v877OpacityRange').getAttribute('max'),'100');
await page.locator('#v877OpacityRange').evaluate(el=>{el.value='83';el.dispatchEvent(new Event('input',{bubbles:true}))});await page.waitForTimeout(100);
assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').prefs?.v876WmOpacity),83,'opacity did not persist above legacy 48%');
assert.equal(await page.locator('#v877OpacityRange').inputValue(),'83');
const sliderH=await page.locator('#v877OpacityRange').evaluate(el=>parseFloat(getComputedStyle(el).height));assert.ok(sliderH>=30,'opacity slider touch target is too small');
assert.equal(await page.evaluate(()=>window.__AXIS_WATERMARK_PHYSICAL_OWNER__),'v8710');
assert.match((await page.locator('#v876Locate').innerText()).trim(),/更新位置/);
await page.locator('#v876Locate').click();await page.waitForFunction(()=>window.__AXIS_884_GEO_CALLS__===1,undefined,{timeout:1000});await page.waitForFunction(()=>document.querySelector('#v876LocationName')?.textContent.includes('测试健身房'),undefined,{timeout:3200});assert.equal(await page.evaluate(()=>window.__AXIS_884_GEO_CALLS__),1,'explicit location action called geolocation more than once');

console.log(`[AXIS 8.8.4 ${ENGINE}] completed Home + history detail prepaint`);
await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),t=Date.now(),end=t-60000,start=end-480000;c.active=null;c.sessions=[{id:'DONE884',start,end,events:[{id:'D1',name:'测试项目',equipmentId:'d1',kind:'strength',time:end-30000,sets:1,weight:20,reps:10,muscles:['胸肌'],frameRefs:[]}]}];localStorage.setItem('axis_v60_state',JSON.stringify(c));const m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}');m.events=m.events||{};m.events.D1={activity:{status:'finished',startedAt:start+30000,finishedAt:end-30000,actualMs:420000,completedSets:1,intervals:[{start:start+30000,end:end-30000}]},sets:[{state:'done',doneAt:end-30000}]};localStorage.setItem('axis_v8_meta',JSON.stringify(m))});
await page.reload({waitUntil:'domcontentloaded'});await ready();await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.scope==='complete',undefined,{timeout:1800});const homeMeta=(await page.locator('#axisNowMeta').innerText()).trim();assert.match(homeMeta,/开始 \d{1,2}:\d{2}/);assert.match(homeMeta,/完成 \d{1,2}:\d{2}/);
await page.locator('.nav button[data-view="historyView"]').click();await page.waitForFunction(()=>document.querySelector('#historyView')?.classList.contains('active'),undefined,{timeout:1000});
await page.evaluate(()=>{window.__AXIS_884_DETAIL_FRAMES__=[];let n=18;const tick=()=>{const s=document.querySelector('#detailSheet'),d=document.querySelector('#detail');if(s?.classList.contains('show')&&getComputedStyle(s).visibility!=='hidden'){const x=(d?.innerText||'').replace(/\s+/g,' ').trim();if(x)window.__AXIS_884_DETAIL_FRAMES__.push(x)}if(n-->0)requestAnimationFrame(tick)};requestAnimationFrame(tick)});
await page.locator('[data-session="DONE884"]').click();
await page.waitForFunction(()=>{const s=document.querySelector('#detailSheet');return s?.classList.contains('show')&&getComputedStyle(s).visibility!=='hidden'},undefined,{timeout:1200});
await page.waitForTimeout(220);
const detailFrames=await page.evaluate(()=>window.__AXIS_884_DETAIL_FRAMES__||[]);assert.ok(detailFrames.length,'history detail never became visible');assert.equal(new Set(detailFrames).size,1,`history detail exposed multiple visible paint states: ${JSON.stringify([...new Set(detailFrames)])}`);
assert.match(detailFrames[0],/训练时间/);assert.match(detailFrames[0],/测试项目/);

console.log(`[AXIS 8.8.4 ${ENGINE}] session long press remains independent from timeline`);
await page.evaluate(()=>{document.querySelector('#detailSheet')?.classList.remove('show');const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');c.active={id:'STOP884',start:Date.now()-3000,events:[]};localStorage.setItem('axis_v60_state',JSON.stringify(c))});
await page.reload({waitUntil:'domcontentloaded'});await ready();await page.waitForFunction(()=>document.querySelector('#activeHome')&&!document.querySelector('#activeHome').classList.contains('hidden'),undefined,{timeout:1200});
await page.locator('#finishHold').dispatchEvent('pointerdown',{pointerId:77,pointerType:'touch',isPrimary:true,clientX:340,clientY:210,button:0,buttons:1});
await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}').active===null,undefined,{timeout:2200});
assert.ok(await page.locator('#finishSheet.show').count(),'session finish sheet did not open after long press');

assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log(`[AXIS 8.8.4 ${ENGINE}] PASS · one timeline owner · multi-item pause/resume · both long presses · completed archive · stable history detail · watermark/location retained`);
await context.close();await browser.close();
