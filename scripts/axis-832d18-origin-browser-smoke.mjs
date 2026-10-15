import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browserModule=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const browser=await (ENGINE==='webkit'?browserModule.webkit:browserModule.chromium).launch(
 ENGINE==='webkit'?{headless:true}:{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}
);
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const source='e'.repeat(40);
const results=[];
try{
 for(const kind of ['ready','mismatch','unavailable']){
  const ctx=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN',deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  for(const [pattern,body] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]]){
   await page.route(pattern,r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)}));
  }
  await page.route('**/axis-build.json*',r=>kind==='unavailable'
   ?r.fulfill({status:503,contentType:'text/plain',body:'offline'})
   :r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({version:kind==='mismatch'?'8.31':'8.32',sourceCommit:source})}));
  await page.goto(BASE,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>Boolean(window.__AXIS_CORE_INTERACTIVE__),null,{timeout:20000});
  await page.locator('#settingsBtn').click();
  await page.waitForFunction(()=>['ready','mismatch','unavailable'].includes(document.querySelector('#axisOriginReport')?.dataset.axisOriginState),null,{timeout:10000});
  const observed=await page.evaluate(()=>{
   const el=document.querySelector('#axisOriginReport');
   return{state:el.dataset.axisOriginState,text:el.textContent,lang:document.documentElement.lang,host:location.hostname,liveRuntime:window.__AXIS_RELEASE__};
  });
  assert.equal(observed.state,kind==='ready'?'ready':kind,'installed provenance must classify version truth accurately');
  assert.ok(observed.text.includes(observed.host),'always show actual installed origin hostname');
  if(kind==='ready')assert.ok(observed.text.includes(source.slice(0,9)));
  if(kind==='mismatch')assert.ok(observed.text.includes('版本不一致'),'stale manifest should not silently claim a matched runtime');
  if(kind==='unavailable')assert.ok(observed.text.includes('無法讀取'),'unavailable manifest still identifies origin');
  assert.deepEqual(errors,[],'Settings readout must not add runtime errors');
  results.push({engine:ENGINE,case:kind,...observed});
  await ctx.close();
 }
}finally{await browser.close()}
const dest=process.env.AXIS_D18_REPORT_DIR;
if(dest){fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(dest+'/axis-832d18-install-origin-'+ENGINE+'.json',JSON.stringify({head,physicalDevice:false,results},null,2)+'\n')}
console.log('[AXIS d18] PASS · '+ENGINE+' · 3 live Settings source/stale/offline states; origin shown; no added owners');
