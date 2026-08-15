import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';

const annotate=e=>{const s=String(e?.stack||e||'AXIS 8.8 smoke failure').replace(/%/g,'%25').replace(/\r?\n/g,'%0A');console.error(`::error title=AXIS 8.8 smoke::${s}`)};
process.on('uncaughtExceptionMonitor',annotate);process.on('unhandledRejection',annotate);

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN',permissions:['geolocation'],geolocation:{latitude:22.52325,longitude:113.38381,accuracy:18}});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(obj)});
await page.route('**/api/ai-status**',r=>json(r,{ok:true,enabled:false}));
await page.route('**/api/owner-config**',r=>json(r,{ok:true}));
await page.route('**/api/analyze**',r=>json(r,{ok:false,disabled:true}));
await page.route('**/api/insight**',r=>json(r,{ok:false,disabled:true}));
await page.route('https://nominatim.openstreetmap.org/**',r=>json(r,{name:'太鼓达人',namedetails:{'name:zh':'太鼓达人'},address:{road:'孙文东路',suburb:'莲新社区',city_district:'石岐街道',city:'中山市'}}));
await page.route('https://api.bigdatacloud.net/**',r=>json(r,{locality:'莲新社区',city:'中山市',principalSubdivision:'广东省',localityInfo:{informative:[{name:'孙文东路',description:'road',order:1}],administrative:[]}}));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const waitReady=async()=>{
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});
 await page.waitForFunction(()=>window.__AXIS_FEATURE_KERNEL__?.state==='ready',undefined,{timeout:12000});
 await page.waitForFunction(()=>window.__AXIS_COMPLETION_KERNEL__?.state==='ready',undefined,{timeout:6000});
};
const openSettings=async()=>{await page.locator('#settingsBtn').click();await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:1200})};

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});await waitReady();

console.log('[AXIS 8.8] public version single presentation');
const version=await page.locator('.versionLine').evaluate(el=>({aria:el.getAttribute('aria-label'),label:el.dataset.axisPublicLabel,font:getComputedStyle(el).fontSize,before:getComputedStyle(el,'::before').content,text:el.textContent}));
assert.equal(version.aria,'版本 8.8');assert.equal(version.label,'版本 8.8');assert.equal(version.font,'0px');assert.ok(String(version.before).includes('版本 8.8'),`missing public pseudo label: ${JSON.stringify(version)}`);

console.log('[AXIS 8.8] one custom-editor owner + automatic association');
await openSettings();await page.locator('#myEqBtn').click();await page.waitForFunction(()=>document.querySelector('#axisConfigGate-equipment')?.classList.contains('open'),undefined,{timeout:1200});
await page.locator('#newCustomEq').click();await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:1200});
assert.equal(await page.evaluate(()=>window.__AXIS_CUSTOM_EDITOR__?.owner),'v874');
assert.equal(await page.locator('#v873TypeMode,#v873MuscleMode,#v873Sense,#v874TypeMode,#v874MuscleMode').count(),0,'retired custom mode prose returned');
await page.locator('#customName').fill('测试胸推');await page.waitForTimeout(80);
assert.ok(await page.locator('#v874Details .active').count()>0,'name inference did not select professional detail');
assert.ok(await page.locator('#customMuscles .active').count()>0,'professional detail was not synchronized to canonical persistence fields');
const beforeDetails=await page.locator('#v874Details .active').count();await page.locator('[data-v874-region="arms"]').click();await page.waitForTimeout(30);
assert.ok(await page.locator('#v874Details .active').count()>0,'region selection did not express muscle intent');
assert.ok((await page.evaluate(()=>window.__AXIS_CUSTOM_EDITOR__?.snapshot()?.details?.length||0))>=beforeDetails,'manual region addition replaced automatic associations');
await page.locator('#saveCustomEq').click();await page.waitForFunction(()=>!document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:1200});
assert.notEqual((await page.locator('#toast').innerText()).trim(),'请选择锻炼部位','save rejected a visibly selected professional muscle');
const saved=await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('axis_v60_state')||'{}').profile?.customEq||[]}catch{return[]}});assert.ok(saved.some(x=>x.name==='测试胸推'&&(x.muscles||[]).length),'custom item did not persist canonical muscles');

