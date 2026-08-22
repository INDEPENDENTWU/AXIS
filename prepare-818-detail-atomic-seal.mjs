import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.18 detail atomic seal] ${m}`)};
if(!fs.existsSync(FILE))fail('missing app.js');
let s=fs.readFileSync(FILE,'utf8');

/* The 8.9/8.10.2 openEvent implementation already stages a complete event detail
   and commits title + body in one synchronous animation-frame callback. Historical
   bindDynamic still attached a DOM0 router to every [data-event] row. Converge that
   routing to one app-scope capture owner so no legacy handler can write a new title
   before the canonical staged body is ready. */
const legacyA="$$('[data-event]').forEach(b=>b.onclick=()=>openEvent(b.dataset.event));";
const legacyB="$('[data-event]').forEach(b=>b.onclick=()=>openEvent(b.dataset.event));";
const a=s.split(legacyA).length-1,b=s.split(legacyB).length-1;
if(a+b!==1)fail(`legacy event detail DOM0 router expected once, found ${a}/${b}`);
s=s.replace(a?legacyA:legacyB,'');
if(s.includes("onclick=()=>openEvent(b.dataset.event)"))fail('legacy event detail DOM0 router survived');
if(!s.includes("owner:'atomic-handoff'"))fail('canonical atomic detail commit owner missing');
if(!s.includes('async function openEvent(id){'))fail('canonical openEvent missing');

const close=s.lastIndexOf('})();');if(close<0)fail('app IIFE close missing');
const bridge=`
function axis818BindAtomicDetailOwner(){
 if(D.documentElement.dataset.axis818DetailOwner==='1')return;
 D.documentElement.dataset.axis818DetailOwner='1';
 D.addEventListener('click',function(e){
  var row=e.target&&e.target.closest?e.target.closest('[data-event]'):null;
  if(!row||!row.dataset.event)return;
  e.preventDefault();e.stopImmediatePropagation();
  try{void openEvent(row.dataset.event)}catch(err){console.error('[AXIS detail owner]',err)}
 },true)
}
axis818BindAtomicDetailOwner();
try{window.__AXIS_818_DETAIL_ATOMIC__={version:'8.18',owner:'app.js',router:'single-capture',commitOwner:'atomic-handoff',retainPreviousUntilReady:true}}catch(e){}
`;
s=s.slice(0,close)+bridge+s.slice(close);
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)};
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.18 detail atomic seal] PASS · one delegated event router · staged openEvent retained · legacy DOM0 route retired');
