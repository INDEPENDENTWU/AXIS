import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core'),launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));
try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 const t=Date.now();
 await page.evaluate(now=>{
  localStorage.clear();
  const event={id:'825-e1',equipmentId:'lat-pull',name:'高位下拉',pattern:'pull',kind:'strength',muscles:['背部'],effect:'',time:now-9000,sets:4,metrics:{},metricSchemaSnapshot:[{key:'weight',label:'重量',type:'weight',unit:'kg',step:2.5},{key:'reps',label:'次数',type:'reps',unit:'次',step:1}],metricSchemaVersionSnapshot:'8.21',executionModeSnapshot:'sets'};
  localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'825-s1',start:now-9000,events:[event]},flows:[],flowRun:null,profile:{customEq:[],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{'825-e1':{activity:{status:'active',startedAt:now-9000,lastResumedAt:now-9000,intervals:[{start:now-9000,end:null}],estimateMs:240000,completedSets:0,setDoneAt:[],restStartedAt:null},sets:[0,1,2,3].map(()=>({weight:35,reps:10,state:'assumed',doneAt:null}))}},prefs:{}}));
 },t);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_ACTIVE_RUNTIME__?.owner==='v87',undefined,{timeout:15000});
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.25');
 await page.waitForFunction(()=>document.querySelector('#v87Now.axis821ActiveStage.show')&&document.querySelector('#axis825SetLockStyle'),undefined,{timeout:6000});
 assert.equal((await page.locator('#axis821StageProgressText').textContent())?.trim(),'第 1 / 4 组');
 assert.ok(!(await page.locator('#v87Meta').textContent())?.includes('组'),'time meta duplicated set progress');
 await page.locator('#v87Primary').click();
 await page.waitForFunction(()=>document.querySelector('#axis825SetLock')?.classList.contains('show'),undefined,{timeout:1500});
 const proof=await page.evaluate(()=>{
  const o=document.querySelector('#axis825SetLock'),n=o?.querySelector('.axis825SetLockNumber'),total=o?.querySelector('.axis825SetLockTotal'),host=document.querySelector('#v87Now'),style=document.querySelector('#axis825SetLockStyle');
  const meta=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}');
  return{number:n?.textContent,total:total?.textContent,font:Number.parseFloat(getComputedStyle(n).fontSize),pointer:getComputedStyle(o).pointerEvents,dx:getComputedStyle(o).getPropertyValue('--axis825-dx').trim(),dy:getComputedStyle(o).getPropertyValue('--axis825-dy').trim(),recoil:host?.classList.contains('axis825-lock-recoil'),completed:meta.events?.['825-e1']?.activity?.completedSets,style:style?.textContent||'',overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
 });
 assert.equal(proof.number,'01');assert.equal(proof.total,'/ 04');assert.ok(proof.font>=80,`Set Lock numeral too small: ${proof.font}`);assert.equal(proof.pointer,'none');assert.equal(proof.completed,1,'factual completedSets must increment exactly once');assert.equal(proof.recoil,true,'Active stage recoil missing');assert.ok(/px$/.test(proof.dx)&&/px$/.test(proof.dy),'progress-collapse vector missing');
 for(const marker of ['axis825NumberLand','axis825SetToProgress','axis825Pressure','axis825ClampL','prefers-reduced-motion:reduce'])assert.ok(proof.style.includes(marker),`motion marker missing ${marker}`);
 assert.ok(proof.overflow<=1,`horizontal overflow ${proof.overflow}`);
 assert.equal((await page.locator('#axis821StageProgressText').textContent())?.trim(),'第 2 / 4 组');
 await page.waitForFunction(()=>document.querySelector('#axis825SetLock')?.classList.contains('collapse'),undefined,{timeout:1300});
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.25 Set Lock ${ENGINE}] PASS · 01 / 04 large lock · clamp/pressure/recoil · collapses into 第 2 / 4 组 · one factual completion`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
