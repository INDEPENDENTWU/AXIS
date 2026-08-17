import fs from 'node:fs';
import {auditAxis812,buildAxis812NativeStudio} from '../lib/learning-studio-812.mjs';
const fail=m=>{throw new Error(`[AXIS 8.12 experience] ${m}`)},read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const audit=auditAxis812();
for(const lang of ['en','ja','ko','zh']){
 if(audit.newByLanguage[lang]!==4896)fail(`${lang} new count ${audit.newByLanguage[lang]}`);
 const units=buildAxis812NativeStudio(lang);if(units.length!==4896)fail(`${lang} materialized count`);
 if(new Set(units.map(x=>x.target.trim().toLowerCase())).size!==units.length)fail(`${lang} duplicate target`);
 if(units.some(x=>x.conversation.length!==8||x.conversationExtension.length!==4))fail(`${lang} dialogue depth`);
 if(units.some(x=>!x.lesson?.intent||!x.lesson?.notice||!x.lesson?.cloze||!x.lesson?.recall||!x.lesson?.respond||!x.lesson?.transform||!x.lesson?.trap))fail(`${lang} teaching fields`);
}
if(audit.totalNew!==19584)fail(`total new ${audit.totalNew}`);
if(Object.values(audit.tailPairMax).some(n=>n>40))fail(`tail pair max ${JSON.stringify(audit.tailPairMax)}`);
const info=JSON.parse(read('axis-build.json')),runtime=read('axis-core.js'),build=read('build-release.mjs');
if(info.version!=='8.12'||info.baseVersion!=='8.12')fail(`release identity ${info.version}/${info.baseVersion}`);
for(const step of ['prepare-812-release-compat.mjs','prepare-812-learning-content.mjs','prepare-812-learning-settings.mjs','postbuild-812-contract.mjs'])if(!build.includes(step))fail(`build missing ${step}`);
for(const gate of ['languageStudio812','languageCorpusExpanded812','nativeMultilingual812','dialogueTailDiversity812','dialogueDepthSelectable812','teachingLoop812','activeRecall812','transformPractice812','learningSettingsPurpose812','learningSettingsMethod812','learningSettingsNovelty812','legacy811Preserved812','learningNoAutoplay812','learningLocalFirst812','learningNoTrainingOwner812'])if(info.gates?.[gate]!==true)fail(`gate missing ${gate}`);
if(info.axis812?.learning?.totalNew!==19584||info.axis812?.learning?.totalAvailable!==25716)fail('manifest corpus totals');
for(const [lang,n] of Object.entries({en:10632,ja:5028,ko:5028,zh:5028}))if(info.axis812?.learning?.availableByLanguage?.[lang]!==n)fail(`manifest ${lang} total`);
if(info.axis812?.learning?.dialogueTurns?.short!==4||info.axis812?.learning?.dialogueTurns?.full!==8||info.axis812?.learning?.dialogueTurns?.immersive!==12)fail('dialogue depth contract');
if(info.axis812?.learning?.teachingLoop?.join('|')!=='meaning|noticing|retrieval|response|shadow|transform|review')fail('teaching loop contract');
if(info.axis811?.release!==true||info.axis811?.learning?.totalUnits!==6132||info.axis811?.learning?.dialogueTurns!==6)fail('8.11 inheritance changed');
for(const needle of ["window.__AXIS_812_LEARNING__={version:'8.12'","window.__AXIS_812_LEARNING_SETTINGS__={version:'8.12'",'function axis812ConversationFor(r)','function axis812MethodLab(panel,r)','function axis812ConvergeLearningSettings()'])if(!runtime.includes(needle))fail(`runtime missing ${needle}`);
console.log(`[AXIS 8.12 experience] PASS · ${audit.totalNew} new · 25716 available · tail ${JSON.stringify(audit.tailPairMax)} · 4/8/12 dialogue · seven-step active learning`);
