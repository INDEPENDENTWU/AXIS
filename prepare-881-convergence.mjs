import fs from 'node:fs';

const fail=m=>{throw new Error(`AXIS 8.8.1 convergence: ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/* Group-plan parameters: unitless centered numeric controls and richer deliberate presets. */
{
  const FILE='v8712-runtime.js';let src=read(FILE);
  src=regexOnce(src,/function stepOptions\(base\)\{[\s\S]*?\}\nfunction repStepDefault/,
`function stepOptions(){return[.5,1,1.25,2,2.5,5,7.5,10]}
function repStepDefault`,'8.8.1 weight quick options');
  src=regexOnce(src,/function paramHtml\(\)\{[\s\S]*?\}\nfunction renderPlan\(\)\{/,
`function paramHtml(){
 if(!plan||plan.mode==='same')return'';
 const w=stepOptions();
 let h=\`<div class="v8712Param"><div class="v8712ParamHead"><span>重量步进</span><b>每组 \${plan.mode==='down'?'−':'+'}\${plan.wStep} kg</b></div><div class="v8712StepEditor v881StepEditor"><button data-v8712-step-adjust="w" data-dir="-1" aria-label="减小重量步进">−</button><label><input data-v8712-step-input="w" inputmode="decimal" value="\${plan.wStep}" aria-label="重量步进"></label><button data-v8712-step-adjust="w" data-dir="1" aria-label="增大重量步进">＋</button></div><div class="v8712Chips v881WeightChips">\${w.map(x=>\`<button data-v8712-wstep="\${x}" class="\${x===plan.wStep?'active':''}">\${x}</button>\`).join('')}</div></div>\`;
 if(plan.mode==='uprep'||plan.mode==='pyramid')h+=\`<div class="v8712Param"><div class="v8712ParamHead"><span>次数变化</span><b>每组 −\${plan.rStep}</b></div><div class="v8712StepEditor v881StepEditor"><button data-v8712-step-adjust="r" data-dir="-1" aria-label="减小次数变化">−</button><label><input data-v8712-step-input="r" inputmode="numeric" value="\${plan.rStep}" aria-label="次数变化"></label><button data-v8712-step-adjust="r" data-dir="1" aria-label="增大次数变化">＋</button></div><div class="v8712Chips v881RepChips">\${[1,2,3,4,5,6].map(x=>\`<button data-v8712-rstep="\${x}" class="\${x===plan.rStep?'active':''}">−\${x}</button>\`).join('')}</div></div>\`;
 return h;
}
function renderPlan(){`,'8.8.1 unitless group-plan parameters');
  if(/data-v8712-step-input="[wr]"[^>]*>[^<]*<small>(?:kg|次)<\/small>/.test(src))fail('group-plan main value still carries a visible unit');
  syntax(src,FILE);write(FILE,src);
}

/* Active item uses estimateMs as a real countdown. Existing v87 audio remains the only tone owner. */
{
  const FILE='v87-runtime.js';let src=read(FILE);
  src=once(src,
    "const {e,a}=target,m=readMeta(),actual=elapsed(a),est=Math.max(60000,Number(a.estimateMs)||actual||60000),pct=Math.min(100,actual/est*100),total=planned(e,m)",
    "const {e,a}=target,m=readMeta(),actual=elapsed(a),est=Math.max(60000,Number(a.estimateMs)||actual||60000),remaining=Math.max(0,est-actual),pct=Math.min(100,actual/est*100),total=planned(e,m)",
    'countdown remaining value');
  src=once(src,
    "$('#v87Meta').textContent=`${clock(actual)} · 预计约${Math.max(1,Math.round(est/60000))}分${e.kind==='strength'?` · ${tracked?`${done}/${total}组`:`${total}组`}`:''}`;",
    "$('#v87Meta').textContent=`剩余 ${clock(remaining)}${e.kind==='strength'?` · ${tracked?`${done}/${total}组`:`${total}组`}`:''}`;",
    'active item countdown presentation');
  src=once(src,
    "if(p.v86ItemReminder!==false&&a.estimateMs&&el>=a.estimateMs){const key=e.id+':'+a.startedAt;if(key!==lastItemKey){if(await unlockAudio())synth(p.v87Tone||'axis','item');lastItemKey=key}}",
    "const due=Math.max(60000,Number(a.estimateMs)||0);if(p.v86ItemReminder!==false&&due&&el>=due&&hold?.id!==e.id&&!a.itemReminderNotifiedAt){const key=e.id+':'+a.startedAt;if(key!==lastItemKey){renderNow(true);if(await unlockAudio()){synth(p.v87Tone||'axis','item');const mm=readMeta(),aa=mm.events?.[e.id]?.activity;if(aa){aa.itemReminderNotifiedAt=now();writeMeta(mm)}}lastItemKey=key}}",
    'countdown completion tone contract');
  if(!src.includes("剩余 ${clock(remaining)}"))fail('countdown presentation missing');
  if(!src.includes("const due=Math.max(60000,Number(a.estimateMs)||0)"))fail('countdown/tone estimate normalization missing');
  if(!src.includes("hold?.id!==e.id"))fail('long-press sound suppression missing');
  if(!src.includes("key!==lastItemKey){renderNow(true);if(await unlockAudio()"))fail('zero-frame synchronization missing');
  syntax(src,FILE);write(FILE,src);
}

/* Explicit location keeps the complete canonical precise place; CSS owns visual truncation, not the data. */
{
  const FILE='v876-runtime.js';let src=read(FILE);
  src=once(src,"function compactPlace(name){const xs=String(name||'').split('·').map(x=>x.trim()).filter(Boolean);return xs.slice(-2).join(' · ')}","function compactPlace(name){return String(name||'').split('·').map(x=>x.trim()).filter(Boolean).join(' · ')}",'complete precise-place presentation');
  src=once(src,'opacity:Math.max(4,Math.min(32,Number(p.v876WmOpacity)||15))','opacity:Math.max(4,Math.min(48,Number(p.v876WmOpacity)||15))','brand opacity read range');
  src=once(src,'m.prefs.v876WmOpacity=Math.max(4,Math.min(32,Number(v)||15))','m.prefs.v876WmOpacity=Math.max(4,Math.min(48,Number(v)||15))','brand opacity persistence range');
  src=once(src,'id="v876OpacityRange" type="range" min="4" max="32" step="1"','id="v876OpacityRange" type="range" min="4" max="48" step="1"','brand opacity slider range');
  if(/v876WmOpacity[^\n]{0,80}Math\.min\(32/.test(src)||src.includes('max="32" step="1" value="15"'))fail('legacy 32% brand-opacity ceiling survived');
  if(src.includes("slice(-2).join(' · ')"))fail('precise place is still data-truncated');
  syntax(src,FILE);write(FILE,src);
}

/* Final watermark: one centered AXIS wordmark in preview and saved media. Brand opacity controls only it. */
{
  const FILE='v8710-watermark.js';let src=read(FILE);
  src=once(src,
    '<div class="v8710WmPreview" id="v8710WmPreview"><div class="v8710WmRail"><b>AXIS / RECORD</b><span id="v8710WmName"></span><span id="v8710WmData"></span><span id="v8710WmLoc"></span><span id="v8710WmTime"></span></div></div>',
    '<div class="v8710WmPreview" id="v8710WmPreview"><div class="v881WmBrand" id="v881WmBrand" aria-hidden="true">AXIS</div><div class="v8710WmRail"><b>AXIS / RECORD</b><span id="v8710WmName"></span><span id="v8710WmData"></span><span id="v8710WmLoc"></span><span id="v8710WmTime"></span></div></div>',
    'center brand preview');
  src=once(src,
    "function render(){sync();const p=pref(),name=currentName(),data=previewData(),time=timeText();",
    "function render(){sync();const p=pref(),name=currentName(),data=previewData(),time=timeText(),brand=$('#v881WmBrand');if(brand)brand.style.opacity=String(Math.max(.04,Math.min(.48,p.opacity/100)));",
    'center brand opacity preview');
  src=once(src,"c.globalAlpha=Math.max(.10,p.opacity/100);","c.globalAlpha=Math.max(.04,Math.min(.48,p.opacity/100));",'brand opacity exact range');
  src=once(src,"c.fillText('A X I S',W/2,H*.48);","c.fillText('AXIS',W/2,H*.48);",'saved AXIS wordmark');
  if(src.includes("fillText('A X I S'"))fail('spaced legacy brand survived');
  syntax(src,FILE);write(FILE,src);
}

/* Static geometry owns the final 8.8.1 visual contract before runtime hydration. */
{
  const FILE='product-convergence.css';let css=read(FILE);
  if(css.includes('AXIS 8.8.1 group-plan + brand'))fail('8.8.1 static CSS duplicated');
  css+=`\n\n/* AXIS 8.8.1 group-plan + brand */\nbody #v875PlanSheet .v881StepEditor>label{display:grid!important;place-items:center!important;gap:0!important}\nbody #v875PlanSheet .v881StepEditor input{width:100%!important;max-width:180px!important;text-align:center!important;padding:0!important;margin:0!important;font-size:22px!important;font-weight:680!important;letter-spacing:-.018em!important}\nbody #v875PlanSheet .v881StepEditor small{display:none!important}\nbody #v875PlanSheet .v881WeightChips{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important;overflow:visible!important}\nbody #v875PlanSheet .v881RepChips{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important;overflow:visible!important}\nbody #v875PlanSheet :is(.v881WeightChips,.v881RepChips)>button{width:100%!important;min-width:0!important;padding:0!important;text-align:center!important}\n#watermarkPreview #v875WmPoster{display:none!important}\n#watermarkPreview #v881WmBrand{position:absolute!important;left:50%!important;top:48%!important;transform:translate(-50%,-50%)!important;z-index:1!important;display:block!important;color:#737cff!important;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',Arial,sans-serif!important;font-size:clamp(48px,15vw,76px)!important;font-weight:800!important;line-height:1!important;letter-spacing:.08em!important;white-space:nowrap!important;text-align:center!important;text-shadow:0 10px 30px rgba(0,0,0,.20)!important;pointer-events:none!important}\n#watermarkPreview .v8710WmRail{z-index:2!important}\n#watermarkSheet #v876LocationName{max-width:72%!important;white-space:normal!important;overflow-wrap:anywhere!important}\n@media(max-width:390px){#watermarkPreview #v881WmBrand{font-size:52px!important}}\n`;
  write(FILE,css);
}

console.log('[AXIS 8.8.1] convergence passed · unitless plan controls · active countdown · centered AXIS brand · precise place · 4–48% opacity · normalized estimate · zero-before-tone');
