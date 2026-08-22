import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.18 hardening] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/* --------------------------------------------------------------------------
 * Object Truth hardening
 * - pre-8.18 axis_v8124_custom_profiles is migration input only;
 * - metric schema is independent from object type;
 * - event snapshots physically remove legacy fields that are not in the schema.
 * ----------------------------------------------------------------------- */
{
 const FILE='app.js';let s=read(FILE);
 const oldSchema="function axis818SchemaForEq(ref){const eq=axis818Eq(ref);if(!eq)return[];const explicit=Array.isArray(eq.metricSchema)?eq.metricSchema.filter(x=>x&&x.key):null;return(explicit&&explicit.length?explicit:axis818DefaultSchema(eq)).map(axis818CloneMetric)}";
 const nextSchema=`function axis818LegacyProfileSchema(eq){
 if(!eq?.id)return[];let p={};try{p=JSON.parse(localStorage.getItem('axis_v8124_custom_profiles')||'null')||{}}catch{}const raw=Array.isArray(p.items?.[eq.id]?.metrics)?p.items[eq.id].metrics:Array.isArray(eq.recording?.metrics)?eq.recording.metrics:[];const keys=[];for(const k of raw){const n=k==='level'?'resistance':k;if(AXIS818_METRICS[n]&&!keys.includes(n))keys.push(n)}if(keys.some(k=>k==='weight'||k==='reps')&&!keys.includes('sets'))keys.push('sets');return keys.map(k=>axis818CloneMetric(AXIS818_METRICS[k]))}
function axis818ExplicitSchemaForEq(eq){if(!eq)return[];const current=Array.isArray(eq.metricSchema)?eq.metricSchema.filter(x=>x&&x.key):[];if(current.length)return current.map(axis818CloneMetric);return axis818LegacyProfileSchema(eq)}
function axis818HasExplicitSchema(ref){return axis818ExplicitSchemaForEq(axis818Eq(ref)).length>0}
function axis818SchemaForEq(ref){const eq=axis818Eq(ref);if(!eq)return[];const explicit=axis818ExplicitSchemaForEq(eq);return(explicit.length?explicit:axis818DefaultSchema(eq)).map(axis818CloneMetric)}`;
 s=once(s,oldSchema,nextSchema,'legacy profile schema migration');

 s=regexOnce(s,/function axis818RenderRecorder\(\)\{[\s\S]*?\}\nfunction axis818CaptureEvent/,
`function axis818RenderRecorder(){const eq=eqById(state.selectedEq);if(!eq)return;const schema=axis818SchemaForEq(eq),explicit=axis818HasExplicitSchema(eq);let host=$('#axis818MetricRecorder');if(!host){host=D.createElement('div');host.id='axis818MetricRecorder';host.className='axis818MetricRecorder';const anchor=$('#saveScan');anchor?.parentNode?.insertBefore(host,anchor)}if(!host)return;host.classList.toggle('show',explicit);$('#strengthFields')?.classList.toggle('axis818LegacyMetricHidden',explicit);$('#cardioFields')?.classList.toggle('axis818LegacyMetricHidden',explicit);if(!explicit){host.innerHTML='';return}host.innerHTML='<div class="axis818MetricHead"><span>本次记录</span><b>'+esc(eq.name)+'</b></div>'+schema.map(m=>'<label class="axis818MetricField"><span>'+esc(m.label)+'</span><div><input data-axis818-metric="'+esc(m.key)+'" '+(m.type==='text'?'':'inputmode="decimal"')+' placeholder="—"><small>'+esc(m.unit||'')+'</small></div></label>').join('');const prev=allEvents().filter(x=>x.equipmentId===eq.id).sort((a,b)=>(b.time||0)-(a.time||0))[0],pv=prev?axis818EventMetrics(prev):{};for(const m of schema){const el=D.querySelector('[data-axis818-metric="'+m.key+'"]');if(el&&pv[m.key]!=null)el.value=String(pv[m.key])}}
function axis818CaptureEvent`,'schema recorder migration + reset');

 const oldCapture="function axis818CaptureEvent(e,eq){const schema=axis818SchemaForEq(eq),vals=axis818ReadMetricInputs(schema);e.metricSchemaSnapshot=schema.map(axis818CloneMetric);e.metrics=vals;axis818ApplyLegacy(e,vals);e.objectTruthVersion='8.18';return e}";
 const newCapture="function axis818CaptureEvent(e,eq){const schema=axis818SchemaForEq(eq),vals=axis818ReadMetricInputs(schema),keys=new Set(schema.map(x=>x.key));for(const k of ['weight','reps','sets','duration','intensity','level','distance','resistance','pace','hold'])if(!keys.has(k))delete e[k];e.metricSchemaSnapshot=schema.map(axis818CloneMetric);e.metrics=vals;axis818ApplyLegacy(e,vals);for(const k of ['distance','resistance','pace','hold'])if(vals[k]!=null&&vals[k]!=='')e[k]=vals[k];e.objectTruthVersion='8.18';return e}";
 s=once(s,oldCapture,newCapture,'remove non-schema legacy fields');

 const oldApi="window.__AXIS_OBJECT_TRUTH__={version:'8.18',owner:'app.js',schemaForEq:axis818SchemaForEq,schemaForEvent:axis818SchemaForEvent,eventMetrics:axis818EventMetrics,eventRows:axis818EventRows,explicit:eq=>!!axis818Eq(eq)?.metricSchema?.length};";
 const newApi="window.__AXIS_OBJECT_TRUTH__={version:'8.18',owner:'app.js',schemaForEq:axis818SchemaForEq,schemaForEvent:axis818SchemaForEvent,eventMetrics:axis818EventMetrics,eventRows:axis818EventRows,explicit:axis818HasExplicitSchema,migrationSource:'axis_v8124_custom_profiles'};window.addEventListener('axis:equipment-selected',()=>setTimeout(axis818RenderRecorder,0));D.addEventListener('click',e=>{if(e.target.closest('#scanBtn,.scanPrimary,[data-v882-media]'))setTimeout(axis818RenderRecorder,120)},true);const axis818EqName=$('#equipmentName');if(axis818EqName)new MutationObserver(()=>setTimeout(axis818RenderRecorder,0)).observe(axis818EqName,{childList:true,subtree:true,characterData:true});";
 s=once(s,oldApi,newApi,'Object Truth recorder bindings');

 /* Navigation state is authoritative when stale Home and Trends classes coexist. */
 s=once(s,"function axis818CurrentRoute(){return(D.querySelector('.view.active')||D.querySelector('.page.active'))?.id||axis818Route||'todayView'}",
 "function axis818CurrentRoute(){const nav=D.querySelector('.nav [data-view].active');if(nav?.dataset.view&&D.getElementById(nav.dataset.view))return nav.dataset.view;const active=$$('main>.view.active');return active.length===1?active[0].id:(axis818Route||'todayView')}",'nav-first route authority');
 s=once(s,"for(const v of $$('.view,.page')){const on=v.id===axis818Route;v.toggleAttribute('inert',!on);v.setAttribute('aria-hidden',on?'false':'true')}",
 "for(const v of $$('main>.view')){const on=v.id===axis818Route;v.classList.toggle('active',on);v.toggleAttribute('inert',!on);v.setAttribute('aria-hidden',on?'false':'true')}",'exactly one active route');

 /* Existing 8.17 entry calls stay intact for inherited contracts; the canonical opener resolves current 8.18 preferences. */
 s=once(s,"captureMode=String(mode||state.prefs.scanSeconds||3);var s=$('#scanSheet');",
 "const axis818Requested=String(mode||'photo'),axis818Preferred=axis818Requested==='photo'?axis818DesiredMode():axis818Requested;captureMode=String(axis818Preferred||'photo');capture8171Facing=axis818DesiredFacing();var s=$('#scanSheet');",'Capture default mode/facing resolution');
 s=once(s,"startCamera();capture816Open(captureMode,quickMedia);return true}","startCamera();capture816Open(captureMode,quickMedia);setTimeout(axis818RenderRecorder,80);return true}",'Capture schema recorder open');

 /* Historical 15fps/720p watermark re-encoder is retired. v8710 supplies the only design painter. */
 s=regexOnce(s,/async function watermarkVideoBlob\(blob,e,eq\)\{[\s\S]*?\}\nasync function openDb/,
`async function watermarkVideoBlob(blob,e,eq){if((state.prefs.watermark.videoMode||'wm')==='raw')return blob;const painter=window.__AXIS_WATERMARK_RENDER__;if(!HTMLCanvasElement.prototype.captureStream||!window.MediaRecorder||!painter?.paint)return blob;const u=URL.createObjectURL(blob),v=D.createElement('video');v.src=u;v.muted=true;v.playsInline=true;v.preload='auto';let out=blob,stream=null,rec=null,raf=0,alive=true;try{await new Promise((res,rej)=>{v.onloadedmetadata=res;v.onerror=rej});const max=1080,scale=Math.min(1,max/Math.max(v.videoWidth||1,v.videoHeight||1)),cv=D.createElement('canvas');cv.width=Math.max(2,Math.round(v.videoWidth*scale));cv.height=Math.max(2,Math.round(v.videoHeight*scale));const c=cv.getContext('2d',{alpha:false,desynchronized:true});c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';stream=cv.captureStream(30);const mt=mediaMime(),opts=mt?{mimeType:mt,videoBitsPerSecond:6000000}:{videoBitsPerSecond:6000000};try{rec=new MediaRecorder(stream,opts)}catch{rec=new MediaRecorder(stream,mt?{mimeType:mt}:undefined)}const chunks=[],shot=painter.snapshot?.(e)||null;rec.ondataavailable=x=>x.data?.size&&chunks.push(x.data);const done=new Promise(resolve=>rec.onstop=resolve),draw=()=>{if(!alive)return;try{c.drawImage(v,0,0,cv.width,cv.height);painter.paint(c,cv.width,cv.height,e,e.time+(Number(v.currentTime)||0)*1000,shot)}catch(err){console.warn('[AXIS] video watermark frame',err)}if(v.requestVideoFrameCallback)v.requestVideoFrameCallback(draw);else raf=requestAnimationFrame(draw)};rec.start(500);await v.play();draw();await new Promise(resolve=>v.onended=resolve);alive=false;if(raf)cancelAnimationFrame(raf);rec.stop();await done;if(chunks.length)out=new Blob(chunks,{type:rec.mimeType||blob.type})}catch(err){console.warn('[AXIS] current video watermark skipped',err)}finally{alive=false;if(raf)cancelAnimationFrame(raf);try{stream?.getTracks().forEach(t=>t.stop())}catch{}URL.revokeObjectURL(u)}return out}
async function openDb`,'current 30fps v8710 video watermark compositor');

 const end=s.lastIndexOf('})();');if(end<0)fail('app IIFE end missing');
 const marker="\ntry{window.__AXIS_818_HARDENING__={version:'8.18',legacyProfileMigration:true,nonSchemaFieldsRemoved:true,navFirstRoute:true,oneActiveView:true,captureDefaultsApplied:true,videoWatermark:{owner:'v8710-watermark',fps:30,maxDimension:1080,targetBitrate:6000000},newPersistence:false}}catch{}\n";
 s=s.slice(0,end)+marker+s.slice(end);
 syntax(s,FILE);write(FILE,s);
}

