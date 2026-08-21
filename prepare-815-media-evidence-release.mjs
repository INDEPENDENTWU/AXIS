import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.15 Media Evidence release] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!=='8.14'||String(x.stableBaseVersion)!=='8.14')fail(`expected sealed 8.14 input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion='8.15';x.stableBaseVersion='8.15';write(f,JSON.stringify(x,null,2)+'\n');
}
{
 const f='prepare-882-version.mjs';let s=read(f);
 s=once(s,"const VERSION='8.14';","const VERSION='8.15';",'release version anchor');
 s=s.replaceAll('AXIS 8.14] release identity','AXIS 8.15] release identity');write(f,s);
}

const inherited=[
 'postbuild-882-contract.mjs','postbuild-810-contract.mjs','postbuild-8101-contract.mjs','postbuild-8102-contract.mjs','postbuild-8103-contract.mjs',
 'postbuild-891-contract.mjs','postbuild-811-contract.mjs','postbuild-812-contract.mjs','postbuild-813-live-route.mjs','postbuild-8123-contract.mjs','postbuild-8123-field-polish.mjs','postbuild-8124-contract.mjs',
 'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs',
 'scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs',
 'scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs'
];
for(const f of inherited){let s=read(f);const n=(s.match(/'8\.14'/g)||[]).length;if(!n)fail(`${f} missing inherited 8.14 identity`);s=s.replaceAll("'8.14'","'8.15'");write(f,s)}

for(const f of ['scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs','scripts/axis-8125-smart-create-polish-smoke.mjs']){
 let s=read(f);s=once(s,"assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.14');","assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.15');",`${f} current release assertion`);write(f,s);
}
{
 const f='scripts/axis-8131-evolution-smoke.mjs';let s=read(f);
 s=once(s,"assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.14');","assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.15');",'8.13.1 inherited smoke public identity');
 if(!s.includes("window.__AXIS_8131_EVOLUTION_FIELD__?.version==='8.13.1'")||!s.includes("window.__AXIS_EVOLUTION__?.version==='8.13.1'"))fail('8.13.1 inherited module identity must remain sealed');
 write(f,s);
}
{
 const f='scripts/axis-814-evolution-object-smoke.mjs';let s=read(f);
 s=once(s,"assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.14');","assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.15');",'8.14 inherited smoke public identity');
 if(!s.includes("window.__AXIS_814_EVOLUTION_OBJECTS__?.version==='8.14'")||!s.includes("window.__AXIS_EVOLUTION_OBJECTS__?.version==='8.14'"))fail('8.14 inherited module identity must remain sealed');
 write(f,s);
}
{
 const f='postbuild-8131-evolution-contract.mjs';let s=read(f);
 s=once(s,"if(contract.publicVersion!=='8.14'||contract.stableBaseVersion!=='8.14')","if(contract.publicVersion!=='8.15'||contract.stableBaseVersion!=='8.15')",'8.13.1 inherited postbuild release contract');
 s=once(s,"if(info.version!=='8.14'||info.baseVersion!=='8.14')","if(info.version!=='8.15'||info.baseVersion!=='8.15')",'8.13.1 inherited postbuild manifest contract');
 write(f,s);
}
{
 const f='postbuild-814-evolution-contract.mjs';let s=read(f);
 s=once(s,"if(contract.publicVersion!=='8.14'||contract.stableBaseVersion!=='8.14')","if(contract.publicVersion!=='8.15'||contract.stableBaseVersion!=='8.15')",'8.14 inherited postbuild release contract');
 s=once(s,"if(info.version!=='8.14'||info.baseVersion!=='8.14')","if(info.version!=='8.15'||info.baseVersion!=='8.15')",'8.14 inherited postbuild manifest contract');
 write(f,s);
}

console.log('[AXIS 8.15 Media Evidence release] PASS · public/base 8.15 · 8.14 Evolution Objects remain inherited · Media Evidence becomes current product layer');
await import('./prepare-8151-regression-release.mjs');
