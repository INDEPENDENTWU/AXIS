import fs from 'node:fs';

const FROM='8.26.5',VERSION='8.27',PR=160,SEALED_SHA='5bf575730c5c8de542c603d40b0f8b780204a342';
const fail=m=>{throw new Error('[AXIS 8.27 release identity] '+m)};
const read=f=>{if(!fs.existsSync(f))fail('missing '+f);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const replaceOnce=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)fail(label+' expected once, found '+n);return s.replace(a,b)};

{
  const f='release-contract.json',x=JSON.parse(read(f));
  if(String(x.publicVersion)!==FROM||String(x.stableBaseVersion)!==FROM)fail('expected '+FROM+' input, found '+x.publicVersion+'/'+x.stableBaseVersion);
  x.publicVersion=VERSION;x.stableBaseVersion=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}
for(const row of [
  ['build-hardened.mjs',"const VERSION='"+FROM+"';","const VERSION='"+VERSION+"';",'hardened build version'],
  ['postbuild-features-hardened.mjs',"const TARGET_VERSION='"+FROM+"';","const TARGET_VERSION='"+VERSION+"';",'feature manifest version']
]){
  let s=read(row[0]);s=replaceOnce(s,row[1],row[2],row[3]);write(row[0],s);
}
{
  const f='postbuild-88-canonical.mjs';let s=read(f);
  s=replaceOnce(s,"const VERSION='"+FROM+"';","const VERSION='"+VERSION+"';",'canonical version');
  s=replaceOnce(s,"document.documentElement.dataset.axisCanonical='"+FROM+"';","document.documentElement.dataset.axisCanonical='"+VERSION+"';",'canonical dataset');
  s=replaceOnce(s,'data-axis-runtime="canonical-'+FROM+'"','data-axis-runtime="canonical-'+VERSION+'"','canonical HTML marker');
  write(f,s);
}

const inheritedCurrentIdentityFiles=[
  'postbuild-882-contract.mjs','postbuild-810-contract.mjs','postbuild-8101-contract.mjs','postbuild-8102-contract.mjs','postbuild-8103-contract.mjs','postbuild-891-contract.mjs','postbuild-811-contract.mjs','postbuild-812-contract.mjs','postbuild-813-live-route.mjs','postbuild-8123-contract.mjs','postbuild-8123-field-polish.mjs','postbuild-8124-contract.mjs','postbuild-8131-evolution-contract.mjs','postbuild-814-evolution-contract.mjs','postbuild-815-media-evidence-contract.mjs','postbuild-8151-regression-contract.mjs','postbuild-816-contract.mjs','postbuild-817-contract.mjs','postbuild-8171-source-first-media-contract.mjs',
  'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs','scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs','scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs','scripts/axis-8125-smart-create-polish-smoke.mjs','scripts/axis-8131-evolution-smoke.mjs','scripts/axis-814-evolution-object-smoke.mjs','scripts/axis-815-media-evidence-smoke.mjs','scripts/axis-8151-evidence-swap-smoke.mjs','scripts/axis-816-capture-evidence-smoke.mjs','scripts/axis-8171-source-first-media-smoke.mjs','scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs','scripts/edgeone-prebuilt-verify.mjs','scripts/axis-current-release-contract.mjs','scripts/axis-runtime-foundation-contract.mjs','scripts/axis-deep-compatibility-contract.mjs'
];
let inheritedIdentityTouches=0;
for(const file of inheritedCurrentIdentityFiles){
  let s=read(file);
  const n=(s.match(/'8\.26\.5'/g)||[]).length;
  if(!n)continue;
  inheritedIdentityTouches+=n;
  s=s.replaceAll("'8.26.5'","'8.27'");
  write(file,s);
}

