import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Metric Optical System] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(`${f} syntax ${e.message}`)}};

function functionRange(src,signature,label){
  const start=src.indexOf(signature);
  if(start<0)fail(`${label} signature missing`);
  if(src.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);
  const brace=src.indexOf('{',start+signature.length-1);
  if(brace<0)fail(`${label} opening brace missing`);
  let depth=0,quote='',escaped=false,line=false,block=false,end=-1;
  for(let i=brace;i<src.length;i++){
    const ch=src[i],next=src[i+1]||'';
    if(line){if(ch==='\n')line=false;continue}
    if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}
    if(quote){if(escaped){escaped=false;continue}if(ch==='\\'){escaped=true;continue}if(ch===quote)quote='';continue}
    if(ch==='/'&&next==='/'){line=true;i++;continue}
    if(ch==='/'&&next==='*'){block=true;i++;continue}
    if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue}
    if(ch==='{')depth++;
    else if(ch==='}'&&--depth===0){end=i+1;break}
  }
  if(end<0)fail(`${label} closing brace missing`);
  return {start,end,text:src.slice(start,end)};
}
function replaceFunction(src,signature,replacement,label){
  const r=functionRange(src,signature,label);
  return src.slice(0,r.start)+replacement+src.slice(r.end);
}

/*
 * Current stable intensity semantics are an ordinal 1–20 scale with no unit.
 * This resolver is current-Object-only. Historical Encounter schema snapshots
 * are stored facts and are deliberately never traversed or rewritten here.
 */
{
  const FILE='app.js';
  let s=read(FILE);
  if(s.includes('__AXIS_821_METRIC_OPTICAL_SYSTEM__'))fail('metric optical projection already installed');

  const schemaSignature='function axis818SchemaForEq(ref)';
  const schema=functionRange(s,schemaSignature,'resolved Object metric schema');
  const baseSchema=schema.text.replace(schemaSignature,'function axis821MetricOpticalBaseSchemaForEq(ref)');
  const resolved=`${baseSchema}\nfunction axis818SchemaForEq(ref){const xs=axis821MetricOpticalBaseSchemaForEq(ref);if(!Array.isArray(xs))return xs;return xs.map(m=>{const key=String(m?.key||m?.id||'');if(key!=='intensity')return m;return{...m,key:m?.key||'intensity',id:m?.id||'intensity',label:m?.label||'强度',type:'rating',unit:'',presentation:'rating',min:1,max:20,step:1,presets:[4,8,12,16,20]}})}`;
  s=replaceFunction(s,schemaSignature,resolved,'current intensity schema normalization');

  const controlSignature='function axis821MetricControl(m,prev)';
  const control=functionRange(s,controlSignature,'canonical metric control');
  const baseControl=control.text.replace(controlSignature,'function axis821MetricOpticalBaseControl(m,prev)');
  const opticalControl=`${baseControl}\nfunction axis821MetricControl(m,prev){const metricKey=String(m?.key||m?.id||'');if(metricKey!=='intensity')return axis821MetricOpticalBaseControl(m,prev);const key=esc(metricKey),label=esc(m?.label||'强度'),raw=axis821MetricValue(prev),value=raw,visual=value||'—',valueChars=Math.max(1,Math.min(3,String(visual).length)),current=Number(value)||0,levels=[4,8,12,16,20];return'<section class="axis821MetricControl axis821OrdinalMetric" data-axis821-kind="rating" data-axis821-family="scale" data-axis821-key="'+key+'"><div class="axis821MetricLabel"><span>'+label+'</span></div><div class="axis821RatingMain axis821Stepper axis821OrdinalMain"><button type="button" aria-label="减少'+label+'" data-axis821-step="'+key+'" data-delta="-1">−</button><div><input data-axis818-metric="'+key+'" inputmode="numeric" autocomplete="off" style="width:'+valueChars+'ch" value="'+esc(value)+'" placeholder="—" data-min="1" data-max="20"></div><button type="button" aria-label="增加'+label+'" data-axis821-step="'+key+'" data-delta="1">＋</button></div><div class="axis821Rating axis821OrdinalRail" aria-label="'+label+' 1 到 20">'+levels.map(n=>'<button type="button" data-axis821-rate="'+key+'" data-value="'+n+'" class="'+(current===n?'active':'')+'">'+n+'</button>').join('')+'</div></section>'}`;
  s=replaceFunction(s,controlSignature,opticalControl,'intensity ordinal control');

  const stateAt=s.indexOf('let state={'),closeAt=s.indexOf('})();');
  if(stateAt<0||closeAt<0||closeAt<=stateAt)fail('canonical app lexical owner missing');
  const marker="\ntry{window.__AXIS_821_METRIC_OPTICAL_SYSTEM__={version:'8.21',owner:'canonical-metric-renderer',intensity:{kind:'ordinal',min:1,max:20,step:1,unit:'',presets:[4,8,12,16,20]},headerUnitDuplicate:false,historyMigration:false,newSchemaVersion:false,newRecorder:false,newPersistence:false,newEncounterWriter:false}}catch{};\n";
  s=s.slice(0,closeAt)+marker+s.slice(closeAt);

  const finalSchema=functionRange(s,schemaSignature,'final resolved Object metric schema').text;
  const finalControl=functionRange(s,controlSignature,'final metric control').text;
  for(const token of ["key!=='intensity'","max:20","unit:''","presets:[4,8,12,16,20]"])if(!finalSchema.includes(token))fail(`final intensity schema missing ${token}`);
  for(const token of ['axis821OrdinalMetric','data-max="20"','axis821OrdinalRail','[4,8,12,16,20]'])if(!finalControl.includes(token))fail(`final intensity control missing ${token}`);
  if(finalControl.includes('/10'))fail('stable intensity control still renders /10');
  syntax(s,FILE);
  write(FILE,s);
}

