import fs from 'node:fs';

const PUBLIC='8.8';
const fail=m=>{console.error(`::error title=AXIS 8.8 convergence::${m}`);throw new Error(`AXIS 8.8 convergence: ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
function textOnce(src,from,to,label){const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)}
function regexOnce(src,re,to,label){const flags=re.flags.includes('g')?re.flags:re.flags+'g',m=src.match(new RegExp(re.source,flags))||[];if(m.length!==1)fail(`${label} expected once, found ${m.length}`);return src.replace(re,to)}
function syntax(src,label){try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}}

for(const f of ['build-hardened.mjs','postbuild-features-hardened.mjs','app.js','v61.js','v873-smart-input.js','v874-professional.js','v876-runtime.js','v877-runtime.js','v8710-watermark.js','v8712-runtime.js','v88.css'])read(f);

/* 8.8 critical presentation ships in the static stylesheet bundle. */
{
 let src=read('build-hardened.mjs');
 src=textOnce(src,"const cssFiles=['styles.css','v61.css','runtime-hardening.css','product-convergence.css','first-paint-shell.css'];","const cssFiles=['styles.css','v61.css','runtime-hardening.css','product-convergence.css','first-paint-shell.css','v88.css'];",'8.8 stylesheet owner');
 write('build-hardened.mjs',src);
}

/* Public release advances; 8.7.11 remains only an internal stable implementation baseline. */
{
 let src=read('postbuild-features-hardened.mjs');
 src=textOnce(src,"const TARGET_VERSION='8.7.12';",`const TARGET_VERSION='${PUBLIC}';`,'8.8 feature target');
 src=src.replace('fallback:BASE_VERSION,versionOwner:\'monotonic\'','fallback:BASE_VERSION,versionOwner:\'public-presentation-independent\'');
 write('postbuild-features-hardened.mjs',src);
}

/* Recording copy is intentionally terse; no instructional filler in the primary set header. */
{
 let src=read('v61.js');
 src=textOnce(src,"<div><b>每组</b><span>${prevEvent?'沿用上次 · 有变化再改':'记得多少就记多少'}</span></div>","<div><b>每组</b>${prevEvent?'<span>沿用上次 · 有变化再改</span>':''}</div>",'remove first-record filler copy');
 write('v61.js',src);
}

/* app.js owns persistence/opening. Settings list routes into exactly the same canonical editor. */
{
 let src=read('app.js');
 const old="D.addEventListener('click',e=>{if(e.target.closest('#newCustomEq')){e.preventDefault();closeSheet('settingsSheet');openCustomEditor()}},true);";
 const next="D.addEventListener('click',e=>{const add=e.target.closest('#newCustomEq'),edit=e.target.closest('[data-edit-eq]');if(!add&&!edit)return;e.preventDefault();closeSheet('settingsSheet');openCustomEditor(edit?.dataset.editEq||null)},true);";
 src=textOnce(src,old,next,'canonical Settings custom editor routing');
 src=regexOnce(src,/function renderManageEq\(\)\{[\s\S]*?\}\nfunction overlayLines/,
 `function renderManageEq(){const a=state.profile.customEq||[];$('#manageEqList').innerHTML=a.length?a.map(e=>\`<button class="manageEq" data-edit-eq="\${e.id}"><span><b>\${esc(e.name)}</b><span>\${esc((e.muscles||[]).slice(0,3).join(' · '))}</span></span><i>›</i></button>\`).join(''):'<div class="empty">暂无自定义器械</div>'}\nfunction overlayLines`,'retire per-row custom editor handlers');
 syntax(src,'app.js');write('app.js',src);
}

/* v873 keeps fuzzy search, but no longer owns custom-editor inference, mode labels, or hidden fields. */
{
 let src=read('v873-smart-input.js');
 src=textOnce(src,"let typeLocked=false,muscleLocked=false,pendingSmart=null,repeatTimer=0,repeatStarted=0,repeatKind='',repeatDir=0,suppressClickUntil=0;","let pendingSmart=null,repeatTimer=0,repeatStarted=0,repeatKind='',repeatDir=0,suppressClickUntil=0;",'retire v873 custom state');
 src=regexOnce(src,/function ensureCustomMeta\(\)\{[\s\S]*?\nfunction openSmartItem/,'function openSmartItem','retire v873 custom editor owner');
 src=textOnce(src,"function openAsCustom(item){pendingSmart=item;$('#addCustomEq')?.click();setTimeout(()=>beginNewSmart(item),0)}","function openAsCustom(item){pendingSmart=item;$('#addCustomEq')?.click();setTimeout(()=>{const input=$('#customName');if(input){input.value=item.name;input.dispatchEvent(new Event('input',{bubbles:true}))}},20)}",'smart result hands off to canonical editor');
 src=textOnce(src,"function hook(){injectStyle();injectSmartSearch();ensureCustomMeta();patchSetEditor();$('#eqSearch')?.addEventListener('input',()=>setTimeout(renderSmartSearch,0));$('#customName')?.addEventListener('input',()=>applyInference(false));D.addEventListener('click',e=>{","function hook(){injectStyle();injectSmartSearch();patchSetEditor();$('#eqSearch')?.addEventListener('input',()=>setTimeout(renderSmartSearch,0));D.addEventListener('click',e=>{",'retire v873 custom listeners');
 src=regexOnce(src,/if\(e\.target\.closest\('#addCustomEq,#newCustomEq'\)\)\{[\s\S]*?if\(e\.target\.closest\('#customMuscles \[data-muscle\]'\)&&e\.isTrusted\)\{[\s\S]*?return\}/,'','retire v873 custom click ownership');
 src=textOnce(src,"const obs=new MutationObserver(()=>{injectSmartSearch();ensureCustomMeta();patchSetEditor()});","const obs=new MutationObserver(()=>{injectSmartSearch();patchSetEditor()});",'retire v873 custom observer work');
 src=textOnce(src,"window.addEventListener('pageshow',()=>setTimeout(()=>{injectSmartSearch();ensureCustomMeta();patchSetEditor()},80));","window.addEventListener('pageshow',()=>setTimeout(()=>{injectSmartSearch();patchSetEditor()},80));",'retire v873 pageshow custom work');
 if(/ensureCustomMeta|applyInference|beginNewSmart|typeLocked|muscleLocked/.test(src))fail('v873 custom owner survived retirement');
 syntax(src,'v873-smart-input.js');write('v873-smart-input.js',src);
}

/* v874 is the single visible custom-editor owner. It infers first, then lets the user add/override details. */
{
 let src=read('v874-professional.js');
 src=textOnce(src,"function selectSubtype(id,manual=true){if(!SUBTYPES.some(x=>x.id===id))return;selectedSubtype=id;if(manual)typeLocked=true;syncHiddenType();renderTypeGrid()}","function selectSubtype(id,manual=true){if(!SUBTYPES.some(x=>x.id===id))return;selectedSubtype=id;if(manual)typeLocked=true;syncHiddenType();if((id==='cardio'||id==='mobility')&&!detailSelected.size)setDetails(['心肺'],false);renderTypeGrid()}",'canonical subtype association');
 src=textOnce(src,"function renderDetails(){const host=$('#v874Details'),r=REGIONS.find(x=>x.id===activeRegion)||REGIONS[0];if(!host)return;host.innerHTML=r.items.map(x=>`<button data-v874-detail=\"${esc(x)}\" class=\"${detailSelected.has(x)?'active':''}\">${esc(x)}</button>`).join('');renderRegionTabs();const sum=$('#v874MuscleSummary'),mode=$('#v874MuscleMode');if(sum)sum.textContent=detailSelected.size?[...detailSelected].slice(0,4).join(' · ')+(detailSelected.size>4?` +${detailSelected.size-4}`:''):'请选择';if(mode)mode.textContent=detailLocked?'手动':'自动'}","function renderDetails(){const host=$('#v874Details'),r=REGIONS.find(x=>x.id===activeRegion)||REGIONS[0];if(!host)return;host.innerHTML=r.items.map(x=>`<button data-v874-detail=\"${esc(x)}\" class=\"${detailSelected.has(x)?'active':''}\">${esc(x)}</button>`).join('');renderRegionTabs();const sum=$('#v874MuscleSummary');if(sum)sum.textContent=detailSelected.size?[...detailSelected].slice(0,4).join(' · ')+(detailSelected.size>4?` +${detailSelected.size-4}`:''):''}",'remove custom-editor mode prose');
 src=regexOnce(src,/function ensureProfessionalSelector\(\)\{[\s\S]*?\}\nfunction loadEditorState/,
 `function ensureProfessionalSelector(){const name=$('#customName');if(!name)return;let box=$('#v874Class');if(!box){box=D.createElement('div');box.id='v874Class';box.className='v874ClassBlock';box.innerHTML='<div class="v874ClassHead"><span>训练类型</span></div><div class="v874TypeGrid" id="v874TypeGrid"></div><div class="v874ClassHead second"><span>主要锻炼</span></div><div class="v874Summary" id="v874MuscleSummary"></div><div class="v874Regions" id="v874Regions"></div><div class="v874Details" id="v874Details"></div>';const anchor=$('#customType')?.previousElementSibling||$('#customType');anchor?.parentNode?.insertBefore(box,anchor)}const tl=$('#customType')?.previousElementSibling,ml=$('#customMuscles')?.previousElementSibling;if(tl?.classList.contains('sectionLabel'))tl.classList.add('v88HiddenLegacyLabel');if(ml?.classList.contains('sectionLabel'))ml.classList.add('v88HiddenLegacyLabel');renderTypeGrid();renderRegionTabs();renderDetails()}\nfunction loadEditorState`,'canonical custom editor structure');
 src=textOnce(src,"if(reg){activeRegion=reg.dataset.v874Region;renderDetails();return}","if(reg){activeRegion=reg.dataset.v874Region;const r=REGIONS.find(x=>x.id===activeRegion);if(r&&!r.items.some(x=>detailSelected.has(x))&&r.items[0]){detailSelected.add(r.items[0]);detailLocked=true;syncHiddenMuscles()}renderDetails();return}",'region tap expresses selection intent');
 src=textOnce(src,"function hook(){injectStyle();ensureProfessionalSelector();installEventObserver();tidyMusclePanel();patchSetPlan();","function hook(){const editorApi=window.__AXIS_CUSTOM_EDITOR__||(window.__AXIS_CUSTOM_EDITOR__={});editorApi.owner='v874';editorApi.snapshot=()=>({subtype:selectedSubtype,details:[...detailSelected],typeLocked,detailLocked});injectStyle();ensureProfessionalSelector();installEventObserver();tidyMusclePanel();patchSetPlan();",'expose canonical custom editor owner');
 src=textOnce(src,"$('#customName')?.addEventListener('input',()=>setTimeout(autoInferFromName,25));","D.addEventListener('input',e=>{if(e.target.id==='customName')autoInferFromName()},true);",'delegated custom-name inference owner');
 syntax(src,'v874-professional.js');write('v874-professional.js',src);
}

/* v876 keeps sound/location/timeline capability but loses its duplicate custom-editor implementation. */
{
 let src=read('v876-runtime.js');
 src=textOnce(src,"let audioCtx=null,audioPrimed=false,loopTimer=0,lastRestKey='',lastItemKey='',lastSessionKey='',timelineTimer=0,customFromRecord=false,customBefore=new Set(),customDraft={subtype:null,details:new Set(),typeManual:false,detailManual:false},lastLocationPromise=null;","let audioCtx=null,audioPrimed=false,loopTimer=0,lastRestKey='',lastItemKey='',lastSessionKey='',timelineTimer=0,lastLocationPromise=null;",'retire v876 custom state');
 src=regexOnce(src,/const DETAIL_CORE=\{[\s\S]*?\nfunction locationPrefs/,'function locationPrefs','retire v876 custom editor owner');
 src=regexOnce(src,/if\(e\.target\.closest\('#addCustomEq,#v8New'\)\)\{[\s\S]*?if\(e\.target\.closest\('#saveCustomEq'\)\)\{[\s\S]*?\}if\(e\.target\.closest\('#v87Primary/,"if(e.target.closest('#v87Primary",'retire v876 custom event ownership');
 src=src.replace("if(e.target.id==='customName')setTimeout(autoCustomFromName,25)",'');
 src=src.replace('renderWatermark();initCustomDraft();renderTimeline()','renderWatermark();renderTimeline()');
 if(/customDraft|initCustomDraft|autoCustomFromName|syncHiddenCustom|afterCustomSave|customFromRecord/.test(src))fail('v876 custom owner survived retirement');
 src=regexOnce(src,/function coord\(g\)\{[^\n]*\}\nfunction coordLong\(g\)\{[^\n]*\}/,"function compactPlace(name){const xs=String(name||'').split('·').map(x=>x.trim()).filter(Boolean);return xs.slice(-2).join(' · ')}\nfunction coord(){return''}\nfunction coordLong(){return''}",'private coordinates');
 src=src.replace('<div class="v876Coord" id="v876Coord">尚未获取坐标</div>','');
 src=src.replace('<small id="v876WmCoord"></small>','');
 src=regexOnce(src,/function renderWatermark\(\)\{[\s\S]*?\}\nfunction saveOpacity/,
 `function renderWatermark(){const p=wmPrefs(),info=wmInfo(),poster=$('#v876WmPoster'),rail=$('#v876WmRail');if(!poster||!rail)return;$('.v876WmGhost',poster)?.style.setProperty('--axis-alpha',String(p.opacity/100));rail.dataset.pos=p.pos;$('#v876WmName').style.display=p.name?'block':'none';$('#v876WmName').textContent=info.name;$('#v876WmData').style.display=p.data&&info.data?'block':'none';$('#v876WmData').textContent=info.data;const place=compactPlace(p.name);$('#v876WmPlace').style.display=p.location&&!!place?'block':'none';$('#v876WmPlace').textContent=place;$('#v876WmCoord')?.style.setProperty('display','none');if($('#v876WmCoord'))$('#v876WmCoord').textContent='';const rng=$('#v876OpacityRange');if(rng)rng.value=String(p.opacity);if($('#v876OpacityValue'))$('#v876OpacityValue').textContent=\`\${p.opacity}%\`;if($('#v876LocationName'))$('#v876LocationName').textContent=place||'未获取';$('#v876Coord')?.style.setProperty('display','none')}\nfunction saveOpacity`,'concise Chinese location presentation');
 src=src.replace("toast(name?'位置已更新':'坐标已更新，可手动填写地名')","toast(name?'位置已更新':'位置已获取，可手动填写名称')");
 src=src.replace("if(p.location&&p.geo)c.fillText(coord(p.geo),x,yy);",'');
 syntax(src,'v876-runtime.js');write('v876-runtime.js',src);
}

/* v877 owns the later watermark preview/restamp; location remains place-only there too. */
{
 let src=read('v877-runtime.js');
 src=textOnce(src,"const g=p.geo,coord=g?`${Number(g.lat).toFixed(5)}, ${Number(g.lon).toFixed(5)}`:'';$('#v877WmPlace').textContent=[p.place,coord].filter(Boolean).join(' · ');","const place=String(p.place||'').split('·').map(x=>x.trim()).filter(Boolean).slice(-2).join(' · ');$('#v877WmPlace').textContent=place;",'v877 preview location privacy');
 src=textOnce(src,"if(p.location&&(p.place||p.geo)){c.fillStyle='rgba(242,244,248,.88)';c.fillText(p.place||'',x,y);y+=top?sm*1.25:-sm*1.25;if(p.geo)c.fillText(`${Number(p.geo.lat).toFixed(5)}, ${Number(p.geo.lon).toFixed(5)}`,x,y);y+=top?sm*1.25:-sm*1.25}","if(p.location&&p.place){const place=String(p.place||'').split('·').map(v=>v.trim()).filter(Boolean).slice(-2).join(' · ');c.fillStyle='rgba(242,244,248,.88)';c.fillText(place,x,y);y+=top?sm*1.25:-sm*1.25}",'v877 stamped-media location privacy');
 if(/toFixed\(5\).*p\.geo|p\.geo\.lat.*toFixed\(5\)|p\.geo\.lon.*toFixed\(5\)/.test(src))fail('v877 raw coordinate painter survived');
 syntax(src,'v877-runtime.js');write('v877-runtime.js',src);
}

/* The current watermark resolver may keep precise geodata internally, never in visible output. */
{
 let src=read('v8710-watermark.js');
 src=src.replace("const p=pref(),line=[p.place,coord(p.geo)].filter(Boolean).join('  ·  ');","const p=pref(),line=String(p.place||'').split('·').map(x=>x.trim()).filter(Boolean).slice(-2).join(' · ');");
 src=src.replace("loc=[p.place,p.location?coord(p.geo):'',time].filter(Boolean).join(' · ')","loc=[p.place,time].filter(Boolean).join(' · ')");
 syntax(src,'v8710-watermark.js');write('v8710-watermark.js',src);
}

/* v8712 keeps catalog/group-plan enhancement only; all custom-editor ownership is retired. */
{
 let src=read('v8712-runtime.js');
 src=textOnce(src,'let detailPress=new WeakMap(),customBefore=new Set(),plan=null;','let plan=null;','retire v8712 custom state');
 src=regexOnce(src,/const DETAIL_CORE=\{[\s\S]*?\nfunction rows\(\)/,'function rows()','retire v8712 custom editor owner');
 src=src.replace(" D.addEventListener('pointerdown',e=>{const b=e.target.closest('#v874Details [data-v874-detail]');if(b)detailPress.set(b,b.classList.contains('active'))},true);\n",'');
 src=src.replace("  if(e.target.closest('#addCustomEq,#newCustomEq,#v8New')){rememberCustomStart();setTimeout(()=>{style();$('#v874Details')?.style.setProperty('pointer-events','auto','important')},80);return}\n",'');
 src=src.replace("  const det=e.target.closest('#v874Details [data-v874-detail]');if(det){const before=detailPress.get(det);if(typeof before==='boolean')det.classList.toggle('active',!before);syncHiddenFromDetails();return}\n",'');
 src=src.replace("  if(e.target.closest('#saveCustomEq')){syncHiddenFromDetails();patchCustomAfterSave();return}\n",'');
 if(/detailPress|customBefore|syncHiddenFromDetails|patchCustomAfterSave|rememberCustomStart/.test(src))fail('v8712 custom owner survived retirement');
 syntax(src,'v8712-runtime.js');write('v8712-runtime.js',src);
}

/* Existing browser contracts are evaluated against the 8.8 public product, not historical runtime filenames. */
for(const f of ['scripts/axis-completion-smoke.mjs','scripts/axis-settings-diag.mjs']){
 if(!fs.existsSync(f))continue;let src=read(f);src=src.replaceAll('版本 8.7.12',`版本 ${PUBLIC}`).replaceAll("'8.7.12'",`'${PUBLIC}'`);write(f,src);
}

const contract={
 release:PUBLIC,
 generatedAt:new Date().toISOString(),
 owners:{
  publicVersion:'first-paint presentation / data-axis-public-label',
  customPersistence:'app.js',customEditor:'v874-professional.js',customSearch:'v873-smart-input.js search only',
  recording:'v61.js',activeAdjustment:'postbuild canonical v87AdjustBtn',watermarkLocation:'resolver precision internal / Chinese place presentation'
 },
 retired:['v873 custom editor inference writer','v876 custom editor writer','v8712 custom editor writer','v877 raw coordinate painter','raw coordinate presentation','first-record instructional hint'],
 invariant:'one user-facing action has one interactive owner'
};
write('axis-88-contract.json',JSON.stringify(contract,null,2));
console.log('[AXIS 8.8] convergence passed · custom editor single-owner · coordinates private · terse recording copy · public 8.8');
