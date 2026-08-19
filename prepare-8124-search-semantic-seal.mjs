import fs from 'node:fs';

const FILE='v873-smart-input.js';
const fail=m=>{throw new Error(`[AXIS 8.12.4 search semantic seal] ${m}`)};
const once=(src,a,b,label)=>{const n=src.split(a).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(a,b)};
let src=fs.readFileSync(FILE,'utf8');

const from="const axis8124SearchCache=new WeakMap();\nfunction searchText(item){if(!item||typeof item!=='object')return[];const hit=axis8124SearchCache.get(item);if(hit)return hit;const raw=[item.name,...(item.aliases||[]),...(item.muscles||[]).flatMap(muscleTerms),...(item.detailMuscles||[]),...(item.primaryTargets||[]),...(item.secondaryTargets||[]),...(item.bodyRegions||[]),item.movementPattern,item.equipmentClass,item.type,item.subtype,item.metaText];const out=[...new Set(raw.map(norm).filter(Boolean))];axis8124SearchCache.set(item,out);return out}";
const to=`const axis8124SearchCache=new WeakMap();
const AXIS8124_REGION_TERMS={胸:['胸','胸部','胸肌'],背:['背','背部','背肌'],肩:['肩','肩部','肩膀'],手臂:['手臂','上臂','臂部'],核心:['核心','腹部','腰腹'],臀腿:['臀腿','臀部','腿部','下肢'],心肺:['心肺','有氧','耐力']};
function axis8124SemanticTerms(item){const out=[],type=String(item?.type||'').toLowerCase(),kind=String(item?.targetKind||'');if(type==='strength')out.push('力量','力量训练','抗阻','抗阻训练');else if(type==='cardio')out.push('有氧','有氧运动','心肺','心肺训练');if(kind==='equipment')out.push('器械','设备','器材');else if(kind==='movement')out.push('动作','训练动作','运动');for(const r of item?.bodyRegions||[])out.push(...(AXIS8124_REGION_TERMS[r]||[r]));const cls=String(item?.equipmentClass||'');if(/固定器械|史密斯机/.test(cls))out.push('器械','固定器械','机器');if(/绳索/.test(cls))out.push('绳索','龙门架','器械');if(/哑铃/.test(cls))out.push('哑铃','自由重量');if(/杠铃/.test(cls))out.push('杠铃','自由重量');if(/弹力带/.test(cls))out.push('弹力带','阻力带');return out}
function searchText(item){if(!item||typeof item!=='object')return[];const hit=axis8124SearchCache.get(item);if(hit)return hit;const raw=[item.name,...(item.aliases||[]),...(item.muscles||[]).flatMap(muscleTerms),...(item.detailMuscles||[]),...(item.primaryTargets||[]),...(item.secondaryTargets||[]),...(item.bodyRegions||[]),item.movementPattern,item.equipmentClass,item.type,item.subtype,item.metaText,...axis8124SemanticTerms(item)];const out=[...new Set(raw.map(norm).filter(Boolean))];axis8124SearchCache.set(item,out);return out}`;
src=once(src,from,to,'semantic search token layer');

const end=src.lastIndexOf('})();');if(end<0)fail('smart input runtime end missing');
const marker="\ntry{window.__AXIS_8124_SEARCH_SEMANTICS__={version:'8.12.4',owner:'v873-search-index',typeTerms:['力量','有氧'],regionTerms:true,equipmentTerms:true,storageWriter:false}}catch{}\n";
src=src.slice(0,end)+marker+src.slice(end);
for(const needle of ['AXIS8124_REGION_TERMS',"out.push('力量','力量训练','抗阻','抗阻训练')","out.push('绳索','龙门架','器械')",'__AXIS_8124_SEARCH_SEMANTICS__'])if(!src.includes(needle))fail(`missing ${needle}`);
try{new Function(src)}catch(e){fail(`smart input syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.4 search semantic seal] PASS · Chinese type / body-region / equipment semantics indexed without fuzzy overreach');
