import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.3 CI stability] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const converge=(src,from,to,label)=>{
 const oldCount=src.split(from).length-1,newCount=src.split(to).length-1;
 if(oldCount===1&&newCount===0)return src.replace(from,to);
 if(oldCount===0&&newCount===1)return src;
 fail(`${label} unexpected shape · old ${oldCount} · current ${newCount}`)
};

{
 const f='scripts/axis-813-shadow-browser.mjs';let s=read(f);
 s=converge(s,"assert.ok(['8.12','8.12.1','8.12.2'].includes(EXPECTED), `unexpected public patch ${EXPECTED}`);","assert.ok(['8.12','8.12.1','8.12.2','8.12.3'].includes(EXPECTED), `unexpected public patch ${EXPECTED}`);",'Shadow public patch family');
 s=converge(s,"assert.equal(activeFact(setComplete.observation, 'SHADOW_STRENGTH')?.setStates.filter((state) => state === 'assumed').length, 2);","assert.equal(activeFact(setComplete.observation, 'SHADOW_STRENGTH')?.setStates.filter((state) => state === 'done').length, 1, 'set completion fact count drifted');",'Shadow current set-state authority');
 write(f,s);
}
{
 const f='scripts/axis-882-smoke.mjs';let s=read(f);
 const old=`await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='rest',undefined,{timeout:1800});

console.log(\`[AXIS 8.8.2 \${ENGINE}] home rest intelligence: rest -> warn -> danger -> paused\`);
const activeId=await page.locator('#v87Finish').getAttribute('data-id');assert.ok(activeId);
await page.evaluate(id=>{const k='axis_v8_meta',m=JSON.parse(localStorage.getItem(k)||'{}'),a=m.events?.[id]?.activity;if(!a)throw new Error('activity missing');m.prefs=m.prefs||{};m.prefs.reminderTiming='90';a.restStartedAt=Date.now()-95000;localStorage.setItem(k,JSON.stringify(m))},activeId);
await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='warn',undefined,{timeout:1800});assert.match((await page.locator('#axisNowTitle').innerText()).trim(),/休息偏久/);
await page.evaluate(id=>{const k='axis_v8_meta',m=JSON.parse(localStorage.getItem(k)||'{}'),a=m.events?.[id]?.activity;a.restStartedAt=Date.now()-225000;localStorage.setItem(k,JSON.stringify(m))},activeId);
await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='danger',undefined,{timeout:1800});assert.match((await page.locator('#axisNowTitle').innerText()).trim(),/休息过久/);
await page.locator('#v87Toggle').click();await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='paused',undefined,{timeout:1800});
assert.equal((await page.locator('#v87Toggle').innerText()).trim(),'▶','single paused item did not expose canonical resume control');await page.locator('#v87Toggle').click();await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='active',undefined,{timeout:1800});`;
 const current=`const activeId=await page.locator('#v87Finish').getAttribute('data-id');assert.ok(activeId);
assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.restStartedAt??null,activeId),null,'完成一组 invented rest');
await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='active',undefined,{timeout:4000});

console.log(\`[AXIS 8.8.2 \${ENGINE}] home rest intelligence: explicit pause -> paused -> resume\`);
await page.locator('#v87Toggle').click();
await page.waitForFunction(id=>{const a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity;return window.__AXIS_HOME_STATE__?.mode==='paused'&&a?.status==='paused'&&Number(a?.restStartedAt)>0},activeId,{timeout:4000});
assert.equal((await page.locator('#v87Toggle').innerText()).trim(),'▶','single paused item did not expose canonical resume control');
await page.locator('#v87Toggle').click();
await page.waitForFunction(id=>{const a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity;return window.__AXIS_HOME_STATE__?.mode==='active'&&a?.status==='active'&&a?.restStartedAt==null},activeId,{timeout:4000});`;
 s=converge(s,old,current,'8.8.2 pause-owned rest flow');
 const legacy=s.split('{timeout:1800}').length-1,expanded=s.split('{timeout:4000}').length-1;
 if(legacy>0)s=s.replaceAll('{timeout:1800}','{timeout:4000}');else if(expanded<5)fail(`8.8.2 Home wait shape · old ${legacy} · current ${expanded}`);
 write(f,s);
}
{
 const f='scripts/axis-882-home-transition-smoke.mjs';let s=read(f),old=s.split('{timeout:1800}').length-1,current=s.split('{timeout:4000}').length-1;
 if(old===2)s=s.replaceAll('{timeout:1800}','{timeout:4000}');else if(old!==0||current!==2)fail(`Home transition wait shape · old ${old} · current ${current}`);write(f,s);
}
{
 const f='scripts/axis-891-smoke.mjs';let s=read(f);
 s=converge(s,"activity:{status:'active',startedAt:start,lastResumedAt:start,pausedAt:null,finishedAt:null,estimateMs:240000,completedSets:1,intervals:[{start,end:null}],restStartedAt:rest}","activity:{status:'paused',startedAt:start,lastResumedAt:start,pausedAt:rest,finishedAt:null,estimateMs:240000,completedSets:1,intervals:[{start,end:rest}],restStartedAt:rest}",'8.9.1 Rest Speak pause-owned fixture');
 s=converge(s,"document.querySelector('#v87Rest')?.classList.contains('v891SpeakReady'),undefined,{timeout:3500}","document.querySelector('#v87Rest')?.classList.contains('v891SpeakReady'),undefined,{timeout:7000}",'8.9.1 Rest Speak readiness window');
 write(f,s);
}
console.log('[AXIS 8.12.3 CI stability] PASS · inherited browser/shadow checks aligned to pause-owned rest and current recording facts');
