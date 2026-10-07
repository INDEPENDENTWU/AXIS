import fs from 'node:fs';

const FROM='8.27',VERSION='8.28';
const fail=m=>{throw new Error('[AXIS 8.28 release identity] '+m)};
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
  const n=(source.match(/'8\.27'/g)||[]).length;
  if(!n)continue;
  inheritedIdentityTouches+=n;
  source=source.replaceAll("'8.27'","'8.28'");
  write(file,source);
}

const excluded=new Set([
  'postbuild-827-reality-route-contract.mjs','postbuild-828-practice-loop-contract.mjs',
  'scripts/axis-repository-contract.mjs','scripts/axis-production-governance-contract.mjs','scripts/axis-version-authority-contract.mjs',
  'scripts/axis-827-governance-compat.mjs','scripts/axis-828-governance-compat.mjs','scripts/prepare-828-release-identity.mjs'
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

for(const [f,a,b] of [
  ['postbuild-825-set-lock-contract.mjs',"'8.26.3','8.26.4','8.26.5','8.27'].includes(info.version)","'8.26.3','8.26.4','8.26.5','8.27','8.28'].includes(info.version)"],
  ['postbuild-8251-inline-set-morph-contract.mjs',"'8.26.3','8.26.4','8.26.5','8.27'].includes(info.version)","'8.26.3','8.26.4','8.26.5','8.27','8.28'].includes(info.version)"],
  ['postbuild-826-active-continuity-contract.mjs',"'8.26.3','8.26.4','8.26.5','8.27'].includes(info.version)","'8.26.3','8.26.4','8.26.5','8.27','8.28'].includes(info.version)"],
  ['postbuild-8262-active-rest-selector-contract.mjs',"'8.26.3','8.26.4','8.26.5','8.27'].includes(info.version)","'8.26.3','8.26.4','8.26.5','8.27','8.28'].includes(info.version)"],
  ['postbuild-8263-active-rest-convergence-contract.mjs',"'8.26.4','8.26.5','8.27'].includes(info.version)","'8.26.4','8.26.5','8.27','8.28'].includes(info.version)"]
]){
  let s=read(f);if(s.includes(a))s=s.replace(a,b);write(f,s);
}
{
  const f='postbuild-8261-active-rest-state-contract.mjs';let s=read(f);
  if(!s.includes('inherited828')){
    s=s.replace("const inherited827=info.version==='8.27'&&info.baseVersion==='8.27';","const inherited827=info.version==='8.27'&&info.baseVersion==='8.27';\nconst inherited828=info.version==='8.28'&&info.baseVersion==='8.28';");
    s=s.replace("const inherited=inherited8262||inherited8263||inherited8264||inherited8265||inherited827;","const inherited=inherited8262||inherited8263||inherited8264||inherited8265||inherited827||inherited828;");
    s=s.replace("const mode=inherited827?'inherited by 8.27':","const mode=inherited828?'inherited by 8.28':inherited827?'inherited by 8.27':");
  }
  write(f,s);
}
{
  const f='postbuild-8264-active-rest-utility-rail-contract.mjs';let s=read(f);
  s=s.replace("inherited=['8.26.5','8.27'].includes(info.version)&&info.baseVersion===info.version","inherited=['8.26.5','8.27','8.28'].includes(info.version)&&info.baseVersion===info.version");
  write(f,s);
}
for(const [f,a,b] of [
  ['scripts/axis-813-build-parity.mjs',"'8.26.2','8.26.3','8.26.4','8.26.5','8.27'];","'8.26.2','8.26.3','8.26.4','8.26.5','8.27','8.28'];"],
  ['scripts/axis-821-item-unit-flow-smoke.mjs',"'8.26.4','8.26.5','8.27'].includes(release)","'8.26.4','8.26.5','8.27','8.28'].includes(release)"],
  ['scripts/axis-8251-inline-set-morph-smoke.mjs',"'8.26.3','8.26.4','8.26.5','8.27']","'8.26.3','8.26.4','8.26.5','8.27','8.28']"]
]){
  let s=read(f);if(s.includes(a))s=s.replace(a,b);write(f,s);
}
{
  const f='scripts/axis-8262-active-rest-selector-smoke.mjs';let s=read(f);
  s=s.replaceAll("window.__AXIS_RELEASE__==='8.27'","window.__AXIS_RELEASE__==='8.28'");
  const chain="await import('./axis-828-practice-loop-smoke.mjs');";
  if(!s.includes(chain))s+='\nif(process.env.AXIS_SKIP_828_PRACTICE_LOOP!==\'1\')'+chain+'\n';
  write(f,s);
}

await import('./prepare-828-governance-state.mjs');
await import('./axis-828-governance-compat.mjs');
if(inheritedIdentityTouches+touches<10)fail('public identity convergence suspiciously small: '+(inheritedIdentityTouches+touches));
console.log('[AXIS 8.28 release identity] PASS · '+FROM+' -> '+VERSION+' · '+inheritedIdentityTouches+' inherited + '+touches+' explicit identity assertion(s) advanced');
