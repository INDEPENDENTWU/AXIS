import assert from 'node:assert/strict';
import fs from 'node:fs';

const VERSION=JSON.parse(fs.readFileSync('release-contract.json','utf8')).publicVersion;
const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{ok:true,enabled:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{ok:false,disabled:true}],['**/api/insight**',{ok:false,disabled:true}]])await page.route(pattern,r=>json(r,obj));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:8000})};
const rect=async sel=>page.locator(sel).evaluate(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}});
const near=(a,b,t=.85)=>Math.abs(a-b)<=t;
const stable=(a,b,label)=>{for(const k of ['x','y','w','h'])assert.ok(near(a[k],b[k]),`${label} ${k} drifted ${a[k]} -> ${b[k]}`)};

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:null,profile:{name:'',height:'',weight:'',bodyFat:'',years:'',freq:3,goal:'',memories:[],customEq:[{id:'custom-waist',name:'腰部测试器械',type:'strength',pattern:'core',muscles:['腰部','核心'],effect:'腰部 · 核心',custom:true}]},prefs:{keepClip:true,scanSeconds:3,watermark:{name:true,data:true,time:true,brand:true,pos:'bl',photoMode:'wm',videoMode:'wm'}}}))});
await page.reload({waitUntil:'domcontentloaded'});await ready();
assert.equal((await page.locator('.versionLine').getAttribute('aria-label')||'').trim(),`版本 ${VERSION}`);

console.log(`[AXIS 8.8.2 ${ENGINE}] visual first layer + one adaptive home owner`);
assert.equal(await page.locator('#axisNowHero').count(),1);
assert.ok(await page.locator('#axisNowHero').isVisible());
assert.equal(await page.locator('#idleSignalWrap').evaluate(el=>getComputedStyle(el).display),'none');
assert.equal(await page.locator('#liveSignalWrap').evaluate(el=>getComputedStyle(el).display),'none');
const hero=await rect('#axisNowHero');assert.ok(hero.x>=-1&&hero.x+hero.w<=391&&hero.h>=175,'home hero geometry invalid');
assert.equal(await page.evaluate(()=>window.__AXIS_HOME_STATE__?.mode),'ready');
assert.ok(await page.locator('#axisNowDial').isVisible());assert.ok(await page.locator('#axisNowRailFill').count());

console.log(`[AXIS 8.8.2 ${ENGINE}] expanded movement + waist anatomy`);
const lib=await page.evaluate(()=>window.__AXIS_873_LIBRARY__?.map(x=>({id:x.id,name:x.name,muscles:x.muscles}))||[]);
for(const name of ['45°罗马椅背伸','北欧腿弯举','钟摆深蹲','农夫行走','战绳','哥本哈根侧桥'])assert.ok(lib.some(x=>x.name===name),`library missing ${name}`);
assert.equal(new Set(lib.map(x=>x.id)).size,lib.length,'exercise library contains duplicate ids');
assert.ok(lib.find(x=>x.name==='45°罗马椅背伸')?.muscles?.includes('腰部'),'back extension is not mapped to waist');

console.log(`[AXIS 8.8.2 ${ENGINE}] Quick Record always exposes saved custom items + media bridge`);
assert.equal(await page.locator('#startBtn').isVisible(),false,'legacy explicit start entry unexpectedly returned');
await page.locator('#quickRecordBtn').click();await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'),undefined,{timeout:1200});
assert.ok(await page.locator('#v882QuickMine').isVisible(),'saved custom section is hidden');
const mine=page.locator('#v882QuickCustom [data-qid="custom-waist"]');assert.equal(await mine.count(),1,'saved custom item missing from Quick Record');
await mine.click();await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#v882QuickMedia'),undefined,{timeout:1600});
assert.equal(await page.locator('#v882QuickMedia [data-v882-media]').count(),3);
await page.evaluate(()=>{window.__AXIS_882_MEDIA_CALLS__=[];window.__AXIS_CAPTURE__.beginQuickMedia=(mode,id)=>window.__AXIS_882_MEDIA_CALLS__.push({mode:String(mode),id})});
for(const mode of ['photo','3','5'])await page.locator(`#v882QuickMedia [data-v882-media="${mode}"]`).click();
assert.deepEqual(await page.evaluate(()=>window.__AXIS_882_MEDIA_CALLS__),[{mode:'photo',id:'custom-waist'},{mode:'3',id:'custom-waist'},{mode:'5',id:'custom-waist'}]);
await page.locator('#scanSheet [data-close="scanSheet"]').click();await page.waitForTimeout(70);

