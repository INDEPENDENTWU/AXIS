import fs from 'node:fs';

const INDEX='index.html',BUILD='build-hardened.mjs',APP='app.js',OBJECTS='v814-evolution-objects.js',MEDIA='v815-media-evidence.js';
const fail=m=>{throw new Error(`[AXIS 8.15 Media Evidence convergence] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

let html=read(INDEX);
if(!html.includes('data-axis-trends-owner="v8131-evolution-field" data-axis-evolution-object-owner="v814-evolution-objects"'))fail('8.14 Evolution Object ownership must converge first');
html=once(html,'data-axis-trends-owner="v8131-evolution-field" data-axis-evolution-object-owner="v814-evolution-objects"','data-axis-trends-owner="v8131-evolution-field" data-axis-evolution-object-owner="v814-evolution-objects" data-axis-media-evidence-owner="v815-media-evidence"','Trends Media Evidence sub-owner');
html=once(html,'data-axis-evolution-object-owner="v814-evolution-objects" aria-live="polite" hidden','data-axis-evolution-object-owner="v814-evolution-objects" data-axis-media-evidence-owner="v815-media-evidence" aria-live="polite" hidden','Evolution Object evidence owner');
if((html.match(/data-axis-media-evidence-owner="v815-media-evidence"/g)||[]).length!==2)fail('Media Evidence ownership must exist exactly on Trends and Evolution Object root');
fs.writeFileSync(INDEX,html);

let app=read(APP);
const mediaReadAnchor="async function mediaUrl(k){try{const b=await getMedia(k);return b?URL.createObjectURL(b):null}catch{return null}}";
const mediaReadReplacement=mediaReadAnchor+"\ntry{window.__AXIS_MEDIA_READ__={version:'8.15',owner:'app.js-media-store',readOnly:true,database:DB,store:'media',get:getMedia}}catch{}";
app=once(app,mediaReadAnchor,mediaReadReplacement,'read-only media bridge');
try{new Function(app)}catch(e){fail(`app syntax after media bridge: ${e.message}`)}
if(!app.includes("__AXIS_MEDIA_READ__={version:'8.15'")||!app.includes('readOnly:true')||!app.includes('get:getMedia'))fail('read-only media bridge incomplete');
fs.writeFileSync(APP,app);

let objects=read(OBJECTS);
const encounterFrom="encounters:encounters.map(x=>({sessionId:x.sessionId,eventId:x.eventId,time:x.time,sessionStart:x.sessionStart,summary:x.summary,mediaCount:x.media.length}))";
const encounterTo="encounters:encounters.map(x=>({sessionId:x.sessionId,eventId:x.eventId,time:x.time,sessionStart:x.sessionStart,name:x.name,kind:x.kind,summary:x.summary,mediaCount:x.media.length,media:x.media.slice()}))";
objects=once(objects,encounterFrom,encounterTo,'encounter media binding');
try{new Function(objects)}catch(e){fail(`8.14 object syntax after evidence binding: ${e.message}`)}
if(!objects.includes('media:x.media.slice()'))fail('encounter media references not exposed to 8.15 read-only layer');
fs.writeFileSync(OBJECTS,objects);

const media=read(MEDIA);
try{new Function(media)}catch(e){fail(`Media Evidence source syntax: ${e.message}`)}
for(const needle of ['__AXIS_815_MEDIA_EVIDENCE__','__AXIS_MEDIA_EVIDENCE__','__AXIS_MEDIA_READ__','resolveBundle','evidenceEncounterCount','earliestVisual','latestVisual','in-place-evidence-lens','首尾对照','时间证据'])if(!media.includes(needle))fail(`Media Evidence source missing ${needle}`);
for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','objectStore(\'media\').put','objectStore(\'media\').add','objectStore(\'media\').delete','fetch(','XMLHttpRequest'])if(media.includes(forbidden))fail(`Media Evidence must stay read-only/local/non-autoplay: ${forbidden}`);
if(/<video[^>]*\sautoplay/i.test(media))fail('Media Evidence video must never autoplay');
for(const forbidden of ['BGM','配乐','模板','发布','粉丝','点赞','排行榜','评分','分数'])if(media.includes(forbidden))fail(`creator/social/score semantics survived: ${forbidden}`);

let build=read(BUILD);
const anchor="['v8131-evolution-field.js','__AXIS_8131_EVOLUTION_READY__'],['v814-evolution-objects.js','__AXIS_814_EVOLUTION_OBJECTS_READY__']";
const replacement=anchor+",['v815-media-evidence.js','__AXIS_815_MEDIA_EVIDENCE_READY__']";
build=once(build,anchor,replacement,'first-class Media Evidence module');
fs.writeFileSync(BUILD,build);

console.log('[AXIS 8.15 Media Evidence convergence] PASS · encounter-bound media refs · read-only IndexedDB bridge · in-place evidence lens · photo/short-video · no creator workflow');
