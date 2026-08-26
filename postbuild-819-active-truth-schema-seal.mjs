import fs from 'node:fs';

const FILE='axis-core.js',MANIFEST='axis-build.json';
const fail=m=>{throw new Error(`[AXIS 8.19 Active Truth schema seal] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');

const marker='function startActivity(';
const starts=[];for(let i=src.indexOf(marker);i>=0;i=src.indexOf(marker,i+marker.length))starts.push(i);
if(starts.length!==1)fail(`startActivity owner expected once, found ${starts.length}`);
const start=starts[0],brace=src.indexOf('{',start);
if(brace<0)fail('startActivity body boundary missing');

const helper=`function axis819ClassicActivityEncounter(x){let e=x&&typeof x==='object'?(x.e&&typeof x.e==='object'?x.e:x):null;if(!e){try{const c=readCore(),all=[...(c.active?.events||[]),...(c.sessions||[]).flatMap(s=>s?.events||[])];e=all.find(v=>v?.id===x)||null}catch{}}const schema=Array.isArray(e?.metricSchemaSnapshot)?e.metricSchemaSnapshot:null;if(schema===null)return true;const keys=new Set(schema.map(m=>m?.key||m?.id).filter(Boolean));return keys.has('weight')&&keys.has('reps')}\n`;
if(src.includes('function axis819ClassicActivityEncounter('))fail('Active Truth schema helper duplicated');
src=src.slice(0,start)+helper+src.slice(start);
const shifted=start+helper.length,shiftedBrace=src.indexOf('{',shifted);
const guard=`const axis819ActivityTarget=arguments[0];if(!axis819ClassicActivityEncounter(axis819ActivityTarget))return;`;
src=src.slice(0,shiftedBrace+1)+guard+src.slice(shiftedBrace+1);

if((src.match(/function axis819ClassicActivityEncounter\(/g)||[]).length!==1)fail('schema helper must exist once');
if((src.match(/const axis819ActivityTarget=arguments\[0\]/g)||[]).length!==1)fail('startActivity schema guard must exist once');
const guardAt=src.indexOf('const axis819ActivityTarget=arguments[0]'),pauseAt=src.indexOf('pauseOthers',guardAt);
if(guardAt<0||pauseAt<0||guardAt>pauseAt)fail('schema guard must run before Active Truth pause/write activity');
try{new Function(src)}catch(e){fail(`canonical runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);

if(fs.existsSync(MANIFEST)){
 const info=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
 info.gates=info.gates||{};
 info.gates.activeTruthEncounterSchemaAuthority819=true;
 info.axis819=info.axis819||{};
 info.axis819.recording=Object.assign({},info.axis819.recording,{activeTruthUsesImmutableEncounterSchema:true,activeTruthClassicOnly:true,explicitEmptySchema:true});
 fs.writeFileSync(MANIFEST,JSON.stringify(info,null,2)+'\n');
}
console.log('[AXIS 8.19 Active Truth schema seal] PASS · Active Truth activity metadata is restricted to classic weight+reps Encounter schemas · explicit empty snapshots block false Active · legacy no-snapshot behavior preserved');
