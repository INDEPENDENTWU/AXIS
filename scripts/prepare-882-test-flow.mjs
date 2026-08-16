import fs from 'node:fs';

function patchFile(file,steps){
  let src=fs.readFileSync(file,'utf8');
  for(const [from,to,label] of steps){const n=src.split(from).length-1;if(n!==1)throw new Error(`[AXIS 8.8.2 test flow] ${file} · ${label} expected once, found ${n}`);src=src.replace(from,to)}
  fs.writeFileSync(file,src);
  return src;
}

const current=patchFile('scripts/axis-882-smoke.mjs',[
  [
    "const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:8000})};",
    "const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:8000});await page.waitForFunction(()=>window.__AXIS_QUICK_READY__===true,undefined,{timeout:1200})};",
    'Quick Record readiness wait'
  ],
  [
    "await page.locator('#startBtn').click();await page.waitForFunction(()=>document.querySelector('#dock')?.classList.contains('show'),undefined,{timeout:1200});\nawait page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='session',undefined,{timeout:1800});\n",
    "assert.equal(await page.locator('#startBtn').isVisible(),false,'legacy explicit start entry unexpectedly returned');\nassert.ok(await page.locator('#quickRecordBtn').isVisible(),'Quick Record is not available in ready state');\n",
    'real no-explicit-start entry flow'
  ],
  [
    "await page.locator('#v87Paused button').first().click();await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='active',undefined,{timeout:1800});",
    "await page.locator('#v87Toggle').click();await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='active',undefined,{timeout:1800});",
    'canonical current-item resume action'
  ],
  [
    "await upload();await page.locator('#equipmentRow').click();await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:800});await page.locator('#eqSheet [data-eq=\"lat\"]').click();assert.equal((await page.locator('#equipmentName').innerText()).trim(),'高位下拉');await page.locator('#saveScan').click();await page.waitForFunction(()=>!document.querySelector('#scanSheet')?.classList.contains('show'),undefined,{timeout:2500});",
    "await upload();await page.locator('#equipmentRow').click();await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:800});await page.locator('#eqSearch').fill('高位下拉');await page.waitForFunction(()=>{const x=document.querySelector('#v8710Cards [data-v877-lib=\"lat-pulldown\"]');if(!x)return false;const c=getComputedStyle(x),r=x.getBoundingClientRect();return c.display!=='none'&&c.visibility!=='hidden'&&r.width>0&&r.height>0},undefined,{timeout:1200});await page.locator('#v8710Cards [data-v877-lib=\"lat-pulldown\"]:visible').click();await page.waitForFunction(()=>document.querySelector('#equipmentName')?.textContent?.trim()==='高位下拉',undefined,{timeout:1200});const saveBefore=await page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}').active?.events?.length||0),saveStarted=Date.now();await page.locator('#saveScan').click();try{await page.waitForFunction(()=>!document.querySelector('#scanSheet')?.classList.contains('show'),undefined,{timeout:2500})}catch(e){const diag=await page.evaluate(({before,errors})=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return{elapsed:null,before,eventCount:c.active?.events?.length||0,lastEvent:c.active?.events?.at(-1)||null,scanClass:document.querySelector('#scanSheet')?.className||null,saveDisabled:!!document.querySelector('#saveScan')?.disabled,saveText:document.querySelector('#saveScan')?.textContent||'',toast:document.querySelector('#toast')?.textContent||'',equipment:document.querySelector('#equipmentName')?.textContent||'',reviewHidden:document.querySelector('#reviewStage')?.classList.contains('hidden')??null,vision:window.__AXIS_LOCAL_VISION__?.snapshot?.(),errors}}, {before:saveBefore,errors});diag.elapsed=Date.now()-saveStarted;console.error('[AXIS WebKit save lifecycle diagnostic]',JSON.stringify(diag,null,2));throw e}const learned=await page.evaluate(()=>window.__AXIS_LOCAL_VISION__?.snapshot?.());console.log('[AXIS local vision learned]',JSON.stringify(learned));assert.ok(learned?.memories?.some(x=>x.equipmentId==='lat'),`confirmed equipment did not persist local visual memory: ${JSON.stringify(learned)}`);assert.ok(learned.memories.some(x=>x.equipmentId==='lat'&&x.sig?.full&&x.sig?.center&&x.sig?.zones),'confirmed equipment memory is missing multi-signal signature');",
    'manual equipment confirmation through canonical live catalog result + strict save lifecycle diagnostic'
  ],
  [
    "await upload();await page.waitForFunction(()=>document.querySelector('#aiStatus')?.textContent?.includes('本地认出'),undefined,{timeout:1800});",
    "await upload();try{await page.waitForFunction(()=>document.querySelector('#aiStatus')?.textContent?.includes('本地认出'),undefined,{timeout:1800})}catch(e){const diag=await page.evaluate(()=>({vision:window.__AXIS_LOCAL_VISION__?.snapshot?.(),status:document.querySelector('#aiStatus')?.textContent||'',equipment:document.querySelector('#equipmentName')?.textContent||''}));console.error('[AXIS local vision second-upload diagnostic]',JSON.stringify(diag,null,2));throw e}",
    'second-upload strong local-recognition diagnostic'
  ],
  [
    "await page.evaluate(id=>{const k='axis_v8_meta',m=JSON.parse(localStorage.getItem(k)||'{}'),a=m.events?.[id]?.activity,t=Date.now();a.estimateMs=600000;a.startedAt=t;a.lastResumedAt=t;a.intervals=[{start:t,end:null}];a.restStartedAt=null;m.prefs.v8710SoundEnabled=true;m.prefs.v876ItemReminder=true;localStorage.setItem(k,JSON.stringify(m));window.__AXIS_882_CUES__=[]},activeId);",
    "const finishId=await page.locator('#v87Finish').getAttribute('data-id');assert.equal(finishId,activeId,`active finish target changed before manual finish: ${activeId} -> ${finishId}`);await page.evaluate(id=>{const k='axis_v8_meta',m=JSON.parse(localStorage.getItem(k)||'{}'),a=m.events?.[id]?.activity;if(!a)throw new Error(`manual-finish activity missing before hold: ${id}`);const t=Date.now();a.estimateMs=600000;a.startedAt=t;a.lastResumedAt=t;a.intervals=[{start:t,end:null}];a.restStartedAt=null;m.prefs.v8710SoundEnabled=true;m.prefs.v876ItemReminder=true;localStorage.setItem(k,JSON.stringify(m));window.__AXIS_882_CUES__=[]},finishId);",
    'manual finish targets canonical current event'
  ],
  [
    "assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.status), 'finished');assert.deepEqual(await page.evaluate(()=>window.__AXIS_882_CUES__),[],'manual long-press finish emitted an automatic sound');",
    "const finishDiag=await page.evaluate(id=>{const m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return{id,status:m.events?.[id]?.activity?.status||null,eventExists:!!m.events?.[id],metaIds:Object.keys(m.events||{}),coreActiveIds:(c.active?.events||[]).map(x=>x.id),sessionIds:(c.sessions||[]).flatMap(s=>(s.events||[]).map(x=>x.id)),buttonId:document.querySelector('#v87Finish')?.dataset.id||null,home:window.__AXIS_HOME_STATE__||null}},finishId);console.log('[AXIS manual finish diagnostic]',JSON.stringify(finishDiag));assert.equal(finishDiag.status,'finished',`manual finish did not persist canonical finished state: ${JSON.stringify(finishDiag)}`);assert.deepEqual(await page.evaluate(()=>window.__AXIS_882_CUES__),[],'manual long-press finish emitted an automatic sound');",
    'manual finish persistence diagnostic'
  ]
]);
if(current.includes("locator('#startBtn').click()"))throw new Error('[AXIS 8.8.2 test flow] hidden explicit-start click survived');
if(current.includes("locator('#v87Paused button').first().click()"))throw new Error('[AXIS 8.8.2 test flow] current-item resume still targets secondary paused list');
if(current.includes("locator('#eqSheet [data-eq=\"lat\"]').click()"))throw new Error('[AXIS 8.8.2 test flow] local-memory confirmation still clicks retired legacy catalog');
if(!current.includes("locator('#v8710Cards [data-v877-lib=\"lat-pulldown\"]:visible').click()"))throw new Error('[AXIS 8.8.2 test flow] canonical live catalog confirmation missing');
if(!current.includes('AXIS WebKit save lifecycle diagnostic'))throw new Error('[AXIS 8.8.2 test flow] strict save lifecycle diagnostic missing');
if(!current.includes('AXIS local vision second-upload diagnostic'))throw new Error('[AXIS 8.8.2 test flow] local vision diagnostic missing');
if(!current.includes('AXIS manual finish diagnostic'))throw new Error('[AXIS 8.8.2 test flow] manual finish diagnostic missing');
if(!current.includes("window.__AXIS_QUICK_READY__===true"))throw new Error('[AXIS 8.8.2 test flow] Quick Record readiness invariant missing');