/* Retire the old 8.12.4 metric-family editor as an owner. Its sidecar remains read-only migration input. */
{
 const FILE='v873-smart-input.js';let s=read(FILE);
 s=regexOnce(s,/function axis8124MetricChoose\(metric\)\{[\s\S]*?\}\nfunction axis8124ApplyCustomProfile/,
 "function axis8124MetricChoose(){return false}\nfunction axis8124ApplyCustomProfile",'retire legacy metric chooser');
 s=regexOnce(s,/D\.addEventListener\('click',e=>\{if\(!e\.target\.closest\?\.\('#saveCustomEq'\)\)return;[\s\S]*?\},true\);/,
 "D.addEventListener('click',e=>{if(!e.target.closest?.('#saveCustomEq'))return;/* AXIS 8.18: v874 metricSchema is authoritative; legacy profile is migration-only. */},true);",'retire legacy metric save owner');
 const end=s.lastIndexOf('})();');if(end<0)fail('v873 IIFE end missing');
 s=s.slice(0,end)+"\ntry{window.__AXIS_818_LEGACY_METRIC_MIGRATION__={version:'8.18',source:'axis_v8124_custom_profiles',readOnlyInput:true,visibleOwner:'v874',typeCoercion:false}}catch{}\n"+s.slice(end);
 syntax(s,FILE);write(FILE,s);
}

