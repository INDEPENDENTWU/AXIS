import fs from 'node:fs';

const FROM='8.24',VERSION='8.24.1';
const fail=m=>{throw new Error(`[AXIS 8.24.1 Dock Occlusion] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

/*
 * 8.24.1 is a bounded visual defect correction to the 8.24 Active-stage dock.
 * It restores the already-governed opaque-plane intent: no new action, layout,
 * Session, Encounter, storage, recorder, Active, network or AI owner is added.
 */
{
 const f='v87-runtime.js';let s=read(f);const css=read('styles/axis-8241-dock-occlusion.css').trim();
 if(!css.includes('contain:none!important'))fail('fixed dock must fully retire containment so overscan can escape its box');
 if(/contain:[^;}]*paint/.test(css))fail('dock must not use paint containment');
 if(!css.includes('background:var(--bg)!important')||!css.includes('z-index:0!important')||!css.includes('top:-16px!important'))fail('opaque overscan curtain contract drift');
 if(s.includes('function axis8241DockOcclusionStyle()'))fail('8.24.1 dock style duplicated');
 const marker='function ensureUI()';if(!s.includes(marker))fail('v87 ensureUI anchor missing');
 const style=`function axis8241DockOcclusionStyle(){if($('#axis8241DockOcclusionStyle'))return;const st=D.createElement('style');st.id='axis8241DockOcclusionStyle';st.textContent=${JSON.stringify(css)};(D.head||D.documentElement).appendChild(st)}\n`;
 s=s.replace(marker,style+marker);
 s=once(s,'ensureUI();axis821ActiveStageStyle();axis821ActiveStageRefineStyle();axis824ActiveStageTactileStyle();if(hold&&!force)return;','ensureUI();axis821ActiveStageStyle();axis821ActiveStageRefineStyle();axis824ActiveStageTactileStyle();axis8241DockOcclusionStyle();if(hold&&!force)return;','8.24.1 style mount after 8.24');
 try{new Function(s)}catch(e){fail(`v87 syntax ${e.message}`)}
 write(f,s);
}

/* Advance only current public/build identity. Historical capability versions and
   their ownership semantics remain immutable. */
{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!==FROM||String(x.stableBaseVersion)!==FROM)fail(`expected ${FROM} input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion=VERSION;x.stableBaseVersion=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}
{
 const f='build-hardened.mjs';let s=read(f);s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'hardened build version');write(f,s);
}
{
 const f='postbuild-features-hardened.mjs';let s=read(f);s=once(s,`const TARGET_VERSION='${FROM}';`,`const TARGET_VERSION='${VERSION}';`,'feature manifest version');write(f,s);
}
{
 const f='postbuild-88-canonical.mjs';let s=read(f);
 s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'canonical version');
 s=once(s,`document.documentElement.dataset.axisCanonical='${FROM}';`,`document.documentElement.dataset.axisCanonical='${VERSION}';`,'canonical dataset');
 s=once(s,`data-axis-runtime=\"canonical-${FROM}\"`,`data-axis-runtime=\"canonical-${VERSION}\"`,'canonical HTML marker');
 write(f,s);
}

/* 8.24 itself advanced a bounded set of inherited gates by replacing the prior
   current-public literal at build time. Advance that same bounded set from 8.24
   to 8.24.1 so historical capability markers stay untouched while every current
   public allowance follows the patch release. */
