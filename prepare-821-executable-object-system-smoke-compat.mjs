import fs from 'node:fs';

const FILE='scripts/axis-8201-object-reliability-smoke.mjs';
const fail=m=>{throw new Error(`[AXIS 8.21 Executable Object smoke compat] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let s=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);s=s.replace(from,to)};
const onceRe=(re,to,label)=>{const xs=s.match(re)||[];if(xs.length!==1)fail(`${label} expected once, found ${xs.length}`);s=s.replace(re,to)};

/* The 8.21 Object editor intentionally moved the fourteen inline choices into a
   compact dedicated property sheet. Keep the inherited physical smoke on the
   real user route instead of reaching for retired inline DOM. */
onceRe(
 /const createFromSearch=async\(name,\{allowManualName=false\}=\{\}\)=>\{[\s\S]*?\};\nconst keepOnly=async key=>\{[\s\S]*?\};/,
 `const createFromSearch=async(name,{allowManualName=false}={})=>{await openPicker();await search(name);const create=page.locator('#v873SmartResults [data-axis-create-custom]');assert.equal(await create.count(),1,\`direct create missing for \${name}\`);await tap(create);await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:2500});const input=page.locator('#customName');await page.waitForTimeout(140);await page.waitForFunction(()=>document.querySelector('[data-axis821-property-open]'),undefined,{timeout:2500});const seed=await input.inputValue();if(seed!==name){assert.equal(allowManualName&&seed==='',true,\`unexpected custom-name seed for \${name}: \${seed}\`);await input.fill(name);assert.equal(await input.inputValue(),name)}await tap(page.locator('[data-axis821-property-open]'));await page.waitForFunction(()=>document.querySelector('#axis821MetricPickerSheet')?.classList.contains('show')&&document.querySelectorAll('#axis821MetricPickerBody [data-axis818-metric-choice]').length>=14,undefined,{timeout:2500})};
const keepOnly=async key=>{const root='#axis821MetricPickerBody';const btn=page.locator(\`\${root} [data-axis818-metric-choice="\${key}"]\`);assert.equal(await btn.count(),1,\`metric choice missing: \${key}\`);if(!(await btn.evaluate(x=>x.classList.contains('active'))))await tap(btn);for(const k of ['weight','reps','sets','duration','hold','distance','pace','speed','intensity','resistance','level','incline','rating','completed']){if(k===key)continue;const b=page.locator(\`\${root} [data-axis818-metric-choice="\${k}"]\`);if(await b.count()&&await b.evaluate(x=>x.classList.contains('active')))await tap(b)}await page.waitForFunction(k=>{const xs=[...document.querySelectorAll('#axis821MetricPickerBody [data-axis818-metric-choice].active')].map(x=>x.dataset.axis818MetricChoice);return xs.length===1&&xs[0]===k},key,{timeout:1500});await tap(page.locator('[data-axis821-property-close]'));await page.waitForFunction(()=>!document.querySelector('#axis821MetricPickerSheet')?.classList.contains('show'),undefined,{timeout:1500})};`,
 'physical Object property editor route'
);

/* 8.20.1 historically proved pace-only did not create false set Active. 8.21
   deliberately supersedes that execution inference: pace is a continuous metric,
   so the same existing v82/v87 owner now creates timed Active. */
once(
 "assert.deepEqual(paceSaved.schema,['pace']);assert.equal(paceSaved.mode,'single');assert.equal(paceSaved.pace,'5:40 / km');assert.equal(paceSaved.activity,null,'single pace record created a false persistent Active lifecycle');",
 "assert.deepEqual(paceSaved.schema,['pace']);assert.equal(paceSaved.mode,'timed');assert.equal(paceSaved.pace,'5:40 / km');assert.equal(paceSaved.activity?.status,'active','continuous pace record did not enter the existing timed Active lifecycle');",
 'pace-only 8.21 timed Active semantics'
);

if(!s.includes("paceSaved.mode,'timed'"))fail('current pace execution assertion missing');
if(!s.includes('#axis821MetricPickerBody'))fail('compact property-sheet physical route missing');
fs.writeFileSync(FILE,s);

/* The current representative-family smoke must not use `sets` as a generic
   count control. `sets` selects sets execution and is therefore Group Plan-owned.
   `reps` alone remains single execution, so it is the correct generic count-family
   representative while the recording-property smoke separately proves Group Plan
   ownership for reps/sets inside sets execution. */
const CURRENT_FILE='scripts/axis-821-executable-object-system-smoke.mjs';
if(!fs.existsSync(CURRENT_FILE))fail(`missing ${CURRENT_FILE}`);
let current=fs.readFileSync(CURRENT_FILE,'utf8');
const oldCount="['family-count','组数测试',{key:'sets',label:'组数',type:'count',unit:'组',step:1},'stepper']";
const newCount="['family-count','次数测试',{key:'reps',label:'次数',type:'count',unit:'次',step:1},'stepper']";
const countHits=current.split(oldCount).length-1;if(countHits!==1)fail(`current count-family ownership assertion expected once, found ${countHits}`);
current=current.replace(oldCount,newCount);
fs.writeFileSync(CURRENT_FILE,current);

console.log('[AXIS 8.21 Executable Object smoke compat] PASS · inherited physical editor uses compact property sheet · continuous pace resolves to existing timed Active owner · reps-only remains generic single count family while sets stays Group Plan-owned');
