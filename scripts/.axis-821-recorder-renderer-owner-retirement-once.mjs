import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 recorder renderer owner retirement] ${m}`)};

/* Metric Control System becomes the sole recorder renderer owner, while remaining
 * capability-ready for the later pure Object capability registry. */
{
 const file='prepare-821-metric-control-system.mjs';
 let s=fs.readFileSync(file,'utf8');
 const start=" const control=`function axis821MetricControl(m,prev){";
 const end=" s=replaceFunction(s,'function axis821MetricControl(m,prev)',control,'specialized metric value controls');";
 const a=s.indexOf(start),b=s.indexOf(end,a);
 if(a<0||b<0||b<=a)fail('Metric Control System canonical renderer block missing');
 const control=String.raw` const control=\`function axis821MetricControl(m,prev){
 const kind=axis821MetricKind(m),family=axis821MetricFamily(m),cap=(typeof AXIS821_RUNTIME_CAPABILITIES!=='undefined'?AXIS821_RUNTIME_CAPABILITIES[String(m?.key||'')]:null)||{},key=esc(m.key),label=esc(m.label),unit=esc(m.unit||cap.unit||''),raw=axis821MetricValue(prev),value=kind==='pace'?axis821PaceText(raw):raw,visual=value||(kind==='pace'?'5:30':'—'),valueChars=Math.max(1,Math.min(10,String(visual).length)),step=Number(m.step)>0?Number(m.step):(Number(cap.step)>0?Number(cap.step):1),min=Number.isFinite(Number(m.min))?Number(m.min):(Number.isFinite(Number(cap.min))?Number(cap.min):(kind==='rating'?1:0)),max=Number.isFinite(Number(m.max))?Number(m.max):(Number.isFinite(Number(cap.max))?Number(cap.max):(kind==='rating'?10:'')),presets=Array.isArray(m.presets)?m.presets:((Array.isArray(cap.presets)&&cap.presets.length)?cap.presets:axis821MetricPresetValues(m)),head='<div class="axis821MetricLabel"><span>'+label+'</span>'+(unit?'<small>'+unit+'</small>':'')+'</div>';
 if(kind==='rating'){
  const current=Number(value)||0;
  return'<section class="axis821MetricControl" data-axis821-kind="rating" data-axis821-family="scale" data-axis821-key="'+key+'">'+head+'<div class="axis821RatingMain axis821Stepper"><button type="button" aria-label="减少'+label+'" data-axis821-step="'+key+'" data-delta="-1">−</button><div><input data-axis818-metric="'+key+'" inputmode="numeric" autocomplete="off" style="width:'+valueChars+'ch" value="'+esc(value)+'" placeholder="—" data-min="'+min+'" data-max="'+max+'"><small>'+unit+'</small></div><button type="button" aria-label="增加'+label+'" data-axis821-step="'+key+'" data-delta="1">＋</button></div><div class="axis821Rating" aria-label="'+label+' '+min+' 到 '+max+'">'+Array.from({length:Math.max(1,Math.floor(max-min+1))},(_,i)=>i+min).map(n=>'<button type="button" data-axis821-rate="'+key+'" data-value="'+n+'" class="'+(current===n?'active':'')+'">'+n+'</button>').join('')+'</div></section>'
 }
 if(kind==='toggle'){
  const on=value===''?true:(value==='true'||value==='1');
  return'<section class="axis821MetricControl" data-axis821-kind="toggle" data-axis821-family="choice" data-axis821-key="'+key+'">'+head+'<input type="hidden" data-axis818-metric="'+key+'" value="'+(on?'1':'0')+'"><div class="axis821Toggle" role="group" aria-label="'+label+'"><button type="button" data-axis821-bool="'+key+'" data-value="0" class="'+(!on?'active':'')+'">否</button><button type="button" data-axis821-bool="'+key+'" data-value="1" class="'+(on?'active':'')+'">是</button></div></section>'
 }
 if(kind==='choice'){
  const opts=Array.isArray(m.options)?m.options:[];
  return'<section class="axis821MetricControl" data-axis821-kind="choice" data-axis821-family="choice" data-axis821-key="'+key+'">'+head+'<input type="hidden" data-axis818-metric="'+key+'" value="'+esc(value)+'"><div class="axis821Choice">'+opts.map(o=>{const v=String(o?.value??o),text=String(o?.label??v);return'<button type="button" data-axis821-choice="'+key+'" data-value="'+esc(v)+'" class="'+(String(value)===v?'active':'')+'">'+esc(text)+'</button>'}).join('')+'</div></section>'
 }
 if(kind==='pace'){
  return'<section class="axis821MetricControl" data-axis821-kind="pace" data-axis821-family="pace" data-axis821-key="'+key+'">'+head+'<div class="axis821Pace axis821Stepper"><button type="button" aria-label="配速快 5 秒" data-axis821-pace-step="'+key+'" data-delta="-5">−</button><div><input data-axis818-metric="'+key+'" inputmode="text" autocomplete="off" style="width:'+valueChars+'ch" value="'+esc(String(value).replace(/\\s*\\/\\s*km$/i,''))+'" placeholder="5:30"><small>'+(unit||'min/km')+'</small></div><button type="button" aria-label="配速慢 5 秒" data-axis821-pace-step="'+key+'" data-delta="5">＋</button></div><div class="axis821MetricAssist"><span>每次 5 秒</span><span>可直接输入 5:30</span></div></section>'
 }
 const inputmode=axis821MetricInputMode(m),presetCount=Math.max(1,presets.length);
 return'<section class="axis821MetricControl" data-axis821-kind="'+kind+'" data-axis821-family="'+family+'" data-axis821-key="'+key+'">'+head+'<div class="axis821Stepper"><button type="button" aria-label="减少'+label+'" data-axis821-step="'+key+'" data-delta="-'+step+'">−</button><div><input data-axis818-metric="'+key+'" inputmode="'+inputmode+'" autocomplete="off" style="width:'+valueChars+'ch" value="'+esc(value)+'" placeholder="—" data-min="'+min+'" '+(max!==''?'data-max="'+max+'"':'')+'><small>'+unit+'</small></div><button type="button" aria-label="增加'+label+'" data-axis821-step="'+key+'" data-delta="'+step+'">＋</button></div>'+(presets.length?'<div class="axis821Presets" style="--axis821-preset-count:'+presetCount+'">'+presets.map(n=>'<button type="button" data-axis821-preset="'+key+'" data-value="'+n+'">'+n+'</button>').join('')+'</div>':'')+'</section>'
}\`;
`;
 s=s.slice(0,a)+control+s.slice(b);
 const tokenAnchor=" ['app.js',['__AXIS_821_METRIC_CONTROLS__',\"families:['quantity','time','pace','scale','choice']\",'axis821PaceSeconds','axis821MetricFitInput','numberCenterIndependentOfUnit:true','data-axis821-pace-step','ratingDirectAndRail:true']],";
 const tokenNext=" ['app.js',['__AXIS_821_METRIC_CONTROLS__',\"families:['quantity','time','pace','scale','choice']\",'axis821PaceSeconds','axis821MetricFitInput','numberCenterIndependentOfUnit:true','data-axis821-family','data-axis821-choice','data-axis821-pace-step','data-axis821-rate','data-axis821-bool','ratingDirectAndRail:true']],";
 if((s.split(tokenAnchor).length-1)!==1)fail('Metric Control System renderer proof token anchor missing');
 s=s.replace(tokenAnchor,tokenNext);
 fs.writeFileSync(file,s);
}

