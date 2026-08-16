import fs from 'node:fs';
const f='prepare-8103-home-sound.mjs';
let s=fs.readFileSync(f,'utf8');
const old=` src=once(src,"parts.push('完成于 '+tlabel(end));","parts.unshift('开始 '+tlabel(last.start));parts.push('完成 '+tlabel(end));",'completed start/end facts');`;
const next=` if(src.includes("parts.push('完成于 '+tlabel(end));"))src=src.replace("parts.push('完成于 '+tlabel(end));","parts.unshift('开始 '+tlabel(last.start));parts.push('完成 '+tlabel(end));");else{src=once(src,"return{...base,scope:'complete'","parts.unshift('开始 '+tlabel(last.start));return{...base,scope:'complete'",'completed start fact fallback');src=src.replaceAll('完成于 ','完成 ')}`;
const n=s.split(old).length-1;if(n!==1)throw new Error('AXIS 8.10.3 home/sound compat: target line changed');
s=s.replace(old,next);fs.writeFileSync(f,s);
console.log('[AXIS 8.10.3 home/sound compat] PASS · completed Home facts support inherited compiler variants');
