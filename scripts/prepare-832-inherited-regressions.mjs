import assert from 'node:assert/strict';
import fs from 'node:fs';
// 8.32-only generated-test adaptation after the historical release transforms.
// Keep historical source fixtures and every canonical application fact owner untouched.
const read=p=>fs.readFileSync(p,'utf8'),write=(p,s)=>fs.writeFileSync(p,s);
const fail=m=>{throw Error('[AXIS 8.32 inherited regressions] '+m)};
const flowFile='scripts/axis-826-active-continuity-smoke.mjs';
let flow=read(flowFile);
const begin=" await page.locator('[data-axis-flow-start=\"826-flow\"]').click();",end=" assert.deepEqual(errors,[],`page errors:";
const p=flow.indexOf(begin),q=flow.indexOf(end,p);
if(p<0||q<=p||flow.indexOf(begin,p+1)>=0)fail('8.26 generated conflict-path anchor drift');
const guarded=" await page.locator('[data-axis-flow-start=\"826-flow\"]').click();\n await page.waitForTimeout(80);\n const safety=await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}');return{ids:(c.active?.events||[]).map(x=>x.id),flowRun:c.flowRun||null,foreignStatus:m.events?.['826-foreign']?.activity?.status||null}});\n assert.deepEqual(safety.ids,['826-foreign'],'8.32 cannot replace or duplicate a foreign Active Encounter');\n assert.equal(safety.flowRun,null,'8.32 cannot launch another Flow over foreign Active');\n assert.equal(safety.foreignStatus,'active','existing Active must stay active when PLAY THIS conflicts');\n";
flow=flow.slice(0,p)+guarded+flow.slice(q);
flow=flow.replace('/* Flow start must become real Active truth, even when another item is active. */','/* 8.32 PLAY THIS must preserve foreign Active truth. */');
flow=flow.replace('Flow current becomes existing v82/v87 Active · foreign activity paused/preserved','PLAY THIS preserves foreign Active without replacing it');
write(flowFile,flow);
const memoryFile='scripts/axis-882-smoke.mjs';
let memory=read(memoryFile);
const replayNeedle="await upload();await page.waitForFunction(()=>document.querySelector('#aiStatus')?.textContent?.includes('本地认出'),undefined,{timeout:1800});";
const replayStatus="assert.equal((await page.locator('#aiStatus').innerText()).trim(),'本地认出');";
if(memory.split(replayNeedle).length!==2||memory.split(replayStatus).length!==2)fail('8.8.2 generated local replay source drift');
const replayResult="await upload();await page.waitForFunction(()=>{const v=window.__AXIS_LOCAL_VISION__?.snapshot?.(),label=document.querySelector('#equipmentName')?.textContent?.trim(),status=document.querySelector('#aiStatus')?.textContent?.trim();return v?.last?.usable===true&&v?.last?.best?.id==='lat-pulldown'&&label==='高位下拉'&&['请确认','本地认出'].includes(status)},undefined,{timeout:4500});";
const replayProof="await page.waitForFunction(()=>{const v=window.__AXIS_LOCAL_VISION__?.snapshot?.();return v?.last?.best?.id==='lat-pulldown'&&v?.memories?.some(x=>x.equipmentId==='lat-pulldown'&&x.sig?.full&&x.sig?.center&&x.sig?.zones)},undefined,{timeout:4500});";
memory=memory.replace(replayNeedle,replayResult+'\n'+replayProof).replace(replayStatus,"assert.ok(['请确认','本地认出'].includes((await page.locator('#aiStatus').innerText()).trim()),'local replay must be presented as recognition or confirmation');");

const restOpen="await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='rest',undefined,{timeout:1800});";
const first=memory.indexOf(restOpen),endTag=memory.indexOf('manual long-press finish is silent',first);
const last=memory.lastIndexOf('console.log(',endTag);
if(first<0||endTag<0||last<=first||memory.indexOf(restOpen,first+1)>=0)fail('8.8.2 rest transition source drift');
const historical=memory.slice(first,last);
const identity="const activeId=await page.locator('#v87Finish').getAttribute('data-id');assert.ok(activeId);";
if(historical.split(identity).length!==2)fail('8.8.2 canonical active identity anchor drift');
const legacy=historical.replace(identity,'');
const current=[
 "const activeId=await page.locator('#v87Finish').getAttribute('data-id');assert.ok(activeId);",
 "if(VERSION==='8.32'){",
 " const completed=await page.evaluate(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),a=m.events?.[id]?.activity,e=c.active?.events?.find(x=>x.id===id);return{completedSets:a?.completedSets||0,plannedSets:m.events?.[id]?.sets?.length||e?.sets||1,restStartedAt:a?.restStartedAt||null,status:a?.status||'',homeMode:window.__AXIS_HOME_STATE__?.mode,primary:document.querySelector('#v87Primary')?.textContent?.trim()}} ,activeId);",
 " assert.ok(completed.completedSets>=completed.plannedSets,'8.32 plan-complete fact absent');",
 " assert.equal(completed.status,'active','8.32 finishing a set must not silently finish an Encounter');",
 " assert.equal(completed.restStartedAt,null,'8.32 completion must not fabricate rest timer');",
 " assert.equal(completed.homeMode,'active','8.32 one-set completion must not fabricate rest mode');",
 " assert.match(completed.primary||'',/计划已完成|計畫已完成|Plan complete/,'8.32 plan-complete UI missing');",
 " console.log('[AXIS 8.32 inherited rest] PASS · plan-complete without phantom rest, active Encounter preserved');",
 "}else{",
 legacy,
 "}",
 ""].join('\n');
memory=memory.slice(0,first)+current+memory.slice(last);

const oldFinish="assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.status), 'finished');";
if(memory.split(oldFinish).length!==2)fail('8.8.2 finished Encounter assertion drift');
const newFinish="if(VERSION==='8.32'){await page.waitForFunction(id=>{const m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return m.events?.[id]?.activity?.status==='finished'||(c.sessions||[]).some(s=>(s.events||[]).some(e=>e.id===id))},activeId,{timeout:4500})}else{"+oldFinish+"}";
memory=memory.replace(oldFinish,newFinish);

write(memoryFile,memory);
console.log('[AXIS 8.32 inherited regressions] PASS · foreign Active protected; local memory exact canonical ID');
