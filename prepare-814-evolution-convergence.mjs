import fs from 'node:fs';

const INDEX='index.html',BUILD='build-hardened.mjs',FIELD='v8131-evolution-field.js',OBJECTS='v814-evolution-objects.js';
const fail=m=>{throw new Error(`[AXIS 8.14 Evolution Objects convergence] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

let html=read(INDEX);
if(!html.includes('data-axis-trends-owner="v8131-evolution-field"'))fail('8.13.1 Trends owner must converge first');
html=once(html,'data-axis-trends-owner="v8131-evolution-field"','data-axis-trends-owner="v8131-evolution-field" data-axis-evolution-object-owner="v814-evolution-objects"','Evolution sub-owner');
html=once(html,'<div id="v813Activities"></div>','<div id="v813Activities"></div>\n        <div class="v814Object" id="v814Object" data-axis-evolution-object-owner="v814-evolution-objects" aria-live="polite" hidden></div>','Evolution Object root');
if((html.match(/id="v814Object"/g)||[]).length!==1)fail('Evolution Object root missing or duplicated');
if((html.match(/data-axis-evolution-object-owner="v814-evolution-objects"/g)||[]).length!==2)fail('Evolution Object ownership must exist exactly on Trends and object root');
fs.writeFileSync(INDEX,html);

let field=read(FIELD);
const rowFrom='<div class="v813Activity" data-v813-activity="${i}"><span><b>${esc(eventName(e))}</b><small>${esc(eventData(e))}</small></span><em>${esc(e.kind===\'cardio\'?\'持续\':\'记录\')}</em></div>';
const rowTo='<button type="button" class="v813Activity" data-v813-activity="${i}" data-v814-key="${esc(eventKey(e))}" aria-expanded="false"><span><b>${esc(eventName(e))}</b><small>${esc(eventData(e))}</small></span><em>${esc(e.kind===\'cardio\'?\'持续\':\'记录\')}</em></button>';
field=once(field,rowFrom,rowTo,'semantic activity row');
try{new Function(field)}catch(e){fail(`8.13.1 field syntax after semantic hook: ${e.message}`)}
if(!field.includes('data-v814-key="${esc(eventKey(e))}"'))fail('stable activity identity hook missing');
fs.writeFileSync(FIELD,field);

const objects=read(OBJECTS);
try{new Function(objects)}catch(e){fail(`Evolution Objects source syntax: ${e.message}`)}
for(const needle of ['__AXIS_814_EVOLUTION_OBJECTS__','__AXIS_EVOLUTION_OBJECTS__','firstEncounter','latestEncounter','encounterCount','timeSpanDays','mediaEvidence','factualDelta','data-v814-open','in-place-object'])if(!objects.includes(needle))fail(`Evolution Objects source missing ${needle}`);
for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','fetch(','XMLHttpRequest','new MutationObserver','new ResizeObserver','setInterval('])if(objects.includes(forbidden))fail(`Evolution Objects must stay read-only/pure: ${forbidden}`);
for(const forbidden of ['进步','提升','改善','更好','评分','分数'])if(objects.includes(forbidden))fail(`interpretive/score language survived: ${forbidden}`);

let build=read(BUILD);
const anchor="['v8710-report.js','__AXIS_8710_REPORT_READY__'],['v8710-watermark.js','__AXIS_8710_WATERMARK_READY__'],['v8711-runtime.js','__AXIS_8711_READY__'],['v8131-evolution-field.js','__AXIS_8131_EVOLUTION_READY__']";
const replacement=anchor+",['v814-evolution-objects.js','__AXIS_814_EVOLUTION_OBJECTS_READY__']";
build=once(build,anchor,replacement,'first-class Evolution Object module');
fs.writeFileSync(BUILD,build);

console.log('[AXIS 8.14 Evolution Objects convergence] PASS · semantic activity rows · in-place object sub-owner · read-only factual first/latest projection · first-class module');
