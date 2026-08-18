import fs from 'node:fs';

const FILE='scripts/axis-8101-smoke.mjs';
const fail=m=>{throw new Error(`[AXIS 8.10.1 test flow] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
const release=JSON.parse(fs.readFileSync('release-contract.json','utf8')).publicVersion;
let src=fs.readFileSync(FILE,'utf8');
const replaceOnce=(from,to,label)=>{const n=src.split(from).length-1;if(n===1){src=src.replace(from,to);return}if(n===0&&src.includes(to))return;fail(`${label} expected once, found ${n}`)};

if(release==='8.12'){
  const staleRest="activity:{status:'active',startedAt:t-7200000,lastResumedAt:t-7200000,pausedAt:null,finishedAt:null,estimateMs:600000,completedSets:1,intervals:[{start:t-7200000,end:null}],restStartedAt:rest}";
  const pausedRest="activity:{status:'paused',startedAt:t-7200000,lastResumedAt:t-7200000,pausedAt:rest,finishedAt:null,estimateMs:600000,completedSets:1,intervals:[{start:t-7200000,end:rest}],restStartedAt:rest,restAccumulatedMs:0}";
  replaceOnce(staleRest,pausedRest,'8.10.1 explicit paused-rest fixture');

  const staleSummary="assert.equal(entry.className,'settingLink');assert.equal(entry.span,'学习安排');assert.equal(entry.b,'自定','non-default cadence must use the compact custom summary');assert.equal(entry.small,false,'learning Settings row still uses a special two-line layout');await page.locator('#v810ConfigEntry').click();await page.waitForFunction(()=>document.querySelector('#v810ConfigPanel')?.classList.contains('show'));assert.equal(await page.locator('#v810SpeakControls [data-v810-options=\"opportunity\"] button').count(),4,'opportunity control is incomplete');";
  const currentSummary="assert.equal(entry.className,'settingLink');assert.equal(entry.span,'学习安排');assert.equal(entry.b,'智能 · 混合','8.12 top-level learning summary must remain purpose + method');assert.equal(entry.small,false,'learning Settings row still uses a special two-line layout');await page.locator('#v810ConfigEntry').click();await page.waitForFunction(()=>document.querySelector('#v813LearningGate')?.classList.contains('open')&&document.querySelector('#v810ConfigPanel'));assert.equal((await page.locator('#v811FineTuneState').textContent())?.trim(),'已自定','non-default cadence must remain visible as fine-tune customization');assert.equal(await page.locator('#v810SpeakControls [data-v810-options=\"opportunity\"] button').count(),4,'opportunity control is incomplete');";
  replaceOnce(staleSummary,currentSummary,'8.12 learning summary + inline Settings contract');

  const oldClose="await page.locator('#v810ConfigPanel [data-v810-config-close]').click();";
  const inlineClose="await page.locator('#v810ConfigEntry').click();await page.waitForFunction(()=>!document.querySelector('#v813LearningGate')?.classList.contains('open'));";
  replaceOnce(oldClose,inlineClose,'8.10.1 inline Learning close');

  if(src.includes("entry.b,'自定'"))fail('8.10.1 stale top-level 自定 summary assertion survived');
  if(!src.includes("entry.b,'智能 · 混合'"))fail('8.12 purpose + method summary assertion missing');
  if(!src.includes("#v811FineTuneState"))fail('8.12 fine-tune customization assertion missing');
  if(src.includes("#v810ConfigPanel')?.classList.contains('show')"))fail('8.10.1 inherited test still requires a dedicated Learning sheet');
  if(!src.includes("#v813LearningGate')?.classList.contains('open')"))fail('8.10.1 inline Learning gate assertion missing');
}
fs.writeFileSync(FILE,src);
console.log(`[AXIS 8.10.1 test flow] PASS · ${release==='8.12'?'explicit paused rest + inline Learning Settings + 8.12 purpose/method summary with visible fine-tune state':'historical flow preserved'}`);
