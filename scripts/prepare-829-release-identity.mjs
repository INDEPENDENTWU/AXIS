import fs from 'node:fs';

const FROM='8.28',VERSION='8.29';
const fail=m=>{throw new Error('[AXIS 8.29 release identity] '+m)};
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
  'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs','scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs','scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs','scripts/axis-8125-smart-create-polish-smoke.mjs','scripts/axis-8131-evolution-smoke.mjs','scripts/axis-814-evolution-object-smoke.mjs','scripts/axis-815-media-evidence-smoke.mjs','scripts/axis-8151-regression-seal-smoke.mjs','scripts/axis-8151-evidence-swap-smoke.mjs','scripts/axis-816-capture-evidence-smoke.mjs','scripts/axis-8171-source-first-media-smoke.mjs','scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs','scripts/edgeone-prebuilt-verify.mjs','scripts/axis-current-release-contract.mjs','scripts/axis-runtime-foundation-contract.mjs','scripts/axis-deep-compatibility-contract.mjs'
];
let inheritedIdentityTouches=0;
for(const file of inheritedCurrentIdentityFiles){
  let source=read(file);
  const n=(source.match(/'8\.28'/g)||[]).length;
  if(!n)continue;
  inheritedIdentityTouches+=n;
  source=source.replaceAll("'8.28'","'8.29'");
  write(file,source);
}

const excluded=new Set([
  'postbuild-827-reality-route-contract.mjs','postbuild-828-practice-loop-contract.mjs','postbuild-829-recording-friction-contract.mjs',
  'scripts/axis-repository-contract.mjs','scripts/axis-production-governance-contract.mjs','scripts/axis-version-authority-contract.mjs',
  'scripts/axis-827-governance-compat.mjs','scripts/axis-828-governance-compat.mjs','scripts/axis-829-governance-compat.mjs','scripts/prepare-828-release-identity.mjs','scripts/prepare-829-release-identity.mjs'
]);
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
let touches=0;
const scan=[...fs.readdirSync('.').filter(f=>/^postbuild-.*\.mjs$/.test(f)),...fs.readdirSync('scripts').filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)].filter(f=>!excluded.has(f));
for(const f of scan){
  let s=read(f),next=s;
  for(const [a,b] of pairs){const n=next.split(a).length-1;if(n){touches+=n;next=next.replaceAll(a,b)}}
  if(next!==s)write(f,next);
}


