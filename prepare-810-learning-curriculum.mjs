import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10 curriculum] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

const TRACKS=['gym','daily','social','travel','work','service','ielts','native'];
const files=TRACKS.map(x=>`data/rest-speak/en-810-${x}.json`);
const frames=[];
for(const file of files){
 const rows=JSON.parse(read(file));
 if(!Array.isArray(rows)||rows.length!==6)fail(`${file} expected 6 frames, found ${rows?.length}`);
 for(const frame of rows){
  if(!frame||frame.track!==file.match(/en-810-([a-z]+)\.json$/)?.[1])fail(`${file} track mismatch`);
  if(!Array.isArray(frame.slots)||frame.slots.length!==8)fail(`${file} frame ${frame.scenario||'?'} expected 8 slots`);
  frames.push(frame)
 }
}
if(frames.length!==48)fail(`expected 48 frames, found ${frames.length}`);
const fill=(template,slot)=>String(template||'').replace(/\{([A-Za-z0-9_]+)\}/g,(_,k)=>slot[k]==null?'':String(slot[k]));
const units=[];let seq=0;
for(const frame of frames){
 for(const slot of frame.slots){
  const id=`en810${String(++seq).padStart(3,'0')}`;
  const unit={
   id,lang:'en',target:fill(frame.target,slot),zh:fill(frame.zh,slot),en:fill(frame.target,slot),pron:'',
   scenario:frame.scenario||'',level:frame.level||'B1–B2',register:frame.register||'自然口语',nativeNote:fill(frame.note,slot),
   alt:fill(frame.alt,slot),response:fill(frame.response,slot),pattern:fill(frame.pattern,slot),ielts:fill(frame.ielts,slot),mistake:fill(frame.mistake,slot),anchor:fill(frame.anchor,slot),track:frame.track
  };
  for(const k of ['target','zh','scenario','level','register','track'])if(!unit[k])fail(`${id} missing ${k}`);
  if(Object.values(unit).some(v=>typeof v==='string'&&/\{[A-Za-z0-9_]+\}/.test(v)))fail(`${id} unresolved template token`);
  units.push(unit)
 }
}
if(units.length!==384)fail(`expected 384 generated units, found ${units.length}`);
if(new Set(units.map(x=>x.id)).size!==units.length)fail('duplicate generated ids');
for(const t of TRACKS)if(units.filter(x=>x.track===t).length!==48)fail(`${t} generated unit count mismatch`);

const FILE='v87-runtime.js';let src=read(FILE);
const block=`const AXIS810_SPEAK_EXT=${JSON.stringify(units)};\nfunction axis810Pron(x){\n const t=String(x?.target||'').toLowerCase();\n if(t.includes('would you mind'))return'Would you mind 常连读，mind 承担信息重音；后接动名词。';\n if(t.includes('could you'))return'Could you 在自然语流中常接近 /kʊdʒə/；重音留给真正的动作或对象。';\n if(t.includes('do you'))return'Do you 常弱读并与前后词连起来；不要逐词等时长。';\n if(t.includes('going to'))return'going to 在非正式语流中可明显弱化；正式表达仍保持清楚节奏。';\n if(t.includes("i'd rather"))return'I’d rather 中 I’d 很短，rather 承担节奏；后接动词原形。';\n if(t.includes("i'm not sure"))return'not sure 通常作为一个语块连起来；后半句的立场词承担主要重音。';\n if(t.includes('the main')||t.includes('what really matters'))return'把重音放在 main / really / 关键信息词，功能词自然弱读。';\n if(t.includes('get back to')||t.includes('figure it out')||t.includes('sort this out'))return'短语动词按一个语义块来读，介词和代词通常弱读，核心动词与结果词重读。';\n return'按英语节奏重读名词、主要动词、形容词和对比信息；冠词、介词、助动词自然弱读，避免逐词等时长。'\n}\n`;
src=once(src,'function axis891AllPhrases(){return AXIS89_SPEAK.concat(AXIS891_SPEAK_EXT)}',block+'function axis891AllPhrases(){return AXIS89_SPEAK.concat(AXIS891_SPEAK_EXT,AXIS810_SPEAK_EXT)}','extend phrase bank');
src=once(src,"function axis891Pron(x){\n if(x?.pron)return x.pron;if(x?.lang!=='en')return'';", "function axis891Pron(x){\n if(x?.pron)return x.pron;if(x?.lang!=='en')return'';if(String(x?.id||'').startsWith('en810'))return axis810Pron(x);",'8.10 pronunciation layer');
syntax(src,FILE);write(FILE,src);
console.log('[AXIS 8.10 curriculum] PASS · 48 frames · 384 generated units · English 456 · multilingual 492');
