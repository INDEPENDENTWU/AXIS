(()=>{'use strict';
const META='axis_v8_meta',$=s=>document.querySelector(s);let timer=0,until=0;
const read=()=>{try{const m=JSON.parse(localStorage.getItem(META)||'null')||{};m.prefs=m.prefs||{};return m}catch{return{prefs:{}}}};
function pref(){const p=read().prefs;return{on:p.v8710SoundEnabled!==false,set:p.v8710SoundSet||'kinetic',repeat:p.v8710Repeat||'double'}}
function stop(){clearTimeout(timer);timer=0;until=0;$('#v8710Stop')?.classList.remove('show')}
function play(kind='test'){const A=window.__AXIS_AUDIO_CORE__,p=pref();if(!A||!p.on)return;const B=A.bus();if(!B)return;const t=B.x.currentTime+.025,s={kinetic:[294,392,587,784],vector:[330,495,660,990],drift:[247,370,554,740],apex:[349,523,698,1046]}[p.set]||[294,392,587,784],n=A.tone;
 const hit=(at,v=.2)=>{n(B,96,at,.2,v,'sine',56);n(B,820,at+.01,.08,v*.22,'triangle',560)};
 hit(t,.22);n(B,s[0],t+.05,.34,.15,'triangle',s[1]);n(B,s[1],t+.24,.4,.17,'sine',s[2]);hit(t+.56,.16);n(B,s[2],t+.61,.48,.18,'triangle',s[3]);n(B,s[3]*2,t+.78,.62,.065,'sine',s[3]);
 if(kind!=='set'){n(B,s[1],t+1.16,.34,.12,'triangle',s[2]);n(B,s[2],t+1.43,.46,.15,'sine',s[3]);n(B,s[3],t+1.75,.62,.13,'triangle',s[3]*1.28)}
 if(kind==='session'||kind==='test'){hit(t+2.18,.2);n(B,s[0],t+2.23,.42,.13,'triangle',s[2]);n(B,s[3],t+2.46,.76,.17,'sine',s[3]*1.34)}}
async function cue(kind='test'){const A=window.__AXIS_AUDIO_CORE__;if(!A||!pref().on||!(await A.unlock()))return;stop();play(kind);const mode=pref().repeat;if(mode==='double')timer=setTimeout(()=>play(kind),kind==='set'?1050:1700);else if(mode==='loop'){until=Date.now()+18000;$('#v8710Stop')?.classList.add('show');const again=()=>{if(!until||Date.now()>until)return stop();play(kind);timer=setTimeout(again,kind==='set'?1500:2900)};timer=setTimeout(again,kind==='set'?1500:2900)}}
window.__AXIS_SONIC__={cue,stop};window.__AXIS_8710_SONIC_MOTIFS_READY__=true;
})();
