import {execFileSync} from 'node:child_process';
import fs from 'node:fs';

const STEPS=[
  'prepare-8102-release-compat.mjs',
  'prepare-8103-release-compat.mjs',
  'prepare-811-release-compat.mjs',
  'prepare-882-version.mjs',
  'prepare-legacy-runtime.mjs',
  'prepare-product-convergence.mjs',
  'prepare-first-paint-shell.mjs',
  'prepare-88-convergence.mjs',
  'prepare-88-catalog-convergence.mjs',
  'prepare-88-watermark-final.mjs',
  'prepare-88-watermark-state-sync.mjs',
  'prepare-88-watermark-location-owner.mjs',
  'prepare-881-convergence.mjs',
  'prepare-882-convergence-driver.mjs',
  'prepare-882-home-transition-refine.mjs',
  'prepare-882-home-completion-refine.mjs',
  'prepare-882-quick-camera-owner.mjs',
  'prepare-882-local-vision.mjs',
  'prepare-882-final-owners.mjs',
  'prepare-882-lifecycle.mjs',
  'prepare-882-media-store.mjs',
  'prepare-883-convergence.mjs',
  'prepare-883-inherited-brand-fix.mjs',
  'prepare-883-watermark-contract-bridge.mjs',
  'prepare-884-field-fix.mjs',
  'prepare-884-runtime-followup.mjs',
  'prepare-89-detail.mjs',
  'prepare-89-vision.mjs',
  'prepare-89-catalog.mjs',
  'prepare-89-rest-speak.mjs',
  'prepare-89-rest-speak-fix.mjs',
  'prepare-89-rest-speak-safety.mjs',
  'prepare-891-detail.mjs',
  'prepare-891-speak-curriculum.mjs',
  'prepare-891-speak-panel.mjs',
  'prepare-891-speak-ui.mjs',
  'prepare-810-learning-curriculum.mjs',
  'prepare-810-learning-engine.mjs',
  'prepare-810-learning-budget-fix.mjs',
  'prepare-810-learning-settings.mjs',
  'prepare-810-learning-entry-fix.mjs',
  'prepare-8101-home-timer.mjs',
  'prepare-8101-learning-immersion.mjs',
  'prepare-8102-interaction-stability.mjs',
  'prepare-8102-standalone-polish.mjs',
  'prepare-8103-home-sound.mjs',
  'prepare-8103-learning-voice.mjs',
  'prepare-8103-final-compat.mjs',
  'prepare-811-learning-atlas.mjs',
  'prepare-811-learning-settings.mjs',
  'prepare-811-trends.mjs',
  'prepare-811-legacy-compat.mjs',
  'build-hardened.mjs',
  'postbuild-kernel-priority.mjs',
  'postbuild-features-hardened.mjs',
  'postbuild-8712-completion.mjs',
  'postbuild-88-canonical.mjs',
  'postbuild-891-event-target-safety.mjs',
  'postbuild-881-inherited-contract.mjs',
  'postbuild-882-contract.mjs',
  'postbuild-89-contract.mjs',
  'postbuild-891-contract.mjs',
  'postbuild-810-contract.mjs',
  'postbuild-8101-contract.mjs',
  'postbuild-8102-contract.mjs',
  'postbuild-8103-contract.mjs',
  'postbuild-811-contract.mjs',
  'verify-88-watermark.mjs'
];

for(const step of STEPS){
  console.log(`[AXIS release] ${step}`);
  execFileSync(process.execPath,[step],{stdio:'inherit'});
}

