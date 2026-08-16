import {LEVELS,KINDS} from './learning-atlas-811/kinds.mjs';
import daily from './learning-atlas-811/daily.mjs';
import gym from './learning-atlas-811/gym.mjs';
import social from './learning-atlas-811/social.mjs';
import travel from './learning-atlas-811/travel.mjs';
import work from './learning-atlas-811/work.mjs';
import service from './learning-atlas-811/service.mjs';
import native from './learning-atlas-811/native.mjs';
import ielts from './learning-atlas-811/ielts.mjs';

export const AXIS811_LEVELS=LEVELS;
export const AXIS811_KINDS=Object.fromEntries(Object.entries(KINDS).map(([k,v])=>[k,{templates:v[0],dialogue:v[1]}]));
export const AXIS811_SCENES=[...daily,...gym,...social,...travel,...work,...service,...native,...ielts];

const fill=(t,v)=>String(t||'').replace(/\{(a|az|b|bz)\}/g,(_,k)=>String(v[k]??''));
const compact=s=>String(s||'').replace(/\s+/g,' ').trim();
const connected=text=>{
  const low=String(text||'').toLowerCase(),notes=[];
  const pairs=[
    ['could you','Could you 在自然语流里常接近 /kʊdʒə/，把重音留给后面的实义信息。'],
    ['would you','Would you 常接近 /wʊdʒə/；不要逐词等时长。'],
    ['did you','Did you 常出现 /dɪdʒə/ 的连接。'],
    ['do you','Do you 常弱读并与前后语块连接。'],
    ['want to','want to 在快语流里可能弱化；书写仍保持 want to。'],
    ['going to','going to 在非正式语流里可能明显弱化；书写仍保持 going to。'],
    ['have to','have to 的 to 常弱读，信息重音放在动作上。'],
    ['let me','let me 常作为一个语块连续说。'],
    ['kind of','kind of 常整体弱化；正式书写仍保持完整。'],
    ['a bit','a bit 通常连成一个短语块。'],
    ["i'd",'I’d 是短弱起音，后面的选择或立场承担重音。'],
    ["i'm",'I’m 通常很短，后面的状态或观点承担重音。'],
    ["that's",'That’s 常弱起，核心信息在后半句。'],
    ["there's",'There’s 常弱起，问题或对象承担重音。']
  ];
  for(const [key,note] of pairs){if(low.includes(key))notes.push(note);if(notes.length>=2)break}
  return notes.join(' ')||'按语块说：功能词自然弱读，名词、主要动词、形容词和对比信息承担重音；不要逐词等时长。'
};
const spelling=(text,word)=>{
  const c=[];
  if(/\b(?:I'm|I'd|I've|we're|we've|there's|that's|don't|didn't|can't|won't|wouldn't|couldn't|it's|you're|you've)\b/i.test(text))c.push('注意缩写与完整形式的对应，听写时先判断语法位置。');
  c.push(`拼写重点：${word}。`);
  c.push('先听整句再写，最后核对冠词、介词、复数和词尾。');
  return c.join('')
};
const chunking=text=>String(text||'').replace(/([,;:])\s*/g,'$1 / ').replace(/\s+(but|because|although|whereas|rather than|so)\s+/gi,' / $1 ');
const note=level=>({
  A1:'先把整句说完整；不用追求速度。',
  A2:'把高频语块连起来，不逐词翻译。',
  B1:'先回应核心信息，再自然补一个理由或条件。',
  B2:'练习更自然的限定、转折与修正，保持句子推进。',
  C1:'练精确措辞、语篇连接和立场边界，不靠生僻词制造高级感。',
  'C1+':'这一层用于训练 IELTS Speaking 8+ 所需要的精确、灵活和连贯资源；分数仍取决于完整口语表现。'
}[level]||'');

export function buildAxis811Atlas(){
  const units=[];let seq=0;
  for(const scene of AXIS811_SCENES){
    const kind=AXIS811_KINDS[scene.kind];
    if(!kind)throw new Error(`unknown kind ${scene.kind}`);
    for(let li=0;li<AXIS811_LEVELS.length;li++){
      const level=AXIS811_LEVELS[li],[targetTemplate,zhTemplate]=kind.templates[li];
      const altTemplate=kind.templates[li<AXIS811_LEVELS.length-1?li+1:li-1][0];
      for(const [a,az] of scene.a)for(const [b,bz] of scene.b){
        const vars={a,az,b,bz},target=fill(targetTemplate,vars),speech=connected(target);
        const [response,followup,closing]=kind.dialogue.map(x=>fill(x,vars));
        units.push({
          id:`en811${String(++seq).padStart(4,'0')}`,lang:'en',target,en:target,zh:fill(zhTemplate,vars),
          scenario:scene.scenario,level,register:scene.register,nativeNote:note(level),alt:fill(altTemplate,vars),
          response,followup,closing,pattern:compact(targetTemplate.replace(/\{a\}|\{b\}/g,'…').replace(/\{az\}|\{bz\}/g,'')),
          ielts:scene.track==='ielts'||level==='C1+'?note('C1+'):'',mistake:scene.mistake,anchor:scene.anchor,
          track:scene.track,domain:scene.domain,connected:speech,pron:speech,spelling:spelling(target,scene.spell),
          dictation:'第一遍只听意思；第二遍写整句；第三遍只核对弱读词、缩写、词尾和拼写。',
          shadow:'先听一遍，再以慢半拍方式跟读；卡住时继续追下一语块，不回头重来。',
          stress:'把新信息和对比词读重；功能词缩短。句子越长，越要按意义组块而不是按单词逐个读。',
          chunking:chunking(target),stage:level,ieltsBand:level==='C1+'?'8+ resource':''
        })
      }
    }
  }
  return units
}

export function auditAxis811Atlas(units=buildAxis811Atlas()){
  const required=['id','target','zh','scenario','level','register','response','followup','closing','connected','spelling','dictation','shadow','track','domain'];
  const norm=s=>compact(s).toLowerCase();
  const duplicateTargets=units.length-new Set(units.map(x=>norm(x.target))).size;
  const levelCounts=Object.fromEntries(AXIS811_LEVELS.map(l=>[l,units.filter(x=>x.level===l).length]));
  const trackCounts=Object.fromEntries([...new Set(AXIS811_SCENES.map(x=>x.track))].map(t=>[t,units.filter(x=>x.track===t).length]));
  const missing=units.filter(x=>required.some(k=>!String(x[k]??'').trim())).map(x=>x.id);
  const unresolved=units.filter(x=>Object.values(x).some(v=>typeof v==='string'&&/\{(?:a|az|b|bz)\}/.test(v))).map(x=>x.id);
  const fourTurn=units.every(x=>x.target&&x.response&&x.followup&&x.closing);
  return {count:units.length,duplicateTargets,levelCounts,trackCounts,missing,unresolved,fourTurn}
}
