import fs from 'node:fs';
const FILE='scripts/axis-8123-field-polish-smoke.mjs';
let src=fs.readFileSync(FILE,'utf8');
const from="await waitPlanner();await stressPlanner('photo');";
const to=`await page.waitForTimeout(220);console.log('[AXIS 8.12.3 DIAG photo selection] '+JSON.stringify(await page.evaluate(()=>{const h=document.querySelector('#v8Sets'),p=h?.querySelector('[data-v8123-plan]'),n=document.querySelector('#equipmentName'),sf=document.querySelector('#strengthFields'),eq=document.querySelector('#eqSheet');return{equipment:n?.textContent?.trim()||null,strengthClass:sf?.className||null,sets:!!h,setsClass:h?.className||null,setsDisplay:h?getComputedStyle(h).display:null,setsRows:h?.querySelectorAll('.v8SetRow').length||0,plan:!!p,planDisplay:p?getComputedStyle(p).display:null,planRects:p?.getClientRects().length||0,eqOpen:eq?.classList.contains('show')||false,reconcile:window.__AXIS_8123_RECORDING_SELECTION_RECONCILE__||null,renderOwner:window.__AXIS_8123_GROUP_PLAN_RENDER_OWNER__||null,stable:window.__AXIS_GROUP_PLAN_STABLE__||null}})));await waitPlanner();await stressPlanner('photo');`;
const n=src.split(from).length-1;if(n!==1)throw new Error(`[AXIS diagnostic] expected one photo planner wait, found ${n}`);
fs.writeFileSync(FILE,src.replace(from,to));
console.log('[AXIS diagnostic] instrumented photo selection state');