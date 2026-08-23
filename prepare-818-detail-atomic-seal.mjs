import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.18 detail atomic seal] ${m}`)};
if(!fs.existsSync(FILE))fail('missing app.js');
let s=fs.readFileSync(FILE,'utf8');

/* 8.9/8.10.2 already owns the correct data path: openEvent stages complete
   event detail and axis89CommitDetail atomically commits title + body. Keep the
   same single DOM0 router; place the presentation guard inside that owner so the
   physical click always reaches openEvent before the visible session sheet is
   hidden during async media staging. `$` is the canonical single-element helper,
   so every accepted historical compiler shape is normalized to the `$$`
   collection owner before attaching the per-event DOM0 handlers. */
const legacyA="$$('[data-event]').forEach(b=>b.onclick=()=>openEvent(b.dataset.event));";
const legacyB="$('[data-event]').forEach(b=>b.onclick=()=>openEvent(b.dataset.event));";
const guarded="$$('[data-event]').forEach(b=>b.onclick=()=>{const sheet=$('#detailSheet');if(sheet?.classList.contains('show'))sheet.classList.add('axis884Prepaint');return openEvent(b.dataset.event)});";
const doubleCount=s.split(legacyA).length-1;
const withoutDouble=s.split(legacyA).join('');
const singleCount=withoutDouble.split(legacyB).length-1;
if(doubleCount+singleCount!==1)fail(`canonical event detail router expected one compiler shape, found ${doubleCount}/${singleCount}`);
if(!s.includes("owner:'atomic-handoff'"))fail('canonical atomic detail commit owner missing');
if(!s.includes('async function openEvent(id){'))fail('canonical openEvent missing');
if(!s.includes("sheet?.classList.remove('axis884Prepaint')"))fail('atomic commit does not release prepaint guard');
s=doubleCount?s.replace(legacyA,guarded):s.replace(legacyB,guarded);
if((s.split('return openEvent(b.dataset.event)').length-1)!==1)fail('guarded canonical router not singular');
if(/(^|[^$])\$\('\[data-event\]'\)\.forEach/.test(s))fail('single-element event router survived collection normalization');
if(!s.includes("$$('[data-event]').forEach"))fail('collection-safe event detail router missing after normalization');

const close=s.lastIndexOf('})();');if(close<0)fail('app IIFE close missing');
const bridge=`
try{window.__AXIS_818_DETAIL_ATOMIC__={version:'8.18',owner:'app.js',router:'canonical-dom0',guard:'router-prepaint',commitOwner:'atomic-handoff',retainPreviousUntilReady:true}}catch(e){}
`;
s=s.slice(0,close)+bridge+s.slice(close);
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)};
fs.writeFileSync(FILE,s);
console.log(`[AXIS 8.18 detail atomic seal] PASS · single canonical DOM0 router · collection-safe $$ binding · in-owner prepaint guard · staged atomic commit sole detail owner · compiler shape ${doubleCount?'collection':'single-normalized'}`);
