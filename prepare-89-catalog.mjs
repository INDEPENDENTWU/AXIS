import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.9 catalog] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};
const catalogIds=src=>{
 const a=src.indexOf('const LIB=['),b=src.indexOf('].map(x=>({id:x[0]',a);
 if(a<0||b<0)fail('canonical LIB boundary missing');
 return [...src.slice(a,b).matchAll(/\[\s*'([^']+)'\s*,\s*'[^']+'\s*,\s*\[/g)].map(x=>x[1]);
};

{
 const FILE='v873-exercise-library.js';let src=read(FILE);
 const candidates=`  ['plate-chest-press','杠片式胸推',['槓片式胸推','杠片胸推','plate loaded chest press','iso lateral chest press','推胸机器'], 'strength',[M.chest,M.triceps,M.shoulder]],
  ['machine-incline-press','器械上斜胸推',['器械上斜胸推','上斜推胸机','incline chest press machine','incline machine press'], 'strength',[M.chest,M.shoulder,M.triceps]],
  ['machine-decline-press','器械下斜胸推',['器械下斜胸推','decline chest press machine'], 'strength',[M.chest,M.triceps]],
  ['high-row-machine','高位划船机',['高位划船機','high row machine','iso lateral high row'], 'strength',[M.back,M.biceps]],
  ['low-row-machine','低位划船机',['低位划船機','low row machine','iso lateral low row'], 'strength',[M.back,M.biceps]],
  ['assisted-pullup','助力引体向上',['助力引體向上','助力单双杠','assisted pull up','assisted pullup machine'], 'strength',[M.back,M.biceps]],
  ['machine-lateral','器械侧平举',['器械側平舉','侧平举机','lateral raise machine','machine lateral raise'], 'strength',[M.shoulder]],
  ['machine-biceps','器械弯举',['器械彎舉','二头弯举机','biceps curl machine'], 'strength',[M.biceps]],
  ['machine-triceps','器械臂屈伸',['器械臂屈伸','三头训练机','triceps extension machine'], 'strength',[M.triceps]],
  ['v-squat','V型深蹲机',['V型深蹲機','V squat','v-squat machine'], 'strength',[M.quads,M.glutes]],
  ['glute-drive','臀推机',['臀推機','glute drive','hip thrust machine','臀桥机'], 'strength',[M.glutes,M.hamstrings]],
  ['standing-calf-machine','站姿提踵机',['站姿提踵機','standing calf machine'], 'strength',[M.calves]],
  ['seated-calf-machine','坐姿提踵机',['坐姿提踵機','seated calf machine'], 'strength',[M.calves]],
  ['landmine-press','地雷管推举',['地雷管推舉','landmine press'], 'strength',[M.shoulder,M.chest,M.triceps]],
  ['stair-climber','登阶机',['登階機','楼梯机','樓梯機','stair climber','stairmaster'], 'cardio',[M.cardio,M.quads,M.glutes]],
  ['ski-erg','滑雪机',['滑雪機','ski erg','skierg'], 'cardio',[M.cardio,M.back,M.core]],
  ['sled-pull','雪橇拉',['雪橇拉','sled pull','sled drag'], 'strength',[M.quads,M.glutes,M.hamstrings]],
  ['suitcase-carry','单侧负重行走',['單側負重行走','suitcase carry'], 'strength',[M.core,M.forearms]],
`;
 const inheritedIds=catalogIds(src),existing=new Set(inheritedIds),skipped=[];
 const additions=candidates.split('\n').filter(line=>{const m=line.match(/^\s*\['([^']+)'/);if(!m)return true;if(existing.has(m[1])){skipped.push(m[1]);return false}existing.add(m[1]);return true}).join('\n');
 const marker="  ['treadmill','跑步机'";
 src=once(src,marker,additions+marker,'expanded 8.9 canonical catalog');
 const ids=catalogIds(src),dupIds=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
 const alias=`
const AXIS89_COMMON={
 '臀部':['屁股','臀','练屁股','練屁股','臀腿','glute day'],
 '腘绳肌':['大腿后面','大腿後面','腿后侧','腿後側','后链','後鏈'],
 '腰部':['腰','下背','下背部','lower back'],
 '前臂':['前臂','手腕','握力','小臂','forearm','grip'],
 '内收肌':['大腿内侧','大腿內側','内侧腿','內側腿','adductor'],
 '髋屈肌':['髋前侧','髖前側','胯前','hip flexor'],
 '胫骨前肌':['小腿前面','小腿前侧','脛骨前','tibialis'],
 '心肺':['喘','体能','體能','有氧','cardio']
};
for(const [m,a] of Object.entries(AXIS89_COMMON)){MUSCLE_ALIASES[m]=[...new Set([...(MUSCLE_ALIASES[m]||[]),...a])]}
const AXIS89_DUPLICATE_IDS=[];
{
 const byId=new Map();
 for(const x of LIB){
  const id=String(x?.id||'').trim();if(!id)continue;
  const prev=byId.get(id);
  if(!prev){byId.set(id,x);continue}
  AXIS89_DUPLICATE_IDS.push(id);
  prev.aliases=[...new Set([...(prev.aliases||[]),...(x.aliases||[])])];
  prev.muscles=[...new Set([...(prev.muscles||[]),...(x.muscles||[])])];
  if(!prev.baseId&&x.baseId)prev.baseId=x.baseId;
 }
 if(byId.size!==LIB.length)LIB.splice(0,LIB.length,...byId.values());
}
`;
 src=once(src,"\nwindow.__AXIS_873_LIBRARY__=LIB;window.__AXIS_873_MUSCLE_ALIASES__=MUSCLE_ALIASES;",alias+"\nwindow.__AXIS_873_LIBRARY__=LIB;window.__AXIS_873_MUSCLE_ALIASES__=MUSCLE_ALIASES;window.__AXIS_89_CATALOG__={version:'8.9',size:LIB.length,deduped:[...new Set(AXIS89_DUPLICATE_IDS)]};",'common-language aliases + canonical id convergence');
 if(!src.includes('LIB.splice(0,LIB.length,...byId.values())'))fail('runtime catalog id convergence missing');
 syntax(src,FILE);write(FILE,src);
 console.log(`[AXIS 8.9 catalog] source ids ${ids.length} · source duplicates ${dupIds.join(', ')||'none'} · skipped 8.9 collisions ${skipped.join(', ')||'none'}`);
}

{
 const FILE='v8711-runtime.js';let src=read(FILE);
 const from="function addExercise(x){if(!x?.name)return;const k=norm(x.name),same=LIB.find(i=>norm(i.name)===k||(i.aliases||[]).some(a=>norm(a)===k));if(same){const a=new Set([...(same.aliases||[]),...(x.aliases||[])]);same.aliases=[...a];same.muscles=[...new Set([...(same.muscles||[]),...(x.muscles||[])])];return}LIB.push(x)}";
 const to="function addExercise(x){if(!x?.name)return;const id=String(x.id||'').trim(),k=norm(x.name),same=(id?LIB.find(i=>String(i?.id||'').trim()===id):null)||LIB.find(i=>norm(i.name)===k||(i.aliases||[]).some(a=>norm(a)===k));if(same){same.aliases=[...new Set([...(same.aliases||[]),...(x.aliases||[]),x.name].filter(Boolean))];same.muscles=[...new Set([...(same.muscles||[]),...(x.muscles||[])])];return}LIB.push(x)}";
 src=once(src,from,to,'late catalog extension canonical id convergence');
 if(!src.includes("LIB.find(i=>String(i?.id||'').trim()===id)"))fail('late catalog extension is not id-first');
 syntax(src,FILE);write(FILE,src);
 console.log('[AXIS 8.9 catalog] late v8711 extensions converge by canonical id before semantic alias matching');
}

console.log('[AXIS 8.9 catalog] PASS · canonical ids stay unique through late runtime extensions');
