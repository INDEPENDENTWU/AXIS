import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10.3 contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),runtime=read('axis-core.js'),css=read('axis-style.css'),info=JSON.parse(read('axis-build.json')),vercel=read('vercel.json'),edgeone=read('edgeone.json');
if(String(contract.publicVersion)!=='8.10.3')fail(`unexpected public version ${contract.publicVersion}`);
if(info.version!=='8.10.3'||info.baseVersion!=='8.10.3')fail(`release identity mismatch ${info.version}/${info.baseVersion}`);
for(const [needle,label] of [
 ["scope:'idle',mode:'ready',eyebrow:'现在',title:'准备开始',value:'—',meta:'今天还没有训练记录',progress:0,dial:''",'idle home still paints a false dial'],
 ["title:''",'completed home redundant title was not retired'],
 ["parts.unshift('开始 '+tlabel(last.start))",'completed home start time missing'],
 ["const axis8103DialEl=$('#axisNowDial');if(axis8103DialEl)axis8103DialEl.hidden=!x.dial",'home dial visibility owner missing'],
 ["id=\"v8710SessionPreset\"",'total workout duration presets missing'],
 ["sessionPreference:'v876SessionTarget'",'duration reminder single preference owner missing'],
 ["automaticKinds:['item','session']",'sound automatic kinds contract missing'],
 ["const AXIS8103_LOCALES={en:'en-US',ja:'ja-JP',ko:'ko-KR',zh:'zh-CN'}",'four-language locale routing missing'],
 ["dialogueTurns:4",'four-turn dialogue contract missing'],
 ["shadow:'simultaneous-auto-record-ab'",'shadow recording A/B contract missing'],
 ["function axis8103BestVoice(",'natural system voice selection missing'],
 ["function axis8103AB(",'A/B comparison action missing'],
 ["window.__AXIS_8103_FRESHNESS__={version:'8.10.3',eventDriven:true,polling:false}",'event-driven release freshness missing']
])if(!runtime.includes(needle))fail(label);
if(runtime.includes("title:'训练已记录'"))fail('redundant completed-home copy survived');
if(!css.includes('#axisNowDial[hidden]{display:none!important}'))fail('idle dial visual guard missing');
if(!css.includes('#v87Now .v87Actions>#v87AdjustBtn{order:40!important;margin-left:auto!important'))fail('adjust action is not corner-anchored');
if(!css.includes('.v810Options.track{display:flex!important;overflow-x:auto!important'))fail('learning schedule was not visually converged');
if(!vercel.includes('microphone=(self)')||!edgeone.includes('microphone=(self)'))fail('same-origin microphone policy not aligned across deployments');
if(/microphone=\(\)/.test(vercel)||/microphone=\(\)/.test(edgeone))fail('microphone remains blocked by deployment policy');
if(/setInterval\s*\([^)]*axis8103|new\s+MutationObserver\s*\([^)]*axis8103|new\s+ResizeObserver\s*\([^)]*axis8103/.test(runtime))fail('8.10.3 gained a persistent learning/home observer owner');
info.gates=info.gates||{};
Object.assign(info.gates,{
 homeIdleNoFalseFinish:true,
 homeCompletedCopyConcise:true,
 homeCompletedStartEndFacts:true,
 activeAdjustCornerAnchor:true,
 totalWorkoutDurationReminder:true,
 totalWorkoutDurationSinglePreference:true,
 restSpeakDialogueFourTurn:true,
 restSpeakEchoShadowDistinct:true,
 restSpeakShadowAutoRecordAB:true,
 restSpeakFourLanguageVoiceRouting:true,
 restSpeakBestAvailableLocalVoice:true,
 practiceMicrophoneSameOrigin:true,
 releaseFreshnessEventDriven:true
});
info.axis8103={
 home:{singleFramework:true,idleDial:false,completedTitleRedundant:false,completedStartEnd:true,adjustAnchor:'bottom-right-secondary'},
 sound:{owner:'v8710',automaticKinds:['item','session'],sessionTargetPreference:'v876SessionTarget',sessionTargets:[0,30,45,60,90],customMinutes:[5,360]},
 learning:{dialogueTurns:4,echo:'listen-then-repeat',shadow:'simultaneous-with-local-recording',comparison:'reference-vs-user-ab',locales:['en-US','ja-JP','ko-KR','zh-CN'],voiceSelection:'best-available-system-voice',autoplay:false},
 freshness:{events:['pageshow','visibilitychange'],polling:false},
 ownership:{trainingState:false,trainingControls:false,learningStore:'axis_v89_speak',recordingUpload:false}
};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.10.3 contract] PASS · unified home · duration reminder · four-language voice routing · distinct shadow A/B · stale-shell self-heal');
