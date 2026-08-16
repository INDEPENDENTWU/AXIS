import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10 contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),runtime=read('axis-core.js'),info=JSON.parse(read('axis-build.json'));
if(String(contract.publicVersion)!=='8.10')fail(`unexpected public version ${contract.publicVersion}`);
if(info.version!=='8.10'||info.baseVersion!=='8.10')fail(`release identity mismatch ${info.version}/${info.baseVersion}`);
for(const [needle,label] of [
 ["patch:'8.10',owner:'passive-rest-reader'",'8.10 Rest Speak marker missing'],
 ['richEnglish:456','456 English unit marker missing'],
 ['totalUnits:492','492 total unit marker missing'],
 ['autonomousCadence:true','autonomous cadence marker missing'],
 ['function axis810SelectPhrase(','autonomous selector missing'],
 ['function axis810CanSurface(','time-aware cadence missing'],
 ['function axis810DailyTarget(','daily target engine missing'],
 ['function axis810SessionCap(','session budget missing'],
 ['function axis810Review(','due review scheduler missing'],
 ['function axis810OpenRecap(','today learning recap missing'],
 ['data-v810-key="track"','track controls missing'],
 ['data-v810-key="cadence"','cadence controls missing'],
 ['data-v810-key="level"','level controls missing'],
 ['data-v810-key="dailyTarget"','daily target controls missing'],
 ["p.cadence==='manual'",'manual cadence missing'],
 ["p.cadence==='long'&&rest<45000",'long-rest cadence threshold missing']
])if(!runtime.includes(needle))fail(label);
if(/setInterval\s*\(\s*axis810|new\s+MutationObserver\s*\(\s*axis810|new\s+ResizeObserver\s*\(\s*axis810/.test(runtime))fail('8.10 learning gained timer/observer ownership');
if(/if\(speak\)\{axis89SpeakVoice\(speak\)/.test(runtime))fail('phrase tap autoplays speech');
for(const name of ['axis810SetLearningPref','axis810Review','axis810RecordExposure']){
 const m=runtime.match(new RegExp(`function ${name}\\([^\\n]*\\)\\{[\\s\\S]*?\\nfunction `));
 if(m&&/writeMeta\(|writeCore\(/.test(m[0]))fail(`${name} writes training metadata`)
}
if(!runtime.includes("owner:'v87-direct-884'"))fail('canonical active-control owner changed');
if(!runtime.includes("id='v891SpeakPanel'"))fail('micro-learning panel lost');

info.gates=info.gates||{};
Object.assign(info.gates,{
 restSpeakExpanded456:true,
 restSpeakAutonomousCadence:true,
 restSpeakUserCadenceControl:true,
 restSpeakTrackControl:true,
 restSpeakAdaptiveLevel:true,
 restSpeakDailyBudget:true,
 restSpeakSessionBudget:true,
 restSpeakDueReview:true,
 restSpeakLearningRecap:true,
 restSpeakTrainingMetadataIsolated:true,
 restSpeakNoAutoplay810:true
});
info.axis810={
 learning:{englishUnits:456,totalUnits:492,tracks:['gym','daily','social','travel','work','service','ielts','native'],modes:['auto','light','standard','deep'],cadence:['auto','every','long','manual'],levels:['adaptive','foundation','progress','advanced'],dailyTargets:['auto',6,12,20],review:'strength-based-due-date',history:'isolated-local-accessory-store',recap:'today-only-user-invoked',autoplay:false},
 ownership:{trainingState:false,timer:false,geometry:false,sound:false,storage:'axis_v89_speak'}
};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.10 contract] PASS · 456 English · autonomous cadence · user control · due review · recap · training isolation');
