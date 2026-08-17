import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const FILE='scripts/axis-882-smoke.mjs';
const fail=m=>{throw new Error(`[AXIS 8.9 test flow] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
const release=JSON.parse(fs.readFileSync('release-contract.json','utf8')).publicVersion;
let src=fs.readFileSync(FILE,'utf8');
const replaceOnce=(from,to,label)=>{const n=src.split(from).length-1;if(n===1){src=src.replace(from,to);return}if(n===0&&src.includes(to))return;fail(`${label} expected once, found ${n}`)};
const staleVision=`await upload();await page.waitForFunction(()=>document.querySelector('#aiStatus')?.textContent?.includes('本地认出'),undefined,{timeout:1800});
assert.equal((await page.locator('#equipmentName').innerText()).trim(),'高位下拉');assert.equal((await page.locator('#aiStatus').innerText()).trim(),'本地认出');`;
const alignedVision=`await upload();await page.waitForFunction(()=>{const v=window.__AXIS_LOCAL_VISION__?.snapshot?.(),status=document.querySelector('#aiStatus')?.textContent?.trim(),equipment=document.querySelector('#equipmentName')?.textContent?.trim();return v?.version===2&&v?.last?.stage==='guess'&&v.last.usable===true&&v.last.best?.id==='lat'&&equipment==='高位下拉'&&status==='请确认'},undefined,{timeout:2500});
const vision=await page.evaluate(()=>window.__AXIS_LOCAL_VISION__?.snapshot?.());assert.equal(vision?.version,2,'Local Vision v2 diagnostic missing');assert.ok(vision?.memories?.some(x=>x.equipmentId==='lat'&&x.sig?.full&&x.sig?.center&&x.sig?.zones),'confirmed equipment memory missing canonical multi-signal signature');assert.equal(vision?.last?.best?.id,'lat','local memory did not rank confirmed equipment first');assert.equal(vision?.last?.usable,true,'local memory candidate did not meet usable threshold');assert.equal((await page.locator('#equipmentName').innerText()).trim(),'高位下拉');assert.equal((await page.locator('#aiStatus').innerText()).trim(),'请确认','AI-unavailable flow must preserve local preselection but require confirmation');`;
replaceOnce(staleVision,alignedVision,'Local Vision v2 semantic assertion');
const staleFinish="assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.status), 'finished');assert.deepEqual(await page.evaluate(()=>window.__AXIS_882_CUES__),[],'manual long-press finish emitted an automatic sound');";
const alignedFinish="await page.waitForFunction(id=>{const m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),meta=m.events?.[id]?.activity?.status,active=(c.active?.events||[]).some(x=>x.id===id),archived=(c.sessions||[]).some(s=>(s.events||[]).some(x=>x.id===id));return meta==='finished'||(!active&&archived)},activeId,{timeout:1800});const finishDiag=await page.evaluate(id=>{const m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return{id,metaStatus:m.events?.[id]?.activity?.status||null,activeHas:(c.active?.events||[]).some(x=>x.id===id),sessionHas:(c.sessions||[]).some(s=>(s.events||[]).some(x=>x.id===id)),activeId:c.active?.id||null,home:window.__AXIS_HOME_STATE__||null}},activeId);console.log('[AXIS 8.9 manual finish diagnostic]',JSON.stringify(finishDiag));assert.ok(finishDiag.metaStatus==='finished'||(!finishDiag.activeHas&&finishDiag.sessionHas),`manual finish did not persist finished metadata or canonical session archive: ${JSON.stringify(finishDiag)}`);assert.deepEqual(await page.evaluate(()=>window.__AXIS_882_CUES__),[],'manual long-press finish emitted an automatic sound');";
replaceOnce(staleFinish,alignedFinish,'manual-finish canonical persistence assertion');
if(release==='8.12'){
 const staleRest=`await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='rest',undefined,{timeout:1800});

console.log(\`[AXIS 8.8.2 \${ENGINE}] home rest intelligence: rest -> warn -> danger -> paused\`);
const activeId=await page.locator('#v87Finish').getAttribute('data-id');assert.ok(activeId);
await page.evaluate(id=>{const k='axis_v8_meta',m=JSON.parse(localStorage.getItem(k)||'{}'),a=m.events?.[id]?.activity;if(!a)throw new Error('activity missing');m.prefs=m.prefs||{};m.prefs.reminderTiming='90';a.restStartedAt=Date.now()-95000;localStorage.setItem(k,JSON.stringify(m))},activeId);
await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='warn',undefined,{timeout:1800});assert.match((await page.locator('#axisNowTitle').innerText()).trim(),/休息偏久/);
await page.evaluate(id=>{const k='axis_v8_meta',m=JSON.parse(localStorage.getItem(k)||'{}'),a=m.events?.[id]?.activity;a.restStartedAt=Date.now()-225000;localStorage.setItem(k,JSON.stringify(m))},activeId);
await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='danger',undefined,{timeout:1800});assert.match((await page.locator('#axisNowTitle').innerText()).trim(),/休息过久/);
await page.locator('#v87Toggle').click();await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='paused',undefined,{timeout:1800});
assert.equal((await page.locator('#v87Toggle').innerText()).trim(),'▶','single paused item did not expose canonical resume control');await page.locator('#v87Toggle').click();await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='active',undefined,{timeout:1800});`;
 const alignedRest=`await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='active',undefined,{timeout:1800});

console.log(\`[AXIS 8.8.2 \${ENGINE}] explicit pause owns rest timing; set completion stays active\`);
const activeId=await page.locator('#v87Finish').getAttribute('data-id');assert.ok(activeId);
let activity=await page.evaluate(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity,activeId);assert.equal(activity?.status,'active');assert.equal(activity?.restStartedAt,null,'完成一组 must not begin rest');assert.doesNotMatch((await page.locator('#v87Rest').innerText())||'',/^休息/,'完成一组 must not render rest');
await page.locator('#v87Toggle').click();await page.waitForFunction(id=>{const a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity;return a?.status==='paused'&&Number(a.restStartedAt)>0&&window.__AXIS_HOME_STATE__?.mode==='paused'},activeId,{timeout:1800});
assert.equal((await page.locator('#v87Toggle').innerText()).trim(),'▶','paused item did not expose canonical resume control');assert.match((await page.locator('#v87Rest').innerText())||'',/^休息/,'pause did not expose rest timer');
await page.waitForTimeout(180);await page.locator('#v87Toggle').click();await page.waitForFunction(id=>{const a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity;return a?.status==='active'&&a.restStartedAt==null&&Number(a.restAccumulatedMs)>=0&&window.__AXIS_HOME_STATE__?.mode==='active'},activeId,{timeout:1800});`;
 replaceOnce(staleRest,alignedRest,'8.12 explicit pause/rest semantic assertion');
}
fs.writeFileSync(FILE,src);
if(src.includes("includes('本地认出')"))fail('retired Local Vision status assertion survived');
if(!src.includes("status==='请确认'"))fail('8.9 frontier-confirmation assertion missing');
if(!src.includes("x.equipmentId==='lat'&&x.sig?.full&&x.sig?.center&&x.sig?.zones"))fail('Local Vision persisted-signature assertion missing');
if(!src.includes("manual finish did not persist finished metadata or canonical session archive"))fail('8.9 canonical manual-finish persistence assertion missing');
if(release==='8.12'&&src.includes("mode==='rest'"))fail('8.12 test contract still treats set completion as automatic rest');
if(release==='8.12'&&!src.includes('pause did not expose rest timer'))fail('8.12 explicit pause/rest assertion missing');
if(release==='8.12'){
 if(!fs.existsSync('scripts/prepare-891-test-flow.mjs'))fail('AXIS 8.9.1 explicit-rest test-flow convergence is missing');
 execFileSync(process.execPath,['scripts/prepare-891-test-flow.mjs'],{stdio:'inherit'});
}
console.log(`[AXIS 8.9 test flow] PASS · inherited memory verifies v2 prior/confirmation · manual finish accepts persisted/archive · ${release==='8.12'?'pause owns rest':'legacy rest flow preserved'}`);
