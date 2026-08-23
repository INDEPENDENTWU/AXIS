import fs from 'node:fs';

const FILE='scripts/axis-8121-hotfix-smoke.mjs';
const fail=m=>{throw new Error(`[AXIS 8.18 inherited test-flow seal] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let s=fs.readFileSync(FILE,'utf8');

const old=` await page.locator('#photoInput').setInputFiles({name:'axis-test.png',mimeType:'image/png',buffer:png});
 await page.waitForFunction(()=>!document.querySelector('#reviewStage')?.classList.contains('hidden'),undefined,{timeout:3500});`;
const current=` await page.locator('#photoInput').setInputFiles({name:'axis-test.png',mimeType:'image/png',buffer:png});
 if(await page.locator('#v816CaptureDone').count()){
  await page.waitForFunction(()=>document.querySelectorAll('#v816DraftRail .v816DraftItem').length>0&&document.querySelector('#v816CaptureDone')?.disabled===false,undefined,{timeout:3500});
  assert.equal(await page.locator('#v816CaptureDone').isEnabled(),true,'canonical Capture Field done action is not enabled after photo draft');
  await tap(page.locator('#v816CaptureDone'));
 }
 await page.waitForFunction(()=>!document.querySelector('#reviewStage')?.classList.contains('hidden'),undefined,{timeout:3500});`;
const n=s.split(old).length-1;if(n!==1)fail(`legacy upload→review flow expected once, found ${n}`);
s=s.replace(old,current);
if(!s.includes("canonical Capture Field done action is not enabled after photo draft"))fail('Capture Field completion assertion missing');
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.18 inherited test-flow seal] PASS · inherited Group Plan smoke follows canonical photo draft → 完成 → review flow · four-set/save assertions unchanged');
