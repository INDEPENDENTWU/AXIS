import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const FILE='scripts/axis-810-smoke.mjs';
const fail=m=>{throw new Error(`[AXIS 8.10 test flow] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
const release=JSON.parse(fs.readFileSync('release-contract.json','utf8')).publicVersion;
let src=fs.readFileSync(FILE,'utf8');
if(release==='8.12'){
 const stale="activity:{status:'active',startedAt:t-600000,lastResumedAt:t-600000,pausedAt:null,finishedAt:null,estimateMs:600000,completedSets:1,intervals:[{start:t-600000,end:null}],restStartedAt:t-50000}";
 const aligned="activity:{status:'paused',startedAt:t-600000,lastResumedAt:t-600000,pausedAt:t-50000,finishedAt:null,estimateMs:600000,completedSets:1,intervals:[{start:t-600000,end:t-50000}],restStartedAt:t-50000,restAccumulatedMs:0}";
 const n=src.split(stale).length-1;
 if(n===1)src=src.replace(stale,aligned);else if(n===0&&!src.includes(aligned))fail(`explicit pause fixture expected once, found ${n}`);else if(n>1)fail(`explicit pause fixture duplicated ${n} times`);
 if(src.includes(stale))fail('8.10 active+rest fixture survived');
 if(!src.includes(aligned))fail('8.10 explicit paused-rest fixture missing');

 const legacyOpen="document.querySelector('#v810ConfigPanel')?.classList.contains('show')&&document.querySelector('#v810SpeakControls')";
 const inlineOpen="document.querySelector('#v813LearningGate')?.classList.contains('open')&&document.querySelector('#v810ConfigPanel')&&document.querySelector('#v810SpeakControls')";
 const openCount=src.split(legacyOpen).length-1;
 if(openCount===1)src=src.replace(legacyOpen,inlineOpen);else if(openCount===0&&!src.includes(inlineOpen))fail(`legacy Learning panel visibility assertion expected once, found ${openCount}`);else if(openCount>1)fail(`legacy Learning panel visibility assertion duplicated ${openCount} times`);
 const legacyClose="await page.locator('#v810ConfigPanel [data-v810-config-close]').click();";
 const inlineClose="await page.locator('#v810ConfigEntry').click();await page.waitForFunction(()=>!document.querySelector('#v813LearningGate')?.classList.contains('open'));";
 const closeCount=src.split(legacyClose).length-1;
 if(closeCount===1)src=src.replace(legacyClose,inlineClose);else if(closeCount===0&&!src.includes(inlineClose))fail(`legacy Learning panel close assertion expected once, found ${closeCount}`);else if(closeCount>1)fail(`legacy Learning panel close assertion duplicated ${closeCount} times`);
 if(src.includes("#v810ConfigPanel')?.classList.contains('show')"))fail('8.10 inherited test still requires a dedicated Learning sheet');
}
fs.writeFileSync(FILE,src);
if(release==='8.12'){
 if(!fs.existsSync('scripts/prepare-8101-test-flow.mjs'))fail('AXIS 8.10.1 test-flow convergence is missing');
 execFileSync(process.execPath,['scripts/prepare-8101-test-flow.mjs'],{stdio:'inherit'});
}
console.log(`[AXIS 8.10 test flow] PASS · ${release==='8.12'?'explicit paused rest · inline Learning Settings owner · 8.10.1 inherited UI aligned':'historical flow preserved'}`);
