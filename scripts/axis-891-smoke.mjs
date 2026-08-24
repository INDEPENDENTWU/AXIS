import assert from 'node:assert/strict';
import fs from 'node:fs';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const EXPECTED=JSON.parse(fs.readFileSync('release-contract.json','utf8')).publicVersion;
const INTERACTION_WAIT_MS=ENGINE==='webkit'?3500:1000;
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
await page.addInitScript(()=>{
 window.__AXIS_891_SPEAK_CALLS__=0;
 try{Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{cancel(){},speak(){window.__AXIS_891_SPEAK_CALLS__++}}})}catch{}
 try{Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:function(text){this.text=text;this.lang='';this.rate=1}})}catch{}
});
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:8000})};

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});await ready();

console.log(`[AXIS 8.9.1 ${ENGINE}] release + learning contract`);
assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),EXPECTED);
const diag=await page.evaluate(()=>window.__AXIS_REST_SPEAK__);
assert.equal(diag?.patch,'8.9.1');
assert.equal(diag?.userInvokedPanel,true);
assert.equal(diag?.richEnglish,72);
assert.ok((diag?.phrases?.()||0)>=108);

console.log(`[AXIS 8.9.1 ${ENGINE}] complete inline phrase + zero-friction depth`);
await page.evaluate(()=>{
 const t=Date.now(),event={id:'E891R',equipmentId:'chest',name:'胸推',kind:'strength',time:t-150000,weight:20,reps:10,sets:3,muscles:['胸肌'],frameRefs:[]};
 const core={version:60,sessions:[],active:{id:'S891R',start:t-240000,events:[event]},selectedEq:null,frames:[],clip:null,stream:null,ai:null,profile:{name:'',height:'',weight:'',bodyFat:'',years:'',freq:3,goal:'',memories:[],customEq:[]},prefs:{keepClip:true,scanSeconds:3,watermark:{name:true,data:true,time:true,brand:true,pos:'bl',photoMode:'wm',videoMode:'wm'}}};
 const start=t-150000,rest=t-18000;
 const meta={prefs:{},events:{E891R:{activity:{status:'active',startedAt:start,lastResumedAt:start,pausedAt:null,finishedAt:null,estimateMs:240000,completedSets:1,intervals:[{start,end:null}],restStartedAt:rest},sets:[{state:'done',doneAt:rest},{state:'assumed',doneAt:null},{state:'assumed',doneAt:null}]}}};
 localStorage.setItem('axis_v60_state',JSON.stringify(core));localStorage.setItem('axis_v8_meta',JSON.stringify(meta));
 localStorage.setItem('axis_v89_speak',JSON.stringify({seen:{},current:null,prefs:{enabled:true,native:'zh',target:'en'},mastered:{}}));
});
await page.reload({waitUntil:'domcontentloaded'});await ready();
await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show')&&document.querySelector('#v87Rest')?.classList.contains('v891SpeakReady'),undefined,{timeout:3500});
const inline=await page.locator('#v87Rest').evaluate(el=>{
 const b=el.querySelector('.v891RestLine b'),cs=b?getComputedStyle(b):null;
 return{phrase:el.dataset.speak||'',painted:b?.textContent||'',label:el.getAttribute('aria-label')||'',scrollH:b?.scrollHeight||0,clientH:b?.clientHeight||0,lineHeight:cs?parseFloat(cs.lineHeight)||0:0,clamp:cs?.webkitLineClamp||'',cardH:document.querySelector('#v87Now')?.getBoundingClientRect().height||0}
});
assert.equal(inline.painted,inline.phrase,'inline target DOM is incomplete');
assert.ok(inline.label.includes(inline.phrase),'full phrase is not exposed accessibly');
assert.equal(inline.clamp,'2','iPhone inline phrase is not allowed two lines');
assert.ok(inline.scrollH<=Math.max(inline.clientH+1,inline.lineHeight*2+1),`inline phrase is visually clipped ${inline.scrollH}/${inline.clientH}`);
assert.equal(await page.evaluate(()=>window.__AXIS_891_SPEAK_CALLS__),0,'Rest Speak autoplayed before interaction');

await page.locator('#v87Rest').click();
await page.waitForFunction(()=>document.querySelector('#v891SpeakPanel')?.classList.contains('show'),undefined,{timeout:INTERACTION_WAIT_MS});
const panel=await page.locator('#v891SpeakPanel').evaluate(el=>({
 phrase:el.querySelector('#v891SpeakPhrase')?.textContent||'',
 meaning:el.querySelector('#v891SpeakMeaning')?.textContent||'',
 note:el.querySelector('#v891SpeakNative')?.textContent||'',
 meta:el.querySelector('#v891SpeakMeta')?.textContent||'',
 cardH:document.querySelector('#v87Now')?.getBoundingClientRect().height||0,
 display:getComputedStyle(el).visibility
}));
assert.equal(panel.phrase,inline.phrase,'micro-learning panel changed the phrase on open');
assert.ok(panel.meaning.length>1,'meaning missing');
assert.ok(panel.note.length>8,'native-use coaching missing');
assert.ok(panel.meta.length>3,'scenario/level metadata missing');
assert.ok(Math.abs(panel.cardH-inline.cardH)<=1.5,`learning panel changed active-card geometry ${inline.cardH} -> ${panel.cardH}`);
assert.equal(await page.evaluate(()=>window.__AXIS_891_SPEAK_CALLS__),0,'opening learning depth autoplayed speech');

