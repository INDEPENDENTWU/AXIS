import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.11 release compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!=='8.10.3'||String(x.stableBaseVersion)!=='8.10.3')fail(`expected sealed 8.10.3 input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion='8.11';x.stableBaseVersion='8.11';write(f,JSON.stringify(x,null,2)+'\n');
}
{
 const f='prepare-882-version.mjs';let s=read(f);
 s=once(s,"const VERSION='8.10.3';","const VERSION='8.11';",'release version');
 s=s.replaceAll('AXIS 8.10.3','AXIS 8.11');
 write(f,s);
}
{
 const f='postbuild-882-contract.mjs';let s=read(f);
 s=once(s,"const sessionDurationExtension=CURRENT_VERSION==='8.10.3';","const sessionDurationExtension=['8.10.3','8.11'].includes(CURRENT_VERSION);",'8.8.2 inherited session-duration extension allowance');
 write(f,s);
}
{
 const f='postbuild-891-contract.mjs';let s=read(f);
 s=once(s,"if(!(version==='8.9.1'||version.startsWith('8.10')))fail(`unexpected public version ${version}`);","if(!(version==='8.9.1'||version.startsWith('8.10')||version==='8.11'))fail(`unexpected public version ${version}`);",'8.9.1 inherited version allowance');
 s=once(s,"const modern=version.startsWith('8.10'),patch=modern?'8.10':'8.9.1',rich=modern?'richEnglish:456':'richEnglish:72';","const modern=version.startsWith('8.10')||version==='8.11',patch=modern?'8.10':'8.9.1',rich=modern?'richEnglish:456':'richEnglish:72';",'8.9.1 modern curriculum inheritance');
 write(f,s);
}
{
 const f='postbuild-810-contract.mjs';let s=read(f);
 s=once(s,"if(!['8.10','8.10.1','8.10.2','8.10.3'].includes(version))","if(!['8.10','8.10.1','8.10.2','8.10.3','8.11'].includes(version))",'8.10 inherited version allowance');
 write(f,s);
}
{
 const f='postbuild-8101-contract.mjs';let s=read(f);
 s=once(s,"if(!['8.10.1','8.10.2','8.10.3'].includes(version))","if(!['8.10.1','8.10.2','8.10.3','8.11'].includes(version))",'8.10.1 inherited version allowance');
 write(f,s);
}
{
 const f='postbuild-8102-contract.mjs';let s=read(f);
 s=once(s,"if(!['8.10.2','8.10.3'].includes(version))fail(`unexpected public version ${contract.publicVersion}`);","if(!['8.10.2','8.10.3','8.11'].includes(version))fail(`unexpected public version ${contract.publicVersion}`);",'8.10.2 inherited version allowance');
 write(f,s);
}
{
 const f='postbuild-8103-contract.mjs';let s=read(f);
 s=once(s,"const contract=JSON.parse(read('release-contract.json')),runtime=read('axis-core.js'),css=read('axis-style.css'),info=JSON.parse(read('axis-build.json')),vercel=read('vercel.json'),edgeone=read('edgeone.json');","const contract=JSON.parse(read('release-contract.json')),runtime=read('axis-core.js'),css=read('axis-style.css'),info=JSON.parse(read('axis-build.json')),vercel=read('vercel.json'),edgeone=read('edgeone.json'),version=String(contract.publicVersion||'');",'8.10.3 inherited version variable');
 s=once(s,"if(String(contract.publicVersion)!=='8.10.3')fail(`unexpected public version ${contract.publicVersion}`);","if(!['8.10.3','8.11'].includes(version))fail(`unexpected public version ${contract.publicVersion}`);",'8.10.3 inherited version allowance');
 s=once(s,"if(info.version!=='8.10.3'||info.baseVersion!=='8.10.3')fail(`release identity mismatch ${info.version}/${info.baseVersion}`);","if(info.version!==version||info.baseVersion!==version)fail(`release identity mismatch ${info.version}/${info.baseVersion}`);",'8.10.3 inherited manifest identity');
 write(f,s);
}
{
 const f='scripts/axis-8102-smoke.mjs';let s=read(f);
 s=once(s,"assert.ok(['8.10.2','8.10.3'].includes(EXPECTED),`unexpected inherited 8.10.2 release ${EXPECTED}`);","assert.ok(['8.10.2','8.10.3','8.11'].includes(EXPECTED),`unexpected inherited 8.10.2 release ${EXPECTED}`);",'8.10.2 inherited browser version allowance');
 write(f,s);
}
{
 const f='scripts/axis-8103-smoke.mjs';let s=read(f);
 s=once(s,"assert.equal(EXPECTED,'8.10.3');","assert.ok(['8.10.3','8.11'].includes(EXPECTED),`unexpected inherited 8.10.3 release ${EXPECTED}`);",'8.10.3 inherited browser version allowance');
 write(f,s);
}
console.log('[AXIS 8.11 release compat] PASS · 8.11 identity · inherited sound, 8.9.1 learning and 8.10.x capabilities remain sealed');
