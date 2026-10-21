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