/* Active semantics follow the object's schema. A time-only strength object is not a set-tracked item. */
{
 const FILE='v87-runtime.js';let s=read(FILE);
 s=once(s,"function planned(e,m){return Math.max(1,m.events?.[e.id]?.sets?.length||Number(e.sets)||1)}",
 "function axis818TracksSets(e){const schema=window.__AXIS_OBJECT_TRUTH__?.schemaForEvent?.(e)||e?.metricSchemaSnapshot||[];return Array.isArray(schema)&&schema.length?schema.some(x=>['weight','reps','sets'].includes(x.key)):e?.kind==='strength'}\nfunction planned(e,m){return Math.max(1,m.events?.[e.id]?.sets?.length||Number(e.sets)||1)}",'schema-aware set predicate');
 const n=(s.match(/e\.kind==='strength'/g)||[]).length;if(!n)fail('no set-kind predicates found');
 s=s.replace(/e\.kind==='strength'/g,'axis818TracksSets(e)');
 s=s.replace("e.kind!=='strength'","!axis818TracksSets(e)");
 s=s.replace("#v87Main,#v87Meta,#v87Name",".v87Main,#v87Meta,#v87Name");
 const end=s.lastIndexOf('})();');if(end<0)fail('v87 IIFE end missing');
 s=s.slice(0,end)+"\ntry{window.__AXIS_818_ACTIVE_SCHEMA__={version:'8.18',setPredicate:'metric-schema',legacyFallback:true,completionOwner:'v87-direct-884'}}catch{}\n"+s.slice(end);
 syntax(s,FILE);write(FILE,s);
}

