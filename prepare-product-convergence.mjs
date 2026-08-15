import fs from 'node:fs';

const fail=m=>{throw new Error(`AXIS product convergence: ${m}`)};
const read=f=>fs.readFileSync(f,'utf8');
const write=(f,s)=>fs.writeFileSync(f,s);
const textOnce=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',m=src.match(new RegExp(re.source,flags))||[];if(m.length!==1)fail(`${label} expected once, found ${m.length}`);return src.replace(re,to)};

for(const f of ['build-hardened.mjs','runtime-hardening.css','product-convergence.css','v61.js','v8711-runtime.js','v8710-watermark.js','v876-runtime.js','v8712-runtime.js'])if(!fs.existsSync(f))fail(`missing ${f}`);

/* First paint owns geometry. */
{
 let src=read('build-hardened.mjs');
 src=textOnce(src,"const cssFiles=['styles.css','v61.css'];","const cssFiles=['styles.css','v61.css','runtime-hardening.css','product-convergence.css'];",'static convergence stylesheet list');
 write('build-hardened.mjs',src);
}

/* The old detail-navigation rule must not close Settings now that configuration is inline. */
{
 let src=read('v61.js');
 src=textOnce(src,"if(['profileBtn','myEqBtn','watermarkBtn','storageBtn','reportBtn'].includes(b.id))$('#settingsSheet')?.classList.remove('show');",'', 'retire legacy settings close');
 write('v61.js',src);
}

