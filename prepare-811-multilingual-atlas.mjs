import fs from 'node:fs';
import {buildAxis811Multilingual,auditAxis811Multilingual} from './lib/multilingual-atlas-811.mjs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.11 multilingual] ${m}`)};
const norm=s=>String(s||'').normalize('NFKC').replace(/\s+/g,' ').trim().toLowerCase();
let units=buildAxis811Multilingual().map(x=>({...x,conversation:x.conversation.slice()}));
const replacements=new Map([
 ['ja|もう一度お願いします。','すみません、もう一回いいですか？'],
 ['ja|これ、使っていますか？','このマシン、今使っていますか？'],
 ['ja|これはいくらですか？','こちらはいくらになりますか？'],
 ['ko|이거 얼마예요?','이건 가격이 어떻게 돼요?'],
 ['zh|可以再说一遍吗？','不好意思，能再说一次吗？'],
 ['zh|这个有人用吗？','请问这个现在有人在用吗？'],
 ['zh|这个多少钱？','请问这个怎么卖？']
]);
for(const u of units){const next=replacements.get(u.lang+'|'+u.target);if(next){u.target=next;if(u.lang==='zh')u.zh=next;u.conversation[0]=next}}
const audit=auditAxis811Multilingual(units);
if(audit.count!==360||audit.per.ja!==120||audit.per.ko!==120||audit.per.zh!==120||audit.missing.length||!audit.sixTurn)fail('multilingual unit audit failed');
for(const [lang,n] of Object.entries(audit.dup))if(n!==0)fail(`${lang} generated duplicates ${n}`);
const legacy={
 ja:['ちょっと待ってください。','これ、使っていますか？','大丈夫です。','お願いします。','もう一度お願いします。','これはいくらですか？','ここで大丈夫です。','おすすめは何ですか？','少しだけ。','わかりました。','すみません、通ります。','また後で。'],
 ko:['잠깐만요.','이거 쓰고 계세요?','괜찮아요.','부탁드릴게요.','다시 말해 주세요.','이거 얼마예요?','여기서 내려 주세요.','추천해 주세요.','조금만 주세요.','알겠어요.','실례할게요.','나중에 봐요.'],
 zh:['等一下。','这个有人用吗？','没关系。','麻烦你了。','可以再说一遍吗？','这个多少钱？','这里下就可以。','有什么推荐吗？','少一点就好。','明白了。','不好意思，借过。','回头见。']
};
for(const lang of ['ja','ko','zh']){const old=new Set(legacy[lang].map(norm)),overlap=units.filter(x=>x.lang===lang&&old.has(norm(x.target)));if(overlap.length)fail(`${lang} overlaps legacy targets: ${overlap.map(x=>x.target).join(' | ')}`)}
let src=fs.readFileSync(FILE,'utf8'),end=src.lastIndexOf('})();');if(end<0)fail('runtime IIFE end missing');
const block=`\n/* AXIS 8.11 — Japanese / Korean / Chinese deep atlas. */\nconst AXIS811_MULTI_EXT=${JSON.stringify(units)};\nconst axis811EnglishAllPhrases=axis891AllPhrases;\naxis891AllPhrases=function(){return axis811EnglishAllPhrases().concat(AXIS811_MULTI_EXT)};\ntry{window.__AXIS_811_MULTILINGUAL__={version:'8.11-candidate',newPerLanguage:120,available:{ja:132,ko:132,zh:132},sixTurn:true,exactTargetDuplicates:0,legacyTargetOverlap:0,networkRequired:false,trainingOwner:false}}catch{}\n`;
src=src.slice(0,end)+block+src.slice(end);
const countNeedles=[['legacy.availableUnits=5772','legacy.availableUnits=6132'],['totalUnits:5772,levels:AXIS811_LEVELS.slice()','totalUnits:6132,levels:AXIS811_LEVELS.slice()']];
for(const [from,to] of countNeedles){const n=src.split(from).length-1;if(n!==1)fail(`count marker ${from} expected once, found ${n}`);src=src.replace(from,to)}
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.11 multilingual] PASS · +120 Japanese · +120 Korean · +120 Chinese · 132 available each · six-turn · no legacy exact overlap');
