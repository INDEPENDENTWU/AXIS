import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 metric control system] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
function replaceFunction(src,signature,replacement,label){
 const start=src.indexOf(signature);if(start<0)fail(`${label} signature missing`);if(src.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);
 const brace=src.indexOf('{',start+signature.length-1);if(brace<0)fail(`${label} brace missing`);let depth=0,quote='',esc=false,line=false,block=false,end=-1;
 for(let i=brace;i<src.length;i++){
  const ch=src[i],next=src[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++;}continue}
  if(quote){if(esc){esc=false;continue}if(ch==='\\'){esc=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++;else if(ch==='}'){depth--;if(depth===0){end=i+1;break}}
 }
 if(end<0)fail(`${label} closing brace missing`);
 return src.slice(0,start)+replacement+src.slice(end);
}
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(`${f} syntax ${e.message}`)}};

/*
 * One visual/control grammar for every recording property. Object schema remains
 * the sole definition owner; this pass only chooses the value control used when
 * that already-defined property is recorded. Numeric families inherit the same
 * label/value/−/+ geometry as Group Plan, while pace/rating/boolean keep their
 * own semantics instead of being forced through a generic text field.
 */
{
 const FILE='app.js';let s=read(FILE);
 const kind=`function axis821MetricKind(m){const k=String(m?.key||''),t=String(m?.type||'');if(k==='intensity'||k==='rating'||t==='rating')return'rating';if(k==='completed'||t==='boolean')return'toggle';if(k==='pace'||t==='pace')return'pace';if(k==='duration'||k==='hold'||t==='duration')return'timer';return'stepper'}
function axis821MetricInputMode(m){const t=String(m?.type||''),k=String(m?.key||'');return t==='count'||['reps','sets','level','resistance'].includes(k)?'numeric':'decimal'}
function axis821MetricPresetValues(m){const k=String(m?.key||'');if(k==='reps')return[5,8,10,12,15,20];if(k==='sets')return[1,2,3,4,5,6];if(k==='duration')return[5,10,15,20,30,45];if(k==='hold')return[10,20,30,45,60,90];if(k==='distance')return[.5,1,3,5,10];if(k==='speed')return[5,8,10,12,15];if(k==='resistance'||k==='level')return[1,3,5,7,10];if(k==='incline')return[0,2,5,8,10,12];return[]}
function axis821PaceSeconds(v){v=String(v??'').trim();if(!v)return null;const m=v.match(/^(\\d{1,3}):(\\d{1,2})$/);if(m)return Math.max(0,Number(m[1])*60+Math.min(59,Number(m[2])));if(/^\\d+(?:\\.\\d+)?$/.test(v))return Math.max(0,Math.round(Number(v)*60));return null}
function axis821PaceText(v){const sec=axis821PaceSeconds(v);if(sec==null)return String(v??'');return Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0')}
function axis821MetricFamily(m){const kind=axis821MetricKind(m);if(kind==='timer')return'time';if(kind==='rating')return'scale';if(kind==='toggle')return'choice';if(kind==='pace')return'pace';return'quantity'}`;
 s=replaceFunction(s,'function axis821MetricKind(m)',kind,'metric control family registry');
 s=replaceFunction(s,'function axis821MetricValue(v)',`function axis821MetricValue(v){if(v==null)return'';if(typeof v==='number'&&Number.isFinite(v))return String(Math.round(v*1000)/1000);return String(v)}`,'metric value formatting');

 const control=`function axis821MetricControl(m,prev){
 const kind=axis821MetricKind(m),family=axis821MetricFamily(m),key=esc(m.key),label=esc(m.label),unit=esc(m.unit||''),raw=axis821MetricValue(prev),value=kind==='pace'?axis821PaceText(raw):raw,step=Number(m.step)>0?Number(m.step):1,min=Number.isFinite(Number(m.min))?Number(m.min):(kind==='rating'?1:0),max=Number.isFinite(Number(m.max))?Number(m.max):(kind==='rating'?10:''),head='<div class="axis821MetricLabel"><span>'+label+'</span>'+(unit?'<small>'+unit+'</small>':'')+'</div>';
 if(kind==='rating'){
  const current=Number(value)||0;
  return'<section class="axis821MetricControl" data-axis821-kind="rating" data-axis821-family="scale" data-axis821-key="'+key+'">'+head+'<div class="axis821RatingMain axis821Stepper"><button type="button" aria-label="减少'+label+'" data-axis821-step="'+key+'" data-delta="-1">−</button><div><input data-axis818-metric="'+key+'" inputmode="numeric" autocomplete="off" value="'+esc(value)+'" placeholder="—" data-min="1" data-max="10"><small>/10</small></div><button type="button" aria-label="增加'+label+'" data-axis821-step="'+key+'" data-delta="1">＋</button></div><div class="axis821Rating" aria-label="'+label+' 1 到 10">'+Array.from({length:10},(_,i)=>i+1).map(n=>'<button type="button" data-axis821-rate="'+key+'" data-value="'+n+'" class="'+(current===n?'active':'')+'">'+n+'</button>').join('')+'</div></section>'
 }
 if(kind==='toggle'){
  const on=value===''?true:(value==='true'||value==='1');
  return'<section class="axis821MetricControl" data-axis821-kind="toggle" data-axis821-family="choice" data-axis821-key="'+key+'">'+head+'<input type="hidden" data-axis818-metric="'+key+'" value="'+(on?'1':'0')+'"><div class="axis821Toggle" role="group" aria-label="'+label+'"><button type="button" data-axis821-bool="'+key+'" data-value="0" class="'+(!on?'active':'')+'">否</button><button type="button" data-axis821-bool="'+key+'" data-value="1" class="'+(on?'active':'')+'">是</button></div></section>'
 }
 if(kind==='pace'){
  return'<section class="axis821MetricControl" data-axis821-kind="pace" data-axis821-family="pace" data-axis821-key="'+key+'">'+head+'<div class="axis821Pace axis821Stepper"><button type="button" aria-label="配速快 5 秒" data-axis821-pace-step="'+key+'" data-delta="-5">−</button><div><input data-axis818-metric="'+key+'" inputmode="text" autocomplete="off" value="'+esc(value)+'" placeholder="5:30"><small>'+(unit||'min/km')+'</small></div><button type="button" aria-label="配速慢 5 秒" data-axis821-pace-step="'+key+'" data-delta="5">＋</button></div><div class="axis821MetricAssist"><span>每次 5 秒</span><span>可直接输入 5:30</span></div></section>'
 }
 const presets=axis821MetricPresetValues(m),inputmode=axis821MetricInputMode(m),presetCount=Math.max(1,presets.length);
 return'<section class="axis821MetricControl" data-axis821-kind="'+kind+'" data-axis821-family="'+family+'" data-axis821-key="'+key+'">'+head+'<div class="axis821Stepper"><button type="button" aria-label="减少'+label+'" data-axis821-step="'+key+'" data-delta="-'+step+'">−</button><div><input data-axis818-metric="'+key+'" inputmode="'+inputmode+'" autocomplete="off" value="'+esc(value)+'" placeholder="—" data-min="'+min+'" '+(max!==''?'data-max="'+max+'"':'')+'><small>'+unit+'</small></div><button type="button" aria-label="增加'+label+'" data-axis821-step="'+key+'" data-delta="'+step+'">＋</button></div>'+(presets.length?'<div class="axis821Presets" style="--axis821-preset-count:'+presetCount+'">'+presets.map(n=>'<button type="button" data-axis821-preset="'+key+'" data-value="'+n+'">'+n+'</button>').join('')+'</div>':'')+'</section>'
}`;
 s=replaceFunction(s,'function axis821MetricControl(m,prev)',control,'specialized metric value controls');

 s=replaceFunction(s,'function axis818ReadMetricInputs(schema)',`function axis818ReadMetricInputs(schema){const out={};for(const m of schema){const el=D.querySelector('[data-axis818-metric="'+m.key+'"]');let v=el?.value??'';if(m.type==='boolean')v=v==='1'||v==='true';else if(m.type==='pace'||m.key==='pace')v=v===''?null:axis821PaceText(v);else if(['number','count','duration','distance','percentage','rating'].includes(m.type))v=v===''?null:Number(v);out[m.key]=v}return out}`,'specialized metric input reader');
 s=replaceFunction(s,'function axis818MetricText(m,v)',`function axis818MetricText(m,v){if(v==null||v==='')return'—';if(m.type==='boolean')return v?'是':'否';if(m.type==='pace'||m.key==='pace')return axis821PaceText(v)+(m.unit?' '+m.unit:'');return String(v)+(m.unit?' '+m.unit:'')}`,'specialized metric text');

 function axis821MetricFitInput(el){if(!el)return;const raw=String(el.value??'').trim(),chars=Math.max(1,Math.min(10,(raw||'—').length));el.style.width=chars+'ch'}
function axis821MetricFitAll(root=D){root.querySelectorAll?.('[data-axis818-metric]').forEach(axis821MetricFitInput)}
D.addEventListener('input',e=>{const el=e.target.closest?.('[data-axis818-metric]');if(el)axis821MetricFitInput(el)},true);
D.addEventListener('click',e=>{const b=e.target.closest?.('[data-axis821-step],[data-axis821-preset],[data-axis821-rate]');if(!b)return;queueMicrotask(()=>{const key=b.dataset.axis821Step||b.dataset.axis821Preset||b.dataset.axis821Rate;axis821MetricFitInput(axis821MetricInput(key))})},true);
requestAnimationFrame(()=>axis821MetricFitAll());
const marker="window.__AXIS_821_RECORDING_SURFACE__={version:'8.21',owner:'app.js+v874',schemaEditing:'object-editor-only',recordingSurface:'value-controls-only',explicitEmptySchema:true,presetMetricCount:14,newRecorder:false,newPersistence:false};";
 const extended=`D.addEventListener('click',e=>{const pace=e.target.closest?.('[data-axis821-pace-step]');if(!pace)return;e.preventDefault();const el=axis821MetricInput(pace.dataset.axis821PaceStep);if(!el)return;let sec=axis821PaceSeconds(el.value);if(sec==null)sec=330;sec=Math.max(0,sec+(Number(pace.dataset.delta)||0));el.value=axis821PaceText(sec/60)},true);\nD.addEventListener('input',e=>{const el=e.target.closest?.('[data-axis818-metric]');if(!el)return;const control=el.closest?.('.axis821MetricControl');if(control?.dataset.axis821Kind==='rating'){const n=Number(el.value);control.querySelectorAll?.('[data-axis821-rate]').forEach(b=>b.classList.toggle('active',Number(b.dataset.value)===n))}},true);\nD.addEventListener('blur',e=>{const el=e.target.closest?.('[data-axis818-metric]');if(!el)return;const control=el.closest?.('.axis821MetricControl');if(control?.dataset.axis821Kind==='pace'&&el.value.trim())el.value=axis821PaceText(el.value)},true);\n${marker}\ntry{window.__AXIS_821_METRIC_CONTROLS__={version:'8.21',owner:'app.js-presentation',families:['quantity','time','pace','scale','choice'],groupPlanGeometry:true,paceFiveSecondStep:true,ratingDirectAndRail:true,explicitEmptySchema:true,newSchemaOwner:false,newRecorder:false,newPersistence:false,newEncounterWriter:false}}catch{};`;
 s=once(s,marker,extended,'metric control interaction + ownership marker');
 syntax(s,FILE);write(FILE,s);
}

