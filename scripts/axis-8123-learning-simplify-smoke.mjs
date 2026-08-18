import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const errors=[];const api=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('request',r=>{if(/\/api\//.test(r.url()))api.push(r.url())});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
await page.route('**/api/cloud-status**',r=>json(r,{cloud:{configured:false,enabled:false}}));
await page.route('**/api/ai-capabilities**',r=>json(r,{ai:{enabled:false,capabilities:{vision:false,insight:false,voice:false,dialogue:false}}}));
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}]])await page.route(pattern,r=>json(r,obj));
await page.addInitScript(()=>{
 window.__AXIS_8123_TEST__={speak:0,mic:0,audio:0};
 try{Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{cancel(){},getVoices(){return[{name:'System Natural',lang:'en-US',localService:true}]},addEventListener(){},speak(u){window.__AXIS_8123_TEST__.speak++;queueMicrotask(()=>u?.onend?.())}}})}catch{}
 try{Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:function(text){this.text=text;this.lang='';this.rate=1;this.pitch=1;this.voice=null;this.onend=null;this.onerror=null}})}catch{}
 class FakeRecorder{static isTypeSupported(){return true}constructor(stream,opt){this.stream=stream;this.mimeType=opt?.mimeType||'audio/webm';this.state='inactive';this.ondataavailable=null;this.onstop=null}start(){this.state='recording'}stop(){if(this.state!=='recording')return;this.state='inactive';queueMicrotask(()=>{this.ondataavailable?.({data:new Blob(['axis'],{type:this.mimeType})});this.onstop?.()})}}
 try{Object.defineProperty(window,'MediaRecorder',{configurable:true,value:FakeRecorder})}catch{}
 try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{window.__AXIS_8123_TEST__.mic++;return{getTracks:()=>[{stop(){}}]}}}})}catch{}
 try{Object.defineProperty(URL,'createObjectURL',{configurable:true,value:()=> 'blob:axis-8123-test'});Object.defineProperty(URL,'revokeObjectURL',{configurable:true,value:()=>{}})}catch{}
 try{Object.defineProperty(window,'Audio',{configurable:true,value:function(){this.play=()=>{window.__AXIS_8123_TEST__.audio++;return Promise.resolve()}}})}catch{}
});
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:8000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:10000});await page.waitForFunction(()=>window.__AXIS_8123_LEARNING__?.version==='8.12.3',undefined,{timeout:5000})};
const textLeft=async l=>l.evaluate(el=>el.getBoundingClientRect().left);

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});await ready();
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.3');
 assert.deepEqual(await page.evaluate(()=>({trainingOwner:window.__AXIS_8123_LEARNING__?.trainingOwner,shadow:window.__AXIS_8123_LEARNING__?.shadow,ab:window.__AXIS_8123_LEARNING__?.ab,upload:window.__AXIS_8123_LEARNING__?.upload})),{trainingOwner:false,shadow:false,ab:false,upload:false});
 const before=await page.evaluate(()=>({core:localStorage.getItem('axis_v60_state'),meta:localStorage.getItem('axis_v8_meta')}));

 console.log(`[AXIS 8.12.3 ${ENGINE}] native Settings alignment + reduced copy`);
 await tap(page.locator('#settingsBtn'));await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'));
 const native=page.locator('#profileBtn>span');
 const nativeLeft=await textLeft(native);
 for(const sel of ['#v813LearningGate>.settingLink','#v813ServiceGate>.settingLink']){
  const row=page.locator(sel),left=await textLeft(row.locator(':scope>span'));assert.ok(Math.abs(left-nativeLeft)<=1.5,`${sel} left alignment drift ${left} vs ${nativeLeft}`);assert.equal(await row.evaluate(el=>getComputedStyle(el).borderBottomWidth),'0px');
 }
 assert.equal((await page.locator('#v811ServiceEntry>span').textContent()).trim(),'云端与AI');
 await tap(page.locator('#v810ConfigEntry'));await page.waitForFunction(()=>document.querySelector('#v813LearningGate')?.classList.contains('open'));
 const coreTitles=await page.locator('#v811CoreLearning .v811CoreHead>span').allTextContents();assert.deepEqual(coreTitles.map(x=>x.trim()),['目标','强度','难度','对话']);
 assert.equal(await page.locator('#v811CoreLearning [data-v812-core="method"]').count(),0,'method selector returned');
 assert.equal(await page.locator('#v811CoreLearning .v811CoreHead>b:visible').count(),0,'helper copy returned');
 const learningText=(await page.locator('#v813LearningFold').innerText())||'';
 for(const banned of ['学法','大脑用什么方式练','每天出现多少','表达复杂度','一次练到多完整'])assert.ok(!learningText.includes(banned),`banned Learning copy visible: ${banned}`);
 await tap(page.locator('[data-v812-core="purpose"][data-v812-value="native"]'));await page.waitForTimeout(40);
 assert.equal((await page.locator('#v810ConfigSummary').textContent()).trim(),'母语口语');
 await tap(page.locator('#v811FineTune>summary'));await page.waitForFunction(()=>document.querySelector('#v811FineTune')?.open===true);
 assert.equal(await page.locator('#v811FineTuneBody small:visible').count(),0,'fine-tune helper copy returned');

 console.log(`[AXIS 8.12.3 ${ENGINE}] Cloud/AI copy stays concise`);
 await tap(page.locator('#v811ServiceEntry'));await page.waitForFunction(()=>document.querySelector('#v813ServiceGate')?.classList.contains('open'));
 await page.waitForFunction(()=>document.querySelectorAll('#v811AIFacts .axis8122Fact').length===4,undefined,{timeout:3000});
 assert.equal(await page.locator('#v813ServiceGate .axis8122Head small:visible').count(),0);
 assert.equal(await page.locator('#v813ServiceGate .axis8122ServiceNote:visible').count(),0);
 const serviceText=(await page.locator('#v813ServiceFold').innerText())||'';
 for(const banned of ['本机始终是第一份数据','只做增强，不接管训练','一次决定可发送的数据类型','当前实际可用能力'])assert.ok(!serviceText.includes(banned),`banned service helper visible: ${banned}`);
 const afterSettings=await page.evaluate(()=>({core:localStorage.getItem('axis_v60_state'),meta:localStorage.getItem('axis_v8_meta')}));assert.deepEqual(afterSettings,before,'Settings touched training stores');

 console.log(`[AXIS 8.12.3 ${ENGINE}] listen / record / replay only`);
 await page.evaluate(()=>{localStorage.setItem('axis_v89_speak',JSON.stringify({seen:{},current:null,prefs:{enabled:true,native:'zh',target:'en',purpose:'native',method:'shadow',mode:'light',track:'gym',cadence:'manual',level:'adaptive',dailyTarget:0,opportunity:'off',standalone:'manual',dialogueDepth:'full',novelty:'balanced'},mastered:{},review:{},daily:{},sessions:{},history:[],practice:{}}))});
 await page.reload({waitUntil:'domcontentloaded'});await ready();
 await tap(page.locator('#settingsBtn'));await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'));await tap(page.locator('#v810ConfigEntry'));await page.waitForFunction(()=>document.querySelector('#v813LearningGate')?.classList.contains('open'));
 const start=page.locator('[data-v8122-standalone-start]');await start.waitFor({state:'visible'});await tap(start);await page.waitForFunction(()=>document.querySelector('#v891SpeakPanel')?.classList.contains('show'));
 const panel=page.locator('#v891SpeakPanel');const panelText=(await panel.innerText())||'';
 for(const banned of ['影子','跟读','A/B','开始影子','学法'])assert.ok(!panelText.includes(banned),`retired learning mode visible: ${banned}`);
 assert.equal(await panel.locator('[data-v8101-mode]').count(),0,'legacy mode tabs returned');assert.equal(await panel.locator('#v812MethodLab').count(),0,'legacy method lab returned');
 assert.deepEqual((await panel.locator('.axis8123PracticeActions button').allTextContents()).map(x=>x.trim()),['听原声','录音','听我的']);
 assert.equal(await page.evaluate(()=>window.__AXIS_8123_TEST__.speak),0,'learning autoplayed');
 await tap(panel.locator('[data-v8123-action="listen"]'));await page.waitForFunction(()=>window.__AXIS_8123_TEST__.speak===1);
 await tap(panel.locator('[data-v8123-action="record"]'));assert.equal(await page.evaluate(()=>window.__AXIS_8123_TEST__.mic),1);assert.equal((await panel.locator('#v8101Record').textContent()).trim(),'结束');
 await tap(panel.locator('[data-v8123-action="record"]'));await page.waitForFunction(()=>!document.querySelector('#v8101Playback')?.disabled);assert.equal((await panel.locator('#v8101Record').textContent()).trim(),'录音');assert.equal((await panel.locator('#v8101PracticeStatus').textContent()).trim(),'已录好');
 await tap(panel.locator('[data-v8123-action="playback"]'));await page.waitForFunction(()=>window.__AXIS_8123_TEST__.audio===1);
 const after=await page.evaluate(()=>({core:localStorage.getItem('axis_v60_state'),meta:localStorage.getItem('axis_v8_meta')}));assert.deepEqual(after,before,'learning practice touched training stores');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.12.3 ${ENGINE}] PASS · native rows · helper copy retired · method retired · listen/record/replay only · training stores untouched`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
