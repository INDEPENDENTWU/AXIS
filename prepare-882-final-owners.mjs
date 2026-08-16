import fs from 'node:fs';

const fail=m=>{throw new Error(`AXIS 8.8.2 final owners: ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{const f=`.axis-882-owner-${label}.js`;fs.writeFileSync(f,src);try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}finally{try{fs.unlinkSync(f)}catch{}}};

/* v87 owns time/state only. It may never emit an automatic training sound in 8.8.2. */
{
  const FILE='v87-runtime.js';let src=read(FILE);
  src=regexOnce(src,/async function reminderTick\(\)\{[\s\S]*?\}\nfunction installEvents\(\)\{/,
`async function reminderTick(){return false}
function installEvents(){`,'retire v87 automatic reminder sound');
  src=once(src,"timer=setInterval(()=>{if(D.visibilityState==='visible'){renderNow();renderTimeline();reminderTick()}},500)","timer=setInterval(()=>{if(D.visibilityState==='visible'){renderNow();renderTimeline()}},500)",'retire v87 reminder polling call');
  if(/async function reminderTick\(\)\{(?!return false)/.test(src)||src.includes('renderTimeline();reminderTick()'))fail('v87 automatic reminder path survived');
  syntax(src,'v87');write(FILE,src);
}

/* v8710 is the one automatic sound owner; only a natural active-item countdown zero may cue. */
{
  const FILE='v8710-sound-ui.js';let src=read(FILE);
  src=once(src,
    "if(p.item&&due&&elapsed(a)>=due){const k=e.id+':'+a.startedAt;if(!itemSeen.has(k)){itemSeen.add(k);cue('item')}}",
    "if(p.item&&due&&elapsed(a)>=due&&!D.querySelector('#v87Hold.show')){const k=e.id+':'+a.startedAt;if(!itemSeen.has(k)){itemSeen.add(k);cue('item')}}",
    'long-press countdown suppression');
  if(/cue\('(set|rest|session)'\)/.test(src))fail('non-countdown automatic cue survived in v8710');
  if(/status==='finished'[^\n]{0,160}cue\('item'\)/.test(src))fail('manual item-finish cue survived in v8710');
  if(!src.includes("elapsed(a)>=due&&!D.querySelector('#v87Hold.show')"))fail('single countdown trigger / hold suppression missing');
  syntax(src,'v8710-sound');write(FILE,src);
}

console.log('[AXIS 8.8.2 owners] PASS · v87 state only · v8710 sole automatic sound · countdown zero only');
