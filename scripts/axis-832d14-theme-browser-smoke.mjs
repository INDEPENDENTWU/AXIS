import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4274';
const engines=(process.env.AXIS_D14_ENGINES||'chromium webkit').split(/\s+/);
const palette={light:{root:'rgb(246, 247, 250)',surface:'rgb(255, 255, 255)',text:'rgb(28, 36, 50)',meta:'#f6f7fa'},dark:{root:'rgb(8, 9, 11)',surface:'rgb(13, 15, 19)',text:'rgb(244, 243, 239)',meta:'#08090b'}};
const locales=['zh-Hans','zh-Hant','en'];
const names={hans:['外观','跟随系统','浅色','深色'],hant:['外觀','跟隨系統','淺色','深色'],en:['Appearance','System','Light','Dark']};
let count=0;
for(const [engine,launcher] of [['chromium',chromium],['webkit',webkit]]){
 if(!engines.includes(engine))continue;
 const browser=await launcher.launch(engine==='chromium'?{headless:true,args:['--no-sandbox']}:{headless:true});
 try{
  for(const locale of locales){
   for(const pref of ['dark','light','system']){
    const os='light',target=pref==='dark'?'dark':'light';
    const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:engine==='webkit',colorScheme:os,reducedMotion:'reduce'});
    const page=await ctx.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(String(e)));
    await page.addInitScript(({lang,pref})=>{if(localStorage.getItem('axis_ui_theme_v1')===null)localStorage.setItem('axis_ui_theme_v1',pref)}, {lang:locale,pref});
    await page.goto(BASE,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__&&window.__AXIS_832_PLAY_THIS__,null,{timeout:16000});
    await page.evaluate(lang=>{document.documentElement.lang=lang;window.__AXIS_THEME__.refresh()},locale);
    const value=await page.evaluate(()=>({mode:document.documentElement.dataset.axisTheme,pref:document.documentElement.dataset.axisThemePreference,root:getComputedStyle(document.documentElement).backgroundColor,meta:document.querySelector('meta[name="theme-color"]').content,links:document.querySelectorAll('link[rel="stylesheet"]').length,externalScripts:document.querySelectorAll('script[src]').length,origin:localStorage.getItem('axis_ui_theme_v1')}));
    assert.equal(value.mode,target);assert.equal(value.pref,pref);assert.equal(value.root,palette[target].root);assert.equal(value.meta,palette[target].meta);assert.equal(value.origin,pref);assert.equal(value.links,1);assert.equal(value.externalScripts,1);
    await page.locator('#settingsBtn').click();
    const ui=await page.evaluate(()=>({surface:getComputedStyle(document.querySelector('#settingsSheet .sheet')).backgroundColor,text:getComputedStyle(document.querySelector('#settingsSheet .sheet')).color,buttons:[...document.querySelectorAll('[data-axis-theme-choice]')].map(b=>({name:b.textContent,pressed:b.getAttribute('aria-pressed'),height:b.getBoundingClientRect().height})),label:document.querySelector('.axisThemeSettingLabel').textContent}));
    assert.equal(ui.surface,palette[target].surface);assert.equal(ui.text,palette[target].text);
    const lang=locale==='en'?'en':locale==='zh-Hant'?'hant':'hans',expected=names[lang];
    assert.deepEqual([ui.label,...ui.buttons.map(b=>b.name)],expected);
    assert.ok(ui.buttons.every(b=>b.height>=44));assert.equal(ui.buttons.filter(b=>b.pressed==='true').length,1);
    const btn=ui.buttons[['system','light','dark'].indexOf(pref)];assert.equal(btn.pressed,'true');
    if(pref==='system'){
      await page.emulateMedia({colorScheme:'dark'});
      await page.waitForFunction(()=>document.documentElement.dataset.axisTheme==='dark');
      assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'),'#08090b');
      await page.emulateMedia({colorScheme:'light'});
      await page.waitForFunction(()=>document.documentElement.dataset.axisTheme==='light');
    }
    if(pref==='light'){
      const labels=await page.evaluate(()=>{const s=['#profileBtn>span','#profileSummary','#storageBrief'],out=[];for(const k of s){const e=document.querySelector(k);if(e){const c=getComputedStyle(e);out.push({selector:k,color:c.color})}}return out});
      for(const a of labels) assert.notEqual(a.color,'rgb(240, 239, 235)','light surface contains inherited near-white setting text');
      await page.locator('[data-axis-theme-choice="dark"]').click();
      assert.equal(await page.evaluate(()=>document.documentElement.dataset.axisTheme),'dark');
      assert.equal(await page.evaluate(()=>localStorage.getItem('axis_ui_theme_v1')),'dark');
      await page.reload({waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true);
      assert.equal(await page.evaluate(()=>document.documentElement.dataset.axisTheme),'dark');
      await page.locator('#settingsBtn').click();
      await page.locator('[data-axis-theme-choice="light"]').click();
      assert.equal(await page.evaluate(()=>document.documentElement.dataset.axisTheme),'light');
      await page.locator('#settingsSheet [data-close="settingsSheet"]').first().click();
      await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__('quick'));
      await page.locator('#eqSearch').fill('胸托划船');
      const cta=page.locator('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]').first();
      await cta.waitFor({state:'visible'});
      const bg=await page.locator('#v8710Cards .axis832CatalogCard [data-v877-lib]').first().evaluate(e=>getComputedStyle(e).backgroundColor);
      assert.equal(bg,'rgb(255, 255, 255)');
      await cta.click();
      await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show'));
      const handoff=await page.evaluate(()=>({n:document.querySelectorAll('#scanSheet.show').length,picker:document.querySelector('#eqSheet')?.classList.contains('show'),active:JSON.parse(localStorage.getItem('axis_v60_state')||'{}').active}));
      assert.equal(handoff.n,1);assert.equal(handoff.picker,false);assert.equal(handoff.active||null,null);
    }
    assert.deepEqual(errors,[]);
    console.log('[AXIS d14] PASS',JSON.stringify({engine,locale,pref,mode:target,surface:ui.surface}));
    count++;await ctx.close();
   }
  }
 }finally{await browser.close()}
}
console.log('[AXIS d14] COMPLETE',count);
