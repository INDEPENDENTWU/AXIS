import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.5 smart-create polish] ${m}`)};
const f='v873-smart-input.js';
if(!fs.existsSync(f))fail(`missing ${f}`);
let s=fs.readFileSync(f,'utf8');
if(!s.includes('__AXIS_8124_CUSTOM_SAFE__'))fail('custom-search owner must be installed first');
if(s.includes('__AXIS_8125_SMART_CREATE_POLISH__'))fail('polish already installed');

const old='.v873SmartCreate{width:100%;min-height:58px;margin-top:8px;padding:10px 12px;border-radius:14px;background:rgba(115,124,255,.10);display:flex;align-items:center;justify-content:space-between;text-align:left}.v873SmartCreate b{display:block;color:var(--accent2);font-size:12px}.v873SmartCreate small{display:block;margin-top:4px;color:var(--dim);font-size:10px}.v873SmartCreate em{color:var(--accent2);font-style:normal}';
const next='.v873SmartCreate{width:100%;min-height:72px;margin:12px 0 4px;padding:14px 46px 14px 16px;box-sizing:border-box;border-radius:16px;background:rgba(115,124,255,.085);display:flex;align-items:center;justify-content:flex-start;text-align:left;position:relative}.v873SmartCreate>span{display:block;min-width:0}.v873SmartCreate b{display:block;color:var(--accent2);font-size:14px;line-height:1.35;font-weight:650;letter-spacing:0}.v873SmartCreate small{display:block;margin-top:5px;color:#747b88;font-size:11px;line-height:1.45;font-weight:400;letter-spacing:0}.v873SmartCreate em{position:absolute;right:16px;top:50%;transform:translateY(-50%);color:var(--accent2);font-style:normal;font-size:20px;line-height:1}';
const n=s.split(old).length-1;
if(n!==1)fail(`smart-create style expected once, found ${n}`);
s=s.replace(old,next);
const end=s.lastIndexOf('})();');
if(end<0)fail('v873 IIFE end missing');
const marker="\ntry{window.__AXIS_8125_SMART_CREATE_POLISH__={version:'8.12.5',scope:'smart-create-card-only',leftInsetPx:16,rightInsetPx:46,chevronRightPx:16,minHeightPx:72,trainingOwner:false,storageWriter:false}}catch{}\n";
s=s.slice(0,end)+marker+s.slice(end);
try{new Function(s)}catch(e){fail(`syntax ${e.message}`)}
fs.writeFileSync(f,s);
console.log('[AXIS 8.12.5 smart-create polish] PASS · 16px text rail · centered chevron · mature title/subtitle rhythm · no behavior ownership change');
