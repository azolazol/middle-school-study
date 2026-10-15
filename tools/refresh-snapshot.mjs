import fs from 'node:fs/promises';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(await fs.readFile(new URL('docs/config.js',root),'utf8'),ctx);
const url=ctx.window.STUDY_CONFIG.apiUrl;
if(!url)throw new Error('docs/config.js의 apiUrl을 먼저 설정하세요.');
const u=new URL(url);if(u.protocol!=='https:'||u.hostname!=='script.google.com'||!u.pathname.endsWith('/exec'))throw new Error('GAS URL 형식 확인');
const r=await fetch(u,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw new Error('HTTP '+r.status);
const data=await r.json();if(data.schemaVersion!==1||!Array.isArray(data.lessons)||!data.lessons.length||!Array.isArray(data.questions))throw new Error('올바른 학습 자료가 아닙니다. 기존 data.json을 유지합니다.');
for(const rows of [data.lessons,data.questions]){const ids=new Set();for(const row of rows){if(!row.id||ids.has(row.id))throw new Error('중복 ID');ids.add(row.id)}}
const file=new URL('docs/data.json',root);await fs.writeFile(new URL('docs/data.json.tmp',root),JSON.stringify(data,null,2));await fs.rename(new URL('docs/data.json.tmp',root),file);console.log('갱신 완료: '+data.lessons.length+'개 노트, '+data.questions.length+'개 문제');