const pairs=[
  ["window.__AXIS_RELEASE__==='"+FROM+"'","window.__AXIS_RELEASE__==='"+VERSION+"'"],
  ["window.__AXIS_RELEASE__),'"+FROM+"'","window.__AXIS_RELEASE__),'"+VERSION+"'"],
  ["manifest.version,'"+FROM+"'","manifest.version,'"+VERSION+"'"],
  ["manifest.baseVersion,'"+FROM+"'","manifest.baseVersion,'"+VERSION+"'"],
  ["info.version!=='"+FROM+"'","info.version!=='"+VERSION+"'"],
  ["info.baseVersion!=='"+FROM+"'","info.baseVersion!=='"+VERSION+"'"],
  ["contract.publicVersion!=='"+FROM+"'","contract.publicVersion!=='"+VERSION+"'"],
  ["contract.stableBaseVersion!=='"+FROM+"'","contract.stableBaseVersion!=='"+VERSION+"'"],
  ["boot.release,'"+FROM+"'","boot.release,'"+VERSION+"'"],
  ["candidate.version,'"+FROM+"'","candidate.version,'"+VERSION+"'"],
  ["candidate.baseVersion,'"+FROM+"'","candidate.baseVersion,'"+VERSION+"'"]
];
const excluded=new Set([
  'postbuild-825-set-lock-contract.mjs','postbuild-8251-inline-set-morph-contract.mjs','postbuild-826-active-continuity-contract.mjs',
  'postbuild-8261-active-rest-state-contract.mjs','postbuild-8262-active-rest-selector-contract.mjs','postbuild-8263-active-rest-convergence-contract.mjs',
  'postbuild-8264-active-rest-utility-rail-contract.mjs','postbuild-8265-recording-review-geometry-contract.mjs','postbuild-827-reality-route-contract.mjs',
  'scripts/axis-repository-contract.mjs','scripts/axis-production-governance-contract.mjs','scripts/axis-version-authority-contract.mjs',
  'scripts/axis-8251-governance-compat.mjs','scripts/axis-8261-governance-compat.mjs','scripts/axis-8262-governance-compat.mjs',
  'scripts/axis-8263-governance-compat.mjs','scripts/axis-8264-governance-compat.mjs','scripts/axis-8265-governance-compat.mjs','scripts/axis-827-governance-compat.mjs'
]);
let touches=0;
const files=[...fs.readdirSync('.').filter(f=>/^postbuild-.*\.mjs$/.test(f)),...fs.readdirSync('scripts').filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)].filter(f=>!excluded.has(f));
for(const f of files){
  let s=read(f),next=s;
  for(const pair of pairs){const n=next.split(pair[0]).length-1;if(n){touches+=n;next=next.replaceAll(pair[0],pair[1])}}
  if(next!==s)write(f,next);
}

for(const row of [
  ['postbuild-825-set-lock-contract.mjs',"'8.26.3','8.26.4','8.26.5'].includes(info.version)","'8.26.3','8.26.4','8.26.5','8.27'].includes(info.version)"],
  ['postbuild-8251-inline-set-morph-contract.mjs',"'8.26.3','8.26.4','8.26.5'].includes(info.version)","'8.26.3','8.26.4','8.26.5','8.27'].includes(info.version)"],
  ['postbuild-826-active-continuity-contract.mjs',"'8.26.3','8.26.4','8.26.5'].includes(info.version)","'8.26.3','8.26.4','8.26.5','8.27'].includes(info.version)"]
]){
  let s=read(row[0]);if(s.includes(row[1]))s=s.replace(row[1],row[2]);write(row[0],s);
}
{
  const f='postbuild-8261-active-rest-state-contract.mjs';let s=read(f);
  if(!s.includes('inherited827')){
    s=s.replace("const inherited8265=info.version==='8.26.5'&&info.baseVersion==='8.26.5';\nconst inherited=inherited8262||inherited8263||inherited8264||inherited8265;","const inherited8265=info.version==='8.26.5'&&info.baseVersion==='8.26.5';\nconst inherited827=info.version==='8.27'&&info.baseVersion==='8.27';\nconst inherited=inherited8262||inherited8263||inherited8264||inherited8265||inherited827;");
    s=s.replace("const mode=inherited8265?'inherited by 8.26.5':","const mode=inherited827?'inherited by 8.27':inherited8265?'inherited by 8.26.5':");
  }
  write(f,s);
}
{
  const f='postbuild-8262-active-rest-selector-contract.mjs';let s=read(f);
  s=s.replace("['8.26.3','8.26.4','8.26.5'].includes(info.version)","['8.26.3','8.26.4','8.26.5','8.27'].includes(info.version)");
  write(f,s);
}
{
  const f='postbuild-8263-active-rest-convergence-contract.mjs';let s=read(f);
  s=s.replace("['8.26.4','8.26.5'].includes(info.version)","['8.26.4','8.26.5','8.27'].includes(info.version)");
  write(f,s);
}
{
  const f='postbuild-8264-active-rest-utility-rail-contract.mjs';let s=read(f);
  s=s.replace("inherited=info.version==='8.26.5'&&info.baseVersion==='8.26.5'","inherited=['8.26.5','8.27'].includes(info.version)&&info.baseVersion===info.version");
  write(f,s);
}
for(const row of [
  ['scripts/axis-813-build-parity.mjs',"'8.26.2','8.26.3','8.26.4','8.26.5'];","'8.26.2','8.26.3','8.26.4','8.26.5','8.27'];"],
  ['scripts/axis-821-item-unit-flow-smoke.mjs',"'8.26.4','8.26.5'].includes(release)","'8.26.4','8.26.5','8.27'].includes(release)"],
  ['scripts/axis-8251-inline-set-morph-smoke.mjs',"'8.26.3','8.26.4','8.26.5']","'8.26.3','8.26.4','8.26.5','8.27']"]
]){
  let s=read(row[0]);if(s.includes(row[1]))s=s.replace(row[1],row[2]);write(row[0],s);
}
{
  const f='scripts/axis-8262-active-rest-selector-smoke.mjs';let s=read(f);
  s=s.replaceAll("window.__AXIS_RELEASE__==='8.26.5'","window.__AXIS_RELEASE__==='8.27'");
  const chain="await import('./axis-827-reality-route-smoke.mjs');";
  if(!s.includes(chain))s+='\nif(process.env.AXIS_SKIP_827_REALITY_ROUTE!==\'1\')'+chain+'\n';
  write(f,s);
}

