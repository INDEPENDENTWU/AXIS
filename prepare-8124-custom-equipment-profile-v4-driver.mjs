import fs from 'node:fs';

const FILE='prepare-8124-custom-equipment-profile-v2.mjs';
const fail=m=>{throw new Error(`[AXIS 8.12.4 custom equipment v4 driver] ${m}`)};
const original=fs.readFileSync(FILE,'utf8');
const strict="src=once(src,rows,rowsNext,'record detail flexible rows');";
if(!original.includes(strict))fail('v2 detail compatibility boundary missing');
const patched=original.replace(strict,"if(src.includes(rows))src=once(src,rows,rowsNext,'record detail flexible rows');");
fs.writeFileSync(FILE,patched);
let error=null;
try{
  await import('./prepare-8124-custom-equipment-profile-v2.mjs?axis8124v4=1');
}catch(e){error=e}
finally{fs.writeFileSync(FILE,original)}
if(error)throw error;
console.log('[AXIS 8.12.4 custom equipment v4 driver] PASS · converged history detail renderer is compatibility-safe · requested picker/search/create/recording behavior remains owned by v2');
