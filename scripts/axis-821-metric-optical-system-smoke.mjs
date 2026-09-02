import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});

await context.addInitScript(()=>{
  const now=Date.now();
  const eq={
    id:'axis-821-optical-test',name:'光学强度测试',type:'relative',pattern:'relative',muscles:['胸肌'],effect:'光学验证',custom:true,
    metricSchema:[
      {key:'hold',label:'保持时间',type:'duration',unit:'秒',step:5,min:0},
      {key:'intensity',label:'强度',type:'rating',unit:'/10',step:1,min:1,max:10}
    ],
    metricSchemaVersion:'8.21',executionMode:'hold',recording:{version:2,metrics:['hold','intensity'],executionMode:'hold'}
  };
  localStorage.clear();
  localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'axis-821-optical-session',start:now-60000,events:[]},flows:[],flowRun:null,profile:{customEq:[eq],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
  try{Object.defineProperty(HTMLMediaElement.prototype,'play',{configurable:true,value:function(){return Promise.resolve()}})}catch{}
  try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>new MediaStream()}})}catch{}
});

const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();

function npx(v){return Number.parseFloat(String(v||'0'))||0}

try{
  assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_821_RECORDING_SURFACE__?.version==='8.21'&&window.__AXIS_821_METRIC_OPTICAL_SYSTEM__?.intensity?.max===20,undefined,{timeout:15000});

  console.log(`[AXIS 8.21 metric optical ${ENGINE}] Quick Record → hold + stable intensity`);
  await tap(page.locator('#quickRecordBtn'));
  await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'),undefined,{timeout:2500});
  const item=page.locator('#v882QuickCustom [data-qid="axis-821-optical-test"]');
  assert.equal(await item.count(),1,'optical test Object missing from Quick Record');
  await tap(item);
  await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#equipmentName')?.textContent?.trim()==='光学强度测试'&&document.querySelector('[data-axis821-key="hold"]')&&document.querySelector('[data-axis821-key="intensity"]'),undefined,{timeout:4000});

  const optical=await page.evaluate(()=>{
    const visible=el=>!!el&&el.getClientRects().length>0&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden';
    const inspect=key=>{
      const root=document.querySelector(`[data-axis821-key="${key}"]`),input=root?.querySelector('[data-axis818-metric]'),cell=root?.querySelector('.axis821Stepper>div');
      if(!root||!input||!cell)throw new Error(`missing metric control ${key}`);
      const ir=input.getBoundingClientRect(),cr=cell.getBoundingClientRect(),label=root.querySelector('.axis821MetricLabel>span'),headerUnit=root.querySelector('.axis821MetricLabel>small'),mainUnit=cell.querySelector('small'),presets=[...root.querySelectorAll('.axis821Presets button,.axis821Rating button')];
      return{
        inputCenter:(ir.left+ir.right)/2,cellCenter:(cr.left+cr.right)/2,centerDelta:Math.abs((ir.left+ir.right-cr.left-cr.right)/2),
        inputFont:getComputedStyle(input).fontSize,labelFont:label?getComputedStyle(label).fontSize:null,
        headerUnitVisible:visible(headerUnit),headerUnitText:headerUnit?.textContent?.trim()||'',
        mainUnitVisible:visible(mainUnit),mainUnitText:mainUnit?.textContent?.trim()||'',mainUnitFont:mainUnit?getComputedStyle(mainUnit).fontSize:null,
        presetFonts:presets.map(x=>getComputedStyle(x).fontSize),presetValues:presets.map(x=>x.getAttribute('data-value')||x.textContent?.trim()),
        min:input.getAttribute('data-min'),max:input.getAttribute('data-max'),
        scroll:document.documentElement.scrollWidth,inner:innerWidth
      };
    };
    return{hold:inspect('hold'),intensity:inspect('intensity'),intensityText:document.querySelector('[data-axis821-key="intensity"]')?.textContent||'',ordinal:document.querySelector('[data-axis821-key="intensity"]')?.classList.contains('axis821OrdinalMetric')};
  });

  assert.equal(optical.ordinal,true,'stable intensity did not use ordinal control');
  assert.equal(optical.intensity.min,'1');
  assert.equal(optical.intensity.max,'20');
  assert.equal(optical.intensityText.includes('/10'),false,'stable intensity still visibly renders /10');
  assert.equal(optical.intensity.headerUnitVisible,false,'stable intensity repeats a header unit');
  assert.equal(optical.intensity.mainUnitVisible,false,'stable intensity renders a value suffix');
  assert.deepEqual(optical.intensity.presetValues,['4','8','12','16','20'],'stable intensity rail is not 4/8/12/16/20');
  assert.ok(optical.intensity.centerDelta<=0.5,`intensity numeric center drift ${optical.intensity.centerDelta.toFixed(3)}px`);
  assert.ok(npx(optical.intensity.inputFont)>=20,`intensity main number too small ${optical.intensity.inputFont}`);
  assert.ok(npx(optical.intensity.labelFont)>=13.5,`intensity label too small ${optical.intensity.labelFont}`);
  assert.ok(optical.intensity.presetFonts.every(x=>npx(x)>=12.5),`intensity preset microtype ${optical.intensity.presetFonts.join(',')}`);

  assert.equal(optical.hold.headerUnitVisible,false,'unit-bearing metric still repeats unit in title row');
  assert.equal(optical.hold.mainUnitVisible,true,'hold unit missing beside main value');
  assert.equal(optical.hold.mainUnitText,'秒','hold main unit drift');
  assert.ok(npx(optical.hold.mainUnitFont)>=13.5,`hold unit too small ${optical.hold.mainUnitFont}`);
  assert.ok(npx(optical.hold.inputFont)>=20,`hold main number too small ${optical.hold.inputFont}`);
  assert.ok(npx(optical.hold.labelFont)>=13.5,`hold label too small ${optical.hold.labelFont}`);
  assert.ok(optical.hold.presetFonts.every(x=>npx(x)>=12.5),`hold preset microtype ${optical.hold.presetFonts.join(',')}`);
  assert.ok(optical.hold.scroll<=optical.hold.inner+1&&optical.intensity.scroll<=optical.intensity.inner+1,'optical typography caused horizontal overflow');

  const hold45=page.locator('[data-axis821-preset="hold"][data-value="45"]');
  assert.equal(await hold45.count(),1,'hold 45 preset missing');
  await tap(hold45);
  await page.waitForFunction(()=>document.querySelector('[data-axis818-metric="hold"]')?.value==='45');
  const intensity20=page.locator('[data-axis821-rate="intensity"][data-value="20"]');
  assert.equal(await intensity20.count(),1,'intensity 20 level missing');
  await tap(intensity20);
  await page.waitForFunction(()=>document.querySelector('[data-axis818-metric="intensity"]')?.value==='20');

  await tap(page.locator('#saveScan'));
  await page.waitForFunction(()=>{const s=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return (s.active?.events||[]).some(e=>e.equipmentId==='axis-821-optical-test')},undefined,{timeout:5000});
  const saved=await page.evaluate(()=>{
    const s=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),e=(s.active?.events||[]).find(x=>x.equipmentId==='axis-821-optical-test'),schema=e?.metricSchemaSnapshot||[];
    const intensity=schema.find(x=>String(x?.key||x?.id||'')==='intensity');
    return e&&{metrics:e.metrics,intensity,schema:schema.map(x=>String(x?.key||x?.id||''))};
  });
  assert.deepEqual(saved?.schema,['hold','intensity']);
  assert.equal(saved?.metrics?.hold,45);
  assert.equal(saved?.metrics?.intensity,20);
  assert.equal(saved?.intensity?.unit,'','saved stable intensity snapshot regained a suffix');
  assert.equal(saved?.intensity?.min,1);
  assert.equal(saved?.intensity?.max,20);
  assert.equal(saved?.intensity?.step,1);
  assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);

  console.log(`[AXIS 8.21 metric optical ${ENGINE}] PASS · hold unit once and legible · main numeric optical scale · stable intensity pure centered 1–20 · 4/8/12/16/20 · immutable saved schema max20/no unit`);
}finally{
  await context.close().catch(()=>{});
  await browser.close().catch(()=>{});
}