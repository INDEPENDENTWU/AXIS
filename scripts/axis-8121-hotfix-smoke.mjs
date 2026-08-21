import assert from 'node:assert/strict';
import fs from 'node:fs';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const VERSION=JSON.parse(fs.readFileSync('release-contract.json','utf8')).publicVersion;
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
await page.addInitScript(()=>{try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{throw new Error('AXIS_TEST_CAMERA_OFFLINE')}}})}catch{}});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [
 ['**/api/ai-status**',{available:false,vision:false,insight:false}],['**/api/owner-config**',{ok:true}],
 ['**/api/analyze**',{available:false,error:'not_available'}],['**/api/insight**',{available:false,error:'not_available'}],
 ['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]
])await page.route(pattern,r=>json(r,obj));

const ready=async()=>{
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:7000});
 await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:10000});
 await page.waitForFunction(()=>window.__AXIS_8121_HOTFIX__?.version==='8.12.1',undefined,{timeout:4000});
};
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const px=s=>Number.parseFloat(String(s||'0'))||0;

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.evaluate(()=>localStorage.clear());
 await page.reload({waitUntil:'domcontentloaded'});await ready();
 assert.equal(VERSION,'8.12.1');
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.1');
 assert.equal((await page.locator('.versionLine').getAttribute('aria-label')||'').trim(),'版本 8.12.1');

 console.log(`[AXIS 8.12.1 ${ENGINE}] native Settings hierarchy`);
 await tap(page.locator('#settingsBtn'));
 await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'));
 const nativeLabel=page.locator('#v8711RecordGate>.settingLink>span');
 const nativeValue=page.locator('#v8711RecordGate>.settingLink>b');
 const learningLabel=page.locator('#v810ConfigEntry>span');
 const learningValue=page.locator('#v810ConfigEntry>b');
 const serviceValue=page.locator('#v811ServiceEntry>b');
 assert.equal(await learningLabel.evaluate(el=>getComputedStyle(el).fontSize),await nativeLabel.evaluate(el=>getComputedStyle(el).fontSize));
 const nativeValueSize=await nativeValue.evaluate(el=>getComputedStyle(el).fontSize);
 assert.equal(await learningValue.evaluate(el=>getComputedStyle(el).fontSize),nativeValueSize);
 assert.equal(await serviceValue.evaluate(el=>getComputedStyle(el).fontSize),nativeValueSize);
 assert.equal(await page.locator('#v813LearningGate').evaluate(el=>getComputedStyle(el).borderTopWidth),'0px');
 assert.equal(await page.locator('#v813ServiceGate').evaluate(el=>getComputedStyle(el).borderTopWidth),'0px');

 await tap(page.locator('#v810ConfigEntry'));
 await page.waitForFunction(()=>document.querySelector('#v813LearningGate')?.classList.contains('open'));
 const learnOption=await page.locator('#v811CoreLearning button').first().evaluate(el=>({h:el.getBoundingClientRect().height,f:getComputedStyle(el).fontSize}));
 assert.ok(learnOption.h>=40);assert.ok(px(learnOption.f)>=12.5);
 await tap(page.locator('#v810ConfigEntry'));
 await tap(page.locator('#v811ServiceEntry'));
 await page.waitForFunction(()=>document.querySelector('#v813ServiceGate')?.classList.contains('open'));
 const cloudOption=await page.locator('[data-v811-cloud="off"]').evaluate(el=>({h:el.getBoundingClientRect().height,f:getComputedStyle(el).fontSize}));
 assert.ok(cloudOption.h>=40);assert.ok(px(cloudOption.f)>=12.5);
 const cloudHead=await page.locator('#v811ServicePanel .v813ServiceHead span').first().evaluate(el=>getComputedStyle(el).fontSize);
 assert.equal(cloudHead,await page.locator('#settingsSheet .settingPlain>span').first().evaluate(el=>getComputedStyle(el).fontSize));
 const capabilityDetails=page.locator('#v811ServicePanel .v813ServiceDetails').first();
 if(!(await capabilityDetails.evaluate(el=>el.open)))await tap(capabilityDetails.locator('summary'));
 const factLocator=page.locator('#v811ServicePanel .v811ServiceFact').first();
 await factLocator.waitFor({state:'visible'});
 const fact=await factLocator.evaluate(el=>({h:el.getBoundingClientRect().height,f:getComputedStyle(el).fontSize}));
 assert.ok(fact.h>=44);assert.ok(px(fact.f)>=12.5);
 assert.equal(await page.locator('.sheetWrap.show').count(),1);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)<=1);
 await tap(page.locator('#settingsSheet [data-close="settingsSheet"]'));

 console.log(`[AXIS 8.12.1 ${ENGINE}] canonical scan → catalog → Group Plan → save`);
 await page.evaluate(()=>{
  const t=Date.now();
  localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'S8121',start:t-60000,events:[]},selectedEq:null,frames:[],clip:null,stream:null,ai:null,profile:{name:'',height:'',weight:'',bodyFat:'',years:'',freq:3,goal:'',memories:[],customEq:[]},prefs:{keepClip:true,scanSeconds:3,watermark:{name:true,data:true,time:true,brand:true,pos:'bl',photoMode:'wm',videoMode:'wm'}}}));
  localStorage.setItem('axis_v8_meta',JSON.stringify({prefs:{},events:{}}));
 });
 await page.reload({waitUntil:'domcontentloaded'});await ready();
 await page.waitForFunction(()=>document.querySelector('#scanBtn')?.getClientRects().length>0,undefined,{timeout:4000});
 await tap(page.locator('#scanBtn'));
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show'));
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAABAklEQVR4nO2asQ3CMBREHZRBKKiYgRlSMQIlYhhEmRGomIHBKNwgxU7Ad3CxfK90IudefvLlWOm2u32omY06AIoF1FhAjQXU9LkDw/H8zxyLPO635Hj1FbCAGguosYAaC6ixgJrsWgjkcjpMB6/jk34hvkAy+vshrgZTYCb69DSWBu0d+DB98fk5OAJlaSgOBAEkB+5QfRtFBfBbCM7QdgVYnQSZp+0KrAELqLGAGkiAtaJE5mm7AoFRBHCG5isQsFuIF5BTgbIclB5Ae4S+TcPqYMyP+phpcWm53l2JyIxGHftCkV9kTeI2qsYCaiygxgJqLKCm83+jYiygxgJqLKDmBVV6OVsV43ZUAAAAAElFTkSuQmCC','base64');
 await page.locator('#photoInput').setInputFiles({name:'axis-test.png',mimeType:'image/png',buffer:png});
 await page.waitForFunction(()=>!document.querySelector('#reviewStage')?.classList.contains('hidden'),undefined,{timeout:3500});
 await tap(page.locator('#equipmentRow'));
 await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show')&&document.querySelector('#v8710Cards button'),undefined,{timeout:3000});
 const chest=page.locator('#v8710Cards button').filter({hasText:'胸推'}).first();
 assert.equal(await chest.count(),1,'canonical visible chest-press card missing');
 assert.equal(await chest.isVisible(),true,'canonical chest-press card is not visible');
 await tap(chest);
 await page.waitForFunction(()=>!document.querySelector('#strengthFields')?.classList.contains('hidden')&&document.querySelector('.v8121PlanButton'),undefined,{timeout:3500});
 const target=await page.locator('.v8121PlanButton').evaluate(el=>{const r=el.getBoundingClientRect(),c=getComputedStyle(el);return{tag:el.tagName,type:el.getAttribute('type'),h:r.height,w:r.width,p:c.pointerEvents,n:document.querySelectorAll('.v8121PlanButton').length}});
 assert.deepEqual({tag:target.tag,type:target.type,n:target.n},{tag:'BUTTON',type:'button',n:1});
 assert.ok(target.h>=44);assert.ok(target.w>=70);assert.notEqual(target.p,'none');
 await tap(page.locator('.v8121PlanButton'));
 await page.waitForFunction(()=>document.querySelector('#v875PlanSheet')?.classList.contains('show')&&document.querySelector('#v8712Apply'),undefined,{timeout:3000});
 assert.equal(await page.locator('#v875PlanSheet').isVisible(),true);
 await tap(page.locator('[data-v8712-count="4"]'));
 await tap(page.locator('[data-v8712-mode="up"]'));
 await tap(page.locator('#v8712Apply'));
 await page.waitForFunction(()=>document.querySelectorAll('#v8Sets .v8SetRow').length===4,undefined,{timeout:3500});
 await tap(page.locator('#saveScan'));
 await page.waitForTimeout(300);
 const saved=await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),e=c.active?.events?.at(-1);return{event:e,meta:e?m.events?.[e.id]:null}});
 assert.equal(saved.event?.kind,'strength');assert.equal(saved.event?.sets,4);assert.equal(saved.meta?.sets?.length,4);
 assert.equal(await page.evaluate(()=>window.__AXIS_8121_HOTFIX__?.recordingOwner),false);
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.12.1 ${ENGINE}] PASS · native Settings · canonical catalog · real Group Plan touch · four-set save`);
}finally{
 await context.close().catch(()=>{});await browser.close().catch(()=>{});
}