import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 set-plan migration generator] ${m}`)};
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

const migrationFile='scripts/.axis-821-set-plan-recording-ownership-once.mjs';
let migration=fs.readFileSync(migrationFile,'utf8');
for(const [from,to,label] of [
 ["console.log(`[AXIS 8.21 recording surface ${ENGINE}] set-plan owns weight / reps / sets without a duplicate generic editor`);","console.log('[AXIS 8.21 recording surface '+ENGINE+'] set-plan owns weight / reps / sets without a duplicate generic editor');",'set-only diagnostic'],
 ["console.log(`[AXIS 8.21 recording surface ${ENGINE}] set-plan plus residual property renders only the residual generic control`);","console.log('[AXIS 8.21 recording surface '+ENGINE+'] set-plan plus residual property renders only the residual generic control');",'residual diagnostic'],
 ["'data.axis821SetPlanOwned'","'dataset.axis821SetPlanOwned'",'final seal dataset token']
])migration=once(migration,from,to,label);
fs.writeFileSync(migrationFile,migration);

const compatFile='prepare-821-metric-control-smoke-compat.mjs';
let compat=fs.readFileSync(compatFile,'utf8');
compat=once(compat,
 "assert.equal(surface.presetMetricCount,14);assert.equal(surface.newRecorder,false);assert.equal(surface.newPersistence,false);const controlSystem=await page.evaluate(()=>window.__AXIS_821_METRIC_CONTROLS__);",
 "assert.equal(surface.presetMetricCount,14);assert.equal(surface.setPlanMetricOwnership,true);assert.equal(surface.newRecorder,false);assert.equal(surface.newPersistence,false);const controlSystem=await page.evaluate(()=>window.__AXIS_821_METRIC_CONTROLS__);",
 'surface single-ownership assertion');
compat=once(compat,
 "  await page.waitForFunction(()=>document.querySelector('[data-axis821-key=\\\"pace\\\"]')&&document.querySelector('[data-axis821-key=\\\"completed\\\"]'),undefined,{timeout:2500});",
 "  await page.waitForFunction(()=>{const sets=document.querySelector('#v8Sets'),rec=document.querySelector('#axis818MetricRecorder');return !!sets&&!sets.classList.contains('hidden')&&!!rec&&rec.classList.contains('show')&&rec.querySelector('[data-axis821-key=\\\"pace\\\"]')&&rec.querySelector('[data-axis821-key=\\\"completed\\\"]')},undefined,{timeout:2500});\\n  const fullResidualKeys=await page.locator('#axis818MetricRecorder [data-axis818-metric]').evaluateAll(xs=>xs.map(x=>x.dataset.axis818Metric));assert.deepEqual(fullResidualKeys,['hold','distance','pace','incline','completed'],'set-owned metrics leaked into full generic recorder');",
 'full-family set-plan + residual wait');
compat=once(compat,
 "  assert.equal(kinds.weight.family,'quantity');assert.equal(kinds.reps.family,'quantity');assert.equal(kinds.hold.family,'time');assert.equal(kinds.pace.family,'pace');assert.equal(kinds.completed.family,'choice');",
 "  assert.equal(kinds.hold.family,'time');assert.equal(kinds.distance.family,'quantity');assert.equal(kinds.pace.family,'pace');assert.equal(kinds.incline.family,'quantity');assert.equal(kinds.completed.family,'choice');assert.equal(kinds.weight,undefined);assert.equal(kinds.reps,undefined);assert.equal(kinds.sets,undefined);",
 'full-family residual ownership assertions');
compat=once(compat,
 "  const metricGeometry=await page.locator('[data-axis821-key=\\\"weight\\\"] .axis821Stepper').evaluate(el=>{const r=el.getBoundingClientRect(),cell=el.querySelector(':scope>div')?.getBoundingClientRect(),input=el.querySelector('input')?.getBoundingClientRect();return{h:Math.round(r.height),inputH:Math.round(input?.height||0),center:input?(input.left+input.right)/2:null,cell:centerOrNull(cell),align:getComputedStyle(el.querySelector('input')).textAlign};function centerOrNull(x){return x?(x.left+x.right)/2:null}});",
 "  const metricGeometry=await page.locator('[data-axis821-key=\\\"hold\\\"] .axis821Stepper').evaluate(el=>{const r=el.getBoundingClientRect(),cell=el.querySelector(':scope>div')?.getBoundingClientRect(),input=el.querySelector('input')?.getBoundingClientRect();return{h:Math.round(r.height),inputH:Math.round(input?.height||0),center:input?(input.left+input.right)/2:null,cell:centerOrNull(cell),align:getComputedStyle(el.querySelector('input')).textAlign};function centerOrNull(x){return x?(x.left+x.right)/2:null}});",
 'full-family residual geometry target');
compat=once(compat,
 "  assert.ok(metricGeometry.h>=62&&metricGeometry.h<=66,`weight control drifted from Group Plan geometry: ${JSON.stringify(metricGeometry)}`);assert.ok(Math.abs(metricGeometry.center-metricGeometry.cell)<=.5,`weight numeric center drift ${JSON.stringify(metricGeometry)}`);assert.equal(metricGeometry.align,'center');",
 "  assert.ok(metricGeometry.h>=62&&metricGeometry.h<=66,`hold control drifted from Group Plan geometry: ${JSON.stringify(metricGeometry)}`);assert.ok(Math.abs(metricGeometry.center-metricGeometry.cell)<=.5,`hold numeric center drift ${JSON.stringify(metricGeometry)}`);assert.equal(metricGeometry.align,'center');",
 'full-family residual geometry assertion');
compat=once(compat,
 "  await page.locator('[data-axis818-metric=\\\"weight\\\"]').fill('42.5');",
 "  await tap(page.locator('#v8Sets [data-cnt=\\\"1\\\"]'));await tap(page.locator('#v8Sets [data-cnt=\\\"1\\\"]'));await tap(page.locator('#v8Sets [data-cnt=\\\"1\\\"]'));await page.waitForFunction(()=>document.querySelectorAll('#v8Sets [data-si]').length===4,undefined,{timeout:1500});await tap(page.locator('#v8Sets [data-si=\\\"0\\\"]'));const fullW=page.locator('#v8Sets [data-w=\\\"22.5\\\"]');assert.equal(await fullW.count(),1);await tap(fullW);const fullR=page.locator('#v8Sets [data-r=\\\"12\\\"]');assert.equal(await fullR.count(),1);await tap(fullR);",
 'full-family set-plan edits');
compat=once(compat,
 "  await tap(page.locator('[data-axis821-preset=\\\"reps\\\"][data-value=\\\"12\\\"]'));",
 "  assert.equal(await page.locator('#axis818MetricRecorder [data-axis818-metric=\\\"reps\\\"]').count(),0,'reps duplicated in generic recorder');",
 'full-family reps duplicate guard');
compat=once(compat,
 "  await tap(page.locator('[data-axis821-preset=\\\"sets\\\"][data-value=\\\"4\\\"]'));",
 "  assert.equal(await page.locator('#axis818MetricRecorder [data-axis818-metric=\\\"sets\\\"]').count(),0,'sets duplicated in generic recorder');",
 'full-family sets duplicate guard');
compat=once(compat,
 "  const fullEvent=await savedEvent(full.id);assert.deepEqual(fullEvent.schema,['weight','reps','sets','hold','distance','pace','incline','completed']);assert.equal(fullEvent.metrics.weight,42.5);assert.equal(fullEvent.metrics.reps,12);assert.equal(fullEvent.metrics.sets,4);",
 "  const fullEvent=await savedEvent(full.id);assert.deepEqual(fullEvent.schema,['weight','reps','sets','hold','distance','pace','incline','completed']);assert.equal(fullEvent.metrics.weight,22.5);assert.equal(fullEvent.metrics.reps,12);assert.equal(fullEvent.metrics.sets,4);",
 'full-family immutable set-plan facts');
compat=once(compat,
 "console.log(`[AXIS 8.21 recording surface ${ENGINE}] PASS · exact 14-property Object editor · zero selection preserved · no default-time fallback · value-only shared recorder · true numeric optical center · immutable Encounter facts`);",
 "console.log(`[AXIS 8.21 recording surface ${ENGINE}] PASS · exact 14-property Object editor · zero selection preserved · no default-time fallback · set-plan single ownership · residual-only shared recorder · true numeric optical center · immutable Encounter facts`);",
 'compat base proof copy');
compat=once(compat,
 "console.log(`[AXIS 8.21 recording surface ${ENGINE}] PASS · exact 14-property Object editor · zero selection preserved · native Group Plan geometry · quantity/time/pace/scale/choice controls · true numeric optical center independent of unit · immutable Encounter facts`);",
 "console.log(`[AXIS 8.21 recording surface ${ENGINE}] PASS · exact 14-property Object editor · zero selection preserved · set-plan single ownership · residual-only shared recorder · native Group Plan geometry · quantity/time/pace/scale/choice controls · true numeric optical center independent of unit · immutable Encounter facts`);",
 'compat final proof copy');
fs.writeFileSync(compatFile,compat);
console.log('[AXIS 8.21 set-plan migration generator] repaired generator + aligned metric-control smoke compat to single recording ownership');