/* Executable Object owns schema/execution UI only, not recorder rendering. */
{
 const file='prepare-821-executable-object-system.mjs';
 let s=fs.readFileSync(file,'utf8');
 const startToken='/* app recorder — one stable control geometry for every metric family. */';
 const endToken='/* Static CSS only. Existing design tokens; no runtime geometry owner. */';
 const start=s.indexOf(startToken),end=s.indexOf(endToken,start);
 if(start<0||end<0||end<=start)fail('Executable Object recorder renderer block boundary missing');
 const owned=s.slice(start,end);
 if(!owned.includes("replaceFunction(s,'function axis821MetricControl(m,prev)'"))fail('Executable Object duplicate recorder renderer mutation missing');
 s=s.slice(0,start)+`/* Recorder controls are rendered exclusively by prepare-821-metric-control-system.\n * Executable Object owns schema/execution UI only and must not supersede that renderer. */\n\n`+s.slice(end);
 const anchor="const app=read('app.js');if((app.match(/state\\.active\\.events\\.push\\(/g)||[]).length!==1)fail('Encounter append ownership drift');";
 if((s.split(anchor).length-1)!==1)fail('Executable Object app contract anchor missing or duplicated');
 const replacement="const app=read('app.js'),metricRenderer=functionRange(app,'function axis821MetricControl(m,prev)','metric-control-system-owned recorder renderer').text;for(const token of ['axis821MetricFamily(m)','data-axis821-family','data-axis821-choice','data-axis821-pace-step','data-axis821-rate','data-axis821-bool'])if(!metricRenderer.includes(token))fail('metric-control-system recorder renderer contract missing '+token);if((app.match(/state\\.active\\.events\\.push\\(/g)||[]).length!==1)fail('Encounter append ownership drift');";
 s=s.replace(anchor,replacement);
 fs.writeFileSync(file,s);
}

