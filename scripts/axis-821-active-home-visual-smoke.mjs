import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core'),launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});

async function proveViewport(width,height,mobile){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:2,isMobile:mobile&&ENGINE==='webkit',hasTouch:true,locale:'zh-CN'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e?.stack||e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));
 try{
  assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
  const now=Date.now();
  await page.evaluate(t=>{
   localStorage.clear();
   const event={id:'visual-e1',equipmentId:'chest',name:'胸推',pattern:'push',kind:'strength',muscles:['胸'],effect:'',time:t-83000,sets:3,metrics:{},metricSchemaSnapshot:[{key:'weight',label:'重量',type:'weight',unit:'kg',step:2.5},{key:'reps',label:'次数',type:'reps',unit:'次',step:1}],metricSchemaVersionSnapshot:'8.21',executionModeSnapshot:'sets'};
   localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'visual-s1',start:t-83000,events:[event]},flows:[],flowRun:null,profile:{customEq:[],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
   localStorage.setItem('axis_v8_meta',JSON.stringify({events:{'visual-e1':{activity:{status:'active',startedAt:t-83000,lastResumedAt:t-83000,intervals:[{start:t-83000,end:null}],estimateMs:600000,completedSets:0,setDoneAt:[],restStartedAt:null},sets:[{weight:60,reps:10,state:'assumed',doneAt:null},{weight:60,reps:10,state:'assumed',doneAt:null},{weight:60,reps:10,state:'assumed',doneAt:null}]}},prefs:{}}));
  },now);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_ACTIVE_RUNTIME__?.owner==='v87'&&window.__AXIS_821_ACTIVE_HOME_STAGE__?.presentation==='integrated-home-stage'&&window.__AXIS_821_ACTIVE_HOME_VISUAL__?.surface==='flat-integrated-home',undefined,{timeout:15000});
  await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show')&&document.querySelector('#v87Now')?.parentElement?.id==='activeHome'&&document.querySelector('#v87AdjustBtn'),undefined,{timeout:8000});
  const g=await page.evaluate(()=>{
   const host=document.querySelector('#v87Now'),parent=host.parentElement,clock=document.querySelector('#axis821StageClock'),toggle=document.querySelector('#v87Toggle'),primary=document.querySelector('#v87Primary'),adjust=document.querySelector('#v87AdjustBtn'),finish=document.querySelector('#v87Finish'),finishIcon=finish?.querySelector('i'),fact=document.querySelector('.axis821StageFact'),controls=document.querySelector('.axis821StageControls');
   const R=x=>{const r=x.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height,cx:r.left+r.width/2}};
   const hr=R(host),pr=R(parent),cr=R(clock),tr=R(toggle),rr=R(primary),ar=R(adjust),fer=R(finish),fr=R(fact),xr=R(controls),cs=getComputedStyle(host),as=getComputedStyle(adjust),fs=getComputedStyle(finish),fis=getComputedStyle(finishIcon),ps=getComputedStyle(primary),ts=getComputedStyle(toggle),style=document.querySelector('#axis821ActiveStageRefineStyle')?.textContent||'';
   return{host:hr,parent:pr,clock:cr,toggle:tr,primary:rr,adjust:ar,finish:fer,fact:fr,controls:xr,backgroundColor:cs.backgroundColor,backgroundImage:cs.backgroundImage,boxShadow:cs.boxShadow,radius:parseFloat(cs.borderTopLeftRadius)||0,position:cs.position,adjustPosition:as.position,primaryRadius:parseFloat(ps.borderTopLeftRadius)||0,toggleRadius:parseFloat(ts.borderTopLeftRadius)||0,finishRadius:parseFloat(fs.borderTopLeftRadius)||0,finishBackground:fs.backgroundImage,finishBorder:fs.borderTopColor,finishTouch:fs.touchAction,finishIconTransform:fis.transform,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,stylePresent:!!style,marker:window.__AXIS_821_ACTIVE_HOME_VISUAL__,adjustText:adjust.textContent.trim(),finishText:finish.textContent.trim(),clockText:clock.textContent.trim()};
  });
  assert.equal(g.position,'relative');
  assert.equal(g.adjustPosition,'static');
  assert.ok(g.stylePresent,'refinement style missing');
  assert.equal(g.marker?.stateOwner,'v87');
  assert.equal(g.marker?.newActionOwner,false);
  assert.equal(g.marker?.rest,'single-visible-clock');
  assert.equal(g.marker?.finish,'tactile-brand-hold');
  assert.ok(g.host.width>=g.parent.width-1,`stage must fill Home rail ${JSON.stringify(g)}`);
  assert.ok(Math.abs(g.host.left-g.parent.left)<=1&&Math.abs(g.host.right-g.parent.right)<=1,`stage rail alignment ${JSON.stringify(g)}`);
  assert.ok(Math.abs(g.clock.cx-g.host.cx)<=1.5,`clock is not centered ${JSON.stringify(g)}`);
  assert.ok(g.backgroundImage==='none',`stage retains decorative background ${g.backgroundImage}`);
  assert.ok(g.backgroundColor==='rgba(0, 0, 0, 0)'||g.backgroundColor==='transparent',`stage not flat ${g.backgroundColor}`);
  assert.equal(g.boxShadow,'none');
  assert.ok(g.radius<=0.5,`container radius must be flat ${g.radius}`);
  assert.ok(Math.abs(g.toggle.width-g.primary.width)<=2.5,`primary controls not balanced ${JSON.stringify(g)}`);
  assert.ok(g.primary.left-g.toggle.right>=7,`primary controls touch ${JSON.stringify(g)}`);
  assert.ok(Math.abs(g.toggle.top-g.primary.top)<=1&&Math.abs(g.toggle.height-g.primary.height)<=1,`primary control row misaligned ${JSON.stringify(g)}`);
  assert.ok(g.adjust.top-g.toggle.bottom>=4,`Adjust is glued to primary controls ${JSON.stringify(g)}`);
  assert.ok(g.adjust.left>=g.host.left-1&&g.adjust.right<=g.host.right+1,`Adjust escapes stage rail ${JSON.stringify(g)}`);
  assert.ok(g.fact.left>=g.host.left-1&&g.fact.right<=g.host.right+1,`fact rail escapes stage ${JSON.stringify(g)}`);
  assert.ok(g.primaryRadius<=16.5&&g.toggleRadius<=16.5,`controls over-rounded ${JSON.stringify(g)}`);
  assert.ok(g.finish.width>=92&&g.finish.height>=35,`hold affordance lost touch geometry ${JSON.stringify(g)}`);
  assert.ok(g.finishRadius>=11&&g.finishRadius<=13.5,`hold affordance radius drift ${JSON.stringify(g)}`);
  assert.match(g.finishBackground,/linear-gradient|conic-gradient/,`hold affordance lost branded depth ${g.finishBackground}`);
  assert.notEqual(g.finishIconTransform,'none','hold affordance brand glyph lost');
  assert.equal(g.finishTouch,'none');
  assert.equal(g.finishText,'按住结束');
  assert.equal(g.adjustText,'调整');
  assert.match(g.clockText,/^\d{2}:\d{2}$/);
  assert.ok(g.overflow<=1,`horizontal overflow ${g.overflow}`);

  await page.evaluate(t=>{
   const m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),a=m.events?.['visual-e1']?.activity;if(!a)return;
   a.status='paused';a.pausedAt=t-6200;a.restStartedAt=t-6200;a.lastResumedAt=t-83000;a.intervals=[{start:t-83000,end:t-6200}];localStorage.setItem('axis_v8_meta',JSON.stringify(m));
  },Date.now());
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show')&&document.querySelector('#v87State')?.textContent.includes('暂停'),undefined,{timeout:8000});
  const rest=await page.evaluate(()=>{
   const fact=document.querySelector('#axis821StageRest'),line=document.querySelector('#v87Rest'),visible=el=>!!el&&getComputedStyle(el).display!=='none'&&el.getBoundingClientRect().height>0;
   const texts=[fact,line].filter(visible).map(el=>(el.textContent||'').trim()).filter(Boolean),clockCopies=texts.filter(x=>/休息\s+\d{2}:\d{2}/.test(x));
   return{texts,clockCopies,fact:(fact?.textContent||'').trim(),line:(line?.textContent||'').trim()};
  });
  assert.equal(rest.clockCopies.length,1,`rest clock must have one visible owner ${JSON.stringify(rest)}`);
  assert.ok(!/休息\s+\d{2}:\d{2}/.test(rest.fact),`fact rail duplicates rest clock ${JSON.stringify(rest)}`);
  assert.ok(/休息\s+\d{2}:\d{2}/.test(rest.line),`passive rest presenter lost clock ${JSON.stringify(rest)}`);
  assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
  console.log(`[AXIS 8.21 Active Home visual ${ENGINE}] PASS ${width}x${height} · flat rail · centered clock · balanced controls · tactile hold · one rest clock · isolated Adjust · no overflow`);
 }finally{await context.close().catch(()=>{})}
}

try{
 await proveViewport(390,844,true);
 await proveViewport(520,900,false);
}finally{await browser.close().catch(()=>{})}
