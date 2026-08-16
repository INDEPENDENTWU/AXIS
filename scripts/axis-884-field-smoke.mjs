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

console.log(`[AXIS 8.8.4 ${ENGINE}] multi-item pause/resume + completed archive`);
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

await page.waitForFunction(()=>document.querySelector('#axis884ArchiveToggle')&&document.querySelector('#v876Timeline'),undefined,{timeout:1800});
assert.match((await page.locator('#axis884ArchiveToggle').innerText()).replace(/\s+/g,' '),/已完成 2 项.*展开/);
for(const id of ['E1','E5'])assert.equal(await page.locator(`#eventList [data-event="${id}"]`).evaluate(el=>el.classList.contains('axis884Archived')),true,`${id} was not archived`);
await page.locator('#axis884ArchiveToggle').click();
for(const id of ['E1','E5'])assert.equal(await page.locator(`#eventList [data-event="${id}"]`).evaluate(el=>el.classList.contains('axis884Archived')),false,`${id} did not expand`);
assert.ok(await page.locator('#v876Timeline').isVisible(),'训练轨迹 was removed');
await page.waitForTimeout(180);
const safe=await page.evaluate(()=>{const s=document.querySelector('#eventList')?.closest('.section'),n=document.querySelector('#v87Now');if(!s||!n)return null;const a=s.getBoundingClientRect(),b=n.getBoundingClientRect(),cs=getComputedStyle(s);return{bottom:a.bottom,cardTop:b.top,transform:cs.transform,maxHeight:parseFloat(cs.maxHeight)||0}});assert.ok(safe,'safe-zone geometry missing');assert.equal(safe.transform,'none','timeline safe-zone still transforms the hit-test layer');assert.ok(safe.bottom<=safe.cardTop+1.5,`timeline overlaps active card ${safe.bottom} > ${safe.cardTop}`);

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

console.log(`[AXIS 8.8.4 ${ENGINE}] completed Home includes workout start time`);
await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),t=Date.now(),end=t-60000,start=end-480000;c.active=null;c.sessions=[{id:'DONE884',start,end,events:[{id:'D1',name:'测试项目',kind:'strength',time:end-30000,sets:1,weight:20,reps:10}]}];localStorage.setItem('axis_v60_state',JSON.stringify(c));const m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}');m.events=m.events||{};m.events.D1={activity:{status:'finished',startedAt:start+30000,finishedAt:end-30000,actualMs:420000,completedSets:1,intervals:[{start:start+30000,end:end-30000}]},sets:[{state:'done',doneAt:end-30000}]};localStorage.setItem('axis_v8_meta',JSON.stringify(m))});
await page.reload({waitUntil:'domcontentloaded'});await ready();await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.scope==='complete',undefined,{timeout:1800});const homeMeta=(await page.locator('#axisNowMeta').innerText()).trim();assert.match(homeMeta,/开始 \d{1,2}:\d{2}/);assert.match(homeMeta,/完成 \d{1,2}:\d{2}/);

assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log(`[AXIS 8.8.4 ${ENGINE}] PASS · multi-item controls · completed archive · no overlap · one watermark owner · 1..100 opacity · explicit location · start time`);
await context.close();await browser.close();
