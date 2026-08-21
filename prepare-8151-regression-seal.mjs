import fs from 'node:fs';

const APP='app.js',WM='v8710-watermark.js',SHELL='first-paint-shell.css';
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
  let app=read(APP);
  app=once(app,'window.__AXIS_HOME_STATE__=x}',"window.__AXIS_HOME_STATE__=x;document.documentElement.dataset.axisHomeReady='1'}",'canonical Home first commit');

  /* app.js used to rasterize a complete legacy photo watermark before the current
     v8710 owner stamped the same saved frame again. Photo finalization is now raw;
     v8710 remains the one and only photo watermark compositor. Video is untouched. */
  const legacy=/async function finalizeFrame\(frame,e,eq\)\{if\(\(state\.prefs\.watermark\.photoMode\|\|'wm'\)==='raw'\)return frame\.blob;[\s\S]*?return await new Promise\(r=>cv\.toBlob\(r,'image\/jpeg',\.88\)\)\}/;
  app=regexOnce(app,legacy,"async function finalizeFrame(frame,e,eq){return frame.blob}/* AXIS 8.15.1: current photo watermark compositor is v8710 only. */",'legacy photo finalizer retirement');
  try{new Function(app)}catch(e){fail(`app syntax ${e.message}`)}
  fs.writeFileSync(APP,app);
}

/* Retire the historical large center AXIS brand and center divider from the final
   8.8.4-shaped owner. The factual corner card remains the only visible composition. */
{
  let wm=read(WM);
  wm=regexOnce(
    wm,
    /c\.save\(\);c\.globalAlpha=Math\.max\(\.10,p\.opacity\/100\);c\.fillStyle='#737cff';c\.textAlign='center';c\.textBaseline='middle';c\.font=`800 \$\{Math\.max\(74,Math\.round\(W\*\.12\)\)\}px -apple-system,BlinkMacSystemFont,Arial`;c\.fillText\('AXIS',W\/2,H\*\.48\);c\.globalAlpha=1;c\.fillStyle='rgba\(115,124,255,\.72\)';c\.fillRect\(W\*\.12,H\*\.555,W\*\.76,Math\.max\(2,Math\.round\(W\*\.0025\)\)\);const name=/,
    "c.save();c.globalAlpha=1;const name=",
    'final center AXIS brand retirement'
  );

  /* 8.8.4 tried to suppress app.js by writing `photoMode=raw` to LocalStorage, but
     app.js uses its already-loaded in-memory state during save. With the legacy app
     photo finalizer now physically retired, this temporary preference mutation is
     unnecessary and must not remain as a competing save-state owner. */
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
  if(!wm.includes("fillText('AXIS / RECORD'"))fail('current factual watermark card disappeared');
  try{new Function(wm)}catch(e){fail(`watermark syntax ${e.message}`)}
  fs.writeFileSync(WM,wm);
}

console.log('[AXIS 8.15.1 regression seal] PASS · static Home semantics hidden until canonical render · one photo watermark compositor · center brand retired');