await page.locator('#v891SpeakPanel [data-v891-action="more"]').click();
assert.ok(await page.locator('#v891SpeakPanel').evaluate(el=>el.classList.contains('expanded')));
assert.ok(await page.locator('#v891SpeakMore>div').count()>=2,'professional learning depth is too thin');
await page.locator('#v891SpeakPanel [data-v891-action="voice"]').click();
assert.equal(await page.evaluate(()=>window.__AXIS_891_SPEAK_CALLS__),1,'explicit pronunciation action did not speak exactly once');

const beforeId=await page.locator('#v891SpeakPanel').getAttribute('data-phrase-id');
await page.locator('#v891SpeakPanel [data-v891-action="master"]').click();
await page.waitForFunction(id=>document.querySelector('#v891SpeakPanel')?.dataset.phraseId&&document.querySelector('#v891SpeakPanel').dataset.phraseId!==id,beforeId,{timeout:INTERACTION_WAIT_MS});
const afterId=await page.locator('#v891SpeakPanel').getAttribute('data-phrase-id');
assert.notEqual(afterId,beforeId,'mastered phrase did not advance');
assert.ok(await page.evaluate(id=>!!JSON.parse(localStorage.getItem('axis_v89_speak')||'{}').mastered?.[id],beforeId),'mastery stayed outside accessory store or was not persisted');

await page.locator('#v87Toggle').click();
await page.waitForFunction(()=>!document.querySelector('#v891SpeakPanel')?.classList.contains('show'),undefined,{timeout:1200});
assert.equal(await page.locator('#v87Rest.v89Speak').count(),0,'learning accessory survived outside rest state');
assert.equal(await page.evaluate(()=>window.__AXIS_ACTIVE_CONTROL__?.owner),'v87-direct-884','training control ownership changed');

console.log(`[AXIS 8.9.1 ${ENGINE}] stable detail surface + atomic content`);
await page.evaluate(()=>{
 const t=Date.now(),event={id:'E891D',equipmentId:'chest',name:'胸推',kind:'strength',time:t-60000,weight:20,reps:10,sets:3,muscles:['胸肌','肱三头肌','肩部'],frameRefs:[]};
 const core=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');core.active=null;core.sessions=[{id:'S891D',start:t-180000,end:t-30000,events:[event]}];localStorage.setItem('axis_v60_state',JSON.stringify(core));localStorage.removeItem('axis_v89_speak');
});
await page.reload({waitUntil:'domcontentloaded'});await ready();
await page.locator('.nav button[data-view="historyView"]').click();await page.locator('[data-session="S891D"]').click();
await page.waitForFunction(()=>document.querySelector('#detailSheet')?.classList.contains('show')&&document.querySelector('#detail')?.innerText.includes('训练时间'),undefined,{timeout:1800});
await page.waitForTimeout(220);
const opened=await page.locator('#detailSheet').evaluate(el=>({pre:el.classList.contains('axis884Prepaint'),backdrop:getComputedStyle(el).backdropFilter||getComputedStyle(el).webkitBackdropFilter||'',h:el.querySelector('.sheet')?.getBoundingClientRect().height||0}));
assert.equal(opened.pre,false,'session detail retained delayed prepaint class');
assert.ok(opened.h>100,'detail shell opened without stable geometry');
assert.ok(opened.backdrop==='none'||opened.backdrop==='',`detail backdrop blur can still flash on Safari: ${opened.backdrop}`);

await page.evaluate(()=>{
 const s=document.querySelector('#detailSheet');window.__AXIS_891_DETAIL_FRAMES__=[];let n=70;
 const loop=()=>{const title=document.querySelector('#detailTitle')?.textContent||'',body=(document.querySelector('#detail')?.innerText||'').replace(/\s+/g,' ').trim(),cs=s?getComputedStyle(s):null,h=s?.querySelector('.sheet')?.getBoundingClientRect().height||0;window.__AXIS_891_DETAIL_FRAMES__.push({show:!!s?.classList.contains('show'),pre:!!s?.classList.contains('axis884Prepaint'),swap:!!s?.classList.contains('axis891DetailSwap'),vis:cs?.visibility||'',op:Number(cs?.opacity||0),h,title,body});if(n-->0)requestAnimationFrame(loop)};requestAnimationFrame(loop)
});
