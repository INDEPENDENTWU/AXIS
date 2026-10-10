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
fs.writeFileSync(path,code);
console.log('[AXIS inherited Active probe] active assertion retained; diagnostic installed after release test alignment');
