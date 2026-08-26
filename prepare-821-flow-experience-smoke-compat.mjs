import fs from 'node:fs';

const FILE='scripts/axis-821-flow-user-surface-smoke.mjs';
const fail=m=>{throw new Error(`[AXIS 8.21 Flow experience smoke compat] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let s=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);s=s.replace(from,to)};

once(
 "await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.version==='8.21'&&window.__AXIS_821_FLOW_SURFACE__?.version==='8.21'&&window.__AXIS_QUICK_RECORD__?.owner==='v61',undefined,{timeout:9000});",
 "await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.version==='8.21'&&window.__AXIS_821_FLOW_SURFACE__?.version==='8.21'&&window.__AXIS_821_FLOW_EXPERIENCE__?.version==='8.21'&&window.__AXIS_QUICK_RECORD__?.owner==='v61',undefined,{timeout:9000});",
 'physical wait includes final Flow experience'
);

once(
 "\n\ntry{\n",
 "\nconst shiftStep=async(index,key)=>{const h=page.locator(`[data-axis-flow-drag=\"${index}\"]`);await h.focus();await h.press(key);await page.waitForTimeout(30)};\n\ntry{\n",
 'keyboard-accessible physical reorder helper'
);

once(
 "assert.equal(await page.locator('#axis821FlowHome').getAttribute('data-state'),'empty');",
 "assert.equal(await page.locator('#axis821FlowHome').getAttribute('data-state'),'empty');const experience=await page.evaluate(()=>window.__AXIS_821_FLOW_EXPERIENCE__);assert.equal(experience.touchReorder,true);assert.equal(experience.keyboardReorder,true);assert.equal(experience.focusedRunSurface,true);assert.equal(experience.newFlowOwner,false);assert.equal(experience.newRecorder,false);",
 'Flow experience ownership assertions'
);

const move2="await tap(page.locator('[data-axis-flow-move=\"-1\"][data-index=\"2\"]'));";
const move2hits=s.split(move2).length-1;if(move2hits!==2)fail(`two inherited index-2 arrow reorders expected, found ${move2hits}`);s=s.replaceAll(move2,"await shiftStep(2,'ArrowUp');");
once("await tap(page.locator('[data-axis-flow-move=\"-1\"][data-index=\"1\"]'));","await shiftStep(1,'ArrowUp');",'second edit reorder');

once(
 "let names=await page.locator('.axis821FlowStep>span>b').allTextContents();assert.deepEqual(names,['Flow 时间项','Flow 完成项','胸推']);",
 "let names=await page.locator('.axis821FlowStep>span>b').allTextContents();assert.deepEqual(names,['Flow 时间项','Flow 完成项','胸推']);assert.equal(await page.locator('[data-axis-flow-drag]').count(),3,'touch/keyboard reorder handles missing');assert.equal(await page.locator('[data-axis-flow-move]').count(),0,'admin arrow controls survived final editor');",
 'final editor exposes drag instead of arrow admin controls'
);

once(
 "const homeText=await page.locator('#axis821FlowHome').innerText();assert.ok(homeText.includes('Flow 时间项'));assert.ok(homeText.includes('接下来 · 胸推'));assert.ok(!homeText.includes('%'),'Flow surfaced completion percentage');",
 "const homeText=await page.locator('#axis821FlowHome').innerText();assert.ok(homeText.includes('Flow 时间项'));assert.ok(homeText.includes('接下来 · 胸推'));assert.ok(homeText.includes('1 / 3'),'Flow current position missing');assert.ok(!homeText.includes('%'),'Flow surfaced completion percentage');",
 'focused run position is factual, not percentage gamification'
);

once(
 "await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.current?.()?.objectRef==='chest',undefined,{timeout:4000});",
 "await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.current?.()?.objectRef==='chest',undefined,{timeout:4000});assert.ok((await page.locator('#axis821FlowHome').innerText()).includes('2 / 3'),'Flow position did not advance with Encounter');",
 'run surface follows Encounter-gated position'
);

once(
 "console.log(`[AXIS 8.21 Flow surface ${ENGINE}] PASS · canonical picker composition · reorder/save/reload · current/next intent · canonical Quick Record · Encounter-gated advance · skip reality tolerance · immutable history`);",
 "console.log(`[AXIS 8.21 Flow surface ${ENGINE}] PASS · canonical picker composition · touch/keyboard reorder contract · focused current/next position · canonical Quick Record · Encounter-gated advance · skip reality tolerance · immutable history`);",
 'Flow smoke final proof copy'
);

/* The target is an ESM smoke file with top-level await. Native `node --check` in
   the established CI lane remains the syntax authority; `new Function` would
   incorrectly reject valid module syntax here. */
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 Flow experience smoke compat] PASS · dual-engine physical Flow smoke follows drag editor + focused run surface');
