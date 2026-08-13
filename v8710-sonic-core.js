(()=>{'use strict';
let c=null,primed=false;const D=document;
function audio(){if(!c){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;c=new A({latencyHint:'interactive'})}return c}
async function unlock(){const x=audio();if(!x)return false;try{if(x.state!=='running')await x.resume();if(!primed){const b=x.createBuffer(1,1,22050),s=x.createBufferSource(),g=x.createGain();g.gain.value=0;s.buffer=b;s.connect(g);g.connect(x.destination);s.start();primed=true}return x.state==='running'}catch{return false}}
function bus(){const x=audio();if(!x)return null;const g=x.createGain(),q=x.createBiquadFilter(),d=x.createDynamicsCompressor();g.gain.value=.46;q.type='highshelf';q.frequency.value=1450;q.gain.value=4;d.threshold.value=-22;d.ratio.value=7;d.attack.value=.001;d.release.value=.24;g.connect(q);q.connect(d);d.connect(x.destination);return{x,g}}
function tone(B,f,t,d,v=.15,type='sine',to=f){if(!B)return;const o=B.x.createOscillator(),g=B.x.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(to!==f)o.frequency.exponentialRampToValueAtTime(Math.max(30,to),t+d*.9);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(B.g);o.start(t);o.stop(t+d+.05)}
window.__AXIS_AUDIO_CORE__={audio,unlock,bus,tone};D.addEventListener('pointerdown',unlock,{capture:true,passive:true});window.__AXIS_8710_SONIC_CORE_READY__=true;
})();