const inheritedCurrentIdentityFiles=[
 'postbuild-882-contract.mjs','postbuild-810-contract.mjs','postbuild-8101-contract.mjs','postbuild-8102-contract.mjs','postbuild-8103-contract.mjs',
 'postbuild-891-contract.mjs','postbuild-811-contract.mjs','postbuild-812-contract.mjs','postbuild-813-live-route.mjs','postbuild-8123-contract.mjs','postbuild-8123-field-polish.mjs','postbuild-8124-contract.mjs',
 'postbuild-8131-evolution-contract.mjs','postbuild-814-evolution-contract.mjs','postbuild-815-media-evidence-contract.mjs','postbuild-8151-regression-contract.mjs','postbuild-816-contract.mjs','postbuild-817-contract.mjs','postbuild-8171-source-first-media-contract.mjs',
 'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs',
 'scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs',
 'scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs','scripts/axis-8125-smart-create-polish-smoke.mjs',
 'scripts/axis-8131-evolution-smoke.mjs','scripts/axis-814-evolution-object-smoke.mjs','scripts/axis-815-media-evidence-smoke.mjs','scripts/axis-8151-evidence-swap-smoke.mjs','scripts/axis-8151-regression-seal-smoke.mjs',
 'scripts/axis-816-capture-evidence-smoke.mjs','scripts/axis-8171-source-first-media-smoke.mjs',
 'scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs','scripts/edgeone-prebuilt-verify.mjs',
 'scripts/axis-current-release-contract.mjs','scripts/axis-runtime-foundation-contract.mjs','scripts/axis-deep-compatibility-contract.mjs'
];
let inheritedIdentityTouches=0;
for(const f of inheritedCurrentIdentityFiles){
 let s=read(f),n=(s.match(/'8\.24'/g)||[]).length;
 if(!n)continue;
 inheritedIdentityTouches+=n;s=s.replaceAll(`'${FROM}'`,`'${VERSION}'`);write(f,s);
}

const identityPairs=[
 [`window.__AXIS_RELEASE__==='${FROM}'`,`window.__AXIS_RELEASE__==='${VERSION}'`],
 [`window.__AXIS_RELEASE__),'${FROM}'`,`window.__AXIS_RELEASE__),'${VERSION}'`],
 [`window.__AXIS_RELEASE__),\"${FROM}\"`,`window.__AXIS_RELEASE__),\"${VERSION}\"`],
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
const candidates=[
 ...fs.readdirSync('.').filter(f=>/^postbuild-.*\.mjs$/.test(f)),
 ...fs.readdirSync('scripts').filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)
].filter(f=>![
 'scripts/axis-repository-contract.mjs',
 'scripts/axis-production-governance-contract.mjs',
 'scripts/axis-version-authority-contract.mjs',
 'scripts/axis-8241-dock-occlusion-smoke.mjs'
].includes(f));
let identityTouches=0;
for(const f of candidates){let s=read(f),next=s;for(const [a,b] of identityPairs){const n=next.split(a).length-1;if(n){identityTouches+=n;next=next.replaceAll(a,b)}}if(next!==s)write(f,next)}
if(inheritedIdentityTouches+identityTouches<12)fail(`public identity convergence suspiciously small: inherited ${inheritedIdentityTouches} + explicit ${identityTouches}`);

{
 const f='scripts/axis-813-build-parity.mjs';let s=read(f);
 if(!s.includes(`'${VERSION}'`))s=once(s,"'8.18','8.19','8.20','8.20.1','8.21','8.22','8.23','8.24'];","'8.18','8.19','8.20','8.20.1','8.21','8.22','8.23','8.24','8.24.1'];",'runtime parity release family');
 write(f,s);
}
{
 const f='governance/owners.json',x=JSON.parse(read(f));x.baselineRelease=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}

/* Fail closed on the exact defect mechanism. */
{
 const css=read('styles/axis-8241-dock-occlusion.css');
 if(!/\.captureDock\s*\{[^}]*contain:none!important/s.test(css))fail('fixed dock containment retirement missing');
 if(/contain:[^;}]*paint/.test(css))fail('paint containment would clip dock overscan');
 if(/linear-gradient/.test(css))fail('dock occlusion curtain must not contain a translucent gradient');
 const app=read('app.js');if((app.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('Encounter append ownership drift');
 const v87=read('v87-runtime.js');for(const action of ['function toggle(id)','function completeSet(id,fromShake=false)','function addSet(id)','function beginHold(id,e)'])if(!v87.includes(action))fail(`v87 action boundary drift ${action}`);
}

console.log(`[AXIS 8.24.1 Dock Occlusion] PASS · ${FROM} → ${VERSION} · opaque overscan · containment fully retired on fixed dock · v87 actions preserved · ${inheritedIdentityTouches} inherited + ${identityTouches} explicit current identity assertion(s) advanced`);
await import('./prepare-825-set-lock.mjs');
