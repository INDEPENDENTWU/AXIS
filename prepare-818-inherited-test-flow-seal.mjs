import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.18 inherited test-flow seal] ${m}`)};
function patch(file,old,current,label){
 if(!fs.existsSync(file))fail(`missing ${file}`);let s=fs.readFileSync(file,'utf8');
 const n=s.split(old).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);
 s=s.replace(old,current);fs.writeFileSync(file,s);return s;
}

const hotfix='scripts/axis-8121-hotfix-smoke.mjs';
const hotfixOld=` await page.locator('#photoInput').setInputFiles({name:'axis-test.png',mimeType:'image/png',buffer:png});
 await page.waitForFunction(()=>!document.querySelector('#reviewStage')?.classList.contains('hidden'),undefined,{timeout:3500});`;
const hotfixCurrent=` await page.locator('#photoInput').setInputFiles({name:'axis-test.png',mimeType:'image/png',buffer:png});
 if(await page.locator('#v816CaptureDone').count()){
  await page.waitForFunction(()=>document.querySelectorAll('#v816DraftRail .v816DraftItem').length>0&&document.querySelector('#v816CaptureDone')?.disabled===false,undefined,{timeout:3500});
  assert.equal(await page.locator('#v816CaptureDone').isEnabled(),true,'canonical Capture Field done action is not enabled after photo draft');
  await tap(page.locator('#v816CaptureDone'));
 }
 await page.waitForFunction(()=>!document.querySelector('#reviewStage')?.classList.contains('hidden'),undefined,{timeout:3500});`;
const a=patch(hotfix,hotfixOld,hotfixCurrent,'8.12.1 legacy upload→review flow');
if(!a.includes("canonical Capture Field done action is not enabled after photo draft"))fail('8.12.1 Capture Field completion assertion missing');

const field='scripts/axis-8123-field-polish-smoke.mjs';
const fieldOld=`  await page.locator('#photoInput').setInputFiles({name:'axis-field.png',mimeType:'image/png',buffer:png});
  await page.waitForFunction(()=>!document.querySelector('#reviewStage')?.classList.contains('hidden'),undefined,{timeout:3500});`;
const fieldCurrent=`  await page.locator('#photoInput').setInputFiles({name:'axis-field.png',mimeType:'image/png',buffer:png});
  if(await page.locator('#v816CaptureDone').count()){
   await page.waitForFunction(()=>document.querySelectorAll('#v816DraftRail .v816DraftItem').length>0&&document.querySelector('#v816CaptureDone')?.disabled===false,undefined,{timeout:3500});
   assert.equal(await page.locator('#v816CaptureDone').isEnabled(),true,'field flow canonical Capture Field done action is not enabled after photo draft');
   await tap(page.locator('#v816CaptureDone'));
  }
  await page.waitForFunction(()=>!document.querySelector('#reviewStage')?.classList.contains('hidden'),undefined,{timeout:3500});`;
const b=patch(field,fieldOld,fieldCurrent,'8.12.3 field legacy upload→review flow');
if(!b.includes("field flow canonical Capture Field done action is not enabled after photo draft"))fail('8.12.3 Capture Field completion assertion missing');

console.log('[AXIS 8.18 inherited test-flow seal] PASS · 8.12.1 + 8.12.3 inherited photo flows follow canonical draft → 完成 → review · planner/repaint/reopen/apply/save assertions unchanged');
