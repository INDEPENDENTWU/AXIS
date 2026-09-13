import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core'),launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));
const alpha=color=>{const m=String(color||'').match(/rgba?\(([^)]+)\)/i);if(!m)return NaN;const p=m[1].split(',').map(x=>x.trim());return p.length<4?1:Number(p[3])};
try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 const now=Date.now();
 await page.evaluate(t=>{
  localStorage.clear();
  const event={id:'8241-e1',equipmentId:'lat-pull',name:'多功能龙门架',pattern:'pull',kind:'strength',muscles:['背部'],effect:'',time:t-8000,sets:3,metrics:{},metricSchemaSnapshot:[{key:'weight',label:'重量',type:'weight',unit:'kg',step:2.5},{key:'reps',label:'次数',type:'reps',unit:'次',step:1}],metricSchemaVersionSnapshot:'8.21',executionModeSnapshot:'sets'};
  localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'8241-s1',start:t-8000,events:[event]},flows:[],flowRun:null,profile:{customEq:[],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{'8241-e1':{activity:{status:'active',startedAt:t-8000,lastResumedAt:t-8000,intervals:[{start:t-8000,end:null}],estimateMs:180000,completedSets:0,setDoneAt:[],restStartedAt:null},sets:[{weight:30,reps:10,state:'assumed',doneAt:null},{weight:30,reps:10,state:'assumed',doneAt:null},{weight:30,reps:10,state:'assumed',doneAt:null}]}},prefs:{}}));
 },now);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_ACTIVE_RUNTIME__?.owner==='v87',undefined,{timeout:15000});
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.24.1');
 await page.waitForFunction(()=>document.querySelector('#dock')?.classList.contains('show')&&document.querySelector('#axis824ActiveStageTactileStyle')&&document.querySelector('#axis8241DockOcclusionStyle'),undefined,{timeout:5000});
 const proof=await page.evaluate(()=>{
  const dock=document.querySelector('#dock'),before=getComputedStyle(dock,'::before'),dockStyle=getComputedStyle(dock),primary=document.querySelector('#dock .scanPrimary'),quick=document.querySelector('#dock .v8QuickBtn'),oldStyle=document.querySelector('#axis824ActiveStageTactileStyle'),patchStyle=document.querySelector('#axis8241DockOcclusionStyle');
  const patchAfterOld=!!(oldStyle&&patchStyle&&(oldStyle.compareDocumentPosition(patchStyle)&Node.DOCUMENT_POSITION_FOLLOWING));
  return{
   contain:dockStyle.contain,
   dockBackground:dockStyle.backgroundColor,
   beforeContent:before.content,
   beforeZ:before.zIndex,
   beforeTop:Number.parseFloat(before.top),
   beforeBottom:Number.parseFloat(before.bottom),
   beforeBackground:before.backgroundColor,
   beforeImage:before.backgroundImage,
   primaryZ:Number.parseInt(getComputedStyle(primary).zIndex)||0,
   quickZ:Number.parseInt(getComputedStyle(quick).zIndex)||0,
   patchText:patchStyle?.textContent||'',
   patchAfterOld,
   overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
  };
 });
 assert.equal(String(proof.contain),'none',`fixed dock containment must be fully retired: ${proof.contain}`);
 assert.equal(alpha(proof.dockBackground),1,`dock background must be opaque: ${proof.dockBackground}`);
 assert.notEqual(proof.beforeContent,'none','opaque overscan curtain missing');
 assert.equal(String(proof.beforeZ),'0',`overscan z-index must be 0: ${proof.beforeZ}`);
 assert.ok(proof.beforeTop<=-16,`overscan top must cover above dock: ${proof.beforeTop}`);
 assert.ok(proof.beforeBottom<=-6,`overscan bottom must cover dock edge: ${proof.beforeBottom}`);
 assert.equal(alpha(proof.beforeBackground),1,`overscan must be opaque: ${proof.beforeBackground}`);
 assert.equal(proof.beforeImage,'none',`translucent gradient survived: ${proof.beforeImage}`);
 assert.ok(proof.primaryZ>0&&proof.quickZ>0,`controls must remain above occlusion plane: ${proof.primaryZ}/${proof.quickZ}`);
 assert.equal(proof.patchAfterOld,true,'8.24.1 override must mount after 8.24 tactile style');
 assert.ok(/contain:none!important/.test(proof.patchText),'patch CSS must explicitly retire containment');
 assert.ok(!/contain:[^;}]*paint/.test(proof.patchText),'patch CSS reintroduced paint clipping');
 assert.ok(!/linear-gradient/.test(proof.patchText),'patch CSS reintroduced translucent curtain');
 assert.ok(proof.overflow<=1,`horizontal overflow ${proof.overflow}`);
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.24.1 Dock Occlusion ${ENGINE}] PASS · opaque dock + 16px overscan · containment none · no translucent hairline window`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
