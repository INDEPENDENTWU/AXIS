import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10.1 home timer] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};

const APP='app.js';let app=read(APP);
app=regexOnce(app,/function startTimer\(\)\{[\s\S]*?\}\nfunction stopTimer\(\)\{/,
`function liveTimeLabel(sec){const h=Math.floor(sec/3600),m=Math.floor(sec/60)%60,s=sec%60;return h?\`${'${h}'}:${'${pad(m)}'}:${'${pad(s)}'}\`:\`${'${pad(Math.floor(sec/60))}'}:${'${pad(s)}'}\`}
function paintLiveTimer(t=Date.now()){if(state.active){const el=$('#liveTimer'),sec=Math.max(0,Math.floor((t-state.active.start)/1000)),next=liveTimeLabel(sec);if(el&&!(el.dataset.axisSecond===String(sec)&&el.textContent===next)){el.dataset.axisSecond=String(sec);if(el.textContent!==next)el.textContent=next}}renderHomeState(t)}
function startTimer(){if(timer){paintLiveTimer();return}paintLiveTimer();timer=setInterval(paintLiveTimer,1000)}
function stopTimer(){`,'canonical idempotent live timer');
if(!app.includes('function paintLiveTimer(t=Date.now())')||!app.includes('if(timer){paintLiveTimer();return}'))fail('stable timer owner missing');
write(APP,app);

const CSS='product-convergence.css';let css=read(CSS);
const mark='AXIS 8.10.1 stable live timer';
if(css.includes(mark))fail('stable live timer CSS duplicated');
css+=`\n\n/* ${mark} */\n#liveTimer{font-variant-numeric:tabular-nums!important;font-feature-settings:\"tnum\" 1!important;min-width:5.6ch;contain:paint;isolation:isolate;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}\n`;
write(CSS,css);
console.log('[AXIS 8.10.1 home timer] PASS · canonical home ticker stays mounted across render/pageshow · tabular isolated paint');
