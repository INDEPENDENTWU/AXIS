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
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{'8262-rest-e1':{activity:{status:'active',startedAt:now-70000,lastResumedAt:now-70000,intervals:[{start:now-70000,end:null}],estimateMs:240000,completedSets:1,setDoneAt:[now-32000],restStartedAt:now-30000,restNotified:false},sets:[{weight:35,reps:10,state:'done',doneAt:now-32000},{weight:35,reps:10,state:'assumed',doneAt:null},{weight:35,reps:10,state:'assumed',doneAt:null},{weight:35,reps:10,state:'assumed',doneAt:null}]}},prefs:{}}));
 },t);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_RELEASE__==='8.26.2'&&window.__AXIS_CORE_INTERACTIVE__===true&&document.querySelector('#v87Now.axis821ActiveStage.show .v87Rest'),undefined,{timeout:15000});
 assert.equal(await page.locator('#v87Now.axis821ActiveStage .v87-restline').count(),0,'non-existent historical rest node unexpectedly entered DOM');
 const live=await page.evaluate(()=>{const x=document.querySelector('#v87Now.axis821ActiveStage .v87Rest'),s=getComputedStyle(x),host=document.querySelector('#v87Now');return{text:x?.textContent?.trim()||'',display:s.display,marginTop:parseFloat(s.marginTop),minHeight:parseFloat(s.minHeight),radius:parseFloat(s.borderRadius),background:s.backgroundColor,boxShadow:s.boxShadow,animationName:s.animationName,pointer:s.pointerEvents,status:host?.dataset.status||'',overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}});
 assert.match(live.text,/休息/,'canonical v87Rest did not render the active rest timer');
 assert.equal(live.display,'flex','canonical v87Rest did not receive the intended grouped presentation');
 assert.ok(live.marginTop>=11,`rest spacing not applied: ${live.marginTop}`);assert.ok(live.minHeight>=33,`rest min-height not applied: ${live.minHeight}`);assert.ok(live.radius>=16,`rest pill radius not applied: ${live.radius}`);
 assert.notEqual(live.background,'rgba(0, 0, 0, 0)','rest tonal background is transparent');assert.notEqual(live.boxShadow,'none','rest tonal boundary missing');assert.equal(live.animationName,'axis826RestStateIn','rest transition is not bound to canonical node');assert.equal(live.status,'active');assert.ok(live.overflow<=1,`horizontal overflow ${live.overflow}`);

 /* Presentation binding must not take ownership of pause/resume truth. */
 await tap(page.locator('#v87Toggle'));
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['8262-rest-e1']?.activity?.status==='paused',undefined,{timeout:2500});
 let paused=await page.evaluate(()=>({status:JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['8262-rest-e1']?.activity?.status,text:document.querySelector('#v87Now .v87Rest')?.textContent?.trim(),host:document.querySelector('#v87Now')?.dataset.status}));
 assert.deepEqual(paused,{status:'paused',text:'实际时间已暂停',host:'paused'});
 await tap(page.locator('#v87Toggle'));
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['8262-rest-e1']?.activity?.status==='active',undefined,{timeout:2500});

 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(50);
 const reduced=await page.evaluate(()=>{const x=document.querySelector('#v87Now.axis821ActiveStage .v87Rest'),s=getComputedStyle(x);return{animationName:s.animationName,pointer:s.pointerEvents,display:s.display}});
 assert.equal(reduced.animationName,'none','reduced-motion did not disable rest transition');assert.equal(reduced.pointer,'auto','rest status text unexpectedly became an action');assert.equal(reduced.display,'flex');
 const source=await page.evaluate(()=>fetch('/axis-style.css').then(r=>r.text()));assert.match(source,/#v87Now\.axis821ActiveStage \.v87Rest\{margin-top:12px!important/);assert.match(source,/\.v87Rest\{animation:none!important/);
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.26.2 Active Rest Selector ${ENGINE}] PASS · canonical v87Rest receives spacing/pill/motion · no historical DOM node · v87 pause/resume truth unchanged · reduced-motion safe`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
