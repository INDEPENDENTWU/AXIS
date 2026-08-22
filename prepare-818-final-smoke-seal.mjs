import fs from 'node:fs';

const FILE='scripts/axis-818-object-focus-smoke.mjs';
const fail=m=>{throw new Error(`[AXIS 8.18 final smoke seal] ${m}`)};
let s=fs.readFileSync(FILE,'utf8');
const from=" await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:2000});\n assert.equal(await page.locator('#settingsSheet .v817CaptureInfo').count(),0,'read-only video pseudo-setting still visible');";
const to=" await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:2000});\n const recordPrefs=page.locator('#settingsSheet button').filter({hasText:'记录偏好'}).first();assert.ok(await recordPrefs.count(),'Record preferences entry missing');await tap(recordPrefs);\n await page.waitForFunction(()=>{const x=document.querySelector('#scanSeconds');return !!x&&x.getBoundingClientRect().height>0},undefined,{timeout:2000});\n assert.equal(await page.locator('#settingsSheet .v817CaptureInfo').count(),0,'read-only video pseudo-setting still visible');";
const n=s.split(from).length-1;if(n!==1)fail(`Settings open sequence expected once, found ${n}`);s=s.replace(from,to);
if(!s.includes("await tap(page.locator('#scanSeconds [data-sec=\"5\"]'))")||!s.includes("await tap(page.locator('#scanSeconds [data-sec=\"3\"]'))"))fail('physical 3/5 taps missing');
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.18 final smoke seal] PASS · Record preferences opened before physical 3/5 taps · pseudo-setting retirement still asserted');
