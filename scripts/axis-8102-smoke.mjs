import assert from 'node:assert/strict';
import fs from 'node:fs';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const EXPECTED=JSON.parse(fs.readFileSync('release-contract.json','utf8')).publicVersion;
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false,vision:false,insight:false,version:'axis-ai-v4'}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false,error:'not_available'}],['**/api/insight**',{available:false,error:'not_available'}],['**/nominatim.openstreetmap.org/reverse**',{name:'测试健身房',address:{road:'测试路',city:'测试市'}}]])await page.route(pattern,r=>json(r,obj));
await page.addInitScript(()=>{window.__AXIS_8102_SPEAK_CALLS__=0;try{Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{cancel(){},speak(u){window.__AXIS_8102_SPEAK_CALLS__++;queueMicrotask(()=>u?.onend?.({charIndex:String(u?.text||'').length}))}}})}catch{}try{Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:function(text){this.text=text;this.lang='';this.rate=1;this.pitch=1;this.onend=null;this.onerror=null;this.onboundary=null}})}catch{}});
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:8000})};

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>localStorage.clear());
await page.evaluate(()=>{const t=Date.now(),mk=(id,name,time)=>({id,equipmentId:'dumbbell',name,kind:'strength',time,weight:20,reps:10,sets:3,muscles:['胸肌'],frameRefs:[]});const events=[mk('EH1','哑铃卧推',t-3600000),mk('EH2','前平举',t-3500000),mk('EH3','杠铃深蹲',t-3400000),mk('EH4','蝴蝶机夹胸',t-3300000),mk('EH5','坐姿卷腹机',t-3200000)];const core={version:60,sessions:[{id:'SH1',start:t-7200000,end:t-3400000,events}],active:null,selectedEq:null,frames:[],clip:null,stream:null,ai:null,profile:{name:'',height:'',weight:'',bodyFat:'',years:'',freq:3,goal:'',memories:[],customEq:[]},prefs:{keepClip:true,scanSeconds:3,watermark:{name:true,data:true,time:true,brand:true,pos:'bl',photoMode:'wm',videoMode:'wm'}}};localStorage.setItem('axis_v60_state',JSON.stringify(core));localStorage.setItem('axis_v8_meta',JSON.stringify({prefs:{},events:{}}));localStorage.setItem('axis_v89_speak',JSON.stringify({seen:{},current:null,prefs:{enabled:true,native:'zh',target:'en',mode:'auto',track:'auto',cadence:'every',level:'adaptive',dailyTarget:0,opportunity:'auto',standalone:'manual'},mastered:{},review:{},daily:{},sessions:{},history:[],practice:{}}))});
await page.reload({waitUntil:'domcontentloaded'});await ready();
assert.equal(EXPECTED,'8.10.2');

console.log(`[AXIS 8.10.2 ${ENGINE}] history session -> event is a single composed swap`);
await page.locator('.nav [data-view="historyView"]').click();await page.waitForFunction(()=>document.querySelector('#historyView')?.classList.contains('active'));
await page.locator('#historyList [data-session="SH1"]').click();await page.waitForFunction(()=>document.querySelector('#detailSheet')?.classList.contains('show')&&document.querySelectorAll('#detail [data-event]').length===5);
await page.locator('#detail [data-event="EH3"]').click();
await page.waitForFunction(()=>window.__AXIS_89_DETAIL__?.patch==='8.10.2'&&document.querySelector('#detailTitle')?.textContent==='杠铃深蹲',undefined,{timeout:1800});
const detailDiag=await page.evaluate(()=>window.__AXIS_89_DETAIL__);assert.equal(detailDiag.singleComposition,true);assert.equal(detailDiag.legacyHeightHold,false);
const detailFrames=await page.evaluate(()=>new Promise(resolve=>{const out=[];let n=0;const step=()=>{const h=document.querySelector('#detail'),s=document.querySelector('#detailSheet>.sheet');out.push({min:h?.style?.minHeight||'',top:s?.getBoundingClientRect().top||0,title:document.querySelector('#detailTitle')?.textContent||''});if(++n<5)requestAnimationFrame(step);else resolve(out)};requestAnimationFrame(step)}));
assert.ok(detailFrames.every(x=>!x.min),'detail drill-down still exposes an intermediate inherited min-height');assert.ok(detailFrames.every(x=>x.title==='杠铃深蹲'),'detail title changed across composed frames');
await page.locator('#detailSheet [data-close="detailSheet"]').click();

