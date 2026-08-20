import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.4 optional custom muscle] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);

{
 const f='app.js';let s=read(f);
 const old="if(!name)return toast('请输入名称');if(!muscles.length)return toast('请选择锻炼部位');if(editCustomId){";
 const next="if(!name)return toast('请输入名称');if(editCustomId){";
 if(!s.includes(old))fail('canonical custom save validation boundary missing');
 s=s.replace(old,next);
 if(s.includes("if(!muscles.length)return toast('请选择锻炼部位')"))fail('required-muscle validation survived');
 try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}
 write(f,s);
}

{
 const f='v873-smart-input.js';let s=read(f);
 if(!s.includes('__AXIS_8124_CUSTOM_SAFE__'))fail('safe custom profile must be installed first');
 if(s.includes('__AXIS_8124_CUSTOM_OPTIONAL_MUSCLE__'))fail('optional muscle seal already installed');
 const end=s.lastIndexOf('})();');if(end<0)fail('v873 IIFE end missing');
 const block=String.raw`
/* AXIS 8.12.4 — optional custom anatomy without hiding manual anatomy controls. */
(function axis8124OptionalCustomMuscle(){
 if(D.querySelector('#axis8124OptionalCustomMuscleStyle'))return;
 const st=D.createElement('style');st.id='axis8124OptionalCustomMuscleStyle';
 st.textContent='#customEqSheet #customMuscles{display:flex!important;visibility:visible!important;opacity:1!important;min-height:38px}#customEqSheet #customMuscles>[data-muscle]{display:block!important;visibility:visible!important;opacity:1!important}';
 (D.head||D.documentElement).appendChild(st)
})();
try{window.__AXIS_8124_CUSTOM_OPTIONAL_MUSCLE__={version:'8.12.4',required:false,manualChoicesPreserved:true,trainingOwner:false}}catch{}
`;
 s=s.slice(0,end)+block+'\n'+s.slice(end);
 try{new Function(s)}catch(e){fail(`v873 syntax ${e.message}`)}
 write(f,s);
}

console.log('[AXIS 8.12.4 optional custom muscle] PASS · unknown custom movements may save without anatomy · manual anatomy choices remain available');
