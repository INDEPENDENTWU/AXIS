import {buildAxis811Atlas} from './learning-atlas-811.mjs';
import {buildAxis811Multilingual} from './multilingual-atlas-811.mjs';
import {AXIS812_VERSION,AXIS812_LEVELS,AXIS812_LANGS,AXIS812_TURNS,AXIS812_FAMILIES,buildAxis812NativeStudio as buildRaw} from './learning-studio-812.mjs';

export {AXIS812_VERSION,AXIS812_LEVELS,AXIS812_LANGS,AXIS812_TURNS,AXIS812_FAMILIES};

const FILL={
 en:['Anything else I should keep in mind?','Is there one detail I am missing?','Would you handle anything differently?','That makes sense — what would you do next?','Okay. What is the one thing you would prioritize?','Before we leave it there, is there any catch?','Got it. Is there a simpler way to think about it?','Fair. What would change your mind?'],
 ja:['ほかに気をつけることはありますか？','何か見落としている点はありますか？','別のやり方をするなら、どこを変えますか？','なるほど。次はどうしますか？','分かりました。一番優先するなら何ですか？','最後に、何か注意点はありますか？','なるほど。もっと簡単に考えるならどうなりますか？','分かりました。何があれば考えが変わりますか？'],
 ko:['또 알아둘 게 있을까요?','제가 놓치고 있는 게 하나 있을까요?','다르게 한다면 어떤 부분을 바꿀 것 같아요?','그렇군요. 그다음에는 어떻게 할 것 같아요?','알겠어요. 하나만 우선한다면 뭐예요?','마무리하기 전에 주의할 점이 있을까요?','좋아요. 더 간단하게 생각하면 어떻게 볼 수 있을까요?','알겠어요. 어떤 조건이면 생각이 달라질까요?'],
 zh:['还有什么是我最好注意一下的吗？','我是不是还漏掉了一个关键点？','如果换一种做法，你会改哪一部分？','明白。那下一步你会怎么做？','好，如果只优先一个点，你会选什么？','结束之前，还有什么坑需要注意吗？','懂了。如果把它想简单一点，应该怎么理解？','明白。什么情况会让你改变判断？']
};

const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
export function normalizeAxis812Unit(unit){
 const u={...unit},conv=[...(u.conversation||[])],ext=[...(u.conversationExtension||[])],lang=AXIS812_LANGS.includes(u.lang)?u.lang:'en',fill=FILL[lang];
 const seen=new Set(),reserve=[...ext,...fill];
 for(let i=0;i<conv.length;i++){
  let text=norm(conv[i]);
  if(!text||seen.has(text)){
   let replacement='';
   while(reserve.length&&!replacement){const x=norm(reserve.shift());if(x&&!seen.has(x))replacement=x}
   if(!replacement)replacement=fill[(i+conv.length)%fill.length];
   text=replacement;
  }
  conv[i]=text;seen.add(text)
 }
 const extSeen=new Set(conv),nextExt=[];
 for(const candidate of [...ext,...fill]){const text=norm(candidate);if(text&&!extSeen.has(text)){nextExt.push(text);extSeen.add(text)}if(nextExt.length===4)break}
 if(nextExt.length!==4)throw new Error(`[AXIS 8.12] cannot complete dialogue extension ${u.id}`);
 u.conversation=conv;u.response=conv[1]||u.response;u.followup=conv[2]||u.followup;u.closing=conv[3]||u.closing;u.turn5=conv[4]||u.turn5;u.turn6=conv[5]||u.turn6;u.conversationExtension=nextExt;
 return u
}

export function buildAxis812NativeStudio(lang='en'){return buildRaw(lang).map(normalizeAxis812Unit)}
export function buildAxis812All(){return Object.fromEntries(AXIS812_LANGS.map(lang=>[lang,buildAxis812NativeStudio(lang)]))}

export function auditAxis812(){
 const oldEn=buildAxis811Atlas(),oldMulti=buildAxis811Multilingual(),old={en:oldEn,ja:oldMulti.ja||[],ko:oldMulti.ko||[],zh:oldMulti.zh||[]},all=buildAxis812All(),counts={},tailMax={};
 for(const lang of AXIS812_LANGS){
  const units=all[lang],targets=new Set(),oldTargets=new Set((old[lang]||[]).map(x=>norm(x.target).toLowerCase())),tails=new Map();
  for(const u of units){
   const k=norm(u.target).toLowerCase();if(targets.has(k))throw new Error(`[AXIS 8.12] duplicate ${lang} target: ${u.target}`);targets.add(k);if(oldTargets.has(k))throw new Error(`[AXIS 8.12] legacy exact overlap ${lang}: ${u.target}`);
   if(u.conversation.length!==8||u.conversationExtension.length!==4)throw new Error(`[AXIS 8.12] dialogue depth ${u.id}`);
   if(new Set(u.conversation.map(norm)).size!==8)throw new Error(`[AXIS 8.12] dialogue repetition ${u.id}`);
   const t=u.conversation.slice(-2).map(norm).join(' || ');tails.set(t,(tails.get(t)||0)+1);
   for(const k2 of ['intent','notice','contrast','cloze','recall','respond','transform','trap'])if(!u.lesson?.[k2])throw new Error(`[AXIS 8.12] lesson missing ${k2} ${u.id}`)
  }
  counts[lang]=units.length;tailMax[lang]=Math.max(...tails.values());if(tailMax[lang]>40)throw new Error(`[AXIS 8.12] repetitive tail pair ${lang}: ${tailMax[lang]}`)
 }
 return{version:AXIS812_VERSION,newByLanguage:counts,legacyByLanguage:{en:old.en.length,ja:old.ja.length,ko:old.ko.length,zh:old.zh.length},availableByLanguage:Object.fromEntries(AXIS812_LANGS.map(lang=>[lang,(old[lang]||[]).length+counts[lang]])),totalNew:Object.values(counts).reduce((a,b)=>a+b,0),totalAvailable:AXIS812_LANGS.reduce((n,lang)=>n+(old[lang]||[]).length+counts[lang],0),tailPairMax:tailMax,dialogueTurns:AXIS812_TURNS,teachingLoop:['meaning','noticing','retrieval','response','shadow','transform','review']}
}
