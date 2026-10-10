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
{
 const signature='function axis8124CatalogItems()',from=code.indexOf(signature),end=from<0?-1:code.indexOf('function axis8124CatalogRanked(',from);
 if(from<0||end<0||code.indexOf(signature,from+signature.length)>=0)fail('one canonical catalog projection function required');
 let segment=code.slice(from,end);
 const old=/for\s*\(\s*const x of LIB\s*\)/g;
 const live=/for\s*\(\s*const x of \(window\.__AXIS_873_LIBRARY__\s*\|\|\s*LIB\)\s*\)/g;
 const originals=[...segment.matchAll(old)].length,converged=[...segment.matchAll(live)].length;
 if(originals===1&&converged===0){segment=segment.replace(old,'for(const x of (window.__AXIS_873_LIBRARY__||LIB))');changes.push('complete live canonical library');}
 else if(originals!==0||converged!==1)fail('catalog projection loop not uniquely identified '+JSON.stringify({originals,converged,excerpt:segment.slice(0,850)}));
 if(!segment.includes('pickId:x.id'))fail('catalog must preserve canonical ID');
 code=code.slice(0,from)+segment+code.slice(end);
}

if(changes.length<1)fail('expected a bounded late inherited native-identity route to converge; upstream source or build chain changed');
for(const forbidden of ['pickId:x.baseId||x.id','const target=item.baseId||item.id','id:lib.baseId||lib.id','lib.find(e=>e.baseId===id)'])if(code.includes(forbidden))fail('unresolved identity route '+forbidden);
try{new Function(code)}catch(e){fail('assembled canonical runtime syntax '+e.message)}
fs.writeFileSync(p,code);
console.log('[AXIS 8.30 runtime convergence] PASS · '+changes.join(' · ')+' · single assembled runtime preserved');
