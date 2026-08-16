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
    "await upload();await page.locator('#equipmentRow').click();await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:800});await page.locator('#eqSearch').fill('高位下拉');await page.waitForFunction(()=>{const x=document.querySelector('#v8710Cards [data-v877-lib=\"lat-pulldown\"]');if(!x)return false;const c=getComputedStyle(x),r=x.getBoundingClientRect();return c.display!=='none'&&c.visibility!=='hidden'&&r.width>0&&r.height>0},undefined,{timeout:1200});await page.locator('#v8710Cards [data-v877-lib=\"lat-pulldown\"]:visible').click();await page.waitForFunction(()=>document.querySelector('#equipmentName')?.textContent?.trim()==='高位下拉',undefined,{timeout:1200});await page.locator('#saveScan').click();await page.waitForFunction(()=>!document.querySelector('#scanSheet')?.classList.contains('show'),undefined,{timeout:2500});const learned=await page.evaluate(()=>window.__AXIS_LOCAL_VISION__?.snapshot?.());console.log('[AXIS local vision learned]',JSON.stringify(learned));assert.ok(learned?.memories?.some(x=>x.equipmentId==='lat'),`confirmed equipment did not persist local visual memory: ${JSON.stringify(learned)}`);assert.ok(learned.memories.some(x=>x.equipmentId==='lat'&&x.sig?.full&&x.sig?.center&&x.sig?.zones),'confirmed equipment memory is missing multi-signal signature');",
    'manual equipment confirmation through canonical live catalog result + persisted memory assertion'
  ],
  [
    "await upload();await page.waitForFunction(()=>document.querySelector('#aiStatus')?.textContent?.includes('本地认出'),undefined,{timeout:1800});",
    "await upload();try{await page.waitForFunction(()=>document.querySelector('#aiStatus')?.textContent?.includes('本地认出'),undefined,{timeout:1800})}catch(e){const diag=await page.evaluate(()=>({vision:window.__AXIS_LOCAL_VISION__?.snapshot?.(),status:document.querySelector('#aiStatus')?.textContent||'',equipment:document.querySelector('#equipmentName')?.textContent||''}));console.error('[AXIS local vision second-upload diagnostic]',JSON.stringify(diag,null,2));throw e}",
    'second-upload strong local-recognition diagnostic'
  ]
]);
if(current.includes("locator('#startBtn').click()"))throw new Error('[AXIS 8.8.2 test flow] hidden explicit-start click survived');
if(current.includes("locator('#v87Paused button').first().click()"))throw new Error('[AXIS 8.8.2 test flow] current-item resume still targets secondary paused list');
if(current.includes("locator('#eqSheet [data-eq=\"lat\"]').click()"))throw new Error('[AXIS 8.8.2 test flow] local-memory confirmation still clicks retired legacy catalog');
if(!current.includes("locator('#v8710Cards [data-v877-lib=\"lat-pulldown\"]:visible').click()"))throw new Error('[AXIS 8.8.2 test flow] canonical live catalog confirmation missing');
if(!current.includes('AXIS local vision second-upload diagnostic'))throw new Error('[AXIS 8.8.2 test flow] local vision diagnostic missing');
if(!current.includes("window.__AXIS_QUICK_READY__===true"))throw new Error('[AXIS 8.8.2 test flow] Quick Record readiness invariant missing');

const inherited=patchFile('scripts/axis-881-smoke.mjs',[[
  "await page.locator('#v87Paused button').first().click();await page.waitForTimeout(700);assert.notEqual((await page.locator('#v87Meta').innerText()).trim(),paused);",
  "await page.locator('#v87Toggle').click();await page.waitForTimeout(700);assert.notEqual((await page.locator('#v87Meta').innerText()).trim(),paused);",
  'inherited current-item resume action'
]]);
if(inherited.includes("locator('#v87Paused button').first().click()"))throw new Error('[AXIS 8.8.2 test flow] inherited current-item resume still targets secondary paused list');

console.log('[AXIS 8.8.2 test flow] PASS · Quick Record user entry · first save auto-starts · v87Toggle resumes · local vision learn/guess diagnostics · canonical live catalog confirmation');
