import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 recorder renderer owner retirement] ${m}`)};

{
 const file='prepare-821-executable-object-system.mjs';
 let s=fs.readFileSync(file,'utf8');
 const startToken='/* app recorder — one stable control geometry for every metric family. */';
 const endToken='/* Static CSS only. Existing design tokens; no runtime geometry owner. */';
 const start=s.indexOf(startToken),end=s.indexOf(endToken,start);
 if(start<0||end<0||end<=start)fail('Executable Object recorder renderer block boundary missing');
 const owned=s.slice(start,end);
 if(!owned.includes("replaceFunction(s,'function axis821MetricControl(m,prev)'"))fail('duplicate recorder renderer mutation missing from expected owner block');
 s=s.slice(0,start)+`/* Recorder controls are rendered exclusively by prepare-821-metric-control-system.\n * Executable Object owns schema/execution UI only and must not supersede that renderer. */\n\n`+s.slice(end);
 const anchor="const app=read('app.js');if((app.match(/state\\.active\\.events\\.push\\(/g)||[]).length!==1)fail('Encounter append ownership drift');";
 if((s.split(anchor).length-1)!==1)fail('Executable Object app contract anchor missing or duplicated');
 const replacement="const app=read('app.js'),metricRenderer=functionRange(app,'function axis821MetricControl(m,prev)','metric-control-system-owned recorder renderer').text;for(const token of ['axis821MetricFamily(m)','data-axis821-family','data-axis821-pace-step','data-axis821-rate','data-axis821-bool'])if(!metricRenderer.includes(token))fail('metric-control-system recorder renderer contract missing '+token);if((app.match(/state\\.active\\.events\\.push\\(/g)||[]).length!==1)fail('Encounter append ownership drift');";
 s=s.replace(anchor,replacement);
 fs.writeFileSync(file,s);
}

{
 const file='postbuild-821-executable-object-presentation-seal.mjs';
 let s=fs.readFileSync(file,'utf8');
 const anchor="if(!src.includes('function axis821EventMetricSummary(e)'))fail('schema-aware Encounter summary helper missing from final runtime');";
 if((s.split(anchor).length-1)!==1)fail('final runtime assertion anchor missing or duplicated');
 const proof=`\n{\n const renderer=moduleFunctionRange(src,'app.js','function axis821MetricControl(m,prev)','final metric-control-system recorder renderer').text;\n for(const token of ['axis821MetricFamily(m)','data-axis821-family','data-axis821-pace-step','data-axis821-rate','data-axis821-bool'])if(!renderer.includes(token))fail('final recorder renderer lost metric-control-system contract · '+token);\n}\n`;
 s=s.replace(anchor,anchor+proof);
 fs.writeFileSync(file,s);
}

console.log('[AXIS 8.21 recorder renderer owner retirement] staged · Executable Object no longer rewrites recorder controls · final renderer contract assertion added');
