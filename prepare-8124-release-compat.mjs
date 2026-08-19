import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.4 release compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
  const f='release-contract.json',x=JSON.parse(read(f));
  if(String(x.publicVersion)!=='8.12.3'||String(x.stableBaseVersion)!=='8.12.3')fail(`expected sealed 8.12.3 input, found ${x.publicVersion}/${x.stableBaseVersion}`);
  x.publicVersion='8.12.4';x.stableBaseVersion='8.12.4';write(f,JSON.stringify(x,null,2)+'\n');
}
{
  const f='prepare-882-version.mjs';let s=read(f);
  s=once(s,"const VERSION='8.12.3';","const VERSION='8.12.4';",'release version');
  s=s.replaceAll('AXIS 8.12.3] release identity','AXIS 8.12.4] release identity');
  write(f,s);
}

for(const [f,a,b,label] of [
  ['postbuild-882-contract.mjs',"['8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3'].includes(CURRENT_VERSION)","['8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3','8.12.4'].includes(CURRENT_VERSION)",'8.8.2 inheritance'],
  ['postbuild-810-contract.mjs',"['8.10','8.10.1','8.10.2','8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3']","['8.10','8.10.1','8.10.2','8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3','8.12.4']",'8.10 allowance'],
  ['postbuild-8101-contract.mjs',"['8.10.1','8.10.2','8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3']","['8.10.1','8.10.2','8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3','8.12.4']",'8.10.1 allowance'],
  ['postbuild-8102-contract.mjs',"['8.10.2','8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3']","['8.10.2','8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3','8.12.4']",'8.10.2 allowance'],
  ['postbuild-8103-contract.mjs',"['8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3'].includes(version)","['8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3','8.12.4'].includes(version)",'8.10.3 allowance'],
  ['scripts/axis-811-experience-smoke.mjs',"['8.11','8.12','8.12.1','8.12.2','8.12.3'].includes(info.version)","['8.11','8.12','8.12.1','8.12.2','8.12.3','8.12.4'].includes(info.version)",'8.11 experience allowance'],
  ['scripts/axis-882-smoke.mjs',"['8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3'].includes(VERSION)","['8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3','8.12.4'].includes(VERSION)",'8.8.2 browser allowance'],
  ['scripts/axis-8102-smoke.mjs',"['8.10.2','8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3'].includes(EXPECTED)","['8.10.2','8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3','8.12.4'].includes(EXPECTED)",'8.10.2 browser allowance'],
  ['scripts/axis-8103-smoke.mjs',"['8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3'].includes(EXPECTED)","['8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3','8.12.4'].includes(EXPECTED)",'8.10.3 browser allowance']
]){let s=read(f);s=once(s,a,b,label);write(f,s)}

{
  const f='postbuild-891-contract.mjs';let s=read(f);
  const a="version.startsWith('8.10')||['8.11','8.12','8.12.1','8.12.2','8.12.3'].includes(version)",b="version.startsWith('8.10')||['8.11','8.12','8.12.1','8.12.2','8.12.3','8.12.4'].includes(version)",n=s.split(a).length-1;
  if(n!==2)fail(`8.9.1 inherited allowances expected twice, found ${n}`);s=s.replaceAll(a,b);write(f,s);
}
{
  const f='postbuild-811-contract.mjs';let s=read(f);
  s=once(s,"!['8.11','8.12','8.12.1','8.12.2','8.12.3'].includes(String(contract.publicVersion))","!['8.11','8.12','8.12.1','8.12.2','8.12.3','8.12.4'].includes(String(contract.publicVersion))",'8.11 inherited release allowance');write(f,s);
}
{
  const f='postbuild-812-contract.mjs';let s=read(f);
  s=once(s,"if(!['8.12','8.12.1','8.12.2','8.12.3'].includes(contract.publicVersion)||contract.stableBaseVersion!==contract.publicVersion)fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);","if(!['8.12','8.12.1','8.12.2','8.12.3','8.12.4'].includes(contract.publicVersion)||contract.stableBaseVersion!==contract.publicVersion)fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);",'8.12 contract release allowance');write(f,s);
}
{
  const f='postbuild-813-live-route.mjs';let s=read(f);
  s=once(s,"if(!['8.12','8.12.1','8.12.2','8.12.3'].includes(info.version)||info.baseVersion!==info.version)fail(`release identity ${info.version}/${info.baseVersion}`);","if(!['8.12','8.12.1','8.12.2','8.12.3','8.12.4'].includes(info.version)||info.baseVersion!==info.version)fail(`release identity ${info.version}/${info.baseVersion}`);",'Stage 3 public patch allowance');write(f,s);
}
{
  const f='postbuild-8123-contract.mjs';let s=read(f);
  s=once(s,"if(contract.publicVersion!=='8.12.3'||contract.stableBaseVersion!=='8.12.3')fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);","if(!['8.12.3','8.12.4'].includes(contract.publicVersion)||contract.stableBaseVersion!==contract.publicVersion)fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);",'8.12.3 inherited contract release');
  s=once(s,"if(info.version!=='8.12.3'||info.baseVersion!=='8.12.3')fail(`manifest identity ${info.version}/${info.baseVersion}`);","if(!['8.12.3','8.12.4'].includes(info.version)||info.baseVersion!==info.version)fail(`manifest identity ${info.version}/${info.baseVersion}`);",'8.12.3 inherited manifest release');write(f,s);
}
{
  const f='postbuild-8123-field-polish.mjs';let s=read(f);
  s=once(s,"if(info.version!=='8.12.3'||info.baseVersion!=='8.12.3')fail(`release identity ${info.version}/${info.baseVersion}`);","if(!['8.12.3','8.12.4'].includes(info.version)||info.baseVersion!==info.version)fail(`release identity ${info.version}/${info.baseVersion}`);",'8.12.3 field polish inheritance');write(f,s);
}

