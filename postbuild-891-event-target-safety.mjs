import fs from 'node:fs';
import crypto from 'node:crypto';

const fail=m=>{throw new Error(`[AXIS 8.9.1 event target] ${m}`)};
const file='axis-core.js',indexFile='index.html',infoFile='axis-build.json';
for(const f of [file,indexFile,infoFile])if(!fs.existsSync(f))fail(`missing ${f}`);
let src=fs.readFileSync(file,'utf8'),count=0;

/* The canonicalizer is allowed to retire helpers, but `$` is querySelector and may
   never be left as a collection receiver. This check deliberately runs AFTER
   postbuild-88-canonical, against the exact runtime that will be deployed. */
function matchingParen(text,open){
 let depth=0,quote='',esc=false,line=false,block=false;
 for(let i=open;i<text.length;i++){
  const ch=text[i],next=text[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}
  if(quote){if(esc){esc=false;continue}if(ch==='\\'){esc=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==="'"||ch==='"'||ch==='`'){quote=ch;continue}
  if(ch==='(')depth++;else if(ch===')'){depth--;if(depth===0)return i}
 }
 return -1;
}
function invalidCollectionSelectors(text){
 const hits=[];let quote='',esc=false,line=false,block=false;
 for(let i=0;i<text.length-1;i++){
  const ch=text[i],next=text[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}
  if(quote){if(esc){esc=false;continue}if(ch==='\\'){esc=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==="'"||ch==='"'||ch==='`'){quote=ch;continue}
  if(ch!=='$'||next!=='('||text[i-1]==='$'||/[\w$]/.test(text[i-1]||''))continue;
  const close=matchingParen(text,i+1);if(close<0)continue;let j=close+1;while(/\s/.test(text[j]||''))j++;
  if(text.startsWith('.forEach',j)){let k=j+8;while(/\s/.test(text[k]||''))k++;if(text[k]==='(')hits.push(i)}
 }
 return hits;
}
const invalid=invalidCollectionSelectors(src);for(let i=invalid.length-1;i>=0;i--)src=src.slice(0,invalid[i])+'$'+src.slice(invalid[i]);
const survivors=invalidCollectionSelectors(src);if(survivors.length)fail(`final canonical $().forEach survived at ${survivors.join(',')}`);

src=src.replace(/\b([A-Za-z_$][\w$]*)\.target\.closest\(/g,(m,eventName)=>{count++;return `${eventName}.target?.closest?.(`});
if(count<1)fail('no canonical delegated closest callsites found to harden');
if(/\b[A-Za-z_$][\w$]*\.target\.closest\(/.test(src))fail('unguarded event target closest survived canonical hardening');
try{new Function(src)}catch(e){fail(`canonical runtime syntax after final hardening: ${e.message}`)}

const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
let html=fs.readFileSync(indexFile,'utf8');const oldHash=(html.match(/\/axis-core\.js\?v=([a-f0-9]+)/)||[])[1];if(!oldHash)fail('axis-core hash missing from index');
const newHash=hash(src);fs.writeFileSync(file,src);html=html.replace(`/axis-core.js?v=${oldHash}`,`/axis-core.js?v=${newHash}`);fs.writeFileSync(indexFile,html);
const info=JSON.parse(fs.readFileSync(infoFile,'utf8'));info.assets=info.assets||{};info.assets.core=newHash;info.gates={...(info.gates||{}),finalCollectionSelectorSafety818:true};info.axis818={...(info.axis818||{}),finalRuntime:{...((info.axis818||{}).finalRuntime||{}),collectionSelectorRepairs:invalid.length,postCanonical:true}};fs.writeFileSync(infoFile,JSON.stringify(info,null,2));
console.log(`[AXIS 8.9.1 event target] PASS · ${count} canonical delegated closest callsites hardened · ${invalid.length} post-canonical collection selector repairs · core ${oldHash}->${newHash}`);
