import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
await page.addInitScript(()=>{try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{throw new Error('AXIS_TEST_CAMERA_OFFLINE')}}})}catch{}});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_8125_SMART_CREATE_POLISH__?.version==='8.12.5',undefined,{timeout:12000});
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.5');
 await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__?.('recording'));
 await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'));
 const q='事实上';await page.locator('#eqSearch').fill(q);
 await page.waitForFunction(v=>document.querySelector('#v873SmartResults [data-axis-create-custom="'+CSS.escape(v)+'"]'),q,{timeout:2500});
 const card=page.locator('#v873SmartResults .v873SmartCreate').first(),title=card.locator('b'),sub=card.locator('small'),chev=card.locator('em');
 assert.equal(await card.isVisible(),true,'smart-create card not visible');
 assert.match(await title.innerText(),/新建“事实上”/);assert.match(await sub.innerText(),/加入我的器械/);
 const g=await page.evaluate(()=>{const c=document.querySelector('.v873SmartCreate'),b=c?.querySelector('b'),s=c?.querySelector('small'),e=c?.querySelector('em');if(!c||!b||!s||!e)return null;const cr=c.getBoundingClientRect(),br=b.getBoundingClientRect(),sr=s.getBoundingClientRect(),er=e.getBoundingClientRect(),cs=getComputedStyle(c),bs=getComputedStyle(b),ss=getComputedStyle(s);return{h:cr.height,leftTitle:br.left-cr.left,leftSub:sr.left-cr.left,rightChevron:cr.right-er.right,chevMid:Math.abs((er.top+er.height/2)-(cr.top+cr.height/2)),radius:parseFloat(cs.borderTopLeftRadius),titleSize:parseFloat(bs.fontSize),subSize:parseFloat(ss.fontSize),titleLine:parseFloat(bs.lineHeight),subLine:parseFloat(ss.lineHeight)}});
 assert.ok(g,'geometry unavailable');assert.ok(g.h>=71&&g.h<=74,`card height ${g.h}`);assert.ok(g.leftTitle>=15&&g.leftTitle<=17,`title left inset ${g.leftTitle}`);assert.ok(g.leftSub>=15&&g.leftSub<=17,`subtitle left inset ${g.leftSub}`);assert.ok(g.rightChevron>=15&&g.rightChevron<=18,`chevron right inset ${g.rightChevron}`);assert.ok(g.chevMid<=1,`chevron not vertically centered ${g.chevMid}`);assert.ok(g.radius>=15&&g.radius<=17,`radius ${g.radius}`);assert.equal(g.titleSize,14);assert.equal(g.subSize,11);assert.ok(g.titleLine>=18&&g.titleLine<=20);assert.ok(g.subLine>=15&&g.subLine<=17);
 await tap(card);await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show'));
 assert.equal(await page.locator('#customName').inputValue(),q,'query prefill changed');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.12.5 smart-create ${ENGINE}] PASS · 16px text rail · 72px card · centered 16px chevron · 14/11 typography · canonical create handoff`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
