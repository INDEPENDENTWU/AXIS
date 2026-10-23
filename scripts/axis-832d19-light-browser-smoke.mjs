import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const engine=process.env.AXIS_ENGINE||'chromium';
const url=process.env.AXIS_URL||'http://127.0.0.1:4173';
const output=process.env.AXIS_LIGHT_REPORT_DIR||'/tmp';
const mod=engine==='webkit'?await import('playwright'):await import('playwright-core');
const browser=await (engine==='webkit'?mod.webkit:mod.chromium).launch(
  engine==='webkit'?{headless:true}:{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}
);
const sha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
fs.mkdirSync(output,{recursive:true});
const samples=[];
try{
  const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN',
    isMobile:engine==='webkit',hasTouch:true,deviceScaleFactor:2,colorScheme:'light',reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  const apis=[
    ['**/api/ai-status**',{available:false}],
    ['**/api/owner-config**',{error:'owner_lock_not_configured'}],
    ['**/api/analyze**',{available:false}],
    ['**/api/insight**',{available:false}],
    ['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],
    ['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]
  ];
  for(const [pattern,data] of apis)await context.route(pattern,r=>r.fulfill({
    status:200,contentType:'application/json',body:JSON.stringify(data)
  }));
  await page.addInitScript(()=>localStorage.setItem('axis_ui_theme_v1','light'));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:22000});
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__&&window.__AXIS_RELEASE__==='8.32',
    null,{timeout:22000});

  // Test the real built CSS cascade: fixtures live INSIDE existing application
  // sheets, including inherited styling. They are removed without a state write.
  await page.evaluate(()=>{
    const sheet=document.querySelector('#scanSheet .sheet');
    if(!sheet||!document.querySelector('#reportSheet .reportPreview'))
      throw Error('Original Recorder and Report DOM must exist');
    const fixture=document.createElement('div');
    fixture.id='axisLightContrastFixture';
    fixture.setAttribute('aria-hidden','true');
    fixture.innerHTML=[
      '<div class="seg"><button class="active" id="lightSeg">選中</button></div>',
      '<div class="quickValues"><button class="active" id="lightQuick">15</button></div>',
      '<div class="choiceStrip"><button class="active" id="lightChoice">15</button></div>',
      '<div class="axis821MetricControl">',
        '<div class="axis821Stepper"><button>−</button><div><input id="lightMetricInput" type="number" value="15"></div><button>+</button></div>',
        '<div class="axis821Presets"><button class="active" id="lightPreset">15</button></div>',
        '<div class="axis821Rating"><button class="active" id="lightRating">5</button></div>',
        '<div class="axis821Toggle"><button class="active" id="lightToggle">完成</button></div>',
        '<div class="axis821MetricGroups"><button class="active" id="lightMetricGroup"><b>重量</b><span>kg</span></button></div>',
      '</div>',
      '<button class="saveRecord" id="lightSave">記下</button>',
      '<button class="saveRecord" id="lightDisabled" disabled>不可用</button>'
    ].join('');
    sheet.appendChild(fixture);
  });
  const audit=selectors=>page.evaluate(selectors=>{
    const rgba=value=>{
      const match=String(value).match(/^rgba?\((.+)\)$/);
      if(!match)return null;
      const list=match[1].replaceAll(',',' ').replaceAll('/',' ').split(/\s+/).filter(Boolean).map(Number);
      return list.length>=3?[list[0],list[1],list[2],list.length>=4?list[3]:1]:null;
    };
    const luminance=rgb=>{
      const x=rgb.slice(0,3).map(c=>c/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
      return .2126*x[0]+.7152*x[1]+.0722*x[2];
    };
    const measure=selector=>{
      const el=document.querySelector(selector);
      if(!el)return null;
      const style=getComputedStyle(el),fg=rgba(style.color);
      let bg=null;
      for(let p=el;p;p=p.parentElement){
        const v=rgba(getComputedStyle(p).backgroundColor);
        if(v&&v[3]>=.98){bg=v;break}
      }
      const ratio=fg&&bg?(Math.max(luminance(fg),luminance(bg))+.05)/(Math.min(luminance(fg),luminance(bg))+.05):0;
      return {selector,color:style.color,background:style.backgroundColor,backgroundResolved:bg?.slice(0,3),
        contrast:+ratio.toFixed(2),visibility:style.visibility,disabled:!!el.disabled};
    };
    return selectors.map(measure);
  },selectors);
  const controls=['#lightSeg','#lightQuick','#lightChoice','#lightPreset','#lightRating',
    '#lightToggle','#lightMetricGroup b','#lightSave','#lightDisabled','#lightMetricInput'];
  const styles=await audit(controls);
  for(const a of styles){
    assert.ok(a,'Expected visual control missing');
    assert.ok(a.contrast>=4.5,'Light control contrast below 4.5:1 '+JSON.stringify(a));
  }
  const input=await page.locator('#lightMetricInput').evaluate(el=>({
    background:getComputedStyle(el).backgroundColor,border:getComputedStyle(el).borderTopWidth
  }));
  assert.equal(input.background,'rgba(0, 0, 0, 0)','Numeric input must not show a separate white tile');
  assert.equal(input.border,'0px','Numeric input must not show a nested outline');
  const report=await audit(['#reportSheet .reportPreview','#reportSheet #axis821ReportPdf']);
  assert.equal(report[0]?.background,'rgb(241, 243, 247)','Report preview should use the same cool-neutral palette');
  assert.ok(report[1]&&report[1].contrast>=4.5,'PDF export must be legible in Light');
  samples.push(...styles,...report);
  await page.evaluate(()=>document.querySelector('#axisLightContrastFixture')?.remove());

  // Complete one real Object->canonical Recorder interaction, not a fixture.
  assert.equal(await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__?.('quick')),true);
  await page.locator('#eqSearch').fill('胸托划船');
  const start=page.locator('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]').first();
  await start.waitFor({state:'visible',timeout:8000});
  await start.click();
  await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show'),
    null,{timeout:10000});
  const recorder=await audit(['#saveScan','#scanSheet .captureNow']);
  assert.ok(recorder[0]?.contrast>=4.5,'Real Recorder Save button has poor contrast');
  samples.push(...recorder.filter(Boolean));
  await page.screenshot({path:output+'/axis-light-d19-recorder-'+engine+'.png',fullPage:false});

  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
  await page.locator('#saveScan').click();
  await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show'),null,{timeout:16000});
  const active=await audit(['#v87Now.axis821ActiveStage .axis821StageFinish',
    '#v87Now.axis821ActiveStage .axis821StageFinish span']);
  for(const x of active.filter(Boolean))assert.ok(x.contrast>=4.5,
    'Active hold-to-finish unreadable under Light '+JSON.stringify(x));
  samples.push(...active.filter(Boolean));
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
  assert.ok((after.active?.events?.length||0)>(before.active?.events?.length||0),
    'An actual saved canonical Encounter must follow the original Recorder');
  await page.screenshot({path:output+'/axis-light-d19-active-'+engine+'.png',fullPage:false});
  assert.deepEqual(errors,[],'Page runtime errors');
  console.log('[AXIS d19] PASS · exact Light contrast/selection/numeric/report/real Recorder/Active · '+engine);
  await context.close();
}finally{await browser.close()}
fs.writeFileSync(output+'/axis-light-d19-'+engine+'.json',JSON.stringify({
  schema:'axis.832d19.light.semantic-control.v1',sourceCommit:sha,engine,
  physicalDevice:false,observed:samples,allObservedTextAtLeast45:true,
  note:'Actual browser-computed CSS and one canonical recording journey; not physical iOS signoff'
},null,2));
