import fs from 'node:fs';

const fail=m=>{throw new Error(`AXIS 8.8 watermark gate: ${m}`)};
for(const f of ['axis-core.js','axis-build.json','v8710-watermark.js'])if(!fs.existsSync(f))fail(`missing ${f}`);
const runtime=fs.readFileSync('axis-core.js','utf8');
const finalWatermark=fs.readFileSync('v8710-watermark.js','utf8');
const manifest=JSON.parse(fs.readFileSync('axis-build.json','utf8'));

for(const marker of [
  'id="v85WmTime"',
  'p.v85WmTime!==false',
  'nominatim.openstreetmap.org/reverse',
  'refreshPlace(true)',
  "set('#v8710WmTime',p.time,time)",
  "set('#v8710WmLoc',p.location,p.place)",
  '#v876Coord{display:none!important}'
])if(!runtime.includes(marker))fail(`runtime missing ${marker}`);

if(runtime.includes("if(e.target.closest('#v876Locate')){await locate();return}"))fail('legacy v876 coarse locate click owner survived');
if(!/location:!!p\.v85WmLocation,time:p\.v85WmTime!==false/.test(finalWatermark))fail('final watermark location default does not match visible switch truth');
if(!/if\(p\.name\)rows\.push/.test(finalWatermark))fail('final photo watermark does not conditionally honor name');
if(!/if\(p\.data&&data\)rows\.push/.test(finalWatermark))fail('final photo watermark does not conditionally honor data');
if(!/if\(p\.location&&p\.place\)rows\.push/.test(finalWatermark))fail('final photo watermark does not conditionally honor place');
if(!/if\(p\.time\)rows\.push/.test(finalWatermark))fail('final photo watermark does not conditionally honor time');
if(/toFixed\(6\).*±|LAT |LON |纬度 .*经度/.test(finalWatermark))fail('raw coordinates remain in final visible watermark owner');

manifest.gates={...(manifest.gates||{}),watermarkFourSwitchContract:true,precisePlaceResolver:true,noRawCoordinatePresentation:true,watermarkSingleLocateOwner:true};
manifest.canonical={...(manifest.canonical||{}),watermarkSwitches:['name','data','location','time'],placeResolver:'OpenStreetMap Nominatim -> BigDataCloud fallback',locateOwner:'v8710 canonical precise resolver',rawCoordinatePresentation:false};
fs.writeFileSync('axis-build.json',JSON.stringify(manifest,null,2));
console.log('[AXIS 8.8 watermark gate] PASS · four switches · one precise locate owner · no raw coordinate presentation');