const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:417,height:896},isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const pageErrors=[];page.on('pageerror',e=>pageErrors.push(String(e?.stack||e)));
try{
 await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000});
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:8000});
 await page.waitForTimeout(2600);
 const before=await page.evaluate(()=>({
  ready8710:window.__AXIS_8710_LIVE_READY__,libReady:window.__AXIS_873_LIBRARY_READY__,libCount:Array.isArray(window.__AXIS_873_LIBRARY__)?window.__AXIS_873_LIBRARY__.length:null,
  eqSearch:!!document.querySelector('#eqSearch'),explore:!!document.querySelector('#v8710Explore'),cards:document.querySelectorAll('#v8710Cards button').length,
  diag:window.__AXIS_ENHANCE_DIAG__||null,stable:window.__AXIS_STABLE_COMPLETE__,canonical:window.__AXIS_CANONICAL_88__||null
 }));
 console.log('[AXIS catalog diag before]',JSON.stringify(before));
 const row=page.locator('#equipmentRow');if(await row.count())await (ENGINE==='webkit'?row.tap():row.click());
 await page.waitForTimeout(450);
 const after=await page.evaluate(()=>({
  eqShow:document.querySelector('#eqSheet')?.classList.contains('show'),explore:!!document.querySelector('#v8710Explore'),cards:document.querySelectorAll('#v8710Cards button').length,
  cats:document.querySelectorAll('#v8710Cats button').length,search:document.querySelector('#eqSearch')?.value||'',picker:window.__AXIS_8123_PICKER_ROUTER__||null,
  diagErrors:window.__AXIS_ENHANCE_DIAG__?.errors||[]
 }));
 console.log('[AXIS catalog diag after]',JSON.stringify(after));
 console.log('[AXIS catalog diag pageerrors]',JSON.stringify(pageErrors));
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
