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
  ]
]);
if(current.includes("locator('#startBtn').click()"))throw new Error('[AXIS 8.8.2 test flow] hidden explicit-start click survived');
if(current.includes("locator('#v87Paused button').first().click()"))throw new Error('[AXIS 8.8.2 test flow] current-item resume still targets secondary paused list');
if(!current.includes("window.__AXIS_QUICK_READY__===true"))throw new Error('[AXIS 8.8.2 test flow] Quick Record readiness invariant missing');

const inherited=patchFile('scripts/axis-881-smoke.mjs',[[
  "await page.locator('#v87Paused button').first().click();await page.waitForTimeout(700);assert.notEqual((await page.locator('#v87Meta').innerText()).trim(),paused);",
  "await page.locator('#v87Toggle').click();await page.waitForTimeout(700);assert.notEqual((await page.locator('#v87Meta').innerText()).trim(),paused);",
  'inherited current-item resume action'
]]);
if(inherited.includes("locator('#v87Paused button').first().click()"))throw new Error('[AXIS 8.8.2 test flow] inherited current-item resume still targets secondary paused list');

console.log('[AXIS 8.8.2 test flow] PASS · Quick Record is the user entry · first save auto-starts · current item resumes through v87Toggle');
