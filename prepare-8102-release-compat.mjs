import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10.2 release compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
 const f='prepare-882-version.mjs';let s=read(f);
 s=once(s,"const VERSION='8.10.1';","const VERSION='8.10.2';",'release version');
 s=s.replaceAll('AXIS 8.10.1','AXIS 8.10.2');
 write(f,s);
}
{
 const f='postbuild-891-contract.mjs';let s=read(f);
 s=once(s,"[\"patch:'${patch}',owner:'passive-rest-reader'\",'Rest Speak patch marker missing'],","[\"patch:'${patch}',owner:'passive-rest-reader'\",'Rest Speak patch marker missing'],",'preserve rest-speak inherited marker');
 s=once(s,"[\"patch:'8.9.1',stableShell:true\",'stable detail shell marker missing']","[\"patch:'8.10.2',stableShell:true\",'stable detail shell marker missing']",'refined detail shell marker');
 write(f,s);
}
{
 const f='postbuild-810-contract.mjs';let s=read(f);
 s=once(s,"if(!['8.10','8.10.1'].includes(version))","if(!['8.10','8.10.1','8.10.2'].includes(version))",'8.10 inherited version allowance');
 write(f,s);
}
{
 const f='postbuild-8101-contract.mjs';let s=read(f);
 s=once(s,"const contract=JSON.parse(read('release-contract.json')),runtime=read('axis-core.js'),css=read('axis-style.css'),info=JSON.parse(read('axis-build.json'));","const contract=JSON.parse(read('release-contract.json')),runtime=read('axis-core.js'),css=read('axis-style.css'),info=JSON.parse(read('axis-build.json')),version=String(contract.publicVersion||'');",'8.10.1 inherited version variable');
 s=once(s,"if(String(contract.publicVersion)!=='8.10.1')fail(`unexpected public version ${contract.publicVersion}`);","if(!['8.10.1','8.10.2'].includes(version))fail(`unexpected public version ${contract.publicVersion}`);",'8.10.1 inherited version allowance');
 s=once(s,"if(info.version!=='8.10.1'||info.baseVersion!=='8.10.1')fail(`release identity mismatch ${info.version}/${info.baseVersion}`);","if(info.version!==version||info.baseVersion!==version)fail(`release identity mismatch ${info.version}/${info.baseVersion}`);",'8.10.1 inherited manifest identity');
 write(f,s);
}

console.log('[AXIS 8.10.2 release compat] PASS · inherited contracts preserved across refined detail + learning surfaces');