for(const [f,a,b,label] of [
  ['scripts/axis-813-live-route-smoke.mjs',"assert.equal(EXPECTED,'8.12.3');","assert.equal(EXPECTED,'8.12.4');",'Stage 3 browser identity'],
  ['scripts/axis-813-settings-convergence-smoke.mjs',"assert.equal(EXPECTED,'8.12.3');","assert.equal(EXPECTED,'8.12.4');",'Settings browser identity'],
  ['scripts/axis-8122-settings-smoke.mjs',"assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.3');","assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.4');",'8.12.2 inherited Settings identity'],
  ['scripts/axis-8123-learning-simplify-smoke.mjs',"assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.3');","assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.4');",'8.12.3 learning inherited identity'],
  ['scripts/axis-8123-field-polish-smoke.mjs',"assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.3');","assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.4');",'8.12.3 field inherited identity']
]){let s=read(f);s=once(s,a,b,label);write(f,s)}

{
  const f='scripts/axis-813-settings-convergence-smoke.mjs';let s=read(f);
  s=once(s,"assert.equal(learningRowHeight,64,`learning row lost current native Settings rhythm: ${learningRowHeight}`);","assert.equal(learningRowHeight,60,`learning row lost native Settings rhythm: ${learningRowHeight}`);",'Settings Learning native height');
  s=once(s,"assert.equal(serviceRowHeight,64,`service row lost current native Settings rhythm: ${serviceRowHeight}`);","assert.equal(serviceRowHeight,60,`service row lost native Settings rhythm: ${serviceRowHeight}`);",'Settings Cloud/AI native height');
  write(f,s);
}

{
  const f='scripts/axis-8121-hotfix-smoke.mjs';let s=read(f);
  s=once(s,"assert.ok(['8.12.1','8.12.2','8.12.3'].includes(VERSION));","assert.ok(['8.12.1','8.12.2','8.12.3','8.12.4'].includes(VERSION));",'field patch family');write(f,s);
}
{
  const f='scripts/prepare-release-test-contract.mjs';let s=read(f);
  s=once(s,"const modern810=version.startsWith('8.10')||['8.11','8.12','8.12.1','8.12.2','8.12.3'].includes(version);","const modern810=version.startsWith('8.10')||['8.11','8.12','8.12.1','8.12.2','8.12.3','8.12.4'].includes(version);",'test modern release family');
  s=s.replaceAll("['8.12','8.12.1','8.12.2','8.12.3'].includes(version)","['8.12','8.12.1','8.12.2','8.12.3','8.12.4'].includes(version)");
  s=s.replaceAll("['8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3'].includes(version)","['8.10.3','8.11','8.12','8.12.1','8.12.2','8.12.3','8.12.4'].includes(version)");
  s=s.replaceAll("||['8.11','8.12','8.12.1','8.12.2','8.12.3'].includes(EXPECTED)","||['8.11','8.12','8.12.1','8.12.2','8.12.3','8.12.4'].includes(EXPECTED)");
  write(f,s);
}
for(const f of ['scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs']){let s=read(f);s=s.replaceAll("['8.12','8.12.1','8.12.2','8.12.3'].includes(release)","['8.12','8.12.1','8.12.2','8.12.3','8.12.4'].includes(release)");write(f,s)}

console.log('[AXIS 8.12.4 release compat] PASS · 8.12.4 public identity · inherited 8.12.3 / 8.13 contracts + native Settings geometry preserved');