/* Object Capability Convergence may project its pure matrix and extend kind/event
 * semantics, but must not replace the recorder renderer owned above. */
{
 const file='prepare-821-object-capability-convergence.mjs';
 let s=fs.readFileSync(file,'utf8');
 const start=" s=replaceFunction(s,'function axis821MetricControl(m,prev)',`function axis821MetricControl(m,prev){";
 const end="`,'capability-driven metric controls');";
 const a=s.indexOf(start),b=s.indexOf(end,a);
 if(a<0||b<0||b<=a)fail('Object Capability duplicate recorder renderer mutation missing');
 s=s.slice(0,a)+s.slice(b+end.length);
 const marker=" const marker=\"window.__AXIS_821_RECORDING_SURFACE__=\";";
 if((s.split(marker).length-1)!==1)fail('Object Capability recording marker anchor missing or duplicated');
 const assertion=" const metricRenderer=functionRange(s,'function axis821MetricControl(m,prev)','metric-control-system recorder renderer').text;for(const token of ['axis821MetricFamily(m)','AXIS821_RUNTIME_CAPABILITIES','data-axis821-family','data-axis821-choice','data-axis821-pace-step','data-axis821-rate','data-axis821-bool'])if(!metricRenderer.includes(token))fail('metric-control-system recorder renderer lost capability contract '+token);\n";
 s=s.replace(marker,assertion+marker);
 fs.writeFileSync(file,s);
}

/* Final runtime is assertion-only: one renderer must carry geometry families and
 * later capability semantics together. */
{
 const file='postbuild-821-executable-object-presentation-seal.mjs';
 let s=fs.readFileSync(file,'utf8');
 const anchor="if(!src.includes('function axis821EventMetricSummary(e)'))fail('schema-aware Encounter summary helper missing from final runtime');";
 if((s.split(anchor).length-1)!==1)fail('final runtime assertion anchor missing or duplicated');
 const proof=`\n{\n const renderer=moduleFunctionRange(src,'app.js','function axis821MetricControl(m,prev)','final metric-control-system recorder renderer').text;\n for(const token of ['axis821MetricFamily(m)','AXIS821_RUNTIME_CAPABILITIES','data-axis821-family','data-axis821-choice','data-axis821-pace-step','data-axis821-rate','data-axis821-bool'])if(!renderer.includes(token))fail('final recorder renderer lost unified contract · '+token);\n}\n`;
 s=s.replace(anchor,anchor+proof);
 fs.writeFileSync(file,s);
}

console.log('[AXIS 8.21 recorder renderer owner retirement] staged · one Metric Control renderer owns family geometry + capability semantics · downstream duplicate renderers retired');
