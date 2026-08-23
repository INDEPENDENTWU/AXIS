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
   so normalize generated [data-event] collection receivers semantically rather
   than relying on one byte-identical quote/spacing form. */
const singleCollection=/(^|[^$])\$\s*\(\s*(['"`])\[data-event\]\2\s*\)\s*\.forEach/g;
let collectionRepairs=0;
s=s.replace(singleCollection,(m,prefix)=>{collectionRepairs++;const body=m.slice(prefix.length).replace(/^\$\s*\(/,"$$('").replace(/(['"`])\[data-event\]\1\s*\)\s*\.forEach$/,"[data-event]').forEach");return prefix+body});

/* Normalize any formatting differences in the canonical router itself once the
   receiver is collection-safe. This preserves one DOM0 owner and the existing
   openEvent/atomic-commit data path. */
const routerRe=/\$\$\s*\(\s*(['"`])\[data-event\]\1\s*\)\s*\.forEach\s*\(\s*b\s*=>\s*b\.onclick\s*=\s*\(\)\s*=>\s*openEvent\(b\.dataset\.event\)\s*\)\s*;?/g;
const routers=[...s.matchAll(routerRe)];
const alreadyGuarded=(s.match(/return\s+openEvent\(b\.dataset\.event\)/g)||[]).length;
if(routers.length+alreadyGuarded!==1)fail(`canonical event detail router expected one owner, found plain=${routers.length} guarded=${alreadyGuarded}`);
if(!s.includes("owner:'atomic-handoff'"))fail('canonical atomic detail commit owner missing');
if(!s.includes('async function openEvent(id){'))fail('canonical openEvent missing');
if(!s.includes("sheet?.classList.remove('axis884Prepaint')"))fail('atomic commit does not release prepaint guard');
if(routers.length){
 const guarded="$$('[data-event]').forEach(b=>b.onclick=()=>{const sheet=$('#detailSheet');if(sheet?.classList.contains('show'))sheet.classList.add('axis884Prepaint');return openEvent(b.dataset.event)});";
 s=s.replace(routerRe,guarded);
}
if((s.match(/return\s+openEvent\(b\.dataset\.event\)/g)||[]).length!==1)fail('guarded canonical router not singular');

const survivor=/(^|[^$])\$\s*\(\s*(['"`])\[data-event\]\2\s*\)\s*\.forEach/g;
const hit=survivor.exec(s);
if(hit){const at=hit.index+(hit[1]?.length||0),snippet=s.slice(Math.max(0,at-90),Math.min(s.length,at+220)).replace(/\s+/g,' ');fail(`single-element event collection survived near: ${snippet}`)}
if(!/\$\$\s*\(\s*(['"`])\[data-event\]\1\s*\)\s*\.forEach/.test(s))fail('collection-safe event detail binding missing after normalization');

const close=s.lastIndexOf('})();');if(close<0)fail('app IIFE close missing');
const bridge=`
try{window.__AXIS_818_DETAIL_ATOMIC__={version:'8.18',owner:'app.js',router:'canonical-dom0',guard:'router-prepaint',commitOwner:'atomic-handoff',retainPreviousUntilReady:true,collectionHelper:'$$'}}catch(e){}
`;
s=s.slice(0,close)+bridge+s.slice(close);
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)};
fs.writeFileSync(FILE,s);
console.log(`[AXIS 8.18 detail atomic seal] PASS · single canonical DOM0 router · collection-safe $$ binding · ${collectionRepairs} inherited single-helper repairs · in-owner prepaint guard · staged atomic commit sole detail owner`);
