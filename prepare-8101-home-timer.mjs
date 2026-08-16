import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10.1 home timer] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

const APP='app.js';let app=read(APP);
app=once(app,
"function startTimer(){stopTimer();const tick=()=>{if(!state.active)return;const sec=Math.floor((Date.now()-state.active.start)/1000);setText('#liveTimer',`${pad(Math.floor(sec/60))}:${pad(sec%60)}`)};tick();timer=setInterval(tick,1000)}",
"function liveTimeLabel(sec){const h=Math.floor(sec/3600),m=Math.floor(sec/60)%60,s=sec%60;return h?`${h}:${pad(m)}:${pad(s)}`:`${pad(m)}:${pad(s)}`}\nfunction paintLiveTimer(){if(!state.active)return;const el=$('#liveTimer');if(!el)return;const sec=Math.max(0,Math.floor((Date.now()-state.active.start)/1000)),next=liveTimeLabel(sec);if(el.dataset.axisSecond===String(sec)&&el.textContent===next)return;el.dataset.axisSecond=String(sec);if(el.textContent!==next)el.textContent=next}\nfunction startTimer(){if(timer){paintLiveTimer();return}paintLiveTimer();timer=setInterval(paintLiveTimer,1000)}",
'idempotent live timer');
if(!app.includes('function paintLiveTimer()')||!app.includes('if(timer){paintLiveTimer();return}'))fail('stable timer owner missing');
write(APP,app);

const CSS='product-convergence.css';let css=read(CSS);
const mark='AXIS 8.10.1 stable live timer';
if(css.includes(mark))fail('stable live timer CSS duplicated');
css+=`\n\n/* ${mark} */\n#liveTimer{font-variant-numeric:tabular-nums!important;font-feature-settings:\"tnum\" 1!important;min-width:5.6ch;contain:paint;isolation:isolate;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}\n`;
write(CSS,css);
console.log('[AXIS 8.10.1 home timer] PASS · one persistent second ticker · no restart on pageshow/render · tabular isolated paint');
