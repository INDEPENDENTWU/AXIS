import fs from 'node:fs';

const v61='v61.js';
let s=fs.readFileSync(v61,'utf8');
const anchor='function showQuickEditor(id)';
if(!s.includes(anchor))throw new Error('[AXIS 8.21 source repair] showQuickEditor anchor missing');
if(!s.includes('function ensureQuickMedia(id)')){
  const fn=`function ensureQuickMedia(id){let box=$('#v882QuickMedia');if(!box){box=D.createElement('div');box.id='v882QuickMedia';box.className='v882QuickMedia v817QuickEvidence';box.innerHTML='<span>现场</span><button type="button" class="v817QuickEvidenceBtn" data-v882-media="photo"><span>补拍照片 / 视频</span><i>›</i></button>';$('#saveScan')?.insertAdjacentElement('beforebegin',box);box.onclick=e=>{const b=e.target.closest('[data-v882-media]');if(!b)return;const eq=selected();if(!eq?.id)return toast('请先确认器械');window.__AXIS_CAPTURE__?.beginQuickMedia?.('photo',eq.id)}}box.classList.remove('hidden');box.dataset.eq=id||''}\n`;
  s=s.replace(anchor,fn+anchor);
}
if((s.match(/function ensureQuickMedia\(id\)/g)||[]).length!==1)throw new Error('[AXIS 8.21 source repair] ensureQuickMedia ownership is not singular');
new Function(s);
fs.writeFileSync(v61,s);
fs.rmSync('scripts/axis-821-source-repair.mjs',{force:true});
fs.rmSync('.github/workflows/axis-821-source-repair.yml',{force:true});
console.log('[AXIS 8.21 source repair] PASS · Quick media hook source-owned in v61');
