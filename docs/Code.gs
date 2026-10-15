/** Middle School Study: 공개 학습 자료 읽기 전용 API. 시트 자체는 비공개로 유지합니다. */
const MOKUN_DB_ID = '1laDV8q5znflJtPAABl817zVl7vNhLslVmgGU_K7jUUY';
const LESSON_FIELDS = ['id','subject','term','unit','title','summary','content','recall_question','recall_answer','tags','sort_order','published','source_url'];
const QUESTION_FIELDS = ['id','subject','term','unit','kind','prompt','stem','option1','option2','option3','option4','option5','answer','points','explanation','images_json','sort_order','published','source_url'];
function onOpen() {
  SpreadsheetApp.getUi().createMenu('목운 학습실').addItem('자료 검증','validateStudyData').addItem('배포 주소 확인','showWebAppUrl').addToUi();
}
function setup() {
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  if(!ss || ss.getId()!==MOKUN_DB_ID) throw new Error('목운중_1학년_통합학습_DB의 확장 프로그램 > Apps Script에서 실행하세요.');
  const result=buildPublicData_();
  ss.setSpreadsheetTimeZone('Asia/Seoul');
  onOpen();
  console.log('준비 완료: 노트 '+result.lessons.length+'개, 문제 '+result.questions.length+'개. 배포 > 새 배포 > 웹 앱을 선택하세요.');
}
function isPublished_(v){return v===true || String(v).trim().toUpperCase()==='TRUE';}
function readPublicRows_(ss,name,fields){
  const sheet=ss.getSheetByName(name);
  if(!sheet)throw new Error(name+' 시트가 없습니다.');
  if(sheet.getLastRow()>10000)throw new Error(name+'의 최대 행 수 10000을 초과했습니다.');
  const width=sheet.getLastColumn();
  if(width>100)throw new Error(name+'의 열 수가 너무 많습니다.');
  const rows=sheet.getRange(1,1,Math.max(1,sheet.getLastRow()),width).getValues();
  const headers=rows.shift().map(v=>String(v).trim());
  for(const f of fields)if(headers.indexOf(f)<0||headers.indexOf(f)!==headers.lastIndexOf(f))throw new Error(name+' 헤더 확인: '+f);
  return rows.filter(r=>isPublished_(r[headers.indexOf('published')])).map(r=>{const o={};fields.forEach(f=>o[f]=r[headers.indexOf(f)]);return o;});
}
function text_(v){return v===null||v===undefined?'':String(v);}
function assertBase_(row,seen,name){
  row.id=text_(row.id).trim();
  if(!/^[a-zA-Z0-9_-]{1,100}$/.test(row.id)||seen[row.id])throw new Error(name+': ID 누락·중복 또는 지원하지 않는 문자');
  seen[row.id]=true;
  for(const f of ['subject','term','unit']){row[f]=text_(row[f]).trim();if(!row[f])throw new Error(name+' '+row.id+': '+f+' 누락');}
  row.sort_order=Number(row.sort_order)||0;row.published=true;
}
function buildPublicData_(){
  const ss=SpreadsheetApp.openById(MOKUN_DB_ID),ls=readPublicRows_(ss,'Lessons',LESSON_FIELDS),qs=readPublicRows_(ss,'Questions',QUESTION_FIELDS),seenL=Object.create(null),seenQ=Object.create(null);
  const lessons=ls.map(r=>{assertBase_(r,seenL,'Lessons');for(const f of ['title','summary','content','recall_question','recall_answer','tags','source_url'])r[f]=text_(r[f]);if(!r.title||!r.content)throw new Error('Lessons '+r.id+': 제목 또는 본문 누락');return r;});
  const questions=qs.map(r=>{assertBase_(r,seenQ,'Questions');const opts=[r.option1,r.option2,r.option3,r.option4,r.option5].map(text_);while(opts.length&&!opts[opts.length-1])opts.pop();if(opts.length<2||opts.some(x=>!x))throw new Error('Questions '+r.id+': 선택지를 순서대로 입력하세요.');
    const answer=Number(r.answer),points=Number(r.points);if(!Number.isInteger(answer)||answer<1||answer>opts.length||!Number.isFinite(points)||points<=0)throw new Error('Questions '+r.id+': 정답 또는 배점 확인');
    let images;try{images=JSON.parse(text_(r.images_json)||'[]');}catch(e){throw new Error('Questions '+r.id+': images_json 형식 확인');}
    if(!Array.isArray(images)||!images.every(x=>typeof x==='string'&&(/^assets\/[a-zA-Z0-9_./-]+$/.test(x)&&!x.includes('..')||/^https:\/\//.test(x))))throw new Error('Questions '+r.id+': 그림 경로 확인');
    return {id:r.id,subject:r.subject,term:r.term,unit:r.unit,kind:text_(r.kind),prompt:text_(r.prompt),stem:text_(r.stem),options:opts,answer,points,explanation:text_(r.explanation),images,sort_order:r.sort_order,published:true,source_url:text_(r.source_url)};
  });
  if(!lessons.length)throw new Error('공개된 학습 노트가 없습니다.');
  return {schemaVersion:1,updatedAt:new Date().toISOString(),title:'Middle School Study',lessons,questions};
}
function doGet(e){
  const cb=e&&e.parameter?e.parameter.callback||'':'';
  if(cb&&!/^mokunCallback_[0-9]{10,20}$/.test(cb))return ContentService.createTextOutput(JSON.stringify({error:'지원하지 않는 callback입니다.'})).setMimeType(ContentService.MimeType.JSON);
  let result;try{result=buildPublicData_();}catch(err){console.error(err);result={error:'학습 자료를 불러오지 못했습니다. 관리자가 자료 검증을 실행해 주세요.'};}
  const json=JSON.stringify(result).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  return ContentService.createTextOutput(cb?cb+'('+json+');':json).setMimeType(cb?ContentService.MimeType.JAVASCRIPT:ContentService.MimeType.JSON);
}
function validateStudyData(){const d=buildPublicData_();SpreadsheetApp.getUi().alert('자료 검증 완료\n노트 '+d.lessons.length+'개\n문제 '+d.questions.length+'개\n공개 TRUE 행만 서비스됩니다.');}
function showWebAppUrl(){SpreadsheetApp.getUi().alert(ScriptApp.getService().getUrl()||'먼저 배포 > 새 배포 > 웹 앱에서 배포하세요.');}
// doPost와 외부 쓰기 API를 제공하지 않습니다. 수정은 시트 소유자/편집자만 수행합니다.
