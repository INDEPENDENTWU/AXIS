import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:430,height:932},locale:'zh-CN'});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{ok:true,enabled:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{ok:false,disabled:true}],['**/api/insight**',{ok:false,disabled:true}]])await page.route(pattern,r=>json(r,obj));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const waitReady=async()=>{await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:6500})};
const openSettings=async()=>{if(!await page.locator('#settingsSheet.show').count())await page.locator('#settingsBtn').click();await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:1200})};
const openGate=async(btn,gate)=>{await openSettings();if(!await page.locator(`${gate}.open`).count())await page.locator(btn).click();await page.waitForFunction(sel=>document.querySelector(sel)?.classList.contains('open'),gate,{timeout:1200})};
const snapshot=label=>page.evaluate(l=>{
 const q=s=>document.querySelector(s), css=e=>e?getComputedStyle(e):null, box=e=>{if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,top:r.top,bottom:r.bottom}};
 const gate=q('#v8711RecordGate'),fold=gate?.querySelector('.v8711Fold'),second=q('#settingsSheet .settingsList.second'),scan=q('#scanSeconds'),legacy=q('#scanSeconds [data-sec="5"]'),keep=q('#keepClipSwitch'),sheet=q('#settingsSheet .sheet');
 const children=scan?[...scan.children].map((x,i)=>({i,tag:x.tagName,id:x.id||'',class:String(x.className||''),text:String(x.textContent||'').trim(),attrs:[...x.attributes].reduce((o,a)=>(o[a.name]=a.value,o),{}),box:box(x)})):[];
 let target=legacy||children.map(x=>scan.children[x.i]).find(x=>/5\s*秒|^5$/.test(String(x.textContent||'').trim()))||null;
 let center=null,hit=null;if(target){const r=target.getBoundingClientRect();center={x:r.left+r.width/2,y:r.top+r.height/2};const h=document.elementFromPoint(center.x,center.y);hit=h?{tag:h.tagName,id:h.id||'',class:String(h.className||''),text:String(h.textContent||'').trim().slice(0,60),attrs:[...h.attributes].reduce((o,a)=>(o[a.name]=a.value,o),{})}:null}
 const info=e=>{const c=css(e);return e?{box:box(e),display:c.display,visibility:c.visibility,opacity:c.opacity,pointerEvents:c.pointerEvents,overflow:c.overflow,position:c.position,zIndex:c.zIndex}:null};
 return{label:l,settingsClass:q('#settingsSheet')?.className||'',settingsScroll:sheet?.scrollTop||0,openGates:[...document.querySelectorAll('#settingsSheet .v8711SettingGate.open,#settingsSheet .axisConfigGate.open')].map(x=>x.id),gateClass:gate?.className||'',gate:info(gate),fold:info(fold),second:info(second),scan:info(scan),scanHtml:scan?.outerHTML||'',scanChildren:children,target:info(target),keep:info(keep),center,hit};
},label);

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});await waitReady();
await openGate('#profileBtn','#axisConfigGate-profile');await page.locator('#profileName').fill('Ray');await page.locator('#profileWeight').fill('92');await page.locator('#saveProfile').click();await page.waitForTimeout(80);
await openGate('#myEqBtn','#axisConfigGate-equipment');await page.locator('#newCustomEq').click();await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:1200});await page.locator('#customName').fill('矩阵胸推');await page.waitForTimeout(100);await page.locator('#saveCustomEq').click();await page.waitForFunction(()=>!document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:1200});
await openGate('#myEqBtn','#axisConfigGate-equipment');const row=page.locator('#manageEqList [data-my-eq-id]').filter({hasText:'矩阵胸推'}).first();assert.ok(await row.count(),'saved custom item missing from current personal equipment list');await row.click();await page.waitForFunction(()=>document.querySelector('#v8123EqDetailSheet')?.classList.contains('show'),undefined,{timeout:1600});assert.equal((await page.locator('#v8123EqDetailTitle').innerText()).trim(),'矩阵胸推');await page.locator('#v8123EqInfoEdit').click();await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:1200});await page.locator('#customEqSheet [data-close="customEqSheet"]').click();await page.waitForTimeout(80);await openSettings();

console.log('[AXIS record-pref before]',JSON.stringify(await snapshot('before-open'),null,2));
await openGate('#v8711RecordGate > .settingLink','#v8711RecordGate');await page.waitForTimeout(80);
const after=await snapshot('after-open');console.log('[AXIS record-pref after]',JSON.stringify(after,null,2));
const target=page.locator('#scanSeconds').locator('button').filter({hasText:/^(5|5秒)$/}).first();
assert.ok(await target.count(),`canonical 5-second preference control missing: ${JSON.stringify(after.scanChildren)}`);
assert.ok(await target.isVisible(),`canonical 5-second preference control is not visible: ${JSON.stringify(after)}`);
const r=await target.boundingBox();assert.ok(r&&r.width>0&&r.height>0,'canonical record preference target has no geometry');
assert.ok(after.hit&&after.hit.tag==='BUTTON',`record preference target center is covered: ${JSON.stringify(after.hit)}`);
await target.click({timeout:2000});await page.waitForTimeout(60);assert.ok(await target.evaluate(x=>x.classList.contains('active')),'5-second preference did not activate');
assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log('[AXIS record-pref diagnostic] PASS · current equipment detail route · canonical gate opens and control is actionable');
await context.close();await browser.close();
