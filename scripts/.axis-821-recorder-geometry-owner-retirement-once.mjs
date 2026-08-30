import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 recorder geometry owner retirement] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);

{
 const FILE='prepare-821-executable-object-system.mjs';let s=read(FILE);
 const start='.axis818MetricRecorder{margin:12px 0 6px!important}';
 const media='@media(max-width:390px){.axis821PickerGroup>div{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.axis821PickerGroup button{height:44px;padding:0 7px;font-size:11px}.axis821Presets{grid-template-columns:repeat(5,minmax(0,1fr))!important}}';
 const cleanMedia='@media(max-width:390px){.axis821PickerGroup>div{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.axis821PickerGroup button{height:44px;padding:0 7px;font-size:11px}}';
 const a=s.indexOf(start);if(a<0)fail('legacy executable-object recorder CSS start missing');if(s.indexOf(start,a+1)>=0)fail('legacy executable-object recorder CSS duplicated');
 const m=s.indexOf(media,a);if(m<0)fail('legacy executable-object media query missing');
 s=s.slice(0,a)+cleanMedia+s.slice(m+media.length);
 const anchor="const app=read('app.js');if((app.match(/state\\.active\\.events\\.push\\(/g)||[]).length!==1)fail('Encounter append ownership drift');";
 if((s.split(anchor).length-1)!==1)fail('Executable Object final contract anchor missing or duplicated');
 const assertion="{const css=read('styles.css'),marker='/* AXIS 8.21 Executable Object System */',at=css.indexOf(marker);if(at<0)fail('Executable Object CSS marker missing');const owned=css.slice(at);for(const selector of ['.axis818MetricRecorder{','.axis821MetricControl{','.axis821MetricLabel{','.axis821Stepper{','.axis821Stepper>button{','.axis821Stepper>div{','.axis821Stepper input{','.axis821Presets{','.axis821Rating{','.axis821Toggle{','.axis821Direct{','.axis821NoMetrics{'])if(owned.includes(selector))fail(`Executable Object must not own recorder geometry: ${selector}`)}\n";
 s=s.replace(anchor,assertion+anchor);
 const oldLog="console.log('[AXIS 8.21 Executable Object System] PASS · schema+execution Object contract · continuous metrics auto-timed · same recorder/Encounter/Active owners · snapshot-aware history · compact property/execution UI · no new storage');";
 const newLog="console.log('[AXIS 8.21 Executable Object System] PASS · schema+execution Object contract · continuous metrics auto-timed · recorder geometry remains metric-control-system-owned · same recorder/Encounter/Active owners · snapshot-aware history · compact property/execution UI · no new storage');";
 if((s.split(oldLog).length-1)!==1)fail('Executable Object PASS log anchor missing or duplicated');s=s.replace(oldLog,newLog);
 write(FILE,s);
}

{
 const FILE='postbuild-821-executable-object-presentation-seal.mjs';let s=read(FILE);
 const anchor="let src=fs.readFileSync(runtimeFile,'utf8');\n";
 if((s.split(anchor).length-1)!==1)fail('final presentation seal runtime anchor missing or duplicated');
 const seal=`let src=fs.readFileSync(runtimeFile,'utf8');
const axis821GeometryHtml=fs.readFileSync(indexFile,'utf8'),axis821GeometryCssHref=(axis821GeometryHtml.match(/href=["']([^"']*axis-style\\.css(?:\\?[^"']*)?)["']/)||[])[1];
if(!axis821GeometryCssHref)fail('canonical CSS asset reference missing');
const axis821GeometryCssFile=axis821GeometryCssHref.split('?')[0].replace(/^\\/+/,''),axis821GeometryCssPath=fs.existsSync(axis821GeometryCssFile)?axis821GeometryCssFile:'axis-style.css';
if(!fs.existsSync(axis821GeometryCssPath))fail('canonical CSS asset missing · '+axis821GeometryCssPath);
const axis821GeometryFinalCss=fs.readFileSync(axis821GeometryCssPath,'utf8'),axis821GeometryMetricMarker='/* AXIS 8.21 Metric Control System */',axis821GeometryExecMarker='/* AXIS 8.21 Executable Object System */',axis821GeometryMetricAt=axis821GeometryFinalCss.indexOf(axis821GeometryMetricMarker),axis821GeometryExecAt=axis821GeometryFinalCss.indexOf(axis821GeometryExecMarker);
if(axis821GeometryMetricAt<0)fail('final metric-control CSS owner marker missing');
if(axis821GeometryExecAt<0||axis821GeometryExecAt<=axis821GeometryMetricAt)fail('final Executable Object CSS marker/order drift');
const axis821GeometryMetricCss=axis821GeometryFinalCss.slice(axis821GeometryMetricAt,axis821GeometryExecAt),axis821GeometryExecCss=axis821GeometryFinalCss.slice(axis821GeometryExecAt);
for(const axis821GeometryToken of ['.axis821Stepper>div{height:64px!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr)!important;','.axis821Stepper input{grid-column:2!important;justify-self:center!important;','text-align:center!important'])if(!axis821GeometryMetricCss.includes(axis821GeometryToken))fail('final metric-control geometry missing · '+axis821GeometryToken);
for(const axis821GeometrySelector of ['.axis818MetricRecorder{','.axis821MetricControl{','.axis821MetricLabel{','.axis821Stepper{','.axis821Stepper>button{','.axis821Stepper>div{','.axis821Stepper input{','.axis821Presets{','.axis821Rating{','.axis821Toggle{','.axis821Direct{','.axis821NoMetrics{'])if(axis821GeometryExecCss.includes(axis821GeometrySelector))fail('later Executable Object CSS reclaims recorder geometry · '+axis821GeometrySelector);
`;
 s=s.replace(anchor,seal);
 write(FILE,s);
}

console.log('[AXIS 8.21 recorder geometry owner retirement] staged · one recorder geometry owner · final CSS anti-supersede seal');