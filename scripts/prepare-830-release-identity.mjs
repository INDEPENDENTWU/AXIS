import fs from 'node:fs';
const fail=s=>{throw Error('[AXIS 8.30 release identity] '+s)};
const read=f=>fs.readFileSync(f,'utf8'),write=(f,s)=>fs.writeFileSync(f,s);
const once=(f,a,b,label)=>{let s=read(f);const count=s.split(a).length-1;if(count!==1)fail(label+' expected one exact anchor, saw '+count);write(f,s.replace(a,b))};
const contract=JSON.parse(read('release-contract.json'));
if(contract.publicVersion!=='8.29'||contract.stableBaseVersion!=='8.29')fail('expected inherited 8.29 build identity');
contract.publicVersion='8.30';contract.stableBaseVersion='8.30';write('release-contract.json',JSON.stringify(contract,null,2)+'\n');
for(const [file,from,to] of [
 ['build-hardened.mjs',"const VERSION='8.29';","const VERSION='8.30';"],
 ['postbuild-features-hardened.mjs',"const TARGET_VERSION='8.29';","const TARGET_VERSION='8.30';"],
 ['postbuild-88-canonical.mjs',"const VERSION='8.29';","const VERSION='8.30';"]
])once(file,from,to,file+' version');
{
 const f='postbuild-88-canonical.mjs';let s=read(f);
 for(const [from,to] of [['data-axis-runtime="canonical-8.29"','data-axis-runtime="canonical-8.30"'],["document.documentElement.dataset.axisCanonical='8.29';","document.documentElement.dataset.axisCanonical='8.30';"]]){
  if(!s.includes(from))fail('missing canonical identity '+from);
  s=s.replace(from,to);
 }
 write(f,s);
}
const excluded=new Set([
 'scripts/axis-version-authority-contract.mjs','scripts/axis-repository-contract.mjs',
 'scripts/axis-production-governance-contract.mjs','scripts/axis-830-object-identity-audit.mjs',
 'scripts/axis-829-governance-compat.mjs','scripts/axis-828-governance-compat.mjs',
 'scripts/axis-827-governance-compat.mjs','scripts/axis-8261-governance-compat.mjs',
 'scripts/axis-8251-governance-compat.mjs','scripts/prepare-829-release-identity.mjs',
 'postbuild-829-recording-friction-contract.mjs'
]);
let changed=0;
for(const file of [...fs.readdirSync('.').filter(x=>/^postbuild-.*\.mjs$/.test(x)),...fs.readdirSync('scripts').filter(x=>x.endsWith('.mjs')).map(x=>'scripts/'+x)]){
 if(excluded.has(file)||file.startsWith('scripts/prepare-830'))continue;
 let src=read(file),next=src;
 next=next.replaceAll("window.__AXIS_RELEASE__==='8.29'","window.__AXIS_RELEASE__==='8.30'");
 next=next.replaceAll("assert.equal(x.release,'8.29')","assert.equal(x.release,'8.30')");
 next=next.replaceAll("window.__AXIS_RELEASE__),'8.29'","window.__AXIS_RELEASE__),'8.30'");
 for(const field of ['info.version','info.baseVersion','contract.publicVersion','contract.stableBaseVersion','manifest.version','manifest.baseVersion','candidate.version','candidate.baseVersion','EXPECTED','CURRENT_VERSION','VERSION']){
  next=next.replaceAll(field+"!=='8.29'",field+"!=='8.30'");
  next=next.replaceAll(field+"==='8.29'",field+"==='8.30'");
  next=next.replaceAll(field+",'8.29'",field+",'8.30'");
 }
 next=next.replaceAll("'8.29'].includes","'8.29','8.30'].includes");
 next=next.replaceAll("'8.29'];","'8.29','8.30'];");
 if(next!==src){write(file,next);changed++}
}
if(changed<10)fail('8.30 inherited release checks suspiciously small: '+changed);
console.log('[AXIS 8.30 release identity] 8.29 → 8.30 · '+changed+' inherited check files updated, previous certificate untouched');
