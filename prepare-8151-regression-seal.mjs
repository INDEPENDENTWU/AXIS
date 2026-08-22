import fs from 'node:fs';

const APP='app.js',WM='v8710-watermark.js',SHELL='first-paint-shell.css',HTML='index.html';
const fail=m=>{throw new Error(`[AXIS 8.15.1 regression seal] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};

/* Cold-start semantic seal: the static 8.8.2 axisNowHero is geometry only.
   It must not paint its historical default copy before canonical local-state render commits. */
{
  let css=read(SHELL);
  const anchor=`html:not([data-axis-core-ready="1"]) #idleHome,\nhtml:not([data-axis-core-ready="1"]) #activeHome{\n  visibility:hidden!important;\n  pointer-events:none!important;\n}`;
  const sealed=anchor+`\n\n/* 8.15.1: the later axisNowHero also carries static historical semantics. */\nhtml:not([data-axis-home-ready="1"]) #axisNowHero{\n  visibility:hidden!important;\n  pointer-events:none!important;\n}`;
  css=once(css,anchor,sealed,'axisNowHero first-paint semantic gate');
  fs.writeFileSync(SHELL,css);
}
{
  /* External CSS is render-blocking in the normal path, but the semantic seal must
     also hold at document commit before any stylesheet can participate. Keep Hero
     geometry in-flow with inline visibility:hidden, then let the canonical Home
     render remove only that inline hold immediately before committing home-ready. */
  let html=read(HTML);
  const hero='<section class="axisNowHero" id="axisNowHero" data-mode="ready" aria-live="polite">';
  const sealed='<section class="axisNowHero" id="axisNowHero" data-mode="ready" aria-live="polite" style="visibility:hidden">';
  html=once(html,hero,sealed,'axisNowHero inline first-paint hold');
  fs.writeFileSync(HTML,html);
}
{
  let app=read(APP);
  app=once(app,'window.__AXIS_HOME_STATE__=x}',"window.__AXIS_HOME_STATE__=x;const __axisHomeHero=document.querySelector('#axisNowHero');if(__axisHomeHero)__axisHomeHero.style.removeProperty('visibility');document.documentElement.dataset.axisHomeReady='1'}",'canonical Home first commit');

  /* app.js used to rasterize a complete legacy photo watermark before the current
     v8710 owner stamped the same saved frame again. Photo finalization is now raw;
     v8710 remains the one and only photo watermark compositor. Video is untouched. */
  const legacy=/async function finalizeFrame\(frame,e,eq\)\{if\(\(state\.prefs\.watermark\.photoMode\|\|'wm'\)==='raw'\)return frame\.blob;[\s\S]*?return await new Promise\(r=>cv\.toBlob\(r,'image\/jpeg',\.88\)\)\}/;
  app=regexOnce(app,legacy,"async function finalizeFrame(frame,e,eq){return frame.blob}/* AXIS 8.15.1: current photo watermark compositor is v8710 only. */",'legacy photo finalizer retirement');
  try{new Function(app)}catch(e){fail(`app syntax ${e.message}`)}
  fs.writeFileSync(APP,app);
}

/* Retire the two final physical draw calls that create the historical center brand.
   This deliberately targets the converged output rather than depending on older
   surrounding implementation details. The current factual corner card is preserved. */
{
  let wm=read(WM);
  const center="c.fillText('AXIS',W/2,H*.48);";
  const divider="c.fillRect(W*.12,H*.555,W*.76,Math.max(2,Math.round(W*.0025)));";
  wm=once(wm,center,'/* AXIS 8.15.1 center brand retired */','final center AXIS draw');
  wm=once(wm,divider,'/* AXIS 8.15.1 center divider retired */','final center divider draw');

  /* 8.8.4 tried to suppress app.js by writing `photoMode=raw` only to persisted
     storage. app.js uses its already-loaded in-memory state during save, so that
     never reliably suppressed the old compositor. With that compositor physically
     retired above, temporary save-state mutation is unnecessary and is removed. */
  wm=regexOnce(
    wm,
    /function suppressLegacy\(\)\{[\s\S]*?\}\nfunction bind\(\)\{/,
    "function suppressLegacy(){if(!armed)return;const a=armed;armed=null;setTimeout(()=>finishStamp(a),0)}\nfunction bind(){",
    '8.8.4 temporary raw-mode suppression retirement'
  );

  const end=wm.lastIndexOf('})();');
  if(end<0)fail('watermark runtime IIFE end missing');
  const marker="\ntry{window.__AXIS_8151_REGRESSION_SEAL__={version:'8.15.1',homeColdStart:'semantic-sealed',photoWatermarkOwner:'v8710-watermark',legacyPhotoCompositor:false,centerBrand:false,currentCard:true}}catch{}\n";
  wm=wm.slice(0,end)+marker+wm.slice(end);
  if(wm.includes("fillText('A X I S'" )||wm.includes("fillText('AXIS',W/2,H*.48)"))fail('center AXIS brand survived');
  if(wm.includes(divider))fail('center divider survived');
  if(!wm.includes("fillText('AXIS / RECORD'"))fail('current factual watermark card disappeared');
  try{new Function(wm)}catch(e){fail(`watermark syntax ${e.message}`)}
  fs.writeFileSync(WM,wm);
}

console.log('[AXIS 8.15.1 regression seal] PASS · static Home semantics hidden until canonical render · one photo watermark compositor · center brand retired');
await import('./prepare-8151-media-stable-swap.mjs');
await import('./prepare-816-capture-evidence-convergence.mjs');
await import('./prepare-816-evidence-compat-refine.mjs');
await import('./prepare-817-interaction-convergence-driver.mjs');
await import('./prepare-817-media-master.mjs');