/* v8710 remains the one watermark design owner for both photo and video derivatives. */
{
 const FILE='v8710-watermark.js';let s=read(FILE);
 s=regexOnce(s,/function eventData\(e,L\)\{[^\n]*\}/,
`function eventData(e,L){const truth=window.__AXIS_OBJECT_TRUTH__,schema=truth?.schemaForEvent?.(e),vals=truth?.eventMetrics?.(e);if(Array.isArray(schema)&&schema.length&&vals){const labels={weight:['重量','WEIGHT'],reps:['次数','REPS'],sets:['组数','SETS'],duration:['时间','TIME'],intensity:['强度','INTENSITY'],distance:['距离','DISTANCE'],resistance:['阻力 / 档位','LEVEL'],pace:['速度 / 配速','PACE'],hold:['保持时间','HOLD']};return schema.slice(0,4).map(m=>{const v=vals[m.key];if(v==null||v==='')return null;const label=labels[m.key]?.[L==='en'?1:0]||m.label||m.key,unit=m.unit||'';return L==='en'?label+' '+v+(unit?' '+unit.toUpperCase():''):label+' '+v+(unit?' '+unit:'')}).filter(Boolean).join(' · ')}if(e.kind==='strength')return L==='en'?\`${'${Number(e.weight)||0}'} KG · ${'${Number(e.reps)||0}'} REPS · ${'${Number(e.sets)||0}'} SETS\`:\`${'${Number(e.weight)||0}'} kg · ${'${Number(e.reps)||0}'} 次 · ${'${Number(e.sets)||0}'} 组\`;return L==='en'?\`${'${Number(e.duration)||0}'} MIN · LEVEL ${'${Number(e.intensity)||\'—\'}'}\`:\`${'${Number(e.duration)||0}'} 分钟 · 档位 ${'${Number(e.intensity)||\'—\'}'}\`}`,'schema-aware watermark data');
 const end=s.lastIndexOf('})();');if(end<0)fail('v8710 IIFE end missing');
 const painter=String.raw`
/* AXIS 8.18 — one shared current watermark painter for video derivatives. */
function axis818WatermarkSnapshot(e){const p=pref();return{p:{...p,geo:p.geo?{...p.geo}:null},L:p.resolvedLang,name:p.resolvedLang==='en'?englishName(e?.name||'TRAINING').toUpperCase():(e?.name||'训练'),data:eventData(e||{},p.resolvedLang)}}
function axis818PaintWatermark(c,W,H,e,ts,shot=null){const x=shot||axis818WatermarkSnapshot(e),p=x.p,L=x.L||p.resolvedLang,name=x.name||e?.name||'训练',data=x.data||eventData(e||{},L),base=Math.max(18,Math.round(W*.0215)),big=Math.max(23,Math.round(W*.027)),pd=Math.max(20,Math.round(W*.03)),alpha=Math.max(.01,Math.min(1,Number(p.opacity||18)/100));c.save();c.globalAlpha=alpha;c.fillStyle='#737cff';c.textAlign='center';c.textBaseline='middle';c.font='800 '+Math.max(68,Math.round(W*.12))+'px -apple-system,BlinkMacSystemFont,Arial';c.fillText('AXIS',W/2,H*.48);c.restore();const dt=new Date(ts||e?.time||Date.now()),time=dt.getFullYear()+'.'+pad(dt.getMonth()+1)+'.'+pad(dt.getDate())+' '+pad(dt.getHours())+':'+pad(dt.getMinutes()),loc=[p.location?p.place:'',time].filter(Boolean).join(' · '),rows=[name,data,loc].filter(Boolean),boxW=Math.min(Math.round(W*.68),Math.max(Math.round(W*.44),Math.round(W*.58))),lineH=Math.round(base*1.42),boxH=Math.ceil(pd*.72+lineH*(rows.length+1)+pd*.55),xy=panelRect(W,H,p.pos,boxW,boxH,pd),rx=xy[0],ry=xy[1],right=p.pos==='tr'||p.pos==='br',tx=right?rx+boxW-pd:rx+pd;c.save();c.textAlign=right?'right':'left';c.textBaseline='top';c.shadowColor='rgba(0,0,0,.72)';c.shadowBlur=Math.max(4,W*.004);c.fillStyle='rgba(5,7,10,.72)';c.fillRect(rx,ry,boxW,boxH);c.fillStyle='#737cff';c.fillRect(right?rx+boxW-Math.max(3,W*.004):rx,ry,Math.max(3,W*.004),boxH);let yy=ry+pd*.4;c.fillStyle='#fff';c.font='720 '+base+'px -apple-system,BlinkMacSystemFont,"PingFang SC",Arial';c.fillText('AXIS / RECORD',tx,yy);yy+=lineH;c.font='680 '+big+'px -apple-system,BlinkMacSystemFont,"PingFang SC",Arial';c.fillText(String(name).slice(0,32),tx,yy);yy+=lineH;c.fillStyle='rgba(255,255,255,.94)';c.font='580 '+base+'px -apple-system,BlinkMacSystemFont,"PingFang SC",Arial';if(data){c.fillText(String(data).slice(0,64),tx,yy);yy+=lineH}c.fillStyle='rgba(255,255,255,.84)';c.font='540 '+Math.max(12,Math.round(base*.88))+'px -apple-system,BlinkMacSystemFont,"PingFang SC",Arial';if(loc)c.fillText(String(loc).slice(0,72),tx,yy);c.restore()}
window.__AXIS_WATERMARK_RENDER__={version:'8.18',owner:'v8710-watermark',snapshot:axis818WatermarkSnapshot,paint:axis818PaintWatermark,centerBrand:true,videoFps:30};
`;
 s=s.slice(0,end)+painter+'\n'+s.slice(end);
 syntax(s,FILE);write(FILE,s);
}