{
 const FILE='styles.css';let s=read(FILE),marker='/* AXIS 8.21 Metric Control System */';if(s.includes(marker))fail('metric control CSS duplicated');
 s+=String.raw`

/* AXIS 8.21 Metric Control System */
.axis821MetricControl{padding:0 0 18px!important}.axis821MetricLabel{height:46px!important;padding:0 2px!important}.axis821MetricLabel span{font-size:12px!important;font-weight:590!important;letter-spacing:-.005em}.axis821MetricLabel small{font-size:10px!important;font-weight:520!important}.axis821Stepper{height:64px!important;grid-template-columns:56px minmax(0,1fr) 56px!important;border-radius:18px!important;background:var(--s2)!important;overflow:hidden!important}.axis821Stepper>button{width:56px!important;height:64px!important;padding:0!important;border-radius:0!important;background:transparent!important;color:var(--muted)!important;font-size:25px!important;font-weight:330!important}.axis821Stepper>div{height:64px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;padding:0 8px!important;background:rgba(0,0,0,.10)!important}.axis821Stepper input{min-width:1ch!important;width:1ch;max-width:110px!important;height:54px!important;padding:0!important;border:0!important;background:transparent!important;text-align:right!important;color:var(--text)!important;font-size:26px!important;font-weight:640!important;line-height:1!important;letter-spacing:-.025em!important;font-variant-numeric:tabular-nums}.axis821Stepper input::placeholder{color:var(--dim)!important}.axis821Stepper small{flex:0 0 auto!important;font-size:11px!important;color:var(--muted)!important;line-height:1!important}.axis821Presets{display:grid!important;grid-template-columns:repeat(var(--axis821-preset-count,6),minmax(0,1fr))!important;gap:6px!important;margin-top:8px!important}.axis821Presets button{height:35px!important;min-width:0!important;padding:0!important;border-radius:10px!important;background:var(--s2)!important;color:var(--muted)!important;font-size:10.5px!important;font-variant-numeric:tabular-nums!important}.axis821RatingMain{margin-bottom:8px!important}.axis821Rating{display:grid!important;grid-template-columns:repeat(10,minmax(0,1fr))!important;gap:4px!important;margin:0!important}.axis821Rating button{height:30px!important;min-width:0!important;padding:0!important;border-radius:8px!important;background:var(--s2)!important;color:var(--dim)!important;font-size:9.5px!important;font-variant-numeric:tabular-nums!important}.axis821Rating button.active{background:var(--text)!important;color:#111318!important;font-weight:720!important}.axis821Toggle{display:grid!important;grid-template-columns:1fr 1fr!important;gap:6px!important;margin:0!important}.axis821Toggle button{height:54px!important;border-radius:16px!important;background:var(--s2)!important;color:var(--muted)!important;font-size:13px!important;font-weight:600!important}.axis821Toggle button.active{background:var(--text)!important;color:#111318!important;font-weight:700!important}.axis821Pace input{text-align:center!important;max-width:120px!important}.axis821MetricAssist{height:30px;display:flex;align-items:flex-end;justify-content:space-between;padding:0 2px;color:var(--dim);font-size:9.5px}.axis821NoMetrics{min-height:86px!important;padding:18px 2px!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;background:transparent!important}.axis821NoMetrics b{font-size:13px!important;font-weight:620!important}.axis821NoMetrics span{margin-top:6px!important;font-size:10.5px!important;color:var(--dim)!important}
@media(max-width:360px){.axis821Stepper{grid-template-columns:52px minmax(0,1fr) 52px!important}.axis821Stepper>button{width:52px!important}.axis821Stepper input{font-size:24px!important;max-width:96px!important}.axis821Presets{gap:5px!important}.axis821Rating{gap:3px!important}.axis821Rating button{font-size:9px!important}}
`;
 write(FILE,s);
}

for(const [f,tokens] of [
 ['app.js',['__AXIS_821_METRIC_CONTROLS__',"families:['quantity','time','pace','scale','choice']",'axis821PaceSeconds','data-axis821-pace-step','ratingDirectAndRail:true']],
 ['styles.css',['AXIS 8.21 Metric Control System','.axis821Stepper input{min-width:0','.axis821Rating{display:grid','.axis821Toggle{display:grid']]
]){const s=read(f);for(const t of tokens)if(!s.includes(t))fail(`${f} missing ${t}`)}
console.log('[AXIS 8.21 metric control system] PASS · one native Group Plan geometry + specialized quantity/time/pace/scale/choice semantics · no new schema/recorder/storage owner');
