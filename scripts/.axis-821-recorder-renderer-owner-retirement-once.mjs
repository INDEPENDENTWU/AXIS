import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 recorder renderer owner retirement] ${m}`)};
const read=f=>fs.readFileSync(f,'utf8');
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(s,from,to,label)=>{const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return s.replace(from,to)};

/* Metric Control System stays the only recorder renderer. Extend that owner with
 * the later pure capability matrix instead of replacing the whole renderer. */
{
 const file='prepare-821-metric-control-system.mjs';let s=read(file);
 const decl=" const kind=axis821MetricKind(m),family=axis821MetricFamily(m),key=esc(m.key),label=esc(m.label),unit=esc(m.unit||''),raw=axis821MetricValue(prev),value=kind==='pace'?axis821PaceText(raw):raw,visual=value||(kind==='pace'?'5:30':'—'),valueChars=Math.max(1,Math.min(10,String(visual).length)),step=Number(m.step)>0?Number(m.step):1,min=Number.isFinite(Number(m.min))?Number(m.min):(kind==='rating'?1:0),max=Number.isFinite(Number(m.max))?Number(m.max):(kind==='rating'?10:''),head='<div class=\"axis821MetricLabel\"><span>'+label+'</span>'+(unit?'<small>'+unit+'</small>':'')+'</div>';";
 const capDecl=" const kind=axis821MetricKind(m),family=axis821MetricFamily(m),cap=(typeof AXIS821_RUNTIME_CAPABILITIES!=='undefined'?AXIS821_RUNTIME_CAPABILITIES[String(m?.key||'')]:null)||{},key=esc(m.key),label=esc(m.label),unit=esc(m.unit||cap.unit||''),raw=axis821MetricValue(prev),value=kind==='pace'?axis821PaceText(raw):raw,visual=value||(kind==='pace'?'5:30':'—'),valueChars=Math.max(1,Math.min(10,String(visual).length)),step=Number(m.step)>0?Number(m.step):(Number(cap.step)>0?Number(cap.step):1),min=Number.isFinite(Number(m.min))?Number(m.min):(Number.isFinite(Number(cap.min))?Number(cap.min):(kind==='rating'?1:0)),max=Number.isFinite(Number(m.max))?Number(m.max):(Number.isFinite(Number(cap.max))?Number(cap.max):(kind==='rating'?10:'')),head='<div class=\"axis821MetricLabel\"><span>'+label+'</span>'+(unit?'<small>'+unit+'</small>':'')+'</div>';";
 s=once(s,decl,capDecl,'capability-aware renderer declaration');
 const presets=" const presets=axis821MetricPresetValues(m),inputmode=axis821MetricInputMode(m),presetCount=Math.max(1,presets.length);";
 const capPresets=" const presets=Array.isArray(m.presets)?m.presets:((Array.isArray(cap.presets)&&cap.presets.length)?cap.presets:axis821MetricPresetValues(m)),inputmode=axis821MetricInputMode(m),presetCount=Math.max(1,presets.length);";
 s=once(s,presets,capPresets,'capability-aware presets');
 const pace=" if(kind==='pace'){";
 const choice=" if(kind==='choice'){\n  const opts=Array.isArray(m.options)?m.options:[];\n  return'<section class=\"axis821MetricControl\" data-axis821-kind=\"choice\" data-axis821-family=\"choice\" data-axis821-key=\"'+key+'\">'+head+'<input type=\"hidden\" data-axis818-metric=\"'+key+'\" value=\"'+esc(value)+'\"><div class=\"axis821Choice\">'+opts.map(o=>{const v=String(o?.value??o),text=String(o?.label??v);return'<button type=\"button\" data-axis821-choice=\"'+key+'\" data-value=\"'+esc(v)+'\" class=\"'+(String(value)===v?'active':'')+'\">'+esc(text)+'</button>'}).join('')+'</div></section>'\n }\n"+pace;
 s=once(s,pace,choice,'choice renderer extension');
 const proof=" ['app.js',['__AXIS_821_METRIC_CONTROLS__',\"families:['quantity','time','pace','scale','choice']\",'axis821PaceSeconds','axis821MetricFitInput','numberCenterIndependentOfUnit:true','data-axis821-pace-step','ratingDirectAndRail:true']],";
 const proof2=" ['app.js',['__AXIS_821_METRIC_CONTROLS__',\"families:['quantity','time','pace','scale','choice']\",'axis821PaceSeconds','axis821MetricFitInput','numberCenterIndependentOfUnit:true','data-axis821-family','data-axis821-choice','data-axis821-pace-step','data-axis821-rate','data-axis821-bool','ratingDirectAndRail:true']],";
 s=once(s,proof,proof2,'Metric Control renderer proof');
 write(file,s);
}

/* Executable Object owns schema/execution UI only. */
{
 const file='prepare-821-executable-object-system.mjs';let s=read(file);
 const startToken='/* app recorder — one stable control geometry for every metric family. */';
 const endToken='/* Static CSS only. Existing design tokens; no runtime geometry owner. */';
 const a=s.indexOf(startToken),b=s.indexOf(endToken,a);if(a<0||b<=a)fail('Executable Object recorder renderer block missing');
 if(!s.slice(a,b).includes("replaceFunction(s,'function axis821MetricControl(m,prev)'"))fail('Executable Object duplicate renderer mutation missing');
 s=s.slice(0,a)+`/* Recorder rendering is owned exclusively by prepare-821-metric-control-system.\n * Executable Object owns schema/execution UI only. */\n\n`+s.slice(b);
 const anchor="const app=read('app.js');if((app.match(/state\\.active\\.events\\.push\\(/g)||[]).length!==1)fail('Encounter append ownership drift');";
 const replacement="const app=read('app.js'),metricRenderer=functionRange(app,'function axis821MetricControl(m,prev)','metric-control-system-owned recorder renderer').text;for(const token of ['axis821MetricFamily(m)','data-axis821-family','data-axis821-choice','data-axis821-pace-step','data-axis821-rate','data-axis821-bool'])if(!metricRenderer.includes(token))fail('metric-control-system recorder renderer contract missing '+token);if((app.match(/state\\.active\\.events\\.push\\(/g)||[]).length!==1)fail('Encounter append ownership drift');";
 s=once(s,anchor,replacement,'Executable Object renderer ownership assertion');write(file,s);
}

/* Object Capability owns the pure registry/kind/binding/inference, not renderer. */
{
 const file='prepare-821-object-capability-convergence.mjs';let s=read(file);
 const start=" s=replaceFunction(s,'function axis821MetricControl(m,prev)',`function axis821MetricControl(m,prev){";
 const end="`,'capability-driven metric controls');";
 const a=s.indexOf(start),b=s.indexOf(end,a);if(a<0||b<=a)fail('Object Capability duplicate renderer mutation missing');
 s=s.slice(0,a)+s.slice(b+end.length);
 const marker=' const marker="window.__AXIS_821_RECORDING_SURFACE__=";';
 const assertion=" const metricRenderer=functionRange(s,'function axis821MetricControl(m,prev)','metric-control-system recorder renderer').text;for(const token of ['axis821MetricFamily(m)','AXIS821_RUNTIME_CAPABILITIES','data-axis821-family','data-axis821-choice','data-axis821-pace-step','data-axis821-rate','data-axis821-bool'])if(!metricRenderer.includes(token))fail('metric-control-system recorder renderer lost capability contract '+token);\n";
 s=once(s,marker,assertion+marker,'Object Capability renderer ownership assertion');write(file,s);
}

