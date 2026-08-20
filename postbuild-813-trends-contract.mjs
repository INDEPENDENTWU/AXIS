import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.13 trends contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),info=JSON.parse(read('axis-build.json')),runtime=read('axis-core.js'),html=read('index.html'),source=read('v813-trends-field.js');
if(contract.publicVersion!=='8.13'||contract.stableBaseVersion!=='8.13')fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);
if(info.version!=='8.13'||info.baseVersion!=='8.13')fail(`manifest identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const needle of ['__AXIS_813_TRENDS_FIELD__','v813-trends-field','edgeSafePx:24','pan-y + horizontal-scrub','--axis-ion:#79d7ff','prefers-reduced-motion'])if(!runtime.includes(needle))fail(`compiled trends marker missing ${needle}`);
for(const id of ['v813Viewport','v813TrackCanvas','v813TrackSvg','v813Nodes','v813Insight','v813Fingerprint','v813Expand','v813Memory'])if((html.match(new RegExp(`id="${id}"`,'g'))||[]).length!==1)fail(`DOM #${id} missing or duplicated`);
if((html.match(/data-axis-trends-owner="v813-trends-field"/g)||[]).length!==1)fail('visible trends owner duplicated');
for(const text of ['当前状态','这次让什么发生了','下一针','状态场']){const visible=html.split('<div class="v813LegacyTrends"')[0];if(visible.includes(text))fail(`legacy user-facing trend copy survived: ${text}`)}
for(const forbidden of ['fetch(','XMLHttpRequest','localStorage.setItem','sessionStorage.setItem','new MutationObserver','new ResizeObserver','setInterval('])if(source.includes(forbidden))fail(`read-only trends source contains forbidden owner ${forbidden}`);
if(!source.includes('touch-action:pan-y')||!source.includes('x<24||x>r.width-24')||!source.includes('Math.abs(dx)<=Math.abs(dy)*1.25'))fail('gesture conflict contract missing');
if(!source.includes('.v813Bearing')||!source.includes('.v813Fingerprint')||!source.includes('fingerprintSegments'))fail('AXIS bearing/fingerprint language missing');
info.gates=info.gates||{};Object.assign(info.gates,{trendsTimeField813:true,trendsSessionFingerprint813:true,trendsHorizontalScrub813:true,trendsEdgeSafe813:true,trendsReducedMotion813:true,trendsReadOnly813:true,trendsNoModal813:true,trendsBrandIon813:true});
info.axis813={...(info.axis813||{}),release:true,trends:{owner:'v813-trends-field',surface:'time-field',trajectory:'svg-ribbon',node:'axis-bearing',fingerprint:'activity-intervals',range:['recent','quarter','all'],gesture:'vertical-scroll + horizontal-scrub + tap-expand',edgeSafePx:24,colors:{violet:'#737cff',ion:'#79d7ff'},motionMs:{micro:[90,140],structural:[220,320],spatial:[380,520]},network:false,persistence:false,trainingOwner:false,modal:false}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.13 trends contract] PASS · time field + bearing nodes + session fingerprint · pointer-safe read-only owner · canonical runtime preserved');
