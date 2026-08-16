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
  "set('#v8710WmTime',p.time,time)",
  "set('#v8710WmLoc',p.location,p.place)",
  '#v876Coord{display:none!important}'
])if(!runtime.includes(marker))fail(`runtime missing ${marker}`);

if(!/if\(p\.name\)rows\.push/.test(finalWatermark))fail('final photo watermark does not conditionally honor name');
if(!/if\(p\.data&&data\)rows\.push/.test(finalWatermark))fail('final photo watermark does not conditionally honor data');
if(!/if\(p\.location&&p\.place\)rows\.push/.test(finalWatermark))fail('final photo watermark does not conditionally honor place');
if(!/if\(p\.time\)rows\.push/.test(finalWatermark))fail('final photo watermark does not conditionally honor time');
if(/toFixed\(6\).*±|LAT |LON |纬度 .*经度/.test(finalWatermark))fail('raw coordinates remain in final visible watermark owner');

manifest.gates={...(manifest.gates||{}),watermarkFourSwitchContract:true,precisePlaceResolver:true,noRawCoordinatePresentation:true};
manifest.canonical={...(manifest.canonical||{}),watermarkSwitches:['name','data','location','time'],placeResolver:'OpenStreetMap Nominatim -> BigDataCloud fallback',rawCoordinatePresentation:false};
fs.writeFileSync('axis-build.json',JSON.stringify(manifest,null,2));
console.log('[AXIS 8.8 watermark gate] PASS · four switches · precise place · no raw coordinate presentation');