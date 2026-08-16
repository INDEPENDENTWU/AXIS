import {execFileSync} from 'node:child_process';
import fs from 'node:fs';

const STEPS=[
  'prepare-legacy-runtime.mjs',
  'prepare-product-convergence.mjs',
  'prepare-first-paint-shell.mjs',
  'prepare-88-convergence.mjs',
  'prepare-88-catalog-convergence.mjs',
  'prepare-88-watermark-final.mjs',
  'prepare-88-watermark-state-sync.mjs',
  'prepare-88-watermark-location-owner.mjs',
  'build-hardened.mjs',
  'postbuild-kernel-priority.mjs',
  'postbuild-features-hardened.mjs',
  'postbuild-8712-completion.mjs',
  'postbuild-88-canonical.mjs',
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
  if(manifest.featureKernel?.embedded!==true||manifest.completionKernel?.embedded!==true)fail('8.8 feature/completion are not embedded');
  if(manifest.gates?.catalogCategorySingleOwner!==true)fail('catalog category single-owner gate missing');
  if(manifest.gates?.watermarkFourSwitchContract!==true)fail('watermark four-switch gate missing');
  if(manifest.gates?.precisePlaceResolver!==true)fail('precise place resolver gate missing');
  if(manifest.gates?.noRawCoordinatePresentation!==true)fail('raw-coordinate presentation gate missing');
  if(manifest.gates?.watermarkSingleLocateOwner!==true)fail('watermark single-locate-owner gate missing');
  if(manifest.gates?.watermarkPreferenceSingleWriter!==true)fail('watermark preference single-writer gate missing');
}
console.log(`[AXIS release contract] ${contract.publicVersion} · base ${contract.stableBaseVersion} · ${contract.architecture} · manifest verified`);
console.log(`[AXIS release] complete · ${STEPS.length} deterministic steps`);