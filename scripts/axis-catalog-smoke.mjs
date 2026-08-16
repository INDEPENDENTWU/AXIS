import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(obj)});
for(const [pattern,obj] of [
  ['**/api/ai-status**',{ok:true,enabled:false}],
  ['**/api/owner-config**',{ok:true}],
  ['**/api/analyze**',{ok:false,disabled:true}],
  ['**/api/insight**',{ok:false,disabled:true}]
])await page.route(pattern,r=>json(r,obj));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));

const ready=async()=>{
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});
  await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:7000});
};
const names=()=>page.locator('#v8710Cards > button:visible b').allInnerTexts();
const settledNames=async(wait=240)=>{await page.waitForTimeout(wait);return names()};
const category=async label=>{
  await page.locator(`#v8710Cats [data-v8710-cat="${label}"]`).click();
  await page.waitForFunction(l=>document.querySelector(`#v8710Cats [data-v8710-cat="${l}"]`)?.classList.contains('active'),label,{timeout:900});
  return settledNames();
};
const requireNames=(actual,required,label)=>{
  for(const name of required)assert.ok(actual.includes(name),`${label} lost canonical item ${name}: ${JSON.stringify(actual)}`);
};
const same=(actual,expected,label)=>assert.deepEqual(actual,expected,`${label} changed canonical renderer/order:\nexpected=${JSON.stringify(expected)}\nactual=${JSON.stringify(actual)}`);
const openCatalog=async()=>{
  if(!await page.locator('#quickRecordSheet.show').count()){
    await page.locator('#quickRecordBtn').click();
    await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'),undefined,{timeout:1200});
  }
  await page.locator('#v8Other').click();
  await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show')&&document.querySelector('#v8710Cards > button'),undefined,{timeout:1600});
  await page.waitForTimeout(260);
};

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'domcontentloaded'});
await ready();
assert.equal(await page.evaluate(()=>window.__AXIS_ARCH__),'canonical-single-runtime');

await openCatalog();
const initial=await names();
assert.ok(initial.length>=8,`initial chest catalog unexpectedly sparse: ${JSON.stringify(initial)}`);
requireNames(initial,['杠铃卧推','哑铃卧推','俯卧撑','双杠臂屈伸','绳索夹胸','蝴蝶机夹胸','上斜卧推','下斜卧推'],'initial chest');

const chest=await category('胸');
same(chest,initial,'tapping active chest category');
assert.ok(chest.length>=8,`chest catalog collapsed after tap: ${JSON.stringify(chest)}`);

const chestAgain=await category('胸');
same(chestAgain,initial,'repeated chest tap');

const back=await category('背');
requireNames(back,['高位下拉','坐姿划船','引体向上','直臂下拉'],'back');
assert.ok(back.length>=7,`back catalog unexpectedly sparse: ${JSON.stringify(back)}`);

const shoulder=await category('肩');
requireNames(shoulder,['杠铃肩推','侧平举','面拉'],'shoulder');
assert.ok(shoulder.length>=5,`shoulder catalog unexpectedly sparse: ${JSON.stringify(shoulder)}`);

const arms=await category('手臂');
requireNames(arms,['哑铃弯举','绳索下压','过头臂屈伸'],'arms');
assert.ok(arms.length>=5,`arm catalog unexpectedly sparse: ${JSON.stringify(arms)}`);

const legs=await category('臀腿');
requireNames(legs,['杠铃深蹲','腿举','腿屈伸','罗马尼亚硬拉'],'legs');
assert.ok(legs.length>=8,`leg catalog unexpectedly sparse: ${JSON.stringify(legs)}`);

const core=await category('核心');
requireNames(core,['卷腹','平板支撑','健腹轮'],'core');
assert.ok(core.length>=5,`core catalog unexpectedly sparse: ${JSON.stringify(core)}`);

const cardio=await category('心肺');
requireNames(cardio,['跑步机','椭圆机','划船机'],'cardio');
assert.ok(cardio.length>=6,`cardio catalog unexpectedly sparse: ${JSON.stringify(cardio)}`);

const chestAfterTour=await category('胸');
same(chestAfterTour,initial,'returning to chest after category tour');

await page.locator('#eqSearch').fill('卧推');
await page.waitForTimeout(180);
const searchResults=await names();
assert.ok(searchResults.some(x=>x.includes('卧推')),`search lost expected bench results: ${JSON.stringify(searchResults)}`);
await page.locator('#eqSearch').fill('');
same(await settledNames(260),initial,'clearing search');

await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow')));
same(await settledNames(260),initial,'pageshow replay');

await page.locator('[data-close="eqSheet"]').click();
await page.waitForFunction(()=>!document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:900});
await openCatalog();
same(await settledNames(260),initial,'closing and reopening catalog');

for(let round=0;round<2;round++){
  for(const label of ['背','肩','手臂','臀腿','核心','心肺','胸'])await category(label);
  same(await settledNames(260),initial,`repeated category tour round ${round+1}`);
}

assert.equal(await page.locator('#v877EqGuide:visible').count(),0,'retired v877 catalog became visible');
assert.equal(await page.locator('#eqList:visible').count(),0,'base legacy catalog became visible');
assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log(`[AXIS catalog ${ENGINE}] PASS · one rich category owner · stable after repeated taps, delayed repaint windows, search clear, pageshow and reopen`);
await context.close();await browser.close();