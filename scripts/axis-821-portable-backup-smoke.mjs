import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core'),launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});
const seed={
  core:{version:60,sessions:[{id:'backup-s1',start:1788810000000,end:1788811800000,events:[{id:'backup-e1',equipmentId:'chest',name:'胸推',kind:'strength',time:1788810300000,sets:3,reps:10,weight:60,frameRefs:['F-backup-1'],clipRef:'V-backup-1',clipType:'video/mp4'}]}],active:null,profile:{name:'Backup Proof',customEq:[],memories:[]},prefs:{scanSeconds:3,keepClip:true}},
  meta:{prefs:{proof:'portable'},events:{'backup-e1':{activity:{status:'finished',startedAt:1788810300000,finishedAt:1788810900000},sets:[{weight:60,reps:10,state:'done',doneAt:1788810400000}]}}},
  learning:{version:'proof',items:['hello','world']}
};

const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
await context.addInitScript(s=>{
  if(sessionStorage.getItem('__axis_portable_seeded')==='1')return;
  localStorage.clear();
  localStorage.setItem('axis_v60_state',JSON.stringify(s.core));
  localStorage.setItem('axis_v8_meta',JSON.stringify(s.meta));
  localStorage.setItem('axis_v89_speak',JSON.stringify(s.learning));
  localStorage.setItem('foreign_keep','must-survive');
  sessionStorage.setItem('__axis_portable_seeded','1');
},seed);
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));

