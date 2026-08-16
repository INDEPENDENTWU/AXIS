import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10.1 contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),runtime=read('axis-core.js'),css=read('axis-style.css'),info=JSON.parse(read('axis-build.json'));
if(String(contract.publicVersion)!=='8.10.1')fail(`unexpected public version ${contract.publicVersion}`);
if(info.version!=='8.10.1'||info.baseVersion!=='8.10.1')fail(`release identity mismatch ${info.version}/${info.baseVersion}`);
for(const [needle,label] of [
 ["entry.className='settingLink'",'learning settings entry does not inherit native row'],
 ['function paintLiveTimer(','stable live timer painter missing'],
 ['if(timer){paintLiveTimer();return}','live timer still restarts on re-render'],
 ['function axis8101SpeakDialogue(','dialogue practice missing'],
 ['function axis8101Echo(','echo practice missing'],
 ['function axis8101StartShadow(','shadow practice missing'],
 ['function axis8101ToggleRecord(','ephemeral recording missing'],
 ["getUserMedia({audio:{echoCancellation:true",'explicit local microphone path missing'],
 ['function axis8101OpportunityAllowed(','quiet opportunity policy missing'],
 ['function axis8101PaintOpportunity(','quiet opportunity rail missing'],
 ['data-v810-options="opportunity"','opportunity control missing'],
 ["version:'8.10.1',dialogue:true",'8.10.1 practice diagnostic missing']
])if(!runtime.includes(needle))fail(label);
if(!css.includes('AXIS 8.10.1 stable live timer'))fail('stable live timer paint contract missing');
if(/setInterval\s*\(\s*axis8101|new\s+MutationObserver\s*\(\s*axis8101|new\s+ResizeObserver\s*\(\s*axis8101/.test(runtime))fail('8.10.1 practice gained persistent timer/observer ownership');
if(/axis8101(?:SpeakDialogue|Echo|StartShadow)\(\)/.test(runtime.match(/function axis8101Install\([\s\S]*?window\.__AXIS_8101_PRACTICE__/)?.[0]?.split("D.addEventListener('click'")[0]||''))fail('8.10.1 practice autoplays before user action');
for(const name of ['axis8101MarkAttempt','axis8101OpenOpportunity','axis8101ToggleRecord']){
 const m=runtime.match(new RegExp(`function ${name}\\([^\\n]*\\)\\{[\\s\\S]*?(?=\\nfunction )`));
 if(m&&/writeMeta\(|writeCore\(|axis_v8_meta|axis_v60_state/.test(m[0]))fail(`${name} writes training state`)
}
if(!runtime.includes("owner:'v87-direct-884'"))fail('canonical active control owner changed');
info.gates=info.gates||{};
Object.assign(info.gates,{
 settingsLearningNativeRow:true,
 homeTimerStablePaint:true,
 restSpeakDialoguePractice:true,
 restSpeakEchoPractice:true,
 restSpeakShadowPractice:true,
 restSpeakEphemeralRecording:true,
 restSpeakOpportunityRail:true,
 restSpeakOpportunityControl:true,
 restSpeakNoAutoplay8101:true,
 restSpeakNoTrainingOwnership8101:true
});
info.axis8101={
 settings:{learningRow:'native-settingLink',summary:'compact-smart-or-custom'},
 homeTimer:{owner:'app.js',restartOnRender:false,paint:'isolated-tabular',resume:'same-ticker'},
 practice:{modes:['dialogue','echo','shadow'],dialogueTurns:'target-plus-natural-response',shadowBoundaryCue:true,recording:'ephemeral-memory-only',audioUpload:false,autoplay:false},
 opportunities:{surface:'existing-rest-language-rail',states:['paused','plan-done'],default:'smart',autoOpen:false,autoSound:false},
 ownership:{trainingState:false,trainingControls:false,geometry:false,persistentTimer:false,observer:false,soundAutomatic:false,learningStore:'axis_v89_speak'}
};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.10.1 contract] PASS · native settings · stable timer · dialogue/echo/shadow · ephemeral recording · quiet opportunities');
