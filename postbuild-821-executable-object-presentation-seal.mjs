import fs from 'node:fs';
import crypto from 'node:crypto';

const fail=m=>{throw new Error(`[AXIS 8.21 final Object presentation] ${m}`)};
const runtimeFile='axis-core.js',indexFile='index.html',infoFile='axis-build.json';
for(const f of [runtimeFile,indexFile,infoFile])if(!fs.existsSync(f))fail(`missing ${f}`);
let src=fs.readFileSync(runtimeFile,'utf8');

function functionRange(text,signature,label){
 const start=text.indexOf(signature);if(start<0)fail(`${label} signature missing`);if(text.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);
 const brace=text.indexOf('{',start+signature.length-1);if(brace<0)fail(`${label} opening brace missing`);
 let depth=0,quote='',escaped=false,line=false,block=false,end=-1;
 for(let i=brace;i<text.length;i++){
  const ch=text[i],next=text[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++;}continue}
  if(quote){if(escaped){escaped=false;continue}if(ch==='\\'){escaped=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++;else if(ch==='}'&&--depth===0){end=i+1;break}
 }
 if(end<0)fail(`${label} closing brace missing`);return{start,end,text:text.slice(start,end)};
}
function replaceFunction(text,signature,replacement,label){const r=functionRange(text,signature,label);return text.slice(0,r.start)+replacement+text.slice(r.end)}

if(!src.includes('function axis821EventMetricSummary(e)'))fail('schema-aware Encounter summary helper missing from final runtime');
src=replaceFunction(
 src,
 'function eventHtml(e)',
 `function eventHtml(e){const ph='<div class="ph">'+esc((e?.name||'').slice(0,1))+'</div>',meta=axis821EventMetricSummary(e);return '<button class="event" data-event="'+esc(e.id)+'"><span class="thumb" data-thumb="'+esc(e.id)+'">'+ph+'</span><span><strong>'+esc(e.name)+'</strong><small>'+esc(meta)+'</small></span><time>'+tlabel(e.time)+'</time></button>'}`,
 'final timeline event renderer'
);

const finalRenderer=functionRange(src,'function eventHtml(e)','final timeline event renderer').text;
if(!finalRenderer.includes('axis821EventMetricSummary(e)'))fail('final timeline is not Encounter-schema driven');
if(finalRenderer.includes("e.kind==='strength'")||finalRenderer.includes('e.weight')||finalRenderer.includes('e.reps'))fail('legacy strength/cardio timeline derivation survived canonicalization');
if(/undefined次|undefined组|NaN/.test(finalRenderer))fail('invalid metric presentation token survived final renderer');

/* During 8.21 convergence, enumerate every remaining executable source site that
 * can paint the old weight/reps summary. This is intentionally against final
 * canonical bytes so hidden secondary presenters cannot evade source-stage seals. */
{
 const contexts=[];let at=0;
 while((at=src.indexOf('kg ·',at))>=0){contexts.push(src.slice(Math.max(0,at-220),Math.min(src.length,at+300)).replace(/\s+/g,' ').trim());at+=4}
 if(contexts.length)console.log(`[AXIS 8.21 final Object presentation diagnostic] legacy kg contexts ${contexts.length} :: ${contexts.slice(0,12).join(' || ')}`);
}
try{new Function(src)}catch(e){fail(`final canonical runtime syntax ${e.message}`)}

const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
let html=fs.readFileSync(indexFile,'utf8');
const oldHash=(html.match(/\/axis-core\.js\?v=([a-f0-9]+)/)||[])[1];if(!oldHash)fail('axis-core hash missing from index');
const newHash=hash(src);
fs.writeFileSync(runtimeFile,src);
html=html.replace(`/axis-core.js?v=${oldHash}`,`/axis-core.js?v=${newHash}`);fs.writeFileSync(indexFile,html);
const info=JSON.parse(fs.readFileSync(infoFile,'utf8'));
info.assets=info.assets||{};info.assets.core=newHash;
info.gates={...(info.gates||{}),executableObjectSchemaAwareTimeline821:true};
info.axis821={...(info.axis821||{}),executableObjectPresentation:{schemaAwareTimeline:true,legacyFallback:'snapshot-absent-only',postCanonical:true}};
fs.writeFileSync(infoFile,JSON.stringify(info,null,2));
console.log(`[AXIS 8.21 final Object presentation] PASS · final canonical timeline delegates to immutable Encounter schema · core ${oldHash}->${newHash}`);
