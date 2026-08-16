import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const FILE='prepare-882-convergence.mjs';
const TMP='.axis-882-convergence.generated.mjs';
let src=fs.readFileSync(FILE,'utf8');
const block=`  src=once(src,"const fp=fpFromCanvas(cv),ts=captureSeal(cv),blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.8));return{blob,url:URL.createObjectURL(blob),ts,fp}","const fp=fpFromCanvas(cv),sig=visualSigFromCanvas(cv),ts=captureSeal(cv),blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.8));return{blob,url:URL.createObjectURL(blob),ts,fp,sig}",'camera local signature');
  src=once(src,"const fp=fpFromCanvas(cv),ts=captureSeal(cv),blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.8));return{blob,url:URL.createObjectURL(blob),ts,fp}","const fp=fpFromCanvas(cv),sig=visualSigFromCanvas(cv),ts=captureSeal(cv),blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.8));return{blob,url:URL.createObjectURL(blob),ts,fp,sig}",'file local signature');`;
const replacement=`  {const from="const fp=fpFromCanvas(cv),ts=captureSeal(cv),blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.8));return{blob,url:URL.createObjectURL(blob),ts,fp}",to="const fp=fpFromCanvas(cv),sig=visualSigFromCanvas(cv),ts=captureSeal(cv),blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.8));return{blob,url:URL.createObjectURL(blob),ts,fp,sig}",n=src.split(from).length-1;if(n!==2)fail(\`frame local signature expected exactly 2, found \${n}\`);src=src.split(from).join(to)}`;
const hits=src.split(block).length-1;
if(hits!==1)throw new Error(`AXIS 8.8.2 convergence driver: dual-frame compiler block expected once, found ${hits}`);
src=src.replace(block,replacement);
fs.writeFileSync(TMP,src);
try{execFileSync(process.execPath,[TMP],{stdio:'inherit'})}finally{try{fs.unlinkSync(TMP)}catch{}}
