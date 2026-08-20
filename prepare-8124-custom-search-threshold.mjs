import fs from 'node:fs';

const FILE='v873-smart-input.js';
const fail=m=>{throw new Error(`[AXIS 8.12.4 custom search threshold] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
if(!src.includes('__AXIS_8124_CUSTOM_SAFE__'))fail('safe custom search extension must run first');
const create='create=best<86?';
const label="rs.length&&best>=86?'匹配结果':'没有足够匹配'";
const order="+'</div>'+rs.map(({x})=>";
const tail=").join('')+create;host.classList.add('show')}";
if(src.split(create).length-1!==1)fail('direct-create threshold boundary missing');
if(src.split(label).length-1!==1)fail('search-label threshold boundary missing');
if(src.split(order).length-1!==1||src.split(tail).length-1!==1)fail('search result/create order boundary missing');
src=src.replace(create,'create=best<108?').replace(label,"rs.length&&best>=108?'匹配结果':'没有足够匹配'").replace(order,"+'</div>'+create+rs.map(({x})=>").replace(tail,").join('');host.classList.add('show')}");
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.4 custom search threshold] PASS · exact/prefix/meaningful substring matches stay selection-first · semantic-only hits expose direct create as the first reachable action');
