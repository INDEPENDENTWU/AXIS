import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core'),launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));
const tap=async l=>ENGINE==='webkit'?l.tap({timeout:5000}):l.click({timeout:5000});
try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 const now=Date.now();
 await page.evaluate(t=>{
  localStorage.clear();
  const event={id:'824-e1',equipmentId:'lat-pull',name:'多功能龙门架',pattern:'pull',kind:'strength',muscles:['背部'],effect:'',time:t-8000,sets:3,metrics:{},metricSchemaSnapshot:[{key:'weight',label:'重量',type:'weight',unit:'kg',step:2.5},{key:'reps',label:'次数',type:'reps',unit:'次',step:1}],metricSchemaVersionSnapshot:'8.21',executionModeSnapshot:'sets'};
  localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'824-s1',start:t-8000,events:[event]},flows:[],flowRun:null,profile:{customEq:[],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{'824-e1':{activity:{status:'active',startedAt:t-8000,lastResumedAt:t-8000,intervals:[{start:t-8000,end:null}],estimateMs:180000,completedSets:0,setDoneAt:[],restStartedAt:null},sets:[{weight:30,reps:10,state:'assumed',doneAt:null},{weight:30,reps:10,state:'assumed',doneAt:null},{weight:30,reps:10,state:'assumed',doneAt:null}]}},prefs:{}}));
 },now);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_ACTIVE_RUNTIME__?.owner==='v87',undefined,{timeout:15000});
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.24');
 await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show')&&document.querySelector('#axis824ActiveStageTactileStyle'),undefined,{timeout:5000});
 const initial=await page.evaluate(()=>{
  const host=document.querySelector('#v87Now'),dock=document.querySelector('#dock'),nav=document.querySelector('.nav'),style=document.querySelector('#axis824ActiveStageTactileStyle')?.textContent||'';
  return{meta:document.querySelector('#v87Meta')?.textContent||'',progress:document.querySelector('#axis821StageProgressText')?.textContent||'',style,dockShow:dock?.classList.contains('show'),dockZ:Number.parseInt(getComputedStyle(dock).zIndex)||0,navZ:Number.parseInt(getComputedStyle(nav).zIndex)||0,dockBefore:getComputedStyle(dock,'::before').content,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,hostParent:host?.parentElement?.id};
 });
 assert.equal(initial.hostParent,'activeHome');
 assert.equal(initial.progress,'第 1 / 3 组');
 assert.doesNotMatch(initial.meta,/组/,'set count must not be duplicated in time meta');
 assert.match(initial.meta,/预计\s*03:00/);
 assert.match(initial.meta,/剩余/);
 assert.equal(initial.dockShow,true);
 assert.ok(initial.dockZ>=46,`dock stacking ${initial.dockZ}`);
 assert.ok(initial.navZ>initial.dockZ,`nav/dock stacking ${initial.navZ}/${initial.dockZ}`);
 assert.notEqual(initial.dockBefore,'none','dock must own an opaque underlay plane');
 for(const token of ['axis824ActiveBreath','axis824RailGlint','translateY(2px) scale(.976)','captureDock.show:before','prefers-reduced-motion:reduce'])assert.ok(initial.style.includes(token),`8.24 tactile style missing ${token}`);
 assert.ok(initial.overflow<=1,`initial horizontal overflow ${initial.overflow}`);
 await tap(page.locator('#v87Primary'));
 await page.waitForFunction(()=>document.querySelector('#v87Now')?.dataset.done==='1'&&document.querySelector('#axis821StageProgressText')?.textContent==='第 2 / 3 组',undefined,{timeout:3000});
 assert.doesNotMatch(await page.locator('#v87Meta').innerText(),/组/);
 assert.equal(await page.locator('#axis821StageProgressText').innerText(),'第 2 / 3 组');
 const data=await page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['824-e1']?.activity);
 assert.equal(data.completedSets,1,'existing v87 complete-set owner must remain authoritative');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.24 Active Stage Tactile ${ENGINE}] PASS · single set-progress truth · tactile layer mounted · dock underlay/stacking sealed · v87 action truth preserved`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
