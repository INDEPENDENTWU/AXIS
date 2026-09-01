import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 set-plan recording ownership] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
function functionRangeAt(src,start,label){
 const brace=src.indexOf('{',start);if(brace<0)fail(`${label} brace missing`);let depth=0,quote='',escaped=false,line=false,block=false,end=-1;
 for(let i=brace;i<src.length;i++){
  const ch=src[i],next=src[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++;}continue}
  if(quote){if(escaped){escaped=false;continue}if(ch==='\\'){escaped=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++;else if(ch==='}'&&--depth===0){end=i+1;break}
 }
 if(end<0)fail(`${label} closing brace missing`);return{start,end,text:src.slice(start,end)};
}
function replaceFirstFunction(src,signature,replacement,label){const start=src.indexOf(signature);if(start<0)fail(`${label} signature missing`);const r=functionRangeAt(src,start,label);return src.slice(0,r.start)+replacement+src.slice(r.end)}
function replaceGeneratedFunction(src,signature,replacement,label){
 const call=`s=replaceFunction(s,'${signature}',`;
 const at=src.indexOf(call);if(at<0)fail(`${label} replaceFunction call missing`);
 const start=src.indexOf(signature,at+call.length);if(start<0)fail(`${label} generated function missing`);
 const r=functionRangeAt(src,start,label);return src.slice(0,r.start)+replacement+src.slice(r.end);
}

const surfaceFile='prepare-821-recording-property-surface.mjs';
let surface=read(surfaceFile);
const oldMarker="window.__AXIS_821_RECORDING_SURFACE__={version:'8.21',owner:'app.js+v874',schemaEditing:'object-editor-only',recordingSurface:'value-controls-only',explicitEmptySchema:true,presetMetricCount:14,newRecorder:false,newPersistence:false};";
const newMarker="window.__AXIS_821_RECORDING_SURFACE__={version:'8.21',owner:'app.js+v874',schemaEditing:'object-editor-only',recordingSurface:'value-controls-only',explicitEmptySchema:true,presetMetricCount:14,setPlanMetricOwnership:true,newRecorder:false,newPersistence:false};";
surface=once(surface,oldMarker,newMarker,'recording surface ownership marker');
const renderReplacement=String.raw`function axis821SetPlanOwnedMetricKey(key){return['weight','reps','sets'].includes(String(key||''))}
function axis821RecordingExecutionMode(eq){try{return typeof axis821ExecutionForRecording==='function'?String(axis821ExecutionForRecording(eq)||''):''}catch{return''}}
function axis821RecorderValueSchema(eq,schema){const xs=Array.isArray(schema)?schema:[];return axis821RecordingExecutionMode(eq)==='sets'?xs.filter(m=>!axis821SetPlanOwnedMetricKey(m?.key||m?.id)):xs}
function axis818RenderRecorder(){const eq=eqById(state.selectedEq);if(!eq)return;const schema=axis821SchemaForRecording(eq),mode=axis821RecordingExecutionMode(eq),valueSchema=axis821RecorderValueSchema(eq,schema),explicit=axis818HasExplicitSchema(eq)||axis821HasMetricOverrideForRecording(eq),setPlanOwns=mode==='sets'&&schema.some(m=>axis821SetPlanOwnedMetricKey(m?.key||m?.id)),setPlanOnly=setPlanOwns&&schema.length>0&&valueSchema.length===0,show=explicit&&!setPlanOnly;let host=$('#axis818MetricRecorder');if(!host){host=D.createElement('div');host.id='axis818MetricRecorder';host.className='axis818MetricRecorder';const anchor=$('#saveScan');anchor?.parentNode?.insertBefore(host,anchor)}if(!host)return;const renderKey=eq.id+'|'+mode+'|'+valueSchema.map(m=>m.key).join(',')+'|'+(explicit?'1':'0');if(axis819RecorderSuppressed&&host.dataset.axis820Quick!=='1')return;host.dataset.axis818RenderKey=renderKey;host.dataset.axis821SetPlanOwned=setPlanOwns?'1':'0';host.classList.toggle('show',show);$('#strengthFields')?.classList.toggle('axis818LegacyMetricHidden',explicit);$('#cardioFields')?.classList.toggle('axis818LegacyMetricHidden',explicit);if(!explicit||setPlanOnly){host.innerHTML='';return}const prev=allEvents().filter(x=>x.equipmentId===eq.id).sort((a,b)=>(b.time||0)-(a.time||0))[0],pv=prev?axis818EventMetrics(prev):{};host.innerHTML='<div class="axis818MetricHead"><span>本次记录</span><b>'+esc(eq.name)+'</b></div>'+(valueSchema.length?'<div class="axis821MetricStack">'+valueSchema.map(m=>axis821MetricControl(m,pv[m.key])).join('')+'</div>':'<div class="axis821NoMetrics"><b>无需填写记录属性</b><span>直接记下即可</span></div>')}`;
surface=replaceFirstFunction(surface,'function axis818RenderRecorder()',renderReplacement,'recording surface residual-schema renderer');
write(surfaceFile,surface);

const controlFile='prepare-821-metric-control-system.mjs';
let control=read(controlFile);
control=once(control,oldMarker,newMarker,'metric-control recording surface marker');
const readerReplacement=String.raw`function axis821SetPlanLegacyMetricValue(key){key=String(key||'');if(key==='weight')return $('#weight')?.value??'';if(key==='reps')return $('#repsChoices [data-value].active')?.dataset.value??'';if(key==='sets')return $('#setsChoices [data-value].active')?.dataset.value??'';return''}
function axis818ReadMetricInputs(schema){const out={},eq=axis818Eq(state.selectedEq),setPlan=!!eq&&axis821RecordingExecutionMode(eq)==='sets';for(const m of schema){const el=D.querySelector('[data-axis818-metric="'+m.key+'"]');let v=el?.value??'';if(!el&&setPlan&&axis821SetPlanOwnedMetricKey(m.key))v=axis821SetPlanLegacyMetricValue(m.key);if(m.type==='boolean')v=v==='1'||v==='true';else if(m.type==='pace'||m.key==='pace')v=v===''?null:axis821PaceText(v);else if(['number','count','duration','distance','percentage','rating'].includes(m.type))v=v===''?null:Number(v);out[m.key]=v}return out}`;
control=replaceGeneratedFunction(control,'function axis818ReadMetricInputs(schema)',readerReplacement,'set-plan-aware immutable metric reader');
write(controlFile,control);

const smokeFile='scripts/axis-821-recording-property-surface-smoke.mjs';
let smoke=read(smokeFile);
const smokeAnchor="  assert.deepEqual(errors,[],`page errors:\\n${errors.join('\\n')}`);";
const smokeInsert=String.raw`  console.log(`[AXIS 8.21 recording surface ${ENGINE}] set-plan owns weight / reps / sets without a duplicate generic editor`);
  await createFromSearch('组计划唯一编辑测试');await setMetrics(['weight','reps','sets']);const setOnly=await saveCustom('组计划唯一编辑测试');assert.ok(setOnly?.id);
  await page.waitForFunction(()=>{const x=document.querySelector('#v8Sets');return !!x&&!x.classList.contains('hidden')&&x.querySelectorAll('[data-si]').length>=1},undefined,{timeout:2500});
  await page.waitForFunction(()=>{const x=document.querySelector('#axis818MetricRecorder');return !!x&&!x.classList.contains('show')&&x.querySelectorAll('[data-axis818-metric]').length===0},undefined,{timeout:2500});
  assert.equal(await page.locator('#axis818MetricRecorder').getAttribute('data-axis821-set-plan-owned'),'1','set-plan ownership marker missing');
  assert.equal(await page.locator('#axis818MetricRecorder [data-axis818-metric="weight"],#axis818MetricRecorder [data-axis818-metric="reps"],#axis818MetricRecorder [data-axis818-metric="sets"]').count(),0,'set-owned metrics leaked into generic recorder');
  await tap(page.locator('#v8Sets [data-cnt="1"]'));await tap(page.locator('#v8Sets [data-cnt="1"]'));await page.waitForFunction(()=>document.querySelectorAll('#v8Sets [data-si]').length===3,undefined,{timeout:1500});
  await tap(page.locator('#v8Sets [data-si="0"]'));const w225=page.locator('#v8Sets [data-w="22.5"]');assert.equal(await w225.count(),1,'set-plan 22.5kg option missing');await tap(w225);const r12=page.locator('#v8Sets [data-r="12"]');assert.equal(await r12.count(),1,'set-plan 12-rep option missing');await tap(r12);
  await tap(page.locator('#saveScan'));await page.waitForFunction(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return (c.active?.events||[]).some(e=>e.equipmentId===id)},setOnly.id,{timeout:3500});await page.waitForTimeout(180);
  const setOnlyEvent=await savedEvent(setOnly.id);assert.deepEqual(setOnlyEvent.schema,['weight','reps','sets']);assert.equal(setOnlyEvent.mode,'sets');assert.equal(setOnlyEvent.metrics.weight,22.5);assert.equal(setOnlyEvent.metrics.reps,12);assert.equal(setOnlyEvent.metrics.sets,3);assert.equal(setOnlyEvent.legacy.weight,22.5);assert.equal(setOnlyEvent.legacy.reps,12);assert.equal(setOnlyEvent.legacy.sets,3);

  console.log(`[AXIS 8.21 recording surface ${ENGINE}] set-plan plus residual property renders only the residual generic control`);
  await createFromSearch('组计划剩余属性测试');await setMetrics(['weight','reps','sets','intensity']);const setResidual=await saveCustom('组计划剩余属性测试');assert.ok(setResidual?.id);
  await page.waitForFunction(()=>{const x=document.querySelector('#v8Sets'),r=document.querySelector('#axis818MetricRecorder');return !!x&&!x.classList.contains('hidden')&&!!r&&r.classList.contains('show')&&r.querySelector('[data-axis818-metric="intensity"]')},undefined,{timeout:2500});
  const residualKeys=await page.locator('#axis818MetricRecorder [data-axis818-metric]').evaluateAll(xs=>xs.map(x=>x.dataset.axis818Metric));assert.deepEqual(residualKeys,['intensity'],'generic recorder did not collapse to residual metrics only');
  assert.equal(await page.locator('#axis818MetricRecorder [data-axis818-metric="weight"],#axis818MetricRecorder [data-axis818-metric="reps"],#axis818MetricRecorder [data-axis818-metric="sets"]').count(),0,'set-owned metrics duplicated beside residual property');
  const residualRate=page.locator('#axis818MetricRecorder [data-axis821-rate="intensity"][data-value="7"]');assert.equal(await residualRate.count(),1);await tap(residualRate);await tap(page.locator('#saveScan'));await page.waitForFunction(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return (c.active?.events||[]).some(e=>e.equipmentId===id)},setResidual.id,{timeout:3500});await page.waitForTimeout(180);
  const residualEvent=await savedEvent(setResidual.id);assert.deepEqual(residualEvent.schema,['weight','reps','sets','intensity']);assert.equal(residualEvent.mode,'sets');assert.equal(residualEvent.metrics.weight,20);assert.equal(residualEvent.metrics.reps,10);assert.equal(residualEvent.metrics.sets,1);assert.equal(residualEvent.metrics.intensity,7);

`;
if(!smoke.includes(smokeAnchor))fail('recording-property smoke final assertion anchor missing');
smoke=smoke.replace(smokeAnchor,smokeInsert+smokeAnchor);
smoke=once(smoke,'PASS · exact 14-property Object editor · zero selection preserved · no default-time fallback · value-only shared recorder · true numeric optical center · immutable Encounter facts','PASS · exact 14-property Object editor · zero selection preserved · no default-time fallback · set-plan single ownership · residual-only shared recorder · true numeric optical center · immutable Encounter facts','recording-property PASS evidence');
write(smokeFile,smoke);

const sealFile='postbuild-821-executable-object-presentation-seal.mjs';
let seal=read(sealFile);
const sealAnchor="if(!src.includes('function axis821EventMetricSummary(e)'))fail('schema-aware Encounter summary helper missing from final runtime');";
const sealInsert=String.raw`
if(!src.includes("setPlanMetricOwnership:true"))fail('set-plan recording ownership marker missing from final runtime');
{
 const recorder=moduleFunctionRange(src,'app.js','function axis818RenderRecorder()','final set-plan-aware recording surface').text;
 for(const token of ['axis821RecorderValueSchema(eq,schema)','setPlanOnly','data.axis821SetPlanOwned','valueSchema.map'])if(!recorder.includes(token))fail('final recording surface lost set-plan single ownership · '+token);
 const reader=moduleFunctionRange(src,'app.js','function axis818ReadMetricInputs(schema)','final set-plan-aware immutable metric reader').text;
 for(const token of ['axis821SetPlanOwnedMetricKey','axis821SetPlanLegacyMetricValue','setPlan'])if(!reader.includes(token))fail('final immutable metric reader lost set-plan fallback · '+token);
}
`;
if(!seal.includes(sealAnchor))fail('final seal insertion anchor missing');
seal=seal.replace(sealAnchor,sealAnchor+sealInsert);
write(sealFile,seal);

for(const f of [surfaceFile,controlFile,smokeFile,sealFile]){
 const s=read(f);if(!s.trim())fail(`${f} became empty`);
}
console.log('[AXIS 8.21 set-plan recording ownership] staged · one editable owner per recording fact · residual generic metrics only · immutable Encounter fallback preserved');