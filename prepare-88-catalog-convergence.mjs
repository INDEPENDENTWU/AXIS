import fs from 'node:fs';

const FILE='v8710-live-catalog.js';
const fail=m=>{throw new Error(`AXIS 8.8 catalog convergence: ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);src=src.replace(from,to)};

const oldTaxonomy="const CATS=['胸','背','肩','手臂','臀腿','核心','心肺','全身'];\nfunction catOf(x){const n=norm([x.name,...(x.aliases||[])].join(' ')),m=x.muscles||[];if(x.type==='cardio')return'心肺';if(m.includes('核心')||/腹|plank|core|pallof|wheel/.test(n))return'核心';if(m.includes('股四头肌')||m.includes('腘绳肌')||m.includes('臀部')||m.includes('小腿'))return'臀腿';if(m.includes('肱二头肌')||m.includes('肱三头肌'))return'手臂';if(m.includes('肩部')&&!m.includes('胸肌'))return'肩';if(m.includes('背部'))return'背';if(m.includes('胸肌'))return'胸';return'全身'}";
const canonicalTaxonomy=`const CATS=['胸','背','肩','手臂','臀腿','核心','心肺','全身'];
const CAT_RULES={
'胸':[['推胸','胸推','chestpress'],['卧推','benchpress'],['蝴蝶机夹胸','pecdeck'],['绳索夹胸','cablefly'],['俯卧撑','pushup'],['双杠','dip'],['上斜卧推','incline'],['下斜卧推','decline']],
'背':[['高位下拉','latpulldown'],['坐姿划船','seatedrow'],['引体向上','pullup'],['胸托划船','chestsupportedrow'],['T杠划船','tbarrow'],['单臂哑铃划船','onearmdumbbellrow'],['直臂下拉','straightarmpulldown'],['硬拉','deadlift']],
'肩':[['肩推','shoulderpress'],['侧平举','lateralraise'],['反向飞鸟','reversedelt'],['面拉','facepull'],['前平举','frontraise'],['耸肩','shrug']],
'手臂':[['哑铃弯举','dumbbellcurl'],['牧师凳弯举','preachercurl'],['绳索弯举','cablecurl'],['绳索下压','pushdown'],['过顶臂屈伸','overheadtriceps']],
'臀腿':[['深蹲','squat'],['腿举','legpress'],['哈克深蹲','hacksquat'],['腿屈伸','legextension'],['腿弯举','legcurl'],['罗马尼亚硬拉','rdl'],['臀推','hipthrust'],['髋外展','hipabductor'],['提踵','calfraise']],
'核心':[['卷腹','crunch'],['平板支撑','plank'],['悬垂举腿','legraise'],['健腹轮','abwheel'],['Pallof','pallof'],['俄罗斯转体','russiantwist']],
'心肺':[['跑步机','treadmill'],['椭圆机','elliptical'],['动感单车','spinbike'],['划船机','rower'],['登阶机','stair'],['滑雪机','skierg'],['跳绳','jumprope'],['游泳','swim']],
'全身':[['壶铃摆动','kettlebellswing'],['农夫行走','farmer'],['雪橇推','sledpush'],['战绳','battlerope'],['波比跳','burpee'],['TRX','trx']]
};
function catOf(x){const n=norm([x.name,...(x.aliases||[])].join(' ')),m=x.muscles||[],p=m[0]||'';if(x.type==='cardio'||p==='心肺')return'心肺';if(p==='核心'||(!p&&/腹|plank|core|pallof|wheel/.test(n)))return'核心';if(['股四头肌','腘绳肌','臀部','小腿','内收肌','髋屈肌','胫骨前肌'].includes(p))return'臀腿';if(p==='胸肌')return'胸';if(p==='背部')return'背';if(p==='肩部')return'肩';if(['肱二头肌','肱三头肌','前臂'].includes(p))return'手臂';if(m.includes('胸肌'))return'胸';if(m.includes('背部'))return'背';if(m.includes('肩部'))return'肩';if(m.includes('核心'))return'核心';if(m.some(v=>['股四头肌','腘绳肌','臀部','小腿'].includes(v)))return'臀腿';if(m.some(v=>['肱二头肌','肱三头肌','前臂'].includes(v)))return'手臂';return'全身'}
function categoryText(x){return[x.name,...(x.aliases||[])].map(norm).filter(Boolean)}
function findCategoryTerm(cat,group,used){for(const t of group){const nt=norm(t),x=LIB.find(v=>!used.has(v.id)&&catOf(v)===cat&&categoryText(v).some(s=>s===nt||s.includes(nt)||nt.includes(s)));if(x)return x}return null}
function prioritized(cat){const used=new Set(),out=[];for(const group of CAT_RULES[cat]||[]){const x=findCategoryTerm(cat,group,used);if(x){out.push(x);used.add(x.id)}}for(const x of LIB){if(!used.has(x.id)&&catOf(x)===cat){out.push(x);used.add(x.id)}}return out}`;
once(oldTaxonomy,canonicalTaxonomy,'canonical primary-muscle taxonomy');

const oldCategoryRender="const all=LIB.filter(x=>catOf(x)===cat),arr=expanded?all:all.slice(0,10);";
const newCategoryRender="const all=prioritized(cat),arr=expanded?all:all.slice(0,10);";
once(oldCategoryRender,newCategoryRender,'canonical category renderer');

once('.v8710Cards button{min-width:0;min-height:72px;padding:13px 14px;','.v8710Cards button{min-width:0;min-height:76px;padding:14px 15px;','final catalog card geometry');
once('.v8710Cards b{display:block;font-size:var(--axis-ui,15px);font-weight:670;','.v8710Cards b{display:block;font-size:var(--axis-ui,15px);font-weight:680;','final catalog card weight');
once('@media(max-width:390px){.v8710Cards{gap:7px}.v8710Cards button{min-height:68px;padding:12px}}','@media(max-width:390px){.v8710Cards{gap:7px}.v8710Cards button{min-height:76px;padding:14px 15px}}','preserve final mobile card geometry');

if(!src.includes('function prioritized(cat)')||!src.includes('const all=prioritized(cat)'))fail('canonical catalog renderer missing after convergence');
if(src.includes("if(m.includes('肱二头肌')||m.includes('肱三头肌'))return'手臂'"))fail('secondary-arm taxonomy survived');
try{new Function(src)}catch(e){fail(`syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.8 catalog] convergence passed · primary-muscle taxonomy · curated ordering · final mobile geometry');