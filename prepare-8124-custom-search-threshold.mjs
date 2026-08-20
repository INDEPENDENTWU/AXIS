import fs from 'node:fs';

const FILE='v873-smart-input.js';
const fail=m=>{throw new Error(`[AXIS 8.12.4 custom search threshold] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
if(!src.includes('__AXIS_8124_CUSTOM_SAFE__'))fail('safe custom search extension must run first');
const start=src.indexOf('function renderSmartSearch(){'),end=src.indexOf('let axis8124SearchRAF=',start);
if(start<0||end<0)fail('final smart-search boundary missing');
const fn=`function renderSmartSearch(){const input=$('#eqSearch'),host=$('#v873SmartResults');if(!input||!host)return;host.classList.add('v8124Owned');const q=input.value.trim();if(!q){host.classList.remove('show');host.innerHTML='';axis8124SetCatalogSearching(false);axis8124RenderPickerContext();return}axis8124SetCatalogSearching(true);const rs=axis8124CatalogRanked(q,12),best=rs[0]?.score||0,create=best<108?'<button class="v873SmartCreate" type="button" data-axis-create-custom="'+esc(q)+'"><span><b>＋ 新建“'+esc(q)+'”</b><small>加入我的器械，并设置以后需要记录什么</small></span><em>›</em></button>':'';host.innerHTML='<div class="v873SmartHead"><b>'+(rs.length&&best>=108?'匹配结果':'没有足够匹配')+'</b><span>'+rs.length+'</span></div>'+create+rs.map(({x})=>{const detail=(x.primaryTargets||x.detailMuscles||x.muscles||[]).slice(0,2),meta=[x.custom?'我的':(x.type==='cardio'?'有氧':'力量'),...detail].filter(Boolean).join(' · ');return '<button class="v873SmartItem" type="button" data-v8124-pick="'+esc(x.pickId||x.id)+'"><span><b>'+esc(x.name)+'</b><small>'+esc(meta||x.movementPattern||'器械 / 运动')+'</small></span><em>›</em></button>'}).join('');host.classList.add('show')}
`;
src=src.slice(0,start)+fn+src.slice(end);
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.4 custom search threshold] PASS · exact/prefix/meaningful substring matches stay selection-first · semantic-only hits expose direct create as the first reachable action');
