import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN',reducedMotion:'no-preference'});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap({timeout:4500}):l.click({timeout:4500});
let armed=false,apiRequests=0;page.on('request',r=>{if(armed&&/\/api\//.test(new URL(r.url()).pathname))apiRequests++});

const seed=()=>page.evaluate(async()=>{
 const DAY=864e5,latest=new Date();latest.setHours(9,0,0,0);const t3=latest.getTime(),starts=[t3-14*DAY,t3-7*DAY,t3],sessions=[],meta={events:{}};
 const rows=[{w:30,r:10,frames:['F-ROW-FIRST']},{w:32.5,r:10,frames:[]},{w:35,r:12,frames:['F-ROW-LATEST']}];
 starts.forEach((start,i)=>{const eid=`row-${i+1}`;const event={id:eid,time:start+60000,kind:'strength',equipmentId:'row',name:'坐姿划船机',weight:rows[i].w,reps:rows[i].r,sets:3,muscles:['背部'],frameRefs:rows[i].frames};sessions.push({id:`session-${i+1}`,start,end:start+30*60000,events:[event]});meta.events[eid]={activity:{status:'finished',startedAt:start+10000,finishedAt:start+110000,intervals:[{start:start+10000,end:start+110000}]}}});
 localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions,active:null,profile:{customEq:[]},prefs:{}}));
 localStorage.setItem('axis_v8_meta',JSON.stringify(meta));
 const store=window.__AXIS_MEDIA_STORE__;if(!store?.put)throw new Error('canonical-media-store-unavailable');
 const svg=(label,bg)=>new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="${bg}"/><text x="32" y="210" fill="white" font-size="42">${label}</text></svg>`],{type:'image/svg+xml'});
 await store.put('F-ROW-FIRST',svg('FIRST','#20242b'));await store.put('F-ROW-LATEST',svg('LATEST','#303640'));
 window.dispatchEvent(new CustomEvent('axis:state-changed',{detail:{test:'823'}}));
});

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_822_EVOLUTION_REPLAY__?.selectionEvent==='axis:evolution-replay-selection'&&window.__AXIS_815_MEDIA_EVIDENCE__?.replaySelectionConsumer===true,undefined,{timeout:15000});
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.23');
 assert.equal(await page.evaluate(()=>window.__AXIS_ARCH__),'canonical-single-runtime');
 await seed();
 await tap(page.locator('nav.nav [data-view="insightsView"]'));
 await page.waitForFunction(()=>document.querySelector('#insightsView')?.classList.contains('active')&&document.querySelectorAll('.v813Node').length>=1,undefined,{timeout:5000});
 await tap(page.locator('.v813Node.selected'));
 await page.waitForFunction(()=>document.querySelector('#v813Activities .v813Activity[data-v814-key="row"]'),undefined,{timeout:3000});
 const rawBefore=await page.evaluate(()=>localStorage.getItem('axis_v60_state')),metaBefore=await page.evaluate(()=>localStorage.getItem('axis_v8_meta'));armed=true;
 await tap(page.locator('.v813Activity[data-v814-key="row"]'));
 await page.waitForFunction(()=>document.querySelector('#v822Replay')?.textContent.includes('1 / 3')&&document.querySelector('#v815Evidence .v815Overlay')?.textContent.includes('第1/3次'),undefined,{timeout:3000});
 assert.equal(await page.locator('#v815Evidence').getAttribute('data-axis-replay-evidence-linked'),'1');
 assert.equal(await page.locator('#v815Evidence').getAttribute('data-evidence-state'),'selected-with-media');
 assert.equal(await page.locator('#v815Evidence img').count(),1,'first Replay point must show first Encounter evidence');

 await tap(page.locator('#v822Replay [data-v822-step="1"]'));
 await page.waitForFunction(()=>document.querySelector('#v822Replay')?.textContent.includes('2 / 3')&&document.querySelector('#v815Evidence')?.dataset.evidenceState==='selected-without-media',undefined,{timeout:2200});
 const middle=(await page.locator('#v815Evidence').innerText()).trim();
 assert.ok(middle.includes('第2/3次')&&middle.includes('这一次没有留下影像证据'),`middle no-evidence truth missing: ${middle}`);
 assert.equal(await page.locator('#v815Evidence img,#v815Evidence video').count(),0,'middle no-evidence Encounter must not show another Encounter media');

 await tap(page.locator('#v822Replay [data-v822-index="2"]'));
 await page.waitForFunction(()=>document.querySelector('#v822Replay')?.textContent.includes('3 / 3')&&document.querySelector('#v815Evidence .v815Overlay')?.textContent.includes('第3/3次'),undefined,{timeout:2200});
 assert.equal(await page.locator('#v815Evidence').getAttribute('data-evidence-state'),'selected-with-media');

 // Evidence remains independently inspectable when the user explicitly chooses it.
 await tap(page.locator('#v815Evidence [data-v815-encounter="1"]'));
 await page.waitForFunction(()=>document.querySelector('#v815Evidence .v815Overlay')?.textContent.includes('第1/3次'),undefined,{timeout:1800});
 assert.ok((await page.locator('#v822Replay').innerText()).includes('3 / 3'),'manual Evidence inspection must not rewrite Replay chronology');
 assert.equal(await page.locator('#v815Evidence').getAttribute('data-axis-replay-evidence-linked'),null,'manual Evidence inspection must clear Replay linkage');

 // Any subsequent Replay choice re-anchors Evidence to the exact chronology point.
 await tap(page.locator('#v822Replay [data-v822-step="-1"]'));
 await page.waitForFunction(()=>document.querySelector('#v822Replay')?.textContent.includes('2 / 3')&&document.querySelector('#v815Evidence')?.dataset.evidenceState==='selected-without-media',undefined,{timeout:2200});
 assert.equal(await page.locator('#v815Evidence').getAttribute('data-axis-replay-evidence-linked'),'1');
 assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v60_state')),rawBefore,'8.23 interaction mutated canonical training storage');
 assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v8_meta')),metaBefore,'8.23 interaction mutated canonical metadata storage');
 assert.equal(apiRequests,0,'8.23 continuity triggered API ownership');
 const geometry=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:innerWidth,root:document.querySelector('#v814Object')?.getBoundingClientRect(),view:document.querySelector('#insightsView')?.getBoundingClientRect()}));
 assert.ok(geometry.scroll<=geometry.inner+1,`8.23 caused horizontal overflow ${geometry.scroll}/${geometry.inner}`);assert.ok(geometry.root&&geometry.view&&geometry.root.width<=geometry.view.width+1,'8.23 escaped Trends geometry');
 await page.emulateMedia({reducedMotion:'reduce'});await tap(page.locator('#v822Replay [data-v822-index="0"]'));await page.waitForFunction(()=>document.querySelector('#v815Evidence .v815Overlay')?.textContent.includes('第1/3次'),undefined,{timeout:1800});
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.23 Replay Evidence Continuity ${ENGINE}] PASS · exact Encounter evidence alignment · explicit selected no-evidence truth · manual inspection preserved · read-only/no-network · mobile-safe`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
