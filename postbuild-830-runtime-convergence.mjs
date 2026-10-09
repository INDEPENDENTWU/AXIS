import fs from 'node:fs';
const fail=m=>{throw Error('[AXIS 8.30 runtime convergence] '+m)};
const p='axis-core.js';let code=fs.readFileSync(p,'utf8');const changes=[];
const one=(from,to,label)=>{
 const count=code.split(from).length-1;
 if(count>1)fail('ambiguous '+label+' expected at most one, found '+count);
 if(count===1){code=code.replace(from,to);changes.push(label)}
};
one('pickId:x.baseId||x.id','pickId:x.id','native ranked-search exact ID');
one('const target=item.baseId||item.id','const target=item.id','native library exact ID');
one('id:lib.baseId||lib.id','id:lib.id','classic recorder native exact ID');
one('lib.find(e=>e.baseId===id)','null','ambiguous baseId resolver removal');
if(changes.length<1)fail('expected a bounded late inherited native-identity route to converge; upstream source or build chain changed');
for(const forbidden of ['pickId:x.baseId||x.id','const target=item.baseId||item.id','id:lib.baseId||lib.id','lib.find(e=>e.baseId===id)'])if(code.includes(forbidden))fail('unresolved identity route '+forbidden);
try{new Function(code)}catch(e){fail('assembled canonical runtime syntax '+e.message)}
fs.writeFileSync(p,code);
console.log('[AXIS 8.30 runtime convergence] PASS · '+changes.join(' · ')+' · single assembled runtime preserved');
