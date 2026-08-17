import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const FILE='scripts/axis-891-smoke.mjs';
const fail=m=>{throw new Error(`[AXIS 8.9.1 test flow] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
const release=JSON.parse(fs.readFileSync('release-contract.json','utf8')).publicVersion;
let src=fs.readFileSync(FILE,'utf8');
if(release==='8.12'){
  const stale="const meta={prefs:{},events:{E891R:{activity:{status:'active',startedAt:start,lastResumedAt:start,pausedAt:null,finishedAt:null,estimateMs:240000,completedSets:1,intervals:[{start,end:null}],restStartedAt:rest},sets:[{state:'done',doneAt:rest},{state:'assumed',doneAt:null},{state:'assumed',doneAt:null}]}}};";
  const aligned="const meta={prefs:{},events:{E891R:{activity:{status:'paused',startedAt:start,lastResumedAt:start,pausedAt:rest,finishedAt:null,estimateMs:240000,completedSets:1,intervals:[{start,end:rest}],restStartedAt:rest,restAccumulatedMs:0},sets:[{state:'done',doneAt:rest},{state:'assumed',doneAt:null},{state:'assumed',doneAt:null}]}}};";
  const n=src.split(stale).length-1;
  if(n===1)src=src.replace(stale,aligned);
  else if(n===0&&!src.includes(aligned))fail(`explicit pause fixture expected once, found ${n}`);
  else if(n>1)fail(`explicit pause fixture duplicated ${n} times`);
  if(src.includes("status:'active',startedAt:start,lastResumedAt:start,pausedAt:null,finishedAt:null,estimateMs:240000,completedSets:1,intervals:[{start,end:null}],restStartedAt:rest"))fail('active+rest fixture survived');
  if(!src.includes("status:'paused',startedAt:start,lastResumedAt:start,pausedAt:rest"))fail('explicit paused-rest fixture missing');
}
fs.writeFileSync(FILE,src);
if(release==='8.12'){
  if(!fs.existsSync('scripts/prepare-810-test-flow.mjs'))fail('AXIS 8.10 explicit-rest test-flow convergence is missing');
  execFileSync(process.execPath,['scripts/prepare-810-test-flow.mjs'],{stdio:'inherit'});
}
console.log(`[AXIS 8.9.1 test flow] PASS · ${release==='8.12'?'learning rail requires explicit paused rest':'historical flow preserved'}`);