/*
 * Optical typography is presentation-only. Units appear once beside the value;
 * the title row does not repeat them. Numeric glyphs, real units and presets
 * share one legible scale instead of the previous 9.5–11px microtype.
 */
{
  const FILE='styles.css';
  let s=read(FILE);
  if(s.includes('AXIS 8.21 Metric Optical System'))fail('metric optical styles already installed');
  s+=`\n/* AXIS 8.21 Metric Optical System */\n.axis821MetricControl{font-variant-numeric:tabular-nums lining-nums}.axis821MetricControl .axis821MetricLabel{min-height:24px;display:flex;align-items:center;justify-content:space-between}.axis821MetricControl .axis821MetricLabel>span{font-size:14px!important;line-height:1.35;font-weight:620;letter-spacing:-.01em}.axis821MetricControl .axis821MetricLabel>small{display:none!important}.axis821MetricControl .axis821Stepper input[data-axis818-metric]{font-size:21px!important;line-height:1!important;font-weight:590;letter-spacing:-.02em;font-variant-numeric:tabular-nums lining-nums}.axis821MetricControl .axis821Stepper>div>small{font-size:14px!important;line-height:1!important;font-weight:540;letter-spacing:-.01em;opacity:.82}.axis821MetricControl .axis821Presets button,.axis821MetricControl .axis821Rating button{font-size:13.5px!important;line-height:1.15!important;font-weight:540!important;font-variant-numeric:tabular-nums lining-nums;min-height:44px}.axis821MetricControl .axis821OrdinalMain>div{display:flex!important;align-items:center!important;justify-content:center!important;gap:0!important;grid-template-columns:none!important}.axis821MetricControl .axis821OrdinalMain input[data-axis818-metric]{text-align:center!important;min-width:1ch}.axis821MetricControl .axis821OrdinalRail{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:8px!important}body.axis821RecordingSurface #axis818MetricRecorder .axis821MetricControl .axis821MetricLabel>span{font-size:14px!important}body.axis821RecordingSurface #axis818MetricRecorder .axis821MetricControl .axis821Stepper input[data-axis818-metric]{font-size:21px!important}body.axis821RecordingSurface #axis818MetricRecorder .axis821MetricControl .axis821Stepper>div>small{font-size:14px!important}body.axis821RecordingSurface #axis818MetricRecorder .axis821MetricControl .axis821Presets button,body.axis821RecordingSurface #axis818MetricRecorder .axis821MetricControl .axis821Rating button{font-size:13.5px!important}@media(max-width:380px){.axis821MetricControl .axis821MetricLabel>span{font-size:13.5px!important}.axis821MetricControl .axis821Stepper input[data-axis818-metric]{font-size:20px!important}.axis821MetricControl .axis821Stepper>div>small{font-size:13.5px!important}.axis821MetricControl .axis821Presets button,.axis821MetricControl .axis821Rating button{font-size:12.5px!important}.axis821MetricControl .axis821OrdinalRail{gap:7px!important}}\n`;
  write(FILE,s);
}

console.log('[AXIS 8.21 Metric Optical System] PASS · stable intensity 1–20 ordinal/no unit · 4/8/12/16/20 rail · unit rendered once beside value · optical metric typography unified · no history migration · no new owner');