import assert from 'node:assert/strict';
import {webkit} from 'playwright';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browser=await webkit.launch({headless:true});
const context=await browser.newContext({
  viewport:{width:390,height:844},
  deviceScaleFactor:3,
  isMobile:true,
  hasTouch:true,
  locale:'zh-CN',
  permissions:['geolocation'],
  geolocation:{latitude:22.52325,longitude:113.38381,accuracy:18}
});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(obj)});
await page.route('**/api/ai-status**',r=>json(r,{ok:true,enabled:false}));
await page.route('**/api/owner-config**',r=>json(r,{ok:true}));
await page.route('**/api/analyze**',r=>json(r,{ok:false,disabled:true}));
await page.route('**/api/insight**',r=>json(r,{ok:false,disabled:true}));
await page.route('https://nominatim.openstreetmap.org/**',r=>json(r,{name:'太鼓达人',namedetails:{'name:zh':'太鼓达人'},address:{road:'孙文东路',suburb:'莲新社区',city_district:'石岐街道',city:'中山市'}}));
await page.route('https://api.bigdatacloud.net/**',r=>json(r,{locality:'莲新社区',city:'中山市',principalSubdivision:'广东省',localityInfo:{informative:[{name:'孙文东路',description:'road',order:1}],administrative:[]}}));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
let retiredRequests=0;
for(const p of ['**/axis-enhance-foundation.js**','**/axis-enhance-recording.js**','**/axis-enhance-interaction.js**','**/axis-enhance-product.js**','**/v8712-runtime.js**','**/v8712-completion.js**'])await page.route(p,r=>{retiredRequests++;return r.abort('failed')});
const scripts=[];page.on('request',r=>{if(r.resourceType()==='script')scripts.push(new URL(r.url()).pathname)});

const waitReady=async()=>{
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});
 await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready'&&window.__AXIS_FEATURE_KERNEL__?.state==='ready'&&window.__AXIS_COMPLETION_KERNEL__?.state==='ready',undefined,{timeout:6500});
};
const openSettings=async()=>{if(!await page.locator('#settingsSheet.show').count())await page.locator('#settingsBtn').click();await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:1200})};

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});await waitReady();
assert.equal(await page.evaluate(()=>window.__AXIS_ARCH__),'canonical-single-runtime');
assert.equal(document?.undefined,undefined);
assert.equal((await page.locator('.versionLine').getAttribute('aria-label')||'').trim(),'版本 8.8');
assert.equal(retiredRequests,0,'WebKit attempted a retired dynamic runtime request');
assert.deepEqual([...new Set(scripts)],['/axis-core.js'],`WebKit loaded unexpected scripts: ${JSON.stringify(scripts)}`);

console.log('[AXIS WebKit] Settings + canonical custom editor');
await openSettings();
await page.locator('#myEqBtn').click();await page.waitForFunction(()=>document.querySelector('#axisConfigGate-equipment')?.classList.contains('open'),undefined,{timeout:1200});
await page.locator('#newCustomEq').click();await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:1200});
assert.equal(await page.evaluate(()=>window.__AXIS_CUSTOM_EDITOR__?.owner),'v874');
assert.equal(await page.locator('#v873TypeMode,#v873MuscleMode,#v873Sense,#v874TypeMode,#v874MuscleMode').count(),0,'retired custom-editor prose returned in WebKit');
await page.locator('#customName').fill('测试胸推');await page.waitForTimeout(100);
assert.ok(await page.locator('#v874Details .active').count()>0,'WebKit name inference did not select muscle details');
assert.ok(await page.locator('#customMuscles .active').count()>0,'WebKit custom editor did not synchronize canonical muscles');
await page.locator('#saveCustomEq').click();await page.waitForFunction(()=>!document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:1200});
assert.notEqual((await page.locator('#toast').innerText()).trim(),'请选择锻炼部位');
const saved=await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('axis_v60_state')||'{}').profile?.customEq||[]}catch{return[]}});
assert.ok(saved.some(x=>x.name==='测试胸推'&&(x.muscles||[]).length),'WebKit custom item persistence failed');

