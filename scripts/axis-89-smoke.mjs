import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [
 ['**/api/ai-status**',{available:false,vision:false,insight:false,version:'axis-ai-v4'}],
 ['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false,error:'not_available'}],['**/api/insight**',{available:false,error:'not_available'}],
 ['**/nominatim.openstreetmap.org/reverse**',{name:'测试健身房',address:{road:'测试路',city:'测试市'}}]
])await page.route(pattern,r=>json(r,obj));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:8000})};

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});await ready();

console.log(`[AXIS 8.9 ${ENGINE}] release + passive owners`);
assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.9');
assert.equal(await page.evaluate(()=>window.__AXIS_LOCAL_VISION__?.version),2,'Local Vision v2 missing');
assert.equal(await page.evaluate(()=>window.__AXIS_REST_SPEAK__?.owner),'passive-rest-reader','Rest Speak gained wrong owner');
assert.equal(await page.evaluate(()=>window.__AXIS_REST_SPEAK__?.failOpen),true,'Rest Speak is not fail-open');
assert.ok((await page.evaluate(()=>window.__AXIS_REST_SPEAK__?.phrases?.()))>=40,'Rest Speak phrase bank too small');
assert.ok((await page.evaluate(()=>window.__AXIS_89_CATALOG__?.size||0))>80,'expanded canonical exercise catalog missing');

console.log(`[AXIS 8.9 ${ENGINE}] colloquial search stays inside canonical catalog`);
await page.evaluate(()=>{document.querySelector('#eqSheet')?.classList.add('show');const q=document.querySelector('#eqSearch');q.value='练屁股';q.dispatchEvent(new Event('input',{bubbles:true}))});
await page.waitForFunction(()=>document.querySelectorAll('#v873SmartResults .v873SmartItem').length>0,undefined,{timeout:1800});
const searchText=(await page.locator('#v873SmartResults').innerText()).replace(/\s+/g,' ');
assert.match(searchText,/臀|深蹲|腿|glute/i);
await page.evaluate(()=>document.querySelector('#eqSheet')?.classList.remove('show'));

