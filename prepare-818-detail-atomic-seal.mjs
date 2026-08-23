import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.18 detail atomic seal] ${m}`)};
if(!fs.existsSync(FILE))fail('missing app.js');
let s=fs.readFileSync(FILE,'utf8');

/* Keep one canonical openEvent/atomic-commit data path. Historical build layers may
   present the DOM0 event router as either $/$$ and either before/after the prepaint
   guard. All four accepted compiler shapes converge here to one collection-safe $$
   guarded owner. No second router or event listener is introduced. */
const plainDouble="$$('[data-event]').forEach(b=>b.onclick=()=>openEvent(b.dataset.event));";
const plainSingle="$('[data-event]').forEach(b=>b.onclick=()=>openEvent(b.dataset.event));";
const guardedDouble="$$('[data-event]').forEach(b=>b.onclick=()=>{const sheet=$('#detailSheet');if(sheet?.classList.contains('show'))sheet.classList.add('axis884Prepaint');return openEvent(b.dataset.event)});";
const guardedSingle="$('[data-event]').forEach(b=>b.onclick=()=>{const sheet=$('#detailSheet');if(sheet?.classList.contains('show'))sheet.classList.add('axis884Prepaint');return openEvent(b.dataset.event)});";
const shapes=[plainDouble,plainSingle,guardedDouble,guardedSingle];
const counts=shapes.map(x=>s.split(x).length-1),total=counts.reduce((a,b)=>a+b,0);
if(total!==1)fail(`canonical event detail router expected one compiler shape, found ${counts.join('/')}`);
if(!s.includes("owner:'atomic-handoff'"))fail('canonical atomic detail commit owner missing');
if(!s.includes('async function openEvent(id){'))fail('canonical openEvent missing');
if(!s.includes("sheet?.classList.remove('axis884Prepaint')"))fail('atomic commit does not release prepaint guard');
for(let i=0;i<shapes.length;i++)if(counts[i]===1){s=s.replace(shapes[i],guardedDouble);break}
if((s.split(guardedDouble).length-1)!==1)fail('guarded collection router not singular after convergence');
if(s.includes(guardedSingle)||s.includes(plainSingle))fail('single-element event router survived convergence');

/* Structural backstop for formatting variants: any remaining single `$` collection
   receiver for [data-event] is a release blocker. */
const survivor=/(^|[^$])\$\s*\(\s*(['"`])\[data-event\]\2\s*\)\s*\.forEach/g;
const hit=survivor.exec(s);
if(hit){const at=hit.index+(hit[1]?.length||0),snippet=s.slice(Math.max(0,at-90),Math.min(s.length,at+220)).replace(/\s+/g,' ');fail(`single-element event collection survived near: ${snippet}`)}

const close=s.lastIndexOf('})();');if(close<0)fail('app IIFE close missing');
if(s.includes('__AXIS_818_DETAIL_ATOMIC__'))fail('detail atomic diagnostic duplicated');
const bridge=`
try{window.__AXIS_818_DETAIL_ATOMIC__={version:'8.18',owner:'app.js',router:'canonical-dom0',guard:'router-prepaint',commitOwner:'atomic-handoff',retainPreviousUntilReady:true,collectionHelper:'$$'}}catch(e){}
`;
s=s.slice(0,close)+bridge+s.slice(close);
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)};
fs.writeFileSync(FILE,s);
console.log(`[AXIS 8.18 detail atomic seal] PASS · one canonical collection-safe DOM0 router · guarded prepaint · staged atomic commit sole detail owner · input-shape ${counts.findIndex(Boolean)}`);
