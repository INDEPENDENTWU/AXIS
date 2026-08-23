import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.18 detail atomic seal] ${m}`)};
if(!fs.existsSync(FILE))fail('missing app.js');
let s=fs.readFileSync(FILE,'utf8');

function functionRange(src,signature){
 const start=src.indexOf(signature);if(start<0)fail(`${signature} missing`);if(src.indexOf(signature,start+signature.length)>=0)fail(`${signature} duplicated`);
 const brace=src.indexOf('{',start+signature.length-1);if(brace<0)fail(`${signature} brace missing`);let depth=0,quote='',esc=false,line=false,block=false,end=-1;
 for(let i=brace;i<src.length;i++){
  const ch=src[i],next=src[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}
  if(quote){if(esc){esc=false;continue}if(ch==='\\'){esc=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==="'"||ch==='"'||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++;else if(ch==='}'){depth--;if(depth===0){end=i+1;break}}
 }
 if(end<0)fail(`${signature} closing brace missing`);return{start,end}
}

/* Only the executable bindDynamic owner is converged. Historical contract strings
   elsewhere are ignored. `$` is a substring of `$$`, so single-helper counts are
   measured only after removing the corresponding collection-helper shape. */
const range=functionRange(s,'function bindDynamic()');
let bind=s.slice(range.start,range.end);
const plainDouble="$$('[data-event]').forEach(b=>b.onclick=()=>openEvent(b.dataset.event));";
const plainSingle="$('[data-event]').forEach(b=>b.onclick=()=>openEvent(b.dataset.event));";
const guardedDouble="$$('[data-event]').forEach(b=>b.onclick=()=>{const sheet=$('#detailSheet');if(sheet?.classList.contains('show'))sheet.classList.add('axis884Prepaint');return openEvent(b.dataset.event)});";
const guardedSingle="$('[data-event]').forEach(b=>b.onclick=()=>{const sheet=$('#detailSheet');if(sheet?.classList.contains('show'))sheet.classList.add('axis884Prepaint');return openEvent(b.dataset.event)});";
const pd=bind.split(plainDouble).length-1;
const ps=bind.split(plainDouble).join('').split(plainSingle).length-1;
const gd=bind.split(guardedDouble).length-1;
const gs=bind.split(guardedDouble).join('').split(guardedSingle).length-1;
const counts=[pd,ps,gd,gs],total=counts.reduce((a,b)=>a+b,0);
if(total!==1)fail(`bindDynamic event router expected one compiler shape, found ${counts.join('/')}: ${bind.replace(/\s+/g,' ')}`);
if(!s.includes("owner:'atomic-handoff'"))fail('canonical atomic detail commit owner missing');
if(!s.includes('async function openEvent(id){'))fail('canonical openEvent missing');
if(!s.includes("sheet?.classList.remove('axis884Prepaint')"))fail('atomic commit does not release prepaint guard');
if(pd)bind=bind.replace(plainDouble,guardedDouble);else if(ps)bind=bind.replace(plainSingle,guardedDouble);else if(gs)bind=bind.replace(guardedSingle,guardedDouble);
if((bind.split(guardedDouble).length-1)!==1)fail('guarded collection router not singular after convergence');
const survivor=/(^|[^$])\$\s*\(\s*(['"`])\[data-event\]\2\s*\)\s*\.forEach/g;
if(survivor.test(bind))fail(`single-element event collection survived in bindDynamic: ${bind.replace(/\s+/g,' ')}`);
s=s.slice(0,range.start)+bind+s.slice(range.end);

const close=s.lastIndexOf('})();');if(close<0)fail('app IIFE close missing');
if(s.includes('__AXIS_818_DETAIL_ATOMIC__'))fail('detail atomic diagnostic duplicated');
const bridge=`
try{window.__AXIS_818_DETAIL_ATOMIC__={version:'8.18',owner:'app.js',router:'canonical-dom0',guard:'router-prepaint',commitOwner:'atomic-handoff',retainPreviousUntilReady:true,collectionHelper:'$$'}}catch(e){}
`;
s=s.slice(0,close)+bridge+s.slice(close);
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)};
fs.writeFileSync(FILE,s);
console.log(`[AXIS 8.18 detail atomic seal] PASS · bindDynamic-only canonical collection router · guarded prepaint · staged atomic commit sole detail owner · input-shape ${counts.findIndex(Boolean)}`);
