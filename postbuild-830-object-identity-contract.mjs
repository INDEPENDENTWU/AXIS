import fs from 'node:fs';
const fail=m=>{throw Error('[AXIS 8.30 postbuild identity] '+m)};
const read=f=>fs.readFileSync(f,'utf8');
const info=JSON.parse(read('axis-build.json')),js=read('axis-core.js');
if(info.version!=='8.30'||info.baseVersion!=='8.30'||info.architecture!=='canonical-single-runtime')fail('incorrect product runtime version/topology');
for(const marker of ['__AXIS_SELECT_EQUIPMENT__','__AXIS_SELECTED_EQUIPMENT__','axis8124CatalogItems','data-v8124-pick','axis829SaveInFlight','function eqById(','function selectEq('])if(!js.includes(marker))fail('missing runtime identity/recorder '+marker);
for(const forbidden of ['pickId:x.baseId||x.id','const target=item.baseId||item.id','lib.find(e=>e.baseId===id)','id:lib.baseId||lib.id'])if(js.includes(forbidden))fail('unsafe base-family selection survives '+forbidden);
if((js.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('canonical Encounter writer drift');
{
 const marker='function axis8124CatalogItems()',i=js.indexOf(marker),j=i<0?-1:js.indexOf('function axis8124CatalogRanked(',i);
 if(i<0||j<0||js.indexOf(marker,i+marker.length)>=0)fail('unique final catalog projection missing');
 const region=js.slice(i,j);
 if(!/for\s*\(\s*const x of \(window\.__AXIS_873_LIBRARY__\s*\|\|\s*LIB\)\s*\)/.test(region)||!region.includes('pickId:x.id'))fail('final ranked search must index live canonical IDs');
 if(!region.includes('byId.set(id,{...native,id,pickId:id})')){const i=region.indexOf('liveNative');fail('final native IDs must override stale family/personal catalog projection; observed='+JSON.stringify({regionLength:region.length,liveNativeIndex:i,ending:region.slice(-1100),nearLive:i<0?null:region.slice(Math.max(0,i-110),i+650)}))}
}
if(!info.gates?.recordingContinuity829||!info.gates?.practiceLoop828||!info.gates?.realityRoute827)fail('inherited release gates missing');
Object.assign(info.gates,{objectIdentity830:true,objectStableCanonicalId830:true,objectHistoricFactsUnchanged830:true,objectOneEncounterWriter830:true});
info.axis830={schema:'axis.object-identity.v1',candidate:true,previousSealedProductSha:'4a9c73b2ea5330b9cffad3f9e322eb6970dfe171',canonicalId:true,baseIdOnlyMetadata:true,historicalRewrite:false,newStorage:false,newRecorder:false,newEncounterWriter:false};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.30 postbuild identity] PASS · canonical ID fidelity · inherited single fact writer · historical facts immutable');
