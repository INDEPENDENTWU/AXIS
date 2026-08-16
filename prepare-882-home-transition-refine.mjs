import fs from 'node:fs';

const FILE='product-convergence.css';
const MARK='AXIS 8.8.2 home transition refinement';
if(!fs.existsSync(FILE))throw new Error(`missing ${FILE}`);
let css=fs.readFileSync(FILE,'utf8');
if(css.includes(MARK))throw new Error('home transition refinement duplicated');

const base=fs.readFileSync('styles.css','utf8');
for(const contract of [
  '.pageHead{display:flex;align-items:flex-end;justify-content:space-between;margin:24px 0 22px}',
  '.liveHead{display:flex;align-items:flex-end;justify-content:space-between;margin-top:6px}',
  '.metricPair.compact{margin-top:20px}',
  '.holdFinish{--hold:0%;width:68px;height:68px'
])if(!base.includes(contract))throw new Error(`8.8.1 home geometry contract changed: ${contract}`);

css+=`

/* ${MARK} */
/* The 8.8.1 active-training hierarchy remains canonical. The 8.8.2 Now layer only appears when it adds non-duplicate context. */
#axisNowHero[hidden]{display:none!important}
#todayView>.pageHead{margin-bottom:22px!important}
#todayView.axisNowVisible>.pageHead{margin-bottom:2px!important}
#activeHome>.liveHead{margin-top:6px!important}
#activeHome>.metricPair.compact{margin-top:20px!important}

/* Between exercises: one compact transition signal, not a second training dashboard. */
#axisNowHero[data-scope='transition']{
  min-height:0!important;
  margin:0 0 14px!important;
  padding:5px 0 14px!important;
  overflow:visible!important;
  isolation:auto!important;
}
#axisNowHero[data-scope='transition']:before{display:none!important}
#axisNowHero[data-scope='transition'] .axisNowTop{display:none!important}
#axisNowHero[data-scope='transition'] .axisNowStage{
  min-height:0!important;
  display:block!important;
}
#axisNowHero[data-scope='transition'] .axisNowCopy>span{
  margin:0 0 7px!important;
  color:var(--axis-now-accent)!important;
  font-size:10px!important;
  line-height:1.2!important;
  font-weight:720!important;
  letter-spacing:.08em!important;
}
#axisNowHero[data-scope='transition'] .axisNowCopy>b{
  min-height:0!important;
  font-size:32px!important;
  line-height:1!important;
  font-weight:650!important;
  letter-spacing:-.045em!important;
}
#axisNowHero[data-scope='transition'] .axisNowCopy>small{
  margin-top:7px!important;
  color:var(--muted)!important;
  font-size:11px!important;
  line-height:1.35!important;
}
#axisNowHero[data-scope='transition'] .axisNowDial,
#axisNowHero[data-scope='transition'] .axisNowFacts{display:none!important}
#axisNowHero[data-scope='transition'] .axisNowRail{
  height:2px!important;
  margin-top:12px!important;
  opacity:.72!important;
}
#axisNowHero[data-scope='transition'] .axisNowRail>i{height:2px!important}

@media(max-width:390px){
  #axisNowHero[data-scope='transition']{padding-top:3px!important;margin-bottom:12px!important}
  #axisNowHero[data-scope='transition'] .axisNowCopy>b{font-size:30px!important}
}
`;
fs.writeFileSync(FILE,css);
console.log('[AXIS 8.8.2] home transition refinement passed · 8.8.1 active hierarchy preserved · compact inter-item signal');
