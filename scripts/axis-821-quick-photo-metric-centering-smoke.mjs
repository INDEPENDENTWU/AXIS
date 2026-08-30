import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
await context.addInitScript(()=>{
 const now=Date.now();
 const eq={
  id:'axis-821-center-test',name:'数字居中测试',type:'cardio',pattern:'cardio',muscles:['心肺'],effect:'几何验证',custom:true,
  metricSchema:[
   {key:'duration',label:'时间',type:'duration',unit:'分钟',step:1,min:0},
   {key:'resistance',label:'阻力',type:'number',unit:'档',step:.5,min:0}
  ],
  metricSchemaVersion:'8.21',executionMode:'timed',recording:{version:2,metrics:['duration','resistance'],executionMode:'timed'}
 };
 localStorage.clear();
 localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'axis-821-center-session',start:now-60000,events:[]},flows:[],flowRun:null,profile:{customEq:[eq],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
 localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
 try{Object.defineProperty(HTMLMediaElement.prototype,'play',{configurable:true,value:function(){return Promise.resolve()}})}catch{}
 const mediaDevices={getUserMedia:async()=>new MediaStream()};
 try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:mediaDevices})}catch{}
});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const svg={name:'axis-center.svg',mimeType:'image/svg+xml',buffer:Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="360" height="480"><rect width="360" height="480" fill="#20242b"/><text x="30" y="250" fill="white" font-size="42">AXIS</text></svg>')};

async function geometry(key,label){
 const root=page.locator(`[data-axis821-key="${key}"]`);assert.equal(await root.count(),1,`${label}: metric control missing`);
 const g=await root.evaluate(node=>{
  const cell=node.querySelector('.axis821Stepper>div'),input=node.querySelector('[data-axis818-metric]'),unit=input?.nextElementSibling;
  if(!cell||!input)throw new Error('metric geometry nodes missing');
  const c=cell.getBoundingClientRect(),i=input.getBoundingClientRect(),u=unit?.getBoundingClientRect(),cs=getComputedStyle(input),cellStyle=getComputedStyle(cell);
  return{cellCenter:(c.left+c.right)/2,inputCenter:(i.left+i.right)/2,delta:Math.abs((i.left+i.right-c.left-c.right)/2),textAlign:cs.textAlign,display:cellStyle.display,template:cellStyle.gridTemplateColumns,unitLeft:u?.left??null,inputRight:i.right,scroll:document.documentElement.scrollWidth,inner:innerWidth};
 });
 assert.ok(g.delta<=.5,`${label}: numeric input center drift ${g.delta.toFixed(3)}px`);
 assert.equal(g.textAlign,'center',`${label}: numeric glyph alignment is not centered`);
 assert.equal(g.display,'grid',`${label}: symmetric value/unit grid missing`);
 assert.ok(g.template.split(' ').length>=3,`${label}: symmetric three-track grid missing · ${g.template}`);
 if(g.unitLeft!=null)assert.ok(g.unitLeft>=g.inputRight-1,`${label}: unit overlaps the centered number`);
 assert.ok(g.scroll<=g.inner+1,`${label}: recording surface overflow ${g.scroll}/${g.inner}`);
 return g;
}

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_OBJECT_TRUTH__?.version==='8.18'&&window.__AXIS_821_RECORDING_SURFACE__?.version==='8.21'&&window.__AXIS_821_METRIC_CONTROLS__?.numberCenterIndependentOfUnit===true,undefined,{timeout:15000});

 console.log(`[AXIS 8.21 metric centering ${ENGINE}] Quick Record real entry`);
 await tap(page.locator('#quickRecordBtn'));
 await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'),undefined,{timeout:2500});
 const quickItem=page.locator('#v882QuickCustom [data-qid="axis-821-center-test"]');assert.equal(await quickItem.count(),1,'Quick Record custom Object missing');await tap(quickItem);
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#scanSheet')?.classList.contains('v8-quick')&&!document.querySelector('#reviewStage')?.classList.contains('hidden')&&document.querySelector('#equipmentName')?.textContent?.trim()==='数字居中测试'&&document.querySelector('[data-axis818-metric="duration"]')&&document.querySelector('[data-axis818-metric="resistance"]'),undefined,{timeout:4000});
 const durationPreset=page.locator('[data-axis821-preset="duration"][data-value="20"]');assert.equal(await durationPreset.count(),1);await tap(durationPreset);await page.waitForFunction(()=>document.querySelector('[data-axis818-metric="duration"]')?.value==='20');await geometry('duration','Quick duration preset 20');
 const resistance=page.locator('[data-axis818-metric="resistance"]');await resistance.fill('8.5');await geometry('resistance','Quick resistance direct input 8.5');
 const plus=page.locator('[data-axis821-step="resistance"][data-delta="0.5"]');assert.equal(await plus.count(),1);await tap(plus);await page.waitForFunction(()=>document.querySelector('[data-axis818-metric="resistance"]')?.value==='9');await geometry('resistance','Quick resistance step 9');
 await page.locator('#scanSheet [data-close="scanSheet"]').click();await page.waitForFunction(()=>!document.querySelector('#scanSheet')?.classList.contains('show'));

 console.log(`[AXIS 8.21 metric centering ${ENGINE}] Photo Record real capture → review → Object entry`);
 await tap(page.locator('#scanBtn'));
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&!document.querySelector('#scanSheet')?.classList.contains('v8-quick')&&!document.querySelector('#captureStage')?.classList.contains('hidden'),undefined,{timeout:3000});
 const photoMode=page.locator('#v816CaptureMode [data-v816-mode="photo"]');if(await photoMode.count())await tap(photoMode);
 const photoInput=page.locator('#photoInput');assert.equal(await photoInput.count(),1,'Photo Record input missing');await photoInput.setInputFiles([svg]);
 await page.waitForFunction(()=>window.__AXIS_CAPTURE__?.draft?.().photos?.length===1,undefined,{timeout:3000});
 await tap(page.locator('#v816CaptureDone'));
 await page.waitForFunction(()=>!document.querySelector('#reviewStage')?.classList.contains('hidden'),undefined,{timeout:2500});
 await tap(page.locator('#equipmentRow'));
 await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:2500});
 const pickerState=await page.evaluate(()=>{
  const visible=el=>!!el&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden'&&getComputedStyle(el).display!=='none';
  const mine=document.querySelector('#eqSheet [data-v8124-pick="axis-821-center-test"][data-v8124-kind="mine"]');
  const legacy=document.querySelector('#eqSheet [data-eq="axis-821-center-test"]');
  const list=document.querySelector('#eqList'),search=document.querySelector('#eqSearch'),context=document.querySelector('#v8124PickerContext');
  return{mineCount:document.querySelectorAll('#eqSheet [data-v8124-pick="axis-821-center-test"][data-v8124-kind="mine"]').length,mineVisible:visible(mine),contextVisible:visible(context),legacyCount:document.querySelectorAll('#eqSheet [data-eq="axis-821-center-test"]').length,legacyVisible:visible(legacy),listDisplay:list?getComputedStyle(list).display:null,listAria:list?.getAttribute('aria-hidden')??null,searchValue:search?.value??null};
 });
 console.log(`[AXIS 8.21 metric centering ${ENGINE}] Photo picker state ${JSON.stringify(pickerState)}`);
 assert.equal(pickerState.mineCount,1,'Photo Record visible 我的 custom Object entry missing');
 assert.equal(pickerState.contextVisible,true,`Photo Record picker context is not visible · ${JSON.stringify(pickerState)}`);
 assert.equal(pickerState.mineVisible,true,`Photo Record 我的 custom Object entry is not visible · ${JSON.stringify(pickerState)}`);
 const photoEq=page.locator('#eqSheet [data-v8124-pick="axis-821-center-test"][data-v8124-kind="mine"]');await tap(photoEq);
 await page.waitForFunction(()=>document.querySelector('#equipmentName')?.textContent?.trim()==='数字居中测试'&&document.querySelector('[data-axis818-metric="duration"]')&&document.querySelector('[data-axis818-metric="resistance"]'),undefined,{timeout:3500});
 assert.equal((await page.locator('#scanSheet .sheetHead>b').innerText()).trim(),'拍摄记录','Photo Record review lost capture identity');
 const photoPreset=page.locator('[data-axis821-preset="duration"][data-value="45"]');assert.equal(await photoPreset.count(),1);await tap(photoPreset);await page.waitForFunction(()=>document.querySelector('[data-axis818-metric="duration"]')?.value==='45');await geometry('duration','Photo duration preset 45');
 const photoResistance=page.locator('[data-axis818-metric="resistance"]');await photoResistance.fill('12.5');await geometry('resistance','Photo resistance direct input 12.5');
 await tap(page.locator('#saveScan'));
 await page.waitForFunction(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return (c.active?.events||[]).some(e=>e.equipmentId==='axis-821-center-test')},undefined,{timeout:5000});
 const saved=await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');const e=(c.active?.events||[]).find(x=>x.equipmentId==='axis-821-center-test');return e&&{metrics:e.metrics,schema:e.metricSchemaSnapshot?.map(x=>x.key),frames:e.frameRefs?.length||0}});
 assert.deepEqual(saved?.schema,['duration','resistance']);assert.equal(saved?.metrics?.duration,45);assert.equal(saved?.metrics?.resistance,12.5);assert.ok(saved?.frames>=1,'Photo Record lost captured evidence');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.21 metric centering ${ENGINE}] PASS · Quick Record + Photo Record · visible 我的 Object picker path · numeric center <=0.5px independent of unit · preset/step/direct input · saved immutable facts`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
