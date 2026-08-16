import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.9.1 speak] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

const FILE='v87-runtime.js';let src=read(FILE);
const FILES=['data/rest-speak/en-gym.json','data/rest-speak/en-daily.json','data/rest-speak/en-travel.json','data/rest-speak/en-work.json','data/rest-speak/en-ielts.json'];
const rows=FILES.flatMap(f=>{try{const x=JSON.parse(read(f));if(!Array.isArray(x))fail(`invalid curriculum ${f}`);return x}catch(e){fail(`curriculum ${f}: ${e.message}`)}});
if(rows.length!==60)fail(`English curriculum expected 60 extension units, found ${rows.length}`);
if(rows.some(x=>!Array.isArray(x)||x.length!==15))fail('English curriculum row schema mismatch');

const rich="const AXIS891_SPEAK_EXT=__AXIS891_ROWS__.map(x=>({id:x[0],lang:x[1],target:x[2],zh:x[3],scenario:x[4],level:x[5],register:x[6],nativeNote:x[7],alt:x[8],response:x[9],pattern:x[10],ielts:x[11],mistake:x[12],anchor:x[13],track:x[14]}));\n\nconst AXIS891_BASE_META={\n en01:{scenario:'日常 · 请求帮助',level:'B1',register:'礼貌口语',nativeNote:'give me a hand 是“帮个忙”，比 help me 在很多即时场景更自然。',alt:'Could you help me out?',response:'Sure, what do you need?',mistake:'hand 在这里不是字面“手”。',anchor:'give me a hand = 帮个忙'},\n en02:{scenario:'健身房 · 共用器械',level:'B1',register:'自然口语',nativeNote:'直接问 Is anyone using this? 很自然，this 由现场物品完成指代。',alt:'Is this in use?',response:'No, go ahead.',mistake:'不要加多余的 now unless needed。',anchor:'using this = 在用这个'},\n en03:{scenario:'日常 · 即将完成',level:'B1',register:'自然口语',nativeNote:'almost done 是高频完成状态，短而自然。',alt:'I’m nearly finished.',response:'No problem.',mistake:'done 是形容完成状态，不说 I almost finish。',anchor:'almost done = 快好了'},\n en04:{scenario:'日常 · 让对方先',level:'A2–B1',register:'自然口语',nativeNote:'Go ahead 可表示“你先 / 请继续”，语气取决于场景。',alt:'After you.',response:'Thanks.',mistake:'不是所有场景都等于“向前走”。',anchor:'go ahead = 你先'},\n en05:{scenario:'日常 · 缓和回应',level:'B1',register:'自然口语',nativeNote:'No worries 在很多英语地区是轻松的“没事 / 不用担心”。',alt:'No problem.',response:'Thanks.',mistake:'正式场合可优先 No problem / That’s fine。',anchor:'no worries = 没事'},\n en06:{scenario:'日常 · 接受安排',level:'B1',register:'自然口语',nativeNote:'That works for me 表示时间、方案或安排对自己可行。',alt:'That’s fine with me.',response:'Great, let’s do that.',mistake:'work 在这里表示“可行”，不是工作。',anchor:'works for me = 我可以'},\n en07:{scenario:'日常 · 请求等待',level:'B1',register:'礼貌口语',nativeNote:'a second 通常不是字面一秒，而是“一小会儿”。',alt:'Give me a second, please.',response:'Sure.',mistake:'Could you 后接动词原形。',anchor:'a second = 一会儿'},\n en08:{scenario:'餐饮 · 外带',level:'B1',register:'美式口语',nativeNote:'to go 在北美常表示外带；其他地区也常听到 takeaway。',alt:'Could I get this as takeaway?',response:'Sure.',mistake:'不要直译 pack this out。',anchor:'to go = 外带'},\n en09:{scenario:'交通 · 下车',level:'B1',register:'自然口语',nativeNote:'get off 用于公交、地铁、火车等公共交通下车。',alt:'Which stop should I get off at?',response:'The next stop.',mistake:'小车通常用 get out of，不用 get off。',anchor:'get off = 下车'},\n en10:{scenario:'购物 · 暂不购买',level:'B1',register:'自然口语',nativeNote:'店员询问需求时 I’m just looking 是最常见的轻松回应之一。',alt:'I’m just browsing, thanks.',response:'No problem.',mistake:'looking 不等于“看某人”，语境决定。',anchor:'just looking = 随便看看'},\n en11:{scenario:'日常 · 接受建议',level:'A2–B1',register:'自然口语',nativeNote:'Sounds good 是对建议、计划的高频积极回应。',alt:'That works.',response:'Great.',mistake:'主语省略是自然口语，不需要 It sounds good 每次都说全。',anchor:'sounds good = 就这么办'},\n en12:{scenario:'日常 · 请求重复',level:'B1',register:'礼貌口语',nativeNote:'比 What? 更礼貌，也比 Please repeat 更自然。',alt:'Sorry, could you say that again?',response:'Of course.',mistake:'again 重音通常承载“再一次”的信息。',anchor:'say that again = 再说一遍'}\n};\n\nfunction axis891AllPhrases(){return AXIS89_SPEAK.concat(AXIS891_SPEAK_EXT)}\nfunction axis891Pool(lang){return axis891AllPhrases().filter(x=>!lang||x.lang===lang)}\nfunction axis891Phrase(id){return axis891AllPhrases().find(x=>x.id===id)||null}\nfunction axis891Pron(x){\n if(x?.pron)return x.pron;if(x?.lang!=='en')return'';\n const t=String(x.target||'').toLowerCase();\n if(t.includes('could you'))return'Could you 在自然语流里常接近 /kʊdʒə/；重音落在后面的实义动词。';\n if(t.includes('would you'))return'Would you 常弱读并与后词连起来；重读真正的信息词。';\n if(t.includes('mind if i'))return'Mind if I 常连成 /maɪndɪfaɪ/；不要逐词停顿。';\n if(t.includes('what do you'))return'What do you 在快速自然语流里常明显弱读；把重音留给后面的关键词。';\n if(t.includes('i’d rather'))return'I’d rather 中 I’d 很短，rather 承担主要节奏；后接动词原形。';\n if(t.includes('there’s'))return'There’s 作为弱起音很短，句子重音放在 mistake / trade-off 等信息词。';\n if(t.includes('get back to you'))return'get back to you 连续说，to 通常弱读；back 和关键信息承担重音。';\n return'按英语节奏重读名词、主要动词和形容词；冠词、介词、助动词自然弱读，避免逐词等时长。'\n}\nfunction axis891Rich(x,p=axis89SpeakPrefs()){\n const base=AXIS891_BASE_META[x?.id]||{},target=String(x?.target||''),meaning=p.native==='en'?(x?.en||target):(x?.zh||'');\n return{...base,...x,target,meaning,scenario:x?.scenario||base.scenario||(x?.lang==='en'?'日常口语':'日常场景'),level:x?.level||base.level||(x?.lang==='en'?'B1':'实用'),register:x?.register||base.register||'自然表达',nativeNote:x?.nativeNote||base.nativeNote||(x?.pattern?`可迁移句型：${x.pattern}`:'优先记整句和使用场景，不逐词翻译。'),alt:x?.alt||base.alt||'',response:x?.response||base.response||'',pattern:x?.pattern||base.pattern||'',ielts:x?.ielts||base.ielts||(x?.lang==='en'&&x?.pattern?'IELTS 口语中可在合适场景自然替换关键词使用。':''),mistake:x?.mistake||base.mistake||'',anchor:x?.anchor||base.anchor||'',pron:axis891Pron(x),track:x?.track||'daily'}\n}\nfunction axis891RankPick(pool,s,exclude=''){\n const ranked=pool.filter(x=>x.id!==exclude).map(x=>{const q=s.seen[x.id]&&typeof s.seen[x.id]==='object'?s.seen[x.id]:{n:0,last:0},mastered=Number(s.mastered?.[x.id])||0;return{x,q,score:(mastered?1e15:0)+(Number(q.n)||0)*1e12+(Number(q.last)||0)}}).sort((a,b)=>a.score-b.score);\n return ranked[0]?.x||pool.find(x=>x.id!==exclude)||pool[0]||null\n}".replace('__AXIS891_ROWS__',JSON.stringify(rows));
src=once(src,'function axis89SpeakStore(){',rich+'\nfunction axis89SpeakStore(){','rich phrase system');

