import fs from 'node:fs';

const FILE='scripts/axis-882-smoke.mjs';
const fail=m=>{throw new Error(`[AXIS 8.9 test flow] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');

const stale=`await upload();await page.waitForFunction(()=>document.querySelector('#aiStatus')?.textContent?.includes('本地认出'),undefined,{timeout:1800});
assert.equal((await page.locator('#equipmentName').innerText()).trim(),'高位下拉');assert.equal((await page.locator('#aiStatus').innerText()).trim(),'本地认出');`;
const aligned=`await upload();await page.waitForFunction(()=>{const v=window.__AXIS_LOCAL_VISION__?.snapshot?.(),status=document.querySelector('#aiStatus')?.textContent?.trim(),equipment=document.querySelector('#equipmentName')?.textContent?.trim();return v?.version===2&&v?.last?.stage==='guess'&&v.last.usable===true&&v.last.best?.id==='lat'&&equipment==='高位下拉'&&status==='请确认'},undefined,{timeout:2500});
const vision=await page.evaluate(()=>window.__AXIS_LOCAL_VISION__?.snapshot?.());assert.equal(vision?.version,2,'Local Vision v2 diagnostic missing');assert.ok(vision?.memories?.some(x=>x.equipmentId==='lat'&&x.sig?.full&&x.sig?.center&&x.sig?.zones),'confirmed equipment memory missing canonical multi-signal signature');assert.equal(vision?.last?.best?.id,'lat','local memory did not rank confirmed equipment first');assert.equal(vision?.last?.usable,true,'local memory candidate did not meet usable threshold');assert.equal((await page.locator('#equipmentName').innerText()).trim(),'高位下拉');assert.equal((await page.locator('#aiStatus').innerText()).trim(),'请确认','AI-unavailable flow must preserve local preselection but require confirmation');`;

const n=src.split(stale).length-1;
if(n===1){src=src.replace(stale,aligned);fs.writeFileSync(FILE,src)}
else if(n===0&&!src.includes("v?.last?.best?.id==='lat'"))fail('stale Local Vision assertion boundary not found');
else if(n>1)fail(`stale Local Vision assertion found ${n} times`);

if(src.includes("includes('本地认出')"))fail('retired Local Vision status assertion survived');
if(!src.includes("status==='请确认'"))fail('8.9 frontier-confirmation assertion missing');
if(!src.includes("x.equipmentId==='lat'&&x.sig?.full&&x.sig?.center&&x.sig?.zones"))fail('Local Vision persisted-signature assertion missing');
console.log('[AXIS 8.9 test flow] PASS · inherited memory regression verifies v2 local prior + frontier confirmation semantics');
