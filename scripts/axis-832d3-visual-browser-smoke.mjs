import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const OUT=process.env.AXIS_D3_EVIDENCE_DIR||'/tmp/axis-832d3-visual';
const {chromium,webkit}=await import('playwright');
const browser=await (ENGINE==='webkit'?webkit:chromium).launch(ENGINE==='chromium'?{headless:true,args:['--no-sandbox'],executablePath:process.env.CHROME_BIN||undefined}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:ENGINE==='webkit',locale:'zh-CN',reducedMotion:'reduce'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e)));
for(const [pattern,data] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>r.fulfill({status:200,contentType:'application/json',headers:{'cache-control':'no-store','access-control-allow-origin':'*'},body:JSON.stringify(data)}));
const ready=()=>page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_832_PLAY_THIS__&&window.__AXIS_QUICK_RECORD__,undefined,{timeout:20000});
const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
const tap=loc=>ENGINE==='webkit'?loc.tap():loc.click();
const initial={version:60,sessions:[],active:null,flows:[],flowRun:null,profile:{customEq:[],memories:[]},prefs:{scanSeconds:3}};
const report={schema:'axis.832d3.visual-closed-loop.v1',head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),engine:ENGINE,browser:browser.version(),capturedAt:new Date().toISOString(),supportedTheme:'canonical dark',visualMode:'DOM and captured screenshot evidence; not a human optical certification',samples:[],screenshots:[],warnings:[]};
fs.mkdirSync(OUT,{recursive:true});
const shot=async(name)=>{const target=path.join(OUT,name+'-'+ENGINE+'.png');await page.screenshot({path:target});report.screenshots.push(path.basename(target))};
const geometry=()=>page.evaluate(()=>{
 const modal=document.querySelector('#eqSheet'),button=document.querySelector('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]'),rec=document.querySelector('#scanSheet'),live=document.querySelector('#axisStrengthSheet');
 const rect=e=>{const r=e?.getBoundingClientRect();return r&&{x:+r.x.toFixed(1),y:+r.y.toFixed(1),width:+r.width.toFixed(1),height:+r.height.toFixed(1),right:+r.right.toFixed(1),bottom:+r.bottom.toFixed(1)}};
 const b=button&&getComputedStyle(button);
 return{viewport:{w:innerWidth,h:innerHeight},documentOverflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),modal:rect(modal),cta:rect(button),ctaText:button?.textContent?.trim(),fontSize:b?parseFloat(b.fontSize):null,ctaScrollOverflow:button?Math.max(button.scrollWidth-button.clientWidth,button.scrollHeight-button.clientHeight):null,pickerOpen:modal?.classList.contains('show'),recorderOpen:rec?.classList.contains('show'),recorder:rect(rec),focusWithinRecorder:rec?.contains(document.activeElement),liveOpen:live?.classList.contains('show'),live:rect(live),focusWithinLive:live?.contains(document.activeElement),pickerCount:document.querySelectorAll('#eqSheet').length,recorderCount:document.querySelectorAll('#scanSheet').length,captureOwnerCount:document.querySelectorAll('[data-axis-capture-owner]').length};
});
try{
 await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:20000});
 await page.evaluate(v=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify(v));localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}))},initial);
 await page.reload({waitUntil:'domcontentloaded'});await ready();
 for(const width of [320,360,390,430,1280]){
  await page.setViewportSize({width,height:844});
  for(const [language,text] of width===390?[['zh-Hans','开始练习'],['zh-Hant','開始練習'],['en','Start practice']]:[['zh-Hans','开始练习']]){
   await page.evaluate(lang=>{document.documentElement.lang=lang},language);
   assert.equal(await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__?.('quick')),true,'P01 original picker failed');
   await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:5500});
   await page.locator('#eqSearch').fill('');
   await page.locator('#eqSearch').fill('胸托划船');
   const button=page.locator('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]').first();
   await button.waitFor({state:'visible',timeout:5500});
   await page.evaluate(()=>document.querySelector('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]')?.scrollIntoView({block:'center'}));
   const before=await geometry();
   assert.equal(before.ctaText,text,'P17 8.32 wrong language at '+language);
   assert.ok(before.cta?.width>=44&&before.cta?.height>=44,'P15 action touch target below 44px');
   assert.ok(before.cta.x>=0&&before.cta.right<=before.viewport.w+1,'P15 action clipped at '+width);
   assert.ok(before.documentOverflow<=1,'P15 page has horizontal overflow');
   assert.ok(before.ctaScrollOverflow<=1,'P15 Object label clipped');
   assert.equal(before.recorderCount,1,'P19 duplicated Recorder shell');
   await button.focus();
   await page.evaluate(()=>document.querySelector('#eqSearch')?.dispatchEvent(new Event('input',{bubbles:true})));
   assert.equal(await page.evaluate(()=>document.activeElement?.dataset?.axis832Object),'chest-row','P16 catalog redraw stole precise keyboard focus');
   if(width===320||width===390||width===430){await shot('picker-'+width+'-'+language)}
   const old=await state();
   if(width===360){await context.setOffline(true);assert.equal(await page.evaluate(()=>navigator.onLine),false,'offline test not offline')}
   await tap(button);
   try{await page.waitForFunction(()=>document.querySelector('#axisStrengthSheet')?.classList.contains('show')&&document.querySelector('#axisStrengthSheet')?.contains(document.activeElement),undefined,{timeout:5000});}catch(err){console.log('[AXIS d3 live failure]',JSON.stringify({width,language,ui:await geometry()}));throw err}
   const after=await geometry();
   assert.equal(after.pickerOpen,false,'P19 old picker overlays live practice');
   assert.equal(after.liveOpen,true,'P19 live Object execution surface missing');
   assert.equal(after.recorderOpen,false,'P19 retrospective Recorder should not open on Play start');
   assert.equal(after.recorderCount,1,'P19 duplicate Recorder');
   assert.equal(after.captureOwnerCount,1,'P19 duplicate record capture owner');
   assert.ok(after.focusWithinLive,'P19 keyboard focus outside live practice');
   assert.equal((await state()).active?.events?.length||0,old.active?.events?.length||0,'P14 live start fabricated historical Encounter');
   assert.equal(await page.evaluate(()=>window.__AXIS_LIVE_STRENGTH__?.read?.()?.objectId),'chest-row','P14 prospective identity lost');
   if(width===320||width===390||width===430){await shot('live-'+width+'-'+language)}
   await page.evaluate(()=>{window.confirm=()=>true});
   await page.locator('#axisStrengthSheet [data-strength="abandon"]').click();
   await page.waitForFunction(()=>!document.querySelector('#axisStrengthSheet')?.classList.contains('show'),undefined,{timeout:5000});
   assert.equal(await page.evaluate(()=>localStorage.getItem('axis_play_strength_draft_v1')),null,'P14 canceled attempt retained prospectively');
   const afterCancel=await state();
   assert.deepEqual(afterCancel.active?.events||[],old.active?.events||[],'P14 cancel altered canonical Encounter');
   assert.equal(afterCancel.flowRun||null,old.flowRun||null,'P14 cancel altered FlowRun');
   assert.equal(await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__?.('quick')),true,'P08 cannot reopen original picker after cancellation');
   await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:4500});
   await page.locator('#eqSheet [data-close="eqSheet"]').first().click();
   await page.waitForFunction(()=>!document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:5000});
   if(width===360)await context.setOffline(false);
   report.samples.push({width,language,expectText:text,originalOwnerOnly:true,focusPreserved:true,cancelPure:true,returnedAndReopened:true,picker:before,live:after});
  }
 }
 assert.deepEqual(errors,[],'browser runtime errors: '+errors.join('\n'));
 const target=path.join(OUT,'axis-832d3-visual-'+ENGINE+'.json');
 fs.writeFileSync(target,JSON.stringify(report,null,2)+'\n');
 console.log('[AXIS 8.32d3 VISUAL+LOOP '+ENGINE+'] PASS · '+report.samples.length+' true width/language/return samples · '+report.screenshots.length+' screenshots · '+target);
}catch(e){console.error('[AXIS 8.32d3 VISUAL+LOOP '+ENGINE+'] FAILED:',e.message,JSON.stringify(report.samples.at(-1)));throw e}finally{await browser.close()}
