import fs from 'node:fs';
const fail=m=>{throw Error('[AXIS 8.31 release identity] '+m)};
const read=f=>fs.readFileSync(f,'utf8'),write=(f,s)=>fs.writeFileSync(f,s);
const once=(f,a,b)=>{const s=read(f),n=s.split(a).length-1;if(n!==1)fail(f+' exact version anchor expected once; found '+n);write(f,s.replace(a,b))};
const from='8.30',to='8.31';
const contract=JSON.parse(read('release-contract.json'));
if(contract.publicVersion!==from||contract.stableBaseVersion!==from)fail('8.30 certified predecessor build required');
contract.publicVersion=to;contract.stableBaseVersion=to;write('release-contract.json',JSON.stringify(contract,null,2)+'\n');
for(const [f,a,b] of [['build-hardened.mjs',"const VERSION='8.30';","const VERSION='8.31';"],['postbuild-features-hardened.mjs',"const TARGET_VERSION='8.30';","const TARGET_VERSION='8.31';"],['postbuild-88-canonical.mjs',"const VERSION='8.30';","const VERSION='8.31';"]])once(f,a,b);
once('postbuild-88-canonical.mjs','data-axis-runtime="canonical-8.30"','data-axis-runtime="canonical-8.31"');
once('postbuild-88-canonical.mjs',"document.documentElement.dataset.axisCanonical='8.30';","document.documentElement.dataset.axisCanonical='8.31';");
const excluded=new Set(['scripts/axis-version-authority-contract.mjs','scripts/axis-production-governance-contract.mjs','scripts/axis-repository-contract.mjs','scripts/axis-829-governance-compat.mjs','scripts/axis-828-governance-compat.mjs','scripts/axis-827-governance-compat.mjs','scripts/axis-8261-governance-compat.mjs','scripts/axis-8251-governance-compat.mjs','scripts/prepare-829-sealed-governance.mjs','scripts/prepare-829-governance-state.mjs','scripts/prepare-830-governance-state.mjs','scripts/axis-830-object-identity-audit.mjs','scripts/prepare-831-release-identity.mjs','scripts/prepare-831-governance-state.mjs','scripts/prepare-831-playable-integration.mjs','scripts/axis-831-playable-execution-smoke.mjs','scripts/axis-831-playable-smoke.mjs','scripts/axis-831-playable-bridge-contract.mjs','scripts/axis-831-playable-browser-smoke.mjs','postbuild-829-recording-friction-contract.mjs']);
let touched=0;
for(const f of [...fs.readdirSync('.').filter(n=>n.startsWith('postbuild-')&&n.endsWith('.mjs')),...fs.readdirSync('scripts').filter(n=>n.endsWith('.mjs')).map(n=>'scripts/'+n)]){
 if(excluded.has(f)||f.startsWith('scripts/prepare-8'))continue;
 const src=read(f);let dst=src;
 dst=dst.replaceAll("window.__AXIS_RELEASE__==='8.30'","window.__AXIS_RELEASE__==='8.31'");
 dst=dst.replaceAll("window.__AXIS_RELEASE__),'8.30'","window.__AXIS_RELEASE__),'8.31'");
 dst=dst.replaceAll("assert.equal(x.release,'8.30')","assert.equal(x.release,'8.31')");
 for(const field of ['info.version','info.baseVersion','contract.publicVersion','contract.stableBaseVersion','manifest.version','manifest.baseVersion','candidate.version','candidate.baseVersion','EXPECTED','CURRENT_VERSION','VERSION','boot.release']){
  dst=dst.replaceAll(field+"!=='8.30'",field+"!=='8.31'");
  dst=dst.replaceAll(field+"==='8.30'",field+"==='8.31'");
  dst=dst.replaceAll(field+",'8.30'",field+",'8.31'");
 }
 dst=dst.replaceAll("'8.30'].includes","'8.30','8.31'].includes");
 dst=dst.replaceAll("'8.30'];","'8.30','8.31'];");
 if(dst!==src){write(f,dst);touched++}
}
if(touched<4)fail('insufficient inherited current-release test coverage '+touched);
console.log('[AXIS 8.31 release] 8.30 → 8.31, '+touched+' mutable current-release contracts advanced; immutable provider and historical certificates untouched');
