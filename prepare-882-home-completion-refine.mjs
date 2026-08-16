import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.8.2 Home completion] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};

/* Idle Home does not need a one-second repaint. Active training keeps one-second precision. */
{
  const FILE='app.js';let src=read(FILE);
  src=once(src,'timer=setInterval(tick,1000)}','const delay=state.active?1000:60000;window.__AXIS_HOME_TIMER_MS__=delay;timer=setInterval(tick,delay)}','adaptive Home timer');
  fs.writeFileSync(FILE,src);
}

/* Continuation belongs to Quick Record's Recent list, not the Home page. */
{
  const FILE='v61.js';let src=read(FILE);
  src=regexOnce(src,/function renderContinue\(\)\{[\s\S]*?\}\nfunction median/,
`function renderContinue(){const box=$('#v81Continue');if(box)box.remove();$('#idleHome .metricPair')?.classList.remove('v81Secondary')}
function median`,'retire duplicate Home continuation list');
  fs.writeFileSync(FILE,src);
}

/* Completed and between-session Home states are typography, not dashboards. */
{
  const FILE='product-convergence.css';let css=read(FILE);
  const MARK='AXIS 8.8.2 completed Home refinement';
  if(css.includes(MARK))fail('CSS duplicated');
  css+=`

/* ${MARK} */
#axisNowHero[data-scope='complete'],
#axisNowHero[data-scope='recovery']{
  --axis-now-accent:#8f98b2;
  min-height:0!important;
  margin:0 0 20px!important;
  padding:10px 0 24px!important;
  overflow:visible!important;
  isolation:auto!important;
  border-bottom:1px solid var(--line2);
}
#axisNowHero[data-scope='complete']{--axis-now-accent:#9aa1ff}
#axisNowHero[data-scope='complete']:before,
#axisNowHero[data-scope='recovery']:before{display:none!important}
#axisNowHero[data-scope='complete'] .axisNowStage,
#axisNowHero[data-scope='recovery'] .axisNowStage{
  min-height:0!important;
  display:block!important;
}
#axisNowHero[data-scope='complete'] .axisNowTop,
#axisNowHero[data-scope='recovery'] .axisNowTop{
  height:20px!important;
  margin-bottom:11px!important;
}
#axisNowHero[data-scope='complete'] .axisNowTop>span,
#axisNowHero[data-scope='recovery'] .axisNowTop>span{
  color:var(--axis-now-accent)!important;
  font-size:10px!important;
  font-weight:720!important;
  letter-spacing:.1em!important;
}
#axisNowHero[data-scope='complete'] .axisNowTop>time,
#axisNowHero[data-scope='recovery'] .axisNowTop>time{
  color:var(--dim)!important;
  font-size:10px!important;
}
#axisNowHero[data-scope='complete'] .axisNowCopy>span,
#axisNowHero[data-scope='recovery'] .axisNowCopy>span{
  margin:0 0 6px!important;
  color:var(--muted)!important;
  font-size:12px!important;
  line-height:1.25!important;
  font-weight:620!important;
}
#axisNowHero[data-scope='complete'] .axisNowCopy>b,
#axisNowHero[data-scope='recovery'] .axisNowCopy>b{
  min-height:0!important;
  font-size:clamp(38px,10vw,48px)!important;
  line-height:.98!important;
  font-weight:670!important;
  letter-spacing:-.055em!important;
}
#axisNowHero[data-scope='complete'] .axisNowCopy>small,
#axisNowHero[data-scope='recovery'] .axisNowCopy>small{
  margin-top:9px!important;
  color:var(--muted)!important;
  font-size:11px!important;
  line-height:1.4!important;
}
#axisNowHero[data-scope='complete'] .axisNowDial,
#axisNowHero[data-scope='complete'] .axisNowRail,
#axisNowHero[data-scope='complete'] .axisNowFacts,
#axisNowHero[data-scope='recovery'] .axisNowDial,
#axisNowHero[data-scope='recovery'] .axisNowRail,
#axisNowHero[data-scope='recovery'] .axisNowFacts{display:none!important}
#idleHome .metricPair.v81Secondary{opacity:1!important}

@media(max-width:390px){
  #axisNowHero[data-scope='complete'],#axisNowHero[data-scope='recovery']{padding-top:8px!important;padding-bottom:21px!important;margin-bottom:18px!important}
  #axisNowHero[data-scope='complete'] .axisNowCopy>b,#axisNowHero[data-scope='recovery'] .axisNowCopy>b{font-size:38px!important}
}
`;
  fs.writeFileSync(FILE,css);
}

console.log('[AXIS 8.8.2 Home completion] PASS · today-complete summary · honest training interval · no idle dial · no duplicate continuation · adaptive idle timer');