const inheritedSupportFiles=[
 'postbuild-825-set-lock-contract.mjs',
 'postbuild-8251-inline-set-morph-contract.mjs',
 'postbuild-826-active-continuity-contract.mjs',
 'postbuild-8262-active-rest-selector-contract.mjs',
 'postbuild-8263-active-rest-convergence-contract.mjs',
 'postbuild-8264-active-rest-utility-rail-contract.mjs',
 'postbuild-8265-recording-review-geometry-contract.mjs',
 'scripts/axis-813-build-parity.mjs',
 'scripts/axis-821-item-unit-flow-smoke.mjs',
 'scripts/axis-8251-inline-set-morph-smoke.mjs'
];
for(const f of inheritedSupportFiles){
 let source=read(f);
 // Only extend already-approved, exact moving-release enumerations.
 source=source.replaceAll("'8.28'].includes","'8.28','8.29'].includes");
 source=source.replaceAll("'8.28'];","'8.28','8.29'];");
 source=source.replaceAll("'8.28']","'8.28','8.29']");
 source=source.replaceAll("'8.28';","'8.29';");
 write(f,source);
}
{
 const f='postbuild-8261-active-rest-state-contract.mjs';let source=read(f);
 if(!source.includes('inherited829')){
   const token="const inherited828=info.version==='8.28'&&info.baseVersion==='8.28';";
   if(!source.includes(token))fail('Active rest inherited 8.28 declaration missing');
   source=source.replace(token,token+"\nconst inherited829=info.version==='8.29'&&info.baseVersion==='8.29';");
   source=source.replace('||inherited828;', '||inherited828||inherited829;');
   source=source.replace("const mode=inherited828?", "const mode=inherited829?'inherited by 8.29':inherited828?");
 }
 write(f,source);
}
{
 const f='scripts/axis-8262-active-rest-selector-smoke.mjs';let source=read(f);
 source=source.replaceAll("window.__AXIS_RELEASE__==='8.28'","window.__AXIS_RELEASE__==='8.29'");
 const chain="await import('./axis-829-recording-friction-smoke.mjs');";
 if(!source.includes(chain))source+='\nif(process.env.AXIS_SKIP_829_RECORDING!==\'1\')'+chain+'\n';
 write(f,source);
}
{
 const f='scripts/axis-828-practice-loop-smoke.mjs';let source=read(f);
 source=source.replaceAll("window.__AXIS_RELEASE__==='8.28'","window.__AXIS_RELEASE__==='8.29'");
 write(f,source);
}
{
 const f='scripts/axis-repository-contract.mjs';let source=read(f);
 if(!source.includes("CURRENT==='8.29'?96:"))source=source.replace("CURRENT==='8.28'?95:","CURRENT==='8.29'?96:CURRENT==='8.28'?95:");
 source=source.replaceAll("'8.28']","'8.28','8.29']");
 write(f,source);
}
{
 const f='scripts/axis-production-governance-contract.mjs';let source=read(f);
 const anchor="if(CURRENT==='8.28'){sourceOwner='prepare-828-practice-loop.mjs';sourceCurrent='8.28';sourceFrom='8.27'}";
 const next="if(CURRENT==='8.29'){sourceOwner='prepare-829-recording-friction.mjs';sourceCurrent='8.29';sourceFrom='8.28'}";
 if(!source.includes(next)){
   if(!source.includes(anchor))fail('8.28 production source-owner anchor missing');
   source=source.replace(anchor,anchor+'\n'+next);
 }
 const pivot="}else if(CURRENT==='8.28'){";
 if(!source.includes("8.29 must be candidate over sealed 8.28")){
   const block=[
     "}else if(CURRENT==='8.29'){",
     "  if(!candidate||STATUS!=='candidate'||SEALED!=='8.28')fail('8.29 must be candidate over sealed 8.28');",
     "  if(RUNTIME_SHA!=='df67fc0a20c0c34a79341315c8c85b5461acfe44'||SEALED_PR!==162)fail('8.29 candidate lost exact 8.28 Production seal');",
     "  if(CANDIDATE_PR!==164||project?.engineering?.pullRequest!==164||project?.engineering?.deliveryBranch!=='feature/829-recording-friction-collapse')fail('8.29 product PR delivery identity drift');",
     "  if(project?.production?.candidateRelease!=='8.29'||project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification'||project?.production?.latestDeploymentIsAuthority!==false)fail('8.29 Production candidate boundary drift');",
     "  if(project?.engineering?.activeMilestone!=='AXIS 8.29 — Recording Friction Collapse')fail('8.29 milestone drift');",
     "  if(!(decision?.sequence===27&&decision?.base_release==='8.28'&&decision?.release==='8.29'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime'))fail('8.29 version decision drift');",
     "  const recording=project?.engineering?.recordingFriction;",
     "  if(recording?.status!=='8.29-release-candidate'||recording?.pureOwner!=='lib/axis-recording-continuity.mjs'||recording?.projectionSchema!=='axis.recording-continuity.v1'||recording?.newStorageNamespace!==false||recording?.newRecorderOwner!==false||recording?.newEncounterWriter!==false)fail('8.29 derived recorder governance drift');",
     pivot
   ].join('\n');
   if(!source.includes(pivot))fail('Production 8.28 candidate block missing');
   source=source.replace(pivot,block);
 }
 write(f,source);
}
{
 const f='postbuild-8265-recording-review-geometry-contract.mjs';let source=read(f);
 source=source.replaceAll("'8.28'].includes(info.version)","'8.28','8.29'].includes(info.version)");
 write(f,source);
}
await import('./prepare-829-governance-state.mjs');
await import('./axis-829-governance-compat.mjs');
if(inheritedIdentityTouches+touches<10)fail('public identity convergence suspiciously small: '+(inheritedIdentityTouches+touches));
console.log('[AXIS 8.29 release identity] PASS · '+FROM+' -> '+VERSION+' · '+inheritedIdentityTouches+' inherited + '+touches+' explicit identity assertion(s) advanced');