console.log('[AXIS 8.8] Settings list reuses the same editor');
await openSettings();await page.locator('#myEqBtn').click();await page.waitForFunction(()=>document.querySelector('#axisConfigGate-equipment')?.classList.contains('open'),undefined,{timeout:1200});
const row=page.locator('#manageEqList [data-edit-eq]').filter({hasText:'测试胸推'}).first();assert.ok(await row.count(),'saved custom item missing from Settings');await row.click();
await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:1200});assert.equal(await page.locator('#customName').inputValue(),'测试胸推');assert.equal(await page.evaluate(()=>window.__AXIS_CUSTOM_EDITOR__?.owner),'v874');
await page.locator('#customEqSheet [data-close="customEqSheet"]').click();await page.waitForTimeout(80);

console.log('[AXIS 8.8] location is Chinese place presentation, coordinates stay private');
if(!await page.locator('#settingsSheet.show').count())await openSettings();await page.locator('#watermarkBtn').click();await page.waitForTimeout(100);
if(await page.locator('#v876Locate').count()){await page.locator('#v876Locate').click();await page.waitForFunction(()=>{const t=document.querySelector('#v876LocationName')?.textContent||'';return t&&t!=='未获取'},undefined,{timeout:5000})}
const loc=await page.evaluate(()=>({name:document.querySelector('#v876LocationName')?.textContent||'',coordDisplay:document.querySelector('#v876Coord')?getComputedStyle(document.querySelector('#v876Coord')).display:'absent',preview:(document.querySelector('#watermarkPreview')?.textContent||'')}));
assert.ok(/[\u3400-\u9fff]/.test(loc.name),`location is not concise Chinese: ${JSON.stringify(loc)}`);assert.ok(!/(LAT|LON|纬度|经度|±\s*\d|22\.523|113\.383)/i.test(loc.name+' '+loc.preview),`raw geodata leaked into presentation: ${JSON.stringify(loc)}`);assert.ok(loc.coordDisplay==='none'||loc.coordDisplay==='absent','coordinate row is visible');

console.log('[AXIS 8.8] recording copy + active adjustment transient invariant');
await page.reload({waitUntil:'domcontentloaded'});await waitReady();await page.locator('#quickRecordBtn').click();await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show')&&document.querySelector('#v8Recent [data-qid]'),undefined,{timeout:1500});await page.locator('#v8Recent [data-qid]').first().click();await page.waitForFunction(()=>document.querySelector('#v8Sets .v8SetRow'),undefined,{timeout:2200});
assert.ok(!(await page.locator('#v8Sets').innerText()).includes('记得多少就记多少'),'retired recording hint returned');
await page.evaluate(()=>{window.__AXIS_88_ADJUST_MAX__=0;const sample=()=>{const box=document.querySelector('#v87Now .v87Actions');if(!box)return;const n=[...box.querySelectorAll('button')].filter(x=>{const c=getComputedStyle(x),r=x.getBoundingClientRect();return c.display!=='none'&&c.visibility!=='hidden'&&r.width>0&&String(x.textContent||'').trim().startsWith('调整')}).length;window.__AXIS_88_ADJUST_MAX__=Math.max(window.__AXIS_88_ADJUST_MAX__,n)};const mo=new MutationObserver(sample);mo.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','style']});window.__AXIS_88_ADJUST_OBSERVER__=mo;sample()});
await page.locator('#saveScan').click();await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show'),undefined,{timeout:3500});await page.waitForTimeout(700);
const adjust=await page.evaluate(()=>{window.__AXIS_88_ADJUST_OBSERVER__?.disconnect();return{max:window.__AXIS_88_ADJUST_MAX__,now:[...document.querySelectorAll('#v87Now .v87Actions button')].filter(x=>getComputedStyle(x).display!=='none'&&String(x.textContent||'').trim().startsWith('调整')).map(x=>({id:x.id,text:x.textContent.trim()}))}});
assert.ok(adjust.max<=1,`adjustment flashed duplicate actions: ${JSON.stringify(adjust)}`);assert.equal(adjust.now.length,1,`canonical adjustment missing/duplicated: ${JSON.stringify(adjust)}`);

assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log('[AXIS 8.8] PASS · public label · custom owner · location privacy · recording copy · transient adjustment');
await context.close();await browser.close();
