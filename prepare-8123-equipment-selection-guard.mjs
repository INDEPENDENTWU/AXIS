import fs from 'node:fs';

const FILE='v874-professional.js';
const fail=m=>{throw new Error(`[AXIS 8.12.3 equipment selection guard] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
const from="const ed=e.target.closest('[data-edit-eq]');if(ed){createContext='manage';";
const to="const ed=e.target.closest('[data-edit-eq]');if(ed&&!ed.closest('#manageEqList')){createContext='manage';";
const count=src.split(from).length-1;
if(count!==1)fail(`legacy personal-equipment edit interception expected once, found ${count}`);
src=src.replace(from,to);
if(!src.includes("ed&&!ed.closest('#manageEqList')"))fail('personal equipment click-owner guard missing');
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.3 equipment selection guard] PASS · inline personal-library rows use app owner; legacy custom editor interception remains elsewhere');
