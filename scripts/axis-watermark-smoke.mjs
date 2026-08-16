import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN',permissions:['geolocation'],geolocation:{latitude:22.52325,longitude:113.38381,accuracy:12}});
const page=await context.newPage();
const counts={osm:0,bdc:0};
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj,key] of [
  ['**/api/ai-status**',{ok:true,enabled:false},null],
  ['**/api/owner-config**',{ok:true},null],
  ['**/api/analyze**',{ok:false,disabled:true},null],
  ['**/api/insight**',{ok:false,disabled:true},null],
  ['**/nominatim.openstreetmap.org/reverse**',{name:'香洲健身中心',namedetails:{'name:zh':'香洲健身中心'},address:{road:'金玉路',house_number:'18号',neighbourhood:'莲新社区',city_district:'香洲区',city:'珠海市'}},'osm'],
  ['**/api.bigdatacloud.net/data/reverse-geocode-client**',{locality:'金玉路',city:'珠海市',principalSubdivision:'广东省',localityInfo:{informative:[],administrative:[]}},'bdc']
])await page.route(pattern,r=>{if(key)counts[key]++;return json(r,obj)});
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));

const ready=async()=>{
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});
  await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:7000});
};
const store=()=>page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('axis_v8_meta')||'{}')}catch{return{}}});
const openWatermark=async()=>{
  await page.locator('#settingsBtn').click();
  await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:1200});
  if(!await page.locator('#axisConfigGate-watermark.open').count())await page.locator('#watermarkBtn').click();
  await page.waitForFunction(()=>document.querySelector('#axisConfigGate-watermark')?.classList.contains('open'),undefined,{timeout:1200});
  await page.waitForFunction(()=>document.querySelector('#v85WmTime')&&document.querySelector('#v8710WmPreview'),undefined,{timeout:1200});
};
const setSwitch=async(id,on)=>{
  const b=page.locator(id);assert.ok(await b.isVisible(),`${id} is not visible`);
  const current=(await b.getAttribute('aria-checked'))==='true';
  if(current!==on){await b.click();await page.waitForTimeout(100)}
  assert.equal((await b.getAttribute('aria-checked'))==='true',on,`${id} visible state mismatch`);
};
const visible=async sel=>page.locator(sel).evaluate(el=>getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&!!(el.offsetWidth||el.offsetHeight||el.getClientRects().length));
const diag=()=>page.evaluate(()=>{let m={};try{m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}')}catch{}return{lastGeo:m.prefs?.v85LastGeo,resolve:m.prefs?.v8712PlaceResolve,place:m.prefs?.v8710PlaceName,auto:m.prefs?.v876LocationNameAuto,cache:m.prefs?.v8711PlaceCache,visibleName:document.querySelector('#v876LocationName')?.textContent,preview:document.querySelector('#v8710WmLoc')?.textContent,locationSwitch:document.querySelector('#v85WmLocation')?.getAttribute('aria-checked')}});

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'domcontentloaded'});
await ready();
assert.equal(await page.evaluate(()=>window.__AXIS_ARCH__),'canonical-single-runtime');
await page.evaluate(()=>{
  const n=document.querySelector('#equipmentName');if(n)n.textContent='杠铃卧推';
  const host=document.querySelector('#v8Sets');if(host&&!host.querySelector('[data-axis-wm-test]'))host.insertAdjacentHTML('beforeend','<div class="v8SetRow" data-axis-wm-test><span><b>20</b></span><span><b>10</b></span></div>');
});
await openWatermark();

for(const id of ['#v85WmName','#v85WmData','#v85WmLocation','#v85WmTime'])assert.ok(await page.locator(id).isVisible(),`missing canonical watermark switch ${id}`);
await setSwitch('#v85WmName',true);
await setSwitch('#v85WmData',true);
await setSwitch('#v85WmLocation',true);
await setSwitch('#v85WmTime',true);

console.log(`[AXIS watermark ${ENGINE}] precise location`);
await page.locator('#v876Locate').click();
try{
  await page.waitForFunction(()=>document.querySelector('#v876LocationName')?.textContent.includes('香洲健身中心'),undefined,{timeout:4500});
}catch(e){console.log('[AXIS watermark locate diagnostic]',JSON.stringify({counts,...await diag()},null,2));throw e}
await page.waitForFunction(()=>document.querySelector('#v8710WmLoc')?.textContent.includes('香洲健身中心'),undefined,{timeout:1200});
assert.ok(counts.osm>=1,'precise OSM resolver was not requested');
assert.equal(counts.bdc,0,'fallback geocoder should not run when OSM resolves precisely');
assert.ok((await page.locator('#v876LocationName').innerText()).includes('金玉路18号'),'precise road / house number missing');
assert.ok((await page.locator('#v876LocationName').innerText()).includes('莲新社区'),'precise neighbourhood missing');
const visibleText=await page.locator('#watermarkSheet').innerText();
assert.ok(!/22\.523|113\.383|纬度|经度|LAT\s|LON\s|±\d+m/.test(visibleText),`raw coordinates leaked into visible watermark UI: ${visibleText}`);

console.log(`[AXIS watermark ${ENGINE}] preview follows four switches`);
assert.ok(await visible('#v8710WmName'),'name preview should be visible');
assert.ok(await visible('#v8710WmData'),'data preview should be visible');
assert.ok(await visible('#v8710WmLoc'),'location preview should be visible');
assert.ok(await visible('#v8710WmTime'),'time preview should be visible');
assert.ok((await page.locator('#v8710WmName').innerText()).includes('杠铃卧推'));
assert.ok((await page.locator('#v8710WmData').innerText()).includes('20 kg'));
assert.match(await page.locator('#v8710WmTime').innerText(),/^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}$/);

for(const [id,preview,key] of [
  ['#v85WmName','#v8710WmName','v85WmName'],
  ['#v85WmData','#v8710WmData','v85WmData'],
  ['#v85WmLocation','#v8710WmLoc','v85WmLocation'],
  ['#v85WmTime','#v8710WmTime','v85WmTime']
]){
  await setSwitch(id,false);
  assert.equal(await visible(preview),false,`${preview} did not hide with ${id}`);
  let m=await store();assert.equal(m.prefs?.[key],false,`${key} did not persist false`);
  await setSwitch(id,true);
  await page.waitForTimeout(100);
  assert.equal(await visible(preview),true,`${preview} did not restore with ${id}`);
  m=await store();assert.equal(m.prefs?.[key],true,`${key} did not persist true`);
}

const meta=await store();
assert.ok(String(meta.prefs?.v8710PlaceName||'').includes('香洲健身中心'),'precise canonical place not persisted');
assert.ok(String(meta.prefs?.v8711PlaceCache?.zh||'').includes('金玉路18号'),'language place cache not persisted');
assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log(`[AXIS watermark ${ENGINE}] PASS · four switches sync preview/persistence · precise OSM place · no raw coordinates`);
await context.close();await browser.close();