{
  const f='governance/project-state.json',x=JSON.parse(read(f));
  x.product.productionRelease=VERSION;x.product.releaseStatus='candidate';x.product.lastSealedRelease=FROM;x.product.productionRuntimeSha=SEALED_SHA;x.product.productionPullRequest=158;x.product.candidatePullRequest=PR;
  x.production.sealedRelease=FROM;x.production.candidateRelease=VERSION;x.production.candidateStatus='pending-exact-head-and-merged-main-certification';
  x.production.evidenceSemantics='Provider IDs and source SHA below remain the fully sealed AXIS 8.26.5 certification snapshot at '+SEALED_SHA+'. AXIS 8.27 Reality Route is a product-runtime candidate and may replace the seal only after exact-head, merged-main, Vercel, EdgeOne and axis.juele.fun certification.';
  Object.assign(x.engineering,{activeMilestone:'AXIS 8.27 — Reality Route',activePhase:'Product runtime candidate — deterministic reality-driven continuation with temporary defer semantics',activeBranch:'main',deliveryBranch:'feature/827-reality-route',pullRequest:PR,pullRequestDraft:false,baselineRelease:VERSION,baselineRuntimeSha:SEALED_SHA,lastSealedRelease:FROM,lastSealedRuntimeSha:SEALED_SHA,intendedProductBehaviorChange:true,nextProductRelease:VERSION,versionDecision:{sequence:23,baseRelease:FROM,release:VERSION,decision:'bump',changeClass:'product-runtime'},nextSlice:'Finish AXIS 8.27 Reality Route on exact PR #160 head, prove pure route projection plus Chromium/iPhone-like WebKit defer behavior, merge exact green head, then certify exact merged-main Vercel, EdgeOne and axis.juele.fun.'});
  x.engineering.realityRoute={status:'8.27-release-candidate',principle:'reality drives continuation; reusable intent and historical facts remain immutable',pureOwner:'lib/axis-reality-route.mjs',projectionSchema:'axis.reality-route.v1',temporaryConstraintSchema:'axis.execution-constraints.v1',stateContainer:'axis_v60_state.flowRun',persistedField:'temporaryConstraints.deferredStepRefs',newStorageNamespace:false,flowDefinitionMutation:false,historicalEncounterRewrite:false,manualDetourConsumesFlowStep:false,activeItemDeferrable:false,deferredItemsReturnAfterImmediateRoute:true,reasonCodes:true,newSessionWriter:false,newEncounterWriter:false,newRecorderOwner:false,newActiveOwner:false,network:false,ai:false,chromiumAndWebKitRequired:true,productionProofRequired:['Vercel','EdgeOne','axis.juele.fun']};
  if(x.engineering.recordingReviewGeometry)x.engineering.recordingReviewGeometry.status='production-sealed-8.26.5-inherited';
  write(f,JSON.stringify(x,null,2)+'\n');
}
{
  const f='governance/owners.json',x=JSON.parse(read(f));x.baselineRelease=VERSION;
  let owner=x.owners&&x.owners.find(o=>o.capability==='flow-reality-route-827');
  if(!owner){owner={capability:'flow-reality-route-827',status:'derived-runtime-release-candidate',owner:'lib/axis-reality-route.mjs + existing app.js Flow orchestration bridge',contract:'axis.reality-route.v1',storage:'axis_v60_state.flowRun.temporaryConstraints',delegatesTo:'existing app-owned FlowRun + existing Session/Encounter/Active/recorder owners',notes:'Derived route projection only; no new factual authority.'};x.owners.push(owner)}
  owner.status='derived-runtime-release-candidate';owner.storage='axis_v60_state.flowRun.temporaryConstraints';
  write(f,JSON.stringify(x,null,2)+'\n');
}

await import('./axis-827-governance-compat.mjs');

if(inheritedIdentityTouches+touches<12)fail('public identity convergence suspiciously small: inherited '+inheritedIdentityTouches+' + explicit '+touches);
console.log('[AXIS 8.27 release identity] PASS · '+FROM+' -> '+VERSION+' · '+inheritedIdentityTouches+' inherited + '+touches+' explicit identity assertion(s) advanced');
