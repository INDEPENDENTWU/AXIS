import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
await page.addInitScript(()=>{try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{throw new Error('AXIS_TEST_CAMERA_OFFLINE')}}})}catch{}});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:9000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:12000});await page.waitForFunction(()=>window.__AXIS_8124_CATALOG_POLISH__?.singleSearchOwner===true&&window.__AXIS_8124_PICKER_PROJECTION__?.storageWriter===false&&window.__AXIS_EXERCISE_TAXONOMY__?.detailMuscles===true&&window.__AXIS_8124_SETTINGS_DETAIL_SEAL__?.optionHeightPx===42,undefined,{timeout:7000})};
const openPicker=async()=>{await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__?.('recording'));await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'));await page.waitForTimeout(80)};
const search=async q=>{const input=page.locator('#eqSearch');await input.fill(q);await page.waitForFunction(v=>document.querySelector('#eqSearch')?.value===v&&document.querySelector('#v873SmartResults')?.classList.contains('show'),q,{timeout:2000});await page.waitForTimeout(50);return(await page.locator('#v873SmartResults').innerText()).replace(/\s+/g,' ')};
const near=(a,b,t=1)=>Math.abs(a-b)<=t;

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 const now=Date.now();
 await page.evaluate(t=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[{id:'S1',start:t-3600000,end:t-1800000,events:[{id:'E1',equipmentId:'lat',name:'高位下拉',kind:'strength',pattern:'pull',muscles:['背部','肱二头肌'],time:t-2200000,weight:45,reps:10,sets:3}]}],active:{id:'A1',start:t-120000,events:[]},profile:{customEq:[{id:'custom-test',name:'绳索直臂下拉变式',type:'strength',pattern:'pull',muscles:['背部'],effect:'背阔肌'}],memories:[]},prefs:{}}));localStorage.setItem('axis_v8_meta',JSON.stringify({prefs:{},events:{}}))},now);
 await page.reload({waitUntil:'domcontentloaded'});await ready();
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.4');

 console.log(`[AXIS 8.12.4 polish ${ENGINE}] expanded Learning + Cloud/AI share native Settings edges and control rhythm`);
 const seal=await page.evaluate(()=>window.__AXIS_8124_SETTINGS_DETAIL_SEAL__);
 assert.deepEqual({inset:seal?.foldHorizontalInset,segment:seal?.segmentHeightPx,option:seal?.optionHeightPx,ui:seal?.uiPx,reference:seal?.reference},{inset:0,segment:48,option:42,ui:15,reference:'v8710-sound'});
 await tap(page.locator('#settingsBtn'));await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'));
 await tap(page.locator('#v810ConfigEntry'));await page.waitForFunction(()=>document.querySelector('#v813LearningGate')?.classList.contains('open'));
 const learning=await page.evaluate(()=>{const gate=document.querySelector('#v813LearningGate'),fold=gate?.querySelector(':scope>.v8711Fold'),group=gate?.querySelector('.v811CoreGroup'),button=gate?.querySelector('.v811CoreOptions button'),label=gate?.querySelector('.v811CoreHead span');const b=x=>{const c=getComputedStyle(x),r=x.getBoundingClientRect();return{left:r.left,right:r.right,height:r.height,cssHeight:parseFloat(c.height||0),font:parseFloat(c.fontSize||0)}};return{gate:b(gate),foldPadding:[parseFloat(getComputedStyle(fold).paddingLeft||0),parseFloat(getComputedStyle(fold).paddingRight||0)],group:b(group),button:b(button),label:b(label)}});
 assert.deepEqual(learning.foldPadding,[0,0],'Learning fold retained nested horizontal inset');
 assert.ok(near(learning.group.left,learning.gate.left)&&near(learning.group.right,learning.gate.right),`Learning content edge drift: ${JSON.stringify(learning)}`);
 assert.equal(learning.button.cssHeight,42,`Learning CSS option height drifted: ${learning.button.cssHeight}`);assert.ok(learning.button.height>=42&&learning.button.height<=44,`Learning touch geometry drifted: ${learning.button.height}`);assert.equal(learning.label.font,15,`Learning label font drifted: ${learning.label.font}`);
 await tap(page.locator('#v810ConfigEntry'));await page.waitForFunction(()=>!document.querySelector('#v813LearningGate')?.classList.contains('open'));
 await tap(page.locator('#v811ServiceEntry'));await page.waitForFunction(()=>document.querySelector('#v813ServiceGate')?.classList.contains('open')&&document.querySelector('#v813ServiceGate .axis8122Group'));
 const service=await page.evaluate(()=>{const gate=document.querySelector('#v813ServiceGate'),fold=gate?.querySelector(':scope>.v8711Fold'),group=gate?.querySelector('.axis8122Group'),button=gate?.querySelector('.axis8122Grid button'),label=gate?.querySelector('.axis8122Head span');const b=x=>{const c=getComputedStyle(x),r=x.getBoundingClientRect();return{left:r.left,right:r.right,height:r.height,cssHeight:parseFloat(c.height||0),font:parseFloat(c.fontSize||0)}};return{gate:b(gate),foldPadding:[parseFloat(getComputedStyle(fold).paddingLeft||0),parseFloat(getComputedStyle(fold).paddingRight||0)],group:b(group),button:b(button),label:b(label)}});
 assert.deepEqual(service.foldPadding,[0,0],'Cloud/AI fold retained nested horizontal inset');
 assert.ok(near(service.group.left,service.gate.left)&&near(service.group.right,service.gate.right),`Cloud/AI content edge drift: ${JSON.stringify(service)}`);
 assert.equal(service.button.cssHeight,42,`Cloud/AI CSS option height drifted: ${service.button.cssHeight}`);assert.ok(near(service.button.height,learning.button.height,.5),`Learning / Cloud touch geometry diverged: ${learning.button.height} vs ${service.button.height}`);assert.equal(service.label.font,15,`Cloud/AI label font drifted: ${service.label.font}`);assert.ok(near(service.label.font,learning.label.font,.1));
 await page.locator('#settingsSheet [data-close="settingsSheet"]').click();await page.waitForFunction(()=>!document.querySelector('#settingsSheet')?.classList.contains('show'));

 console.log(`[AXIS 8.12.4 catalog ${ENGINE}] recording picker exposes Recent + My as read-only projections`);
 const storesBefore=await page.evaluate(()=>[localStorage.getItem('axis_v60_state'),localStorage.getItem('axis_v8_meta')]);
 await openPicker();
 assert.equal(await page.locator('#v8124PickerContext').isVisible(),true,'picker context is not visible');
 assert.equal(await page.locator('[data-v8124-kind="recent"][data-v8124-pick="lat"]').count(),1,'recent 高位下拉 missing');
 assert.equal(await page.locator('[data-v8124-kind="mine"][data-v8124-pick="custom-test"]').count(),1,'My custom exercise missing');
 assert.deepEqual(await page.evaluate(()=>[localStorage.getItem('axis_v60_state'),localStorage.getItem('axis_v8_meta')]),storesBefore,'opening picker projection wrote training storage');

 console.log(`[AXIS 8.12.4 catalog ${ENGINE}] Recent selection returns to recording review through canonical picker and clears query`);
 await tap(page.locator('[data-v8124-kind="recent"][data-v8124-pick="lat"]'));
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&!document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:2200});
 assert.equal((await page.locator('#equipmentName').innerText()).trim(),'高位下拉');
 assert.equal(await page.locator('#eqSearch').inputValue(),'','search query survived selection');
 await page.evaluate(()=>document.querySelector('#scanSheet')?.classList.remove('show'));

 console.log(`[AXIS 8.12.4 catalog ${ENGINE}] one search owner stays smooth and searches movement + anatomy + aliases accurately`);
 await openPicker();
 await page.evaluate(()=>{window.__AXIS_TEST_EQ_MUTATIONS__=0;const n=document.querySelector('#eqList');window.__AXIS_TEST_EQ_OBSERVER__=new MutationObserver(xs=>window.__AXIS_TEST_EQ_MUTATIONS__+=xs.length);if(n)window.__AXIS_TEST_EQ_OBSERVER__.observe(n,{childList:true,subtree:true,characterData:true})});
 let text=await search('三角肌后束');assert.match(text,/反向飞鸟|面拉/,`rear-delt anatomy search missed: ${text}`);
 text=await search('RDL');assert.match(text,/罗马尼亚硬拉/,`RDL alias search missed: ${text}`);
 text=await search('内收肌群');assert.match(text,/髋内收/,`adductor anatomy search missed: ${text}`);
 const mutations=await page.evaluate(()=>window.__AXIS_TEST_EQ_MUTATIONS__);assert.equal(mutations,0,`legacy equipment list re-rendered during typing: ${mutations}`);
 assert.equal(await page.evaluate(()=>document.querySelector('#eqSearch')?.dataset.axis8124SearchOwner),'1','single search owner marker missing');

 console.log(`[AXIS 8.12.4 catalog ${ENGINE}] close/reopen never keeps stale search text`);
 await page.locator('#eqSheet [data-close="eqSheet"]').click();await page.waitForFunction(()=>!document.querySelector('#eqSheet')?.classList.contains('show'));
 await openPicker();assert.equal(await page.locator('#eqSearch').inputValue(),'','search text persisted after picker reopen');
 await page.evaluate(()=>document.querySelector('#eqSheet')?.classList.remove('show'));

 console.log(`[AXIS 8.12.4 catalog ${ENGINE}] native taxonomy is detailed while generic equipment remains contextual`);
 const taxonomy=await page.evaluate(()=>{const lib=window.__AXIS_873_LIBRARY__||[],pick=id=>lib.find(x=>x.id===id);const a=pick('adduction'),r=pick('rdl'),d=pick('dumbbell');return{adduction:{primary:a?.primaryTargets,details:a?.detailMuscles,coarse:a?.muscles,pattern:a?.movementPattern},rdl:{primary:r?.primaryTargets,secondary:r?.secondaryTargets,pattern:r?.movementPattern},dumbbell:{kind:d?.targetKind,variable:d?.variableTargets,confidence:d?.targetConfidence,details:d?.detailMuscles},contract:window.__AXIS_EXERCISE_TAXONOMY__}});
 assert.equal(taxonomy.adduction.primary?.[0],'内收肌群');assert.ok(taxonomy.adduction.details?.includes('内收肌群'));assert.equal(taxonomy.adduction.pattern,'髋内收');
 assert.ok(taxonomy.rdl.primary?.includes('腘绳肌')&&taxonomy.rdl.primary?.includes('臀大肌'),`RDL primary targets wrong: ${JSON.stringify(taxonomy.rdl)}`);assert.equal(taxonomy.rdl.pattern,'髋铰链');
 assert.deepEqual({kind:taxonomy.dumbbell.kind,variable:taxonomy.dumbbell.variable,confidence:taxonomy.dumbbell.confidence},{kind:'equipment',variable:true,confidence:'contextual'});assert.equal(taxonomy.dumbbell.details?.length,0,'generic dumbbell falsely claims fixed detailed targets');
 assert.equal(taxonomy.contract?.compatibilityMusclesPreserved,true);

 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.12.4 polish ${ENGINE}] PASS · native Settings detail edges · Recent/My recording picker · no per-key legacy rebuild · accurate indexed search · detailed native anatomy`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
