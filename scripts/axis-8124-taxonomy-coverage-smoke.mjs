import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const search=async q=>{await page.locator('#eqSearch').fill(q);await page.waitForFunction(v=>document.querySelector('#eqSearch')?.value===v&&document.querySelector('#v873SmartResults')?.classList.contains('show'),q,{timeout:2200});await page.waitForTimeout(50);return(await page.locator('#v873SmartResults').innerText()).replace(/\s+/g,' ')};
try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_8124_LATE_TAXONOMY__?.storageWriter===false&&window.__AXIS_8124_SEARCH_SEMANTICS__?.storageWriter===false,undefined,{timeout:12000});
 const data=await page.evaluate(()=>{const lib=window.__AXIS_873_LIBRARY__||[],pick=id=>lib.find(x=>x.id===id);return Object.fromEntries(['plate-chest-press','high-row-machine','v-squat','ski-erg','suitcase-carry','smith-squat','assisted-dip','sled-push','farmer-carry','battle-rope','trx-row'].map(id=>{const x=pick(id);return[id,x?{primary:x.primaryTargets,secondary:x.secondaryTargets,stabilizers:x.stabilizers,details:x.detailMuscles,regions:x.bodyRegions,pattern:x.movementPattern,equipmentClass:x.equipmentClass,confidence:x.targetConfidence}:null]}))});
 for(const id of ['plate-chest-press','high-row-machine','v-squat','ski-erg','suitcase-carry']){assert.ok(data[id],`expanded native item missing ${id}`);assert.ok(data[id].primary?.length,`expanded native primary target missing ${id}`);assert.equal(data[id].confidence,'canonical',`expanded native confidence drift ${id}`)}
 for(const id of ['smith-squat','assisted-dip','sled-push','farmer-carry','battle-rope','trx-row']){assert.ok(data[id],`late native item missing ${id}`);assert.ok(data[id].primary?.length,`late native primary target missing ${id}`);assert.ok(data[id].details?.length,`late native detailed muscles missing ${id}`);assert.equal(data[id].confidence,'canonical-late',`late native confidence drift ${id}`)}
 assert.ok(data['high-row-machine'].primary.includes('背阔肌')&&data['high-row-machine'].secondary.includes('三角肌后束'));
 assert.ok(data['suitcase-carry'].primary.includes('腰方肌')&&data['suitcase-carry'].secondary.includes('前臂屈肌群'));
 assert.ok(data['farmer-carry'].primary.includes('前臂屈肌群')&&data['farmer-carry'].stabilizers.includes('多裂肌'));assert.equal(data['farmer-carry'].equipmentClass,'动作');
 assert.ok(data['sled-push'].primary.includes('股四头肌')&&data['sled-push'].primary.includes('臀大肌'));

 console.log(`[AXIS 8.12.4 taxonomy ${ENGINE}] Chinese semantic search resolves type, body region and equipment without broad fuzzy matching`);
 await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__?.('recording'));await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'));
 let text=await search('力量');assert.match(text,/卧推|深蹲|硬拉|划船|弯举|推举/,`力量 semantic search missed strength movements: ${text}`);assert.doesNotMatch(text,/跑步机|椭圆机/,`力量 search leaked obvious cardio: ${text}`);
 text=await search('有氧');assert.match(text,/跑步机|椭圆机|单车|划船机|登阶机/,`有氧 semantic search missed cardio: ${text}`);
 text=await search('胸部');assert.match(text,/卧推|胸推|飞鸟|俯卧撑/,`胸部 semantic search missed chest movements: ${text}`);
 text=await search('下肢');assert.match(text,/深蹲|腿举|弓步|腿屈伸|登阶/,`下肢 semantic search missed lower-body movements: ${text}`);
 text=await search('器械');assert.match(text,/器械|机器|史密斯|胸推|肩推|腿/,`器械 semantic search missed equipment-backed movements: ${text}`);
 await page.evaluate(()=>window.__AXIS_EQUIPMENT_SEARCH_RESET__?.());assert.equal(await page.locator('#eqSearch').inputValue(),'');

 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.12.4 taxonomy ${ENGINE}] PASS · expanded + late native anatomy · precise equipment semantics · Chinese type/body/equipment search`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
