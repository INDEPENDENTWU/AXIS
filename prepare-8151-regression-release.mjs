import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.15.1 regression release] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!=='8.15'||String(x.stableBaseVersion)!=='8.15')fail(`expected sealed 8.15 input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion='8.15.1';x.stableBaseVersion='8.15.1';write(f,JSON.stringify(x,null,2)+'\n');
}
{
 const f='prepare-882-version.mjs';let s=read(f);
 s=once(s,"const VERSION='8.15';","const VERSION='8.15.1';",'release version anchor');
 s=s.replaceAll('AXIS 8.15] release identity','AXIS 8.15.1] release identity');write(f,s);
}

const inherited=[
 'postbuild-882-contract.mjs','postbuild-810-contract.mjs','postbuild-8101-contract.mjs','postbuild-8102-contract.mjs','postbuild-8103-contract.mjs',
 'postbuild-891-contract.mjs','postbuild-811-contract.mjs','postbuild-812-contract.mjs','postbuild-813-live-route.mjs','postbuild-8123-contract.mjs','postbuild-8123-field-polish.mjs','postbuild-8124-contract.mjs',
 'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs',
 'scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs',
 'scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs'
];
for(const f of inherited){let s=read(f);const n=(s.match(/'8\.15'/g)||[]).length;if(!n)fail(`${f} missing inherited 8.15 identity`);s=s.replaceAll("'8.15'","'8.15.1'");write(f,s)}

for(const f of ['scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs','scripts/axis-8125-smart-create-polish-smoke.mjs']){
 let s=read(f);s=once(s,"assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.15');","assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.15.1');",`${f} current release assertion`);write(f,s);
}
for(const [f,label] of [['scripts/axis-8131-evolution-smoke.mjs','8.13.1'],['scripts/axis-814-evolution-object-smoke.mjs','8.14'],['scripts/axis-815-media-evidence-smoke.mjs','8.15']]){
 let s=read(f);s=once(s,"assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.15');","assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.15.1');",`${label} inherited smoke public identity`);write(f,s);
}
for(const f of ['postbuild-8131-evolution-contract.mjs','postbuild-814-evolution-contract.mjs','postbuild-815-media-evidence-contract.mjs']){
 let s=read(f);
 s=once(s,"contract.publicVersion!=='8.15'||contract.stableBaseVersion!=='8.15'","contract.publicVersion!=='8.15.1'||contract.stableBaseVersion!=='8.15.1'",`${f} release contract`);
 s=once(s,"info.version!=='8.15'||info.baseVersion!=='8.15'","info.version!=='8.15.1'||info.baseVersion!=='8.15.1'",`${f} manifest contract`);
 write(f,s);
}

console.log('[AXIS 8.15.1 regression release] PASS · public/base 8.15.1 · 8.15 Media Evidence inherited unchanged · cold-start/watermark ownership hotfix current');
await import('./prepare-816-release.mjs');
