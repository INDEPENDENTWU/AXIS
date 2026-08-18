import fs from 'node:fs';
const fail=m=>{throw new Error(`[AXIS 8.12.1 release compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!=='8.12'||String(x.stableBaseVersion)!=='8.12')fail(`expected sealed 8.12 input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion='8.12.1';x.stableBaseVersion='8.12.1';write(f,JSON.stringify(x,null,2)+'\n');
}
{
 const f='prepare-882-version.mjs';let s=read(f);s=once(s,"const VERSION='8.12';","const VERSION='8.12.1';",'release version');s=s.replaceAll('AXIS 8.12] release identity','AXIS 8.12.1] release identity');write(f,s);
}
{
 const f='postbuild-882-contract.mjs';let s=read(f);s=once(s,"['8.10.3','8.11','8.12'].includes(CURRENT_VERSION)","['8.10.3','8.11','8.12','8.12.1'].includes(CURRENT_VERSION)",'8.8.2 session duration inheritance');write(f,s);
}
{
 const f='postbuild-891-contract.mjs';let s=read(f);const a="version.startsWith('8.10')||['8.11','8.12'].includes(version)",b="version.startsWith('8.10')||['8.11','8.12','8.12.1'].includes(version)",n=s.split(a).length-1;if(n!==2)fail(`8.9.1 inherited version allowances expected twice, found ${n}`);s=s.replaceAll(a,b);write(f,s);
}
for(const [f,a,b,label] of [
 ['postbuild-810-contract.mjs',"['8.10','8.10.1','8.10.2','8.10.3','8.11','8.12']","['8.10','8.10.1','8.10.2','8.10.3','8.11','8.12','8.12.1']",'8.10 allowance'],
 ['postbuild-8101-contract.mjs',"['8.10.1','8.10.2','8.10.3','8.11','8.12']","['8.10.1','8.10.2','8.10.3','8.11','8.12','8.12.1']",'8.10.1 allowance'],
 ['postbuild-8102-contract.mjs',"['8.10.2','8.10.3','8.11','8.12']","['8.10.2','8.10.3','8.11','8.12','8.12.1']",'8.10.2 allowance'],
 ['postbuild-8103-contract.mjs',"['8.10.3','8.11','8.12'].includes(version)","['8.10.3','8.11','8.12','8.12.1'].includes(version)",'8.10.3 allowance'],
 ['scripts/axis-811-experience-smoke.mjs',"['8.11','8.12'].includes(info.version)","['8.11','8.12','8.12.1'].includes(info.version)",'8.11 experience allowance'],
 ['scripts/axis-882-smoke.mjs',"['8.10.3','8.11','8.12'].includes(VERSION)","['8.10.3','8.11','8.12','8.12.1'].includes(VERSION)",'8.8.2 browser allowance'],
 ['scripts/axis-8102-smoke.mjs',"['8.10.2','8.10.3','8.11','8.12'].includes(EXPECTED)","['8.10.2','8.10.3','8.11','8.12','8.12.1'].includes(EXPECTED)",'8.10.2 browser allowance'],
 ['scripts/axis-8103-smoke.mjs',"['8.10.3','8.11','8.12'].includes(EXPECTED)","['8.10.3','8.11','8.12','8.12.1'].includes(EXPECTED)",'8.10.3 browser allowance']
]){let s=read(f);s=once(s,a,b,label);write(f,s)}
{
 const f='postbuild-811-contract.mjs';let s=read(f);s=once(s,"!['8.11','8.12'].includes(String(contract.publicVersion))","!['8.11','8.12','8.12.1'].includes(String(contract.publicVersion))",'8.11 inherited release allowance');write(f,s);
}
{
 const f='postbuild-812-contract.mjs';let s=read(f);
 s=once(s,"if(contract.publicVersion!=='8.12'||contract.stableBaseVersion!=='8.12')fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);","if(!['8.12','8.12.1'].includes(contract.publicVersion)||contract.stableBaseVersion!==contract.publicVersion)fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);",'8.12 contract release allowance');
 s=once(s,"if(info.version!=='8.12'||info.baseVersion!=='8.12')fail(`manifest identity ${info.version}/${info.baseVersion}`);","if(info.version!==contract.publicVersion||info.baseVersion!==contract.publicVersion)fail(`manifest identity ${info.version}/${info.baseVersion}`);",'8.12 contract manifest allowance');write(f,s);
}
{
 const f='scripts/prepare-release-test-contract.mjs';let s=read(f);
 s=once(s,"const modern810=version.startsWith('8.10')||['8.11','8.12'].includes(version);","const modern810=version.startsWith('8.10')||['8.11','8.12','8.12.1'].includes(version);",'test modern release family');
 s=s.replaceAll("if(version==='8.12')src=", "if(['8.12','8.12.1'].includes(version))src=");
 s=s.replaceAll("if(['8.10.3','8.11','8.12'].includes(version)&&file==='scripts/axis-product-matrix.mjs')", "if(['8.10.3','8.11','8.12','8.12.1'].includes(version)&&file==='scripts/axis-product-matrix.mjs')");
 s=s.replaceAll("||['8.11','8.12'].includes(EXPECTED)","||['8.11','8.12','8.12.1'].includes(EXPECTED)");
 write(f,s);
}
for(const f of ['scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs']){
 let s=read(f);s=s.replaceAll("release==='8.12'","['8.12','8.12.1'].includes(release)");write(f,s);
}
{
 const f='.github/workflows/axis-production-deployment-gate.yml';let s=read(f);
 s=s.replaceAll("process.env.AXIS_EXPECTED_VERSION==='8.12'","['8.12','8.12.1'].includes(process.env.AXIS_EXPECTED_VERSION)");
 s=s.replaceAll("['8.11','8.12'].includes(process.env.AXIS_EXPECTED_VERSION)","['8.11','8.12','8.12.1'].includes(process.env.AXIS_EXPECTED_VERSION)");
 s=s.replaceAll("if: env.AXIS_EXPECTED_VERSION == '8.12'","if: contains(fromJSON('[\"8.12\",\"8.12.1\"]'), env.AXIS_EXPECTED_VERSION)");
 write(f,s);
}
console.log('[AXIS 8.12.1 release compat] PASS · 8.12.1 public identity · inherited 8.12 Language Studio semantics preserved');
