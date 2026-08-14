(()=>{'use strict';
const META='axis_v8_meta',$=s=>document.querySelector(s);let timer=0,until=0;
const read=()=>{try{const m=JSON.parse(localStorage.getItem(META)||'null')||{};m.prefs=m.prefs||{};return m}catch{return{prefs:{}}}};
function pref(){const p=read().prefs;return{on:p.v8710SoundEnabled!==false,set:p.v8710SoundSet||'kinetic',repeat:p.v8710Repeat||'double'}}
function stop(){clearTimeout(timer);timer=0;until=0;$('#v8710Stop')?.classList.remove('show')}
const scenes={
kinetic:{bpm:126,root:55,scale:[1,1.5,2,2.25,3],accent:.88},
vector:{bpm:132,root:61.74,scale:[1,1.25,1.5,2,2.5],accent:.82},
drift:{bpm:112,root:49,scale:[1,1.333,1.5,2,2.667],accent:.72},
apex:{bpm:128,root:65.4,scale:[1,1.25,1.667,2,2.5],accent:.94}
};
function play(kind='test'){
const A=window.__AXIS_AUDIO_CORE__,p=pref();if(!A||!p.on)return;const S=scenes[p.set]||scenes.kinetic,B=A.bus(S.accent);if(!B)return;const t=B.x.currentTime+.035,beat=60/S.bpm,r=S.root,sc=S.scale;
const step=(i,off=0)=>r*sc[i%sc.length]*Math.pow(2,off);
const bar=(base=0,strong=false)=>{A.kick(B,t+base,strong?.34:.28);A.hat(B,t+base+beat*.5,.045);A.clap(B,t+base+beat,.075);A.hat(B,t+base+beat*1.5,.04);A.kick(B,t+base+beat*2,.24);A.hat(B,t+base+beat*2.5,.05);A.clap(B,t+base+beat*3,.07);A.hat(B,t+base+beat*3.5,.042)};
bar(0,true);
A.bass(B,step(0),t,.18,beat*.72);A.bass(B,step(0),t+beat*2,.15,beat*.7);
A.pluck(B,step(2,1),t+beat*.25,.115,beat*.58);A.pluck(B,step(3,1),t+beat*1.25,.105,beat*.55);A.pluck(B,step(1,1),t+beat*2.25,.10,beat*.52);A.pluck(B,step(4,1),t+beat*3.22,.12,beat*.62);
if(kind==='set'){A.chord(B,[step(0,1),step(2,1),step(4,1)],t+beat*3.42,.045,beat*.75);return}
bar(beat*4,false);
A.bass(B,step(1),t+beat*4,.16,beat*.7);A.bass(B,step(3),t+beat*6,.17,beat*.7);
A.pluck(B,step(3,1),t+beat*4.18,.11,beat*.62);A.pluck(B,step(4,1),t+beat*5.18,.12,beat*.64);A.pluck(B,step(2,2),t+beat*6.16,.10,beat*.7);
if(kind==='rest'){A.chord(B,[step(0,1),step(2,1),step(4,1)],t+beat*7.05,.052,beat*1.25)}
if(kind==='item'){A.chord(B,[step(1,1),step(3,1),step(4,1)],t+beat*7.0,.06,beat*1.4);A.pluck(B,step(4,2),t+beat*7.42,.08,beat*.85)}
if(kind==='session'||kind==='test'){A.kick(B,t+beat*8,.30);A.chord(B,[step(0,1),step(2,1),step(4,1)],t+beat*8.05,.065,beat*1.55);A.pluck(B,step(4,2),t+beat*8.48,.09,beat*1.05);A.hat(B,t+beat*9.35,.05)}
}
async function cue(kind='test'){const A=window.__AXIS_AUDIO_CORE__;if(!A||!pref().on||!(await A.unlock()))return;stop();play(kind);const p=pref(),mode=p.repeat,S=scenes[p.set]||scenes.kinetic,beat=60/S.bpm,dur=kind==='set'?beat*4.6:beat*10.2;if(mode==='double')timer=setTimeout(()=>play(kind),Math.round((dur+.28)*1000));else if(mode==='loop'){until=Date.now()+18000;$('#v8710Stop')?.classList.add('show');const again=()=>{if(!until||Date.now()>until)return stop();play(kind);timer=setTimeout(again,Math.round((dur+.42)*1000))};timer=setTimeout(again,Math.round((dur+.42)*1000))}}
window.__AXIS_SONIC__={cue,stop};window.__AXIS_8710_SONIC_MOTIFS_READY__=true;
})();