import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:417,height:896},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const near=(a,b,t=.75)=>Math.abs(a-b)<=t;

try{
  assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
  await page.evaluate(()=>{
    localStorage.clear();const now=Date.now();
    localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[{id:'S1',start:now-100000,end:now-50000,events:[{id:'E1',equipmentId:'lat-pulldown',name:'高位下拉',kind:'strength',time:now-90000,weight:40,reps:10,sets:3,frameRefs:['F-MISSING-0']}]}],active:null,profile:{name:'Ray',weight:'92',customEq:[{id:'custom-blue',name:'蓝色腿推',type:'strength',muscles:['股四头肌'],custom:true}],memories:[]},prefs:{}}));
    localStorage.setItem('axis_v8_meta',JSON.stringify({prefs:{},events:{}}));
  });
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:9000});
  await page.waitForFunction(()=>window.__AXIS_8123_UI_HOTFIX__?.version==='8.12.3',undefined,{timeout:12000});
  assert.equal(await page.evaluate(()=>window.__AXIS_8123_UI_HOTFIX__.equipmentPlaceholder),false);

  await tap(page.locator('#settingsBtn'));
  await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'));
  await page.waitForTimeout(240);

  const geom=async row=>page.locator(row).evaluate(el=>{const q=s=>el.querySelector(s)?.getBoundingClientRect(),r=el.getBoundingClientRect();return{row:{left:r.left,right:r.right,height:r.height},label:q(':scope>span'),value:q(':scope>b'),arrow:q(':scope>i')}});
  const native=await geom('#profileBtn');
  for(const [label,row] of [['learning','#v810ConfigEntry'],['service','#v811ServiceEntry']]){
    const g=await geom(row);
    assert.ok(near(g.row.left,native.row.left)&&near(g.row.right,native.row.right),`${label} row width/edge drift`);
    assert.ok(near(g.label.left,native.label.left),`${label} label is not on native vertical column: ${g.label.left} vs ${native.label.left}`);
    assert.ok(near(g.arrow.left,native.arrow.left)&&near(g.arrow.right,native.arrow.right),`${label} chevron is not on native vertical column: ${g.arrow.left}/${g.arrow.right} vs ${native.arrow.left}/${native.arrow.right}`);
    assert.ok(near(g.row.height,native.row.height),`${label} row height differs from native Settings row: ${g.row.height} vs ${native.row.height}`);
  }

  await tap(page.locator('#myEqBtn'));
  await page.waitForFunction(()=>document.querySelector('#axisConfigGate-equipment')?.classList.contains('open'));
  await page.waitForFunction(()=>document.querySelectorAll('#manageEqList [data-my-eq-id]').length===2);
  await page.waitForTimeout(180);

  const custom=page.locator('#manageEqList [data-my-eq-id="custom-blue"]');
  assert.equal(await custom.count(),1,'custom equipment row missing');
  assert.equal(await custom.locator('.v8123EqThumb').count(),0,'no-photo equipment regained synthetic one-character avatar');
  assert.equal((await custom.locator('.v8123EqText>b').innerText()).trim(),'蓝色腿推','equipment name is not fully readable');
  const cg=await custom.evaluate(el=>{const r=el.getBoundingClientRect(),t=el.querySelector('.v8123EqText').getBoundingClientRect(),b=el.querySelector('.v8123EqText>b').getBoundingClientRect();return{row:r,text:t,name:b,style:getComputedStyle(el.querySelector('.v8123EqText>b'))}});
  assert.ok(cg.text.left<=cg.row.left+1.5,'no-photo equipment text did not return to native left edge');
  assert.ok(cg.text.width>250,'equipment text column remains compressed');
  assert.ok(cg.name.width>80&&cg.style.visibility!=='hidden'&&cg.style.display!=='none','equipment name is clipped/hidden');

  const nativeRow=page.locator('#manageEqList [data-my-eq-id="lat-pulldown"]');
  await page.waitForFunction(()=>{const t=document.querySelector('#manageEqList [data-my-eq-id="lat-pulldown"] .v8123EqThumb');return !!t&&t.dataset.photoMissing==='1'&&getComputedStyle(t).display==='none'},undefined,{timeout:2500});
  assert.equal((await nativeRow.locator('.v8123EqText>b').innerText()).trim(),'高位下拉','native equipment name changed');
  const ng=await nativeRow.evaluate(el=>{const r=el.getBoundingClientRect(),t=el.querySelector('.v8123EqText').getBoundingClientRect();return{row:r,text:t}});
  assert.ok(ng.text.left<=ng.row.left+1.5&&ng.text.width>250,'missing-media row did not degrade to text-first geometry');

  assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
  console.log(`[AXIS 8.12.3 UI hotfix ${ENGINE}] PASS · native Settings columns · text-first equipment rows · no synthetic avatar`);
}finally{
  await context.close().catch(()=>{});await browser.close().catch(()=>{});
}
