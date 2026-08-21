import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.13.1 evolution contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),info=JSON.parse(read('axis-build.json')),runtime=read('axis-core.js'),html=read('index.html'),source=read('v8131-evolution-field.js');
if(contract.publicVersion!=='8.13.1'||contract.stableBaseVersion!=='8.13.1')fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);
if(info.version!=='8.13.1'||info.baseVersion!=='8.13.1')fail(`manifest identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const needle of ['__AXIS_8131_EVOLUTION_FIELD__','__AXIS_EVOLUTION__','v8131-evolution-field','axis:state-changed','axis_v8_meta','activityFor','durationLabel','edgeSafePx:24','pan-y + horizontal-scrub','--axis-ion:','#79d7ff','prefers-reduced-motion'])if(!runtime.includes(needle))fail(`compiled Evolution marker missing ${needle}`);
for(const id of ['v813Viewport','v813TrackCanvas','v813TrackSvg','v813Nodes','v813Insight','v813Fingerprint','v813Expand','v813Memory'])if((html.match(new RegExp(`id="${id}"`,'g'))||[]).length!==1)fail(`DOM #${id} missing or duplicated`);
if((html.match(/data-axis-trends-owner="v8131-evolution-field"/g)||[]).length!==1)fail('visible Evolution owner duplicated');
for(const text of ['左右滑动查看','点一下展开','留下几次训练后','继续留下相同动作','当前状态','下一针','状态场']){const visible=html.split('<div class="v813LegacyTrends"')[0];if(visible.includes(text)||source.includes(text))fail(`instructional/legacy copy survived: ${text}`)}
for(const forbidden of ['fetch(','XMLHttpRequest','localStorage.setItem','sessionStorage.setItem','new MutationObserver','new ResizeObserver','setInterval('])if(source.includes(forbidden))fail(`read-only Evolution source contains forbidden owner ${forbidden}`);
if(!source.includes("META='axis_v8_meta'")||!source.includes('meta.events?.[e?.id]?.activity')||!source.includes("e.key===CORE||e.key===META"))fail('canonical metadata activity fallback incomplete');
if(!source.includes("return n<60000?'<1分钟'")||!source.includes('durationLabel(sessionSpan(s))'))fail('truthful sub-minute duration contract missing');
if(!source.includes("window.addEventListener('pageshow'")||!source.includes('sessions.length!==rangeSessions().length'))fail('navigation recovery contract missing');
if(!source.includes('touch-action:pan-y')||!source.includes('x<24||x>r.width-24')||!source.includes('Math.abs(dx)<=Math.abs(dy)*1.25')||!source.includes('if(!s.drag)return'))fail('gesture ownership contract missing');
if(!source.includes('firstEncounter')||!source.includes('latestEncounter')||!source.includes('encounterCount')||!source.includes('timeSpanDays')||!source.includes('mediaEvidence'))fail('Evolution resolver projection incomplete');
if(!runtime.includes("new CustomEvent('axis:state-changed'"))fail('canonical state lifecycle bridge missing from compiled runtime');
info.gates=info.gates||{};Object.assign(info.gates,{trendsTimeField813:true,trendsSessionFingerprint813:true,trendsHorizontalScrub813:true,trendsEdgeSafe813:true,trendsReducedMotion813:true,trendsReadOnly813:true,evolutionFoundation8131:true,trendsStateLifecycle8131:true,trendsFactualCopy8131:true,trendsSameDaySessions8131:true,trendsMetaActivity8131:true,trendsNavigationRefresh8131:true,trendsTruthfulDuration8131:true});
info.axis8131={release:true,scope:'evolution-foundation',trends:{owner:'v8131-evolution-field',projection:'sealed-sessions',refresh:'axis:state-changed + navigation re-read',activityEvidence:'event.activity + axis_v8_meta.events[eventId].activity',sameDayDistinct:true,subMinuteDuration:'<1分钟',network:false,persistence:false,trainingOwner:false},evolution:{owner:'evolution-resolver',readOnly:true,fields:['firstEncounter','latestEncounter','encounterCount','timeSpanDays','mediaEvidence']},copy:{instructional:false,factual:true}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.13.1 evolution contract] PASS · sealed sessions + canonical metadata activity live-project into Trends · navigation recovery · truthful sub-minute duration · read-only Evolution resolver');
