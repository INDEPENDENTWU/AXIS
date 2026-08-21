import fs from 'node:fs';

const FILE='v815-media-evidence.js';
const fail=m=>{throw new Error(`[AXIS 8.16 comparative evidence refine] ${m}`)};
const read=()=>fs.readFileSync(FILE,'utf8');
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
let src=read();
if(!src.includes('__AXIS_816_COMPARATIVE_EVIDENCE__'))fail('8.16 comparative layer must converge first');

/* Entering compare mode keeps the inherited endpoint compare semantics stable.
   Arbitrary replacement becomes explicit only after the user chooses the left or
   right compare slot. A plain encounter tap still means “inspect this encounter”. */
src=once(src,"compareSide='right'}","compareSide=''}",'preset leaves side unarmed');
src=once(src,"if(compareMode){compareSelect(resolveBundle(currentKey),idx)}else compareMode=false;","if(compareMode&&compareSide){compareSelect(resolveBundle(currentKey),idx)}else{compareMode=false;compareSide=''}",'explicit compare-side selection');

/* Preserve truthful inherited endpoint labels when the selected pair really is the
   first/last photo-bearing evidence; arbitrary pairs use their encounter numbers. */
src=regexOnce(src,
 /const days=compareDays\(a,b\),tools=([\s\S]*?);\n const next=tools\+`<div class="v815Compare"><figure><img src="\$\{ua\.url\}" alt="第\$\{a\.index\}次影像"><figcaption>第\$\{a\.index\}次<span>\$\{esc\(fmtDate\(a\.time\)\)\} · \$\{esc\(a\.summary\|\|''\)\}<\/span><\/figcaption><\/figure><figure><img src="\$\{ub\.url\}" alt="第\$\{b\.index\}次影像"><figcaption>第\$\{b\.index\}次<span>\$\{esc\(fmtDate\(b\.time\)\)\} · \$\{esc\(b\.summary\|\|''\)\}<\/span><\/figcaption><\/figure><\/div>`;/,
 `const days=compareDays(a,b),tools=$1;\n const candidates=compareCandidates(bundle),aLabel=a.index===candidates[0]?.index?'最早影像':\`第\${a.index}次\`,bLabel=b.index===candidates.at(-1)?.index?'最近影像':\`第\${b.index}次\`;\n const next=tools+\`<div class="v815Compare"><figure><img src="\${ua.url}" alt="\${aLabel}"><figcaption>\${aLabel}<span>\${esc(fmtDate(a.time))} · \${esc(a.summary||'')}</span></figcaption></figure><figure><img src="\${ub.url}" alt="\${bLabel}"><figcaption>\${bLabel}<span>\${esc(fmtDate(b.time))} · \${esc(b.summary||'')}</span></figcaption></figure></div>\`;`,
 'endpoint labels with arbitrary fallback');

for(const needle of ["compareSide=''","if(compareMode&&compareSide)","?'最早影像'", "?'最近影像'"])if(!src.includes(needle))fail(`refine marker missing ${needle}`);
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.16 comparative evidence refine] PASS · inherited endpoint inspection preserved · arbitrary pair replacement requires explicit left/right slot');