/* Existing domain sheets are portalled into one exclusive Settings accordion; no form is cloned. */
{
 let src=read('v8711-runtime.js');
 const helper=`const INLINE_SETTINGS=[['profile','profileBtn','profileSheet'],['equipment','myEqBtn','myEqSheet'],['watermark','watermarkBtn','watermarkSheet'],['storage','storageBtn','storageSheet']];
function configGate(k){if(k==='record')return $('#v8711RecordGate');if(k==='audio')return $('#v8711AudioGate');if(String(k).startsWith('config-'))return $('#axisConfigGate-'+String(k).slice(7));return null}
function setGate(g,on){if(!g)return;g.classList.toggle('open',!!on);g.querySelector(':scope>.settingLink')?.setAttribute('aria-expanded',on?'true':'false')}
function closeOtherGates(except=null){for(const g of Array.from(document.querySelectorAll('#settingsSheet .v8711SettingGate.open')))if(g!==except)setGate(g,false)}
function ensureInlineSettings(){
 const root=$('#settingsSheet .settingsList');if(!root)return;
 for(const [key,buttonId,sheetId] of INLINE_SETTINGS){
  const btn=$('#'+buttonId),wrap=$('#'+sheetId);if(!btn||!wrap)continue;
  let gate=$('#axisConfigGate-'+key);
  if(!gate){
   gate=D.createElement('div');gate.id='axisConfigGate-'+key;gate.className='v8711SettingGate axisConfigGate';gate.dataset.axisConfig=key;
   const fold=D.createElement('div');fold.className='v8711Fold';fold.dataset.axisInlineBody=key;
   btn.before(gate);gate.appendChild(btn);gate.appendChild(fold);fold.appendChild(wrap);
   btn.dataset.v8711Fold='config-'+key;btn.setAttribute('aria-expanded','false');
   wrap.classList.add('axisInlineSheetWrap');wrap.classList.remove('show','axisHasBack','v879Front','v879Under');wrap.querySelectorAll('.axisBack').forEach(n=>n.remove());
   btn.addEventListener('click',()=>queueMicrotask(()=>{wrap.classList.remove('show','axisHasBack','v879Front','v879Under');wrap.querySelectorAll('.axisBack').forEach(n=>n.remove())}),false);
   if(key==='profile')$('#saveProfile')?.addEventListener('click',()=>setTimeout(()=>setGate(gate,false),0),false);
  }
 }
}`;
 src=textOnce(src,'function ensureSettings(){',helper+'\nfunction ensureSettings(){','inline settings helper');
 src=textOnce(src,"const rb=$('#reportBtn');if(rb){rb.classList.add('v8711ReportEntry');rb.textContent='训练报告'}\nsyncWakeLabel()\n}","const rb=$('#reportBtn');if(rb){rb.classList.add('v8711ReportEntry');rb.textContent='训练报告'}\nensureInlineSettings();syncWakeLabel()\n}",'inline settings install');
 src=regexOnce(src,/function toggleFold\(k\)\{[\s\S]*?\}\nfunction ensureCorners\(\)\{/,
`function toggleFold(k){const g=configGate(k);if(!g)return;const open=!g.classList.contains('open');closeOtherGates(g);setGate(g,open)}
function ensureCorners(){`,'exclusive settings accordion');
 write('v8711-runtime.js',src);
}

/* Watermark is Chinese-first and precise-place-first; old language UI is retired. */
{
 let src=read('v8710-watermark.js');
 src=regexOnce(src,/function selectedLang\(\)\{[^\n]*\}/,"function selectedLang(){return'zh'}",'Chinese-only watermark language');
 src=textOnce(src,"pos:p.v85WmPos||'br'}}","pos:p.v85WmPos||'br',source:p.v8712PlaceResolve?.source||''}}",'watermark place source');
 src=regexOnce(src,/if\(!\$\('#v8710WmControls'\)\)base\.insertAdjacentHTML\('beforeend',[\s\S]*?\);if\(!\$\('#v8710WmPreview'\)\)/,"$('#v8710WmControls')?.remove();if(!$('#v8710WmPreview'))",'remove watermark language controls');
 const precise=`function distanceMeters(a,b){if(!a||!b)return Infinity;const R=6371000,p=Math.PI/180,dLat=(Number(b.lat)-Number(a.lat))*p,dLon=(Number(b.lon)-Number(a.lon))*p,la1=Number(a.lat)*p,la2=Number(b.lat)*p,x=Math.sin(dLat/2)**2+Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.min(1,Math.sqrt(x)))}
function osmSpecific(j){const a=j?.address||{},nd=j?.namedetails||{},zh=nd['name:zh-Hans']||nd['name:zh']||nd['name:zh_CN']||'',raw=String(j?.name||'').trim(),poi=String(zh||(/[\\u3400-\\u9fff]/.test(raw)?raw:'')||a.amenity||a.shop||a.tourism||a.leisure||a.office||a.building||a.house_name||'').trim(),road=String(a.road||a.pedestrian||a.residential||a.footway||a.path||'').trim(),house=String(a.house_number||'').trim(),near=String(a.neighbourhood||a.quarter||a.suburb||a.village||a.city_district||'').trim(),district=String(a.district||a.county||'').trim(),city=String(a.city||a.town||a.municipality||'').trim(),out=[];const add=x=>{x=String(x||'').trim();if(x&&!out.some(y=>norm(y)===norm(x)))out.push(x)};add(poi);add(road?(house?road+house:road):'');add(near);add(district);add(city);return out.slice(0,3).join(' · ')}
async function reverseOsm(g){const last=Number(window.__AXIS_OSM_LAST__||0),delay=Math.max(0,1100-(Date.now()-last));if(delay)await new Promise(r=>setTimeout(r,delay));window.__AXIS_OSM_LAST__=Date.now();const u='https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+encodeURIComponent(g.lat)+'&lon='+encodeURIComponent(g.lon)+'&zoom=18&addressdetails=1&namedetails=1&layer=address,poi&accept-language=zh-CN,zh';const r=await fetch(u,{cache:'no-store',referrerPolicy:'origin'});if(!r.ok)throw new Error('osm-'+r.status);return osmSpecific(await r.json())}
async function reverseBdc(g){const r=await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+encodeURIComponent(g.lat)+'&longitude='+encodeURIComponent(g.lon)+'&localityLanguage=zh',{cache:'no-store'});if(!r.ok)throw new Error('bdc-'+r.status);return specific(await r.json())}
async function reverse(g,L=selectedLang()){if(!g)return'';const id=++placeReq,m0=meta(),cached=m0.prefs.v8712PlaceResolve;if(cached?.name&&Date.now()-Number(cached.ts||0)<21600000&&distanceMeters(g,cached)<=80)return cached.name;let n='',source='';try{n=await reverseOsm(g);if(n)source='osm'}catch{}if(!n)try{n=await reverseBdc(g);if(n)source='bdc'}catch{}if(id!==placeReq)return pref().place;const m=meta(),cache=m.prefs.v8711PlaceCache&&typeof m.prefs.v8711PlaceCache==='object'?m.prefs.v8711PlaceCache:{};if(n){cache.zh=n;m.prefs.v8711PlaceCache=cache;m.prefs.v8710PlaceName=n;m.prefs.v876LocationNameAuto=n;m.prefs.v8712PlaceResolve={name:n,lat:Number(g.lat),lon:Number(g.lon),ts:Date.now(),source}}write(META,m);return n||pref().place}`;
 src=regexOnce(src,/async function reverse\(g,L=selectedLang\(\)\)\{[\s\S]*?\}\nfunction freshGeo\(\)\{/,precise+'\nfunction freshGeo(){','precise place resolver');
 src=regexOnce(src,/function render\(\)\{sync\(\);[\s\S]*?\}\nfunction dbGet\(k\)\{/,
`function render(){sync();const p=pref(),line=[p.place,coord(p.geo)].filter(Boolean).join('  ·  ');if($('#v8710LocationMeta'))$('#v8710LocationMeta').textContent=line||'尚未获取位置';if($('#v8710WmName'))$('#v8710WmName').textContent=currentName();if($('#v8710WmLoc'))$('#v8710WmLoc').textContent=line;if($('#v876LocationName'))$('#v876LocationName').textContent=p.place||'未获取';const host=$('#v876Location');if(host){let c=$('#v8712PlaceCredit',host);if(!c){c=D.createElement('small');c.id='v8712PlaceCredit';c.className='v8712PlaceCredit';host.appendChild(c)}c.textContent=p.source==='osm'&&!p.manual?'地名 © OpenStreetMap contributors':''}}
function dbGet(k){`,'watermark location rendering');
 src=regexOnce(src,/const b=e\.target\.closest\('#v8710WmLang \[data-v\]'\);if\(b\)\{[\s\S]*?return\}/,'','retire watermark language handler');
 write('v8710-watermark.js',src);
}

/* The previous coarse resolver is fallback-only once a precise name exists. */
{
 let src=read('v876-runtime.js');
 src=textOnce(src,'if(name)mm.prefs.v876LocationNameAuto=name;','if(name&&!mm.prefs.v8712PlaceResolve?.name)mm.prefs.v876LocationNameAuto=name;','legacy location fallback guard');
 write('v876-runtime.js',src);
}

/* Group plan reads the canonical rows, exposes editable step, and commits through v61. */
{
 let src=read('v8712-runtime.js');
 const stalePlanRefs=(src.match(/#v874PlanSheet/g)||[]).length;if(stalePlanRefs!==4)fail(`group-plan sheet contract expected 4 legacy refs, found ${stalePlanRefs}`);src=src.replaceAll('#v874PlanSheet','#v875PlanSheet');if(src.includes('#v874PlanSheet'))fail('legacy group-plan sheet reference survived convergence');
 src=textOnce(src,"function rows(){return $$('#v8SetEditor .v8SetRow')}","function rows(){return $$('#v8Sets .v8SetRow')}",'canonical plan rows');
 src=regexOnce(src,/function smartWeightStep\(w\)\{[^\n]*\}/,"function smartWeightStep(w){if(w<10)return.5;if(w<30)return 2.5;if(w<220)return 5;return 10}",'group plan default step');
 src=regexOnce(src,/function stepOptions\(base\)\{[\s\S]*?\}\nfunction repStepDefault/,
`function stepOptions(base){const s=smartWeightStep(base);if(s<=.5)return[.5,1,2.5];if(s<=2.5)return[1,2.5,5];if(s<=5)return[2.5,5,10];return[5,10,20]}
function repStepDefault`,'group plan smart options');
 src=regexOnce(src,/function paramHtml\(\)\{[\s\S]*?\}\nfunction renderPlan\(\)\{/,
`function paramHtml(){
 if(!plan||plan.mode==='same')return'';
 const w=stepOptions(plan.baseW);
 let h=\`<div class="v8712Param"><div class="v8712ParamHead"><span>重量步进</span><b>每组 \${plan.mode==='down'?'−':'+'}\${plan.wStep} kg</b></div><div class="v8712StepEditor"><button data-v8712-step-adjust="w" data-dir="-1" aria-label="减小重量步进">−</button><label><input data-v8712-step-input="w" inputmode="decimal" value="\${plan.wStep}" aria-label="重量步进"><small>kg</small></label><button data-v8712-step-adjust="w" data-dir="1" aria-label="增大重量步进">＋</button></div><div class="v8712Chips">\${w.map(x=>\`<button data-v8712-wstep="\${x}" class="\${x===plan.wStep?'active':''}">\${x} kg</button>\`).join('')}</div></div>\`;
 if(plan.mode==='uprep'||plan.mode==='pyramid')h+=\`<div class="v8712Param"><div class="v8712ParamHead"><span>次数变化</span><b>每组 −\${plan.rStep}</b></div><div class="v8712StepEditor"><button data-v8712-step-adjust="r" data-dir="-1" aria-label="减小次数变化">−</button><label><input data-v8712-step-input="r" inputmode="numeric" value="\${plan.rStep}" aria-label="次数变化"><small>次</small></label><button data-v8712-step-adjust="r" data-dir="1" aria-label="增大次数变化">＋</button></div><div class="v8712Chips">\${[1,2,3,4].map(x=>\`<button data-v8712-rstep="\${x}" class="\${x===plan.rStep?'active':''}">−\${x} 次</button>\`).join('')}</div></div>\`;
 return h;
}
function renderPlan(){`,'editable plan parameters');
 src=regexOnce(src,/async function setCount\(n\)\{[\s\S]*?\}\nasync function setRow\(i,w,r\)\{[\s\S]*?\}\nasync function applyPlan\(\)\{/,
`async function setCount(n){n=clamp(n,1,10);for(let guard=0;guard<20;guard++){const cur=rows().length;if(cur===n)return;const b=$('#v8Sets [data-cnt="'+(cur<n?1:-1)+'"]');if(!b)return;b.click();await wait(22)}}
async function setRow(i,w,r){const api=window.__AXIS_RECORDING__;if(!api?.select||!api?.set)return;api.select(i);await wait(5);api.set('weight',w);await wait(5);api.set('reps',r);await wait(5)}
async function applyPlan(){`,'canonical plan application');
 src=textOnce(src,"if(e.target.closest('[data-v874-plan]')){setTimeout(upgradePlan,0);return}","if(e.target.closest('[data-v875-plan],[data-v874-plan]')){setTimeout(upgradePlan,0);return}",'canonical plan entry trigger');
 const bindNeedle="const rs=e.target.closest('[data-v8712-rstep]');if(rs&&plan){plan.rStep=Number(rs.dataset.v8712Rstep)||plan.rStep;renderPlan();return}\n  if(e.target.closest('#v8712Apply')){applyPlan();return}";
 const bindReplace="const rs=e.target.closest('[data-v8712-rstep]');if(rs&&plan){plan.rStep=Number(rs.dataset.v8712Rstep)||plan.rStep;renderPlan();return}\n  const sa=e.target.closest('[data-v8712-step-adjust]');if(sa&&plan){const d=Number(sa.dataset.dir)||0;if(sa.dataset.v8712StepAdjust==='w')plan.wStep=Math.max(.5,Math.round((plan.wStep+d*.5)*2)/2);else plan.rStep=clamp(Math.round(plan.rStep+d),1,20);renderPlan();return}\n  if(e.target.closest('#v8712Apply')){applyPlan();return}";
 src=textOnce(src,bindNeedle,bindReplace,'group plan step buttons');
 const inputNeedle="D.addEventListener('input',e=>{if(e.target.id==='eqSearch'&&!e.target.value.trim())setTimeout(polishCategory,0)},false);";
 const inputReplace="D.addEventListener('input',e=>{if(e.target.id==='eqSearch'&&!e.target.value.trim())setTimeout(polishCategory,0)},false);\n D.addEventListener('change',e=>{const i=e.target.closest('[data-v8712-step-input]');if(!i||!plan)return;const v=Number(i.value);if(!Number.isFinite(v))return renderPlan();if(i.dataset.v8712StepInput==='w')plan.wStep=Math.max(.5,Math.min(100,Math.round(v*2)/2));else plan.rStep=clamp(Math.round(v),1,20);renderPlan()},false);";
 src=textOnce(src,inputNeedle,inputReplace,'group plan direct step input');
 write('v8712-runtime.js',src);
}

for(const f of ['v61.js','v8711-runtime.js','v8710-watermark.js','v876-runtime.js','v8712-runtime.js']){
 try{new Function(read(f))}catch(e){fail(`${f} syntax ${e.message}`)}
}
console.log('[AXIS] product convergence prepared · inline settings · Chinese precise place · editable group-plan step · static geometry · canonical plan sheet');