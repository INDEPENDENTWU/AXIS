const url=process.env.AXIS_URL||'http://127.0.0.1:4173',engine=process.env.AXIS_ENGINE||'chromium';
const mod=await import(engine==='webkit'?'playwright':'playwright-core');
const type=engine==='webkit'?mod.webkit:mod.chromium;
const browser=await type.launch(engine==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN}: {headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:engine==='webkit',hasTouch:engine==='webkit',locale:'zh-CN'});
const page=await context.newPage(),errors=[],serviceRequests=[];
page.on('pageerror',e=>errors.push(String(e?.message||e)));
page.on('request',r=>{if(/\/api\/(cloud-status|ai-capabilities)(?:\?|$)/.test(r.url()))serviceRequests.push(r.url())});
const assert=(x,m)=>{if(!x)throw new Error(`[AXIS 8.11 browser] ${m}`)};
try{
 await page.goto(url,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_STABLE_COMPLETE__===true||document.documentElement.dataset.axisReady==='1',{timeout:12000});
 await page.waitForFunction(()=>window.__AXIS_811_LEARNING__&&window.__AXIS_811_MULTILINGUAL__&&window.__AXIS_811_TRENDS__&&window.__AXIS_811_SERVICE_SETTINGS__,{timeout:8000});
 let diag=await page.evaluate(()=>({learning:window.__AXIS_811_LEARNING__,multi:window.__AXIS_811_MULTILINGUAL__,dialogue:window.__AXIS_811_DIALOGUE__,trend:window.__AXIS_811_TRENDS__,motion:window.__AXIS_811_TREND_MOTION__,services:window.__AXIS_811_SERVICE_SETTINGS__,legacy:{richEnglish:window.__AXIS_REST_SPEAK__?.richEnglish,totalUnits:window.__AXIS_REST_SPEAK__?.totalUnits,phrases:window.__AXIS_REST_SPEAK__?.phrases?.(),snap:window.__AXIS_REST_SPEAK__?.snapshot?.()}}));
 assert(diag.learning.atlasEnglish===5280&&diag.learning.totalEnglish===5736&&diag.learning.totalUnits===6132,'learning counts');
 assert(diag.multi.available.ja===132&&diag.multi.available.ko===132&&diag.multi.available.zh===132&&diag.multi.sixTurn===true,'multilingual counts/depth');
 assert(diag.dialogue?.turns===6&&diag.dialogue?.trainingOwner===false,'six-turn dialogue owner');
 assert(diag.legacy.richEnglish===456&&diag.legacy.totalUnits===492&&diag.legacy.phrases===492&&diag.legacy.snap?.english===456&&diag.legacy.snap?.total===492,'inherited learning diagnostics changed');
 assert(diag.trend?.score===false&&diag.trend?.networkRequired===false&&diag.motion?.persistentTimer===false&&diag.motion?.reducedMotion===true,'State Field ownership/motion');
 assert(diag.services?.userInvokedNetwork===true&&diag.services?.automaticNetwork===false&&diag.services?.trainingOwner===false,'service settings ownership');
 assert(serviceRequests.length===0,'cloud/AI status fetched before user invocation');

 await page.click('#settingsBtn');
 await page.waitForSelector('#settingsSheet.show');
 assert(await page.locator('#v810ConfigEntry').count()===1,'learning schedule row missing');
 assert(await page.locator('#v811ServiceEntry').count()===1,'cloud/AI row missing');
 await page.click('#v810ConfigEntry');
 await page.waitForSelector('#v810ConfigPanel.show');
 assert(await page.locator('#v811CoreLearning .v811CoreGroup').count()===3,'learning settings not converged to three core groups');
 assert(!(await page.locator('#v811FineTune').getAttribute('open')),'fine-tune should be collapsed by default');
 const coreLabels=await page.locator('#v811CoreLearning .v811CoreHead span').allTextContents();
 assert(coreLabels.join('|')==='目标|强度|难度','core learning labels changed');
 await page.click('[data-v810-config-close]');
 await page.click('#v811ServiceEntry');
 await page.waitForSelector('#v811ServicePanel.show');
 await page.waitForTimeout(180);
 assert(serviceRequests.length===2,'service status should fetch exactly when panel opens');
 const serviceText=await page.locator('#v811ServicePanel').innerText();
 assert(/云端同步/.test(serviceText)&&/AXIS AI/.test(serviceText)&&/本地/.test(serviceText),'service panel content incomplete');
 await page.click('[data-v811-service="close"]');

 const now=Date.now(),day=86400000;
 await page.evaluate(({now,day})=>{
  const mk=(id,start,weight,reps,muscles)=>({id,start,end:start+45*60000,events:[{id:'e'+id,kind:'strength',equipmentId:'bench',name:'卧推',weight,reps,sets:3,time:start+60000,muscles}]});
  const state={version:60,sessions:[mk('3',now-1*day,50,10,['胸肌','肱三头肌']),mk('2',now-5*day,47.5,10,['胸肌','肱三头肌']),mk('1',now-10*day,45,8,['胸肌','肱三头肌'])],active:null,profile:{name:'Test',freq:'3',goal:'strength',height:'',weight:'',bodyFat:'',years:'1',customEq:[],memories:[]},prefs:{}};
  localStorage.setItem('axis_v60_state',JSON.stringify(state));
 },{now,day});
 await page.click('[data-view="insightsView"]');
 await page.waitForSelector('#insightsView.active');
 await page.waitForTimeout(80);
 const trend=await page.evaluate(()=>({state:document.querySelector('#v811StateName')?.textContent,goal:document.querySelector('#v811GoalName')?.textContent,nodes:document.querySelectorAll('#v811Trajectory .node').length,evidence:document.querySelector('#v811Evidence')?.textContent?.trim(),needle:document.querySelector('#v811Needle')?.textContent?.trim(),oldVisible:getComputedStyle(document.querySelector('.v811LegacyInsights')).display,overflow:document.documentElement.scrollWidth-window.innerWidth}));
 assert(trend.state&&trend.state!=='未成形','State Field did not form from records');
 assert(/力量/.test(trend.goal||'')&&trend.nodes>=3&&trend.evidence&&trend.needle,'goal-aware State Field incomplete');
 assert(trend.oldVisible==='none','legacy generic trends leaked into UI');
 assert(trend.overflow<=1,'mobile horizontal overflow');
 assert(errors.length===0,'page errors: '+errors.join(' | '));
 console.log(`[AXIS 8.11 browser] PASS · ${engine} · converged settings · user-invoked cloud/AI · six-turn multilingual diagnostics · goal-aware State Field`);
}finally{await browser.close()}
