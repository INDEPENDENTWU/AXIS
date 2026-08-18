import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.12.3 equipment inline tools] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
if(!src.includes('__AXIS_8123_EQUIPMENT_MEMORY__'))fail('equipment memory must run first');
const re=/function ensureManageEqChrome\(\)\{[\s\S]*?\}\nfunction closeManageEqSwipes/;
const matches=src.match(re)||[];if(matches.length!==1)fail(`equipment chrome owner expected once, found ${matches.length}`);
const replacement=`function ensureManageEqChrome(){
 ensureManageEqStyle();const list=$('#manageEqList');if(!list)return;
 if(!$('#v8123EqToolsStyle')){const s=D.createElement('style');s.id='v8123EqToolsStyle';s.textContent='#v8123EqTools{height:38px;display:flex;align-items:center;justify-content:flex-end;border-bottom:1px solid var(--line2)}#v8123EqTools #myEqSelect{height:34px;min-width:50px;padding:0 2px;text-align:right;color:var(--accent2);font-size:11.5px;font-weight:650}';D.head.appendChild(s)}
 let tools=$('#v8123EqTools');if(!tools){tools=D.createElement('div');tools.id='v8123EqTools';list.insertAdjacentElement('beforebegin',tools)}
 let pick=$('#myEqSelect');if(!pick){pick=D.createElement('button');pick.id='myEqSelect';pick.type='button';pick.textContent='选择';tools.appendChild(pick);pick.onclick=()=>{manageEqSelectMode=!manageEqSelectMode;manageEqSelected.clear();renderManageEq()}}else if(pick.parentElement!==tools)tools.appendChild(pick);
 let bar=$('#v8123EqBatch');if(!bar){bar=D.createElement('div');bar.id='v8123EqBatch';bar.innerHTML='<button type="button" data-my-eq-all>全选</button><button type="button" class="remove" data-my-eq-batch disabled>移除 0 项</button>';$('#newCustomEq')?.insertAdjacentElement('beforebegin',bar);bar.querySelector('[data-my-eq-all]').onclick=()=>{const ids=personalEqLibrary().map(x=>x.id);const all=ids.length&&ids.every(id=>manageEqSelected.has(id));manageEqSelected=all?new Set():new Set(ids);renderManageEq()};bar.querySelector('[data-my-eq-batch]').onclick=()=>{if(manageEqSelected.size)removePersonalEq([...manageEqSelected])}}
 pick.textContent=manageEqSelectMode?'完成':'选择';bar?.classList.toggle('show',manageEqSelectMode)
}
try{window.__AXIS_8123_EQUIPMENT_MEMORY__.inlineManagement=true}catch{}
function closeManageEqSwipes`;
src=src.replace(re,replacement);
for(const needle of ['v8123EqTools','inlineManagement=true'])if(!src.includes(needle))fail(`missing ${needle}`);
try{new Function(src)}catch(e){fail(`app.js syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.3 equipment inline tools] PASS · selection controls remain visible inside inline Settings accordion');
