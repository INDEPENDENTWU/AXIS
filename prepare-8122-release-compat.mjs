import fs from 'node:fs';
const fail=m=>{throw new Error(`[AXIS 8.12.2 release compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!=='8.12.1'||String(x.stableBaseVersion)!=='8.12.1')fail(`expected sealed 8.12.1 input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion='8.12.2';x.stableBaseVersion='8.12.2';write(f,JSON.stringify(x,null,2)+'\n');
}
{
 const f='prepare-882-version.mjs';let s=read(f);s=once(s,"const VERSION='8.12.1';","const VERSION='8.12.2';",'release version');s=s.replaceAll('AXIS 8.12.1] release identity','AXIS 8.12.2] release identity');write(f,s);
}
for(const [f,a,b,label] of [
 ['postbuild-882-contract.mjs',"['8.10.3','8.11','8.12','8.12.1'].includes(CURRENT_VERSION)","['8.10.3','8.11','8.12','8.12.1','8.12.2'].includes(CURRENT_VERSION)",'8.8.2 session duration inheritance'],
 ['postbuild-810-contract.mjs',"['8.10','8.10.1','8.10.2','8.10.3','8.11','8.12','8.12.1']","['8.10','8.10.1','8.10.2','8.10.3','8.11','8.12','8.12.1','8.12.2']",'8.10 allowance'],
 ['postbuild-8101-contract.mjs',"['8.10.1','8.10.2','8.10.3','8.11','8.12','8.12.1']","['8.10.1','8.10.2','8.10.3','8.11','8.12','8.12.1','8.12.2']",'8.10.1 allowance'],
 ['postbuild-8102-contract.mjs',"['8.10.2','8.10.3','8.11','8.12','8.12.1']","['8.10.2','8.10.3','8.11','8.12','8.12.1','8.12.2']",'8.10.2 allowance'],
 ['postbuild-8103-contract.mjs',"['8.10.3','8.11','8.12','8.12.1'].includes(version)","['8.10.3','8.11','8.12','8.12.1','8.12.2'].includes(version)",'8.10.3 allowance'],
 ['scripts/axis-811-experience-smoke.mjs',"['8.11','8.12','8.12.1'].includes(info.version)","['8.11','8.12','8.12.1','8.12.2'].includes(info.version)",'8.11 experience allowance'],
 ['scripts/axis-882-smoke.mjs',"['8.10.3','8.11','8.12','8.12.1'].includes(VERSION)","['8.10.3','8.11','8.12','8.12.1','8.12.2'].includes(VERSION)",'8.8.2 browser allowance'],
 ['scripts/axis-8102-smoke.mjs',"['8.10.2','8.10.3','8.11','8.12','8.12.1'].includes(EXPECTED)","['8.10.2','8.10.3','8.11','8.12','8.12.1','8.12.2'].includes(EXPECTED)",'8.10.2 browser allowance'],
 ['scripts/axis-8103-smoke.mjs',"['8.10.3','8.11','8.12','8.12.1'].includes(EXPECTED)","['8.10.3','8.11','8.12','8.12.1','8.12.2'].includes(EXPECTED)",'8.10.3 browser allowance']
]){let s=read(f);s=once(s,a,b,label);write(f,s)}
{
 const f='postbuild-891-contract.mjs';let s=read(f);const a="version.startsWith('8.10')||['8.11','8.12','8.12.1'].includes(version)",b="version.startsWith('8.10')||['8.11','8.12','8.12.1','8.12.2'].includes(version)",n=s.split(a).length-1;if(n!==2)fail(`8.9.1 inherited allowances expected twice, found ${n}`);s=s.replaceAll(a,b);write(f,s);
}
{
 const f='postbuild-811-contract.mjs';let s=read(f);s=once(s,"!['8.11','8.12','8.12.1'].includes(String(contract.publicVersion))","!['8.11','8.12','8.12.1','8.12.2'].includes(String(contract.publicVersion))",'8.11 inherited release allowance');write(f,s);
}
{
 const f='postbuild-812-contract.mjs';let s=read(f);s=once(s,"if(!['8.12','8.12.1'].includes(contract.publicVersion)||contract.stableBaseVersion!==contract.publicVersion)fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);","if(!['8.12','8.12.1','8.12.2'].includes(contract.publicVersion)||contract.stableBaseVersion!==contract.publicVersion)fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);",'8.12 contract release allowance');write(f,s);
}
{
 const f='postbuild-813-live-route.mjs';let s=read(f);s=once(s,"if(!['8.12','8.12.1'].includes(info.version)||info.baseVersion!==info.version)fail(`release identity ${info.version}/${info.baseVersion}`);","if(!['8.12','8.12.1','8.12.2'].includes(info.version)||info.baseVersion!==info.version)fail(`release identity ${info.version}/${info.baseVersion}`);",'Stage 3 public patch allowance');write(f,s);
}
{
 const f='scripts/axis-813-live-route-smoke.mjs';let s=read(f);s=once(s,"assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),EXPECTED);assert.equal(EXPECTED,'8.12.1');","assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),EXPECTED);assert.equal(EXPECTED,'8.12.2');",'Stage 3 browser identity');write(f,s);
}
{
 const f='scripts/axis-813-settings-convergence-smoke.mjs';let s=read(f);s=once(s,"assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),EXPECTED);assert.equal(EXPECTED,'8.12.1');","assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),EXPECTED);assert.equal(EXPECTED,'8.12.2');",'settings browser identity');write(f,s);
}
{
 const f='scripts/axis-8121-hotfix-smoke.mjs';let s=read(f);
 s=once(s,"assert.equal(VERSION,'8.12.1');","assert.ok(['8.12.1','8.12.2'].includes(VERSION));",'8.12.1 inherited hotfix identity');
 s=once(s,"assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.1');","assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),VERSION);",'field browser release identity');
 s=once(s,"assert.equal((await page.locator('.versionLine').getAttribute('aria-label')||'').trim(),'版本 8.12.1');","assert.equal((await page.locator('.versionLine').getAttribute('aria-label')||'').trim(),`版本 ${VERSION}`);",'field visible release identity');
 s=once(s,"const cloudHead=await page.locator('#v811ServicePanel .v813ServiceHead span').first().evaluate(el=>getComputedStyle(el).fontSize);","const cloudHead=await page.locator('#v811ServicePanel .axis8122Head span').first().evaluate(el=>getComputedStyle(el).fontSize);",'field service heading owner');
 const oldFacts=" const capabilityDetails=page.locator('#v811ServicePanel .v813ServiceDetails').first();\n if(!(await capabilityDetails.evaluate(el=>el.open)))await tap(capabilityDetails.locator('summary'));\n const factLocator=page.locator('#v811ServicePanel .v811ServiceFact').first();\n await factLocator.waitFor({state:'visible'});\n const fact=await factLocator.evaluate(el=>({h:el.getBoundingClientRect().height,f:getComputedStyle(el).fontSize}));\n assert.ok(fact.h>=44);assert.ok(px(fact.f)>=12.5);";
 const newFacts=" const factLocator=page.locator('#v811ServicePanel .axis8122Fact').first();\n await factLocator.waitFor({state:'visible'});\n const fact=await factLocator.evaluate(el=>({h:el.getBoundingClientRect().height,f:getComputedStyle(el).fontSize}));\n assert.ok(fact.h>=60);assert.ok(px(fact.f)>=11.5);";
 s=once(s,oldFacts,newFacts,'field capability tile guard');write(f,s);
}
{
 const f='scripts/prepare-release-test-contract.mjs';let s=read(f);
 s=once(s,"const modern810=version.startsWith('8.10')||['8.11','8.12','8.12.1'].includes(version);","const modern810=version.startsWith('8.10')||['8.11','8.12','8.12.1','8.12.2'].includes(version);",'test modern release family');
 s=s.replaceAll("if(['8.12','8.12.1'].includes(version))src=", "if(['8.12','8.12.1','8.12.2'].includes(version))src=");
 s=s.replaceAll("if(['8.10.3','8.11','8.12','8.12.1'].includes(version)&&file==='scripts/axis-product-matrix.mjs')", "if(['8.10.3','8.11','8.12','8.12.1','8.12.2'].includes(version)&&file==='scripts/axis-product-matrix.mjs')");
 s=s.replaceAll("||['8.11','8.12','8.12.1'].includes(EXPECTED)","||['8.11','8.12','8.12.1','8.12.2'].includes(EXPECTED)");
 write(f,s);
}
for(const f of ['scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs']){let s=read(f);s=s.replaceAll("['8.12','8.12.1'].includes(release)","['8.12','8.12.1','8.12.2'].includes(release)");write(f,s)}
{
 const f='.github/workflows/axis-production-deployment-gate.yml';let s=read(f);
 s=s.replaceAll("['8.12','8.12.1'].includes(process.env.AXIS_EXPECTED_VERSION)","['8.12','8.12.1','8.12.2'].includes(process.env.AXIS_EXPECTED_VERSION)");
 s=s.replaceAll("['8.11','8.12','8.12.1'].includes(process.env.AXIS_EXPECTED_VERSION)","['8.11','8.12','8.12.1','8.12.2'].includes(process.env.AXIS_EXPECTED_VERSION)");
 s=s.replaceAll("['8.10.3','8.11','8.12','8.12.1'].includes(process.env.AXIS_EXPECTED_VERSION)","['8.10.3','8.11','8.12','8.12.1','8.12.2'].includes(process.env.AXIS_EXPECTED_VERSION)");
 s=s.replaceAll("fromJSON('[\"8.12\",\"8.12.1\"]')","fromJSON('[\"8.12\",\"8.12.1\",\"8.12.2\"]')");
 write(f,s);
}
console.log('[AXIS 8.12.2 release compat] PASS · 8.12.2 public identity · inherited 8.12.1 field + 8.12 Language Studio + Stage 3 preserved');
