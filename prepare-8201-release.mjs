import fs from 'node:fs';

const FROM='8.20',VERSION='8.20.1';
const fail=m=>{throw new Error(`[AXIS 8.20.1 release] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const replaceIdentity=(f,required=true)=>{let s=read(f),n=(s.match(/'8\.20'/g)||[]).length;if(required&&!n)fail(`${f} missing inherited ${FROM} identity`);if(n){s=s.replaceAll(`'${FROM}'`,`'${VERSION}'`);write(f,s)}};

/*
 * 8.20.1 is a reliability seal over the already-proven 8.20 behavior head.
 * It advances only current/public identity. 8.20 Executable Practice Objects,
 * 8.19 UPO, and all earlier capability provenance must keep their historical
 * version markers.
 */
{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!==FROM||String(x.stableBaseVersion)!==FROM)fail(`expected sealed ${FROM} input, found ${x.publicVersion}/${x.stableBaseVersion}`);
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
 s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'canonical postbuild version');
 s=once(s,`document.documentElement.dataset.axisCanonical='${FROM}';`,`document.documentElement.dataset.axisCanonical='${VERSION}';`,'canonical dataset version');
 s=s.replaceAll(`canonical-${FROM}\">`,`canonical-${VERSION}\">`);write(f,s);
}

/* Files below predate 8.20. Any 8.20 literal they carry after the inherited
   8.20 release step is current-public identity only, so it may advance. */
for(const f of [
 'postbuild-882-contract.mjs','postbuild-810-contract.mjs','postbuild-8101-contract.mjs','postbuild-8102-contract.mjs',
 'postbuild-891-contract.mjs','postbuild-811-contract.mjs','postbuild-812-contract.mjs','postbuild-813-live-route.mjs','postbuild-8123-contract.mjs','postbuild-8123-field-polish.mjs','postbuild-8124-contract.mjs',
 'postbuild-8131-evolution-contract.mjs','postbuild-814-evolution-contract.mjs','postbuild-815-media-evidence-contract.mjs','postbuild-8151-regression-contract.mjs','postbuild-816-contract.mjs','postbuild-817-contract.mjs','postbuild-8171-source-first-media-contract.mjs',
 'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs',
 'scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs',
 'scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs','scripts/axis-8125-smart-create-polish-smoke.mjs',
 'scripts/axis-8131-evolution-smoke.mjs','scripts/axis-814-evolution-object-smoke.mjs','scripts/axis-815-media-evidence-smoke.mjs','scripts/axis-8151-evidence-swap-smoke.mjs','scripts/axis-8151-regression-seal-smoke.mjs',
 'scripts/axis-816-capture-evidence-smoke.mjs','scripts/axis-8171-source-first-media-smoke.mjs',
 'scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs','scripts/edgeone-prebuilt-verify.mjs',
 'scripts/axis-current-release-contract.mjs','scripts/axis-runtime-foundation-contract.mjs','scripts/axis-deep-compatibility-contract.mjs'
])replaceIdentity(f,false);

/* 8.10.3 freshness provenance remains 8.18. Only current release assertions
   may advance from 8.20 to 8.20.1. */
{
 const f='postbuild-8103-contract.mjs';let s=read(f);
 const freshnessLiteral="window.__AXIS_8103_FRESHNESS__={version:'8.18',eventDriven:true,polling:false";
 const releaseMarker="releaseMarker:freshnessCurrent?'8.18':'8.10.3'";
 if(!s.includes(freshnessLiteral)||!s.includes(releaseMarker))fail('8.10.3 freshness provenance drift');
 let touched=0;
 s=s.split('\n').map(line=>{
  if(!line.includes('contract.publicVersion')&&!line.includes('info.version'))return line;
  const next=line.replace(/8\.20/g,()=>{touched++;return VERSION});return next;
 }).join('\n');
 if(!touched)fail('8.10.3 current 8.20 identity assertions not found');
 if(!s.includes(freshnessLiteral)||!s.includes(releaseMarker))fail('8.10.3 freshness provenance was relabeled');
 write(f,s);
}

/* 8.18 capability contract remains historical; only public/current assertions
   advance. */
{
 const f='postbuild-818-contract.mjs';let s=read(f);
 s=once(s,"if(contract.publicVersion!=='8.20'||contract.stableBaseVersion!=='8.20')","if(contract.publicVersion!=='8.20.1'||contract.stableBaseVersion!=='8.20.1')",'8.18 contract public/base identity');
 s=once(s,"if(info.version!=='8.20'||info.baseVersion!=='8.20')","if(info.version!=='8.20.1'||info.baseVersion!=='8.20.1')",'8.18 contract manifest identity');
 for(const marker of ['objectMetricSchema818:true','eventMetricSnapshot818:true','pwaRouteTruth818:true','capturePreferenceModel818:true','activeFocusLayer818:true','continuousCameraCompositor818:true','videoWatermark30fps818:true','noNewPersistence818:true','info.axis818={foundation:true'])if(!s.includes(marker))fail(`8.18 semantic provenance drift · ${marker}`);
 write(f,s);
}

/* Historical 8.17/8.18 physical regression suites follow public 8.20.1 while
   preserving their module identities. */
{
 const f='scripts/axis-817-interaction-smoke.mjs';let s=read(f);
 s=once(s,"window.__AXIS_RELEASE__==='8.20'","window.__AXIS_RELEASE__==='8.20.1'",'8.17 smoke public runtime identity');
 s=once(s,"assert.equal(manifest.version,'8.20');assert.equal(manifest.baseVersion,'8.20');","assert.equal(manifest.version,'8.20.1');assert.equal(manifest.baseVersion,'8.20.1');",'8.17 smoke public manifest identity');
 if(!s.includes("window.__AXIS_817_INTERACTION__?.version==='8.17'"))fail('8.17 historical interaction module identity drift');
 write(f,s);
}
{
 const f='scripts/axis-818-object-focus-smoke.mjs';let s=read(f);
 s=once(s,"window.__AXIS_RELEASE__==='8.20'","window.__AXIS_RELEASE__==='8.20.1'",'8.18 smoke public runtime wait');
 s=once(s,"assert.equal(boot.release,'8.20','public runtime identity did not converge')","assert.equal(boot.release,'8.20.1','public runtime identity did not converge')",'8.18 smoke public boot identity');
 s=once(s,"assert.equal(manifest.version,'8.20');assert.equal(manifest.baseVersion,'8.20');","assert.equal(manifest.version,'8.20.1');assert.equal(manifest.baseVersion,'8.20.1');",'8.18 smoke public manifest identity');
 for(const marker of ["boot.object,'8.18'","boot.hardening,'8.18'","boot.media,'8.18'","boot.focus,'8.18'","boot.evolution,'8.18'","boot.quick,'8.18'","boot.polish?.version,'8.18'"])if(!s.includes(marker))fail(`8.18 historical marker drift · ${marker}`);
 write(f,s);
}

/* 8.20.1's own physical reliability smoke follows the newly sealed public
   identity while still requiring the historical 8.20 executable module. */
{
 const f='scripts/axis-8201-object-reliability-smoke.mjs';let s=read(f);
 s=once(s,"assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.20');","assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.20.1');",'8.20.1 smoke public runtime identity');
 if(!s.includes("window.__AXIS_EXECUTABLE_OBJECTS__?.version==='8.20'"))fail('8.20 executable module provenance drift');
 write(f,s);
}

/* Explicit provenance seals: these strings must survive the identity advance. */
const provenanceCorpus=[
 read('prepare-820-executable-practice-objects.mjs'),
 read('prepare-8201-object-reliability.mjs'),
 read('postbuild-819-upo-seal.mjs'),
 read('postbuild-8201-active-lifecycle-seal.mjs')
].join('\n');
for(const marker of [
 "version:'8.20'",
 "version:'8.20.1'",
 'universalPracticeObjectFinalReset819',
 'v61EncounterSchemaAuthority819',
 'activeTruthEncounterSchemaAuthority819',
 'activeLifecycleExecutionMode8201'
])if(!provenanceCorpus.includes(marker))fail(`historical capability provenance drift · ${marker}`);

console.log('[AXIS 8.20.1 release] PASS · public/base 8.20.1 · 8.20 executable behavior + 8.19 UPO provenance preserved · no runtime ownership change');
