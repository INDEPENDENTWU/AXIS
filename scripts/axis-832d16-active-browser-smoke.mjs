import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {chromium,webkit} from 'playwright';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4338';
const OUT=process.env.AXIS_D16_REPORT_DIR||'/tmp/axis-832d16';
const engines=(process.env.AXIS_D16_ENGINES||'chromium webkit').split(/\s+/);
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
fs.mkdirSync(OUT,{recursive:true});
const samples=[];
const api=[['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]];
for(const [engine,launcher] of [['chromium',chromium],['webkit',webkit]]){
 if(!engines.includes(engine))continue;
 const browser=await launcher.launch(engine==='chromium'?{headless:true,args:['--no-sandbox']}:{headless:true});
 try{
  for(const theme of ['light','dark']){
   for(const width of [320,390,430]){
    const ctx=await browser.newContext({viewport:{width,height:700},deviceScaleFactor:2,isMobile:engine==='webkit',hasTouch:true,colorScheme:theme,reducedMotion:'reduce'});
    const page=await ctx.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(String(e)));
    for(const [pattern,value] of api)await ctx.route(pattern,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(value)}));
    await page.addInitScript(pref=>localStorage.setItem('axis_ui_theme_v1',pref),theme);
    await page.goto(BASE,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__&&window.__AXIS_832_PLAY_THIS__,null,{timeout:18000});
    await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__('quick'));
    await page.locator('#eqSearch').fill('胸托划船');
    const go=page.locator('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]').first();
    await go.waitFor({state:'visible'});
    await go.click();
    await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show'));
    assert.equal(await page.locator('#scanSheet.show').count(),1);
    await page.locator('#saveScan').click();
    await page.waitForFunction(()=>document.querySelector('#v87Now.show')&&JSON.parse(localStorage.getItem('axis_v60_state')||'{}').active?.events?.length===1,null,{timeout:15000});
    const state=()=>page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return{id:s.active?.id,eventIds:(s.active?.events||[]).map(e=>e.id),equipment:(s.active?.events||[]).map(e=>e.equipmentId),sessions:s.sessions?.length||0,flowRun:s.flowRun||null}});
    const baseline=await state();
    assert.ok(baseline.id,'canonical Active not recorded');
    assert.deepEqual(baseline.equipment,['chest-row']);
    assert.equal(baseline.sessions,0);
    const inspect=()=>page.evaluate(()=>{
      const rect=sel=>{const e=document.querySelector(sel),r=e?.getBoundingClientRect();if(!e||!r)return null;const a=getComputedStyle(e);return{x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom,color:a.color,background:a.backgroundColor}};
      const rgb=s=>{const match=s.match(/rgba?\(([^)]+)\)/);if(!match)return null;return match[1].split(/[, ]+/).filter(Boolean).slice(0,3).map(Number)};
      const luminosity=x=>x.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
      const hint=rect('#v87Finish span'),root=rect('html'),fg=rgb(hint.color),bg=rgb(root.background);
      const contrast=(Math.max(luminosity(fg),luminosity(bg))+.05)/(Math.min(luminosity(fg),luminosity(bg))+.05);
      return{width:innerWidth,height:innerHeight,docWidth:document.documentElement.scrollWidth,theme:document.documentElement.dataset.axisTheme,stage:rect('#v87Now'),finish:rect('#v87Finish'),hint,adjust:rect('#v87AdjustBtn'),toggle:rect('#v87Toggle'),primary:rect('#v87Primary'),nav:rect('.nav.v82Nav'),hintContrast:+contrast.toFixed(2)};
    });
    const first=await inspect();
    assert.equal(first.theme,theme);
    assert.ok(first.docWidth<=first.width+1,'Active horizontal overflow');
    for(const name of ['finish','adjust','toggle','primary']){
      const c=first[name];assert.ok(c&&c.w>=44&&c.h>=44,name+' touch size '+JSON.stringify(c));
      if(name==='finish')assert.ok(c.w>=92,'legacy branded hold width must remain >=92px');
      assert.ok(c.x>=-1&&c.right<=first.width+1,name+' horizontally clipped');
    }
    assert.ok(first.adjust.y-Math.max(first.primary.bottom,first.toggle.bottom)>=4,'Active Adjust must remain visually separated from primary actions');
    assert.ok(first.hintContrast>=4.5,'Active finish hint unreadable '+JSON.stringify(first));
    assert.ok(first.stage.bottom<=first.nav.y+2,'Active content hidden under dock');
    const switched=theme==='light'?'dark':'light';
    await page.evaluate(x=>window.__AXIS_THEME__.set(x),switched);
    assert.equal(await page.evaluate(()=>document.documentElement.dataset.axisTheme),switched);
    assert.deepEqual(await state(),baseline,'Theme toggle changed factual Active');
    await page.evaluate(x=>window.__AXIS_THEME__.set(x),theme);
    assert.deepEqual(await state(),baseline);
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('#v87Now.show')&&window.__AXIS_CORE_INTERACTIVE__,null,{timeout:16000});
    assert.deepEqual(await state(),baseline,'Reload changed saved Active');
    const after=await inspect();
    assert.ok(after.docWidth<=after.width+1,'reloaded Active overflow');
    await page.evaluate(()=>{document.documentElement.style.fontSize='200%'});
    const stressed=await inspect();
    assert.ok(stressed.docWidth<=stressed.width+1,'200% root rem-stress causes horizontal overflow');
    assert.ok(stressed.finish?.h>=44&&stressed.adjust?.h>=44,'font stress loses targets');
    await page.evaluate(()=>{document.documentElement.style.fontSize=''});
    if(width===390)await page.screenshot({path:OUT+'/active-'+engine+'-'+theme+'.png'});
    assert.deepEqual(errors,[]);
    samples.push({engine,theme,width,head,baseline,first,after,stressed,scope:'real browser DOM, emulated 200% root rem stress, not native iOS/Android Dynamic Type or accessibility seal'});
    console.log('[AXIS d16] PASS',JSON.stringify({engine,theme,width,finishHint: first.hintContrast,finishPx:first.finish.h,adjustPx:first.adjust.h,active:baseline.id}));
    await ctx.close();
   }
  }
 }finally{await browser.close()}
}
fs.writeFileSync(OUT+'/axis-832d16-active.json',JSON.stringify({schema:'axis.832d16.active-device-proxy.v1',head,samples,physicalCertified:false,productionCertified:false},null,2));
console.log('[AXIS d16] COMPLETE '+samples.length+' Active persisted/reloaded journeys');
