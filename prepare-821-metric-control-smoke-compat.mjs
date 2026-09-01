import fs from 'node:fs';

const FILE='scripts/axis-821-recording-property-surface-smoke.mjs';
const fail=m=>{throw new Error(`[AXIS 8.21 metric control smoke compat] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let s=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);s=s.replace(from,to)};

once(
 "await page.waitForFunction(()=>window.__AXIS_OBJECT_TRUTH__?.version==='8.18'&&window.__AXIS_EXECUTABLE_OBJECTS__?.version==='8.20'&&window.__AXIS_821_RECORDING_SURFACE__?.explicitEmptySchema===true&&window.__AXIS_821_METRIC_CONTROLS__?.numberCenterIndependentOfUnit===true,undefined,{timeout:9000});",
 "await page.waitForFunction(()=>window.__AXIS_OBJECT_TRUTH__?.version==='8.18'&&window.__AXIS_EXECUTABLE_OBJECTS__?.version==='8.20'&&window.__AXIS_821_RECORDING_SURFACE__?.explicitEmptySchema===true&&window.__AXIS_821_METRIC_CONTROLS__?.version==='8.21'&&window.__AXIS_821_METRIC_CONTROLS__?.numberCenterIndependentOfUnit===true,undefined,{timeout:9000});",
 'metric control system boot wait'
);

once(
 "assert.equal(surface.schemaEditing,'object-editor-only');assert.equal(surface.recordingSurface,'value-controls-only');assert.equal(surface.presetMetricCount,14);assert.equal(surface.newRecorder,false);assert.equal(surface.newPersistence,false);",
 "assert.equal(surface.schemaEditing,'object-editor-only');assert.equal(surface.recordingSurface,'value-controls-only');assert.equal(surface.presetMetricCount,14);assert.equal(surface.setPlanMetricOwnership,true);assert.equal(surface.newRecorder,false);assert.equal(surface.newPersistence,false);const controlSystem=await page.evaluate(()=>window.__AXIS_821_METRIC_CONTROLS__);assert.deepEqual(controlSystem.families,['quantity','time','pace','scale','choice']);assert.equal(controlSystem.groupPlanGeometry,true);assert.equal(controlSystem.numberCenterIndependentOfUnit,true);assert.equal(controlSystem.newSchemaOwner,false);assert.equal(controlSystem.newRecorder,false);assert.equal(controlSystem.newPersistence,false);",
 'metric control ownership assertions'
);

const anchor="\n  assert.deepEqual(errors,[],`page errors:\\n${errors.join('\\n')}`);";
const n=s.split(anchor).length-1;if(n!==1)fail(`final physical assertion anchor expected once, found ${n}`);
const block=[
 '',
 "  console.log(`[AXIS 8.21 recording surface ${ENGINE}] quantity + time + pace + choice families share one native geometry`);",
 "  await createFromSearch('全属性控件测试');await setMetrics(['weight','reps','sets','hold','distance','pace','incline','completed']);",
 "  const full=await saveCustom('全属性控件测试');assert.ok(full?.id);assert.deepEqual(full.metricSchema.map(x=>x.key),['weight','reps','sets','hold','distance','pace','incline','completed']);",
 "  await page.waitForFunction(()=>{const sets=document.querySelector('#v8Sets'),rec=document.querySelector('#axis818MetricRecorder');return !!sets&&!sets.classList.contains('hidden')&&!!rec&&rec.classList.contains('show')&&rec.querySelector('[data-axis821-key=\"pace\"]')&&rec.querySelector('[data-axis821-key=\"completed\"]')},undefined,{timeout:2500});\n  const fullResidualKeys=await page.locator('#axis818MetricRecorder [data-axis818-metric]').evaluateAll(xs=>xs.map(x=>x.dataset.axis818Metric));assert.deepEqual(fullResidualKeys,['hold','distance','pace','incline','completed'],'set-owned metrics leaked into full generic recorder');",
 "  const kinds=await page.locator('#axis818MetricRecorder .axis821MetricControl').evaluateAll(xs=>Object.fromEntries(xs.map(x=>[x.dataset.axis821Key,{kind:x.dataset.axis821Kind,family:x.dataset.axis821Family}])));",
 "  assert.equal(kinds.hold.family,'time');assert.equal(kinds.distance.family,'quantity');assert.equal(kinds.pace.family,'pace');assert.equal(kinds.incline.family,'quantity');assert.equal(kinds.completed.family,'choice');assert.equal(kinds.weight,undefined);assert.equal(kinds.reps,undefined);assert.equal(kinds.sets,undefined);",
 "  assert.equal(kinds.hold.kind,'timer');assert.equal(kinds.pace.kind,'pace');assert.equal(kinds.completed.kind,'toggle');",
 "  const metricGeometry=await page.locator('[data-axis821-key=\"hold\"] .axis821Stepper').evaluate(el=>{const r=el.getBoundingClientRect(),cell=el.querySelector(':scope>div')?.getBoundingClientRect(),input=el.querySelector('input')?.getBoundingClientRect();return{h:Math.round(r.height),inputH:Math.round(input?.height||0),center:input?(input.left+input.right)/2:null,cell:centerOrNull(cell),align:getComputedStyle(el.querySelector('input')).textAlign};function centerOrNull(x){return x?(x.left+x.right)/2:null}});",
 "  assert.ok(metricGeometry.h>=62&&metricGeometry.h<=66,`hold control drifted from Group Plan geometry: ${JSON.stringify(metricGeometry)}`);assert.ok(Math.abs(metricGeometry.center-metricGeometry.cell)<=.5,`hold numeric center drift ${JSON.stringify(metricGeometry)}`);assert.equal(metricGeometry.align,'center');",
 "  await tap(page.locator('#v8Sets [data-cnt=\"1\"]'));await tap(page.locator('#v8Sets [data-cnt=\"1\"]'));await tap(page.locator('#v8Sets [data-cnt=\"1\"]'));await page.waitForFunction(()=>document.querySelectorAll('#v8Sets [data-si]').length===4,undefined,{timeout:1500});await tap(page.locator('#v8Sets [data-si=\"0\"]'));const fullW=page.locator('#v8Sets [data-w=\"22.5\"]');assert.equal(await fullW.count(),1);await tap(fullW);const fullR=page.locator('#v8Sets [data-r=\"12\"]');assert.equal(await fullR.count(),1);await tap(fullR);",
 "  assert.equal(await page.locator('#axis818MetricRecorder [data-axis818-metric=\"reps\"]').count(),0,'reps duplicated in generic recorder');",
 "  assert.equal(await page.locator('#axis818MetricRecorder [data-axis818-metric=\"sets\"]').count(),0,'sets duplicated in generic recorder');",
 "  await tap(page.locator('[data-axis821-preset=\"hold\"][data-value=\"45\"]'));",
 "  await tap(page.locator('[data-axis821-preset=\"distance\"][data-value=\"3\"]'));",
 "  const paceInput=page.locator('[data-axis818-metric=\"pace\"]');await paceInput.fill('5:30');await paceInput.blur();assert.equal(await paceInput.inputValue(),'5:30');",
 "  await page.locator('[data-axis818-metric=\"incline\"]').fill('6.5');",
 "  await tap(page.locator('[data-axis821-bool=\"completed\"][data-value=\"0\"]'));",
 "  assert.equal(await page.locator('[data-axis818-metric=\"completed\"]').inputValue(),'0');",
 "  await tap(page.locator('[data-axis821-pace-step=\"pace\"][data-delta=\"-5\"]'));assert.equal(await paceInput.inputValue(),'5:25');",
 "  await tap(page.locator('[data-axis821-pace-step=\"pace\"][data-delta=\"5\"]'));assert.equal(await paceInput.inputValue(),'5:30');",
 "  const centeredFamilies=await page.locator('#axis818MetricRecorder .axis821MetricControl:not([data-axis821-kind=\"toggle\"])').evaluateAll(xs=>xs.map(x=>{const cell=x.querySelector('.axis821Stepper>div'),input=x.querySelector('[data-axis818-metric]');if(!cell||!input)return null;const c=cell.getBoundingClientRect(),i=input.getBoundingClientRect();return{key:x.dataset.axis821Key,delta:Math.abs((i.left+i.right-c.left-c.right)/2),align:getComputedStyle(input).textAlign}}).filter(Boolean));for(const g of centeredFamilies){assert.ok(g.delta<=.5,`${g.key} numeric center drift ${g.delta}`);assert.equal(g.align,'center',`${g.key} text alignment drift`)}",
 "  await tap(page.locator('#saveScan'));",
 "  await page.waitForFunction(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return (c.active?.events||[]).some(e=>e.equipmentId===id)},full.id,{timeout:3500});await page.waitForTimeout(180);",
 "  const fullEvent=await savedEvent(full.id);assert.deepEqual(fullEvent.schema,['weight','reps','sets','hold','distance','pace','incline','completed']);assert.equal(fullEvent.metrics.weight,22.5);assert.equal(fullEvent.metrics.reps,12);assert.equal(fullEvent.metrics.sets,4);assert.equal(fullEvent.metrics.hold,45);assert.equal(fullEvent.metrics.distance,3);assert.equal(fullEvent.metrics.pace,'5:30');assert.equal(fullEvent.metrics.incline,6.5);assert.equal(fullEvent.metrics.completed,false);"
].join('\n');
s=s.replace(anchor,block+anchor);

once(
 "console.log(`[AXIS 8.21 recording surface ${ENGINE}] PASS · exact 14-property Object editor · zero selection preserved · no default-time fallback · set-plan single ownership · residual-only shared recorder · true numeric optical center · immutable Encounter facts`);",
 "console.log(`[AXIS 8.21 recording surface ${ENGINE}] PASS · exact 14-property Object editor · zero selection preserved · set-plan single ownership · residual-only shared recorder · native Group Plan geometry · quantity/time/pace/scale/choice controls · true numeric optical center independent of unit · immutable Encounter facts`);",
 'recording control proof copy'
);

fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 metric control smoke compat] PASS · dual-engine recording smoke covers quantity/time/pace/choice + scale semantics with numeric-center invariant');
