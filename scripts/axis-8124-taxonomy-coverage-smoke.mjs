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
try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_8124_LATE_TAXONOMY__?.storageWriter===false,undefined,{timeout:12000});
 const data=await page.evaluate(()=>{const lib=window.__AXIS_873_LIBRARY__||[],pick=id=>lib.find(x=>x.id===id);return Object.fromEntries(['plate-chest-press','high-row-machine','v-squat','ski-erg','suitcase-carry','smith-squat','assisted-dip','sled-push','farmer-carry','battle-rope','trx-row'].map(id=>{const x=pick(id);return[id,x?{primary:x.primaryTargets,secondary:x.secondaryTargets,stabilizers:x.stabilizers,details:x.detailMuscles,regions:x.bodyRegions,pattern:x.movementPattern,confidence:x.targetConfidence}:null]}))});
 for(const id of ['plate-chest-press','high-row-machine','v-squat','ski-erg','suitcase-carry']){assert.ok(data[id],`expanded native item missing ${id}`);assert.ok(data[id].primary?.length,`expanded native primary target missing ${id}`);assert.equal(data[id].confidence,'canonical',`expanded native confidence drift ${id}`)}
 for(const id of ['smith-squat','assisted-dip','sled-push','farmer-carry','battle-rope','trx-row']){assert.ok(data[id],`late native item missing ${id}`);assert.ok(data[id].primary?.length,`late native primary target missing ${id}`);assert.ok(data[id].details?.length,`late native detailed muscles missing ${id}`);assert.equal(data[id].confidence,'canonical-late',`late native confidence drift ${id}`)}
 assert.ok(data['high-row-machine'].primary.includes('背阔肌')&&data['high-row-machine'].secondary.includes('三角肌后束'));
 assert.ok(data['suitcase-carry'].primary.includes('腰方肌')&&data['suitcase-carry'].secondary.includes('前臂屈肌群'));
 assert.ok(data['farmer-carry'].primary.includes('前臂屈肌群')&&data['farmer-carry'].stabilizers.includes('多裂肌'));
 assert.ok(data['sled-push'].primary.includes('股四头肌')&&data['sled-push'].primary.includes('臀大肌'));
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.12.4 taxonomy ${ENGINE}] PASS · expanded 8.9 catalog + late v8711 native movements carry explicit primary/secondary/stabilizer anatomy`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
