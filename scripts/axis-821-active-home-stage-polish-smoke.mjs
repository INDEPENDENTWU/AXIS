import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});
for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));
const tap=async l=>ENGINE==='webkit'?l.tap({timeout:5000}):l.click({timeout:5000});
const intersects=(a,b)=>Math.max(a.left,b.left)<Math.min(a.right,b.right)&&Math.max(a.top,b.top)<Math.min(a.bottom,b.bottom);
try{
  assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
  const t=Date.now();
  await page.evaluate(now=>{
    localStorage.clear();
    const event={id:'polish-e1',equipmentId:'chest',name:'杠铃深蹲',pattern:'squat',kind:'strength',muscles:['腿'],effect:'',time:now-41000,sets:7,weight:60,reps:8,metrics:{weight:60,reps:8},metricSchemaSnapshot:[{key:'weight',label:'重量',type:'weight',unit:'kg',step:2.5},{key:'reps',label:'次数',type:'reps',unit:'次',step:1}],metricSchemaVersionSnapshot:'8.21',executionModeSnapshot:'sets'};
    localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'polish-s1',start:now-41000,events:[event]},flows:[],flowRun:null,profile:{customEq:[],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
    localStorage.setItem('axis_v8_meta',JSON.stringify({events:{'polish-e1':{activity:{status:'active',startedAt:now-41000,lastResumedAt:now-41000,intervals:[{start:now-41000,end:null}],estimateMs:1571000,completedSets:0,setDoneAt:[],restStartedAt:null},sets:Array.from({length:7},()=>({weight:60,reps:8,state:'assumed',doneAt:null}))}},prefs:{}}));
  },t);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_ACTIVE_RUNTIME__?.owner==='v87'&&window.__AXIS_821_ACTIVE_HOME_STAGE__?.presentation==='integrated-home-stage',undefined,{timeout:15000});
  await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show')&&document.querySelector('#v87Now')?.parentElement?.id==='activeHome',undefined,{timeout:5000});
  await page.waitForFunction(()=>document.querySelector('#axis821ActiveStageStyle')?.textContent?.includes('AXIS 8.21 Active Home Stage — flat native rail'),undefined,{timeout:3000});
  await page.waitForFunction(()=>document.querySelector('#v87AdjustBtn')&&document.querySelector('#dock')?.classList.contains('show'),undefined,{timeout:15000});
  await page.waitForTimeout(180);

  console.log(`[AXIS 8.21 Active Home polish ${ENGINE}] one flat execution hierarchy`);
  const g=await page.evaluate(()=>{
    const q=s=>document.querySelector(s),rect=s=>q(s)?.getBoundingClientRect().toJSON();
    const stage=q('#v87Now'),toggle=q('#v87Toggle'),primary=q('#v87Primary'),adjust=q('#v87AdjustBtn'),name=q('#v87Name'),clock=q('#axis821StageClock'),scan=q('#scanBtn'),quick=q('#quickRecordBtn');
    const sr=stage.getBoundingClientRect(),nr=name.getBoundingClientRect(),cr=clock.getBoundingClientRect(),scr=scan?.getBoundingClientRect(),qr=quick?.getBoundingClientRect(),cs=getComputedStyle(stage),controls=getComputedStyle(q('.axis821StageControls'));
    const dockTop=scr&&qr?Math.min(scr.top,qr.top):null,dockLeft=scr&&qr?Math.min(scr.left,qr.left):null,dockRight=scr&&qr?Math.max(scr.right,qr.right):null;
    return {
      viewport:innerWidth,docOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      stage:sr.toJSON(),toggle:rect('#v87Toggle'),primary:rect('#v87Primary'),adjust:rect('#v87AdjustBtn'),
      finish:rect('#v87Finish'),name:nr.toJSON(),clock:cr.toJSON(),
      stageCenter:sr.left+sr.width/2,nameCenter:nr.left+nr.width/2,clockCenter:cr.left+cr.width/2,
      stageDockGap:dockTop==null?null:dockTop-sr.bottom,dockLeft,dockRight,
      position:cs.position,background:cs.backgroundColor,shadow:cs.boxShadow,radius:parseFloat(cs.borderRadius),contain:cs.contain,
      controlsDisplay:controls.display,gridColumns:controls.gridTemplateColumns,
      oldHero:getComputedStyle(q('#activeHome>.liveHead')).display,
      oldPair:getComputedStyle(q('#activeHome>.metricPair.compact')).display,
      oldTimerVisible:!!(q('#liveTimer')&&q('#liveTimer').getClientRects().length),
      adjustText:adjust?.textContent?.trim(),primaryText:primary?.textContent?.trim(),toggleLabel:toggle?.dataset?.label,
      styleText:q('#axis821ActiveStageStyle')?.textContent||''
    };
  });
  assert.equal(g.position,'relative');
  assert.ok(g.stage.width>=g.viewport-48,`stage rail too narrow ${JSON.stringify(g.stage)}`);
  assert.ok(Math.abs(g.stageCenter-g.nameCenter)<=1.5,`name not centered ${JSON.stringify(g)}`);
  assert.ok(Math.abs(g.stageCenter-g.clockCenter)<=1.5,`clock not centered ${JSON.stringify(g)}`);
  assert.equal(g.shadow,'none','stage returned to elevated card shadow');
  assert.ok(g.radius<=20,'stage radius drifted away from native AXIS rhythm');
  assert.match(g.contain,/layout/,'stage lost bounded layout containment');
  assert.equal(g.controlsDisplay,'grid');
  assert.equal(g.oldHero,'none','legacy Active hero duplicated the integrated stage');
  assert.equal(g.oldPair,'none','legacy Active summary duplicated the integrated stage');
  assert.equal(g.oldTimerVisible,false,'legacy elapsed timer is still visibly duplicated');
  assert.equal(g.primaryText,'完成一组');
  assert.equal(g.toggleLabel,'暂停');
  assert.equal(g.adjustText,'调整');
  assert.ok(!intersects(g.toggle,g.primary),'pause and complete-set controls overlap');
  assert.ok(!intersects(g.adjust,g.toggle)&&!intersects(g.adjust,g.primary),'Adjust overlaps a primary action');
  assert.ok(g.adjust.top>=Math.max(g.toggle.bottom,g.primary.bottom)+7,`Adjust row gap is too tight: ${JSON.stringify(g)}`);
  assert.ok(Math.abs(g.adjust.left-g.toggle.left)<=1.5,'Adjust left rail is misaligned');
  assert.ok(Math.abs(g.adjust.right-g.primary.right)<=1.5,'Adjust right rail is misaligned');
  assert.ok(g.stageDockGap!==null&&g.stageDockGap>=16,`stage does not clear capture dock: ${JSON.stringify(g)}`);
  assert.ok(Math.abs(g.stage.left-g.dockLeft)<=1.5&&Math.abs(g.stage.right-g.dockRight)<=1.5,`stage/dock rail mismatch: ${JSON.stringify(g)}`);
  assert.ok(g.docOverflow<=1,`horizontal overflow ${g.docOverflow}`);
  assert.ok(!/infinite/i.test(g.styleText),'stage introduced continuous animation');

  console.log(`[AXIS 8.21 Active Home polish ${ENGINE}] primary actions remain physically reliable`);
  await tap(page.locator('#v87Primary'));
  await page.waitForFunction(()=>Number(JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['polish-e1']?.activity?.completedSets)===1,undefined,{timeout:3000});
  const post=await page.evaluate(()=>({done:JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['polish-e1']?.activity?.completedSets,oldHero:getComputedStyle(document.querySelector('#activeHome>.liveHead')).display,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}));
  assert.equal(post.done,1);assert.equal(post.oldHero,'none');assert.ok(post.overflow<=1);

  await tap(page.locator('#v87Toggle'));
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['polish-e1']?.activity?.status==='paused',undefined,{timeout:3000});
  assert.equal(await page.locator('#v87Toggle').getAttribute('data-label'),'继续');
  await tap(page.locator('#v87Toggle'));
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['polish-e1']?.activity?.status==='active',undefined,{timeout:3000});

  assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
  console.log(`[AXIS 8.21 Active Home polish ${ENGINE}] PASS · no duplicate hero · native rail alignment · isolated Adjust · dock clearance · reliable primary actions · no overflow`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
