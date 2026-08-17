import fs from 'node:fs';
import crypto from 'node:crypto';

const fail=m=>{throw new Error(`[AXIS 8.12 field postbuild] ${m}`)};
const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const interactionFile='axis-enhance-interaction.js',coreFile='axis-core.js',indexFile='index.html',infoFile='axis-build.json';
for(const f of [interactionFile,coreFile,indexFile,infoFile])if(!fs.existsSync(f))fail(`missing ${f}`);

let interaction=fs.readFileSync(interactionFile,'utf8');
const stale="b.onclick=()=>openEdit(id);host.appendChild(b);queueMicrotask(prune);setTimeout(prune,120)}}";
const live="b.onclick=()=>{const current=activeId();if(current)openEdit(current)};host.appendChild(b);queueMicrotask(prune);setTimeout(prune,120)}}";
const count=interaction.split(stale).length-1;
if(count!==1)fail(`stale active-adjust closure expected once after kernel convergence, found ${count}`);
interaction=interaction.replace(stale,live);
if(interaction.includes('b.onclick=()=>openEdit(id)'))fail('captured active event id survived interaction hardening');
if(!interaction.includes('const current=activeId();if(current)openEdit(current)'))fail('live active-event resolver missing');
try{new Function(interaction)}catch(e){fail(`interaction syntax ${e.message}`)}

let core=fs.readFileSync(coreFile,'utf8'),html=fs.readFileSync(indexFile,'utf8');
const oldInteractionHash=(core.match(/\/axis-enhance-interaction\.js\?v=([a-f0-9]+)/)||[])[1];
const oldCoreHash=(html.match(/\/axis-core\.js\?v=([a-f0-9]+)/)||[])[1];
if(!oldInteractionHash||!oldCoreHash)fail('generated asset hash references missing');
const newInteractionHash=hash(interaction);
fs.writeFileSync(interactionFile,interaction);
core=core.replace(`/axis-enhance-interaction.js?v=${oldInteractionHash}`,`/axis-enhance-interaction.js?v=${newInteractionHash}`);
try{new Function(core)}catch(e){fail(`core syntax ${e.message}`)}
const newCoreHash=hash(core);
fs.writeFileSync(coreFile,core);
html=html.replace(`/axis-core.js?v=${oldCoreHash}`,`/axis-core.js?v=${newCoreHash}`);
fs.writeFileSync(indexFile,html);

const info=JSON.parse(fs.readFileSync(infoFile,'utf8'));
info.assets=info.assets||{};info.assets.core=newCoreHash;
if(Array.isArray(info.assets.chunks)){
 const x=info.assets.chunks.find(v=>v.id==='interaction');
 if(!x)fail('interaction chunk metadata missing');
 x.hash=newInteractionHash;
}
info.gates={...(info.gates||{}),activeAdjustResolvesCurrentEvent:true};
fs.writeFileSync(infoFile,JSON.stringify(info,null,2));

console.log(`[AXIS 8.12 field postbuild] PASS · active adjustment resolves current event · interaction ${oldInteractionHash}->${newInteractionHash} · core ${oldCoreHash}->${newCoreHash}`);
