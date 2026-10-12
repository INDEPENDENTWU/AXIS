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
const memoryBegin="await upload();try{await page.waitForFunction(",memoryEnd="console.log(`[AXIS 8.8.2 ${ENGINE}] active surface keeps one node through 完成一组`);";
const a=memory.indexOf(memoryBegin),b=memory.indexOf(memoryEnd,a);
if(a<0||b<=a||memory.indexOf(memoryBegin,a+1)>=0)fail('8.8.2 generated local-memory anchor drift');
const section=memory.slice(a,b),n=section.split("'lat'").length-1;
if(n<2||n>15)fail('unexpected 8.8.2 legacy-ID expectations: '+n);
const fixed=section.replaceAll("'lat'","'lat-pulldown'");
assert.ok(!fixed.includes("==='lat'"),'local-memory alias expectation survived');
memory=memory.slice(0,a)+fixed+memory.slice(b);
write(memoryFile,memory);
console.log('[AXIS 8.32 inherited regressions] PASS · foreign Active protected; local memory exact canonical ID');
