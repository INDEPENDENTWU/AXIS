import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const options=ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true};
const browser=await launcher.launch(options);
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));

await page.addInitScript(()=>{
 const now=Date.now()-3600000;
 localStorage.setItem('axis_v60_state',JSON.stringify({
  version:60,
  active:null,
  sessions:[{id:'source-session',start:now,end:now+1800000,events:[
   {id:'E-SOURCE',equipmentId:'row',name:'坐姿 / 胸托划船',kind:'strength',time:now+60000,weight:30,reps:10,sets:3,frameRefs:['F-E-SOURCE-0'],sourceFrameRefs:['S-E-SOURCE-0'],clipRef:'V-E-SOURCE',sourceClipRef:'SV-E-SOURCE',presentation:{sourcePolicy:'clean-sidecar-v1'}},
   {id:'E-LEGACY',equipmentId:'chest',name:'胸推',kind:'strength',time:now+120000,weight:25,reps:10,sets:3,frameRefs:['F-E-LEGACY-0']}
  ]}],
  profile:{customEq:[]},
  prefs:{watermark:{photoMode:'wm',videoMode:'wm'}}
 }));
});

let armed=false,network=0;page.on('request',r=>{if(armed&&/\/api\//.test(new URL(r.url()).pathname))network++});
try{
 const response=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000});assert.ok(response?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_MEDIA_STORE__?.format==='axis-media-arraybuffer-v1'&&window.__AXIS_MEDIA_SOURCE__?.readOnly===true&&window.__AXIS_8171_SOURCE_MEDIA__?.cleanMaster===true&&window.__AXIS_8171_WATERMARK_SOURCE__?.destructive===false&&window.__AXIS_8171_EVIDENCE_SOURCE__?.cleanSourceFirst===true,undefined,{timeout:15000});
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.17');
 assert.equal(await page.evaluate(()=>window.__AXIS_MEDIA_SOURCE__.store),'axis_v42_media');
 assert.equal(await page.evaluate(()=>window.__AXIS_MEDIA_SOURCE__.sourcePolicy),'clean-sidecar-v1');
 assert.equal(await page.evaluate(()=>window.__AXIS_MEDIA_SOURCE__.canonicalFallback),true);
 assert.equal(await page.evaluate(()=>window.__AXIS_MEDIA_SOURCE__.resolveRef('F-E-SOURCE-0')),'S-E-SOURCE-0');
 assert.equal(await page.evaluate(()=>window.__AXIS_MEDIA_SOURCE__.resolveRef('V-E-SOURCE')),'SV-E-SOURCE');
 assert.equal(await page.evaluate(()=>window.__AXIS_MEDIA_SOURCE__.resolveRef('F-E-LEGACY-0')),'F-E-LEGACY-0');

 await page.evaluate(async()=>{
  const store=window.__AXIS_MEDIA_STORE__,blob=t=>new Blob([t],{type:'text/plain'});
  await store.put('F-E-SOURCE-0',blob('CANONICAL_WATERMARKED_PHOTO'));
  await store.put('S-E-SOURCE-0',blob('CLEAN_SOURCE_PHOTO'));
  await store.put('V-E-SOURCE',blob('CANONICAL_WATERMARKED_VIDEO'));
  await store.put('SV-E-SOURCE',blob('CLEAN_SOURCE_VIDEO'));
  await store.put('F-E-LEGACY-0',blob('LEGACY_CANONICAL_ONLY'));
 });
 armed=true;
 const values=await page.evaluate(async()=>({
  photo:await (await window.__AXIS_MEDIA_SOURCE__.get('F-E-SOURCE-0')).text(),
  video:await (await window.__AXIS_MEDIA_SOURCE__.get('V-E-SOURCE')).text(),
  legacy:await (await window.__AXIS_MEDIA_SOURCE__.get('F-E-LEGACY-0')).text()
 }));
 assert.equal(values.photo,'CLEAN_SOURCE_PHOTO','photo did not resolve untouched source');
 assert.equal(values.video,'CLEAN_SOURCE_VIDEO','video did not resolve untouched source');
 assert.equal(values.legacy,'LEGACY_CANONICAL_ONLY','legacy canonical fallback failed');
 assert.equal(network,0,'source-first local read unexpectedly acquired API ownership');
 assert.equal(await page.evaluate(()=>window.__AXIS_8171_WATERMARK_SOURCE__.photoSource),'clean-sidecar-first');
 assert.equal(await page.evaluate(()=>window.__AXIS_8171_WATERMARK_SOURCE__.canonicalOutput),'frameRefs');
 assert.equal(await page.evaluate(()=>window.__AXIS_8171_EVIDENCE_SOURCE__.canonicalFallback),true);
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.17.1 Source-first Media ${ENGINE}] PASS · photo source · video source · legacy fallback · watermark non-destructive · Evidence source-first · no API ownership`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
