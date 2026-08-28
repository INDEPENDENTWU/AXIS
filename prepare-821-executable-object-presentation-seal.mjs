import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.21 Executable Object presentation seal] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let s=fs.readFileSync(FILE,'utf8');

function functionRange(src,signature,label){
 const start=src.indexOf(signature);if(start<0)fail(`${label} signature missing`);if(src.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);
 const brace=src.indexOf('{',start+signature.length-1);if(brace<0)fail(`${label} opening brace missing`);
 let depth=0,quote='',escaped=false,line=false,block=false,end=-1;
 for(let i=brace;i<src.length;i++){
  const ch=src[i],next=src[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++;}continue}
  if(quote){if(escaped){escaped=false;continue}if(ch==='\\'){escaped=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++;else if(ch==='}'&&--depth===0){end=i+1;break}
 }
 if(end<0)fail(`${label} closing brace missing`);
 return{start,end,text:src.slice(start,end)};
}
function replaceFunction(src,signature,replacement,label){const r=functionRange(src,signature,label);return src.slice(0,r.start)+replacement+src.slice(r.end)}

/* Timeline, active-session list and session-detail event rows all reuse
 * eventHtml(). It must therefore render immutable Encounter schema facts instead
 * of re-deriving a strength/cardio legacy shape from Object kind. Legacy records
 * remain supported by axis821EventMetricSummary()'s no-snapshot fallback. */
s=replaceFunction(
 s,
 'function eventHtml(e)',
 `function eventHtml(e){const ph='<div class="ph">'+esc((e?.name||'').slice(0,1))+'</div>',meta=axis821EventMetricSummary(e);return '<button class="event" data-event="'+esc(e.id)+'"><span class="thumb" data-thumb="'+esc(e.id)+'">'+ph+'</span><span><strong>'+esc(e.name)+'</strong><small>'+esc(meta)+'</small></span><time>'+tlabel(e.time)+'</time></button>'}`,
 'schema-aware timeline event renderer'
);

const eventHtml=functionRange(s,'function eventHtml(e)','timeline event renderer').text;
if(!eventHtml.includes('axis821EventMetricSummary(e)'))fail('timeline does not delegate to immutable Encounter summary');
if(eventHtml.includes("e.kind==='strength'")||eventHtml.includes('e.weight')||eventHtml.includes('e.reps'))fail('legacy strength facts survived in timeline renderer');
if((s.match(/function axis821EventMetricSummary\(e\)/g)||[]).length!==1)fail('schema summary helper must remain singular');

/* Explicit empty schema is authoritative. The presentation helper may only use
 * legacy fallback when metricSchemaSnapshot is absent (null), never when [] was
 * frozen by the Encounter writer. */
const entries=functionRange(s,'function axis821EventMetricEntries(e)','Encounter metric entries').text;
if(!entries.includes("Array.isArray(e?.metricSchemaSnapshot)?e.metricSchemaSnapshot:null"))fail('immutable schema snapshot authority drift');
if(!entries.includes('if(schema===null)'))fail('legacy fallback must be absence-only');

try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 Executable Object presentation seal] PASS · timeline/session rows render Encounter schema facts · legacy fallback absence-only · no strength/cardio hard-code');