/* Runtime safety keeps lexical/sanitization ownership but becomes assertion-only
 * for recorder presentation. It must never rewrite the canonical metric renderer. */
{
 const file='prepare-821-object-capability-runtime-safety.mjs';let s=read(file);
 const startToken="const controlSignature='function axis821MetricControl(m,prev)';";
 const endToken='/* Final lexical seal.';
 const a=s.indexOf(startToken),b=s.indexOf(endToken,a);if(a<0||b<=a)fail('runtime-safety metric renderer block missing');
 const replacement=`const controlSignature='function axis821MetricControl(m,prev)';\nconst control=functionRange(s,controlSignature,'metric-control-system recorder renderer');\nfor(const token of ['axis821MetricFamily(m)','AXIS821_RUNTIME_CAPABILITIES',\"if(kind==='pace'){\",'data-axis821-family','data-axis821-choice','data-axis821-pace-step','data-axis821-rate','data-axis821-bool'])if(!control.text.includes(token))fail('metric-control-system recorder renderer safety contract missing '+token);\nif(control.text.includes('km$/')||control.text.includes('km$'))fail('metric-control-system recorder renderer contains compiler-unsafe pace token');\n\n`;
 s=s.slice(0,a)+replacement+s.slice(b);
 write(file,s);
}

/* Final release seal only asserts the unified renderer; it does not repair it. */
{
 const file='postbuild-821-executable-object-presentation-seal.mjs';let s=read(file);
 const anchor="if(!src.includes('function axis821EventMetricSummary(e)'))fail('schema-aware Encounter summary helper missing from final runtime');";
 const proof=`\n{\n const renderer=moduleFunctionRange(src,'app.js','function axis821MetricControl(m,prev)','final metric-control-system recorder renderer').text;\n for(const token of ['axis821MetricFamily(m)','AXIS821_RUNTIME_CAPABILITIES','data-axis821-family','data-axis821-choice','data-axis821-pace-step','data-axis821-rate','data-axis821-bool'])if(!renderer.includes(token))fail('final recorder renderer lost unified contract · '+token);\n}\n`;
 s=once(s,anchor,anchor+proof,'final unified renderer assertion');write(file,s);
}

console.log('[AXIS 8.21 recorder renderer owner retirement] staged · one Metric Control renderer owns geometry + capability semantics · downstream renderer replacements retired · runtime safety assertion-only');
