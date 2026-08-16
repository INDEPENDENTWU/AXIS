import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.9 speak isolation] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

const FILE='v87-runtime.js';let src=read(FILE);
src=once(src,
"function axis89SpeakStore(){try{return JSON.parse(localStorage.getItem(AXIS89_SPEAK_KEY)||'null')||{seen:{},current:null}}catch{return{seen:{},current:null}}}",
"function axis89SpeakStore(){try{const s=JSON.parse(localStorage.getItem(AXIS89_SPEAK_KEY)||'null')||{};s.seen=s.seen||{};s.current=s.current||null;s.prefs=s.prefs||{};return s}catch{return{seen:{},current:null,prefs:{}}}}",
'rest-speak isolated store');
src=once(src,
"function axis89SpeakPrefs(){const p=readMeta().prefs||{},native=p.v89SpeakNative==='en'?'en':'zh',allowed=native==='zh'?['en','ja','ko']:['zh','ja','ko'];return{on:p.v89SpeakEnabled===true,native,target:allowed.includes(p.v89SpeakTarget)?p.v89SpeakTarget:allowed[0]}}",
"function axis89SpeakPrefs(){const s=axis89SpeakStore(),p=s.prefs||{},native=p.native==='en'?'en':'zh',allowed=native==='zh'?['en','ja','ko']:['zh','ja','ko'];return{on:p.enabled===true,native,target:allowed.includes(p.target)?p.target:allowed[0]}}",
'rest-speak isolated prefs');
src=once(src,
"function axis89SetSpeak(k,v){const m=readMeta();m.prefs=m.prefs||{};m.prefs[k]=v;if(k==='v89SpeakNative'){const allowed=v==='en'?['zh','ja','ko']:['en','ja','ko'];if(!allowed.includes(m.prefs.v89SpeakTarget))m.prefs.v89SpeakTarget=allowed[0]}writeMeta(m);renderRestSpeakSettings();renderNow(true)}",
"function axis89SetSpeak(k,v){const s=axis89SpeakStore(),p=s.prefs||(s.prefs={});if(k==='v89SpeakEnabled')p.enabled=!!v;else if(k==='v89SpeakNative'){p.native=v==='en'?'en':'zh';const allowed=p.native==='en'?['zh','ja','ko']:['en','ja','ko'];if(!allowed.includes(p.target))p.target=allowed[0]}else if(k==='v89SpeakTarget')p.target=String(v||'');axis89SaveSpeak(s);renderRestSpeakSettings();renderNow(true)}",
'rest-speak isolated writer');
if(/axis89SetSpeak[\s\S]{0,520}writeMeta\(/.test(src))fail('Rest Speak still writes training metadata');
syntax(src,FILE);write(FILE,src);
console.log('[AXIS 8.9 speak isolation] PASS · accessory preferences and exposure history are outside training metadata');