const inherited=patchFile('scripts/axis-881-smoke.mjs',[[
  "await page.locator('#v87Paused button').first().click();await page.waitForTimeout(700);assert.notEqual((await page.locator('#v87Meta').innerText()).trim(),paused);",
  "await page.locator('#v87Toggle').click();await page.waitForTimeout(700);assert.notEqual((await page.locator('#v87Meta').innerText()).trim(),paused);",
  'inherited current-item resume action'
]]);
if(inherited.includes("locator('#v87Paused button').first().click()"))throw new Error('[AXIS 8.8.2 test flow] inherited current-item resume still targets secondary paused list');

const webkit=patchFile('scripts/axis-webkit-smoke.mjs',[[
  "const toggle=page.locator('#v87Toggle');await toggle.click();await page.waitForTimeout(90);assert.equal((await toggle.innerText()).trim(),'▶','WebKit pause failed');await toggle.click();await page.waitForTimeout(90);assert.equal((await toggle.innerText()).trim(),'Ⅱ','WebKit resume failed');",
  "const toggle=page.locator('#v87Toggle'),toggleId=await toggle.getAttribute('data-id');assert.ok(toggleId,'WebKit canonical toggle target missing');await toggle.click();await page.waitForFunction(id=>{const m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}');return m.events?.[id]?.activity?.status==='paused'&&document.querySelector('#v87Toggle')?.textContent?.trim()==='▶'},toggleId,{timeout:1200});await toggle.click();await page.waitForFunction(id=>{const m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}');return m.events?.[id]?.activity?.status==='active'&&document.querySelector('#v87Toggle')?.textContent?.trim()==='Ⅱ'},toggleId,{timeout:1200});",
  'WebKit pause/resume waits for canonical persisted state'
]]);
if(webkit.includes("waitForTimeout(90);assert.equal((await toggle.innerText()).trim(),'▶'"))throw new Error('[AXIS 8.8.2 test flow] WebKit pause still uses arbitrary 90ms assertion');

console.log('[AXIS 8.8.2 test flow] PASS · Quick Record user entry · strict save lifecycle · local vision diagnostics · canonical manual-finish target · WebKit persisted pause/resume');
