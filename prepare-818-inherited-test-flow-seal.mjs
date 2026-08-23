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

/* 8.17 intentionally collapsed the historical three Quick Record media buttons
   (photo / 3-second video / 5-second video) into one supplemental Evidence entry.
   3/5 now exclusively mean Scan sampling duration. Keep the old 8.8.2 regression
   useful by asserting the one current entry physically enters the canonical Capture
   owner with the selected custom equipment and quick-media intent. */
const smoke882='scripts/axis-882-smoke.mjs';
if(!fs.existsSync(smoke882))fail(`missing ${smoke882}`);
let c=fs.readFileSync(smoke882,'utf8');
const quickOld=`assert.equal(await page.locator('#v882QuickMedia [data-v882-media]').count(),3);
await page.evaluate(()=>{window.__AXIS_882_MEDIA_CALLS__=[];window.__AXIS_CAPTURE__.beginQuickMedia=(mode,id)=>window.__AXIS_882_MEDIA_CALLS__.push({mode:String(mode),id})});
for(const mode of ['photo','3','5'])await page.locator(\`#v882QuickMedia [data-v882-media="${'${mode}'}"]\`).click();
assert.deepEqual(await page.evaluate(()=>window.__AXIS_882_MEDIA_CALLS__),[{mode:'photo',id:'custom-waist'},{mode:'3',id:'custom-waist'},{mode:'5',id:'custom-waist'}]);`;
const quickCurrent=`assert.equal(await page.locator('#v882QuickMedia [data-v882-media]').count(),1,'Quick Record must expose one current supplemental Evidence entry');
assert.equal(await page.locator('#v882QuickMedia [data-v882-media="photo"]').count(),1,'Quick Evidence entry must hand off to canonical Capture');
await page.locator('#v882QuickMedia [data-v882-media="photo"]').click();
await page.waitForFunction(()=>{const s=document.querySelector('#scanSheet'),snap=window.__AXIS_CAPTURE__?.snapshot?.();return s?.classList.contains('show')&&s.dataset.captureOwner==='canonical'&&s.dataset.captureIntent==='quick-media'&&snap?.selectedEq==='custom-waist'&&snap?.mode==='photo'},undefined,{timeout:1600});
const quickSnap=await page.evaluate(()=>window.__AXIS_CAPTURE__?.snapshot?.());
assert.equal(quickSnap?.selectedEq,'custom-waist','Quick Evidence lost selected custom equipment');
assert.equal(quickSnap?.mode,'photo','Quick Evidence did not enter photo capture mode');
assert.equal(quickSnap?.owner,'canonical','Quick Evidence bypassed canonical capture owner');
assert.equal(quickSnap?.intent,'quick-media','Quick Evidence entered the wrong capture intent');`;
let n=c.split(quickOld).length-1;if(n!==1)fail(`8.8.2 legacy three-choice Quick media flow expected once, found ${n}`);c=c.replace(quickOld,quickCurrent);
const uploadOld=`await page.locator('#photoInput').setInputFiles({name:'known-machine.svg',mimeType:'image/svg+xml',buffer:svg});await page.waitForFunction(()=>document.querySelector('#reviewStage')&&!document.querySelector('#reviewStage').classList.contains('hidden'),undefined,{timeout:1800})`;
const uploadCurrent=`await page.locator('#photoInput').setInputFiles({name:'known-machine.svg',mimeType:'image/svg+xml',buffer:svg});if(await page.locator('#v816CaptureDone').count()){await page.waitForFunction(()=>document.querySelectorAll('#v816DraftRail .v816DraftItem').length>0&&document.querySelector('#v816CaptureDone')?.disabled===false,undefined,{timeout:1800});assert.equal(await page.locator('#v816CaptureDone').isEnabled(),true,'8.8.2 inherited visual-memory capture draft cannot complete');await page.locator('#v816CaptureDone').click()}await page.waitForFunction(()=>document.querySelector('#reviewStage')&&!document.querySelector('#reviewStage').classList.contains('hidden'),undefined,{timeout:1800})`;
n=c.split(uploadOld).length-1;if(n!==1)fail(`8.8.2 legacy visual-memory upload→review flow expected once, found ${n}`);c=c.replace(uploadOld,uploadCurrent);
if(!c.includes("Quick Evidence lost selected custom equipment")||!c.includes('8.8.2 inherited visual-memory capture draft cannot complete'))fail('8.8.2 inherited flow assertions missing');
fs.writeFileSync(smoke882,c);

console.log('[AXIS 8.18 inherited test-flow seal] PASS · 8.12.1 + 8.12.3 photo flows use canonical draft → 完成 → review · 8.8.2 Quick Evidence physically verifies canonical quick-media handoff · visual-memory capture uses current completion flow');
