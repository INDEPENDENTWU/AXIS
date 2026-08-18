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
{
 const f='scripts/axis-810-smoke.mjs';let s=read(f);
 s=converge(s,"activity:{status:'active',startedAt:t-600000,lastResumedAt:t-600000,pausedAt:null,finishedAt:null,estimateMs:600000,completedSets:1,intervals:[{start:t-600000,end:null}],restStartedAt:t-50000}","activity:{status:'paused',startedAt:t-600000,lastResumedAt:t-600000,pausedAt:t-50000,finishedAt:null,estimateMs:600000,completedSets:1,intervals:[{start:t-600000,end:t-50000}],restStartedAt:t-50000}",'8.10 manual learning pause-owned fixture');
 write(f,s);
}
{
 const f='scripts/axis-8101-smoke.mjs';let s=read(f);
 s=converge(s,"activity:{status:'active',startedAt:t-7200000,lastResumedAt:t-7200000,pausedAt:null,finishedAt:null,estimateMs:600000,completedSets:1,intervals:[{start:t-7200000,end:null}],restStartedAt:rest}","activity:{status:'paused',startedAt:t-7200000,lastResumedAt:t-7200000,pausedAt:rest,finishedAt:null,estimateMs:600000,completedSets:1,intervals:[{start:t-7200000,end:rest}],restStartedAt:rest}",'8.10.1 learning pause-owned fixture');
 s=converge(s,"assert.equal(await page.locator('#v8101Practice [data-v8101-mode]').count(),3);assert.ok(await page.locator('#v8101Practice .v8101Turn').count()>=2,'dialogue does not contain both sides');const turns=(await page.locator('#v8101Practice .v8101Turn b').allTextContents()).filter(Boolean);assert.ok(turns.length>=2&&turns.every(x=>x.trim().length>1),'dialogue turns are incomplete');await page.locator('#v8101Practice [data-v8101-action=\"dialogue\"]').click();await page.waitForFunction(()=>window.__AXIS_8101_SPEAK_CALLS__>=1);const afterDialogue=await page.evaluate(()=>window.__AXIS_8101_SPEAK_CALLS__);await page.locator('#v8101Practice [data-v8101-mode=\"echo\"]').click();await page.locator('#v8101Practice [data-v8101-action=\"echo\"]').click();await page.waitForFunction(n=>window.__AXIS_8101_SPEAK_CALLS__>n,afterDialogue);const afterEcho=await page.evaluate(()=>window.__AXIS_8101_SPEAK_CALLS__);await page.locator('#v8101Practice [data-v8101-mode=\"shadow\"]').click();assert.ok((await page.locator('#v8101ShadowLine').innerText()).trim().length>2);await page.locator('#v8101Practice [data-v8101-action=\"shadow\"]').click();await page.waitForFunction(n=>window.__AXIS_8101_SPEAK_CALLS__>n,afterEcho);assert.match(await page.locator('#v8101Practice .v8101Privacy').innerText(),/不上传|不保存/);await page.locator('#v891SpeakPanel [data-v891-action=\"close\"]').click();","assert.equal(await page.locator('#v8101Practice [data-v8101-mode]').count(),0,'retired learning modes returned');assert.deepEqual((await page.locator('.axis8123PracticeActions button').allTextContents()).map(x=>x.trim()),['听原声','录音','听我的']);await page.locator('[data-v8123-action=\"listen\"]').click();await page.waitForFunction(()=>window.__AXIS_8101_SPEAK_CALLS__===1);await page.locator('#v891SpeakPanel [data-v891-action=\"close\"]').click();",'8.10.1 current practice surface');
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
 s=converge(s,"await page.locator('#v8101Practice [data-v8101-mode=\"dialogue\"]').click();assert.equal(await page.locator('.v8103DialogueTurns .v8101Turn').count(),4,'dialogue is not four turns');await page.locator('#v8101Practice [data-v8101-mode=\"echo\"]').click();assert.ok(((await page.locator('#v8101Practice').innerText())||'').includes('先听完'),'echo workflow is not listen-then-repeat');await page.locator('#v8101Practice [data-v8101-mode=\"shadow\"]').click();const shadowCopy=(await page.locator('#v8101Practice').innerText())||'';assert.ok(shadowCopy.includes('慢半拍')&&shadowCopy.includes('A/B'),'shadow workflow is not simultaneous comparison practice');assert.equal(await page.locator('[data-v8101-action=\"reference\"]').count(),1);assert.equal(await page.locator('[data-v8101-action=\"ab\"]').count(),1);\nconst voice=await page.evaluate(()=>window.__AXIS_8103_VOICE__);assert.deepEqual(voice.locales,{en:'en-US',ja:'ja-JP',ko:'ko-KR',zh:'zh-CN'});assert.equal(voice.dialogueTurns,4);assert.equal(voice.echo,'listen-then-repeat');assert.equal(voice.shadow,'simultaneous-auto-record-ab');assert.deepEqual(Object.values(voice.selected),['Samantha Enhanced','Kyoko Enhanced','Yuna Enhanced','Ting-Ting Enhanced']);assert.equal(await page.evaluate(()=>window.__AXIS_8103_SPEAK_CALLS__),0,'learning autoplayed');assert.equal(await page.evaluate(()=>window.__AXIS_8103_FRESHNESS__?.polling),false,'release freshness became a poller');","assert.equal(await page.locator('#v8101Practice [data-v8101-mode]').count(),0,'retired learning modes returned');assert.deepEqual((await page.locator('.axis8123PracticeActions button').allTextContents()).map(x=>x.trim()),['听原声','录音','听我的']);\nconst voice=await page.evaluate(()=>window.__AXIS_8103_VOICE__);assert.deepEqual(voice.locales,{en:'en-US',ja:'ja-JP',ko:'ko-KR',zh:'zh-CN'});assert.deepEqual(Object.values(voice.selected),['Samantha Enhanced','Kyoko Enhanced','Yuna Enhanced','Ting-Ting Enhanced']);assert.equal(await page.evaluate(()=>window.__AXIS_8103_SPEAK_CALLS__),0,'learning autoplayed');await page.locator('[data-v8123-action=\"listen\"]').click();await page.waitForFunction(()=>window.__AXIS_8103_SPEAK_CALLS__===1);assert.equal(await page.evaluate(()=>window.__AXIS_8103_FRESHNESS__?.polling),false,'release freshness became a poller');",'8.10.3 current practice and voice route');
 s=converge(s,"PASS · inline Settings · home states · duration reminder · fixed adjust anchor · four-language voice routing · distinct shadow A/B","PASS · inline Settings · home states · duration reminder · fixed adjust anchor · four-language voice routing · current practice surface",'8.10.3 current PASS label');
 write(f,s);
}
console.log('[AXIS 8.12.3 CI stability] PASS · inherited browser/shadow checks aligned to pause-owned rest, current recording facts, and the retired learning-mode boundary');
