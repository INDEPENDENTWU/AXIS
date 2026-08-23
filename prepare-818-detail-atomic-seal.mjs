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
   so normalize every generated [data-event] collection receiver to `$$` first;
   this also covers inherited compiler variants that are not byte-identical to the
   original router string. */
let collectionRepairs=0;
s=s.replace(/(^|[^$])\$\('\[data-event\]'\)\.forEach/g,(m,prefix)=>{collectionRepairs++;return `${prefix}$$('[data-event]').forEach`});

const plain="$$('[data-event]').forEach(b=>b.onclick=()=>openEvent(b.dataset.event));";
const guarded="$$('[data-event]').forEach(b=>b.onclick=()=>{const sheet=$('#detailSheet');if(sheet?.classList.contains('show'))sheet.classList.add('axis884Prepaint');return openEvent(b.dataset.event)});";
const plainCount=s.split(plain).length-1;
const guardedCount=s.split(guarded).length-1;
if(plainCount+guardedCount!==1)fail(`canonical event detail router expected one owner, found plain=${plainCount} guarded=${guardedCount}`);
if(!s.includes("owner:'atomic-handoff'"))fail('canonical atomic detail commit owner missing');
if(!s.includes('async function openEvent(id){'))fail('canonical openEvent missing');
if(!s.includes("sheet?.classList.remove('axis884Prepaint')"))fail('atomic commit does not release prepaint guard');
if(plainCount)s=s.replace(plain,guarded);
if((s.split('return openEvent(b.dataset.event)').length-1)!==1)fail('guarded canonical router not singular');
if(/(^|[^$])\$\('\[data-event\]'\)\.forEach/.test(s))fail('single-element event router survived collection normalization');
if((s.split("$$('[data-event]').forEach").length-1)<1)fail('collection-safe event detail binding missing after normalization');

const close=s.lastIndexOf('})();');if(close<0)fail('app IIFE close missing');
const bridge=`
try{window.__AXIS_818_DETAIL_ATOMIC__={version:'8.18',owner:'app.js',router:'canonical-dom0',guard:'router-prepaint',commitOwner:'atomic-handoff',retainPreviousUntilReady:true,collectionHelper:'$$'}}catch(e){}
`;
s=s.slice(0,close)+bridge+s.slice(close);
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)};
fs.writeFileSync(FILE,s);
console.log(`[AXIS 8.18 detail atomic seal] PASS · single canonical DOM0 router · collection-safe $$ binding · ${collectionRepairs} inherited single-helper repairs · in-owner prepaint guard · staged atomic commit sole detail owner`);
