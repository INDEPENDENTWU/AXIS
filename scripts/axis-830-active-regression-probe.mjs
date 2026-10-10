import fs from 'node:fs';
const version=JSON.parse(fs.readFileSync('release-contract.json','utf8')).publicVersion;
if(version!=='8.30'){console.log('[AXIS inherited Active probe] skip for '+version);process.exit(0)}
const path='scripts/axis-882-smoke.mjs';
let code=fs.readFileSync(path,'utf8');
const token="await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show'),undefined,{timeout:2400});";
const count=code.split(token).length-1;
if(count!==1)throw Error('[AXIS inherited Active probe] expected one real presentation assertion; found '+count);
const prefix="console.log('[AXIS 8.30 Active state]',JSON.stringify(await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}');return{events:s.active?.events?.map(e=>({id:e.id,eq:e.equipmentId,name:e.name}))||[],activeId:s.active?.id||null,sessions:s.sessions?.length||0,activity:Object.fromEntries(Object.entries(m.events||{}).slice(-3).map(([k,v])=>[k,v?.activity?.status])),now:document.querySelector('#v87Now')?.className||null,home:window.__AXIS_HOME_STATE__,sheets:[...document.querySelectorAll('.sheetWrap.show')].map(x=>x.id)}})));\n";
code=code.replace(token,prefix+token);

const vision="await page.waitForFunction(()=>{const v=window.__AXIS_LOCAL_VISION__?.snapshot?.()";
if(!code.includes(vision))throw Error('[AXIS inherited Local Vision probe] current vision assertion missing');
// The inherited 8.9 visual-memory smoke expects a pre-8.30 family identity.
// AXIS 8.30 must assert the *actual* canonical Object ID learned from the same
// user-confirmed item, not silently regress to the former 'lat' family.
for(const [oldValue,newValue] of [
  ["v.last.best?.id==='lat'","v.last.best?.id==='lat-pulldown'"],
  ["x.equipmentId==='lat'&&x.sig?.full","x.equipmentId==='lat-pulldown'&&x.sig?.full"],
  ["vision?.last?.best?.id,'lat'","vision?.last?.best?.id,'lat-pulldown'"]
]){
  const count=code.split(oldValue).length-1;
  if(count!==1)throw Error('[AXIS 8.30 Local Vision identity] expected one old assertion '+oldValue+'; observed '+count);
  code=code.replace(oldValue,newValue);
}
const diag="console.log('[AXIS 8.30 Local Vision diagnostic]',JSON.stringify(await page.evaluate(()=>({vision:window.__AXIS_LOCAL_VISION__?.snapshot?.(),selected:window.__AXIS_SELECTED_EQUIPMENT__?.(),equipment:document.querySelector('#equipmentName')?.textContent,status:document.querySelector('#aiStatus')?.textContent,recording:JSON.parse(localStorage.getItem('axis_v60_state')||'{}').active?.events?.map(e=>({id:e.id,equipmentId:e.equipmentId}))||[]}))));\n";
code=code.replace(vision,diag+vision);
console.log('[AXIS inherited regression compiled lines 62-77]\n'+code.split('\n').slice(61,77).map((x,i)=>(i+62)+': '+x.slice(0,470)).join('\n'));
fs.writeFileSync(path,code);
console.log('[AXIS inherited Active probe] active assertion retained; diagnostic installed after release test alignment');
