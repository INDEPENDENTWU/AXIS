import fs from 'node:fs';
import {buildAxis811Atlas,auditAxis811Atlas} from '../lib/learning-atlas-811.mjs';

const fail=m=>{throw new Error(`[AXIS 8.11 experience smoke] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const atlas=buildAxis811Atlas(),audit=auditAxis811Atlas(atlas);
if(audit.count!==5280||audit.duplicateTargets!==0||audit.missing.length||audit.unresolved.length||!audit.fourTurn)fail('atlas audit failed');
for(const level of ['A1','A2','B1','B2','C1','C1+'])if(audit.levelCounts[level]!==880)fail(`bad ${level} count`);
const runtime=read('axis-core.js'),index=read('index.html'),info=JSON.parse(read('axis-build.json')),build=read('build-release.mjs');
for(const step of ['prepare-811-learning-atlas.mjs','prepare-811-learning-settings.mjs','prepare-811-trends.mjs','postbuild-811-contract.mjs'])if(!build.includes(step))fail(`build missing ${step}`);
for(const gate of ['learningAtlas811','learningAtlasUnique811','learningDialogueFourTurn811','learningConnectedSpeech811','learningSpelling811','learningSettingsConverged811','trendsStateField811','trendsGoalAware811','trendsEvidenceOnly811','trendsLocalFirst811'])if(info.gates?.[gate]!==true)fail(`manifest gate missing ${gate}`);
if(info.axis811Candidate?.learning?.atlasEnglish!==5280||info.axis811Candidate?.learning?.totalEnglish!==5736)fail('manifest learning counts wrong');
if(info.axis811Candidate?.trends?.fitnessScore!==false||info.axis811Candidate?.trends?.evidenceOnly!==true)fail('trend evidence contract wrong');
for(const id of ['v811StateField','v811Trajectory','v811Evidence','v811Needle'])if(!index.includes(`id="${id}"`))fail(`built index missing ${id}`);
for(const needle of ["legacyPrefsPreserved:true","networkRequired:false","dialogue:'unit-specific-four-turn'"])if(!runtime.includes(needle))fail(`runtime missing ${needle}`);
if(/setInterval\s*\([^)]*axis811|new\s+MutationObserver\s*\([^)]*axis811|new\s+ResizeObserver\s*\([^)]*axis811/.test(runtime))fail('persistent owner introduced');
console.log(`[AXIS 8.11 experience smoke] PASS · ${audit.count} atlas units · ${audit.duplicateTargets} duplicate targets · settings/trends contract green`);
