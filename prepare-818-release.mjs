import fs from 'node:fs';

const FROM='8.17',VERSION='8.18';
const fail=m=>{throw new Error(`[AXIS 8.18 release] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const replaceIdentity=(f,required=true)=>{let s=read(f),n=(s.match(/'8\.17'/g)||[]).length;if(required&&!n)fail(`${f} missing inherited ${FROM} identity`);if(n){s=s.replaceAll(`'${FROM}'`,`'${VERSION}'`);write(f,s)}};

{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!==FROM||String(x.stableBaseVersion)!==FROM)fail(`expected sealed ${FROM} input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion=VERSION;x.stableBaseVersion=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}

/* prepare-882-version has already executed by this late final-field stage. Advance the
   actual remaining build/postbuild identity owners directly; do not rely on a script
   that has already run. */
{
 const f='build-hardened.mjs';let s=read(f);s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'hardened build version');write(f,s);
}
{
 const f='postbuild-features-hardened.mjs';let s=read(f);s=once(s,`const TARGET_VERSION='${FROM}';`,`const TARGET_VERSION='${VERSION}';`,'feature manifest version');write(f,s);
}
{
 const f='postbuild-88-canonical.mjs';let s=read(f);
 s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'canonical postbuild version');
 s=once(s,`document.documentElement.dataset.axisCanonical='${FROM}';`,`document.documentElement.dataset.axisCanonical='${VERSION}';`,'canonical dataset version');
 s=s.replaceAll(`canonical-${FROM}">`,`canonical-${VERSION}">`);write(f,s);
}

/* Inherited contracts keep their historical scope but validate the current public build identity. */
for(const f of [
 'postbuild-882-contract.mjs','postbuild-810-contract.mjs','postbuild-8101-contract.mjs','postbuild-8102-contract.mjs','postbuild-8103-contract.mjs',
 'postbuild-891-contract.mjs','postbuild-811-contract.mjs','postbuild-812-contract.mjs','postbuild-813-live-route.mjs','postbuild-8123-contract.mjs','postbuild-8123-field-polish.mjs','postbuild-8124-contract.mjs',
 'postbuild-8131-evolution-contract.mjs','postbuild-814-evolution-contract.mjs','postbuild-815-media-evidence-contract.mjs','postbuild-8151-regression-contract.mjs','postbuild-816-contract.mjs','postbuild-817-contract.mjs','postbuild-8171-source-first-media-contract.mjs',
 'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs',
 'scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs',
 'scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs','scripts/axis-8125-smart-create-polish-smoke.mjs',
 'scripts/axis-8131-evolution-smoke.mjs','scripts/axis-814-evolution-object-smoke.mjs','scripts/axis-815-media-evidence-smoke.mjs','scripts/axis-8151-evidence-swap-smoke.mjs','scripts/axis-8151-regression-seal-smoke.mjs',
 'scripts/axis-816-capture-evidence-smoke.mjs','scripts/axis-8171-source-first-media-smoke.mjs',
 'scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs','scripts/edgeone-prebuilt-verify.mjs'
])replaceIdentity(f,false);

/* 8.17 interaction smoke has two different identities in the same file:
   public release follows 8.18, while the inherited module marker remains 8.17. */
{
 const f='scripts/axis-817-interaction-smoke.mjs';let s=read(f);
 s=once(s,"window.__AXIS_RELEASE__==='8.17'","window.__AXIS_RELEASE__==='8.18'",'8.17 smoke public runtime identity');
 s=once(s,"assert.equal(manifest.version,'8.17');assert.equal(manifest.baseVersion,'8.17');","assert.equal(manifest.version,'8.18');assert.equal(manifest.baseVersion,'8.18');",'8.17 smoke public manifest identity');
 if(!s.includes("window.__AXIS_817_INTERACTION__?.version==='8.17'"))fail('8.17 historical interaction module identity drift');
 write(f,s);
}

console.log('[AXIS 8.18 release] PASS · public/base 8.18 · historical module identities preserved · hardened build/canonical manifest owners advanced · 8.17.1 factual/media foundations inherited');
