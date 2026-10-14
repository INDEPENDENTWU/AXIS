import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {chromium,webkit} from 'playwright';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4430',OUT=process.env.AXIS_D17_REPORT_DIR||'/tmp/axis-d17',engines=(process.env.AXIS_D17_ENGINES||'chromium webkit').split(/\s+/);
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
fs.mkdirSync(OUT,{recursive:true});const samples=[];
for(const [engine,launcher] of [['chromium',chromium],['webkit',webkit]]){
 if(!engines.includes(engine))continue;
 const browser=await launcher.launch(engine==='chromium'?{headless:true,args:['--no-sandbox']}:{headless:true});
 try{
  for(const theme of ['dark','light']){
   for(const [width,height] of [[390,755],[390,660],[430,820]]){
    const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:2,isMobile:engine==='webkit',hasTouch:true,colorScheme:theme,locale:'zh-CN',reducedMotion:'reduce'}),p=await ctx.newPage(),errors=[];
    p.on('pageerror',err=>errors.push(String(err)));
    for(const [pattern,body] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await ctx.route(pattern,r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)}));
    await p.addInitScript(v=>localStorage.setItem('axis_ui_theme_v1',v),theme);
    await p.goto(BASE,{waitUntil:'domcontentloaded'});
    await p.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__&&window.__AXIS_832_PLAY_THIS__,null,{timeout:16000});
    await p.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__('quick'));
    await p.locator('#eqSearch').fill('胸托划船');
    await p.locator('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]').first().click();
    await p.locator('#saveScan').click();
    await p.waitForFunction(()=>document.querySelector('#v87Now.show')&&JSON.parse(localStorage.getItem('axis_v60_state')||'{}').active?.events?.length===1,null,{timeout:16000});
    const initialState=await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return{id:s.active.id,event:s.active.events[0].id}});
    const audit=()=>p.evaluate(()=>{
      const q=k=>{const el=document.querySelector(k),c=getComputedStyle(el),r=el.getBoundingClientRect();return{top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height,z:Number(c.zIndex),position:c.position,bg:c.backgroundColor,isolated:c.isolation}};
      const opaque=s=>{let m=s.match(/^rgba?\((.+)\)$/);if(!m)return false;const nums=m[1].replaceAll(',',' ').replace('/',' ').split(/\s+/).filter(Boolean).map(Number);return nums.length===3||nums[3]>=.99};
      const nav=q('.nav.v82Nav'),dock=q('#dock.v8-dual'),active=q('#v87Now'),settings=q('#settingsSheet'),camera=q('#scanBtn'),quick=q('#quickRecordBtn');
      const view={height:innerHeight,width:innerWidth,scroll:scrollY,maxScroll:document.documentElement.scrollHeight-innerHeight,overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth)};
      return{view,nav,dock,active,settings,camera,quick,navOpaque:opaque(nav.bg),dockOpaque:opaque(dock.bg),navPoint:document.elementFromPoint(12,Math.min(innerHeight-5,nav.top+5))?.id||document.elementFromPoint(12,Math.min(innerHeight-5,nav.top+5))?.className,actualPalette:document.documentElement.dataset.axisTheme};
    });
    const readings=[];for(const offset of [0,155,10000]){await p.evaluate(y=>window.scrollTo(0,y),offset);await p.waitForTimeout(70);const x=await audit();assert.equal(x.actualPalette,theme);assert.ok(x.navOpaque&&x.dockOpaque,'Fixed bottom rails must paint opaque background over legacy content');assert.ok(x.dock.z>x.active.z,'Recording dock must occlude moving Active strokes, including dividers');assert.ok(x.nav.z>x.dock.z,'Navigation must occlude old large timers');assert.ok(x.nav.z<x.settings.z,'Modal overlays remain on top of fixed bottom controls');assert.ok(x.view.overflow<=1,'No page horizontal overflow');assert.ok(x.camera.height>=64&&x.quick.height>=64,'Recording controls retain 64px touch areas');assert.equal(Math.round(x.nav.bottom),Math.round(x.view.height),'Nav must stay pinned to viewport edge');assert.ok(x.dock.bottom<=x.nav.top+1,'Recording dock and nav cannot overlap each other');readings.push(x)}
    if(width===390&&height===755){await p.evaluate(()=>window.scrollTo(0,0));await p.screenshot({path:OUT+'/active-bottom-'+engine+'-'+theme+'.png'})}
    await p.evaluate(()=>window.scrollTo(0,0));
    await p.locator('#settingsBtn').click();
    assert.equal(await p.locator('#settingsSheet.show').count(),1);
    const menu=await p.evaluate(()=>{let sheet=document.querySelector('#settingsSheet'),r=sheet.getBoundingClientRect(),s=getComputedStyle(sheet);return{z:+s.zIndex,aboveNav:document.elementFromPoint(innerWidth/2,innerHeight-12)?.closest('#settingsSheet')!==null,rect:r.height}});
    assert.ok(menu.z>readings[0].nav.z,'Settings must stay above nav');
    await p.locator('#settingsSheet [data-close="settingsSheet"]').first().click();
    assert.deepEqual(await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return{id:s.active.id,event:s.active.events[0].id}}),initialState,'Visual rail fix must never mutate Active facts');
    assert.deepEqual(errors,[]);
    samples.push({engine,theme,width,height,head,readings:readings.map(({view,nav,dock,active,settings,navOpaque,dockOpaque})=>({view,nav,dock,active,settings,navOpaque,dockOpaque})),originalActive:initialState});
    console.log('[AXIS d17] PASS',JSON.stringify({engine,theme,width,height,navOpaque:true,railOrder:true,scrollTests:3}));
    await ctx.close();
   }
  }
 }finally{await browser.close()}
}
fs.writeFileSync(OUT+'/axis-832d17-scroll-overlay.json',JSON.stringify({schema:'axis.832d17.scroll.rail.v1',head,physicalDevice:false,samples},null,2));
console.log('[AXIS d17] COMPLETE '+samples.length+' scroll/dock/nav user journeys');
