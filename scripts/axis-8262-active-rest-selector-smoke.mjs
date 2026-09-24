import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core'),launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN',reducedMotion:'no-preference'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));
const tap=async l=>ENGINE==='webkit'?l.tap({timeout:5000}):l.click({timeout:5000});
try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 const t=Date.now();
 await page.evaluate(now=>{
  localStorage.clear();
  const event={id:'8262-rest-e1',equipmentId:'chest',name:'胸推',pattern:'push',kind:'strength',muscles:['胸肌'],effect:'',time:now-70000,sets:4,metrics:{},metricSchemaSnapshot:[{key:'weight',label:'重量',type:'weight',unit:'kg',step:2.5},{key:'reps',label:'次数',type:'reps',unit:'次',step:1}],metricSchemaVersionSnapshot:'8.21',executionModeSnapshot:'sets'};
  localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'8262-rest-session',start:now-70000,events:[event]},flows:[],flowRun:null,profile:{customEq:[],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{'8262-rest-e1':{activity:{status:'active',startedAt:now-70000,lastResumedAt:now-70000,intervals:[{start:now-70000,end:null}],estimateMs:240000,completedSets:1,setDoneAt:[now-32000],restStartedAt:null,restAccumulatedMs:0,restNotified:false},sets:[{weight:35,reps:10,state:'done',doneAt:now-32000},{weight:35,reps:10,state:'assumed',doneAt:null},{weight:35,reps:10,state:'assumed',doneAt:null},{weight:35,reps:10,state:'assumed',doneAt:null}]}},prefs:{}}));
 },t);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_RELEASE__==='8.26.2'&&window.__AXIS_CORE_INTERACTIVE__===true&&document.querySelector('#v87Now.axis821ActiveStage.show .v87Rest'),undefined,{timeout:15000});
 assert.equal(await page.locator('#v87Now.axis821ActiveStage .v87-restline').count(),0,'historical rest node unexpectedly entered DOM');

 /* Running has one Active status and no rest component, including no blank pill. */
 const running=await page.evaluate(()=>{const host=document.querySelector('#v87Now.axis821ActiveStage'),rest=host?.querySelector('.v87Rest'),state=host?.querySelector('.v87State'),s=rest?getComputedStyle(rest):null,ss=state?getComputedStyle(state):null;return{status:host?.dataset.status||'',restText:rest?.textContent?.trim()||'',restDisplay:s?.display||'',restWidth:rest?.getBoundingClientRect().width||0,restHeight:rest?.getBoundingClientRect().height||0,restBackground:s?.backgroundColor||'',restShadow:s?.boxShadow||'',stateText:state?.textContent?.trim()||'',stateDisplay:ss?.display||'',overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}});
 assert.equal(running.status,'active');
 assert.equal(running.restDisplay,'none','running must not render a rest component');
 assert.ok(running.restWidth<=0.5&&running.restHeight<=0.5,`running rest placeholder still occupies geometry ${running.restWidth}x${running.restHeight}`);
 assert.notEqual(running.stateDisplay,'none','running Active state disappeared');
 assert.ok(running.stateText.length>0,'running Active state is empty');
 assert.ok(running.overflow<=1,`running horizontal overflow ${running.overflow}`);

 /* Pausing reuses the existing v87 timer truth as one restrained Active state line. */
 await tap(page.locator('#v87Toggle'));
 await page.waitForFunction(()=>{const a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['8262-rest-e1']?.activity;return a?.status==='paused'&&Number(a?.restStartedAt)>0},undefined,{timeout:2500});
 await page.waitForFunction(()=>/休息\s*\d+:\d{2}/.test(document.querySelector('#v87Now .v87Rest')?.textContent||''),undefined,{timeout:2500});
 const paused=await page.evaluate(()=>{const host=document.querySelector('#v87Now.axis821ActiveStage'),rest=host?.querySelector('.v87Rest'),state=host?.querySelector('.v87State'),s=getComputedStyle(rest),ss=getComputedStyle(state),a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['8262-rest-e1']?.activity;return{text:rest?.textContent?.trim()||'',display:s.display,minHeight:parseFloat(s.minHeight)||0,radius:parseFloat(s.borderRadius)||0,background:s.backgroundColor,boxShadow:s.boxShadow,animationName:s.animationName,pointer:s.pointerEvents,stateDisplay:ss.display,status:host?.dataset.status||'',truthStatus:a?.status||'',restStartedAt:Number(a?.restStartedAt)||0,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}});
 assert.match(paused.text,/休息\s*\d+:\d{2}/,'pause-owned rest timer did not remain factual');
 assert.equal(paused.display,'block','rest state must read as a plain state line');
 assert.ok(paused.minHeight<=1,`rest state retained pill min-height ${paused.minHeight}`);
 assert.ok(paused.radius<=1,`rest state retained pill radius ${paused.radius}`);
 assert.equal(paused.background,'rgba(0, 0, 0, 0)','rest state retained a tonal pill background');
 assert.equal(paused.boxShadow,'none','rest state retained a pill boundary');
 assert.equal(paused.animationName,'none','rest state retained component-entry motion');
 assert.equal(paused.pointer,'none','rest state unexpectedly became interactive');
 assert.equal(paused.stateDisplay,'none','paused state is duplicated by a second status label');
 assert.equal(paused.status,'paused');assert.equal(paused.truthStatus,'paused');assert.ok(paused.restStartedAt>0);
 assert.ok(paused.overflow<=1,`paused horizontal overflow ${paused.overflow}`);

 /* Resume returns to one Running state with zero residual rest geometry. */
 await tap(page.locator('#v87Toggle'));
 await page.waitForFunction(()=>{const a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['8262-rest-e1']?.activity;return a?.status==='active'&&!a?.restStartedAt&&Number(a?.restAccumulatedMs)>0},undefined,{timeout:2500});
 const resumed=await page.evaluate(()=>{const host=document.querySelector('#v87Now.axis821ActiveStage'),rest=host?.querySelector('.v87Rest'),s=getComputedStyle(rest),a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['8262-rest-e1']?.activity;return{status:a?.status,restStartedAt:a?.restStartedAt||null,restAccumulatedMs:Number(a?.restAccumulatedMs)||0,host:host?.dataset.status,display:s.display,width:rest?.getBoundingClientRect().width||0,height:rest?.getBoundingClientRect().height||0}});
 assert.equal(resumed.status,'active');assert.equal(resumed.restStartedAt,null);assert.ok(resumed.restAccumulatedMs>0);assert.equal(resumed.host,'active');
 assert.equal(resumed.display,'none');assert.ok(resumed.width<=0.5&&resumed.height<=0.5,'rest geometry survived resume');

 await page.emulateMedia({reducedMotion:'reduce'});await tap(page.locator('#v87Toggle'));
 await page.waitForFunction(()=>document.querySelector('#v87Now.axis821ActiveStage')?.dataset.status==='paused',undefined,{timeout:2500});
 const reduced=await page.evaluate(()=>{const x=document.querySelector('#v87Now.axis821ActiveStage .v87Rest'),s=getComputedStyle(x);return{animationName:s.animationName,transition:s.transitionDuration,pointer:s.pointerEvents,display:s.display}});
 assert.equal(reduced.animationName,'none');assert.ok(reduced.transition==='0s'||reduced.transition.split(',').every(x=>x.trim()==='0s'),'reduced-motion rest transition survived');assert.equal(reduced.pointer,'none');assert.equal(reduced.display,'block');
 const source=await page.evaluate(()=>fetch('/axis-style.css').then(r=>r.text()));
 assert.match(source,/\[data-status="active"\] \.v87Rest\{display:none!important/);
 assert.match(source,/\[data-status="paused"\] \.axis821StageStatus \.v87State\{display:none!important/);
 assert.match(source,/\[data-status="paused"\] \.v87Rest\{box-sizing:border-box!important;display:block!important/);
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.26.2 Active Rest Convergence ${ENGINE}] PASS · running has zero rest component · paused rest is one factual non-interactive state line · existing v87 timer truth preserved · reduced-motion safe`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
