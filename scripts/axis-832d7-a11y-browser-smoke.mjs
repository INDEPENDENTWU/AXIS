import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium,webkit} from 'playwright';
const engine=process.env.AXIS_ENGINE||'chromium',base=process.env.AXIS_URL||'http://127.0.0.1:4173',out=process.env.AXIS_D7_EVIDENCE_DIR||'/tmp/axis-d7';
const browser=await (engine==='webkit'?webkit:chromium).launch(engine==='chromium'?{headless:true,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,reducedMotion:'reduce',locale:'zh-CN'});
const page=await context.newPage(),exceptions=[];
page.on('pageerror',e=>exceptions.push(String(e)));
for(const [pattern,value] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(value)}));
const report={schema:'axis.832d7.a11y.v1',head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),engine,browserVersion:browser.version(),samples:[],screenshots:[],warnings:[]};
const localeTexts={'zh-Hans':'开始练习','zh-Hant':'開始練習','en':'Start practice'};
const contrast=(fg,bg)=>{
 const values=s=>[...s.matchAll(/\d+(?:\.\d+)?/g)].slice(0,3).map(x=>Number(x[0])/255);
 const lum=s=>values(s).map(x=>x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4).reduce((a,x,i)=>a+x*[0.2126,0.7152,0.0722][i],0);
 const light=Math.max(lum(fg),lum(bg)),dark=Math.min(lum(fg),lum(bg));return (light+0.05)/(dark+0.05);
};
const initial={version:60,sessions:[],active:null,flows:[],flowRun:null,profile:{customEq:[],memories:[]},prefs:{scanSeconds:3}};
const cssFacts=()=>page.evaluate(()=>{
 const el=document.querySelector('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]'),box=el?.getBoundingClientRect(),s=el&&getComputedStyle(el),modal=document.querySelector('#eqSheet'),guide=document.querySelector('#eqSheet .v8710GuideHead'),cards=document.querySelector('#eqSheet #v8710Cards'),itemTitle=cards?.querySelector('.axis832CatalogCard [data-v877-lib] b');
 const rect=e=>{const r=e?.getBoundingClientRect();return r&&{x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};
 return {viewportWidth:innerWidth,documentWidth:document.documentElement.scrollWidth,button:rect(el),sheet:rect(modal),guide:rect(guide),cards:rect(cards),itemTitle:rect(itemTitle),itemTitleWhiteSpace:itemTitle?getComputedStyle(itemTitle).whiteSpace:null,guideLabel:guide?.querySelector('span')?.textContent,guideMode:document.querySelector('#v8710GuideMode')?.textContent,targetName:el?.getAttribute('aria-label'),label:el?.textContent?.trim(),fontSize:s?.fontSize,background:s?.backgroundColor,color:s?.color,outline:s?.outlineStyle,tabIndex:el?.tabIndex,buttonOverflow:el?.scrollWidth>el?.clientWidth+1||el?.scrollHeight>el?.clientHeight+1,buttonVisible:!!el&&!!el.getClientRects().length,focusVisible:el?.matches(':focus-visible'),reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,themeRoot:document.documentElement.getAttribute('data-theme'),backgroundRoot:getComputedStyle(document.body).backgroundColor,themeClasses:document.documentElement.className};
});
try{
 await page.goto(base,{waitUntil:'domcontentloaded'});
 const viewportPolicy=await page.locator('meta[name="viewport"]').getAttribute('content');
 assert.ok(viewportPolicy?.includes('width=device-width')&&viewportPolicy?.includes('viewport-fit=cover'),'P16 viewport geometry missing');
 assert.doesNotMatch(viewportPolicy,/user-scalable\s*=\s*(?:no|0)|maximum-scale\s*=\s*1(?:\.0)?/i,'P16 page disables user pinch zoom');
 report.viewportPolicy=viewportPolicy;
 await page.evaluate(v=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify(v));localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}))},initial);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__&&window.__AXIS_832_PLAY_THIS__,undefined,{timeout:20000});
 fs.mkdirSync(out,{recursive:true});
 for(const width of [320,360,390,430,1280]){
  for(const scale of [1,2]){
   await page.setViewportSize({width,height:844});
   await page.evaluate(scale=>document.documentElement.style.setProperty('--axis-ui',scale===2?'30px':'15px'),scale);
   for(const language of width===390?['zh-Hans','zh-Hant','en']:['zh-Hans']){
    await page.evaluate(lang=>document.documentElement.lang=lang,language);
    assert.equal(await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__('quick')),true,'P15 picker unavailable');
    await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:5000});
    await page.locator('#eqSearch').fill('胸托划船');
    const btn=page.locator('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]').first();
    await btn.waitFor({state:'visible',timeout:5000});
    await page.evaluate(()=>document.querySelector('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]')?.scrollIntoView({block:'center'}));
    const facts=await cssFacts();
    facts.contrastRatio=contrast(facts.color,facts.background);
    report.samples.push({width,scale,language,facts});
    assert.equal(facts.label,localeTexts[language],'P17 localized CTA');
    if(language==='en'){assert.equal(facts.guideLabel,'Browse without knowing the name','P17 English guide heading');assert.ok(/matching movements|No matching movements/.test(facts.guideMode),'P17 English catalog result count')}
    else if(language==='zh-Hant'){assert.equal(facts.guideLabel,'不知道名稱也可以','P17 Traditional Chinese guide heading');assert.ok(/相關項目|符合的項目/.test(facts.guideMode),'P17 Traditional Chinese catalog count')}
    assert.ok(facts.targetName?.startsWith(localeTexts[language]),'P16 localized accessible label');
    assert.equal(facts.reducedMotion,true,'P16 user motion preference');
    assert.ok(facts.button?.width>=44&&facts.button?.height>=44,'P16 button target too small');
    assert.ok(facts.button.x>=-1&&facts.button.right<=facts.viewportWidth+1,'P15 CTA outside viewport');
    assert.ok(facts.documentWidth<=facts.viewportWidth+1,'P15 page horizontal overflow at '+width+' x '+scale);
    assert.ok(!facts.buttonOverflow,'P15 action label clipped at '+width+' x '+scale);
    assert.ok(facts.tabIndex>=0,'P16 action is not keyboard accessible');
    assert.ok(facts.contrastRatio>=4.5,'P16 CTA text contrast below 4.5 at '+width+' x '+scale);
    assert.ok(facts.button.y>=-1&&facts.button.bottom<=844+1,'P15 CTA hidden vertically under overlay');
    assert.ok(facts.guide&&facts.cards&&facts.guide.bottom<=facts.cards.y+1,'P15 enlarged guide text overlaps Object cards at '+width+' x '+scale);
    assert.notEqual(facts.itemTitleWhiteSpace,'nowrap','P15 item names cannot reflow under enlarged text');
    const topHit=await page.evaluate(()=>{const x=document.querySelector('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]'),r=x.getBoundingClientRect();return x.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))});
    assert.equal(topHit,true,'P15 CTA visually covered by another element');
    await page.locator('#eqSearch').focus();
    let focusedByKeyboard=false,focusOutline=null;
    for(let tab=0;tab<40;tab++){
      await page.keyboard.press('Tab');
      const f=await page.evaluate(()=>{const x=document.querySelector('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]');return {target:document.activeElement===x,focusVisible:!!x?.matches(':focus-visible'),outline:x?getComputedStyle(x).outlineWidth:null}});
      if(f.target){focusedByKeyboard=f.focusVisible;focusOutline=f.outline;break}
    }
    facts.keyboardReached=focusedByKeyboard;facts.keyboardOutline=focusOutline;
    assert.ok(focusedByKeyboard,'P16 keyboard Tab cannot reach a visible focus-indicated CTA');
    if(width===320||width===390){const name='a11y-'+width+'-'+scale+'-'+language+'-'+engine+'.png';await page.screenshot({path:path.join(out,name)});report.screenshots.push(name)}
    await page.locator('#eqSheet [data-close="eqSheet"]').first().click();
    await page.waitForFunction(()=>!document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:4000});
   }
  }
 }
 assert.deepEqual(exceptions,[],'unexpected page exceptions');
 fs.writeFileSync(path.join(out,'axis-832d7-a11y-'+engine+'.json'),JSON.stringify(report,null,2)+'\n');
 console.log('[AXIS 8.32d7 '+engine+'] PASS · '+report.samples.length+' responsive/locale/reduced-motion/large type · '+report.screenshots.length+' captures');
}catch(e){console.error('[AXIS 8.32d7 '+engine+'] FAIL '+e.message+' '+JSON.stringify(report.samples.at(-1)));throw e}finally{await browser.close()}
