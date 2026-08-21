import fs from 'node:fs';

const APP='app.js',WM='v8710-watermark.js',SHELL='first-paint-shell.css';
const fail=m=>{throw new Error(`[AXIS 8.15.1 regression seal] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

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
  const anchor='window.__AXIS_HOME_STATE__=x}';
  app=once(app,anchor,"window.__AXIS_HOME_STATE__=x;document.documentElement.dataset.axisHomeReady='1'}",'canonical Home first commit');

  /* app.js used to rasterize a complete legacy photo watermark before the current
     v8710 owner stamped the same saved frame again. Photo finalization is now raw;
     v8710 remains the one and only photo watermark compositor. Video is untouched. */
  const legacy=/async function finalizeFrame\(frame,e,eq\)\{if\(\(state\.prefs\.watermark\.photoMode\|\|'wm'\)==='raw'\)return frame\.blob;[\s\S]*?return await new Promise\(r=>cv\.toBlob\(r,'image\/jpeg',\.88\)\)\}/;
  const matches=app.match(new RegExp(legacy.source,'g'))||[];
  if(matches.length!==1)fail(`legacy photo finalizer expected once, found ${matches.length}`);
  app=app.replace(legacy,"async function finalizeFrame(frame,e,eq){return frame.blob}/* AXIS 8.15.1: current photo watermark compositor is v8710 only. */");
  try{new Function(app)}catch(e){fail(`app syntax ${e.message}`)}
  fs.writeFileSync(APP,app);
}

/* Retire the historical large center AXIS brand and its center divider. The factual
   current corner card remains the sole visible saved-photo watermark composition. */
{
  let wm=read(WM);
  const old="c.save();c.globalAlpha=Math.max(.10,p.opacity/100);c.fillStyle='#737cff';c.textAlign='center';c.textBaseline='middle';c.font=`800 ${Math.max(74,Math.round(W*.12))}px -apple-system,BlinkMacSystemFont,Arial`;c.fillText('A X I S',W/2,H*.48);c.globalAlpha=1;c.fillStyle='rgba(115,124,255,.72)';c.fillRect(W*.12,H*.555,W*.76,Math.max(2,Math.round(W*.0025)));const name=";
  const next="c.save();c.globalAlpha=1;const name=";
  wm=once(wm,old,next,'center AXIS brand retirement');

  const suppressOld="function suppressLegacy(){if(!armed)return;const a=armed;armed=null;const m=meta();m.prefs.v876WmOpacity=4;m.prefs.v85WmPos='bl';m.prefs.v85WmLocation=false;write(META,m);setTimeout(()=>finishStamp(a),0)}";
  const suppressNext="function suppressLegacy(){if(!armed)return;const a=armed;armed=null;setTimeout(()=>finishStamp(a),0)}";
  wm=once(wm,suppressOld,suppressNext,'legacy watermark suppression hack retirement');

  const finishOld="}catch(e){console.warn('[AXIS] final watermark skipped',e)}finally{const m=meta();m.prefs.v876WmOpacity=a.old.opacity;m.prefs.v85WmPos=a.old.pos;m.prefs.v85WmLocation=a.old.location;write(META,m);render()}}";
  const finishNext="}catch(e){console.warn('[AXIS] final watermark skipped',e)}finally{render()}}";
  wm=once(wm,finishOld,finishNext,'watermark temporary preference rollback retirement');

  const end=wm.lastIndexOf('})();');
  if(end<0)fail('watermark runtime IIFE end missing');
  const marker="\ntry{window.__AXIS_8151_REGRESSION_SEAL__={version:'8.15.1',homeColdStart:'semantic-sealed',photoWatermarkOwner:'v8710-watermark',legacyPhotoCompositor:false,centerBrand:false,currentCard:true}}catch{}\n";
  wm=wm.slice(0,end)+marker+wm.slice(end);
  if(wm.includes("fillText('A X I S'"))fail('center AXIS brand survived');
  try{new Function(wm)}catch(e){fail(`watermark syntax ${e.message}`)}
  fs.writeFileSync(WM,wm);
}

console.log('[AXIS 8.15.1 regression seal] PASS · static Home semantics hidden until canonical render · one photo watermark compositor · center brand retired');