console.log('[AXIS WebKit] concise Chinese location');
await openSettings();await page.locator('#watermarkBtn').click();await page.waitForTimeout(100);
if(await page.locator('#v876Locate').count()){
 await page.locator('#v876Locate').click();
 await page.waitForFunction(()=>{const t=document.querySelector('#v876LocationName')?.textContent||'';return t&&t!=='未获取'},undefined,{timeout:5000});
 const loc=await page.evaluate(()=>({name:document.querySelector('#v876LocationName')?.textContent||'',preview:document.querySelector('#watermarkPreview')?.textContent||'',coord:document.querySelector('#v876Coord')?getComputedStyle(document.querySelector('#v876Coord')).display:'absent'}));
 assert.ok(/[\u3400-\u9fff]/.test(loc.name),`WebKit location is not Chinese: ${JSON.stringify(loc)}`);
 assert.ok(!/(LAT|LON|纬度|经度|±\s*\d|22\.523|113\.383)/i.test(loc.name+' '+loc.preview),`WebKit raw geodata leaked: ${JSON.stringify(loc)}`);
 assert.ok(loc.coord==='none'||loc.coord==='absent','WebKit coordinate row is visible');
}

console.log('[AXIS WebKit] recording + active-session transient owner');
await page.reload({waitUntil:'domcontentloaded'});await waitReady();
await page.locator('#quickRecordBtn').click();await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show')&&document.querySelector('#v8Recent [data-qid]'),undefined,{timeout:1500});
await page.locator('#v8Recent [data-qid]:visible').first().click();await page.waitForFunction(()=>document.querySelector('#v8Sets .v8SetRow')&&document.querySelector('#axisSetControls'),undefined,{timeout:2200});
assert.ok(!(await page.locator('#v8Sets').innerText()).includes('记得多少就记多少'),'retired first-record copy returned in WebKit');
await page.locator('#axisSetControls [data-axis-input="weight"]').fill('27.5');await page.locator('#axisSetControls [data-axis-input="weight"]').press('Enter');await page.waitForTimeout(60);
assert.equal(Number(await page.locator('#v8Sets .v8SetRow.active span b').first().innerText()),27.5,'WebKit direct weight input failed');
await page.evaluate(()=>{window.__AXIS_WK_ADJUST_MAX__=0;const sample=()=>{const box=document.querySelector('#v87Now .v87Actions');if(!box)return;const n=[...box.querySelectorAll('button')].filter(x=>{const c=getComputedStyle(x),r=x.getBoundingClientRect();return c.display!=='none'&&c.visibility!=='hidden'&&r.width>0&&String(x.textContent||'').trim().startsWith('调整')}).length;window.__AXIS_WK_ADJUST_MAX__=Math.max(window.__AXIS_WK_ADJUST_MAX__,n)};const mo=new MutationObserver(sample);mo.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','style']});window.__AXIS_WK_ADJUST_OBSERVER__=mo;sample()});
await page.locator('#saveScan').click();await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show'),undefined,{timeout:3500});await page.waitForTimeout(700);
const adjust=await page.evaluate(()=>{window.__AXIS_WK_ADJUST_OBSERVER__?.disconnect();return{max:window.__AXIS_WK_ADJUST_MAX__,now:[...document.querySelectorAll('#v87Now .v87Actions button')].filter(x=>getComputedStyle(x).display!=='none'&&String(x.textContent||'').trim().startsWith('调整')).map(x=>({id:x.id,text:x.textContent.trim()}))}});
assert.ok(adjust.max<=1,`WebKit duplicate adjustment flashed: ${JSON.stringify(adjust)}`);assert.equal(adjust.now.length,1,`WebKit canonical adjustment missing/duplicated: ${JSON.stringify(adjust)}`);assert.equal(adjust.now[0].id,'v87AdjustBtn');
assert.equal(await page.locator('#v8710EditOnce,#v879EditBtn').count(),0,'retired active adjustment owner returned in WebKit');

const toggle=page.locator('#v87Toggle');await toggle.click();await page.waitForTimeout(90);assert.equal((await toggle.innerText()).trim(),'▶','WebKit pause failed');await toggle.click();await page.waitForTimeout(90);assert.equal((await toggle.innerText()).trim(),'Ⅱ','WebKit resume failed');
assert.deepEqual(errors,[],`WebKit uncaught page errors:\n${errors.join('\n')}`);
console.log('[AXIS WebKit] PASS · canonical 8.8 · custom editor · location · recording · active session');
await context.close();await browser.close();