try{
  assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
  await page.waitForLoadState('load',{timeout:15000});
  await page.waitForFunction(()=>window.__AXIS_PORTABLE_BACKUP__?.schema==='axis.backup.v1'&&window.__AXIS_MEDIA_STORE__?.entries&&window.__AXIS_MEDIA_STORE__?.replaceAll,undefined,{timeout:15000});
  const ui=await page.evaluate(()=>({backup:document.querySelector('#backupBtn')?.textContent.trim(),restore:document.querySelector('#restoreBackupBtn')?.textContent.trim(),sheet:!!document.querySelector('#backupRestoreSheet'),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,owner:window.__AXIS_PORTABLE_BACKUP__?.owner,network:window.__AXIS_PORTABLE_BACKUP__?.network}));
  assert.equal(ui.backup,'建立完整 AXIS 备份');
  assert.equal(ui.restore,'从 AXIS 备份恢复');
  assert.equal(ui.sheet,true);assert.equal(ui.owner,'transport-only');assert.equal(ui.network,false);assert.ok(ui.overflow<=1);

  const initial=await page.evaluate(async()=>{
    const store=window.__AXIS_MEDIA_STORE__;
    await store.put('F-backup-1',new Blob([new Uint8Array([0,1,2,3,254,255,17,33])],{type:'image/jpeg'}));
    await store.put('V-backup-1',new Blob([new Uint8Array([9,8,7,6,5,4,3,2,1,0])],{type:'video/mp4'}));
    const bundle=await window.__AXIS_PORTABLE_BACKUP__.create();
    window.__AXIS_SMOKE_BUNDLE__=bundle;
    return bundle;
  });
  assert.equal(initial.schema,'axis.backup.v1');
  assert.equal(initial.integrity.algorithm,'SHA-256');assert.match(initial.integrity.value,/^[0-9a-f]{64}$/);
  assert.equal(initial.manifest.mediaCount,2);assert.equal(initial.manifest.sessions,1);assert.equal(initial.manifest.events,1);
  assert.ok(initial.webOriginSnapshot.storage.every(x=>x.key.startsWith('axis_')));
  assert.ok(!initial.webOriginSnapshot.storage.some(x=>x.key==='foreign_keep'));
  assert.deepEqual(initial.webOriginSnapshot.media.map(x=>x.key),['F-backup-1','V-backup-1']);
  assert.equal(initial.source.origin,BASE);

  const corrupt=await page.evaluate(async()=>{
    const b=structuredClone(window.__AXIS_SMOKE_BUNDLE__);b.webOriginSnapshot.storage[0].value+='corrupt';
    const before=localStorage.getItem('axis_v8_meta');
    let rejected=false;try{await window.__AXIS_PORTABLE_BACKUP__.verify(b)}catch{rejected=true}
    return{rejected,before,after:localStorage.getItem('axis_v8_meta'),foreign:localStorage.getItem('foreign_keep')};
  });
  assert.equal(corrupt.rejected,true);assert.equal(corrupt.after,corrupt.before);assert.equal(corrupt.foreign,'must-survive');

  const roundTrip=await page.evaluate(async()=>{
    const p=window.__AXIS_PORTABLE_BACKUP__,store=window.__AXIS_MEDIA_STORE__,target=window.__AXIS_SMOKE_BUNDLE__;
    for(let i=localStorage.length-1;i>=0;i--){const k=localStorage.key(i);if(k?.startsWith('axis_'))localStorage.removeItem(k)}
    localStorage.setItem('axis_destination_only','remove-me');
    await store.replaceAll([]);
    await p.restore(target);
    const storage=target.webOriginSnapshot.storage.map(x=>[x.key,x.value]).sort((a,b)=>a[0].localeCompare(b[0]));
    const restored=Array.from({length:localStorage.length},(_,i)=>localStorage.key(i)).filter(k=>k?.startsWith('axis_')).sort((a,b)=>a.localeCompare(b)).map(k=>[k,localStorage.getItem(k)]);
    const media=await store.entries();
    const bytes=[];for(const x of media)bytes.push({key:String(x.key),type:x.blob.type,data:Array.from(new Uint8Array(await x.blob.arrayBuffer()))});
    return{storage,restored,destinationGone:localStorage.getItem('axis_destination_only')===null,foreign:localStorage.getItem('foreign_keep'),bytes};
  });
  assert.deepEqual(roundTrip.restored,roundTrip.storage);assert.equal(roundTrip.destinationGone,true);assert.equal(roundTrip.foreign,'must-survive');
  assert.deepEqual(roundTrip.bytes,[{key:'F-backup-1',type:'image/jpeg',data:[0,1,2,3,254,255,17,33]},{key:'V-backup-1',type:'video/mp4',data:[9,8,7,6,5,4,3,2,1,0]}]);

  await page.waitForTimeout(1200);
  await page.waitForFunction(()=>window.__AXIS_PORTABLE_BACKUP__?.schema==='axis.backup.v1'&&window.__AXIS_MEDIA_STORE__?.entries,undefined,{timeout:15000});
  const postReload=await page.evaluate(async()=>{
    const core=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),media=await window.__AXIS_MEDIA_STORE__.entries(),bytes=[];
    for(const x of media)bytes.push({key:String(x.key),type:x.blob.type,data:Array.from(new Uint8Array(await x.blob.arrayBuffer()))});
    return{session:core.sessions?.some(s=>s.id==='backup-s1'),event:core.sessions?.some(s=>s.events?.some(e=>e.id==='backup-e1')),foreign:localStorage.getItem('foreign_keep'),bytes};
  });
  assert.equal(postReload.session,true);assert.equal(postReload.event,true);assert.equal(postReload.foreign,'must-survive');
  assert.deepEqual(postReload.bytes,[{key:'F-backup-1',type:'image/jpeg',data:[0,1,2,3,254,255,17,33]},{key:'V-backup-1',type:'video/mp4',data:[9,8,7,6,5,4,3,2,1,0]}]);
  await page.evaluate(bundle=>{window.__AXIS_SMOKE_BUNDLE__=bundle},initial);

  const rollback=await page.evaluate(async()=>{
    const p=window.__AXIS_PORTABLE_BACKUP__,store=window.__AXIS_MEDIA_STORE__,target=window.__AXIS_SMOKE_BUNDLE__;
    localStorage.setItem('axis_test_rollback_sentinel','keep-this-exactly');
    await store.replaceAll([{key:'F-rollback',blob:new Blob([new Uint8Array([77,66,55,44])],{type:'image/png'})}]);
    const before=await p.create();
    const originalSet=Storage.prototype.setItem;let failed=false;
    Storage.prototype.setItem=function(k,v){if(!failed&&String(k).startsWith('axis_')){failed=true;throw new DOMException('injected','QuotaExceededError')}return originalSet.call(this,k,v)};
    await p.restore(target);
    Storage.prototype.setItem=originalSet;
    const after=await p.create();
    return{failed,before:before.webOriginSnapshot,after:after.webOriginSnapshot,sentinel:localStorage.getItem('axis_test_rollback_sentinel'),foreign:localStorage.getItem('foreign_keep'),status:document.querySelector('#backupRestoreIntegrity')?.textContent};
  });
  assert.equal(rollback.failed,true);assert.deepEqual(rollback.after,rollback.before);assert.equal(rollback.sentinel,'keep-this-exactly');assert.equal(rollback.foreign,'must-survive');assert.match(rollback.status,/已完整回滚/);
  assert.deepEqual(errors.splice(0),['[AXIS restore] QuotaExceededError: injected'],'rollback must surface exactly the one intentionally injected write failure and no unrelated browser error');

  const activeBlock=await page.evaluate(async()=>{
    document.querySelector('#startBtn')?.click();
    const before=localStorage.getItem('axis_v60_state'),store=window.__AXIS_MEDIA_STORE__,mediaBefore=(await store.entries()).map(x=>String(x.key));let rejected=false,message='';
    try{await window.__AXIS_PORTABLE_BACKUP__.restore(window.__AXIS_SMOKE_BUNDLE__)}catch(e){rejected=true;message=String(e?.message||e)}
    return{rejected,message,before,after:localStorage.getItem('axis_v60_state'),mediaBefore,mediaAfter:(await store.entries()).map(x=>String(x.key))};
  });
  assert.equal(activeBlock.rejected,true);assert.match(activeBlock.message,/restore-active-session-blocked/);assert.equal(activeBlock.after,activeBlock.before);assert.deepEqual(activeBlock.mediaAfter,activeBlock.mediaBefore);

  assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
  console.log(`[AXIS 8.21 portable backup ${ENGINE}] PASS · SHA-256 reject-before-write · exact pre-reload axis_* + media round trip · post-reload semantic/media durability · foreign storage preserved · injected failure verified rollback · active session blocked`);
}finally{
  await context.close().catch(()=>{});await browser.close().catch(()=>{});
}
