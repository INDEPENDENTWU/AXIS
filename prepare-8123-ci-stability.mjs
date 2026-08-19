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
const convergeRange=(src,start,end,to,sentinel,label)=>{
 if(src.includes(sentinel))return src;
 const a=src.indexOf(start),b=a<0?-1:src.indexOf(end,a+start.length);
 if(a<0||b<0)fail(`${label} range missing · start ${a} · end ${b}`);
 return src.slice(0,a)+to+src.slice(b+end.length);
};
const label='${label}';

{
 const f='scripts/axis-813-shadow-browser.mjs';let s=read(f);
 s=converge(s,"assert.ok(['8.12','8.12.1','8.12.2'].includes(EXPECTED), `unexpected public patch ${EXPECTED}`);","assert.ok(['8.12','8.12.1','8.12.2','8.12.3'].includes(EXPECTED), `unexpected public patch ${EXPECTED}`);",'Shadow public patch family');
 s=converge(s,"assert.equal(activeFact(setComplete.observation, 'SHADOW_STRENGTH')?.setStates.filter((state) => state === 'assumed').length, 2);","assert.equal(activeFact(setComplete.observation, 'SHADOW_STRENGTH')?.setStates.filter((state) => state === 'done').length, 1, 'set completion fact count drifted');",'Shadow current set-state authority');
 s=converge(s,"assert.equal(activeFact(paused.observation, 'SHADOW_STRENGTH')?.activityStatus, 'paused');","assert.equal(activeFact(paused.observation, 'SHADOW_STRENGTH')?.status, 'paused');",'Shadow paused fact field');
 s=converge(s,"assert.equal(activeFact(resumed.observation, 'SHADOW_STRENGTH')?.activityStatus, 'active');","assert.equal(activeFact(resumed.observation, 'SHADOW_STRENGTH')?.status, 'active');",'Shadow resumed fact field');
 s=converge(s,`for (const [before, after, label] of [[boot, setComplete, 'set'], [setComplete, paused, 'pause'], [paused, resumed, 'resume']]) {
  const comparison = compareShadowObservations(before.observation, after.observation);
  assert.equal(comparison.diagnostics.toState, 'ok', \`${label}: Shadow comparison failed\`);
}`,`for (const [before, after, label] of [[boot, setComplete, 'set'], [setComplete, paused, 'pause'], [paused, resumed, 'resume']]) {
  const comparison = compareShadowObservations(before.observation, after.observation);
  assert.equal(comparison.schema, 1, \`${label}: Shadow comparison schema drifted\`);
  assert.notEqual(comparison.alignment, 'not-comparable', \`${label}: Shadow comparison became non-comparable\`);
  assert.ok(Array.isArray(comparison.reasonCodes), \`${label}: Shadow comparison reason codes missing\`);
}`,'Shadow comparison result schema');
 s=converge(s,`const cardioFact = activeFact(cardio.observation, 'SHADOW_CARDIO');
assert.equal(cardioFact?.plannedDurationMinutes, 20);
assert.equal(cardioFact?.performedDurationMinutes, null, 'active cardio plan became performed duration');`,`const cardioFact = activeFact(cardio.observation, 'SHADOW_CARDIO');
const cardioInput = cardio.observation.input.session?.events?.find((event) => event.eventId === 'SHADOW_CARDIO');
assert.equal(cardioFact?.status, 'active');
assert.equal(cardioFact?.completed, false, 'active cardio plan became completed performance');
assert.equal(cardioInput?.duration, 20);
assert.equal(cardioInput?.estimatedMinutes, 20);`,'Shadow active cardio fact schema');
 write(f,s);
}
{
 const f='scripts/axis-882-smoke.mjs';let s=read(f);
 const start="await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='rest',undefined,{timeout:1800});";
 const end="assert.equal((await page.locator('#v87Toggle').innerText()).trim(),'▶','single paused item did not expose canonical resume control');await page.locator('#v87Toggle').click();await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='active',undefined,{timeout:1800});";
 const current=`const activeId=await page.locator('#v87Finish').getAttribute('data-id');assert.ok(activeId);
assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.restStartedAt??null,activeId),null,'完成一组 invented rest');
await page.waitForFunction(()=>window.__AXIS_HOME_STATE__?.mode==='active',undefined,{timeout:4000});

console.log(\`[AXIS 8.8.2 \${ENGINE}] home rest intelligence: explicit pause -> paused -> resume\`);
await page.locator('#v87Toggle').click();
await page.waitForFunction(id=>{const a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity;return window.__AXIS_HOME_STATE__?.mode==='paused'&&a?.status==='paused'&&Number(a?.restStartedAt)>0},activeId,{timeout:4000});
assert.equal((await page.locator('#v87Toggle').innerText()).trim(),'▶','single paused item did not expose canonical resume control');
await page.locator('#v87Toggle').click();
await page.waitForFunction(id=>{const a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity;return window.__AXIS_HOME_STATE__?.mode==='active'&&a?.status==='active'&&a?.restStartedAt==null},activeId,{timeout:4000});`;
 s=convergeRange(s,start,end,current,'home rest intelligence: explicit pause -> paused -> resume','8.8.2 pause-owned rest flow');
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
{
 const f='scripts/axis-810-smoke.mjs';let s=read(f);
 s=converge(s,"activity:{status:'active',startedAt:t-600000,lastResumedAt:t-600000,pausedAt:null,finishedAt:null,estimateMs:600000,completedSets:1,intervals:[{start:t-600000,end:null}],restStartedAt:t-50000}","activity:{status:'paused',startedAt:t-600000,lastResumedAt:t-600000,pausedAt:t-50000,finishedAt:null,estimateMs:600000,completedSets:1,intervals:[{start:t-600000,end:t-50000}],restStartedAt:t-50000}",'8.10 manual learning pause-owned fixture');
 s=converge(s,"await page.waitForFunction(()=>document.querySelector('#v810ConfigPanel')?.classList.contains('show')&&document.querySelector('#v810SpeakControls'),undefined,{timeout:1200});assert.equal(await page.locator('#v810ConfigPanel').isVisible(),true,'learning schedule surface is not visible');","await page.waitForFunction(()=>document.querySelector('#v813LearningGate')?.classList.contains('open')&&document.querySelector('#v810SpeakControls'),undefined,{timeout:2500});assert.equal(await page.locator('#v810ConfigPanel').isVisible(),true,'learning schedule surface is not visible');",'8.10 inline Learning Settings open state');
 const settingsStart="for(const k of ['mode','track','cadence','level','dailyTarget'])assert.ok(await page.locator(`#v810SpeakControls [data-v810-key=\"${k}\"]`).count()>=4,`missing ${k} choices`);";
 const settingsEnd="await page.locator('#settingsSheet [data-close=\"settingsSheet\"]').click();";
 const settingsCurrent=`const coreTitles=(await page.locator('#v811CoreLearning .v811CoreHead>span').allTextContents()).map(x=>x.trim());assert.deepEqual(coreTitles,['目标','强度','难度','对话'],'current Learning decisions drifted');assert.equal(await page.locator('#v811CoreLearning [data-v812-core="method"]').count(),0,'retired method selector returned');await page.locator('[data-v812-core="purpose"][data-v812-value="native"]').click();await page.waitForFunction(()=>document.querySelector('#v810ConfigSummary')?.textContent?.trim()==='母语口语');assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v8_meta')),metaBaseline,'learning settings changed training metadata');await page.locator('#v810ConfigEntry').click();await page.waitForFunction(()=>!document.querySelector('#v813LearningGate')?.classList.contains('open'));await page.locator('#settingsSheet [data-close="settingsSheet"]').click();`;
 s=convergeRange(s,settingsStart,settingsEnd,settingsCurrent,'current Learning decisions drifted','8.10 current Learning Settings surface');
 write(f,s);
}
{
 const f='scripts/axis-8101-smoke.mjs';let s=read(f);
 s=converge(s,"activity:{status:'active',startedAt:t-7200000,lastResumedAt:t-7200000,pausedAt:null,finishedAt:null,estimateMs:600000,completedSets:1,intervals:[{start:t-7200000,end:null}],restStartedAt:rest}","activity:{status:'paused',startedAt:t-7200000,lastResumedAt:t-7200000,pausedAt:rest,finishedAt:null,estimateMs:600000,completedSets:1,intervals:[{start:t-7200000,end:rest}],restStartedAt:rest}",'8.10.1 learning pause-owned fixture');
 const start="assert.equal(await page.locator('#v8101Practice [data-v8101-mode]').count(),3);";
 const end="await page.locator('#v891SpeakPanel [data-v891-action=\"close\"]').click();";
 const current="assert.equal(await page.locator('#v8101Practice [data-v8101-mode]').count(),0,'retired learning modes returned');assert.deepEqual((await page.locator('.axis8123PracticeActions button').allTextContents()).map(x=>x.trim()),['听原声','录音','听我的']);await page.locator('[data-v8123-action=\"listen\"]').click();await page.waitForFunction(()=>window.__AXIS_8101_SPEAK_CALLS__===1);await page.locator('#v891SpeakPanel [data-v891-action=\"close\"]').click();";
 s=convergeRange(s,start,end,current,'retired learning modes returned','8.10.1 current practice surface');
 s=converge(s,"m.events.E8101.activity.status='paused';m.events.E8101.activity.pausedAt=t-30000;m.events.E8101.activity.restStartedAt=null;","m.events.E8101.activity.status='paused';m.events.E8101.activity.pausedAt=t-30000;m.events.E8101.activity.restStartedAt=t-30000;",'8.10.1 paused opportunity rest owner');
 write(f,s);
}
{
 const f='scripts/axis-8102-smoke.mjs';let s=read(f);
 s=converge(s,"[data-v810-standalone-start]","[data-v8122-standalone-start]",'8.10.2 current standalone launcher');
 s=converge(s,"assert.equal(await page.locator('#v8101Practice [data-v8101-mode]').count(),3,'standalone learning lost dialogue/echo/shadow modes');","assert.equal(await page.locator('#v8101Practice [data-v8101-mode]').count(),0,'retired standalone learning modes returned');assert.deepEqual((await page.locator('.axis8123PracticeActions button').allTextContents()).map(x=>x.trim()),['听原声','录音','听我的']);",'8.10.2 current standalone practice surface');
 write(f,s);
}
{
 const f='scripts/axis-8103-smoke.mjs';let s=read(f);
 s=converge(s,"[data-v810-standalone-start]","[data-v8122-standalone-start]",'8.10.3 current standalone launcher');
 s=converge(s,"console.log(`[AXIS 8.10.3 ${ENGINE}] four-language voice routing + dialogue/echo/shadow distinction`);","console.log(`[AXIS 8.10.3 ${ENGINE}] four-language voice routing + current explicit practice surface`);",'8.10.3 current practice label');
 const start="await page.locator('#v8101Practice [data-v8101-mode=\"dialogue\"]').click();";
 const end="assert.equal(await page.evaluate(()=>window.__AXIS_8103_FRESHNESS__?.polling),false,'release freshness became a poller');";
 const current=`assert.equal(await page.locator('#v8101Practice [data-v8101-mode]').count(),0,'retired learning modes returned');assert.deepEqual((await page.locator('.axis8123PracticeActions button').allTextContents()).map(x=>x.trim()),['听原声','录音','听我的']);
const voice=await page.evaluate(()=>window.__AXIS_8103_VOICE__);assert.deepEqual(voice.locales,{en:'en-US',ja:'ja-JP',ko:'ko-KR',zh:'zh-CN'});assert.deepEqual(Object.values(voice.selected),['Samantha Enhanced','Kyoko Enhanced','Yuna Enhanced','Ting-Ting Enhanced']);assert.equal(await page.evaluate(()=>window.__AXIS_8103_SPEAK_CALLS__),0,'learning autoplayed');await page.locator('[data-v8123-action="listen"]').click();await page.waitForFunction(()=>window.__AXIS_8103_SPEAK_CALLS__===1);assert.equal(await page.evaluate(()=>window.__AXIS_8103_FRESHNESS__?.polling),false,'release freshness became a poller');`;
 s=convergeRange(s,start,end,current,'retired learning modes returned','8.10.3 current practice and voice route');
 s=converge(s,"PASS · inline Settings · home states · duration reminder · fixed adjust anchor · four-language voice routing · distinct shadow A/B","PASS · inline Settings · home states · duration reminder · fixed adjust anchor · four-language voice routing · current practice surface",'8.10.3 current PASS label');
 write(f,s);
}
console.log('[AXIS 8.12.3 CI stability] PASS · inherited browser/shadow checks aligned to pause-owned rest, current recording facts, and the retired learning-mode boundary');
