import fs from 'node:fs';

const APP='app.js';
const fail=m=>{throw new Error(`[AXIS 8.12.3 equipment gallery driver] ${m}`)};
let app=fs.readFileSync(APP,'utf8');
const boundary='function overlayLines(';
const sentinel='function axis8123InstallFieldPolish(){/* AXIS 8.12.3 transient gallery insertion anchor */}\n';
if(!app.includes(boundary))fail('app overlay boundary missing');
if(app.includes('transient gallery insertion anchor'))fail('transient anchor already present');
app=app.replace(boundary,sentinel+boundary);
fs.writeFileSync(APP,app);
try{
  await import('./prepare-8123-equipment-gallery-and-picker-fix.mjs');
}finally{
  let out=fs.readFileSync(APP,'utf8');
  if(!out.includes(sentinel))fail('transient anchor was lost during transform');
  out=out.replace(sentinel,'');
  if(out.includes('transient gallery insertion anchor'))fail('transient anchor survived cleanup');
  try{new Function(out)}catch(e){fail(`clean app syntax ${e.message}`)}
  fs.writeFileSync(APP,out);
}
console.log('[AXIS 8.12.3 equipment gallery driver] PASS · gallery inserted at stable app boundary · transient anchor removed');
