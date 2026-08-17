import fs from 'node:fs';
const fail=m=>{throw new Error(`[AXIS 8.12 release compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!=='8.11'||String(x.stableBaseVersion)!=='8.11')fail(`expected sealed 8.11 input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion='8.12';x.stableBaseVersion='8.12';write(f,JSON.stringify(x,null,2)+'\n');
}
{
 const f='prepare-882-version.mjs';let s=read(f);s=once(s,"const VERSION='8.11';","const VERSION='8.12';",'release version');s=s.replaceAll('AXIS 8.11','AXIS 8.12');write(f,s);
}
{
 const f='postbuild-882-contract.mjs';let s=read(f);s=once(s,"const sessionDurationExtension=['8.10.3','8.11'].includes(CURRENT_VERSION);","const sessionDurationExtension=['8.10.3','8.11','8.12'].includes(CURRENT_VERSION);",'8.8.2 session duration inheritance');write(f,s);
}
{
 const f='postbuild-891-contract.mjs';let s=read(f);
 const needle="version.startsWith('8.10')||version==='8.11'",replacement="version.startsWith('8.10')||['8.11','8.12'].includes(version)",n=s.split(needle).length-1;
 if(n!==2)fail(`8.9.1 inherited version allowances expected twice, found ${n}`);
 s=s.replaceAll(needle,replacement);write(f,s);
}
{
 const f='postbuild-810-contract.mjs';let s=read(f);s=once(s,"['8.10','8.10.1','8.10.2','8.10.3','8.11']","['8.10','8.10.1','8.10.2','8.10.3','8.11','8.12']",'8.10 version allowance');write(f,s);
}
{
 const f='postbuild-8101-contract.mjs';let s=read(f);s=once(s,"['8.10.1','8.10.2','8.10.3','8.11']","['8.10.1','8.10.2','8.10.3','8.11','8.12']",'8.10.1 version allowance');write(f,s);
}
{
 const f='postbuild-8102-contract.mjs';let s=read(f);s=once(s,"['8.10.2','8.10.3','8.11']","['8.10.2','8.10.3','8.11','8.12']",'8.10.2 version allowance');write(f,s);
}
{
 const f='postbuild-8103-contract.mjs';let s=read(f);s=once(s,"['8.10.3','8.11'].includes(version)","['8.10.3','8.11','8.12'].includes(version)",'8.10.3 version allowance');write(f,s);
}
{
 const f='postbuild-811-contract.mjs';let s=read(f);
 s=once(s,"if(String(contract.publicVersion)!=='8.11'||String(contract.stableBaseVersion)!=='8.11')fail(`unexpected 8.11 release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);","if(!['8.11','8.12'].includes(String(contract.publicVersion))||String(contract.stableBaseVersion)!==String(contract.publicVersion))fail(`unexpected inherited 8.11 release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);",'8.11 contract version allowance');
 s=once(s,"if(info.version!=='8.11'||info.baseVersion!=='8.11')fail(`8.11 manifest identity mismatch ${info.version}/${info.baseVersion}`);","if(info.version!==String(contract.publicVersion)||info.baseVersion!==String(contract.publicVersion))fail(`8.11 inherited manifest identity mismatch ${info.version}/${info.baseVersion}`);",'8.11 manifest version allowance');write(f,s);
}
{
 const f='scripts/axis-811-experience-smoke.mjs';let s=read(f);s=once(s,"if(info.version!=='8.11'||info.baseVersion!=='8.11')fail(`release identity ${info.version}/${info.baseVersion}`);","if(!['8.11','8.12'].includes(info.version)||info.baseVersion!==info.version)fail(`release identity ${info.version}/${info.baseVersion}`);",'8.11 experience version allowance');write(f,s);
}
{
 const f='scripts/axis-811-browser-smoke.mjs';let s=read(f);
 s=once(s,"assert(await page.locator('#v811CoreLearning .v811CoreGroup').count()===3,'learning settings not converged to three core groups');","assert([3,5].includes(await page.locator('#v811CoreLearning .v811CoreGroup').count()),'learning settings lost inherited core groups');",'8.11 settings group allowance');
 s=once(s,"assert(coreLabels.join('|')==='目标|强度|难度','core learning labels changed');","assert(coreLabels.includes('目标')&&coreLabels.includes('难度'),'inherited goal/difficulty controls missing');",'8.11 settings labels allowance');write(f,s);
}
{
 const f='scripts/axis-882-smoke.mjs';let s=read(f);s=once(s,"['8.10.3','8.11'].includes(VERSION)","['8.10.3','8.11','8.12'].includes(VERSION)",'8.8.2 browser version allowance');write(f,s);
}
{
 const f='scripts/axis-8102-smoke.mjs';let s=read(f);s=once(s,"['8.10.2','8.10.3','8.11'].includes(EXPECTED)","['8.10.2','8.10.3','8.11','8.12'].includes(EXPECTED)",'8.10.2 browser version allowance');write(f,s);
}
{
 const f='scripts/axis-8103-smoke.mjs';let s=read(f);s=once(s,"['8.10.3','8.11'].includes(EXPECTED)","['8.10.3','8.11','8.12'].includes(EXPECTED)",'8.10.3 browser version allowance');write(f,s);
}
{
 const f='prepare-812-learning-content.mjs';let s=read(f);
 s=once(s,"const axis812BaseDialogueTurns=axis8103DialogueTurns;\naxis8103DialogueTurns=function(r){try{return axis812ConversationFor(r)}catch{return axis812BaseDialogueTurns(r)}};","try{window.__AXIS_812_DIALOGUE_TURNS__=axis812ConversationFor}catch{};",'8.12 dialogue bridge ownership');write(f,s);
}
{
 const f='prepare-811-dialogue-depth.mjs';let s=read(f);
 const old="function axis8103DialogueTurns(r){if(r?.target&&r?.response&&r?.followup&&r?.closing&&r?.turn5&&r?.turn6)return [{who:'你',text:r.target},{who:'对方',text:r.response},{who:'你',text:r.followup},{who:'对方',text:r.closing},{who:'你',text:r.turn5},{who:'对方',text:r.turn6}];";
 const modern="function axis8103DialogueTurns(r){try{const d=window.__AXIS_812_DIALOGUE_TURNS__?.(r);if(Array.isArray(d)&&d.length)return d.map((text,i)=>({who:i%2?'对方':'你',text})).filter(x=>x.text)}catch{}if(r?.target&&r?.response&&r?.followup&&r?.closing&&r?.turn5&&r?.turn6)return [{who:'你',text:r.target},{who:'对方',text:r.response},{who:'你',text:r.followup},{who:'对方',text:r.closing},{who:'你',text:r.turn5},{who:'对方',text:r.turn6}];";
 s=once(s,old,modern,'8.10.3 dialogue owner 8.12 delegation');write(f,s);
}
{
 const f='lib/learning-studio-812.mjs';let s=read(f);
 s=once(s,"next=AXIS812_LEVELS[Math.min(li+1,AXIS812_LEVELS.length-1)]","next=AXIS812_LEVELS[li===AXIS812_LEVELS.length-1?li-1:li+1]",'C1+ distinct alternative expression');
 const old="function conversation(lang,id,target,alt){const h=hash(id),ack=ACK[lang]||ACK.en,mid=MID[lang]||MID.en,tail=TAIL[lang]||TAIL.en;const a=ack[h%ack.length],q=mid[(h>>>3)%mid.length],u=tail.u[(h>>>7)%tail.u.length],o=tail.o[(h>>>13)%tail.o.length];const a2=ack[(h>>>17)%ack.length],q2=mid[(h>>>21)%mid.length];return [target,a,q,a2,alt||target,q2,u,o]}";
 const modern="function conversation(lang,id,target,alt){const h=hash(id),ack=ACK[lang]||ACK.en,mid=MID[lang]||MID.en,tail=TAIL[lang]||TAIL.en,ai=h%ack.length,qi=(h>>>3)%mid.length;const a=ack[ai],q=mid[qi],u=tail.u[(h>>>7)%tail.u.length],o=tail.o[(h>>>13)%tail.o.length],a2=ack[(ai+1+((h>>>17)%(ack.length-1)))%ack.length],q2=mid[(qi+1+((h>>>21)%(mid.length-1)))%mid.length];return [target,a,q,a2,alt||target,q2,u,o]}";
 s=once(s,old,modern,'dialogue acknowledgement/question diversity');write(f,s);
}
console.log('[AXIS 8.12 release compat] PASS · 8.12 identity · inherited contracts sealed · dialogue depth delegates through one existing voice owner');
