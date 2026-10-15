import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {chromium,webkit} from 'playwright';
const HEAD=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4220',OUTPUT=process.env.AXIS_D12_REPORT||'/tmp/axis-832d12-visual.json';
const rows=[];
const api=[['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]];
for(const [name,launcher] of [['chromium',chromium],['webkit',webkit]]){
 const browser=await launcher.launch(name==='chromium'?{headless:true,args:['--no-sandbox']}:{headless:true});
 try{
  for(const systemScheme of ['light','dark']){
   for(const locale of ['zh-Hans','zh-Hant','en']){
    const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:name==='webkit',hasTouch:true,colorScheme:systemScheme,reducedMotion:'reduce',locale:'en-US'});
    const page=await ctx.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(String(e)));
    for(const [pattern,value] of api)await ctx.route(pattern,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(value)}));
    await page.addInitScript(()=>{window.__AXIS_D12_FIRST_PAINT__=[];document.addEventListener('DOMContentLoaded',()=>{window.__AXIS_D12_FIRST_PAINT__.push({stage:'dom',rootBg:getComputedStyle(document.documentElement).backgroundColor,bodyBg:getComputedStyle(document.body).backgroundColor,time:performance.now()})},{once:true})});
    await page.goto(BASE,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_832_PLAY_THIS__,null,{timeout:15000});
    const before=await page.evaluate(()=>({firstPaint:window.__AXIS_D12_FIRST_PAINT__,themeRoot:document.documentElement.getAttribute('data-theme'),metaTheme:document.querySelector('meta[name="theme-color"]')?.content,metaColorScheme:document.querySelector('meta[name="color-scheme"]')?.content,rootBg:getComputedStyle(document.documentElement).backgroundColor,documentWidth:document.documentElement.scrollWidth,viewport:innerWidth,prefersDark:matchMedia('(prefers-color-scheme:dark)').matches}));
    assert.ok(before.documentWidth<=before.viewport+1,'Home horizontal overflow');
    assert.equal(before.rootBg,'rgb(8, 9, 11)','current dark theme not stable');
    assert.equal(before.firstPaint[0]?.rootBg,'rgb(8, 9, 11)','first-paint background differs');
    assert.equal(before.prefersDark,systemScheme==='dark','OS scheme mismatch');
    await page.evaluate(lang=>document.documentElement.lang=lang,locale);
    assert.equal(await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__('quick')),true);
    await page.locator('#eqSearch').fill('胸托划船');
    const cta=page.locator('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]').first();
    await cta.waitFor({state:'visible',timeout:5000});await cta.scrollIntoViewIfNeeded();
    const geometry=await page.evaluate(()=>{const c=document.querySelector('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]'),g=document.querySelector('#eqSheet .v8710GuideHead'),l=document.querySelector('#v8710Cards');const b=e=>{const r=e.getBoundingClientRect();return {top:r.y,bottom:r.bottom,width:r.width,height:r.height}};return{button:b(c),guide:b(g),list:b(l),overflow:document.documentElement.scrollWidth-innerWidth}});
    assert.ok(geometry.guide.bottom<=geometry.list.top+1,'guide overlap');
    assert.ok(geometry.overflow<=1,'picker horizontal overflow');
    assert.ok(geometry.button.height>=44&&geometry.button.width>=44,'undersized CTA');
    assert.deepEqual(errors,[]);
    rows.push({engine:name,browserVersion:browser.version(),systemScheme,locale,firstPaint:before.firstPaint[0],finalBackground:before.rootBg,themeAttr:before.themeRoot,metaTheme:before.metaTheme,metaColorScheme:before.metaColorScheme,geometry});
    await ctx.close();
   }
  }
 }finally{await browser.close()}
}
const report={schema:'axis.832d12.firstpaint.audit.v1',head:HEAD,total:rows.length,scope:'Headless Chromium/WebKit DOM-first dark theme and catalog optical geometry; NOT implemented Light/System preference nor physical-device certification',observations:rows,themeContractGap:'system/light/dark specified in docs; candidate stays dark across system light and dark',productionCertified:false};
fs.writeFileSync(OUTPUT,JSON.stringify(report,null,2));
console.log('[AXIS 8.32d12 P15/P17] PASS '+rows.length+'/12 dark-first-paint cases; system/light/dark preference NOT implemented; '+OUTPUT);
