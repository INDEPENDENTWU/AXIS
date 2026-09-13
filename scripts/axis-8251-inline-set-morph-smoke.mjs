import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core'),launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));
const overlaps=(a,b)=>a&&b&&Math.max(a.left,b.left)<Math.min(a.right,b.right)&&Math.max(a.top,b.top)<Math.min(a.bottom,b.bottom);
try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 const t=Date.now();
 await page.evaluate(now=>{
  localStorage.clear();
  const event={id:'8251-e1',equipmentId:'lat-pull',name:'高位下拉',pattern:'pull',kind:'strength',muscles:['背部'],effect:'',time:now-9000,sets:4,metrics:{},metricSchemaSnapshot:[{key:'weight',label:'重量',type:'weight',unit:'kg',step:2.5},{key:'reps',label:'次数',type:'reps',unit:'次',step:1}],metricSchemaVersionSnapshot:'8.21',executionModeSnapshot:'sets'};
  localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'8251-s1',start:now-9000,events:[event]},flows:[],flowRun:null,profile:{customEq:[],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{'8251-e1':{activity:{status:'active',startedAt:now-9000,lastResumedAt:now-9000,intervals:[{start:now-9000,end:null}],estimateMs:240000,completedSets:0,setDoneAt:[],restStartedAt:null},sets:[0,1,2,3].map(()=>({weight:35,reps:10,state:'assumed',doneAt:null}))}},prefs:{}}));
 },t);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_ACTIVE_RUNTIME__?.owner==='v87',undefined,{timeout:15000});
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.25.1');
 await page.waitForFunction(()=>document.querySelector('#v87Now.axis821ActiveStage.show')&&document.querySelector('#axis8251InlineSetMorphStyle'),undefined,{timeout:6000});
 const before=await page.evaluate(()=>{const host=document.querySelector('#v87Now');return{h:host.getBoundingClientRect().height,progress:document.querySelector('#axis821StageProgressText')?.textContent?.trim(),oldDisplay:getComputedStyle(document.querySelector('#axis825SetLock')||document.body).display}});
 assert.equal(before.progress,'第 1 / 4 组');
 await page.locator('#v87Primary').click();
 await page.waitForFunction(()=>document.querySelector('.axis821StageFact')?.classList.contains('axis8251-locking'),undefined,{timeout:1500});
 const proof=await page.evaluate(()=>{
  const host=document.querySelector('#v87Now'),fact=host.querySelector('.axis821StageFact'),moment=fact.querySelector('.axis8251SetMoment'),clock=host.querySelector('.axis821StageClock'),primary=host.querySelector('#v87Primary'),toggle=host.querySelector('#v87Toggle'),old=document.querySelector('#axis825SetLock'),meta=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),rect=e=>{const r=e.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
  return{hostH:host.getBoundingClientRect().height,momentText:moment?.textContent?.replace(/\s+/g,' ').trim(),moment:rect(moment),fact:rect(fact),clock:rect(clock),primary:rect(primary),toggle:rect(toggle),position:getComputedStyle(moment).position,pointer:getComputedStyle(moment).pointerEvents,oldDisplay:old?getComputedStyle(old).display:'none',completed:meta.events?.['8251-e1']?.activity?.completedSets,style:document.querySelector('#axis8251InlineSetMorphStyle')?.textContent||'',overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
 });
 assert.equal(proof.completed,1,'factual completedSets must increment exactly once');
 assert.match(proof.momentText,/01 \/ 04/);assert.match(proof.momentText,/已完成/);
 assert.equal(proof.position,'static','completion moment must remain in normal stage grid');assert.equal(proof.pointer,'none');assert.equal(proof.oldDisplay,'none','legacy full-screen overlay must stay retired');
 assert.ok(proof.moment.top>=proof.fact.top-1&&proof.moment.bottom<=proof.fact.bottom+1,'completion moment must stay inside fact row');
 assert.equal(overlaps(proof.moment,proof.clock),false,'completion moment overlapped clock');assert.equal(overlaps(proof.moment,proof.primary),false,'completion moment overlapped primary control');assert.equal(overlaps(proof.moment,proof.toggle),false,'completion moment overlapped secondary control');
 assert.ok(Math.abs(proof.hostH-before.h)<=1.5,`stage geometry jumped ${before.h} -> ${proof.hostH}`);assert.ok(proof.overflow<=1,`horizontal overflow ${proof.overflow}`);
 for(const marker of ['axis8251InlineLand','axis8251RailLock','axis8251PrimaryReturn','prefers-reduced-motion:reduce'])assert.ok(proof.style.includes(marker),`motion marker missing ${marker}`);
 assert.equal((await page.locator('#axis821StageProgressText').textContent())?.trim(),'第 2 / 4 组');
 await page.waitForFunction(()=>!document.querySelector('.axis821StageFact')?.classList.contains('axis8251-locking'),undefined,{timeout:1500});
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.25.1 Inline Set Morph ${ENGINE}] PASS · in-stage 01 / 04 completion · no timer/control overlap · stable geometry · one factual completion`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
