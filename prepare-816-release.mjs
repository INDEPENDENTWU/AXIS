import fs from 'node:fs';

const FROM='8.15.1',VERSION='8.16';
const fail=m=>{throw new Error(`[AXIS 8.16 release] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!==FROM||String(x.stableBaseVersion)!==FROM)fail(`expected sealed ${FROM} input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion=VERSION;x.stableBaseVersion=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}
{
 const f='prepare-882-version.mjs';let s=read(f);
 s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'release version anchor');
 s=s.replaceAll(`AXIS ${FROM}] release identity`,`AXIS ${VERSION}] release identity`);write(f,s);
}

const inherited=[
 'postbuild-882-contract.mjs','postbuild-810-contract.mjs','postbuild-8101-contract.mjs','postbuild-8102-contract.mjs','postbuild-8103-contract.mjs',
 'postbuild-891-contract.mjs','postbuild-811-contract.mjs','postbuild-812-contract.mjs','postbuild-813-live-route.mjs','postbuild-8123-contract.mjs','postbuild-8123-field-polish.mjs','postbuild-8124-contract.mjs',
 'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs',
 'scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs',
 'scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs'
];
for(const f of inherited){let s=read(f);const n=(s.match(/'8\.15\.1'/g)||[]).length;if(!n)fail(`${f} missing inherited ${FROM} identity`);s=s.replaceAll(`'${FROM}'`,`'${VERSION}'`);write(f,s)}

for(const f of ['scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs','scripts/axis-8125-smart-create-polish-smoke.mjs']){
 let s=read(f);s=once(s,`assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'${FROM}');`,`assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'${VERSION}');`,`${f} current release assertion`);write(f,s);
}
for(const [f,label] of [
 ['scripts/axis-8131-evolution-smoke.mjs','8.13.1'],
 ['scripts/axis-814-evolution-object-smoke.mjs','8.14'],
 ['scripts/axis-815-media-evidence-smoke.mjs','8.15'],
 ['scripts/axis-8151-evidence-swap-smoke.mjs','8.15.1 evidence swap']
]){
 let s=read(f);s=once(s,`assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'${FROM}');`,`assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'${VERSION}');`,`${label} inherited smoke public identity`);write(f,s);
}
{
 const f='scripts/axis-8151-regression-seal-smoke.mjs';let s=read(f);
 s=once(s,`assert.equal(x.release,'${FROM}');`,`assert.equal(x.release,'${VERSION}');`,'8.15.1 regression inherited public identity');write(f,s);
}
for(const f of ['postbuild-8131-evolution-contract.mjs','postbuild-814-evolution-contract.mjs','postbuild-815-media-evidence-contract.mjs','postbuild-8151-regression-contract.mjs']){
 let s=read(f);
 s=once(s,`contract.publicVersion!=='${FROM}'||contract.stableBaseVersion!=='${FROM}'`,`contract.publicVersion!=='${VERSION}'||contract.stableBaseVersion!=='${VERSION}'`,`${f} release contract`);
 s=once(s,`info.version!=='${FROM}'||info.baseVersion!=='${FROM}'`,`info.version!=='${VERSION}'||info.baseVersion!=='${VERSION}'`,`${f} manifest contract`);
 if(f==='postbuild-815-media-evidence-contract.mjs')s=once(s,"'首尾对照'","'对照'",'8.16 expanded comparison entry copy');
 write(f,s);
}
{
 const f='scripts/edgeone-prebuilt-verify.mjs';let s=read(f);
 s=once(s,`manifest.version!=='${FROM}'||manifest.baseVersion!=='${FROM}'`,`manifest.version!=='${VERSION}'||manifest.baseVersion!=='${VERSION}'`,'EdgeOne release identity');
 s=s.replace(`verified exact AXIS ${FROM} regression-sealed canonical artifact`,`verified exact AXIS ${VERSION} Capture + Comparative Evidence canonical artifact`);
 write(f,s);
}

console.log('[AXIS 8.16 release] PASS · public/base 8.16 · 8.15.1 regression seal inherited · Capture Field + Comparative Evidence current');
await import('./prepare-816-test-convergence.mjs');
await import('./prepare-817-release.mjs');
