import assert from 'node:assert/strict';
const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{ok:true,enabled:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{ok:false,disabled:true}],['**/api/insight**',{ok:false,disabled:true}]])await page.route(pattern,r=>json(r,obj));
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:8000})};

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:null,profile:{name:'',height:'',weight:'',bodyFat:'',years:'',freq:3,goal:'',memories:[],customEq:[{id:'transition-test',name:'项目间歇测试',type:'strength',pattern:'pull',muscles:['背部'],effect:'背部',custom:true}]},prefs:{keepClip:true,scanSeconds:3,watermark:{name:true,data:true,time:true,brand:true,pos:'bl',photoMode:'wm',videoMode:'wm'}}}))});
await page.reload({waitUntil:'domcontentloaded'});await ready();

console.log(`[AXIS home transition ${ENGINE}] idle Now layer is available`);
assert.ok(await page.locator('#axisNowHero').isVisible());

await page.locator('#startBtn').click();
await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='session',undefined,{timeout:1800});
console.log(`[AXIS home transition ${ENGINE}] 8.8.1 active-session hierarchy owns training state`);
assert.equal(await page.locator('#axisNowHero').isVisible(),false,'Now hero duplicates an active session');
assert.ok(await page.locator('#activeHome').isVisible(),'8.8.1 active home disappeared');
assert.ok(await page.locator('#liveTimer').isVisible(),'8.8.1 session timer disappeared');
assert.ok(await page.locator('#finishHold').isVisible(),'8.8.1 long-press finish disappeared');
const spacing=await page.evaluate(()=>({live:getComputedStyle(document.querySelector('#activeHome>.liveHead')).marginTop,metrics:getComputedStyle(document.querySelector('#activeHome>.metricPair.compact')).marginTop,head:getComputedStyle(document.querySelector('#todayView>.pageHead')).marginBottom}));
assert.deepEqual(spacing,{live:'6px',metrics:'20px',head:'22px'},`8.8.1 active spacing changed: ${JSON.stringify(spacing)}`);

await page.locator('#quickRecordBtn').click();
await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show')&&document.querySelector('#v882QuickCustom [data-qid="transition-test"]'),undefined,{timeout:1600});
await page.locator('#v882QuickCustom [data-qid="transition-test"]').click();
await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#saveScan'),undefined,{timeout:1600});
await page.locator('#saveScan').click();
await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show'),undefined,{timeout:2500});
await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='active',undefined,{timeout:1800});
assert.equal(await page.locator('#axisNowHero').isVisible(),false,'Now hero duplicates the v87 active item');
assert.ok(await page.locator('#v87Now').isVisible(),'v87 active item changed');
assert.ok(await page.locator('#finishHold').isVisible(),'session long-press finish changed while item active');

const id=await page.locator('#v87Finish').getAttribute('data-id');
assert.ok(id,'active item id missing');
await page.evaluate(id=>{const k='axis_v8_meta',m=JSON.parse(localStorage.getItem(k)||'{}'),a=m.events?.[id]?.activity;if(!a)throw new Error('activity missing');const t=Date.now();a.status='finished';a.finishedAt=t;a.restStartedAt=null;a.pausedAt=null;(a.intervals||[]).forEach(x=>{if(!x.end)x.end=t});localStorage.setItem(k,JSON.stringify(m))},id);
await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.scope==='transition',undefined,{timeout:1800});

console.log(`[AXIS home transition ${ENGINE}] only inter-item recovery earns the compact Now surface`);
assert.ok(await page.locator('#axisNowHero').isVisible(),'inter-item transition is not visible');
const box=await page.locator('#axisNowHero').boundingBox();assert.ok(box&&box.height>=70&&box.height<=135,`transition surface is not compact: ${box?.height}`);
assert.equal(await page.locator('#axisNowDial').isVisible(),false,'transition still shows duplicate dial');
assert.equal(await page.locator('.axisNowFacts').isVisible(),false,'transition still shows duplicate session facts');
const copy=((await page.locator('#axisNowTitle').innerText())+' '+(await page.locator('#axisNowMeta').innerText())).trim();
assert.match(copy,/项目间歇|可以开始下一项|间歇过长/);
assert.doesNotMatch(copy,/正在训练|本次|已记录|长按/,'transition copy duplicates active-session information');
assert.ok(await page.locator('#liveTimer').isVisible(),'original session timer was replaced by transition surface');
assert.ok(await page.locator('#finishHold').isVisible(),'original long-press session finish was replaced');

console.log(`[AXIS home transition ${ENGINE}] PASS · 8.8.1 active hierarchy preserved · compact inter-item transition only`);
await context.close();await browser.close();
