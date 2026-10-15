import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {chromium,webkit} from 'playwright';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4311';
const OUT=process.env.AXIS_D15_REPORT_DIR||'/tmp/axis-832d15';
const engines=(process.env.AXIS_D15_ENGINES||'chromium webkit').split(/\s+/);
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
fs.mkdirSync(OUT,{recursive:true});
const report={schema:'axis.832d15.theme.screen-experience.v1',head,physicalDevice:false,scope:'Headless Chromium/WebKit DOM optical geometry + fixed text contrast, not human physical screen-reader certification',samples:[],errors:[]};
const api=[['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]];
for(const [engine,launcher] of [['chromium',chromium],['webkit',webkit]]){
 if(!engines.includes(engine))continue;
 const browser=await launcher.launch(engine==='chromium'?{headless:true,args:['--no-sandbox']}:{headless:true});
 try{
  for(const theme of ['light','dark']){
   for(const [idx,width] of [320,390,430].entries()){
    const locale=['zh-CN','zh-TW','en-US'][idx],context=await browser.newContext({viewport:{width,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:engine==='webkit',locale,colorScheme:theme,reducedMotion:'reduce'});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(String(error)));
    for(const [pattern,value] of api)await context.route(pattern,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(value)}));
    await page.addInitScript(value=>{localStorage.setItem('axis_ui_theme_v1',value)},theme);
    await page.goto(BASE,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__&&window.__AXIS_832_PLAY_THIS__,undefined,{timeout:20000});
    const check=()=>page.evaluate(()=>{
      const root=document.documentElement;
      const parse=str=>{const m=str.match(/rgba?\(([^)]+)\)/);if(!m)return null;const a=m[1].replaceAll('/',' ').split(/[, ]+/).filter(Boolean).map(Number);return [a[0],a[1],a[2],a.length>3?a[3]:1]};
      const lum=x=>{const a=x.slice(0,3).map(z=>z/255).map(z=>z<=.04045?z/12.92:((z+.055)/1.055)**2.4);return .2126*a[0]+.7152*a[1]+.0722*a[2]};
      const info=selector=>{const e=document.querySelector(selector);if(!e)return null;const s=getComputedStyle(e),r=e.getBoundingClientRect();let fg=parse(s.color),bg=[246,247,250];for(let p=e;p;p=p.parentElement){const v=parse(getComputedStyle(p).backgroundColor);if(v&&v[3]>=.95){bg=v;break}}const contrast=fg?((Math.max(lum(fg),lum(bg))+.05)/(Math.min(lum(fg),lum(bg))+.05)):null;return{selector,color:s.color,bg:JSON.stringify(bg.slice(0,3)),contrast:contrast===null?null:+contrast.toFixed(2),x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,scrollOverflow:e.scrollWidth-e.clientWidth}};
      return {theme:root.dataset.axisTheme,docOverflow:Math.max(0,root.scrollWidth-innerWidth),clock:info('#axisNowClock'),chips:[...document.querySelectorAll('#scanSheet #muscleTags i')].map((e,i)=>info('#scanSheet #muscleTags i:nth-child('+(i+1)+')')),cta:info('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]'),recorderTitle:info('#scanSheet .sheetHead b'),settingLabel:info('#settingsSheet .axisThemeSettingLabel')};
    });
    const home=await check();assert.equal(home.theme,theme);assert.ok(home.docOverflow<=1,'Home overflow');
    if(theme==='light'&&home.clock)assert.ok(home.clock.contrast>=4.5,'Home clock contrast');
    if(width===390)await page.screenshot({path:OUT+'/'+engine+'-'+theme+'-home.png'});
    await page.locator('.nav.v82Nav button').nth(1).click();
    const history=await check();assert.ok(history.docOverflow<=1,'History overflow');
    if(width===390)await page.screenshot({path:OUT+'/'+engine+'-'+theme+'-history.png'});
    await page.locator('.nav.v82Nav button').first().click();
    await page.locator('#settingsBtn').click();
    const settings=await check();assert.ok(settings.docOverflow<=1,'Settings overflow');
    if(width===390)await page.screenshot({path:OUT+'/'+engine+'-'+theme+'-settings.png'});
    await page.locator('#settingsSheet [data-close="settingsSheet"]').first().click();
    assert.equal(await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__('quick')),true);
    await page.locator('#eqSearch').fill('胸托划船');
    const button=page.locator('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]').first();
    await button.waitFor({state:'visible',timeout:6000});
    await button.scrollIntoViewIfNeeded();
    const catalog=await check();assert.ok(catalog.docOverflow<=1,'Object overflow');assert.ok(catalog.cta?.h>=44,'Object CTA 44px');assert.ok(catalog.cta.right<=width+1,'Object CTA clipped');
    if(width===390)await page.screenshot({path:OUT+'/'+engine+'-'+theme+'-object.png'});
    await button.click();
    await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show'),undefined,{timeout:11000});
    const recorder=await check();assert.ok(recorder.docOverflow<=1,'Recorder overflow');
    assert.equal(await page.evaluate(()=>document.querySelectorAll('#scanSheet.show').length),1);
    if(theme==='light'){
     for(const chip of recorder.chips)assert.ok(chip.contrast>=4.5,'Light Recorder muscle-chip contrast '+JSON.stringify(chip));
     assert.ok(recorder.clock?.contrast>=4.5,'Light clock contrast in Recorder');
    }
    if(width===390)await page.screenshot({path:OUT+'/'+engine+'-'+theme+'-recorder.png'});
    assert.deepEqual(errors,[],'JavaScript runtime errors');
    report.samples.push({engine,theme,width,locale,home,history,settings,catalog,recorder,head,errors:[]});
    console.log('[AXIS d15] PASS',JSON.stringify({engine,theme,width,chipContrast:recorder.chips.map(x=>x.contrast),clockContrast:recorder.clock?.contrast}));
    await context.close();
   }
  }
 }finally{await browser.close()}
}
fs.writeFileSync(OUT+'/axis-832d15-report.json',JSON.stringify(report,null,2));
console.log('[AXIS d15] COMPLETE '+report.samples.length+' screen journeys · '+head);
