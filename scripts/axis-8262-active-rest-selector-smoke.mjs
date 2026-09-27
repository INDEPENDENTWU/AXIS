import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core'),launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN',reducedMotion:'no-preference'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));
const tap=async l=>ENGINE==='webkit'?l.tap({timeout:5000}):l.click({timeout:5000});
const waitRelease=()=>page.waitForFunction(()=>window.__AXIS_RELEASE__==='8.26.3'&&window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:15000});
try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 const t=Date.now();
 await page.evaluate(now=>{
  localStorage.clear();
  const event={id:'8263-rest-e1',equipmentId:'chest',name:'胸推',pattern:'push',kind:'strength',muscles:['胸肌'],effect:'',time:now-70000,sets:4,metrics:{},metricSchemaSnapshot:[{key:'weight',label:'重量',type:'weight',unit:'kg',step:2.5},{key:'reps',label:'次数',type:'reps',unit:'次',step:1}],metricSchemaVersionSnapshot:'8.21',executionModeSnapshot:'sets'};
  localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'8263-rest-session',start:now-70000,events:[event]},flows:[],flowRun:null,profile:{customEq:[],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{'8263-rest-e1':{activity:{status:'active',startedAt:now-70000,lastResumedAt:now-70000,intervals:[{start:now-70000,end:null}],estimateMs:240000,completedSets:1,setDoneAt:[now-32000],restStartedAt:null,restAccumulatedMs:0,restNotified:false},sets:[{weight:35,reps:10,state:'done',doneAt:now-32000},{weight:35,reps:10,state:'assumed',doneAt:null},{weight:35,reps:10,state:'assumed',doneAt:null},{weight:35,reps:10,state:'assumed',doneAt:null}]}},prefs:{}}));
 },t);
 await page.reload({waitUntil:'domcontentloaded'});await waitRelease();
 await page.waitForFunction(()=>document.querySelector('#v87Now.axis821ActiveStage.show .v87Rest'),undefined,{timeout:5000});
 assert.equal(await page.locator('#v87Now.axis821ActiveStage .v87-restline').count(),0,'historical rest node unexpectedly entered DOM');

 const running=await page.evaluate(()=>{const host=document.querySelector('#v87Now.axis821ActiveStage'),rest=host?.querySelector('.v87Rest'),state=host?.querySelector('.v87State'),s=rest?getComputedStyle(rest):null,ss=state?getComputedStyle(state):null;return{status:host?.dataset.status||'',restDisplay:s?.display||'',restWidth:rest?.getBoundingClientRect().width||0,restHeight:rest?.getBoundingClientRect().height||0,stateText:state?.textContent?.trim()||'',stateDisplay:ss?.display||'',overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}});
 assert.equal(running.status,'active');assert.equal(running.restDisplay,'none');assert.ok(running.restWidth<=0.5&&running.restHeight<=0.5,`running rest placeholder still occupies ${running.restWidth}x${running.restHeight}`);assert.notEqual(running.stateDisplay,'none');assert.ok(running.stateText.length>0);assert.ok(running.overflow<=1);

 await tap(page.locator('#v87Toggle'));
 await page.waitForFunction(()=>{const a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['8263-rest-e1']?.activity;return a?.status==='paused'&&Number(a?.restStartedAt)>0},undefined,{timeout:2500});
 await page.waitForFunction(()=>/休息\s*\d+:\d{2}/.test(document.querySelector('#v87Now .v87Rest')?.textContent||''),undefined,{timeout:2500});
 const paused=await page.evaluate(()=>{const host=document.querySelector('#v87Now.axis821ActiveStage'),rest=host?.querySelector('.v87Rest'),state=host?.querySelector('.v87State'),s=getComputedStyle(rest),ss=getComputedStyle(state),a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['8263-rest-e1']?.activity;return{text:rest?.textContent?.trim()||'',display:s.display,height:rest?.getBoundingClientRect().height||0,minHeight:parseFloat(s.minHeight)||0,radius:parseFloat(s.borderRadius)||0,background:s.backgroundColor,boxShadow:s.boxShadow,animationName:s.animationName,pointer:s.pointerEvents,stateDisplay:ss.display,status:host?.dataset.status||'',truthStatus:a?.status||'',restStartedAt:Number(a?.restStartedAt)||0,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}});
 assert.match(paused.text,/休息\s*\d+:\d{2}/);assert.equal(paused.display,'flex');assert.ok(Math.abs(paused.height-32)<=0.75,`paused rail height ${paused.height}`);assert.ok(paused.minHeight>=31&&paused.minHeight<=33,`paused min-height ${paused.minHeight}`);assert.ok(paused.radius<=1);assert.equal(paused.background,'rgba(0, 0, 0, 0)');assert.equal(paused.boxShadow,'none');assert.equal(paused.animationName,'none');assert.equal(paused.pointer,'none');assert.equal(paused.stateDisplay,'none');assert.equal(paused.status,'paused');assert.equal(paused.truthStatus,'paused');assert.ok(paused.restStartedAt>0);assert.ok(paused.overflow<=1);

 /* Resume remains owned by v87 and removes every pixel of rest geometry. */
 await tap(page.locator('#v87Toggle'));
 await page.waitForFunction(()=>{const a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['8263-rest-e1']?.activity;return a?.status==='active'&&!a?.restStartedAt&&Number(a?.restAccumulatedMs)>0},undefined,{timeout:2500});
 const resumed=await page.evaluate(()=>{const host=document.querySelector('#v87Now.axis821ActiveStage'),rest=host?.querySelector('.v87Rest'),s=getComputedStyle(rest),a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['8263-rest-e1']?.activity;return{status:a?.status,restStartedAt:a?.restStartedAt||null,restAccumulatedMs:Number(a?.restAccumulatedMs)||0,host:host?.dataset.status,display:s.display,width:rest?.getBoundingClientRect().width||0,height:rest?.getBoundingClientRect().height||0}});
 assert.equal(resumed.status,'active');assert.equal(resumed.restStartedAt,null);assert.ok(resumed.restAccumulatedMs>0);assert.equal(resumed.host,'active');assert.equal(resumed.display,'none');assert.ok(resumed.width<=0.5&&resumed.height<=0.5,'rest geometry survived resume');

 /* Reduced motion keeps the same factual 32px paused rail. */
 await page.emulateMedia({reducedMotion:'reduce'});await tap(page.locator('#v87Toggle'));
 await page.waitForFunction(()=>document.querySelector('#v87Now.axis821ActiveStage')?.dataset.status==='paused',undefined,{timeout:2500});
 const reduced=await page.evaluate(()=>{const x=document.querySelector('#v87Now.axis821ActiveStage .v87Rest'),s=getComputedStyle(x);return{animationName:s.animationName,transition:s.transitionDuration,display:s.display,height:x?.getBoundingClientRect().height||0}});
 assert.equal(reduced.animationName,'none');assert.ok(reduced.transition==='0s'||reduced.transition.split(',').every(x=>x.trim()==='0s'),'reduced-motion transition survived');assert.equal(reduced.display,'flex');assert.ok(Math.abs(reduced.height-32)<=0.75);
 await page.emulateMedia({reducedMotion:'no-preference'});

 /* Rest Speak: reuse the proven isolated 8.9 preference/state shape and compare
    the same paused event before/after activation. This keeps the old geometry
    contract intact instead of making the new smoke depend on a novel seed. */
 await page.evaluate(()=>{
  const now=Date.now(),mk=(id,equipmentId,name,offset)=>({id,equipmentId,name,kind:'strength',time:now-offset,weight:20,reps:10,sets:1,muscles:['胸肌'],frameRefs:[]});
  const events=[mk('E89R1','lat','高位下拉',420000),mk('E89R2','row','坐姿划船',330000),mk('E89R3','chest','胸推',240000),mk('E89R4','legext','腿屈伸',150000),mk('E89R5','shoulder','肩推',90000)];
  const core={version:60,sessions:[],active:{id:'S89R',start:now-480000,events},selectedEq:null,frames:[],clip:null,stream:null,ai:null,profile:{name:'',height:'',weight:'',bodyFat:'',years:'',freq:3,goal:'',memories:[],customEq:[]},prefs:{keepClip:true,scanSeconds:3,watermark:{name:true,data:true,time:true,brand:true,pos:'bl',photoMode:'wm',videoMode:'wm'}}};
  const act=(status,start,end=null,restStartedAt=null)=>({status,startedAt:start,lastResumedAt:start,pausedAt:status==='paused'?(end||now-60000):null,finishedAt:status==='finished'?(end||now-60000):null,estimateMs:180000,completedSets:status==='finished'?1:(restStartedAt?1:0),intervals:[{start,end:status==='active'?null:(end||now-60000)}],restStartedAt,restAccumulatedMs:0});
  const meta={prefs:{v89SpeakEnabled:true,v89SpeakNative:'zh',v89SpeakTarget:'en'},events:{E89R1:{activity:act('finished',now-420000,now-360000),sets:[{state:'done',doneAt:now-360000}]},E89R2:{activity:act('paused',now-330000,now-300000),sets:[{state:'assumed',doneAt:null}]},E89R3:{activity:act('paused',now-240000,now-16000,now-16000),sets:[{state:'done',doneAt:now-16000},{state:'assumed',doneAt:null},{state:'assumed',doneAt:null}]},E89R4:{activity:act('paused',now-150000,now-120000),sets:[{state:'assumed',doneAt:null}]},E89R5:{activity:act('finished',now-90000,now-60000),sets:[{state:'done',doneAt:now-60000}]}}};
  localStorage.setItem('axis_v60_state',JSON.stringify(core));localStorage.setItem('axis_v8_meta',JSON.stringify(meta));localStorage.removeItem('axis_v89_speak');
 });
 await page.reload({waitUntil:'domcontentloaded'});await waitRelease();
 await page.waitForFunction(()=>document.querySelector('#v87Now.axis821ActiveStage.show #v87Rest')&&document.querySelector('#v87Now')?.dataset.status==='paused',undefined,{timeout:5000});
 assert.equal(await page.locator('#v87Rest.v89Speak').count(),0,'Rest Speak activated from training metadata instead of isolated preference');
 const plainSpeakSeed=await page.evaluate(()=>{const host=document.querySelector('#v87Now.axis821ActiveStage'),rest=host?.querySelector('#v87Rest'),s=getComputedStyle(rest);return{hostHeight:host?.getBoundingClientRect().height||0,restHeight:rest?.getBoundingClientRect().height||0,display:s.display,pointer:s.pointerEvents}});
 assert.ok(Math.abs(plainSpeakSeed.restHeight-32)<=0.75,`plain Rest Speak seed rail height ${plainSpeakSeed.restHeight}`);assert.equal(plainSpeakSeed.display,'flex');assert.equal(plainSpeakSeed.pointer,'none');

 await page.evaluate(()=>localStorage.setItem('axis_v89_speak',JSON.stringify({seen:{},current:null,prefs:{enabled:true,native:'zh',target:'en'}})));
 await page.reload({waitUntil:'domcontentloaded'});await waitRelease();
 await page.waitForFunction(()=>document.querySelector('#v87Now.axis821ActiveStage.show #v87Rest')?.classList.contains('v89Speak'),undefined,{timeout:5000});
 const speak=await page.evaluate(()=>{const host=document.querySelector('#v87Now.axis821ActiveStage'),rest=host?.querySelector('#v87Rest.v89Speak'),s=getComputedStyle(rest);return{height:rest?.getBoundingClientRect().height||0,hostHeight:host?.getBoundingClientRect().height||0,pointer:s.pointerEvents,display:s.display,target:rest?.querySelector('span')?.textContent||'',meaning:rest?.querySelector('small')?.textContent||'',overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}});
 assert.ok(Math.abs(speak.height-32)<=0.75,`Rest Speak rail height ${speak.height}`);assert.ok(Math.abs(speak.hostHeight-plainSpeakSeed.hostHeight)<=1.5,`Rest Speak changed Active geometry ${plainSpeakSeed.hostHeight} -> ${speak.hostHeight}`);assert.equal(speak.display,'flex');assert.equal(speak.pointer,'auto','inherited Rest Speak action was blocked');assert.ok(speak.target.length>4,'Rest Speak target missing');assert.ok(speak.meaning.length>1,'Rest Speak meaning missing');assert.ok(speak.overflow<=1);

 const source=await page.evaluate(()=>fetch('/axis-style.css').then(r=>r.text()));
 assert.match(source,/\[data-status="active"\] \.v87Rest\{display:none!important/);assert.match(source,/\[data-status="paused"\] \.v87Rest\{box-sizing:border-box!important;display:flex!important/);assert.match(source,/\.v87Rest\.v89Speak\{display:flex!important/);assert.match(source,/height:32px!important/);
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.26.3 Active Rest Convergence ${ENGINE}] PASS · zero running rest geometry · one 32px factual paused rail · Rest Speak geometry stable · inherited actions/truth preserved · reduced-motion safe`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