const contract=JSON.parse(fs.readFileSync('release-contract.json','utf8'));
const manifest=JSON.parse(fs.readFileSync(contract.buildManifest||'axis-build.json','utf8'));
const fail=m=>{throw new Error(`[AXIS release contract] ${m}`)};
if(manifest.version!==contract.publicVersion)fail(`public version mismatch · build ${manifest.version} · contract ${contract.publicVersion}`);
if(manifest.baseVersion!==contract.stableBaseVersion)fail(`stable base mismatch · build ${manifest.baseVersion} · contract ${contract.stableBaseVersion}`);
if(manifest.architecture!==contract.architecture)fail(`architecture mismatch · ${manifest.architecture}`);
if(manifest.featureKernel?.feature!==contract.featureKernel)fail(`feature kernel mismatch · ${manifest.featureKernel?.feature}`);
if(manifest.completionKernel?.feature!==contract.completionKernel)fail(`completion kernel mismatch · ${manifest.completionKernel?.feature}`);
if(!Array.isArray(manifest.assets?.chunks)||manifest.assets.chunks.length!==contract.stableChunkCount)fail(`stable chunk count mismatch · ${manifest.assets?.chunks?.length}`);
if(contract.architecture==='canonical-single-runtime'){
  if(manifest.gates?.canonicalSingleRuntime!==true)fail('canonical single-runtime gate missing');
  if(manifest.requests?.dynamicJavascript!==0)fail(`dynamic runtime requests remain · ${manifest.requests?.dynamicJavascript}`);
  if(manifest.featureKernel?.embedded!==true||manifest.completionKernel?.embedded!==true)fail('feature/completion kernels are not embedded');
  if(manifest.gates?.catalogCategorySingleOwner!==true)fail('catalog category single-owner gate missing');
  if(manifest.gates?.watermarkFourSwitchContract!==true)fail('watermark four-switch gate missing');
  if(manifest.gates?.precisePlaceResolver!==true)fail('precise place resolver gate missing');
  if(manifest.gates?.noRawCoordinatePresentation!==true)fail('raw-coordinate presentation gate missing');
  if(manifest.gates?.watermarkSingleLocateOwner!==true)fail('watermark single-locate-owner gate missing');
  if(manifest.gates?.watermarkPreferenceSingleWriter!==true)fail('watermark preference single-writer gate missing');
  for(const gate of ['groupPlanUnitlessControls','groupPlanExpandedPresets','activeItemCountdown','activeItemCountdownTone','activeItemLongPressSuppressesTone','watermarkCenterBrand','watermarkBrandOpacitySingleTarget'])if(manifest.gates?.[gate]!==true)fail(`8.8.1 gate missing · ${gate}`);
  for(const gate of ['homeStateSingleOwner','homeStateAdaptiveRest','localVisualMemory','quickCustomEquipment','quickMediaAttachment','activeCardGeometryStable','countdownOnlyAutomaticSound','expandedExerciseLibrary','waistAnatomyRegion','durableReleaseLog','mediaStoreWebKitSafe'])if(manifest.gates?.[gate]!==true)fail(`8.8.2 gate missing · ${gate}`);
  for(const gate of ['detailAtomicHandoff','localVisionV2','frontierVisionCatalogContract','frontierVisionProviderRouter','restSpeakPassive','restSpeakNoGeometryOwner','expandedSearchVocabulary'])if(manifest.gates?.[gate]!==true)fail(`8.9 gate missing · ${gate}`);
  for(const gate of ['restSpeakInlineComplete','restSpeakMicroLearning','restSpeakRichEnglish','restSpeakNoAutoplay','restSpeakSpacedExposure','detailStableReveal','detailStableInPlaceSwap','detailNoBlurFlash'])if(manifest.gates?.[gate]!==true)fail(`8.9.1 gate missing · ${gate}`);
  for(const gate of ['restSpeakExpanded456','restSpeakAutonomousCadence','restSpeakUserCadenceControl','restSpeakTrackControl','restSpeakAdaptiveLevel','restSpeakDailyBudget','restSpeakSessionBudget','restSpeakDueReview','restSpeakLearningRecap','restSpeakTrainingMetadataIsolated','restSpeakNoAutoplay810'])if(manifest.gates?.[gate]!==true)fail(`8.10 gate missing · ${gate}`);
  for(const gate of ['settingsLearningNativeRow','homeTimerStablePaint','restSpeakDialoguePractice','restSpeakEchoPractice','restSpeakShadowPractice','restSpeakEphemeralRecording','restSpeakOpportunityRail','restSpeakOpportunityControl','restSpeakNoAutoplay8101','restSpeakNoTrainingOwnership8101'])if(manifest.gates?.[gate]!==true)fail(`8.10.1 gate missing · ${gate}`);
  for(const gate of ['detailSingleCompositionSwap','detailNoLegacyHeightHold','restSpeakOpportunityPanelPersistent','restSpeakOpportunitySingleEventOwner','restSpeakStandaloneLearning','restSpeakStandaloneControl','restSpeakStandalonePanelPersistent','restSpeakStandaloneNoTrainingOwnership','restSpeakNoAutoplay8102'])if(manifest.gates?.[gate]!==true)fail(`8.10.2 gate missing · ${gate}`);
  for(const gate of ['homeIdleNoFalseFinish','homeCompletedCopyConcise','homeCompletedStartEndFacts','activeAdjustCornerAnchor','totalWorkoutDurationReminder','totalWorkoutDurationSinglePreference','restSpeakDialogueFourTurn','restSpeakEchoShadowDistinct','restSpeakShadowAutoRecordAB','restSpeakFourLanguageVoiceRouting','restSpeakBestAvailableLocalVoice','practiceMicrophoneSameOrigin','releaseFreshnessEventDriven'])if(manifest.gates?.[gate]!==true)fail(`8.10.3 gate missing · ${gate}`);
  for(const gate of ['learningAtlas811','learningAtlasUnique811','learningDialogueFourTurn811','learningDialogueSixTurn811','learningConnectedSpeech811','learningSpelling811','learningSettingsConverged811','learningLegacyDiagnosticsPreserved811','learningJapanese132811','learningKorean132811','learningChinese132811','learningMultilingualSixTurn811','learningMultilingualNoLegacyExactOverlap811','trendsStateField811','trendsGoalAware811','trendsEvidenceOnly811','trendsLocalFirst811','trendsOneShotMotion811','serviceSettingsConverged811','serviceSettingsUserInvokedNetwork811','serviceSettingsNoTrainingOwner811'])if(manifest.gates?.[gate]!==true)fail(`8.11 gate missing · ${gate}`);
}
console.log(`[AXIS release contract] ${contract.publicVersion} · base ${contract.stableBaseVersion} · ${contract.architecture} · manifest verified`);
console.log(`[AXIS release] complete · ${STEPS.length} deterministic steps`);