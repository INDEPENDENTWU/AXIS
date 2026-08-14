import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root=process.cwd();
const source=path.join(root,'build-hardened.mjs');
const target=path.join(root,'.axis-build-hardened-runtime.mjs');
let code=fs.readFileSync(source,'utf8');
const from='chunkAssets.push({id,file,hash:h,modules:chunk.modules.map(x=>x[0]),bytes:Buffer.byteLength(runner)});';
const to='chunkAssets.push({id:chunk.id,file,hash:h,modules:chunk.modules.map(x=>x[0]),bytes:Buffer.byteLength(runner)});';
const hits=code.split(from).length-1;
if(hits!==1)throw new Error(`AXIS hardened entry expected exactly one known builder fix, found ${hits}`);
code=code.replace(from,to);
fs.writeFileSync(target,code);
try{
  await import(pathToFileURL(target).href+'?run='+Date.now());
}finally{
  try{fs.unlinkSync(target)}catch{}
}
