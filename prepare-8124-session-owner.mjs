import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.4 session owner] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/*
 * The v84 gesture layer intentionally owns the long-press UX for #finishHold,
 * but it historically archived the workout by writing LocalStorage directly.
 * That bypassed app.js' in-memory state, so persisted completion and rendered
 * Home could disagree until a reload. Keep the v84 gesture, converge the
 * completion mutation + finish UI onto the app.js owner, and retain v84's old
 * path only as a fail-open fallback for non-canonical/older builds.
 */
{
  const f='app.js';let s=read(f);
  if(s.includes('__AXIS_8124_WORKOUT_OWNER__'))fail('canonical workout owner already installed');
  const re=/function completeFinish\(\)\{[^\n]*\}/g,hits=s.match(re)||[];
  if(hits.length!==1)fail(`app completeFinish expected once, found ${hits.length}`);
  const bridge=`\ntry{window.__AXIS_COMPLETE_WORKOUT__=()=>{if(!state.active)return false;completeFinish();return !state.active};window.__AXIS_8124_WORKOUT_OWNER__={version:'8.12.4',gestureOwner:'v84-hold',completionOwner:'app-completeFinish',storageOwner:'app',uiOwner:'app',legacyFallback:true}}catch{}\n`;
  s=s.replace(re,m=>m+bridge);
  syntax(s,f);write(f,s);
}

{
  const f='v84-runtime.js';let s=read(f);
  const from="function finishSession(){const c=readCore(),s=c.active;if(!s)return;";
  const to="function finishSession(){if(window.__AXIS_COMPLETE_WORKOUT__?.()===true)return;const c=readCore(),s=c.active;if(!s)return;";
  s=once(s,from,to,'v84 total-workout delegate');
  if(!s.includes("window.__AXIS_COMPLETE_WORKOUT__?.()===true"))fail('v84 completion delegate missing');
  syntax(s,f);write(f,s);
}

console.log('[AXIS 8.12.4 session owner] PASS · v84 owns hold gesture · app owns completion state/storage/UI · legacy fallback retained');
