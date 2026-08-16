import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10.3 release compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
 const f='release-contract.json',x=JSON.parse(read(f));x.publicVersion='8.10.3';x.stableBaseVersion='8.10.3';write(f,JSON.stringify(x,null,2)+'\n');
}
{
 const f='prepare-882-version.mjs';let s=read(f);
 s=once(s,"const VERSION='8.10.2';","const VERSION='8.10.3';",'release version');
 s=s.replaceAll('AXIS 8.10.2','AXIS 8.10.3');
 write(f,s);
}
{
 const f='postbuild-810-contract.mjs';let s=read(f);
 s=once(s,"if(!['8.10','8.10.1','8.10.2'].includes(version))","if(!['8.10','8.10.1','8.10.2','8.10.3'].includes(version))",'8.10 inherited version allowance');
 write(f,s);
}
{
 const f='postbuild-8101-contract.mjs';let s=read(f);
 s=once(s,"if(!['8.10.1','8.10.2'].includes(version))","if(!['8.10.1','8.10.2','8.10.3'].includes(version))",'8.10.1 inherited version allowance');
 write(f,s);
}
{
 const f='postbuild-8102-contract.mjs';let s=read(f);
 s=once(s,"const contract=JSON.parse(read('release-contract.json')),runtime=read('axis-core.js'),css=read('axis-style.css'),info=JSON.parse(read('axis-build.json'));","const contract=JSON.parse(read('release-contract.json')),runtime=read('axis-core.js'),css=read('axis-style.css'),info=JSON.parse(read('axis-build.json')),version=String(contract.publicVersion||'');",'8.10.2 inherited version variable');
 s=once(s,"if(String(contract.publicVersion)!=='8.10.2')fail(`unexpected public version ${contract.publicVersion}`);","if(!['8.10.2','8.10.3'].includes(version))fail(`unexpected public version ${contract.publicVersion}`);",'8.10.2 inherited version allowance');
 s=once(s,"if(info.version!=='8.10.2'||info.baseVersion!=='8.10.2')fail(`release identity mismatch ${info.version}/${info.baseVersion}`);","if(info.version!==version||info.baseVersion!==version)fail(`release identity mismatch ${info.version}/${info.baseVersion}`);",'8.10.2 inherited manifest identity');
 write(f,s);
}
{
 const f='prepare-8103-home-sound.mjs';let s=read(f);
 const old=` src=once(src,"parts.push('完成于 '+tlabel(end));","parts.unshift('开始 '+tlabel(last.start));parts.push('完成 '+tlabel(end));",'completed start/end facts');`;
 const next=` if(src.includes("parts.push('完成于 '+tlabel(end));"))src=src.replace("parts.push('完成于 '+tlabel(end));","parts.unshift('开始 '+tlabel(last.start));parts.push('完成 '+tlabel(end));");else{src=once(src,"return{...base,scope:'complete'","parts.unshift('开始 '+tlabel(last.start));return{...base,scope:'complete'",'completed start fact fallback');src=src.replaceAll('完成于 ','完成 ')}`;
 s=once(s,old,next,'Home completed-facts compiler compatibility');
 s=once(s,"const dial=$('#axisNowDial');if(dial)dial.hidden=!x.dial;","const axis8103DialEl=$('#axisNowDial');if(axis8103DialEl)axis8103DialEl.hidden=!x.dial;",'unique Home dial binding');
 s=once(s,"const due=Math.max(0,Number(a.estimateMs)||0);","const due=Math.max(60000,Number(a.estimateMs)||0);",'normalized item countdown floor');
 s=once(s,"elapsed(a,t)>=due&&!D.querySelector('#v87Hold.show')","elapsed(a)>=due&&!D.querySelector('#v87Hold.show')",'inherited countdown suppression signature');
 write(f,s);
}

console.log('[AXIS 8.10.3 release compat] PASS · release identity + inherited item countdown + 8.10.x contracts preserved');
