import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10.1 home timer] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};

const APP='app.js';let app=read(APP);
app=regexOnce(app,/function startTimer\(\)\{[\s\S]*?\}\nfunction stopTimer\(\)\{/,
`function liveTimeLabel(sec){const h=Math.floor(sec/3600),m=Math.floor(sec/60)%60,s=sec%60;return h?\`${'${h}'}:${'${pad(m)}'}:${'${pad(s)}'}\`:\`${'${pad(Math.floor(sec/60))}'}:${'${pad(s)}'}\`}
function paintLiveTimer(t=Date.now()){if(state.active){const el=$('#liveTimer'),sec=Math.max(0,Math.floor((t-state.active.start)/1000)),next=liveTimeLabel(sec);if(el&&!(el.dataset.axisSecond===String(sec)&&el.textContent===next)){el.dataset.axisSecond=String(sec);if(el.textContent!==next)el.textContent=next}}renderHomeState(t)}
function startTimer(){const delay=state.active?1000:60000;if(timer&&window.__AXIS_HOME_TIMER_MS__===delay){paintLiveTimer();return}if(timer){clearInterval(timer);timer=null}window.__AXIS_HOME_TIMER_MS__=delay;paintLiveTimer();timer=setInterval(paintLiveTimer,delay)}
function stopTimer(){`,'canonical idempotent adaptive live timer');
app=regexOnce(app,/h\.style\.setProperty\('--axis-now-p',String\(Math\.max\(0,Math\.min\(1,x\.progress\|\|0\)\)\*360\)\+'deg'\);const r=\$\('#axisNowRailFill'\);if\(r\)r\.style\.width=Math\.max\(0,Math\.min\(1,x\.progress\|\|0\)\)\*100\+'%'/,
`const progress=Math.max(0,Math.min(1,x.progress||0)),pdeg=String(progress*360)+'deg',dial=$('#axisNowDial');if(dial&&dial.style.getPropertyValue('--axis-now-p')!==pdeg)dial.style.setProperty('--axis-now-p',pdeg);const r=$('#axisNowRailFill');if(r){const width=progress*100+'%';if(r.style.width!==width)r.style.width=width}`,'localize hero progress paint');
if(!app.includes('function paintLiveTimer(t=Date.now())')||!app.includes("if(timer&&window.__AXIS_HOME_TIMER_MS__===delay){paintLiveTimer();return}"))fail('stable adaptive timer owner missing');
if(app.includes("h.style.setProperty('--axis-now-p'"))fail('hero-wide progress custom property invalidation remains');
write(APP,app);

const CSS='product-convergence.css';let css=read(CSS);
const mark='AXIS 8.10.1 stable live timer';
if(css.includes(mark))fail('stable live timer CSS duplicated');
css+=`\n\n/* ${mark} */\n#liveTimer,#axisNowValue{font-variant-numeric:tabular-nums!important;font-feature-settings:\"tnum\" 1!important;contain:paint;isolation:isolate;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}\n#liveTimer{min-width:5.6ch}\n#axisNowValue{min-width:5.8ch}\n#axisNowDial,.axisNowRail{contain:paint;isolation:isolate}\n`;
write(CSS,css);
console.log('[AXIS 8.10.1 home timer] PASS · active ticker stays mounted · idle stays 60s · hero progress paint localized · tabular timer paint isolated');
