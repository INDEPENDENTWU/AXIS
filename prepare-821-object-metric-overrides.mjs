import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Object metric overrides] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(`${f} syntax ${e.message}`)}};
function functionRange(src,signature,label){
 const start=src.indexOf(signature);if(start<0)fail(`${label} signature missing`);if(src.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);
 const brace=src.indexOf('{',start+signature.length-1);if(brace<0)fail(`${label} opening brace missing`);let depth=0,quote='',escaped=false,line=false,block=false,end=-1;
 for(let i=brace;i<src.length;i++){
  const ch=src[i],next=src[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}
  if(quote){if(escaped){escaped=false;continue}if(ch==='\\'){escaped=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++;else if(ch==='}'&&--depth===0){end=i+1;break}
 }
 if(end<0)fail(`${label} closing brace missing`);return{start,end,text:src.slice(start,end)};
}
function replaceFunction(src,signature,replacement,label){const r=functionRange(src,signature,label);return src.slice(0,r.start)+replacement+src.slice(r.end)}

/* Settings owns only a per-user override preference. It never edits the built-in
 * catalog definition and never becomes an Encounter/schema factual owner. */
{
 const FILE='index.html';let s=read(FILE);
 if(s.includes('axisObjectMetricSettingsBtn'))fail('settings entry already installed');
 const settingRe=/<button class="settingLink" id="myEqBtn">[\s\S]*?<\/button>/g,matches=s.match(settingRe)||[];
 if(matches.length!==1)fail(`my-equipment settings anchor expected once, found ${matches.length}`);
 const entry='<button class="settingLink" id="axisObjectMetricSettingsBtn"><span>记录内容</span><b>按项目设置</b><i>›</i></button>';
 s=s.replace(settingRe,m=>m+'\n    '+entry);
 const sheetAnchor='<div class="sheetWrap" id="profileSheet">';
 if(s.split(sheetAnchor).length-1!==1)fail('profile sheet anchor missing or duplicated');
 const sheets=`<div class="sheetWrap" id="axisObjectMetricSettingsSheet"><div class="sheet">
  <div class="grabber"></div><div class="sheetHead"><b>记录内容</b><button class="closeBtn" data-close="axisObjectMetricSettingsSheet">×</button></div>
  <div class="axis821ObjectMetricIntro"><b>按项目决定记录什么</b><span>只改变你的记录界面，不修改 AXIS 内置项目。</span></div>
  <input class="search" id="axisObjectMetricSearch" placeholder="搜索器械或项目">
  <div class="axis821ObjectMetricList" id="axisObjectMetricList"></div>
 </div></div>

<div class="sheetWrap" id="axisObjectMetricEditSheet"><div class="sheet">
  <div class="grabber"></div><div class="sheetHead"><b id="axisObjectMetricEditTitle">记录内容</b><button class="closeBtn" data-close="axisObjectMetricEditSheet">×</button></div>
  <div class="axis821ObjectMetricIntro"><b id="axisObjectMetricEditName">—</b><span>选择每次记录这个项目时需要填写的内容。可以只保留一项，也可以不记录数值。</span></div>
  <div class="axis821ObjectMetricChoices" id="axisObjectMetricChoices"></div>
  <div class="axis821ObjectMetricState" id="axisObjectMetricState"></div>
  <button class="saveRecord" id="axisObjectMetricSave">保存</button>
  <button class="textAction" id="axisObjectMetricReset">恢复 AXIS 默认</button>
 </div></div>

`;
 s=s.replace(sheetAnchor,sheets+sheetAnchor);write(FILE,s);
}

{
 const FILE='styles.css';let s=read(FILE);
 if(s.includes('AXIS 8.21 Object metric override settings'))fail('override styles already installed');
 s+=`\n/* AXIS 8.21 Object metric override settings */\n.axis821ObjectMetricIntro{padding:4px 1px 14px;display:grid;gap:5px}.axis821ObjectMetricIntro b{font-size:15px;font-weight:650}.axis821ObjectMetricIntro span{font-size:12px;line-height:1.55;color:var(--dim)}.axis821ObjectMetricList{display:grid;margin-top:10px;border-top:1px solid var(--line)}.axis821ObjectMetricRow{min-height:66px;padding:10px 1px;display:flex;align-items:center;justify-content:space-between;gap:14px;border-bottom:1px solid var(--line);text-align:left}.axis821ObjectMetricRow>span{display:grid;gap:5px;min-width:0}.axis821ObjectMetricRow b{font-size:15px;font-weight:610;color:var(--text)}.axis821ObjectMetricRow small{font-size:11.5px;line-height:1.4;color:var(--dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.axis821ObjectMetricRow em{font-size:18px;color:var(--dim);font-style:normal}.axis821ObjectMetricChoices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding:4px 0 14px}.axis821ObjectMetricChoices button{min-height:46px;padding:6px 8px;border-radius:14px;background:var(--s2);color:var(--dim);font-size:13px;font-weight:620;line-height:1.2}.axis821ObjectMetricChoices button.active{background:rgba(115,124,255,.16);color:var(--accent2);box-shadow:inset 0 0 0 1px rgba(115,124,255,.24)}.axis821ObjectMetricState{min-height:36px;padding:2px 1px 12px;color:var(--dim);font-size:12px;line-height:1.5}.axis821ObjectMetricState b{color:var(--text);font-weight:620}.axis821ObjectMetricEmpty{padding:28px 4px;text-align:center;color:var(--dim);font-size:13px}@media(max-width:380px){.axis821ObjectMetricChoices{gap:7px}.axis821ObjectMetricChoices button{font-size:12px;min-height:44px}}\n`;
 write(FILE,s);
}

{
 const FILE='app.js';let s=read(FILE);
 if(s.includes('__AXIS_821_OBJECT_METRIC_OVERRIDES__'))fail('runtime override capability already installed');
 const schemaSig='function axis818SchemaForEq(ref)',schemaRange=functionRange(s,schemaSig,'Object schema resolver');
 const baseSchema=schemaRange.text.replace(schemaSig,'function axis821BaseSchemaForEq(ref)');
 const schemaWrapper=`${baseSchema}\nfunction axis818SchemaForEq(ref){const eq=axis818Eq(ref);if(!eq)return axis821BaseSchemaForEq(ref);const o=axis821ObjectMetricOverrideFor(eq);if(o===null)return axis821BaseSchemaForEq(ref);const base=axis821BaseSchemaForEq(ref),byKey=new Map(base.map(x=>[String(x?.key||x?.id||''),x]));return o.metrics.map(key=>{const source=byKey.get(key)||AXIS818_METRICS[key];return source?axis818CloneMetric(source):null}).filter(Boolean)}`;
 s=replaceFunction(s,schemaSig,schemaWrapper,'resolved Object schema override');
 const explicitSig='function axis818HasExplicitSchema(ref)',explicitRange=functionRange(s,explicitSig,'Object explicit schema resolver');
 const baseExplicit=explicitRange.text.replace(explicitSig,'function axis821BaseHasExplicitSchema(ref)');
 const explicitWrapper=`${baseExplicit}\nfunction axis818HasExplicitSchema(ref){const eq=axis818Eq(ref);return !!eq&&axis821ObjectMetricOverrideFor(eq)!==null?true:axis821BaseHasExplicitSchema(ref)}`;
 s=replaceFunction(s,explicitSig,explicitWrapper,'override explicit-presence resolver');

 const close=s.indexOf('})();'),stateAt=s.indexOf('let state={');
 if(stateAt<0||close<0||close<=stateAt)fail('canonical app lexical owner missing');
 const block=String.raw`
/* AXIS 8.21 — built-in Object recording preferences. Canonical Object and
   Encounter definitions remain immutable; profile stores only user intent. */
const AXIS821_OBJECT_OVERRIDE_KEYS=['weight','reps','sets','duration','hold','distance','pace','intensity','resistance','level','speed','incline','rating','completed'];
let axis821ObjectMetricEditId='';
function axis821ObjectMetricItems(){const x=state.profile?.objectMetricOverrides;return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}
function axis821ObjectMetricIsCustom(eq){return !!eq&&(eq.custom===true||String(eq.id||'').startsWith('custom-'))}
function axis821ObjectMetricOverrideFor(eq){if(!eq||axis821ObjectMetricIsCustom(eq))return null;const id=String(eq.id||'').trim(),items=axis821ObjectMetricItems();if(!id||!Object.prototype.hasOwnProperty.call(items,id))return null;const raw=items[id],xs=Array.isArray(raw)?raw:(Array.isArray(raw?.metrics)?raw.metrics:[]),seen=new Set(),metrics=[];for(const k of xs.map(x=>String(x?.key||x?.id||x||'').trim()))if(AXIS821_OBJECT_OVERRIDE_KEYS.includes(k)&&!seen.has(k)){seen.add(k);metrics.push(k)}return{version:1,metrics,updatedAt:Number(raw?.updatedAt)||null}}
function axis821ObjectMetricWrite(id,metrics){id=String(id||'').trim();if(!id)return false;state.profile=state.profile||{};const items={...axis821ObjectMetricItems()},seen=new Set(),clean=[];for(const k of (metrics||[]).map(String))if(AXIS821_OBJECT_OVERRIDE_KEYS.includes(k)&&!seen.has(k)){seen.add(k);clean.push(k)}items[id]={version:1,metrics:clean,updatedAt:Date.now()};state.profile.objectMetricOverrides=items;save();return true}
function axis821ObjectMetricReset(id){id=String(id||'').trim();if(!id)return false;state.profile=state.profile||{};const items={...axis821ObjectMetricItems()};if(!Object.prototype.hasOwnProperty.call(items,id))return true;delete items[id];state.profile.objectMetricOverrides=items;save();return true}
function axis821ObjectMetricCatalog(){const lib=Array.isArray(window.__AXIS_873_LIBRARY__)?window.__AXIS_873_LIBRARY__:[];const out=[],seen=new Set();for(const raw of lib){const id=String(raw?.id||'').trim();if(!id||seen.has(id))continue;seen.add(id);const eq=axis818Eq(id)||raw;if(axis821ObjectMetricIsCustom(eq))continue;out.push(eq)}return out}
function axis821ObjectMetricDefinition(eq,key){const base=axis821BaseSchemaForEq(eq),hit=base.find(x=>String(x?.key||x?.id||'')===key)||AXIS818_METRICS[key];return hit?axis818CloneMetric(hit):null}
function axis821ObjectMetricDefinitions(eq){return AXIS821_OBJECT_OVERRIDE_KEYS.map(k=>axis821ObjectMetricDefinition(eq,k)).filter(Boolean)}
function axis821ObjectMetricLabel(m){return String(m?.label||m?.key||m?.id||'')}
function axis821ObjectMetricSummary(eq,{base=false}={}){const schema=base?axis821BaseSchemaForEq(eq):axis818SchemaForEq(eq),labels=(schema||[]).map(axis821ObjectMetricLabel).filter(Boolean);return labels.length?labels.join(' · '):'不记录数值'}
function axis821ObjectMetricRefreshRecorder(id){if(String(state.selectedEq||'')!==String(id||''))return;const host=$('#axis818MetricRecorder');if(host)host.dataset.axis818RenderKey='';try{axis818RenderRecorder()}catch{}}
function axis821RenderObjectMetricList(){const host=$('#axisObjectMetricList');if(!host)return;const q=String($('#axisObjectMetricSearch')?.value||'').trim().toLowerCase(),list=axis821ObjectMetricCatalog().filter(eq=>!q||[eq.name,...(eq.aliases||[])].some(x=>String(x||'').toLowerCase().includes(q))).slice(0,140);host.innerHTML=list.length?list.map(eq=>{const o=axis821ObjectMetricOverrideFor(eq),meta=(o?'已调整 · ':'默认 · ')+axis821ObjectMetricSummary(eq);return'<button type="button" class="axis821ObjectMetricRow" data-axis821-object-metric-open="'+esc(eq.id)+'"><span><b>'+esc(eq.name||eq.id)+'</b><small>'+esc(meta)+'</small></span><em>›</em></button>'}).join(''):'<div class="axis821ObjectMetricEmpty">没有匹配的项目</div>'}
function axis821OpenObjectMetricSettings(){const input=$('#axisObjectMetricSearch');if(input)input.value='';axis821RenderObjectMetricList();openSheet('axisObjectMetricSettingsSheet')}
function axis821OpenObjectMetricEdit(id){const eq=axis818Eq(id)||axis821ObjectMetricCatalog().find(x=>String(x.id)===String(id));if(!eq||axis821ObjectMetricIsCustom(eq))return;axis821ObjectMetricEditId=String(eq.id);setText('#axisObjectMetricEditName',eq.name||eq.id);setText('#axisObjectMetricEditTitle','记录内容');const o=axis821ObjectMetricOverrideFor(eq),selected=new Set(o?o.metrics:axis821BaseSchemaForEq(eq).map(x=>String(x?.key||x?.id||''))),defs=axis821ObjectMetricDefinitions(eq),host=$('#axisObjectMetricChoices');if(host)host.innerHTML=defs.map(m=>'<button type="button" data-axis821-object-metric-choice="'+esc(m.key)+'" class="'+(selected.has(m.key)?'active':'')+'">'+esc(axis821ObjectMetricLabel(m))+'</button>').join('');axis821UpdateObjectMetricState();openSheet('axisObjectMetricEditSheet')}
function axis821ObjectMetricSelected(){return Array.from(D.querySelectorAll('#axisObjectMetricChoices [data-axis821-object-metric-choice].active')).map(x=>x.dataset.axis821ObjectMetricChoice).filter(Boolean)}
function axis821UpdateObjectMetricState(){const id=axis821ObjectMetricEditId,eq=axis818Eq(id)||axis821ObjectMetricCatalog().find(x=>String(x.id)===String(id)),host=$('#axisObjectMetricState');if(!eq||!host)return;const xs=axis821ObjectMetricSelected(),current=axis821ObjectMetricOverrideFor(eq),defaultText=axis821ObjectMetricSummary(eq,{base:true});host.innerHTML='<b>'+(xs.length?esc(xs.map(k=>axis821ObjectMetricLabel(axis821ObjectMetricDefinition(eq,k))).filter(Boolean).join(' · ')):'不记录数值')+'</b><br>'+(current?'当前使用个人设置':'当前使用 AXIS 默认')+' · 默认 '+esc(defaultText)}
D.addEventListener('click',e=>{if(e.target.closest('#axisObjectMetricSettingsBtn')){e.preventDefault();axis821OpenObjectMetricSettings();return}const row=e.target.closest('[data-axis821-object-metric-open]');if(row){e.preventDefault();axis821OpenObjectMetricEdit(row.dataset.axis821ObjectMetricOpen);return}const choice=e.target.closest('[data-axis821-object-metric-choice]');if(choice){e.preventDefault();choice.classList.toggle('active');axis821UpdateObjectMetricState();return}if(e.target.closest('#axisObjectMetricSave')){e.preventDefault();if(!axis821ObjectMetricEditId)return;axis821ObjectMetricWrite(axis821ObjectMetricEditId,axis821ObjectMetricSelected());axis821ObjectMetricRefreshRecorder(axis821ObjectMetricEditId);closeSheet('axisObjectMetricEditSheet');axis821RenderObjectMetricList();toast('记录内容已保存');return}if(e.target.closest('#axisObjectMetricReset')){e.preventDefault();if(!axis821ObjectMetricEditId)return;axis821ObjectMetricReset(axis821ObjectMetricEditId);axis821ObjectMetricRefreshRecorder(axis821ObjectMetricEditId);closeSheet('axisObjectMetricEditSheet');axis821RenderObjectMetricList();toast('已恢复 AXIS 默认');return}},true);
D.addEventListener('input',e=>{if(e.target?.id==='axisObjectMetricSearch')axis821RenderObjectMetricList()},true);
try{window.__AXIS_821_OBJECT_METRIC_OVERRIDES__={version:'8.21',owner:'app-profile-preference',storage:'axis_v60_state.profile.objectMetricOverrides',builtInDefinitionMutation:false,newPersistence:false,newRecorder:false,newEncounterWriter:false,explicitEmpty:true,has:id=>axis821ObjectMetricOverrideFor(axis818Eq(id)||axis821ObjectMetricCatalog().find(x=>String(x.id)===String(id)))!==null,baseSchema:id=>axis821BaseSchemaForEq(axis818Eq(id)||id).map(x=>String(x?.key||x?.id||'')),resolvedSchema:id=>axis818SchemaForEq(axis818Eq(id)||id).map(x=>String(x?.key||x?.id||'')),executionMode:id=>{const eq=axis818Eq(id)||axis821ObjectMetricCatalog().find(x=>String(x.id)===String(id));return eq?axis821AutoExecutionMode(eq,axis818SchemaForEq(eq)):null}}}catch{}
`;
 s=s.slice(0,close)+'\n'+block+'\n'+s.slice(close);
 const finalClose=s.indexOf('})();');for(const needle of ['function axis821ObjectMetricOverrideFor(eq)','function axis818SchemaForEq(ref)','__AXIS_821_OBJECT_METRIC_OVERRIDES__']){const at=s.indexOf(needle);if(at<stateAt||at>finalClose)fail(`app owner scope drift · ${needle}`)}
 if((s.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('Encounter append owner drift');
 for(const forbidden of ['axis_v821_object_metric_overrides','localStorage.setItem(\'axis_v821','localStorage.setItem("axis_v821'])if(s.includes(forbidden))fail(`new persistence namespace forbidden · ${forbidden}`);
 syntax(s,FILE);write(FILE,s);
}

console.log('[AXIS 8.21 Object metric overrides] PASS · built-in definitions immutable · app profile preference only · resolved schema feeds existing recorder / execution / Encounter snapshot · explicit empty supported · no new persistence/recorder/writer');
