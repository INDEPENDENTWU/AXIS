import assert from 'node:assert/strict';
import fs from 'node:fs';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const VERSION=JSON.parse(fs.readFileSync('release-contract.json','utf8')).publicVersion;
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
await page.addInitScript(()=>{try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{throw new Error('AXIS_TEST_CAMERA_OFFLINE')}}})}catch{}});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [
 ['**/api/ai-status**',{available:false,vision:false,insight:false}],['**/api/owner-config**',{ok:true}],
 ['**/api/analyze**',{available:false,error:'not_available'}],['**/api/insight**',{available:false,error:'not_available'}],
 ['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]
])await page.route(pattern,r=>json(r,obj));
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:7000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:10000});await page.waitForFunction(()=>window.__AXIS_8121_HOTFIX__?.version==='8.12.1',undefined,{timeout:4000})};
const tap=async locator=>{if(ENGINE==='webkit')await locator.tap();else await locator.click()};
const px=s=>Number.parseFloat(String(s||'0'))||0;

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});await ready();
 assert.equal(VERSION,'8.12.1');assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.1');
 assert.equal((await page.locator('.versionLine').getAttribute('aria-label')||'').trim(),'版本 8.12.1');

 console.log(`[AXIS 8.12.1 ${ENGINE}] Settings typography and geometry converge to native AXIS rhythm`);
 await tap(page.locator('#settingsBtn'));await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'));
 const nativeGateLabel=page.locator('#v8711RecordGate > .settingLink > span'),nativeGateValue=page.locator('#v8711RecordGate > .settingLink > b');
 const learningLabelTop=page.locator('#v810ConfigEntry > span'),learningValueTop=page.locator('#v810ConfigEntry > b'),serviceValueTop=page.locator('#v811ServiceEntry > b');
 assert.equal(await nativeGateValue.count(),1,'native Settings value reference missing');
 assert.equal(await learningLabelTop.evaluate(el=>getComputedStyle(el).fontSize),await nativeGateLabel.evaluate(el=>getComputedStyle(el).fontSize),'Learning row typography differs from native Settings fold');
 const nativeValueSize=await nativeGateValue.evaluate(el=>getComputedStyle(el).fontSize);
 assert.equal(await learningValueTop.evaluate(el=>getComputedStyle(el).fontSize),nativeValueSize,'Learning summary typography differs from native Settings value');
 assert.equal(await serviceValueTop.evaluate(el=>getComputedStyle(el).fontSize),nativeValueSize,'Cloud/AI summary typography differs from native Settings value');
 assert.equal(await page.locator('#v813LearningGate').evaluate(el=>getComputedStyle(el).borderTopWidth),'0px','Learning gate has an extra outer divider');
 assert.equal(await page.locator('#v813ServiceGate').evaluate(el=>getComputedStyle(el).borderTopWidth),'0px','Cloud/AI gate has an extra outer divider');
 await tap(page.locator('#v810ConfigEntry'));await page.waitForFunction(()=>document.querySelector('#v813LearningGate')?.classList.contains('open'));
 const nativeLabel=await page.locator('#settingsSheet .settingPlain>span').first().evaluate(el=>getComputedStyle(el).fontSize);
 const learningLabel=await page.locator('#v810ConfigPanel .v811CoreHead span').first().evaluate(el=>getComputedStyle(el).fontSize);
 assert.equal(learningLabel,nativeLabel,'Learning inner label does not match native Settings text size');
 const learningButton=await page.locator('#v811CoreLearning button').first().evaluate(el=>{const r=el.getBoundingClientRect(),c=getComputedStyle(el);return{h:r.height,font:c.fontSize}});
 assert.ok(learningButton.h>=40,`Learning touch target too small: ${learningButton.h}`);assert.ok(px(learningButton.font)>=12.5,`Learning option text too small: ${learningButton.font}`);
 await tap(page.locator('#v810ConfigEntry'));await tap(page.locator('#v811ServiceEntry'));await page.waitForFunction(()=>document.querySelector('#v813ServiceGate')?.classList.contains('open'));
 const serviceButton=await page.locator('[data-v811-cloud="off"]').evaluate(el=>{const r=el.getBoundingClientRect(),c=getComputedStyle(el);return{h:r.height,font:c.fontSize}});
 assert.ok(serviceButton.h>=40,`Cloud option touch target too small: ${serviceButton.h}`);assert.ok(px(serviceButton.font)>=12.5,`Cloud option text too small: ${serviceButton.font}`);
 const serviceLabel=await page.locator('#v811ServicePanel .v813ServiceHead span').first().evaluate(el=>getComputedStyle(el).fontSize);assert.equal(serviceLabel,nativeLabel,'Cloud/AI label typography differs from native Settings');
 const serviceFact=await page.locator('#v811ServicePanel .v811ServiceFact').first().evaluate(el=>{const r=el.getBoundingClientRect(),c=getComputedStyle(el);return{h:r.height,font:c.fontSize}});assert.ok(serviceFact.h>=44,`Cloud/AI fact row too small: ${serviceFact.h}`);assert.ok(px(serviceFact.font)>=12.5,`Cloud/AI fact text too small: ${serviceFact.font}`);
 assert.equal(await page.locator('.sheetWrap.show').count(),1,'inline Settings created nested sheet');
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);assert.ok(overflow<=1,`Settings horizontal overflow ${overflow}`);
 await tap(page.locator('#settingsSheet [data-close="settingsSheet"]'));

 console.log(`[AXIS 8.12.1 ${ENGINE}] real scan/review path opens Group Plan with a native touch button`);
 await page.evaluate(()=>{const t=Date.now(),core={version:60,sessions:[],active:{id:'S8121',start:t-60000,events:[]},selectedEq:null,frames:[],clip:null,stream:null,ai:null,profile:{name:'',height:'',weight:'',bodyFat:'',years:'',freq:3,goal:'',memories:[],customEq:[]},prefs:{keepClip:true,scanSeconds:3,watermark:{name:true,data:true,time:true,brand:true,pos:'bl',photoMode:'wm',videoMode:'wm'}}};localStorage.setItem('axis_v60_state',JSON.stringify(core));localStorage.setItem('axis_v8_meta',JSON.stringify({prefs:{},events:{}}))});
 await page.reload({waitUntil:'domcontentloaded'});await ready();await page.waitForFunction(()=>document.querySelector('#scanBtn')?.getClientRects().length>0,undefined,{timeout:4000});
 await tap(page.locator('#scanBtn'));await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show'));
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAQAAABFaP0WAAAADElEQVR42mP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC','base64');
 await page.locator('#photoInput').setInputFiles({name:'axis-test.png',mimeType:'image/png',buffer:png});
 await page.waitForFunction(()=>!document.querySelector('#reviewStage')?.classList.contains('hidden'),undefined,{timeout:3500});
 await tap(page.locator('#equipmentRow'));await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show')&&document.querySelector('#eqList [data-eq="chest"]'));
 await tap(page.locator('#eqList [data-eq="chest"]'));await page.waitForFunction(()=>!document.querySelector('#strengthFields')?.classList.contains('hidden')&&document.querySelector('.v8121PlanButton'),undefined,{timeout:3500});
 const planTarget=await page.locator('.v8121PlanButton').evaluate(el=>{const r=el.getBoundingClientRect(),c=getComputedStyle(el);return{tag:el.tagName,type:el.getAttribute('type'),h:r.height,w:r.width,pointer:c.pointerEvents,touch:c.touchAction,count:document.querySelectorAll('.v8121PlanButton').length}});
 assert.deepEqual({tag:planTarget.tag,type:planTarget.type,count:planTarget.count},{tag:'BUTTON',type:'button',count:1});assert.ok(planTarget.h>=44,`Group Plan touch height ${planTarget.h}`);assert.ok(planTarget.w>=70,`Group Plan touch width ${planTarget.w}`);assert.notEqual(planTarget.pointer,'none');
 await tap(page.locator('.v8121PlanButton'));await page.waitForFunction(()=>document.querySelector('#v875PlanSheet')?.classList.contains('show')&&document.querySelector('#v8712Apply'),undefined,{timeout:2500});
 assert.equal(await page.locator('#v875PlanSheet').isVisible(),true,'Group Plan did not open after real touch tap');
 await tap(page.locator('[data-v8712-count="4"]'));await tap(page.locator('[data-v8712-mode="up"]'));await tap(page.locator('#v8712Apply'));
 await page.waitForFunction(()=>document.querySelectorAll('#v8Sets .v8SetRow').length===4,undefined,{timeout:3000});
 const draft=await page.evaluate(()=>window.__AXIS_RECORDING__?.snapshot?.());assert.ok(draft,'canonical recording snapshot missing');assert.equal(draft.sets?.length,4,'Group Plan did not commit four-set draft through canonical recording owner');
 await tap(page.locator('#saveScan'));await page.waitForTimeout(250);
 const saved=await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),e=c.active?.events?.at(-1);return{event:e,meta:e?m.events?.[e.id]:null}});
 assert.equal(saved.event?.kind,'strength');assert.equal(saved.event?.sets,4);assert.equal(saved.meta?.sets?.length,4,'saved metadata lost Group Plan rows');
 assert.equal(await page.evaluate(()=>window.__AXIS_8121_HOTFIX__?.recordingOwner),false,'8.12.1 hotfix became a recording owner');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.12.1 ${ENGINE}] PASS · native Settings rhythm · native Group Plan touch · scan/review/apply/save`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
