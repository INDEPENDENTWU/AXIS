import fs from 'node:fs';
import {METRIC_CAPABILITIES,CUSTOM_METRIC_TYPES} from './lib/axis-object-capabilities.mjs';

const fail=m=>{throw new Error(`[AXIS 8.21 Object capability convergence] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
function functionRange(src,signature,label){
 const start=src.indexOf(signature);if(start<0)fail(`${label} signature missing`);if(src.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);
 const brace=src.indexOf('{',start+signature.length-1);if(brace<0)fail(`${label} brace missing`);let depth=0,quote='',escaped=false,line=false,block=false,end=-1;
 for(let i=brace;i<src.length;i++){
  const ch=src[i],next=src[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}
  if(quote){if(escaped){escaped=false;continue}if(ch==='\\'){escaped=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}if(ch==='/'&&next==='*'){block=true;i++;continue}if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++;else if(ch==='}'){depth--;if(depth===0){end=i+1;break}}
 }
 if(end<0)fail(`${label} closing brace missing`);return{start,end,text:src.slice(start,end)};
}
function replaceFunction(src,signature,replacement,label){const r=functionRange(src,signature,label);return src.slice(0,r.start)+replacement+src.slice(r.end)}
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(`${f} syntax ${e.message}`)}};

const runtimeCaps=Object.fromEntries(Object.entries(METRIC_CAPABILITIES).map(([id,c])=>[id,{executionHint:c.executionHint,presets:c.presets||[],presentation:c.presentation,type:c.type,unit:c.unit,min:c.min,max:c.max,step:c.step}]));
const runtimeCapsJson=JSON.stringify(runtimeCaps);
const editorHintsJson=JSON.stringify(Object.fromEntries(Object.entries(METRIC_CAPABILITIES).map(([id,c])=>[id,c.executionHint])));
const customTypes=Object.entries(CUSTOM_METRIC_TYPES).map(([id,c])=>[id,c.label]);
const customTypesJson=JSON.stringify(customTypes);

/* app.js: one generated runtime projection of the pure capability matrix. */
{
 const FILE='app.js';let s=read(FILE);
 const oldContinuous="const AXIS821_CONTINUOUS_METRICS=new Set(['duration','distance','pace','speed','intensity','resistance','level','incline']);";
 const newContinuous=`const AXIS821_RUNTIME_CAPABILITIES=${runtimeCapsJson};\nconst AXIS821_CONTINUOUS_METRICS=new Set(Object.keys(AXIS821_RUNTIME_CAPABILITIES).filter(k=>AXIS821_RUNTIME_CAPABILITIES[k].executionHint==='timed'));`;
 s=once(s,oldContinuous,newContinuous,'runtime capability registry');
 s=replaceFunction(s,'function axis821AutoExecutionMode(eq,schema=axis818SchemaForEq(eq))',`function axis821AutoExecutionMode(eq,schema=axis818SchemaForEq(eq)){const explicit=axis821ExecutionExplicit(eq);if(explicit)return explicit;const xs=Array.isArray(schema)?schema:[],keys=new Set(xs.map(x=>String(x?.key||x?.id||'')).filter(Boolean)),hints=new Set(xs.map(x=>String(x?.extensions?.axis?.executionHint||AXIS821_RUNTIME_CAPABILITIES[String(x?.key||x?.id||'')]?.executionHint||(({duration:'timed',distance:'timed',pace:'timed',boolean:'complete'})[String(x?.type||'')]||'context'))));if(keys.has('rounds')||hints.has('rounds'))return'rounds';if(keys.has('sets')||keys.has('reps')||hints.has('sets'))return'sets';if(keys.has('hold')||hints.has('hold'))return'hold';if(keys.size===1&&keys.has('completed'))return'complete';if(hints.has('timed'))return'timed';if(xs.length===1&&hints.has('complete'))return'complete';return'single'}`,'capability-driven execution resolver');
 s=replaceFunction(s,'function axis821MetricValueText(m,v)',`function axis821MetricValueText(m,v){if(v==null||v===''||String(v)==='undefined'||String(v)==='NaN')return'';const type=String(m?.type||''),unit=String(m?.unit||'');if(type==='boolean')return(v===true||v===1||v==='1'||v==='true')?'是':'否';if(type==='choice'){const hit=(m?.options||[]).find(x=>String(x?.value??x)===String(v));return String(hit?.label??v)}if(type==='pace'||String(m?.key)==='pace'){const clean=String(v).replace(/\s*\/\s*km$/i,'').trim();return clean+(unit?' '+unit:'')}const n=Number(v),base=Number.isFinite(n)?(n%1?String(Math.round(n*1000)/1000):String(n)):String(v);return /undefined|NaN/i.test(base)?'':base+(unit?' '+unit:'')}`,'generic schema value formatter');
 s=replaceFunction(s,'function axis821MetricKind(m)',`function axis821MetricKind(m){const k=String(m?.key||''),t=String(m?.type||''),p=String(m?.presentation||AXIS821_RUNTIME_CAPABILITIES[k]?.presentation||'');if(t==='choice'||p==='choice')return'choice';if(k==='intensity'||k==='rating'||t==='rating'||p==='rating')return'rating';if(k==='completed'||t==='boolean'||p==='toggle')return'toggle';if(k==='pace'||t==='pace'||p==='pace')return'pace';if(k==='duration'||k==='hold'||t==='duration'||p==='timer')return'timer';return'stepper'}`,'generic control-kind resolver');

 const metricRenderer=functionRange(s,'function axis821MetricControl(m,prev)','metric-control-system recorder renderer').text;for(const token of ['axis821MetricFamily(m)','AXIS821_RUNTIME_CAPABILITIES','data-axis821-family','data-axis821-choice','data-axis821-pace-step','data-axis821-rate','data-axis821-bool'])if(!metricRenderer.includes(token))fail('metric-control-system recorder renderer lost capability contract '+token);
 const marker="window.__AXIS_821_RECORDING_SURFACE__=";
 const markerAt=s.indexOf(marker);if(markerAt<0)fail('recording surface marker missing');
 const choiceBinding="D.addEventListener('click',e=>{const b=e.target.closest?.('[data-axis821-choice]');if(!b)return;e.preventDefault();const key=b.dataset.axis821Choice,el=axis821MetricInput(key);if(el)el.value=b.dataset.value||'';b.closest('.axis821Choice')?.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b))},true);\n";
 s=s.slice(0,markerAt)+choiceBinding+s.slice(markerAt);
 s=replaceFunction(s,'function axis821VisibleObjectType(v)',`function axis821VisibleObjectType(v){const raw=String(v||''),known=({strength:'力量',cardio:'有氧',relative:'自重',machine:'器械力量',free:'自由重量',bodyweight:'自重训练',functional:'功能体能',mobility:'灵活恢复'})[raw];if(known)return known;if(/^[a-z][a-z0-9._-]*$/i.test(raw))return'其他';return raw}`,'visible enum fail-closed localization');
 s=replaceFunction(s,'function axis821LocalizeVisibleEnums(root=D)',`function axis821LocalizeVisibleEnums(root=document){for(const el of root.querySelectorAll?.('small,span')||[]){const t=(el.textContent||'').trim();if(['strength','cardio','relative','machine','free','bodyweight','functional','mobility'].includes(t))el.textContent=axis821VisibleObjectType(t)}}`,'document-scoped enum localizer');
 s=once(s,'axis821EnumObserver.observe(D.body,{subtree:true,childList:true});queueMicrotask(()=>axis821LocalizeVisibleEnums(D));',"if(document.body)axis821EnumObserver.observe(document.body,{subtree:true,childList:true});queueMicrotask(()=>axis821LocalizeVisibleEnums(document));",'document-scoped enum observer');
 const systemMarker="try{window.__AXIS_821_EXECUTABLE_OBJECT_SYSTEM__=";const systemAt=s.indexOf(systemMarker);if(systemAt<0)fail('executable Object system marker missing');
 s=s.slice(0,systemAt)+"try{window.__AXIS_821_OBJECT_CAPABILITY_CONVERGENCE__={version:'8.21',schema:'axis.object-capabilities.v1',builtInMetrics:14,customMetricTypes:9,choiceControl:true,executionResolver:'capability-matrix',newStorage:false,newRecorder:false,newActiveOwner:false}}catch{};\n"+s.slice(systemAt);
 syntax(s,FILE);write(FILE,s);
}

/* v874: the same capability semantics drive editor inference and custom types. */
{
 const FILE='v874-professional.js';let s=read(FILE);
 const anchor='function axis821EditorAutoMode()';if(!s.includes(anchor))fail('editor auto-mode anchor missing');
 s=s.replace(anchor,`const AXIS821_EDITOR_EXECUTION_HINTS=${editorHintsJson};\n${anchor}`);
 s=replaceFunction(s,'function axis821EditorAutoMode()',`function axis821EditorAutoMode(){const xs=axis818MetricDraft||[],keys=new Set(xs.map(x=>String(x?.key||x?.id||'')).filter(Boolean)),hints=new Set(xs.map(x=>String(x?.extensions?.axis?.executionHint||AXIS821_EDITOR_EXECUTION_HINTS[String(x?.key||x?.id||'')]||(({duration:'timed',distance:'timed',pace:'timed',boolean:'complete'})[String(x?.type||'')]||'context'))));if(keys.has('rounds')||hints.has('rounds'))return'rounds';if(keys.has('sets')||keys.has('reps')||hints.has('sets'))return'sets';if(keys.has('hold')||hints.has('hold'))return'hold';if(keys.size===1&&keys.has('completed'))return'complete';if(hints.has('timed'))return'timed';if(xs.length===1&&hints.has('complete'))return'complete';return'single'}`,'editor capability execution resolver');
 s=replaceFunction(s,'function axis821MetricPickerBody()',`function axis821MetricPickerBody(){const body=$('#axis821MetricPickerBody');if(!body)return;const has=k=>axis818MetricDraft.some(x=>x.key===k),groups=[['训练量',['weight','reps','sets']],['时间与移动',['duration','hold','distance','pace','speed']],['强度与设备',['intensity','resistance','level','incline']],['结果与感受',['rating','completed']]],custom=axis818MetricDraft.map((x,i)=>({x,i})).filter(o=>o.x.custom),types=${customTypesJson};body.innerHTML='<div class="axis821PickerHint">只选择这个项目真正需要记录的内容</div>'+groups.map(g=>'<section class="axis821PickerGroup"><small>'+g[0]+'</small><div>'+g[1].map(k=>{const x=AXIS818_METRIC_CHOICES.find(v=>v[0]===k);return'<button type="button" data-axis818-metric-choice="'+k+'" class="'+(has(k)?'active':'')+'"><span>'+esc(x[1])+'</span><i>'+(has(k)?'✓':'')+'</i></button>'}).join('')+'</div></section>').join('')+(custom.length?'<section class="axis821PickerGroup"><small>自定义</small><div>'+custom.map(o=>'<button type="button" data-axis818-metric-remove="'+o.i+'" class="active"><span>'+esc(o.x.label)+'</span><i>×</i></button>').join('')+'</div></section>':'')+'<button class="axis821PickerCustom" type="button" data-axis818-metric-custom="1">＋ 自定义记录属性</button>'+(axis821CustomMetricOpen?'<div class="axis821CustomMetric"><div class="axis821CustomMetricFields"><input id="axis821CustomMetricName" autocomplete="off" placeholder="属性名称"><input id="axis821CustomMetricUnit" autocomplete="off" placeholder="单位（可留空）"><input id="axis821CustomMetricOptions" class="'+(axis821CustomMetricType==='choice'?'':'hidden')+'" autocomplete="off" placeholder="选项，用逗号分隔"></div><div class="axis821CustomMetricTypes">'+types.map(x=>'<button type="button" data-axis821-custom-type="'+x[0]+'" class="'+(axis821CustomMetricType===x[0]?'active':'')+'">'+x[1]+'</button>').join('')+'</div><button type="button" class="axis821CustomMetricAdd" data-axis821-custom-add="1">添加属性</button></div>':'')}`,'nine-type custom property picker');
 const typeFrom="const type=e.target.closest('[data-axis821-custom-type]');if(type){e.preventDefault();e.stopPropagation();axis821CustomMetricType=type.dataset.axis821CustomType;type.parentNode?.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===type));return}";
 const typeTo="const type=e.target.closest('[data-axis821-custom-type]');if(type){e.preventDefault();e.stopPropagation();axis821CustomMetricType=type.dataset.axis821CustomType;type.parentNode?.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===type));$('#axis821CustomMetricOptions')?.classList.toggle('hidden',axis821CustomMetricType!=='choice');return}";
 s=once(s,typeFrom,typeTo,'custom type visibility behavior');
 const addFrom="const add=e.target.closest('[data-axis821-custom-add]');if(add){e.preventDefault();e.stopPropagation();const name=$('#axis821CustomMetricName')?.value.trim()||'',unit=$('#axis821CustomMetricUnit')?.value.trim()||'';if(!name)return;const type=axis821CustomMetricType||'number',step=type==='duration'?1:type==='percentage'?.5:1;axis818MetricDraft.push({key:'custom_'+Date.now().toString(36),label:name,unit,type,step,custom:true});axis821CustomMetricOpen=false;axis818MetricRender();return}";
 const addTo="const add=e.target.closest('[data-axis821-custom-add]');if(add){e.preventDefault();e.stopPropagation();const name=$('#axis821CustomMetricName')?.value.trim()||'',unit=$('#axis821CustomMetricUnit')?.value.trim()||'',type=axis821CustomMetricType||'number',rawOptions=$('#axis821CustomMetricOptions')?.value||'';if(!name){$('#axis821CustomMetricName')?.focus();return}const options=type==='choice'?[...new Set(rawOptions.split(/[,，]/).map(x=>x.trim()).filter(Boolean))].map(v=>({value:v,label:v})):undefined;if(type==='choice'&&!options.length){$('#axis821CustomMetricOptions')?.focus();return}const step=type==='distance'?.1:type==='percentage'?.5:1,hint=['duration','distance','pace'].includes(type)?'timed':type==='boolean'?'complete':'context',metric={key:'custom_'+Date.now().toString(36),label:name,unit,type,step,custom:true,extensions:{axis:{executionHint:hint}}};if(type==='rating'){metric.min=1;metric.max=10}if(options)metric.options=options;axis818MetricDraft.push(metric);axis821CustomMetricOpen=false;axis818MetricRender();return}";
 s=once(s,addFrom,addTo,'custom property typed persistence');
 syntax(s,FILE);write(FILE,s);
}

/* Styling stays presentation-only; controls retain the established geometry. */
{
 const FILE='styles.css';let s=read(FILE);const css=`\n/* AXIS 8.21 Object Capability Convergence */\n.axis821Choice{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}.axis821Choice button{min-height:46px;border:0;border-radius:14px;background:var(--axis821-control-bg,#151820);color:inherit;font:inherit;padding:10px 12px}.axis821Choice button.active{background:var(--accent-soft,#202344);color:var(--accent,#a8a7ff)}.axis821CustomMetricFields #axis821CustomMetricOptions.hidden{display:none}.axis821CustomMetricTypes{display:flex;flex-wrap:wrap;gap:8px}.axis821CustomMetricTypes button{min-height:40px}\n`;
 if(!s.includes('AXIS 8.21 Object Capability Convergence'))s+=css;write(FILE,s);
}

for(const [f,tokens] of [
 ['app.js',['AXIS821_RUNTIME_CAPABILITIES','customMetricTypes:9','data-axis821-choice','axis821LocalizeVisibleEnums(root=document)']],
 ['v874-professional.js',['AXIS821_EDITOR_EXECUTION_HINTS','axis821CustomMetricOptions','distance','choice']],
 ['styles.css',['AXIS 8.21 Object Capability Convergence','.axis821Choice']]
]){const x=read(f);for(const t of tokens)if(!x.includes(t))fail(`${f} missing ${t}`)}
const app=read('app.js');if((app.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('Encounter writer count drift');
for(const forbidden of ['axis_object_capability_state',"localStorage.setItem('axis_object_capability"])if(app.includes(forbidden))fail(`new capability persistence owner ${forbidden}`);
console.log('[AXIS 8.21 Object capability convergence] PASS · 14 built-ins + 9 custom types · shared execution hints · choice control · document-safe localization · no new factual owner');
