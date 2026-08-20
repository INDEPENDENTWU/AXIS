import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.13 trends release] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);

{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!=='8.12.5'||String(x.stableBaseVersion)!=='8.12.5')fail(`expected sealed 8.12.5 input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion='8.13';x.stableBaseVersion='8.13';write(f,JSON.stringify(x,null,2)+'\n');
}
{
 const f='prepare-882-version.mjs';let s=read(f),a="const VERSION='8.12.5';",b="const VERSION='8.13';";
 if(s.split(a).length-1!==1)fail('release version anchor');s=s.replace(a,b).replaceAll('AXIS 8.12.5] release identity','AXIS 8.13] release identity');write(f,s);
}

const inherited=[
 'postbuild-882-contract.mjs','postbuild-810-contract.mjs','postbuild-8101-contract.mjs','postbuild-8102-contract.mjs','postbuild-8103-contract.mjs',
 'postbuild-891-contract.mjs','postbuild-811-contract.mjs','postbuild-812-contract.mjs','postbuild-813-live-route.mjs','postbuild-8123-contract.mjs','postbuild-8123-field-polish.mjs','postbuild-8124-contract.mjs',
 'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs',
 'scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs',
 'scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs'
];
for(const f of inherited){let s=read(f);const n=(s.match(/'8\.12\.5'/g)||[]).length;if(!n)fail(`${f} missing inherited 8.12.5 identity`);s=s.replaceAll("'8.12.5'","'8.13'");write(f,s)}

for(const f of ['scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs']){
 let s=read(f),a="assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.5');",b="assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.13');";
 const n=s.split(a).length-1;if(n!==1)fail(`${f} release assertion expected once, found ${n}`);s=s.replace(a,b);write(f,s);
}
{
 const f='scripts/axis-8125-smart-create-polish-smoke.mjs';let s=read(f);
 const a="await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_8125_SMART_CREATE_POLISH__?.version==='8.12.5',undefined,{timeout:12000});\n assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.5');";
 const b="await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_8125_SMART_CREATE_POLISH__?.version==='8.12.5',undefined,{timeout:12000});\n assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.13');";
 if(s.split(a).length-1!==1)fail('8.12.5 smart-create inherited release anchor');s=s.replace(a,b);write(f,s);
}
console.log('[AXIS 8.13 trends release] PASS · public/base 8.13 · inherited 8.12.5 training/catalog/custom-equipment semantics preserved');
