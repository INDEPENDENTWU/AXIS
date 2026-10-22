import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const d=read('governance/version-decision.json'),proof=read('governance/production-certifications/8.31.json');
const old='dddce5401e80087a7ccceb43ec466f1ad7abb505';
if(!((d.sequence===33&&d.release==='8.32')||(d.sequence===34&&d.release==='8.33'))||d.base_release!=='8.31'||d.decision!=='bump'||d.change_class!=='product-runtime')throw Error('[AXIS 8.32 inherited governance] explicit 8.32 predecessor or 8.33 governed successor required');
if(proof.productRuntimeSha!==old||proof.productPullRequest!==170||proof.exactHeadSuccess!==35)throw Error('[AXIS 8.32 governance] immutable 8.31 certificate changed');
const p=read('governance/project-state.json'),o=read('governance/owners.json');
if(p.product?.releaseStatus!=='production-certified'||p.product?.productionRuntimeSha!==old||p.production?.sealedRelease!=='8.31')throw Error('[AXIS 8.32 governance] sealed 8.31 baseline lost');
Object.assign(p.product,{productionRelease:'8.32',releaseStatus:'candidate',lastSealedRelease:'8.31',productionRuntimeSha:old,productionPullRequest:170,candidatePullRequest:174});
Object.assign(p.production,{sealedRelease:'8.31',candidateRelease:'8.32',candidateStatus:'pending-exact-head-and-merged-main-certification',latestDeploymentIsAuthority:false,evidenceScope:'product-runtime-seal-snapshot',evidenceSemantics:'8.31 product/runtime remains certified until independent 8.32 production acceptance'});
Object.assign(p.engineering,{activeMilestone:'AXIS 8.32 — Local PLAY THIS',activePhase:'Product candidate — Object/Flow entry and existing owner delegation',activeBranch:'main',deliveryBranch:'feature/832-play-this-local-entry',pullRequest:174,pullRequestDraft:true,baselineRelease:'8.32',baselineRuntimeSha:old,lastSealedRelease:'8.31',lastSealedRuntimeSha:old,intendedProductBehaviorChange:true,nextProductRelease:'8.32',versionDecision:{sequence:33,baseRelease:'8.31',release:'8.32',decision:'bump',changeClass:'product-runtime'},nextSlice:'8.32 browser acceptance, exact-head full CI, expected-SHA merge, independently certified production and separate governance seal'});
p.engineering.playThis={status:'8.32-product-candidate',design:'docs/AXIS_832_PLAY_THIS_EXPERIENCE.md',quality:'docs/EXPERIENCE_QUALITY_STANDARD.md',acceptance:'tests/acceptance/axis-832-play-this.feature',presentationOwner:'existing app.js Object/Flow surfaces',compiler:'lib/axis-playable.mjs',execution:'window.__AXIS_831_PLAYABLE__',newStorageNamespace:false,newSessionWriter:false,newEncounterWriter:false,newRecorder:false,newActiveOwner:false,localFirst:true,share:false,ai:false};
o.baselineRelease='8.32';
let owner=o.owners.find(x=>x.capability==='play-this-entry-832');
if(!owner){owner={capability:'play-this-entry-832'};o.owners.push(owner)}
Object.assign(owner,{status:'product-candidate-presentation-only',owner:'existing app.js Object picker and Flow Home entry; 8.32 narrow compiler bridge',contract:'axis.playable.v1',storage:'none',delegatesTo:'8.31 Playable projection and existing Flow/Active/Recorder/Encounter owners',notes:'No new fact writer, custom identity fallback, secondary timer, implicit completion, cloud, AI or persistent attempt'});
write('governance/project-state.json',p);write('governance/owners.json',o);
console.log('[AXIS 8.32 governance] PASS · 8.31 certificate preserved; candidate does not claim Production');