src=regexOnce(src,/function axis89SpeakStore\(\)\{[\s\S]*?\n\}\nfunction axis89SaveSpeak/,`function axis89SpeakStore(){
 try{
  const raw=JSON.parse(localStorage.getItem(AXIS89_SPEAK_KEY)||'null'),s=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
  s.seen=s.seen&&typeof s.seen==='object'&&!Array.isArray(s.seen)?s.seen:{};
  s.current=s.current&&typeof s.current==='object'&&!Array.isArray(s.current)?s.current:null;
  s.prefs=s.prefs&&typeof s.prefs==='object'&&!Array.isArray(s.prefs)?s.prefs:{};
  s.mastered=s.mastered&&typeof s.mastered==='object'&&!Array.isArray(s.mastered)?s.mastered:{};
  return s
 }catch{return{seen:{},current:null,prefs:{},mastered:{}}}
}
function axis89SaveSpeak`,'8.9.1 accessory store');

src=regexOnce(src,/function axis89PickPhrase\(key\)\{[\s\S]*?\n\}\nfunction axis89SpeakMeaning/,`function axis89PickPhrase(key){
 try{
  const p=axis89SpeakPrefs(),s=axis89SpeakStore();if(!p.on)return null;
  if(s.current?.key===key&&s.current?.target===p.target)return axis891Phrase(s.current.id);
  const pool=axis891Pool(p.target);if(!pool.length)return null;
  const pick=axis891RankPick(pool,s);if(!pick)return null;
  const q=s.seen[pick.id]&&typeof s.seen[pick.id]==='object'?s.seen[pick.id]:{n:0,last:0};
  s.seen[pick.id]={n:(Number(q.n)||0)+1,last:Date.now()};s.current={key,target:p.target,id:pick.id};axis89SaveSpeak(s);return pick
 }catch{return null}
}
function axis89SpeakMeaning`,'8.9.1 phrase selection');

if(!src.includes('function axis891Rich(')||!src.includes('function axis891RankPick('))fail('rich learning helpers missing');
syntax(src,FILE);write(FILE,src);
console.log('[AXIS 8.9.1 speak curriculum] PASS · 72 English units · mastery-aware rotation · pronunciation coaching');