console.log(`[AXIS 8.8.2 ${ENGINE}] professional custom editor exposes explicit waist region`);
await page.locator('#quickRecordBtn').click();await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'),undefined,{timeout:1000});await page.locator('#v8New').click();
await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show')&&document.querySelector('[data-v874-region="waist"]'),undefined,{timeout:1600});
assert.equal(await page.locator('[data-v874-region="waist"]').count(),1);
await page.locator('#customName').fill('45°罗马椅背伸');await page.waitForTimeout(160);
assert.ok(await page.locator('#customMuscles [data-muscle="腰部"].active').count()>0,'waist inference did not sync to canonical muscle persistence');
await page.locator('#customEqSheet [data-close="customEqSheet"]').click();await page.waitForTimeout(60);

console.log(`[AXIS 8.8.2 ${ENGINE}] Personal Visual Memory works with AI disabled`);
const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="#11151b"/><rect x="82" y="58" width="120" height="360" rx="20" fill="#727b8d"/><rect x="438" y="58" width="120" height="360" rx="20" fill="#727b8d"/><path d="M152 140H488M152 300H488" stroke="#d8dde8" stroke-width="22"/><circle cx="320" cy="220" r="68" fill="#424a5b"/><path d="M260 220h120" stroke="#f4f5f8" stroke-width="18"/></svg>`);
const upload=async()=>{await page.locator('#scanBtn').click();await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show'),undefined,{timeout:1200});await page.locator('#photoInput').setInputFiles({name:'known-machine.svg',mimeType:'image/svg+xml',buffer:svg});await page.waitForFunction(()=>document.querySelector('#reviewStage')&&!document.querySelector('#reviewStage').classList.contains('hidden'),undefined,{timeout:1800})};
await upload();await page.locator('#equipmentRow').click();await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show')&&document.querySelector('#v8710Cards'),undefined,{timeout:1000});await page.locator('#eqSearch').fill('高位下拉');await page.waitForFunction(()=>{const el=document.querySelector('#v8710Cards [data-v877-lib="lat"]');return !!el&&el.offsetParent!==null},undefined,{timeout:1600});await page.locator('#v8710Cards [data-v877-lib="lat"]:visible').click();await page.waitForFunction(()=>!document.querySelector('#eqSheet')?.classList.contains('show')&&document.querySelector('#equipmentName')?.textContent.trim()==='高位下拉',undefined,{timeout:1600});assert.equal((await page.locator('#equipmentName').innerText()).trim(),'高位下拉');await page.locator('#saveScan').click();await page.waitForFunction(()=>!document.querySelector('#scanSheet')?.classList.contains('show'),undefined,{timeout:2500});
await upload();await page.waitForFunction(()=>document.querySelector('#aiStatus')?.textContent?.includes('本地认出'),undefined,{timeout:1800});
assert.equal((await page.locator('#equipmentName').innerText()).trim(),'高位下拉');assert.equal((await page.locator('#aiStatus').innerText()).trim(),'本地认出');
await page.locator('#scanSheet [data-close="scanSheet"]').click();await page.waitForTimeout(80);

console.log(`[AXIS 8.8.2 ${ENGINE}] active card is immutable through 完成一组`);
await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show'),undefined,{timeout:2400});
await page.evaluate(()=>{window.__AXIS_882_CARD__=document.querySelector('#v87Now');window.__AXIS_882_CUES__=[];if(window.__AXIS_SONIC__){window.__AXIS_882_ORIG_CUE__=window.__AXIS_SONIC__.cue;window.__AXIS_SONIC__.cue=k=>window.__AXIS_882_CUES__.push(k)}});
const before=await rect('#v87Now');await page.locator('#v87Primary').click();
const immediate=await rect('#v87Now');const raf=await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>{const r=document.querySelector('#v87Now').getBoundingClientRect();resolve({same:window.__AXIS_882_CARD__===document.querySelector('#v87Now'),x:r.x,y:r.y,w:r.width,h:r.height})}))));await page.waitForTimeout(170);const after=await rect('#v87Now');
assert.equal(raf.same,true,'active card node was rebuilt');stable(before,immediate,'immediate card');stable(before,raf,'rAF card');stable(before,after,'settled card');
await page.waitForTimeout(800);assert.deepEqual(await page.evaluate(()=>window.__AXIS_882_CUES__),[],'完成一组 emitted an automatic sound');
await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='rest',undefined,{timeout:1800});

console.log(`[AXIS 8.8.2 ${ENGINE}] home rest intelligence: rest -> warn -> danger -> paused`);
const activeId=await page.locator('#v87Finish').getAttribute('data-id');assert.ok(activeId);
await page.evaluate(id=>{const k='axis_v8_meta',m=JSON.parse(localStorage.getItem(k)||'{}'),a=m.events?.[id]?.activity;if(!a)throw new Error('activity missing');m.prefs=m.prefs||{};m.prefs.reminderTiming='90';a.restStartedAt=Date.now()-95000;localStorage.setItem(k,JSON.stringify(m))},activeId);
await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='warn',undefined,{timeout:1800});assert.match((await page.locator('#axisNowTitle').innerText()).trim(),/休息偏久/);
await page.evaluate(id=>{const k='axis_v8_meta',m=JSON.parse(localStorage.getItem(k)||'{}'),a=m.events?.[id]?.activity;a.restStartedAt=Date.now()-225000;localStorage.setItem(k,JSON.stringify(m))},activeId);
await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='danger',undefined,{timeout:1800});assert.match((await page.locator('#axisNowTitle').innerText()).trim(),/休息过久/);
await page.locator('#v87Toggle').click();await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='paused',undefined,{timeout:1800});
assert.equal((await page.locator('#v87Toggle').innerText()).trim(),'▶','single paused item did not expose canonical resume control');await page.locator('#v87Toggle').click();await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='active',undefined,{timeout:1800});

console.log(`[AXIS 8.8.2 ${ENGINE}] manual long-press finish is silent`);
await page.evaluate(id=>{const k='axis_v8_meta',m=JSON.parse(localStorage.getItem(k)||'{}'),a=m.events?.[id]?.activity,t=Date.now();a.estimateMs=600000;a.startedAt=t;a.lastResumedAt=t;a.intervals=[{start:t,end:null}];a.restStartedAt=null;m.prefs.v8710SoundEnabled=true;m.prefs.v876ItemReminder=true;localStorage.setItem(k,JSON.stringify(m));window.__AXIS_882_CUES__=[]},activeId);
const finishBox=await page.locator('#v87Finish').boundingBox();assert.ok(finishBox);const cx=finishBox.x+finishBox.width/2,cy=finishBox.y+finishBox.height/2;
await page.locator('#v87Finish').dispatchEvent('pointerdown',{pointerId:71,pointerType:'touch',isPrimary:true,buttons:1,clientX:cx,clientY:cy});await page.waitForTimeout(1750);await page.locator('#v87Finish').dispatchEvent('pointerup',{pointerId:71,pointerType:'touch',isPrimary:true,buttons:0,clientX:cx,clientY:cy}).catch(()=>{});await page.waitForTimeout(750);
assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.status), 'finished');assert.deepEqual(await page.evaluate(()=>window.__AXIS_882_CUES__),[],'manual long-press finish emitted an automatic sound');
await page.waitForFunction(()=>['between','warn','danger'].includes(window.__AXIS_HOME_STATE__?.mode),undefined,{timeout:1800});

console.log(`[AXIS 8.8.2 ${ENGINE}] only natural countdown zero emits exactly one automatic cue`);
await page.locator('#quickRecordBtn').click();await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show')&&document.querySelector('#v8Recent [data-qid]'),undefined,{timeout:1400});await page.locator('#v8Recent [data-qid]:visible').first().click();await page.waitForFunction(()=>document.querySelector('#saveScan')&&document.querySelector('#v8Sets .v8SetRow'),undefined,{timeout:1800});await page.locator('#saveScan').click();await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show'),undefined,{timeout:2500});
const dueId=await page.locator('#v87Finish').getAttribute('data-id');assert.ok(dueId&&dueId!==activeId);
await page.evaluate(id=>{window.__AXIS_882_CUES__=[];const k='axis_v8_meta',m=JSON.parse(localStorage.getItem(k)||'{}'),a=m.events?.[id]?.activity,t=Date.now();if(!a)throw new Error('due activity missing');a.status='active';a.estimateMs=60000;a.startedAt=t-59400;a.lastResumedAt=t-59400;a.intervals=[{start:t-59400,end:null}];a.restStartedAt=null;m.prefs=m.prefs||{};m.prefs.v8710SoundEnabled=true;m.prefs.v876ItemReminder=true;localStorage.setItem(k,JSON.stringify(m))},dueId);
await page.waitForFunction(()=>window.__AXIS_882_CUES__?.length===1,undefined,{timeout:3200});assert.deepEqual(await page.evaluate(()=>window.__AXIS_882_CUES__),['item']);await page.waitForTimeout(1200);assert.deepEqual(await page.evaluate(()=>window.__AXIS_882_CUES__),['item'],'countdown zero repeated the cue');await page.waitForFunction(()=>document.querySelector('#v87Meta')?.textContent.trim().startsWith('剩余 00:00'),undefined,{timeout:1000});

assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log(`[AXIS 8.8.2 ${ENGINE}] PASS · home intelligence · local memory · quick custom/media · waist library · immutable active card · countdown-only sound`);
await context.close();await browser.close();