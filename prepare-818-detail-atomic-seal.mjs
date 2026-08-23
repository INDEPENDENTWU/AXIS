import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.18 detail atomic seal] ${m}`)};
if(!fs.existsSync(FILE))fail('missing app.js');
let s=fs.readFileSync(FILE,'utf8');

/* 8.9/8.10.2 already owns the correct data path: openEvent stages the complete
   event detail, waits for local media/decode, then axis89CommitDetail commits the
   title + body synchronously inside one animation-frame callback. Keep that router
   intact. The only remaining exposure was the already-visible session sheet during
   the asynchronous staging window. A capture-phase presentation guard hides that
   existing sheet until the canonical atomic commit removes axis884Prepaint. */
const legacyA="$$('[data-event]').forEach(b=>b.onclick=()=>openEvent(b.dataset.event));";
const legacyB="$('[data-event]').forEach(b=>b.onclick=()=>openEvent(b.dataset.event));";
const doubleCount=s.split(legacyA).length-1;
const withoutDouble=s.split(legacyA).join('');
const singleCount=withoutDouble.split(legacyB).length-1;
if(doubleCount+singleCount!==1)fail(`canonical event detail router expected one compiler shape, found ${doubleCount}/${singleCount}`);
if(!s.includes("owner:'atomic-handoff'"))fail('canonical atomic detail commit owner missing');
if(!s.includes('async function openEvent(id){'))fail('canonical openEvent missing');
if(!s.includes("sheet?.classList.remove('axis884Prepaint')"))fail('atomic commit does not release prepaint guard');

const close=s.lastIndexOf('})();');if(close<0)fail('app IIFE close missing');
const bridge=`
function axis818BindAtomicDetailGuard(){
 if(D.documentElement.dataset.axis818DetailGuard==='1')return;
 D.documentElement.dataset.axis818DetailGuard='1';
 D.addEventListener('click',function(e){
  var row=e.target&&e.target.closest?e.target.closest('[data-event]'):null;
  if(!row||!row.closest||!row.closest('#detail'))return;
  var sheet=D.querySelector('#detailSheet');
  if(!sheet||!sheet.classList.contains('show'))return;
  sheet.classList.add('axis884Prepaint');
 },true)
}
axis818BindAtomicDetailGuard();
try{window.__AXIS_818_DETAIL_ATOMIC__={version:'8.18',owner:'app.js',router:'canonical-existing',guard:'capture-prepaint',commitOwner:'atomic-handoff',retainPreviousUntilReady:true}}catch(e){}
`;
s=s.slice(0,close)+bridge+s.slice(close);
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)};
fs.writeFileSync(FILE,s);
console.log(`[AXIS 8.18 detail atomic seal] PASS · canonical event router retained · capture prepaint guard · staged atomic commit remains sole detail owner · compiler shape ${doubleCount?'collection':'single'}`);
