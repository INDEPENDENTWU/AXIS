import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:417,height:896},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
await page.route('**/api/cloud-status**',r=>json(r,{cloud:{configured:false,enabled:false}}));
await page.route('**/api/ai-capabilities**',r=>json(r,{ai:{enabled:false,capabilities:{vision:false,insight:false,voice:false,dialogue:false}}}));
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}]])await page.route(pattern,r=>json(r,obj));
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:9000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:12000});await page.waitForFunction(()=>window.__AXIS_8124_QUICK_FLOW__?.version==='8.12.4',undefined,{timeout:7000})};
const probe=()=>page.evaluate(()=>{const persisted=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),finish=document.querySelector('#finishSheet'),done=document.querySelector('#finishDone'),hero=document.querySelector('#axisNowHero');return{persisted:{active:persisted.active?{id:persisted.active.id,start:persisted.active.start,end:persisted.active.end}:null,first:persisted.sessions?.[0]?{id:persisted.sessions[0].id,start:persisted.sessions[0].start,end:persisted.sessions[0].end}:null},home:window.__AXIS_HOME_STATE__||null,dom:{activeHomeHidden:document.querySelector('#activeHome')?.classList.contains('hidden'),idleHomeHidden:document.querySelector('#idleHome')?.classList.contains('hidden'),heroHidden:hero?.hidden,heroScope:hero?.dataset.scope||'',heroMode:hero?.dataset.mode||'',heroMeta:document.querySelector('#axisNowMeta')?.textContent||'',finishShow:!!finish?.classList.contains('show'),finishDisplay:finish?getComputedStyle(finish).display:'',finishDoneRects:done?.getClientRects().length||0}}});

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.evaluate(()=>{const t=Date.now();localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'FIN-DIAG',start:t-25*60000,events:[{id:'F1',equipmentId:'elliptical',name:'椭圆机',kind:'cardio',pattern:'cardio',muscles:['心肺'],time:t-24*60000,duration:30,intensity:5}]},profile:{customEq:[],memories:[]},prefs:{}}));localStorage.setItem('axis_v8_meta',JSON.stringify({prefs:{},events:{F1:{activity:{status:'active',startedAt:t-24*60000,lastResumedAt:t-5*60000,finishedAt:null,pausedAt:null,estimateMs:30*60000,intervals:[{start:t-24*60000,end:t-12*60000},{start:t-5*60000,end:null}],completedSets:0,setDoneAt:[],restStartedAt:null,actualMs:null}}}}))});
 await page.reload({waitUntil:'domcontentloaded'});await ready();
 const hold=page.locator('#finishHold'),box=await hold.boundingBox();assert.ok(box,'finishHold not measurable');const point={x:box.x+box.width/2,y:box.y+box.height/2};
 const hit=await page.evaluate(({x,y})=>{const el=document.elementFromPoint(x,y);return{id:el?.id||'',tag:el?.tagName||'',closestFinishHold:!!el?.closest?.('#finishHold'),closestV87Finish:!!el?.closest?.('#v87Finish') }},point);
 console.log(`[AXIS 8.12.4 ${ENGINE} finish diagnostic] hit ${JSON.stringify(hit)}`);assert.equal(hit.closestFinishHold,true,`finishHold center intercepted: ${JSON.stringify(hit)}`);
 await page.mouse.move(point.x,point.y);await page.mouse.down();try{await page.waitForFunction(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return !c.active&&c.sessions?.[0]?.end>c.sessions?.[0]?.start},undefined,{timeout:3500})}finally{await page.mouse.up().catch(()=>{})}
 await page.waitForTimeout(180);let first=await probe();console.log(`[AXIS 8.12.4 ${ENGINE} finish diagnostic] after-hold ${JSON.stringify(first)}`);
 if(first.dom.finishDoneRects){await page.locator('#finishDone').click({timeout:1200}).catch(e=>console.log(`[AXIS 8.12.4 ${ENGINE} finish diagnostic] finishDone click ${String(e.message||e)}`))}
 await page.waitForTimeout(1500);const final=await probe();console.log(`[AXIS 8.12.4 ${ENGINE} finish diagnostic] settled ${JSON.stringify(final)}`);
 assert.ok(final.persisted.first?.end>final.persisted.first?.start,'persisted session bounds collapsed');
 assert.equal(final.dom.activeHomeHidden,true,`legacy active Home still visible after persisted completion: ${JSON.stringify(final)}`);
 assert.equal(final.dom.idleHomeHidden,false,`legacy idle Home did not become visible after persisted completion: ${JSON.stringify(final)}`);
 assert.equal(final.home?.scope,'complete',`canonical Home did not converge to complete: ${JSON.stringify(final)}`);
 assert.match(final.home?.meta||'',/开始\s+\d\d:\d\d/,'canonical Home missing start fact');
 assert.match(final.home?.meta||'',/完成\s+\d\d:\d\d/,'canonical Home missing completion fact');
 console.log(`[AXIS 8.12.4 ${ENGINE} finish diagnostic] PASS`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
