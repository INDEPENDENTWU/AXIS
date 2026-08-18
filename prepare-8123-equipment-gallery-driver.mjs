import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const APP='app.js';
const PREP='prepare-8123-equipment-gallery-and-picker-fix.mjs';
const fail=m=>{throw new Error(`[AXIS 8.12.3 equipment gallery driver] ${m}`)};
let app=fs.readFileSync(APP,'utf8');
const prepOriginal=fs.readFileSync(PREP,'utf8');
const boundary='function overlayLines(';
const sentinel='function axis8123InstallFieldPolish(){/* AXIS 8.12.3 transient gallery insertion anchor */}\n';
if(!app.includes(boundary))fail('app overlay boundary missing');
if(app.includes('transient gallery insertion anchor'))fail('transient anchor already present');
app=app.replace(boundary,sentinel+boundary);
fs.writeFileSync(APP,app);
const appCommit='syntax(src,FILE);write(FILE,src)';
const countBoundary='function personalEqCount()`;';
if((prepOriginal.split(appCommit).length-1)<1)fail('app transform commit signature missing');
if((prepOriginal.split(countBoundary).length-1)!==1)fail('personal equipment count boundary signature missing');
const prepForBuild=prepOriginal
 .replace(countBoundary,'function personalEqCount`;')
 .replace(appCommit,'write(FILE,src);syntax(src,FILE)');
fs.writeFileSync(PREP,prepForBuild);
let importError=null;
try{
  await import('./prepare-8123-equipment-gallery-and-picker-fix.mjs');
}catch(e){
  importError=e;
  console.error('[AXIS 8.12.3 equipment gallery driver] transformed app syntax diagnostic follows');
  spawnSync(process.execPath,['--check',APP],{stdio:'inherit'});
  try{
    const v61=fs.readFileSync('v61.js','utf8');
    for(const token of ["$('#v8Other').onclick","$('#v8New').onclick","function chooseQuick(id)"]){const i=v61.indexOf(token);if(i>=0){const a=Math.max(0,v61.lastIndexOf('\n',i)+1),b=v61.indexOf('\n',i);console.error('[AXIS 8.12.3 equipment gallery driver] v61 signature:',v61.slice(a,b<0?v61.length:b))}}
  }catch{}
}finally{
  fs.writeFileSync(PREP,prepOriginal);
  let out=fs.readFileSync(APP,'utf8');
  if(!out.includes(sentinel))fail('transient anchor was lost during transform');
  out=out.replace(sentinel,'');
  if(out.includes('transient gallery insertion anchor'))fail('transient anchor survived cleanup');
  if(!importError){try{new Function(out)}catch(e){fail(`clean app syntax ${e.message}`)}}
  fs.writeFileSync(APP,out);
}
if(importError)throw importError;
console.log('[AXIS 8.12.3 equipment gallery driver] PASS · gallery inserted at stable app boundary · count boundary normalized · transient anchor removed');
