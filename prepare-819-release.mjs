import fs from 'node:fs';

const FROM='8.18',VERSION='8.19';
const fail=m=>{throw new Error(`[AXIS 8.19 release] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const replaceIdentity=(f,required=true)=>{let s=read(f),n=(s.match(/'8\.18'/g)||[]).length;if(required&&!n)fail(`${f} missing inherited ${FROM} identity`);if(n){s=s.replaceAll(`'${FROM}'`,`'${VERSION}'`);write(f,s)}};

{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!==FROM||String(x.stableBaseVersion)!==FROM)fail(`expected sealed ${FROM} input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion=VERSION;x.stableBaseVersion=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}

/* 8.18 is already assembled by the inherited deterministic chain. Advance only
   the public/current build identity owners here; historical capability markers
   remain at the release that introduced them. */
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
 s=s.replaceAll(`canonical-${FROM}\">`,`canonical-${VERSION}\">`);write(f,s);
}

/* These inherited contracts/smokes only gained 8.18 as their current-public
   identity during the 8.18 release seal. Their historical module identities are
   older and therefore remain untouched by this replacement. */
for(const f of [
 'postbuild-882-contract.mjs','postbuild-810-contract.mjs','postbuild-8101-contract.mjs','postbuild-8102-contract.mjs',
 'postbuild-891-contract.mjs','postbuild-811-contract.mjs','postbuild-812-contract.mjs','postbuild-813-live-route.mjs','postbuild-8123-contract.mjs','postbuild-8123-field-polish.mjs','postbuild-8124-contract.mjs',
 'postbuild-8131-evolution-contract.mjs','postbuild-814-evolution-contract.mjs','postbuild-815-media-evidence-contract.mjs','postbuild-8151-regression-contract.mjs','postbuild-816-contract.mjs','postbuild-817-contract.mjs','postbuild-8171-source-first-media-contract.mjs',
 'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs',
 'scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs',
 'scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs','scripts/axis-8125-smart-create-polish-smoke.mjs',
 'scripts/axis-8131-evolution-smoke.mjs','scripts/axis-814-evolution-object-smoke.mjs','scripts/axis-815-media-evidence-smoke.mjs','scripts/axis-8151-evidence-swap-smoke.mjs','scripts/axis-8151-regression-seal-smoke.mjs',
 'scripts/axis-816-capture-evidence-smoke.mjs','scripts/axis-8171-source-first-media-smoke.mjs',
 'scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs','scripts/edgeone-prebuilt-verify.mjs'
])replaceIdentity(f,false);

/* 8.10.3 freshness was deliberately re-sealed in 8.18. Its freshness marker is
   provenance, while the contract/manifest checks are current-release assertions.
   Target those assertion lines semantically so inherited quote/format transforms
   cannot make the release seal brittle. */
{
 const f='postbuild-8103-contract.mjs';let s=read(f);
 const freshnessLiteral="window.__AXIS_8103_FRESHNESS__={version:'8.18',eventDriven:true,polling:false";
 const releaseMarker="releaseMarker:freshnessCurrent?'8.18':'8.10.3'";
 if(!s.includes(freshnessLiteral))fail('8.18 freshness provenance drift');
 if(!s.includes(releaseMarker))fail('8.18 freshness manifest provenance drift');
 let touched=0;
 s=s.split('\n').map(line=>{
   if(!line.includes('contract.publicVersion')&&!line.includes('info.version'))return line;
   const next=line.replace(/8\.\d+(?:\.\d+)?/g,()=>{touched++;return VERSION});
   return next;
 }).join('\n');
 if(touched<2)fail(`8.10.3 current identity assertions not found, touched ${touched}`);
 if(!s.includes(`contract.publicVersion)!=='${VERSION}'`)&&!s.includes(`contract.publicVersion!==\"${VERSION}\"`))fail('8.10.3 public contract did not advance');
 if(!s.includes(`info.version!=='${VERSION}'`)&&!s.includes(`info.version!==\"${VERSION}\"`))fail('8.10.3 manifest contract did not advance');
 if(!s.includes(freshnessLiteral))fail('8.18 freshness provenance was relabeled');
 if(!s.includes(releaseMarker))fail('8.18 freshness manifest provenance was relabeled');
 write(f,s);
}

/* 8.17 regression smoke carries both the public release and its own historical
   8.17 interaction marker. Advance only the public release checks. */
{
 const f='scripts/axis-817-interaction-smoke.mjs';let s=read(f);
 s=once(s,"window.__AXIS_RELEASE__==='8.18'","window.__AXIS_RELEASE__==='8.19'",'8.17 smoke public runtime identity');
 s=once(s,"assert.equal(manifest.version,'8.18');assert.equal(manifest.baseVersion,'8.18');","assert.equal(manifest.version,'8.19');assert.equal(manifest.baseVersion,'8.19');",'8.17 smoke public manifest identity');
 if(!s.includes("window.__AXIS_817_INTERACTION__?.version==='8.17'"))fail('8.17 historical interaction module identity drift');
 write(f,s);
}

/* 8.18 Object/Focus regression must run against the 8.19 public artifact while
   keeping every 8.18 capability/schema marker historically truthful. */
{
 const f='scripts/axis-818-object-focus-smoke.mjs';let s=read(f);
 s=once(s,"window.__AXIS_RELEASE__==='8.18'","window.__AXIS_RELEASE__==='8.19'",'8.18 smoke public runtime wait');
 s=once(s,"assert.equal(boot.release,'8.18','public runtime identity did not converge')","assert.equal(boot.release,'8.19','public runtime identity did not converge')",'8.18 smoke public boot identity');
 s=once(s,"assert.equal(manifest.version,'8.18');assert.equal(manifest.baseVersion,'8.18');","assert.equal(manifest.version,'8.19');assert.equal(manifest.baseVersion,'8.19');",'8.18 smoke public manifest identity');
 for(const marker of ["boot.object,'8.18'","boot.hardening,'8.18'","boot.media,'8.18'","boot.focus,'8.18'","boot.evolution,'8.18'","boot.quick,'8.18'","boot.polish?.version,'8.18'"])if(!s.includes(marker))fail(`8.18 historical marker drift · ${marker}`);
 write(f,s);
}

console.log('[AXIS 8.19 release] PASS · public/base 8.19 · 8.18 capability provenance preserved · inherited Chromium/WebKit regression identities advanced');
