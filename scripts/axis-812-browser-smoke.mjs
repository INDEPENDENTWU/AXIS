const url=process.env.AXIS_URL||'http://127.0.0.1:4173',engine=process.env.AXIS_ENGINE||'chromium';
const mod=await import(engine==='webkit'?'playwright':'playwright-core'),type=engine==='webkit'?mod.webkit:mod.chromium;
const browser=await type.launch(engine==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:engine==='webkit',hasTouch:engine==='webkit',locale:'zh-CN'}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.message||e)));
const assert=(x,m)=>{if(!x)throw new Error(`[AXIS 8.12 browser] ${m}`)};
try{
 await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__AXIS_STABLE_COMPLETE__===true||document.documentElement.dataset.axisReady==='1',{timeout:15000});await page.waitForTimeout(800);
 const d=await page.evaluate(()=>({release:window.__AXIS_RELEASE__,v:document.documentElement.dataset.axisRuntime,l:window.__AXIS_812_LEARNING__,s:window.__AXIS_812_LEARNING_SETTINGS__,legacy:window.__AXIS_811_LEARNING__,r8123:window.__AXIS_8123_LEARNING__,errs:window.__AXIS_ENHANCE_DIAG__?.errors||[]}));
 assert(d.l?.version==='8.12'&&d.s?.version==='8.12','8.12 learning diagnostics missing · '+JSON.stringify(d));
 assert(d.l.totalNew===19584&&d.l.totalAvailable===25716,'corpus totals');
 assert(d.l.availableByLanguage.en===10632&&d.l.availableByLanguage.ja===5028&&d.l.availableByLanguage.ko===5028&&d.l.availableByLanguage.zh===5028,'language totals');
 assert(d.l.dialogueTurns.short===4&&d.l.dialogueTurns.full===8&&d.l.dialogueTurns.immersive===12,'dialogue depth diagnostics');
 assert(d.l.teachingLoop.join('|')==='meaning|noticing|retrieval|response|shadow|transform|review','historical teaching metadata changed');
 assert(d.l.networkRequired===false&&d.l.trainingOwner===false&&d.l.autoplay===false,'learning ownership');
 assert(d.legacy?.atlasEnglish===5280&&d.legacy?.totalEnglish===5736,'8.11 diagnostics changed');
 await page.click('#settingsBtn');await page.waitForSelector('#settingsSheet.show');assert(await page.locator('.sheetWrap.show').count()===1,'Settings opened an unexpected nested sheet');await page.click('#v810ConfigEntry');await page.waitForSelector('#v813LearningGate.open');
 assert(await page.locator('#v810ConfigPanel').isVisible(),'inline Learning settings are not visible');assert(await page.locator('.sheetWrap.show').count()===1,'Learning Schedule opened a second sheet');
 const groups=await page.locator('#v811CoreLearning .v811CoreGroup').count(),labels=await page.locator('#v811CoreLearning .v811CoreHead span').allTextContents();
 if(d.release==='8.12.3'){
  assert(groups===4,'expected four current core learning groups, got '+groups);assert(labels.join('|')==='目标|强度|难度|对话','8.12.3 core labels '+labels.join('|'));
  assert(await page.locator('[data-v812-core="method"]').count()===0,'retired method options returned');assert(d.r8123?.shadow===false&&d.r8123?.ab===false,'retired current learning modes returned');
 }else{
  assert(groups===5,'expected five historical core learning groups, got '+groups);assert(labels.join('|')==='目标|学法|强度|难度|对话','historical core labels '+labels.join('|'));
  assert(await page.locator('[data-v812-core="method"]').count()===6,'historical method options');
 }
 assert(await page.locator('[data-v812-core="purpose"]').count()===6,'purpose options');assert(await page.locator('[data-v812-core="dialogueDepth"]').count()===3,'dialogue options');
 await page.click('[data-v812-core="dialogueDepth"][data-v812-value="immersive"]');await page.waitForTimeout(80);assert(await page.locator('[data-v812-core="dialogueDepth"][data-v812-value="immersive"]').evaluate(el=>el.classList.contains('active')),'immersive dialogue preference did not persist');
 const details=page.locator('#v811FineTune');if(!(await details.evaluate(el=>el.open)))await page.click('#v811FineTune summary');await page.waitForTimeout(50);
 assert(await page.locator('[data-v8122-learning="novelty"]').count()===3,'novelty controls missing');await page.click('[data-v8122-learning="novelty"][data-v8122-value="new"]');await page.waitForTimeout(80);assert(await page.locator('[data-v8122-learning="novelty"][data-v8122-value="new"]').evaluate(el=>el.classList.contains('active')),'new-content ratio did not persist');
 const summary=await page.locator('#v810ConfigSummary').textContent();assert(/智能|母语口语|旅行生活|工作社交|健身|IELTS/.test(summary||''),'settings summary missing purpose');
 const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-window.innerWidth,errors:window.__AXIS_ENHANCE_DIAG__?.errors||[]}));assert(state.overflow<=1,'mobile overflow '+state.overflow);assert(errors.length===0,'page errors '+errors.join(' | '));
 console.log(`[AXIS 8.12 browser] PASS · ${engine} · inherited 25,716-unit Language Studio + current Settings contract · 4/8/12 dialogue · no page errors`);
}finally{await browser.close()}
