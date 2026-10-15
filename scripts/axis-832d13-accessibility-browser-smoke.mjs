import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const url=process.env.AXIS_URL||'http://127.0.0.1:4240';
const enabledEngines=(process.env.AXIS_D13_ENGINES||'chromium webkit').split(/\s+/);
for(const [engine,launcher] of [['chromium',chromium],['webkit',webkit]]){
 if(!enabledEngines.includes(engine))continue;
 const browser=await launcher.launch(engine==='chromium'?{headless:true,args:['--no-sandbox']}:{headless:true});
 try{
  for(const locale of ['zh-Hans','zh-Hant','en']){
   const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:engine==='webkit',hasTouch:true,locale:'en-US',reducedMotion:'reduce'});
   const page=await ctx.newPage();const errors=[];
   page.on('pageerror',e=>errors.push(String(e)));
   for(const [pattern,value] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await ctx.route(pattern,r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(value)}));
   await page.goto(url,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_832_PLAY_THIS__,null,{timeout:15000});
   const copy=locale==='en'?{title:'Choose a movement',search:'Search movements',close:'Close movement picker'}:locale==='zh-Hant'?{title:'選擇器械或動作',search:'搜尋器械或動作',close:'關閉器械選擇'}:{title:'选择器械或动作',search:'搜索器械或动作',close:'关闭器械选择'};
   await page.evaluate(lang=>document.documentElement.lang=lang,locale);
   await page.locator('#settingsBtn').focus();
   assert.equal(await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__('quick')),true);
   assert.equal(await page.locator('#eqSheet').getAttribute('role'),'dialog');
   assert.equal(await page.locator('#eqSheet').getAttribute('aria-modal'),'true');
   assert.equal(await page.locator('#eqSheet').getAttribute('aria-labelledby'),'axis832PickerAccessibleName');
   assert.equal(await page.locator('#axis832PickerAccessibleName').innerText(),copy.title);
   assert.equal(await page.locator('#eqSearch').getAttribute('aria-label'),copy.search);
   assert.equal(await page.locator('#eqSheet [data-close="eqSheet"]').getAttribute('aria-label'),copy.close);
   assert.equal(await page.evaluate(()=>document.activeElement?.id),'axis832PickerAccessibleName');
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#eqSheet').evaluate(el=>el.classList.contains('show')),false);
   assert.equal(await page.evaluate(()=>document.activeElement?.id),'settingsBtn','Escape returns focus to opener');
   await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__('quick'));
   await page.locator('#eqSheet [data-close="eqSheet"]').click();
   assert.equal(await page.locator('#eqSheet').evaluate(el=>el.classList.contains('show')),false);
   assert.equal(await page.evaluate(()=>document.activeElement?.id),'settingsBtn','close button returns focus');
   await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__('quick'));
   await page.locator('#eqSearch').fill('胸托划船');
   const cta=page.locator('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]').first();
   await cta.waitFor({state:'visible',timeout:5000});
   await cta.focus();
   await page.keyboard.press('Enter');
   await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show'),undefined,{timeout:12000});
   const owner=await page.evaluate(()=>({recorder:document.querySelectorAll('#scanSheet.show').length,activeInside:document.querySelector('#scanSheet.show')?.contains(document.activeElement),pickerShown:document.querySelector('#eqSheet')?.classList.contains('show'),selected:document.querySelector('#equipmentName')?.textContent?.trim(),hasExtraStore:Object.keys(localStorage).some(k=>k.startsWith('axis_832'))}));
   assert.equal(owner.recorder,1);
   assert.equal(owner.pickerShown,false);
   assert.equal(owner.activeInside,true,'Recorder takes focus');
   assert.equal(owner.hasExtraStore,false);
   assert.deepEqual(errors,[]);
   console.log('[AXIS d13] PASS '+JSON.stringify({engine,locale,dialog:copy.title,owner}));
   await ctx.close();
  }
 }finally{await browser.close()}
}
