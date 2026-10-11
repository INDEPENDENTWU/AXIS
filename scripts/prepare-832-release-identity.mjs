import fs from 'node:fs';
const fail=m=>{throw Error('[AXIS 8.32 release identity] '+m)};
const read=f=>fs.readFileSync(f,'utf8'),write=(f,s)=>fs.writeFileSync(f,s);
const one=(f,a,b)=>{const s=read(f),n=s.split(a).length-1;if(n!==1)fail('expected one current version anchor in '+f+'; found '+n);write(f,s.replace(a,b))};
const from='8.31',to='8.32';
const contract=JSON.parse(read('release-contract.json'));
if(contract.publicVersion!==from||contract.stableBaseVersion!==from)fail('8.31 certified predecessor build required');
contract.publicVersion=to;contract.stableBaseVersion=to;write('release-contract.json',JSON.stringify(contract,null,2)+'\n');
for(const [f,a,b] of [['build-hardened.mjs',"const VERSION='8.31';","const VERSION='8.32';"],['postbuild-features-hardened.mjs',"const TARGET_VERSION='8.31';","const TARGET_VERSION='8.32';"],['postbuild-88-canonical.mjs',"const VERSION='8.31';","const VERSION='8.32';"]])one(f,a,b);
one('postbuild-88-canonical.mjs','data-axis-runtime="canonical-8.31"','data-axis-runtime="canonical-8.32"');
one('postbuild-88-canonical.mjs',"document.documentElement.dataset.axisCanonical='8.31';","document.documentElement.dataset.axisCanonical='8.32';");
// This is generated current-release code, not modification of inherited 8.31 sources.
const excluded=new Set(['scripts/axis-version-authority-contract.mjs','scripts/axis-production-governance-contract.mjs','scripts/axis-repository-contract.mjs','scripts/prepare-831-release-identity.mjs','scripts/prepare-831-governance-state.mjs','scripts/prepare-831-playable-integration.mjs','scripts/axis-831-playable-execution-smoke.mjs','scripts/axis-831-playable-smoke.mjs','scripts/axis-831-playable-bridge-contract.mjs','scripts/axis-831-playable-browser-smoke.mjs','postbuild-831-playable-contract.mjs']);
let count=0;
for(const f of [...fs.readdirSync('.').filter(n=>n.startsWith('postbuild-')&&n.endsWith('.mjs')),...fs.readdirSync('scripts').filter(n=>n.endsWith('.mjs')).map(n=>'scripts/'+n)]){
 if(excluded.has(f)||f.startsWith('scripts/prepare-8'))continue;
 const src=read(f);let dst=src;
 dst=dst.replaceAll("window.__AXIS_RELEASE__==='8.31'","window.__AXIS_RELEASE__==='8.32'");
 dst=dst.replaceAll("window.__AXIS_RELEASE__),'8.31'","window.__AXIS_RELEASE__),'8.32'");
 dst=dst.replaceAll("assert.equal(x.release,'8.31')","assert.equal(x.release,'8.32')");
 for(const field of ['info.version','info.baseVersion','contract.publicVersion','contract.stableBaseVersion','manifest.version','manifest.baseVersion','candidate.version','candidate.baseVersion','EXPECTED','CURRENT_VERSION','VERSION','boot.release']){
  dst=dst.replaceAll(field+"!=='8.31'",field+"!=='8.32'");
  dst=dst.replaceAll(field+"==='8.31'",field+"==='8.32'");
  dst=dst.replaceAll(field+",'8.31'",field+",'8.32'");
 }
 dst=dst.replaceAll("'8.31'].includes","'8.31','8.32'].includes");
 dst=dst.replaceAll("'8.31'];","'8.31','8.32'];");
 if(dst!==src){write(f,dst);count++}
}
// Inherited 8.31 contract runs earlier than the new 8.32 postbuild proof.
{
 const f='postbuild-831-playable-contract.mjs';let src=read(f);
 const a="if(m.version!=='8.31'||m.baseVersion!=='8.31'||m.architecture!=='canonical-single-runtime')";
 if(!src.includes(a))fail('8.31 inherited postbuild identity drift');
 src=src.replace(a,"if(!['8.31','8.32'].includes(m.version)||m.baseVersion!==m.version||m.architecture!=='canonical-single-runtime')");
 const b="if(!productDecision&&!sealedDecision)fail";
 if(!src.includes(b))fail('8.31 inherited decision drift');
 src=src.replace(b,"const nextDecision=d.sequence===33&&d.base_release==='8.31'&&d.release==='8.32'&&d.decision==='bump'&&d.change_class==='product-runtime';\nif(!productDecision&&!sealedDecision&&!nextDecision)fail");
 write(f,src);
}
{
 const f='scripts/axis-831-playable-browser-smoke.mjs';let s=read(f);
 if(!s.includes("window.__AXIS_RELEASE__==='8.31'"))fail('inherited browser version check drift');
 s=s.replaceAll("window.__AXIS_RELEASE__==='8.31'","window.__AXIS_RELEASE__==='8.32'");
 write(f,s);
}
if(count<3)fail('current release gate update coverage suspiciously small '+count);
console.log('[AXIS 8.32 release] 8.31 → 8.32 · '+count+' mutable current-release assertions updated; all immutable production proofs retained');
