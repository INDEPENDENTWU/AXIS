import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.15.1 regression contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),info=JSON.parse(read('axis-build.json')),runtime=read('axis-core.js'),css=read('axis-style.css'),app=read('app.js'),wm=read('v8710-watermark.js'),media=read('v815-media-evidence.js');
if(contract.publicVersion!=='8.15.1'||contract.stableBaseVersion!=='8.15.1')fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);
if(info.version!=='8.15.1'||info.baseVersion!=='8.15.1')fail(`manifest identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const gate of ['evolutionFoundation8131','evolutionObjects814','mediaEvidenceLayer815','mediaEvidenceEncounterBinding815','mediaEvidenceNoAutoplay815'])if(info.gates?.[gate]!==true)fail(`inherited gate missing ${gate}`);

if(!css.includes('html:not([data-axis-home-ready="1"]) #axisNowHero'))fail('axisNowHero first-paint semantic gate missing');
if(!app.includes("document.documentElement.dataset.axisHomeReady='1'"))fail('canonical Home render does not commit home-ready');
if(!runtime.includes("document.documentElement.dataset.axisHomeReady='1'"))fail('compiled Home-ready marker missing');
if(!app.includes('async function finalizeFrame(frame,e,eq){return frame.blob}'))fail('legacy app photo compositor still owns frame finalization');
if(!runtime.includes('async function finalizeFrame(frame,e,eq){return frame.blob}'))fail('compiled legacy photo compositor retirement missing');
const hasCenter=s=>s.includes("fillText('A X I S'")||s.includes("fillText('AXIS',W/2,H*.48)");
const centerSuperseded=contract.publicVersion==='8.18';
if(!centerSuperseded&&(hasCenter(wm)||hasCenter(runtime)))fail('historical center AXIS brand survived');
if(centerSuperseded){for(const needle of ['__AXIS_818_WATERMARK__',"owner:'v8710-watermark'",'centerBrand:true'])if(!runtime.includes(needle))fail(`8.18 center-brand supersession missing ${needle}`)}
if(wm.includes("fillRect(W*.12,H*.555,W*.76,Math.max(2,Math.round(W*.0025)))")||runtime.includes("fillRect(W*.12,H*.555,W*.76,Math.max(2,Math.round(W*.0025)))"))fail('historical center divider survived');
if(!wm.includes("fillText('AXIS / RECORD'")||!runtime.includes("fillText('AXIS / RECORD'"))fail('current factual watermark card missing');
for(const needle of ['__AXIS_8151_REGRESSION_SEAL__',"photoWatermarkOwner:'v8710-watermark'",'legacyPhotoCompositor:false','centerBrand:false','currentCard:true'])if(!runtime.includes(needle))fail(`compiled hotfix marker missing ${needle}`);

for(const needle of ['__AXIS_8151_MEDIA_SWAP__','stableSection:true','retainPreviousUntilReady:true','warmBeforeCommit:true','loadingOpacityBlink:false','reuse=!!(existing&&priorKey===key)','revokeExcept([media.url])'])if(!media.includes(needle)||!runtime.includes(needle))fail(`stable Media Evidence swap missing ${needle}`);
if(media.includes("$('#v815Evidence',root)?.remove();if(!bundle")||media.includes('.v815Evidence[data-loading="1"] .v815Stage{opacity:.72}'))fail('unstable Media Evidence repaint survived');

info.gates=info.gates||{};Object.assign(info.gates,{coldStartHomeSemanticSeal8151:true,coldStartCanonicalHomeCommit8151:true,watermarkSinglePhotoCompositor8151:true,watermarkLegacyPhotoPainterRetired8151:true,watermarkCenterBrandRetired8151:true,watermarkCurrentCardOnly8151:true,mediaEvidenceStableSection8151:true,mediaEvidenceRetainUntilReady8151:true,mediaEvidenceWarmBeforeCommit8151:true,mediaEvidenceNoOpacityBlink8151:true});
info.axis8151={release:true,scope:'coldstart-watermark-evidence-regression-seal',home:{staticHero:'geometry-only-before-canonical-render',readyOwner:'app.js renderHomeState',historicalSemanticFlash:false},watermark:{photoOwner:'v8710-watermark',legacyAppPhotoCompositor:false,centerBrand:false,currentCard:true,videoOwner:'inherited-unchanged',presentationMayBeSupersededByLaterRelease:true},mediaEvidence:{owner:'v815-media-evidence',swap:'stable-in-place',sectionRemount:false,retainPreviousUntilReady:true,warmBeforeCommit:true,loadingOpacityBlink:false},ownership:{newPersistence:false,newNetwork:false,trainingState:false,evolution:false,replay:false}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.15.1 regression contract] PASS · canonical Home first paint · single saved-photo watermark owner · later presentation supersession explicit · stable in-place Media Evidence swaps');
await import('./postbuild-816-contract.mjs');
