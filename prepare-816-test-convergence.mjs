import fs from 'node:fs';

const FILE='scripts/axis-816-capture-evidence-smoke.mjs';
const fail=m=>{throw new Error(`[AXIS 8.16 test convergence] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);src=src.replace(from,to)};
once("await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:12000});","await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_STABLE_COMPLETE__===true&&window.__AXIS_816_CAPTURE_ENTRY_READY__===true,undefined,{timeout:14000});",'stable Capture entry readiness');
once("capture:window.__AXIS_CAPTURE__?{maxPhotos:window.__AXIS_CAPTURE__.maxPhotos,maxVideoMs:window.__AXIS_CAPTURE__.maxVideoMs,hasDraft:typeof window.__AXIS_CAPTURE__.draft==='function'}:null","capture:window.__AXIS_CAPTURE__?{maxPhotos:window.__AXIS_CAPTURE__.maxPhotos,maxVideoMs:window.__AXIS_CAPTURE__.maxVideoMs,hasDraft:typeof window.__AXIS_CAPTURE__.draft==='function'}:null,entry:window.__AXIS_816_CAPTURE_ENTRY__||null,scanEntryOwner:document.querySelector('#scanBtn')?.dataset.axisCaptureEntryOwner||''",'boot entry diagnostic');
once("assert.equal(boot.capture?.hasDraft,true,'extended canonical Capture bridge missing draft API');","assert.equal(boot.capture?.hasDraft,true,'extended canonical Capture bridge missing draft API');\n assert.equal(boot.entry?.owner,'v816-capture-entry-seal','final Capture entry seal missing after stable boot');\n assert.equal(boot.entry?.delegatesTo,'app.js','final Capture entry no longer delegates to canonical app owner');\n assert.equal(boot.scanEntryOwner,'v816-capture-entry-seal','visible main Capture button is not owned by the final entry seal');",'entry assertions');
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.16 test convergence] PASS · browser smoke waits for canonical stable completion and the final non-owning Capture entry route');