console.log(`[AXIS 8.9 ${ENGINE}] Rest Speak is off by default and geometry-neutral when enabled`);
await page.evaluate(()=>{
 const t=Date.now(),mk=(id,equipmentId,name,offset)=>({id,equipmentId,name,kind:'strength',time:t-offset,weight:20,reps:10,sets:1,muscles:['胸肌'],frameRefs:[]});
 const events=[
  mk('E89R1','lat','高位下拉',420000),mk('E89R2','row','坐姿划船',330000),mk('E89R3','chest','胸推',240000),mk('E89R4','legext','腿屈伸',150000),mk('E89R5','shoulder','肩推',90000)
 ];
 const core={version:60,sessions:[],active:{id:'S89R',start:t-480000,events},selectedEq:null,frames:[],clip:null,stream:null,ai:null,profile:{name:'',height:'',weight:'',bodyFat:'',years:'',freq:3,goal:'',memories:[],customEq:[]},prefs:{keepClip:true,scanSeconds:3,watermark:{name:true,data:true,time:true,brand:true,pos:'bl',photoMode:'wm',videoMode:'wm'}}};
 const act=(status,start,end=null,restStartedAt=null)=>({status,startedAt:start,lastResumedAt:start,pausedAt:status==='paused'?(end||t-60000):null,finishedAt:status==='finished'?(end||t-60000):null,estimateMs:180000,completedSets:status==='finished'?1:(restStartedAt?1:0),intervals:[{start,end:status==='active'?null:(end||t-60000)}],restStartedAt});
 const meta={prefs:{v89SpeakEnabled:true,v89SpeakNative:'zh',v89SpeakTarget:'en'},events:{
  E89R1:{activity:act('finished',t-420000,t-360000),sets:[{state:'done',doneAt:t-360000}]},
  E89R2:{activity:act('paused',t-330000,t-300000),sets:[{state:'assumed',doneAt:null}]},
  E89R3:{activity:act('active',t-240000,null,t-16000),sets:[{state:'done',doneAt:t-16000},{state:'assumed',doneAt:null},{state:'assumed',doneAt:null}]},
  E89R4:{activity:act('paused',t-150000,t-120000),sets:[{state:'assumed',doneAt:null}]},
  E89R5:{activity:act('finished',t-90000,t-60000),sets:[{state:'done',doneAt:t-60000}]}
 }};
 localStorage.setItem('axis_v60_state',JSON.stringify(core));localStorage.setItem('axis_v8_meta',JSON.stringify(meta));
});
await page.reload({waitUntil:'domcontentloaded'});await ready();
await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show')&&window.__AXIS_ACTIVE_CONTROL__?.owner==='v87-direct-884',undefined,{timeout:3500});
assert.equal(await page.evaluate(()=>window.__AXIS_ACTIVE_CONTROL__?.owner),'v87-direct-884');
assert.match(await page.locator('#v87Now #v87Rest').innerText(),/^休息/);
assert.equal(await page.locator('#v87Rest.v89Speak').count(),0,'Rest Speak leaked from training metadata or appears while disabled');
const h0=await page.locator('#v87Now').evaluate(el=>el.getBoundingClientRect().height);
await page.evaluate(()=>localStorage.setItem('axis_v89_speak',JSON.stringify({seen:{},current:null,prefs:{enabled:true,native:'zh',target:'en'}})));
await page.reload({waitUntil:'domcontentloaded'});await ready();
await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show')&&document.querySelector('#v87Now #v87Rest')?.classList.contains('v89Speak'),undefined,{timeout:3500});
const h1=await page.locator('#v87Now').evaluate(el=>el.getBoundingClientRect().height);
assert.ok(Math.abs(h1-h0)<=1.5,`Rest Speak changed active-card geometry ${h0} -> ${h1}`);
const restLines=await page.locator('#v87Now #v87Rest').evaluate(el=>({target:el.querySelector('span')?.textContent||'',meaning:el.querySelector('small')?.textContent||''}));
assert.match(restLines.target,/^\d{2}:\d{2} · (Could|Is |I'm|Go |No |That |Can |Where |Sounds)/i);
assert.ok(restLines.meaning.length>1,'Rest Speak meaning missing');
assert.equal(await page.locator('#v87Now .v89Speak').count(),1,'Rest Speak escaped the existing rest slot');
assert.equal(await page.locator('.axis883TimelineSafe').count(),0,'8.9 reintroduced dynamic timeline safe zone');
assert.equal(await page.evaluate(()=>window.__AXIS_ACTIVE_CONTROL__?.owner),'v87-direct-884','active-control owner changed');

await page.locator('#v87Toggle').click();
await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v8_meta')).events.E89R3.activity.status==='paused',undefined,{timeout:1400});
assert.equal(await page.locator('#v87Rest.v89Speak').count(),0,'Rest Speak survived outside rest state');
await page.locator('#settingsBtn').click();await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show')&&document.querySelector('#v89SpeakSettings'),undefined,{timeout:1500});
assert.equal(await page.locator('#v89SpeakSettings').count(),1);
assert.equal(await page.locator('#v89SpeakTarget button').count(),3,'language target controls incomplete');
await page.locator('#settingsSheet [data-close="settingsSheet"]').click();

console.log(`[AXIS 8.9 ${ENGINE}] atomic session -> item detail handoff`);
await page.evaluate(async()=>{
 localStorage.removeItem('axis_v89_speak');
 const t=Date.now(),event={id:'E89D',equipmentId:'chest',name:'胸推',kind:'strength',time:t-60000,weight:20,reps:10,sets:5,muscles:['胸肌','肱三头肌','肩部'],frameRefs:['F-E89D-0'],photoBytes:80};
 const core=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');core.active=null;core.sessions=[{id:'S89D',start:t-120000,end:t-43000,events:[event]}];localStorage.setItem('axis_v60_state',JSON.stringify(core));
 const req=indexedDB.open('axis_v42_media',1);await new Promise((res,rej)=>{req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('media'))req.result.createObjectStore('media')};req.onsuccess=res;req.onerror=rej});const db=req.result;
 const png=Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII='),c=>c.charCodeAt(0));
 await new Promise((res,rej)=>{const tx=db.transaction('media','readwrite');tx.objectStore('media').put(new Blob([png],{type:'image/png'}),'F-E89D-0');tx.oncomplete=res;tx.onerror=rej});db.close();
});
await page.reload({waitUntil:'domcontentloaded'});await ready();await page.locator('.nav button[data-view="historyView"]').click();await page.locator('[data-session="S89D"]').click();
await page.waitForFunction(()=>document.querySelector('#detailSheet')?.classList.contains('show')&&document.querySelector('#detail')?.innerText.includes('训练时间'),undefined,{timeout:1800});
await page.evaluate(()=>{window.__AXIS_89_OLD_TITLE__=document.querySelector('#detailTitle')?.textContent||'';window.__AXIS_89_DETAIL_FRAMES__=[];let n=80;const loop=()=>{const s=document.querySelector('#detailSheet'),t=document.querySelector('#detailTitle')?.textContent||'',b=(document.querySelector('#detail')?.innerText||'').replace(/\s+/g,' ').trim();if(s?.classList.contains('show')&&getComputedStyle(s).visibility!=='hidden')window.__AXIS_89_DETAIL_FRAMES__.push({t,b});if(n-->0)requestAnimationFrame(loop)};requestAnimationFrame(loop)});
await page.locator('#detail [data-event="E89D"]').click();
await page.waitForFunction(()=>document.querySelector('#detailTitle')?.textContent==='胸推'&&document.querySelector('#detail')?.innerText.includes('主要锻炼'),undefined,{timeout:3000});
await page.waitForTimeout(300);
const observed=await page.evaluate(()=>({frames:window.__AXIS_89_DETAIL_FRAMES__||[],oldTitle:window.__AXIS_89_OLD_TITLE__||''})),frames=observed.frames;
assert.ok(frames.length,'detail paint observer captured nothing');
for(const x of frames){
 const old=x.t===observed.oldTitle&&x.b.includes('训练时间');
 const fresh=x.t==='胸推'&&x.b.includes('主要锻炼')&&x.b.includes('记录时间');
 assert.ok(old||fresh,`half-painted detail frame exposed: ${JSON.stringify(x)}`);
}
assert.equal(await page.evaluate(()=>window.__AXIS_89_DETAIL__?.owner),'atomic-handoff');

assert.deepEqual(errors,[],`page errors: ${errors.join('\n')}`);
await browser.close();
console.log(`[AXIS 8.9 ${ENGINE}] PASS`);