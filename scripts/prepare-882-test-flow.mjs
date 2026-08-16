import fs from 'node:fs';

const FILE='scripts/axis-882-smoke.mjs';
let src=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=src.split(from).length-1;if(n!==1)throw new Error(`[AXIS 8.8.2 test flow] ${label} expected once, found ${n}`);src=src.replace(from,to)};

once(
  "const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:8000})};",
  "const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:8000});await page.waitForFunction(()=>window.__AXIS_QUICK_READY__===true,undefined,{timeout:1200})};",
  'Quick Record readiness wait'
);
once(
  "await page.locator('#startBtn').click();await page.waitForFunction(()=>document.querySelector('#dock')?.classList.contains('show'),undefined,{timeout:1200});\nawait page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='session',undefined,{timeout:1800});\n",
  "assert.equal(await page.locator('#startBtn').isVisible(),false,'legacy explicit start entry unexpectedly returned');\nassert.ok(await page.locator('#quickRecordBtn').isVisible(),'Quick Record is not available in ready state');\n",
  'real no-explicit-start entry flow'
);
if(src.includes("locator('#startBtn').click()"))throw new Error('[AXIS 8.8.2 test flow] hidden explicit-start click survived');
if(!src.includes("window.__AXIS_QUICK_READY__===true"))throw new Error('[AXIS 8.8.2 test flow] Quick Record readiness invariant missing');
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.8.2 test flow] PASS · Quick Record is the user entry · first save owns auto-session creation');
