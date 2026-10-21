// AXIS 8.33 · explicit product version following assembled, inherited 8.32 source.
import fs from 'node:fs';
const FROM='8.32',VERSION='8.33';
const read=p=>fs.readFileSync(p,'utf8'),write=(p,s)=>fs.writeFileSync(p,s);
const fail=m=>{throw Error('[AXIS 8.33 version] '+m)};
function once(path,a,b){
 const src=read(path);if(src.split(a).length!==2)fail(path+' expected exactly one '+a);
 write(path,src.replace(a,b));
}
const staged='.axis-833-approved-decision.json';
if(!fs.existsSync(staged))fail('approved version decision not preserved by bootstrap');
const approved=read(staged);
const interim=JSON.parse(read('governance/version-decision.json'));
if(interim.sequence!==33||interim.release!=='8.32')fail('8.32 inherited version stage not completed');
const decision=JSON.parse(approved);
write('governance/version-decision.json',approved);
fs.unlinkSync(staged);
if(decision.sequence!==34||decision.base_release!=='8.31'||decision.release!==VERSION||
 decision.decision!=='bump'||decision.change_class!=='product-runtime')
 fail('sequence-34 Product Authority missing; never infer or auto-grant a release');
let rc=JSON.parse(read('release-contract.json'));
if(rc.publicVersion!==FROM||rc.stableBaseVersion!==FROM)fail('8.32 prebuilt predecessor missing');
rc.publicVersion=VERSION;rc.stableBaseVersion=VERSION;
write('release-contract.json',JSON.stringify(rc,null,2)+'\n');
for(const [p,a,b] of [
 ['build-hardened.mjs',"const VERSION='8.32';","const VERSION='8.33';"],
 ['postbuild-features-hardened.mjs',"const TARGET_VERSION='8.32';","const TARGET_VERSION='8.33';"],
 ['postbuild-88-canonical.mjs',"const VERSION='8.32';","const VERSION='8.33';"],
 ['postbuild-88-canonical.mjs','data-axis-runtime="canonical-8.32"','data-axis-runtime="canonical-8.33"'],
 ['postbuild-88-canonical.mjs',"document.documentElement.dataset.axisCanonical='8.32';","document.documentElement.dataset.axisCanonical='8.33';"]
])once(p,a,b);
// Preserve sealed 8.31 and inherited 8.32 contracts as documented historical
// acceptance. This *new* release layer acknowledges their forward compatibility.
{
 const p='postbuild-831-playable-contract.mjs';let s=read(p);
 const a="['8.31','8.32'].includes(m.version)";
 if(!s.includes(a))fail('sealed 8.31 contract version whitelist changed');
 s=s.replace(a,"['8.31','8.32','8.33'].includes(m.version)");
 const anchor="if(!productDecision&&!sealedDecision&&!nextDecision)fail";
 if(!s.includes(anchor))fail('sealed 8.31 decision guard changed');
 s=s.replace(anchor,"const successor833=d.sequence===34&&d.base_release==='8.31'&&d.release==='8.33'&&d.decision==='bump'&&d.change_class==='product-runtime';\nif(!productDecision&&!sealedDecision&&!nextDecision&&!successor833)fail");
 write(p,s);
}
// 8.8.2 prohibits synthetic unprompted tones; the later 8.10.3 session-duration
// reminder is a separately admitted exception. Carry forward exactly that
// inherited sound distinction for 8.33; do not delete the forbidden-cue test.
{
 const p='postbuild-882-contract.mjs',src=read(p);
 const old=/const sessionDurationExtensionCurrent=[^;]+;/;
 const m=src.match(old);if(!m)fail('sound-boundary compatibility anchor drift');
 if(m[0].includes("8.33"))fail('session reminder already advanced unexpectedly');
 write(p,src.replace(old,m[0].replace(/;$/,"||CURRENT_VERSION==='8.33';")));
}
// The 8.9.1 inherited rich-phrase check follows the modern 8.10+ content
// while retaining its stricter phrase/material proof for every newer release.
{
 const p='postbuild-891-contract.mjs',src=read(p);
 const guard="if(!(version==='8.9.1'||version.startsWith('8.10')";
 const modern="const modern=version.startsWith('8.10')";
 if(!src.includes(guard)||!src.includes(modern))fail('8.9.1 inherited rich-language gates changed');
 let out=src.replace(guard,guard+"||version==='8.33'")
            .replace(modern,modern+"||version==='8.33'");
 write(p,out);
}
// Preserve historical postbuild content/security/fact-owner checks while
// allowing their exact current-release identity guards to recognize 8.33.
// This is a version whitelist extension, never skipping a historic gate.
{
 const fscripts=fs.readdirSync('.').filter(p=>/^postbuild-8.*-contract\\.mjs$/.test(p));
 let adjusted=0;
 for(const p of fscripts){
  if(['postbuild-831-playable-contract.mjs','postbuild-832-play-this-contract.mjs'].includes(p))continue;
  const before=read(p);let after=before;
  for(const expr of ['String(contract.publicVersion)','contract.publicVersion','String(contract.stableBaseVersion)','contract.stableBaseVersion','info.version','info.baseVersion','manifest.version','manifest.baseVersion','m.version','m.baseVersion','version','CURRENT_VERSION']){
   after=after.split(expr+"!=='8.32'").join("!['8.32','8.33'].includes("+expr+")");
   after=after.split(expr+"==='8.32'").join("['8.32','8.33'].includes("+expr+")");
  }
  const oldList="!['8.10','8.10.1'].includes(version)";
  if(after.includes(oldList))after=after.replace(oldList,"!(['8.10','8.10.1'].includes(version)||version==='8.33')");
  if(after!==before){write(p,after);adjusted++}
 }
 console.log('[AXIS 8.33] extended '+adjusted+' inherited postbuild version-only admission(s); original factual checks retained');
}
// The 8.10 verifier's accepted-version array is extended by earlier
// build stages (so its final contents can differ from the Git source). Admit
// one successor without changing any audio/language/owner assertions.
{
 const p='postbuild-810-contract.mjs';let src=read(p);
 const re=/if\(!((?:\[[^\n;]+\])\.includes\(version\))\)fail\(\x60unexpected public version/;
 const m=src.match(re);
 if(!m)fail('8.10 inherited accepted-release list anchor missing');
 src=src.replace(m[0],"if(\!("+m[1]+"||version==='8.33'))fail(\x60unexpected public version");
 write(p,src);
}
// Specific old 8.10.1–8.13 artifact gates were historically compiled with
// an exact predecessor version. Extend only their version admission predicates
// to the new exactly-matching 8.33 runtime; all content and security clauses
// remain byte-identical and continue to execute.
{
 const ps=fs.readdirSync('.').filter(p=>/^postbuild-8.*\.mjs$/.test(p)&&
  !['postbuild-831-playable-contract.mjs','postbuild-832-play-this-contract.mjs'].includes(p));
 let count=0;
 for(const p of ps){
  const source=read(p);
  const lines=source.split('\n');
  let changed=0;
  for(let i=0;i<lines.length;i++){
   const line=lines[i];
   if(!/^if\(/.test(line.trim()))continue;
   if(!/(unexpected public version|release identity|manifest identity|unexpected 8\.11 release identity)/.test(line))continue;
   if(!/(version|Version|release)/.test(line))continue;
   const m=line.match(/^(\s*if\()(.*)(\)fail\(.+)$/);
   if(!m)continue;
   // A precise 8.33 version+base pair is required to exercise inherited proofs.
   const exactPair="(JSON.parse(read('release-contract.json')).publicVersion==='8.33'&&JSON.parse(read('release-contract.json')).stableBaseVersion==='8.33'&&JSON.parse(read('axis-build.json')).version==='8.33'&&JSON.parse(read('axis-build.json')).baseVersion==='8.33')";
   lines[i]=m[1]+'('+m[2]+')&&!'+exactPair+m[3];
   changed++;
  }
  if(changed){write(p,lines.join('\n'));count+=changed}
 }
 if(count<5)fail('8.10–8.13 historical exact-version guard migration coverage suspiciously small '+count);
 console.log('[AXIS 8.33] '+count+' historic exact-version gates admit only internally parity-checked 8.33; behavioral proof unchanged');
}
// 8.18 intentionally superseded the older center-watermark layout. The
// 8.15.1 regression verifier must check the *modern* factual watermark on
// 8.33 rather than reject the already-certified 8.18+ visual behavior.
{
 const p='postbuild-8151-regression-contract.mjs',src=read(p);
 const re=/const centerSuperseded=([^;]+);/;
 const m=src.match(re);if(!m)fail('inherited watermark supersession guard changed');
 write(p,src.replace(m[0],'const centerSuperseded=('+m[1]+")||contract.publicVersion==='8.33';"));
}
// The existing 8.31 browser proof must still test this candidate runtime and
// all historical identity/provenance semantics, never silently skip the test.
{
 const p='scripts/axis-831-playable-browser-smoke.mjs';
 once(p,"window.__AXIS_RELEASE__==='8.32'","window.__AXIS_RELEASE__==='8.33'");
}
// Candidate governance is an audit overlay. Immutable production certificate,
// original 8.31 rollback and public provider identifiers are unchanged.
const p=JSON.parse(read('governance/project-state.json'));
const o=JSON.parse(read('governance/owners.json'));
if(p.product.productionRelease!==FROM||p.product.lastSealedRelease!=='8.31'||
 p.product.productionRuntimeSha!=='dddce5401e80087a7ccceb43ec466f1ad7abb505')
 fail('immutable production rollback authority drifted');
Object.assign(p.product,{productionRelease:VERSION,releaseStatus:'candidate',candidatePullRequest:183});
Object.assign(p.production,{candidateRelease:VERSION,candidateStatus:'pending-exact-head-and-merged-main-certification',
 latestDeploymentIsAuthority:false,evidenceScope:'product-runtime-seal-snapshot'});
Object.assign(p.engineering,{
 activeMilestone:'AXIS 8.33 — PLAY THIS Strength + Light Consistency',
 activePhase:'Consolidated candidate · physical acceptance and production admission pending',
 activeBranch:'main',deliveryBranch:'release/833-play-strength-light',pullRequest:183,
 pullRequestDraft:true,baselineRelease:VERSION,nextProductRelease:VERSION,
 intendedProductBehaviorChange:true,versionDecision:{sequence:34,baseRelease:'8.31',
 release:VERSION,decision:'bump',changeClass:'product-runtime'},
 nextSlice:'Finish exact-head CI, physical iPhone installed-origin/light-dark validation, approve SHA-protected merge then Vercel+EdgeOne production and separate certification'
});
p.engineering.playThis={...p.engineering.playThis,
 status:'8.33-strength-object-runtime-candidate',strengthFullLoop:true,inlineCanonicalSave:true,
 actualSetsStoredInExistingEncounter:true,noMandatoryLegacyRecorder:true,
 existingQuickRecordPreserved:true,lightThemeSemanticConvergence:true,
 guidedMultiStepFlowComplete:false,physicalIphoneCertified:false,
 newSessionWriter:false,newEncounterWriter:false,newRecorder:false,
 share:false,air:false};
o.baselineRelease=VERSION;
const own=o.owners?.find(x=>x.capability==='play-this-entry-832');
if(own){own.status='inherited-8.32-entry-superseded-by-8.33-strength-execution';own.notes='8.33 strength uses prospective user-confirmed sets and existing canonical Encounter writer. Remaining modes/Flow not yet shipped.'}
write('governance/project-state.json',JSON.stringify(p,null,2)+'\n');
write('governance/owners.json',JSON.stringify(o,null,2)+'\n');
console.log('[AXIS 8.33] governed product candidate; inherited 8.32 + sealed 8.31 contracts retained, no public Promotion');
