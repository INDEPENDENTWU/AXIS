import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.4 taxonomy coverage seal] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,a,b,label)=>{const n=src.split(a).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(a,b)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/* The 8.9 catalog expands v873 before 8.12.4 enrichment. Give every expanded native
   movement a movement-specific target instead of falling back to a coarse body group. */
{
 const FILE='v873-exercise-library.js';let src=read(FILE);
 const anchor="const AXIS8124_COARSE={'胸肌':['胸部整体']";
 const extra=String.raw`axis8124Target(['plate-chest-press'],['胸大肌中部'],['三角肌前束','肱三头肌'],'器械水平推');
axis8124Target(['machine-incline-press'],['胸大肌上部'],['三角肌前束','肱三头肌'],'器械上斜推');
axis8124Target(['machine-decline-press'],['胸大肌下部'],['肱三头肌','三角肌前束'],'器械下斜推');
axis8124Target(['high-row-machine'],['背阔肌','大圆肌'],['菱形肌','斜方肌中下束','肱二头肌','三角肌后束'],'高位水平拉');
axis8124Target(['low-row-machine'],['背阔肌','菱形肌'],['斜方肌中下束','肱二头肌','三角肌后束'],'低位水平拉');
axis8124Target(['assisted-pullup'],['背阔肌'],['肱二头肌','斜方肌中下束'],'辅助垂直拉');
axis8124Target(['machine-lateral'],['三角肌中束'],['冈上肌'],'器械肩外展');
axis8124Target(['machine-biceps'],['肱二头肌'],['肱肌'],'器械肘屈曲');
axis8124Target(['machine-triceps'],['肱三头肌'],[],'器械肘伸展');
axis8124Target(['v-squat'],['股四头肌','臀大肌'],['内收肌群','腘绳肌'],'V型深蹲');
axis8124Target(['glute-drive'],['臀大肌'],['腘绳肌'],'器械髋伸展');
axis8124Target(['standing-calf-machine'],['腓肠肌'],['比目鱼肌'],'站姿踝跖屈');
axis8124Target(['seated-calf-machine'],['比目鱼肌'],['腓肠肌'],'坐姿踝跖屈');
axis8124Target(['landmine-press'],['三角肌前束','胸大肌上部'],['肱三头肌'],'斜向推');
axis8124Target(['stair-climber'],['心肺','股四头肌','臀大肌'],['腓肠肌'],'登阶耐力');
axis8124Target(['ski-erg'],['心肺','背阔肌','肱三头肌'],['腹直肌','腹外斜肌'],'上肢主导滑雪耐力');
axis8124Target(['sled-pull'],['臀大肌','股四头肌'],['腘绳肌','腓肠肌','前臂屈肌群'],'雪橇牵引');
axis8124Target(['suitcase-carry'],['腹外斜肌','腹内斜肌','腰方肌'],['前臂屈肌群','臀中肌'],'单侧负重抗侧屈');
`;
 src=once(src,anchor,extra+anchor,'expanded native explicit targets');
 for(const id of ['plate-chest-press','high-row-machine','v-squat','ski-erg','suitcase-carry'])if(!src.includes(`axis8124Target(['${id}']`))fail(`expanded target missing ${id}`);
 syntax(src,FILE);write(FILE,src);
}

/* v8711 adds a small compatibility catalog after v873 has already executed. Enrich
   only those final native movement objects in place; identity and coarse muscles stay intact. */
{
 const FILE='v8711-runtime.js';let src=read(FILE);
 const fnAnchor='function extendLibrary(){';
 const fn=String.raw`const AXIS8124_LATE_TARGETS={
 'smith-squat':[['股四头肌','臀大肌'],['腘绳肌','内收肌群'],[],'史密斯深蹲'],
 'smith-bench':[['胸大肌中部'],['三角肌前束','肱三头肌'],[],'史密斯水平推'],
 'smith-shoulder':[['三角肌前束','三角肌中束'],['肱三头肌'],[],'史密斯垂直推'],
 'leg-extension':[['股四头肌'],[],[],'膝伸展'],
 'seated-leg-curl':[['腘绳肌'],[],[],'坐姿膝屈曲'],
 'lying-leg-curl':[['腘绳肌'],[],[],'俯卧膝屈曲'],
 'hip-abductor':[['臀中肌 / 臀小肌'],[],[],'髋外展'],
 'hip-adductor':[['内收肌群'],[],[],'髋内收'],
 'glute-kickback':[['臀大肌'],[],[],'髋伸展'],
 'assisted-pullup':[['背阔肌'],['肱二头肌','斜方肌中下束'],[],'辅助垂直拉'],
 'assisted-dip':[['肱三头肌','胸大肌下部'],['三角肌前束'],[],'辅助双杠推'],
 'tbar-row':[['背阔肌','菱形肌'],['斜方肌中下束','肱二头肌','三角肌后束'],[],'T杠水平拉'],
 'reverse-pecdeck':[['三角肌后束'],['菱形肌','斜方肌中下束'],[],'肩水平外展'],
 'preacher-curl':[['肱二头肌'],['肱肌'],[],'支撑肘屈曲'],
 'cable-pushdown':[['肱三头肌'],[],[],'绳索肘伸展'],
 'overhead-extension':[['肱三头肌'],[],[],'过头肘伸展'],
 'cable-curl':[['肱二头肌'],['肱肌'],[],'绳索肘屈曲'],
 'machine-lateral':[['三角肌中束'],['冈上肌'],[],'器械肩外展'],
 'machine-press':[['三角肌前束','三角肌中束'],['肱三头肌'],[],'器械垂直推'],
 'stair-climber':[['心肺','股四头肌','臀大肌'],['腓肠肌'],[],'登阶耐力'],
 'spin-bike':[['心肺','股四头肌'],['臀大肌','腘绳肌'],[],'室内骑行耐力'],
 'row-erg':[['心肺','背阔肌','股四头肌'],['臀大肌','腘绳肌','肱二头肌'],['腹横肌'],'划船耐力'],
 'ski-erg':[['心肺','背阔肌','肱三头肌'],['腹直肌','腹外斜肌'],[],'上肢主导滑雪耐力'],
 'sled-push':[['股四头肌','臀大肌'],['腓肠肌','腘绳肌'],['腹横肌'],'雪橇推进'],
 'sled-pull':[['臀大肌','股四头肌'],['腘绳肌','腓肠肌','前臂屈肌群'],['腹横肌'],'雪橇牵引'],
 'farmer-carry':[['前臂屈肌群','斜方肌上束'],['腹横肌','腹外斜肌','臀中肌'],['多裂肌'],'双侧负重行走'],
 'kettlebell-swing':[['臀大肌','腘绳肌'],['竖脊肌'],['腹横肌'],'爆发髋伸展'],
 'battle-rope':[['心肺','三角肌前束'],['前臂屈肌群','腹横肌'],[],'上肢循环耐力'],
 'trx-row':[['背阔肌','菱形肌'],['斜方肌中下束','肱二头肌','三角肌后束'],['腹横肌'],'悬挂水平拉'],
 'band-row':[['背阔肌','菱形肌'],['斜方肌中下束','肱二头肌','三角肌后束'],[],'弹力带水平拉'],
 'pull-up':[['背阔肌'],['肱二头肌','斜方肌中下束'],[],'垂直拉'],
 'dip':[['胸大肌下部','肱三头肌'],['三角肌前束'],[],'双杠推'],
 'bulgarian-split':[['股四头肌','臀大肌'],['腘绳肌','内收肌群'],['臀中肌'],'单腿蹲'],
 'rdl':[['腘绳肌','臀大肌'],['竖脊肌'],['腹横肌'],'髋铰链'],
 'hip-thrust':[['臀大肌'],['腘绳肌'],[],'髋伸展'],
 'calf-raise':[['腓肠肌','比目鱼肌'],[],[],'踝跖屈']
};
function axis8124LateRegion(x){return /胸/.test(x)?'胸':/背|阔|大圆|斜方|菱形|竖脊/.test(x)?'背':/肩|三角|冈上/.test(x)?'肩':/肱|前臂/.test(x)?'手臂':/腹|核心|多裂|腰方/.test(x)?'核心':/臀|股|腘|内收|腓肠|比目鱼/.test(x)?'臀腿':/心肺|耐力/.test(x)?'心肺':'全身'}
function axis8124EnrichLateCatalog(){for(const x of LIB){const t=AXIS8124_LATE_TARGETS[x.id];if(!t||x.primaryTargets?.length)continue;const [primary,secondary,stabilizers,pattern]=t,details=[...new Set([...primary,...secondary])];x.primaryTargets=[...primary];x.secondaryTargets=[...secondary];x.stabilizers=[...stabilizers];x.detailMuscles=details;x.bodyRegions=[...new Set(details.map(axis8124LateRegion))];x.movementPattern=pattern;x.equipmentClass=x.type==='cardio'?'有氧设备 / 运动':/smith/i.test(x.id)?'史密斯机':/cable/.test(x.id)?'绳索':/band/.test(x.id)?'弹力带':/machine|extension|curl|abductor|adductor/.test(x.id)?'固定器械':'动作';x.targetKind='movement';x.variableTargets=false;x.targetConfidence='canonical-late'}}
`;
 src=once(src,fnAnchor,fn+fnAnchor,'late native taxonomy function');
 src=once(src,'xs.forEach(addExercise);','xs.forEach(addExercise);axis8124EnrichLateCatalog();','late native taxonomy application');
 const end=src.lastIndexOf('})();');if(end<0)fail('v8711 runtime end missing');
 const marker="\ntry{window.__AXIS_8124_LATE_TAXONOMY__={version:'8.12.4',owner:'v8711-native-extension',coverage:'explicit-native-extension',storageWriter:false}}catch{}\n";
 src=src.slice(0,end)+marker+src.slice(end);
 for(const id of ['smith-squat','assisted-dip','sled-push','farmer-carry','battle-rope','trx-row'])if(!src.includes(`'${id}':[`))fail(`late target missing ${id}`);
 if(src.includes("'器械 / 动作'"))fail('late free movement mislabeled as generic equipment');
 syntax(src,FILE);write(FILE,src);
}

console.log('[AXIS 8.12.4 taxonomy coverage seal] PASS · expanded native catalog + late native extensions have explicit targets and precise equipment semantics');
