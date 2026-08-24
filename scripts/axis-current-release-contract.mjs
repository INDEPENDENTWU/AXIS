import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS current release contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const info=JSON.parse(read('axis-build.json'));
const runtime=read('axis-core.js');
const html=read('index.html');
const css=read('axis-style.css');

if(info.version!=='8.18'||info.baseVersion!=='8.18')fail(`release identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');

const gates=[
  'evolutionFoundation8131','trendsMetaActivity8131',
  'evolutionObjects814','evolutionObjectFirstLatest814','evolutionObjectEncounterCount814','evolutionObjectFactualDelta814','evolutionObjectMediaEvidence814','evolutionObjectReadOnly814','evolutionObjectNoNetwork814','evolutionObjectInPlace814',
  'mediaEvidenceLayer815','mediaEvidenceEncounterBinding815','mediaEvidenceIndexedDbReadOnly815','mediaEvidencePhoto815','mediaEvidenceShortVideo815','mediaEvidenceNoAutoplay815','mediaEvidenceInPlaceViewer815','mediaEvidenceEndpointCompare815','mediaEvidenceNoCreatorWorkflow815','mediaEvidenceUniversalBundle815',
  'coldStartHomeSemanticSeal8151','coldStartCanonicalHomeCommit8151','watermarkSinglePhotoCompositor8151','watermarkLegacyPhotoPainterRetired8151','watermarkCenterBrandRetired8151','watermarkCurrentCardOnly8151','mediaEvidenceStableSection8151','mediaEvidenceRetainUntilReady8151','mediaEvidenceWarmBeforeCommit8151','mediaEvidenceNoOpacityBlink8151',
  'captureField816','captureUnifiedEntry816','captureMultiPhoto816','capturePhotoCap816','captureCoverReorder816','captureVideo816','captureVideoLimit816','captureVideoSingleRecorder816','captureExistingMediaStore816','captureNoNewStorage816','captureQuickRecordUnified816','comparativeEvidence816','comparativeEvidenceArbitraryPair816','comparativeEvidencePresets816','comparativeEvidenceRailSelection816','comparativeEvidenceStableSwap816','comparativeEvidenceFactualOnly816','replayDeferred816',
  'quickEvidenceSingleEntry817','capturePreferencesCurrent817','captureEntryDefaultsPhoto817','explicitVideoRetained817','comparativeTwoSlot817','comparativeDirectTimeline817','comparativeStableControls817','comparativeNoFlash817','archiveMonthCollection817','archiveNoNewStorage817','interactionConvergence817',
  'captureCleanSourceSidecar8171','mediaSourceBridge8171','watermarkSourceFirst8171','evidenceSourceFirst8171','mediaCanonicalFallback8171','mediaEventPointersUnchanged8171','mediaNoNewPersistence8171',
  'objectMetricSchema818','eventMetricSnapshot818','pwaRouteTruth818','capturePreferenceModel818','activeFocusLayer818','mediaBatchExport818','eventDelete818','continuousCameraCompositor818','watermarkCenterBrand818','evolutionObjectShelf818','noNewPersistence818'
];
for(const gate of gates)if(info.gates?.[gate]!==true)fail(`missing gate ${gate}`);

if(info.axis814?.trends?.topLevelOwner!=='v8131-evolution-field'||info.axis814?.trends?.objectOwner!=='v814-evolution-objects'||info.axis814?.ownership?.persistence!==false||info.axis814?.ownership?.network!==false||info.axis814?.ownership?.ai!==false)fail('8.14 ownership drift');
if(info.axis815?.viewer?.owner!=='v815-media-evidence'||info.axis815?.evidence?.binding!=='encounter-first'||info.axis815?.ownership?.mediaWrites!==false||info.axis815?.ownership?.network!==false||info.axis815?.ownership?.ai!==false||info.axis815?.ownership?.replay!==false)fail('8.15 ownership drift');
if(info.axis816?.capture?.photo?.maxPerEncounter!==12||info.axis816?.capture?.video?.maxSeconds!==60||info.axis816?.capture?.video?.maxPerEncounter!==1)fail('8.16 capture bounds drift');
if(info.axis816?.capture?.persistenceOwner!=='app.js'||info.axis816?.capture?.mediaStore!=='axis_v42_media'||info.axis816?.capture?.newStorage!==false||info.axis816?.capture?.newSchema!==false)fail('8.16 capture ownership drift');
if(info.axis816?.evidence?.mode!=='arbitrary-two-point'||info.axis816?.evidence?.stableInPlace!==true||info.axis816?.ownership?.replay!==false)fail('8.16 evidence ownership drift');
if(info.axis817?.capture?.quickSupplement!=='single-entry'||info.axis817?.capture?.defaultMode!=='photo')fail('8.17 Capture interaction drift');
if(info.axis817?.evidence?.compareModel!=='two-named-slots'||info.axis817?.evidence?.defaultActiveSlot!=='right'||info.axis817?.evidence?.warmBeforeCommit!==true)fail('8.17 comparison drift');
if(info.axis817?.archive?.model!=='time-first-month-groups'||info.axis817?.archive?.newStorage!==false)fail('8.17 archive drift');
if(info.axis8171?.sourceMedia?.sourcePolicy!=='clean-sidecar-v1'||info.axis8171?.sourceMedia?.sourceStore!=='axis_v42_media'||info.axis8171?.sourceMedia?.canonicalPointersUnchanged!==true)fail('8.17.1 source-media drift');

for(const marker of [
  '__AXIS_814_EVOLUTION_OBJECTS__','__AXIS_EVOLUTION_OBJECTS__',
  '__AXIS_815_MEDIA_EVIDENCE__','__AXIS_MEDIA_EVIDENCE__','__AXIS_MEDIA_READ__',
  '__AXIS_8151_REGRESSION_SEAL__','__AXIS_8151_MEDIA_SWAP__',
  "__AXIS_816_CAPTURE_FIELD__={version:'8.16'","__AXIS_816_COMPARATIVE_EVIDENCE__={version:'8.16'",
  "__AXIS_817_INTERACTION__={version:'8.17'",'v817QuickEvidence',
  '__AXIS_MEDIA_SOURCE__','__AXIS_8171_SOURCE_MEDIA__','__AXIS_8171_WATERMARK_SOURCE__','__AXIS_8171_EVIDENCE_SOURCE__',
  '__AXIS_OBJECT_TRUTH__','__AXIS_818_HARDENING__','__AXIS_818_MEDIA__','__AXIS_818_FOCUS__','__AXIS_EVOLUTION_LIBRARY__','axis818StartRecordPump','videoBitsPerSecond:6000000','CAPTURE816_VIDEO_MAX_MS=60000'
])if(!runtime.includes(marker))fail(`compiled invariant missing ${marker}`);

if(!css.includes('data-axis-home-ready')||!runtime.includes('axisHomeReady'))fail('cold-start semantic seal missing');
if(runtime.includes("fillText('A X I S'")||runtime.includes("fillRect(W*.12,H*.555,W*.76,Math.max(2,Math.round(W*.0025)))"))fail('retired watermark compositor fragment survived');
if(!runtime.includes("fillText('AXIS / RECORD'")||!runtime.includes("photoWatermarkOwner:'v8710-watermark'")||!runtime.includes("__AXIS_818_WATERMARK__")||!runtime.includes("centerBrand:true"))fail('watermark ownership/supersession drift');
if(!runtime.includes('retainPreviousUntilReady:true')||!runtime.includes('warmBeforeCommit:true'))fail('stable Evidence swap drift');
if((html.match(/data-axis-capture-surface="v816-capture-field"/g)||[]).length!==2)fail('Capture Field DOM ownership drift');
if(!html.includes('扫描取样')||!html.includes('资料与收纳'))fail('current Settings copy missing');

console.log(`[AXIS current release contract] PASS · ${info.version} · 8.14→8.18 semantic/ownership inheritance unified · canonical runtime unchanged`);
