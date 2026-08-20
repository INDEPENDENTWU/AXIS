import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.5 release compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);

{
  const f='release-contract.json',x=JSON.parse(read(f));
  if(String(x.publicVersion)!=='8.12.4'||String(x.stableBaseVersion)!=='8.12.4')fail(`expected sealed 8.12.4 input, found ${x.publicVersion}/${x.stableBaseVersion}`);
  x.publicVersion='8.12.5';x.stableBaseVersion='8.12.5';write(f,JSON.stringify(x,null,2)+'\n');
}
{
  const f='prepare-882-version.mjs';let s=read(f);
  const a="const VERSION='8.12.4';",b="const VERSION='8.12.5';";
  if(s.split(a).length-1!==1)fail('release version anchor');
  s=s.replace(a,b).replaceAll('AXIS 8.12.4] release identity','AXIS 8.12.5] release identity');write(f,s);
}

const inherited=[
  'postbuild-882-contract.mjs','postbuild-810-contract.mjs','postbuild-8101-contract.mjs','postbuild-8102-contract.mjs','postbuild-8103-contract.mjs',
  'postbuild-891-contract.mjs','postbuild-811-contract.mjs','postbuild-812-contract.mjs','postbuild-813-live-route.mjs','postbuild-8123-contract.mjs','postbuild-8123-field-polish.mjs','postbuild-8124-contract.mjs',
  'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs',
  'scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs',
  'scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs'
];
for(const f of inherited){let s=read(f);const n=(s.match(/'8\.12\.4'/g)||[]).length;if(!n)fail(`${f} missing inherited 8.12.4 identity`);s=s.replaceAll("'8.12.4'","'8.12.5'");write(f,s)}

for(const f of ['scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs']){
  let s=read(f),a="assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.4');",b="assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.5');";
  const n=s.split(a).length-1;if(n!==1)fail(`${f} release assertion expected once, found ${n}`);s=s.replace(a,b);write(f,s);
}

console.log('[AXIS 8.12.5 release compat] PASS · patch identity advanced · inherited 8.12.4 semantic markers preserved');

await import('./prepare-813-trends-release.mjs');
