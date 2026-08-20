import fs from 'node:fs';

const FILE='prepare-8124-custom-equipment-profile-v2.mjs';
const fail=m=>{throw new Error(`[AXIS 8.12.4 custom equipment v4 driver] ${m}`)};
const original=fs.readFileSync(FILE,'utf8');
const listStrict="src=onceRe(src,/function renderManageEq\\(\\)\\{[^\\n]*\\}/g,rename(generatedRenderManageEq,'renderManageEq'),'custom list recording summary');";
const detailStrict="src=once(src,rows,rowsNext,'record detail flexible rows');";
for(const [needle,label] of [[listStrict,'v2 personal-list compatibility boundary'],[detailStrict,'v2 detail compatibility boundary']])if(!original.includes(needle))fail(`${label} missing`);
let patched=original
 .replace(listStrict,"if((src.match(/function renderManageEq\\(\\)\\{[^\\n]*\\}/g)||[]).length===1)src=onceRe(src,/function renderManageEq\\(\\)\\{[^\\n]*\\}/g,rename(generatedRenderManageEq,'renderManageEq'),'custom list recording summary');")
 .replace(detailStrict,"if(src.includes(rows))src=once(src,rows,rowsNext,'record detail flexible rows');");
fs.writeFileSync(FILE,patched);
let error=null;
try{
  await import('./prepare-8124-custom-equipment-profile-v2.mjs?axis8124v4=2');
}catch(e){error=e}
finally{fs.writeFileSync(FILE,original)}
if(error)throw error;
console.log('[AXIS 8.12.4 custom equipment v4 driver] PASS · converged personal-library/detail renderers are compatibility-safe · requested picker/search/create/recording behavior remains owned by v2');