console.log(`[AXIS 8.10.2 ${ENGINE}] standalone learning is available outside a workout and survives idle Home repaint ticks`);
const coreBeforeStandalone=await page.evaluate(()=>localStorage.getItem('axis_v60_state')),metaBeforeStandalone=await page.evaluate(()=>localStorage.getItem('axis_v8_meta'));
await page.locator('#settingsBtn').click();await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show')&&document.querySelector('#v810ConfigEntry'));
await page.locator('#v810ConfigEntry').click();await page.waitForFunction(()=>document.querySelector('#v813LearningGate')?.classList.contains('open')&&document.querySelector('#v810ConfigPanel'));
assert.equal(await page.locator('.sheetWrap.show').count(),1,'standalone Learning Settings opened a second sheet');
assert.equal(await page.locator('#v810SpeakControls [data-v810-options="standalone"] button').count(),3,'standalone schedule control is incomplete');
const standaloneStart=page.locator('[data-v810-standalone-start]');assert.equal(await standaloneStart.isVisible(),true,'standalone learning launcher is hidden while enabled');
assert.equal(await page.evaluate(()=>window.__AXIS_8102_SPEAK_CALLS__),0,'standalone learning autoplayed before user action');
await standaloneStart.click();await page.waitForFunction(()=>document.querySelector('#v891SpeakPanel')?.classList.contains('show')&&document.querySelector('#v891SpeakPanel')?.dataset.axis8102Source==='standalone',undefined,{timeout:1800});
assert.equal(await page.evaluate(()=>window.__AXIS_8102_SPEAK_CALLS__),0,'standalone learning autoplayed on open');assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v60_state')),coreBeforeStandalone,'standalone learning changed core training state');assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v8_meta')),metaBeforeStandalone,'standalone learning changed training metadata');
assert.equal(await page.locator('#v8101Practice [data-v8101-mode]').count(),3,'standalone learning lost dialogue/echo/shadow modes');
await page.waitForTimeout(1650);assert.equal(await page.locator('#v891SpeakPanel').evaluate(el=>el.classList.contains('show')),true,'standalone learning panel was closed by idle Home repaint');assert.equal(await page.locator('#v891SpeakPanel').getAttribute('data-axis8102-source'),'standalone');
await page.locator('#v891SpeakPanel [data-v891-action="close"]').click();await page.waitForFunction(()=>!document.querySelector('#v891SpeakPanel')?.classList.contains('show'));

console.log(`[AXIS 8.10.2 ${ENGINE}] paused training state remains quiet and isolated`);
await page.evaluate(()=>{const t=Date.now(),event={id:'EP1',equipmentId:'rower',name:'坐姿划船机',kind:'cardio',time:t-3600000,duration:15,intensity:5,muscles:['背部'],frameRefs:[]};const core=JSON.parse(localStorage.getItem('axis_v60_state'));core.sessions=[];core.active={id:'SP1',start:t-9000000,events:[event]};localStorage.setItem('axis_v60_state',JSON.stringify(core));localStorage.setItem('axis_v8_meta',JSON.stringify({prefs:{},events:{EP1:{activity:{status:'paused',startedAt:t-9000000,lastResumedAt:t-9000000,pausedAt:t-30000,finishedAt:null,estimateMs:900000,completedSets:0,intervals:[{start:t-9000000,end:t-30000}],restStartedAt:t-30000},sets:[]}}}));const s=JSON.parse(localStorage.getItem('axis_v89_speak'));s.current=null;s.prefs.opportunity='pause';s.prefs.standalone='off';localStorage.setItem('axis_v89_speak',JSON.stringify(s))});
await page.reload({waitUntil:'domcontentloaded'});await ready();await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show'),undefined,{timeout:3500});
const metaBaseline=await page.evaluate(()=>localStorage.getItem('axis_v8_meta'));assert.equal(await page.evaluate(()=>window.__AXIS_8102_SPEAK_CALLS__),0,'paused state autoplayed');assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v8_meta')),metaBaseline,'paused state changed training metadata');assert.equal(await page.evaluate(()=>window.__AXIS_ACTIVE_CONTROL__?.owner),'v87-direct-884');

assert.deepEqual(errors,[],`page errors: ${errors.join('\n')}`);await browser.close();console.log(`[AXIS 8.10.2 ${ENGINE}] PASS · inline Settings · stable detail drill-down · persistent standalone learning · quiet paused state · training isolation`);
