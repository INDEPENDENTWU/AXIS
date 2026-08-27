import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.21 Flow Active boot scope] ${m}`)};
let s=fs.readFileSync(FILE,'utf8');

/*
 * Flow Active convergence deliberately reuses private app/Flow state. The
 * lifecycle listeners therefore have to live in the exact lexical scope that
 * owns axis821FlowRecordingIntent, axis821FlowRecorderContextClear and
 * axis821FlowOnActiveFinished. Merely moving them into an earlier app IIFE is
 * insufficient: the 8.21 Flow helpers are emitted in the item-unit scope.
 *
 * Keep the convergence pass as the behavior owner, but relocate its exact
 * emitted listener block immediately before axis821CompleteCurrentItem(), the
 * same anchor used to inject the helper block. No private helper is exported.
 */
const listenerBlock=`\nD.addEventListener('click',e=>{const sheet=$('#scanSheet');if(e.target.closest?.('[data-close="scanSheet"]')||e.target===sheet){axis821FlowRecordingIntent=null;axis821FlowRecorderContextClear()}},true);\nwindow.addEventListener('axis:active-finished',e=>axis821FlowOnActiveFinished(e?.detail?.id));\n`;
const hits=s.split(listenerBlock).length-1;
if(hits!==1)fail(`expected one emitted listener block, found ${hits}`);
s=s.replace(listenerBlock,'\n');

const completeAnchor='function axis821CompleteCurrentItem()';
const completeHits=s.split(completeAnchor).length-1;
if(completeHits!==1)fail(`completion anchor expected once, found ${completeHits}`);
const completeAt=s.indexOf(completeAnchor);
const clearAt=s.indexOf('function axis821FlowRecorderContextClear()');
const finishAt=s.indexOf('function axis821FlowOnActiveFinished(id)');
const intentAt=s.indexOf('let axis821FlowRecordingIntent=null;');
if(intentAt<0||clearAt<0||finishAt<0)fail('Flow private helper block missing');
if(!(intentAt<clearAt&&clearAt<finishAt&&finishAt<completeAt))fail('Flow helper ordering drift before completion anchor');

s=s.slice(0,completeAt)+listenerBlock+s.slice(completeAt);

const marker=';try{window.__AXIS_821_FLOW_ACTIVE_CONVERGENCE__=';
const markerAt=s.indexOf(marker);
if(markerAt<0)fail('Flow Active convergence marker missing');
const flag='flowEmbeddedInActiveHome:true';
if((s.split(flag).length-1)!==1)fail('Flow convergence marker shape drift');
s=s.replace(flag,'flowEmbeddedInActiveHome:true,bootScopedListeners:true');

const closeListener="D.addEventListener('click',e=>{const sheet=$('#scanSheet')";
const activeListener="window.addEventListener('axis:active-finished',e=>axis821FlowOnActiveFinished";
if((s.split(closeListener).length-1)!==1)fail('close listener must exist exactly once');
if((s.split(activeListener).length-1)!==1)fail('active-finished listener must exist exactly once');
const listenerAt=s.indexOf(closeListener),activeAt=s.indexOf(activeListener),newCompleteAt=s.indexOf(completeAnchor),newMarkerAt=s.indexOf(marker);
if(!(finishAt<listenerAt&&listenerAt<activeAt&&activeAt<newCompleteAt&&newCompleteAt<newMarkerAt))fail('Flow listeners are not co-located with private Flow helpers');
if(s.slice(newMarkerAt).includes(closeListener)||s.slice(newMarkerAt).includes(activeListener))fail('Flow listener survives in global convergence tail');
for(const privateName of ['axis821FlowRecorderContextClear','axis821FlowOnActiveFinished','axis821FlowRecordingIntent']){
 if(s.includes(`window.${privateName}=`)||s.includes(`window['${privateName}']`))fail(`private Flow helper exported: ${privateName}`);
}
if((s.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('Encounter append ownership drift');

try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,s);

/*
 * The inherited 8.12 Active contract is pause-owned rest: completing a set does
 * not itself start rest; pausing does. The first Flow/Active proof accidentally
 * asserted the pre-8.12 set-complete rest behavior. Align the physical proof to
 * the established owner instead of changing production behavior to satisfy a
 * stale assertion.
 */
const SMOKE='scripts/axis-821-item-unit-flow-smoke.mjs';
let smoke=fs.readFileSync(SMOKE,'utf8');
const stale=` await tap(page.locator('#v87Primary'));\n await page.waitForFunction(()=>document.querySelector('#v87Rest')?.textContent?.includes('休息'),undefined,{timeout:2500});\n await tap(page.locator('#v87Toggle'));\n await page.waitForFunction(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.status==='paused',first.id,{timeout:2500});\n assert.equal((await core()).flowRun.cursor,0,'pause changed Flow sequencing');\n await tap(page.locator('#v87Toggle'));\n await page.waitForFunction(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.status==='active',first.id,{timeout:2500});`;
const aligned=` await tap(page.locator('#v87Primary'));\n await page.waitForFunction(id=>{const a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity;return Number(a?.completedSets)>=1&&a?.status==='active'&&!a?.restStartedAt},first.id,{timeout:2500});\n assert.equal((await core()).flowRun.cursor,0,'set completion changed Flow sequencing');\n await tap(page.locator('#v87Toggle'));\n await page.waitForFunction(id=>{const a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity;return a?.status==='paused'&&!!a?.restStartedAt&&document.querySelector('#v87Rest')?.textContent?.includes('休息')},first.id,{timeout:2500});\n assert.equal((await core()).flowRun.cursor,0,'pause/rest changed Flow sequencing');\n await tap(page.locator('#v87Toggle'));\n await page.waitForFunction(id=>{const a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity;return a?.status==='active'&&!a?.restStartedAt},first.id,{timeout:2500});`;
const smokeHits=smoke.split(stale).length-1;
if(smokeHits!==1)fail(`pause-owned Flow smoke boundary expected once, found ${smokeHits}`);
smoke=smoke.replace(stale,aligned);
fs.writeFileSync(SMOKE,smoke);

console.log('[AXIS 8.21 Flow Active boot scope] PASS · lifecycle listeners share the private Flow helper lexical region · pause-owned rest proof aligned · no private state exported · one Encounter append retained');
