import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core'),launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});
const seed={version:60,sessions:[{id:'v2-s1',start:1788950000000,end:1788951800000,events:[{id:'v2-e1',equipmentId:'row',name:'划船',kind:'strength',time:1788950300000,sets:4,reps:10,weight:55}]}],active:null,profile:{name:'Backup V2 Proof',customEq:[],memories:[]},prefs:{scanSeconds:3,keepClip:true}};
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
await context.addInitScript(s=>{if(sessionStorage.getItem('__axis_v2_seeded')==='1')return;localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify(s));localStorage.setItem('axis_v8_meta',JSON.stringify({events:{}}));localStorage.setItem('foreign_keep','v2-must-survive');sessionStorage.setItem('__axis_v2_seeded','1')},seed);
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));

try{
  assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:20000}))?.ok());
  await page.waitForLoadState('load',{timeout:20000});
  await page.waitForFunction(()=>window.__AXIS_PORTABLE_BACKUP__?.exportSchema==='axis.backup.v2'&&window.__AXIS_MEDIA_STORE__?.keys,undefined,{timeout:20000});

  const seeded=await page.evaluate(async()=>{
    const store=window.__AXIS_MEDIA_STORE__,spec=[['F-v2-large-a','image/jpeg',6*1024*1024,17],['V-v2-large-b','video/mp4',8*1024*1024,93],['F-v2-large-c','image/png',4*1024*1024,201]];
    for(const [key,type,size,byte] of spec){const u=new Uint8Array(size);u.fill(byte);u[0]=byte^0x5a;u[size-1]=byte^0xa5;await store.put(key,new Blob([u],{type}))}
    return{keys:await store.keys(),total:spec.reduce((n,x)=>n+x[2],0)};
  });
  assert.deepEqual(seeded.keys,['F-v2-large-a','F-v2-large-c','V-v2-large-b']);
  assert.equal(seeded.total,18*1024*1024);

  await page.locator('#backupBtn').click();
  await page.waitForFunction(()=>document.querySelector('#backupBtn')?.textContent.trim()==='保存完整备份'&&window.__AXIS_BACKUP_EXPORT_READY__?.file,undefined,{timeout:45000});
  const exportMeta=await page.evaluate(async()=>{
    const ready=window.__AXIS_BACKUP_EXPORT_READY__,file=ready.file,header=ready.header,p=window.__AXIS_PORTABLE_BACKUP__,parsed=await p.verifyFile(file);
    window.__AXIS_V2_FILE__=file;
    const media=header.webOriginSnapshot.media;
    const noEmbedded=media.every(x=>!Object.hasOwn(x,'data')&&!Object.hasOwn(x,'encoding'));
    const offsets=media.map(x=>x.offset),sizes=media.map(x=>x.size),types=media.map(x=>x.type),keys=media.map(x=>x.key);
    return{schema:header.schema,fileSize:file.size,mediaBytes:header.manifest.mediaBytes,mediaCount:header.manifest.mediaCount,noEmbedded,offsets,sizes,types,keys,verifiedCount:parsed.verified.summary.mediaCount,button:document.querySelector('#backupBtn')?.textContent.trim(),foreign:localStorage.getItem('foreign_keep')};
  });
  assert.equal(exportMeta.schema,'axis.backup.v2');assert.equal(exportMeta.mediaBytes,18*1024*1024);assert.equal(exportMeta.mediaCount,3);assert.equal(exportMeta.verifiedCount,3);assert.equal(exportMeta.noEmbedded,true);assert.equal(exportMeta.button,'保存完整备份');assert.equal(exportMeta.foreign,'v2-must-survive');
  assert.deepEqual(exportMeta.offsets,[0,6*1024*1024,10*1024*1024]);
  assert.deepEqual(exportMeta.sizes,[6*1024*1024,4*1024*1024,8*1024*1024]);
  assert.deepEqual(exportMeta.keys,['F-v2-large-a','F-v2-large-c','V-v2-large-b']);
  assert.deepEqual(exportMeta.types,['image/jpeg','image/png','video/mp4']);
  assert.ok(exportMeta.fileSize>exportMeta.mediaBytes&&exportMeta.fileSize<exportMeta.mediaBytes+512*1024,'binary header should stay small and media should remain raw');

  const corrupt=await page.evaluate(async()=>{
    const p=window.__AXIS_PORTABLE_BACKUP__,file=window.__AXIS_V2_FILE__,parsed=await p.verifyFile(file),pos=parsed.verified.mediaStart+parsed.verified.media[0].offset,first=new Uint8Array(await file.slice(pos,pos+1).arrayBuffer())[0],badByte=new Uint8Array([first^0xff]),bad=new File([file.slice(0,pos),badByte,file.slice(pos+1)],'bad.axisbackup',{type:file.type});let rejected=false,message='';try{await p.verifyFile(bad)}catch(e){rejected=true;message=String(e?.message||e)}return{rejected,message,storage:localStorage.getItem('axis_v60_state'),foreign:localStorage.getItem('foreign_keep')};
  });
  assert.equal(corrupt.rejected,true);assert.match(corrupt.message,/backup-media-integrity-mismatch/);assert.ok(corrupt.storage?.includes('v2-s1'));assert.equal(corrupt.foreign,'v2-must-survive');

  await page.evaluate(async()=>{for(let i=localStorage.length-1;i>=0;i--){const k=localStorage.key(i);if(k?.startsWith('axis_'))localStorage.removeItem(k)}await window.__AXIS_MEDIA_STORE__.replaceAll([]);await window.__AXIS_PORTABLE_BACKUP__.restoreFile(window.__AXIS_V2_FILE__)});
  await page.waitForTimeout(1400);
  await page.waitForFunction(()=>window.__AXIS_PORTABLE_BACKUP__?.exportSchema==='axis.backup.v2',undefined,{timeout:20000});
  const restored=await page.evaluate(async()=>{
    const core=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),store=window.__AXIS_MEDIA_STORE__,keys=await store.keys(),rows=[];for(const key of keys){const blob=await store.get(key),u=new Uint8Array(await blob.slice(0,1).arrayBuffer()),v=new Uint8Array(await blob.slice(Math.max(0,blob.size-1)).arrayBuffer());rows.push({key,size:blob.size,type:blob.type,first:u[0],last:v[0]})}return{session:core.sessions?.some(s=>s.id==='v2-s1'),event:core.sessions?.some(s=>s.events?.some(e=>e.id==='v2-e1')),foreign:localStorage.getItem('foreign_keep'),rows};
  });
  assert.equal(restored.session,true);assert.equal(restored.event,true);assert.equal(restored.foreign,'v2-must-survive');
  assert.deepEqual(restored.rows,[
    {key:'F-v2-large-a',size:6*1024*1024,type:'image/jpeg',first:17^0x5a,last:17^0xa5},
    {key:'F-v2-large-c',size:4*1024*1024,type:'image/png',first:201^0x5a,last:201^0xa5},
    {key:'V-v2-large-b',size:8*1024*1024,type:'video/mp4',first:93^0x5a,last:93^0xa5}
  ]);

  assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
  console.log(`[AXIS 8.21 portable backup v2 ${ENGINE}] PASS · 18 MiB raw-media user export stays in-app until explicit save · no base64 media envelope · per-media SHA-256 reject-before-write · exact v2 restore + foreign storage preservation`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