/* Hide the retired legacy metric selector without changing the canonical v874 editor geometry. */
{
 const FILE='styles.css';let c=read(FILE);if(c.includes('AXIS 8.18 hardening'))fail('8.18 hardening CSS duplicated');
 c+="\n\n/* AXIS 8.18 hardening */\n#customEqSheet #axisCustomMetrics,#customEqSheet .axisCustomMetricHint{display:none!important}body.axis818-route-away #quickRecordBtn{pointer-events:none!important}\n";write(FILE,c);
}

/* Source-level ownership assertions. */
{
 const app=read('app.js'),smart=read('v873-smart-input.js'),v87=read('v87-runtime.js'),wm=read('v8710-watermark.js');
 for(const n of ['axis818LegacyProfileSchema','axis818HasExplicitSchema','nonSchemaFieldsRemoved:true','navFirstRoute:true','captureDefaultsApplied:true','videoBitsPerSecond:6000000'])if(!app.includes(n))fail(`app hardening missing ${n}`);
 if(app.includes('cv.captureStream(15)')||app.includes('const max=720'))fail('historical low-frame-rate watermark compositor survived');
 if(!smart.includes('__AXIS_818_LEGACY_METRIC_MIGRATION__'))fail('legacy metric retirement marker missing');
 if(!v87.includes('axis818TracksSets'))fail('schema-aware active predicate missing');
 if(!wm.includes('__AXIS_WATERMARK_RENDER__')||!wm.includes("c.fillText('AXIS',W/2,H*.48)"))fail('current watermark painter missing');
}
console.log('[AXIS 8.18 hardening] PASS · legacy metric migration-only · no hidden-field pollution · nav-first single route · capture defaults applied · schema-aware active sets · v8710 30fps video watermark');
