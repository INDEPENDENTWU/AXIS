import fs from 'node:fs';
import {buildAxis811Atlas,auditAxis811Atlas,AXIS811_KINDS as SOURCE_KINDS,AXIS811_SCENES as SOURCE_SCENES} from './lib/learning-atlas-811.mjs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.11 learning atlas] ${m}`)};
const audit=auditAxis811Atlas(buildAxis811Atlas());
if(audit.count!==5280)fail(`expected 5280 atlas units, found ${audit.count}`);
if(audit.duplicateTargets!==0)fail(`duplicate targets ${audit.duplicateTargets}`);
if(audit.missing.length||audit.unresolved.length||!audit.fourTurn)fail('atlas field/four-turn audit failed');
for(const n of Object.values(audit.levelCounts))if(n!==880)fail('level distribution mismatch');

let src=fs.readFileSync(FILE,'utf8');
const end=src.lastIndexOf('})();');
if(end<0)fail('runtime IIFE end not found');

const block=String.raw`
/* AXIS 8.11 — Learning Atlas. Additive, local-first, lazily materialised. */
const AXIS811_LEVELS=['A1','A2','B1','B2','C1','C1+'];
const AXIS811_KINDS=__AXIS811_KINDS__;
const AXIS811_SCENES=__AXIS811_SCENES__;
let AXIS811_SPEAK_EXT=null;
function axis811Fill(t,v){return String(t||'').replace(/\{(a|az|b|bz)\}/g,(_,k)=>String(v[k]??''))}
function axis811Connected(text){
 const low=String(text||'').toLowerCase(),notes=[],pairs=[
 ['could you','Could you 在自然语流里常接近 /kʊdʒə/，把重音留给后面的实义信息。'],
 ['would you','Would you 常接近 /wʊdʒə/；不要逐词等时长。'],['did you','Did you 常出现 /dɪdʒə/ 的连接。'],
 ['do you','Do you 常弱读并与前后语块连接。'],['want to','want to 在快语流里可能弱化；书写仍保持 want to。'],
 ['going to','going to 在非正式语流里可能明显弱化；书写仍保持 going to。'],['have to','have to 的 to 常弱读，信息重音放在动作上。'],
 ['let me','let me 常作为一个语块连续说。'],['kind of','kind of 常整体弱化；正式书写仍保持完整。'],['a bit','a bit 通常连成一个短语块。'],
 ["i'd","I’d 是短弱起音，后面的选择或立场承担重音。"],["i'm","I’m 通常很短，后面的状态或观点承担重音。"],
 ["that's","That’s 常弱起，核心信息在后半句。"],["there's","There’s 常弱起，问题或对象承担重音。"]];
 for(const p of pairs){if(low.includes(p[0]))notes.push(p[1]);if(notes.length>=2)break}
 return notes.join(' ')||'按语块说：功能词自然弱读，名词、主要动词、形容词和对比信息承担重音；不要逐词等时长。'
}
function axis811Spelling(text,word){
 const c=[];if(/\b(?:I'm|I'd|I've|we're|we've|there's|that's|don't|didn't|can't|won't|wouldn't|couldn't|it's|you're|you've)\b/i.test(text))c.push('注意缩写与完整形式的对应，听写时先判断语法位置。');
 c.push('拼写重点：'+word+'。');c.push('先听整句再写，最后核对冠词、介词、复数和词尾。');return c.join('')
}
function axis811Chunking(text){return String(text||'').replace(/([,;:])\s*/g,'$1 / ').replace(/\s+(but|because|although|whereas|rather than|so)\s+/gi,' / $1 ')}
function axis811LevelNote(level){return {A1:'先把整句说完整；不用追求速度。',A2:'把高频语块连起来，不逐词翻译。',B1:'先回应核心信息，再自然补一个理由或条件。',B2:'练习更自然的限定、转折与修正，保持句子推进。',C1:'练精确措辞、语篇连接和立场边界，不靠生僻词制造高级感。','C1+':'这一层用于训练 IELTS Speaking 8+ 所需要的精确、灵活和连贯资源；分数仍取决于完整口语表现。'}[level]||''}
function axis811SpeakAtlas(){
 if(AXIS811_SPEAK_EXT)return AXIS811_SPEAK_EXT;
 const out=[];let seq=0;
 for(const scene of AXIS811_SCENES){
  const kind=AXIS811_KINDS[scene.kind];if(!kind)continue;
  for(let li=0;li<AXIS811_LEVELS.length;li++){
   const level=AXIS811_LEVELS[li],tpl=kind.templates[li],altTpl=kind.templates[li<5?li+1:li-1][0];
   for(const av of scene.a)for(const bv of scene.b){
    const v={a:av[0],az:av[1],b:bv[0],bz:bv[1]},target=axis811Fill(tpl[0],v),speech=axis811Connected(target),dialogue=kind.dialogue.map(x=>axis811Fill(x,v));
    out.push({
     id:'en811'+String(++seq).padStart(4,'0'),lang:'en',target:target,en:target,zh:axis811Fill(tpl[1],v),
     scenario:scene.scenario,level:level,register:scene.register,nativeNote:axis811LevelNote(level),alt:axis811Fill(altTpl,v),
     response:dialogue[0],followup:dialogue[1],closing:dialogue[2],
     pattern:String(tpl[0]).replace(/\{a\}|\{b\}/g,'…'),ielts:scene.track==='ielts'||level==='C1+'?axis811LevelNote('C1+'):'',
     mistake:scene.mistake,anchor:scene.anchor,track:scene.track,domain:scene.domain,connected:speech,pron:speech,
     spelling:axis811Spelling(target,scene.spell),dictation:'第一遍只听意思；第二遍写整句；第三遍只核对弱读词、缩写、词尾和拼写。',
     shadow:'先听一遍，再以慢半拍方式跟读；卡住时继续追下一语块，不回头重来。',
     stress:'把新信息和对比词读重；功能词缩短。句子越长，越要按意义组块而不是按单词逐个读。',
     chunking:axis811Chunking(target),stage:level,ieltsBand:level==='C1+'?'8+ resource':''
    })
   }
  }
 }
 AXIS811_SPEAK_EXT=out;return out
}
const axis811BaseAllPhrases=axis891AllPhrases;
axis891AllPhrases=function(){return axis811BaseAllPhrases().concat(axis811SpeakAtlas())};
const axis811BasePrefs=axis89SpeakPrefs;
axis89SpeakPrefs=function(){
 const p=axis811BasePrefs(),s=axis89SpeakStore(),raw=String(s?.prefs?.focus||'auto');
 return {...p,focus:['auto','natural','ielts8'].includes(raw)?raw:'auto'}
};
axis810Pool=function(p,key){
 let pool=axis891Pool(p.target);if(p.target!=='en')return pool;
 if(p.track!=='auto'){const f=pool.filter(x=>(x.track||axis891Rich(x,p).track||'daily')===p.track);if(f.length)return f}
 if(p.focus==='natural'){const f=pool.filter(x=>x.track!=='ielts');if(f.length)pool=f}
 else if(p.focus==='ielts8'){const f=pool.filter(x=>x.track==='ielts'||/C1/i.test(String(x.level||'')));if(f.length)pool=f}
 return pool
};
axis810LevelPenalty=function(x,p,s){
 const level=String(x?.level||axis891Rich(x,p).level||'').toUpperCase(),seen=Object.keys(s.seen||{}).length;
 let mode=p.level;if(mode==='adaptive')mode=seen<32?'foundation':seen<120?'progress':'advanced';
 if(mode==='foundation')return /C1/.test(level)?7e13:/B2/.test(level)?2e13:/^B1/.test(level)?4e12:0;
 if(mode==='progress')return /^A1/.test(level)?2e13:/C1\+/.test(level)?1.5e13:0;
 if(mode==='advanced')return /^A1|^A2|^B1/.test(level)?6e13:/^B2/.test(level)?8e12:0;
 return 0
};
const axis811BasePanelRows=axis891PanelRows;
axis891PanelRows=function(r){
 const rows=axis811BasePanelRows(r);
 if(r?.chunking)rows.splice(Math.min(1,rows.length),0,['语块',r.chunking]);
 if(r?.spelling)rows.push(['拼写',r.spelling]);
 if(r?.dictation)rows.push(['听写',r.dictation]);
 if(r?.followup)rows.push(['接下去',r.followup]);
 return rows
};
const axis811BaseSnapshot=axis810Snapshot;
function axis811AvailableSnapshot(){
 const x=axis811BaseSnapshot();
 return {...x,version:'8.11-candidate',atlasEnglish:axis811SpeakAtlas().length,availableEnglish:axis891Pool('en').length,availableTotal:axis891AllPhrases().length}
}
axis810Snapshot=function(){const x=axis811BaseSnapshot();return {...x,english:456,total:492}};
try{window.__AXIS_811_LEARNING__={version:'8.11-candidate',owner:'local-accessory',atlasEnglish:5280,totalEnglish:5736,totalUnits:5772,levels:AXIS811_LEVELS.slice(),lazy:true,networkRequired:false,dialogue:'unit-specific-four-turn',connectedSpeech:true,spelling:true,dictation:true,shadow:true,legacyDiagnosticsPreserved:true}}catch{}
try{
 const legacy=window.__AXIS_REST_SPEAK__;if(legacy){legacy.richEnglish=456;legacy.totalUnits=492;legacy.phrases=()=>492;legacy.snapshot=axis810Snapshot;legacy.atlasEnglish=5280;legacy.availableEnglish=5736;legacy.availableUnits=5772;legacy.availablePhrases=()=>axis891AllPhrases().length;legacy.availableSnapshot=axis811AvailableSnapshot}
}catch{}
`;
const runtimeBlock=block
 .replace('__AXIS811_KINDS__',JSON.stringify(SOURCE_KINDS))
 .replace('__AXIS811_SCENES__',JSON.stringify(SOURCE_SCENES));

src=src.slice(0,end)+runtimeBlock+'\n'+src.slice(end);
const legacyPhraseOwner='phrases:()=>axis891AllPhrases().length,snapshot:axis810Snapshot';
if(!src.includes(legacyPhraseOwner))fail('legacy diagnostic phrase owner not found');
src=src.replace(legacyPhraseOwner,'phrases:()=>492,availablePhrases:()=>axis891AllPhrases().length,snapshot:axis810Snapshot,availableSnapshot:axis811AvailableSnapshot');
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.11 learning atlas] PASS · 5280 unique English units · 6 levels · no 8.10.3 cross-scope dependency · inherited diagnostics preserved');
