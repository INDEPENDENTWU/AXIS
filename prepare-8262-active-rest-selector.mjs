import fs from 'node:fs';

const FROM='8.26.1',VERSION='8.26.2';
const fail=m=>{throw new Error(`[AXIS 8.26.2 Active Rest Selector Binding] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

/* Real-use audit finding: the canonical integrated Active stage renders the
   rest node as .v87Rest. 8.26.1's presentation source targeted a non-existent
   .v87-restline selector, so its intended spacing/tonal grouping never bound
   to the shipped node. This patch changes presentation binding only. */
const css=read('styles/axis-826-active-continuity.css');
const runtime=read('v87-runtime.js');
for(const token of [
  '#v87Now.axis821ActiveStage .v87Rest{margin-top:12px!important',
  'background:rgba(115,124,255,.07)',
  'axis826RestStateIn',
  '#v87Now.axis821ActiveStage .v87Rest{animation:none!important}'
])if(!css.includes(token))fail(`live rest selector contract drift ${token}`);
if(!runtime.includes('class="v87Rest" id="v87Rest"'))fail('canonical v87Rest node missing from Active runtime');
for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','fetch(','XMLHttpRequest','WebSocket('])if(css.includes(forbidden))fail(`presentation CSS acquired forbidden authority ${forbidden}`);

/* Current release identity. The exact built artifact remains runtime authority. */
{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!==FROM||String(x.stableBaseVersion)!==FROM)fail(`expected ${FROM} input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion=VERSION;x.stableBaseVersion=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}
for(const [f,a,b,label] of [
 ['build-hardened.mjs',`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'hardened build version'],
 ['postbuild-features-hardened.mjs',`const TARGET_VERSION='${FROM}';`,`const TARGET_VERSION='${VERSION}';`,'feature manifest version']
]){let s=read(f);s=once(s,a,b,label);write(f,s)}
{
 const f='postbuild-88-canonical.mjs';let s=read(f);
 s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'canonical version');
 s=once(s,`document.documentElement.dataset.axisCanonical='${FROM}';`,`document.documentElement.dataset.axisCanonical='${VERSION}';`,'canonical dataset');
 s=once(s,`data-axis-runtime=\"canonical-${FROM}\"`,`data-axis-runtime=\"canonical-${VERSION}\"`,'canonical HTML marker');
 write(f,s);
}

const inheritedCurrentIdentityFiles=[
 'postbuild-882-contract.mjs','postbuild-810-contract.mjs','postbuild-8101-contract.mjs','postbuild-8102-contract.mjs','postbuild-8103-contract.mjs','postbuild-891-contract.mjs','postbuild-811-contract.mjs','postbuild-812-contract.mjs','postbuild-813-live-route.mjs','postbuild-8123-contract.mjs','postbuild-8123-field-polish.mjs','postbuild-8124-contract.mjs','postbuild-8131-evolution-contract.mjs','postbuild-814-evolution-contract.mjs','postbuild-815-media-evidence-contract.mjs','postbuild-8151-regression-contract.mjs','postbuild-816-contract.mjs','postbuild-817-contract.mjs','postbuild-8171-source-first-media-contract.mjs',
 'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs','scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs','scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs','scripts/axis-8125-smart-create-polish-smoke.mjs','scripts/axis-8131-evolution-smoke.mjs','scripts/axis-814-evolution-object-smoke.mjs','scripts/axis-815-media-evidence-smoke.mjs','scripts/axis-8151-evidence-swap-smoke.mjs','scripts/axis-8151-regression-seal-smoke.mjs','scripts/axis-816-capture-evidence-smoke.mjs','scripts/axis-8171-source-first-media-smoke.mjs','scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs','scripts/edgeone-prebuilt-verify.mjs','scripts/axis-current-release-contract.mjs','scripts/axis-runtime-foundation-contract.mjs','scripts/axis-deep-compatibility-contract.mjs'
];
let inheritedTouches=0;
for(const f of inheritedCurrentIdentityFiles){let s=read(f),n=(s.match(/'8\.26\.1'/g)||[]).length;if(!n)continue;inheritedTouches+=n;s=s.replaceAll(`'${FROM}'`,`'${VERSION}'`);write(f,s)}

const pairs=[
 [`window.__AXIS_RELEASE__==='${FROM}'`,`window.__AXIS_RELEASE__==='${VERSION}'`],
 [`window.__AXIS_RELEASE__),'${FROM}'`,`window.__AXIS_RELEASE__),'${VERSION}'`],
 [`manifest.version,'${FROM}'`,`manifest.version,'${VERSION}'`],
 [`manifest.baseVersion,'${FROM}'`,`manifest.baseVersion,'${VERSION}'`],
 [`info.version!=='${FROM}'`,`info.version!=='${VERSION}'`],
 [`info.baseVersion!=='${FROM}'`,`info.baseVersion!=='${VERSION}'`],
 [`contract.publicVersion!=='${FROM}'`,`contract.publicVersion!=='${VERSION}'`],
 [`contract.stableBaseVersion!=='${FROM}'`,`contract.stableBaseVersion!=='${VERSION}'`],
 [`boot.release,'${FROM}'`,`boot.release,'${VERSION}'`],
 [`candidate.version,'${FROM}'`,`candidate.version,'${VERSION}'`],
 [`candidate.baseVersion,'${FROM}'`,`candidate.baseVersion,'${VERSION}'`]
];
const excluded=new Set([
 'postbuild-825-set-lock-contract.mjs','postbuild-8251-inline-set-morph-contract.mjs','postbuild-826-active-continuity-contract.mjs',
 'scripts/axis-repository-contract.mjs','scripts/axis-production-governance-contract.mjs','scripts/axis-version-authority-contract.mjs',
 'scripts/axis-825-set-lock-smoke.mjs','scripts/axis-8251-inline-set-morph-smoke.mjs','scripts/axis-826-active-continuity-smoke.mjs'
]);
const candidates=[...fs.readdirSync('.').filter(f=>/^postbuild-.*\.mjs$/.test(f)),...fs.readdirSync('scripts').filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)].filter(f=>!excluded.has(f));
let identityTouches=0;
for(const f of candidates){let s=read(f),next=s;for(const [a,b] of pairs){const n=next.split(a).length-1;if(n){identityTouches+=n;next=next.replaceAll(a,b)}}if(next!==s)write(f,next)}

/* Keep the inherited 8.26 physical smoke pointed at the current artifact. */
{
 const f='scripts/axis-826-active-continuity-smoke.mjs';let s=read(f),n=0;
 for(const [a,b] of [[`window.__AXIS_RELEASE__==='${FROM}'`,`window.__AXIS_RELEASE__==='${VERSION}'`],[`window.__AXIS_RELEASE__),'${FROM}'`,`window.__AXIS_RELEASE__),'${VERSION}'`]]){const c=s.split(a).length-1;if(c){n+=c;s=s.replaceAll(a,b)}}
 if(n<2)fail(`8.26 smoke current identity drift ${n}`);write(f,s);identityTouches+=n;
}
{
 const f='scripts/axis-821-item-unit-flow-smoke.mjs';let s=read(f);
 s=s.replace("if(['8.26','8.26.1'].includes(release)){","if(['8.26','8.26.1','8.26.2'].includes(release)){");write(f,s);
}
{
 const f='scripts/axis-813-build-parity.mjs';let s=read(f);
 if(!s.includes(`'${VERSION}'`))s=s.replace("'8.25.1','8.26','8.26.1'];","'8.25.1','8.26','8.26.1','8.26.2'];");
 write(f,s);
}
{
 const f='governance/owners.json',x=JSON.parse(read(f));x.baselineRelease=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}

/* Extend only inherited presentation contracts. The factual owners stay put. */
{
 const f='postbuild-825-set-lock-contract.mjs';let s=read(f);s=s.replace("['8.25.1','8.26','8.26.1'].includes(info.version)","['8.25.1','8.26','8.26.1','8.26.2'].includes(info.version)");write(f,s);
}
{
 const f='postbuild-8251-inline-set-morph-contract.mjs';let s=read(f);s=s.replace("['8.26','8.26.1'].includes(info.version)","['8.26','8.26.1','8.26.2'].includes(info.version)");write(f,s);
}
{
 const f='postbuild-826-active-continuity-contract.mjs';let s=read(f);
 s=s.replace("inherited=info.version==='8.26.1'&&info.baseVersion==='8.26.1'","inherited=['8.26.1','8.26.2'].includes(info.version)&&info.baseVersion===info.version");write(f,s);
}

if(inheritedTouches+identityTouches<12)fail(`public identity convergence suspiciously small: ${inheritedTouches}+${identityTouches}`);
console.log(`[AXIS 8.26.2 Active Rest Selector Binding] PASS · ${FROM} → ${VERSION} · live .v87Rest presentation binding · ${inheritedTouches+identityTouches} current identity assertion(s) advanced`);
