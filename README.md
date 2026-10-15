# Middle School Study

영어·국어 핵심 노트, 사회 아시아 개념 및 실제 시험, 「하늘은 맑건만」 어휘를 통합합니다.

- 노트·어휘·과학 풀이 142개, 문제 102개(사회 연습 32 + 실제 시험 30 + 어휘 40)
- 사회 실제 시험은 원 번호·선택지·배점 유지, 전체 100점
- 과목·범위·단원 필터, 검색, 암기 카드, 문제 풀이, 오답 복습과 개인 메모
- 개인 진도·오답은 localStorage에 저장, JSON 내보내기/가져오기 지원
- 기존 영어국어 사이트의 같은 브라우저·같은 주소 기록은 최초 실행 때 이전
- 기존 사회·어휘 사이트의 다른 주소 기록은 자동 이전되지 않음

## 파일

- `docs/`: GitHub Pages 배포 루트
- `docs/config.js`: 읽기 전용 GAS 웹앱 URL. 비어 있으면 `data.json`으로 동작
- `docs/data.json`: 연결 전·장애 시 사용하는 기본 학습 자료
- `docs/assets/`: 시험 문항에 필요한 그림 12개(전체 시험지·인적사항은 제외)
- `gas/Code.gs`: 비공개 시트에서 공개 학습 열만 제공하는 읽기 전용 API
- `gas/appsscript.json`: 선택적으로 적용할 GAS 설정
- `tools/refresh-snapshot.mjs`: GAS 자료를 기본 JSON에 반영

## Google Sheets

https://docs.google.com/spreadsheets/d/1laDV8q5znflJtPAABl817zVl7vNhLslVmgGU_K7jUUY/edit

Guide / Lessons / Questions 3개 탭. 데이터를 편집할 때 기존 고유 ID는 유지합니다.
학기·시험 범위는 term, 단원은 unit에 새 값을 넣어 확장합니다.
공개할 행만 published=TRUE로 설정합니다. API는 미공개 행, 기타 시트, 추가 개인 정보 열을 내보내지 않습니다.

## 1회 설치

1. Google Sheets > 확장 프로그램 > Apps Script에서 `gas/Code.gs` 붙여넣기.
2. `setup` 실행 및 스프레드시트 권한 승인.
3. 배포 > 새 배포 > 웹 앱. 실행: 나. 액세스: 모든 사용자.
4. `/exec` URL을 `docs/config.js`의 `apiUrl`에 입력.
5. Azolazol 소유의 public 저장소 `middle-school-study`를 README 포함으로 생성.
6. 이 패키지의 파일을 저장소에 업로드.
7. Settings > Pages > Deploy from a branch > main /docs > Save.
8. Pages가 알려주는 배포 주소에서 과목·검색·문제·그림·GAS 갱신을 확인.

현재 패키지는 GAS 웹앱 URL이 연결되지 않은 상태입니다. 사이트는 이미 포함된 자료로 학습할 수 있습니다.
웹앱 배포가 완료되고 config.js가 갱신되어야 시트 수정이 사이트에 실시간 반영됩니다.

## 업데이트

채리에게 새 수업 자료와 DB 링크를 알려 주세요. Lessons/Questions에 새 행을 추가하면 됩니다.
- 노트 content: `## 소제목` 다음 줄에 설명 작성. HTML은 실행되지 않고 텍스트로 표시.
- 문제 answer: 1부터 시작하는 정답 번호. option1부터 빈칸 없이 입력.
- images_json: `["assets/example.jpg"]`. 이미지 파일도 docs/assets에 추가.
- 같은 단원·문제를 수정할 때는 id 유지, 새 자료는 새 id 사용.
- 스크립트 코드가 바뀌면 GAS 배포 관리에서 새 버전으로 배포. 시트 내용만 바꾸면 재배포 불필요.
- 기본 자료 동기화: Node 18 이상에서 `node tools/refresh-snapshot.mjs` 실행 후 변경된 docs/data.json 커밋.
- 실행 자동화나 AI API 키는 필요 없습니다.

## 검증과 한계

문항 수·배점·정답 인덱스·고유 ID·그림 경로 및 GAS 공개행 필터를 검사했습니다.
Google Sheets는 읽기 확인을 수행했습니다. 사용자 브라우저 화면 검수 완료(2026-10-15). GAS 배포 후 연결 검수는 별도로 필요합니다.

## 데이터 출처

사용자가 제공한 학습 노트와 시험지를 바탕으로 이전에 만든 아래 사이트의 원본 자료를 이전했습니다.
- https://mokun-midterm.adored-char-7024.chatgpt.site
- https://social-asia-midterm.adored-char-7024.chatgpt.site
- https://clear-sky-vocab.adored-char-7024.chatgpt.site

학교 공식 사이트가 아닙니다. 「하늘은 맑건만」 어휘 예문은 학습용으로 새로 만든 문장입니다.
개인정보·API 비밀키·GitHub 토큰을 공개 저장소나 학습 시트에 넣지 마세요.

## 메뉴 확장
과목(subject) → 학습 범위(term) → 단원(unit) 구조입니다. term에 1학년 2학기 기말고사, 2학년 1학기 중간고사 등을 추가하면 메뉴가 자동 생성됩니다. 국어 문학은 term=하늘은 맑건만으로 분리합니다. 과학 term은 열, 태양계, 힘의 작용입니다. 기존 id는 학습 기록 연결을 위해 유지하세요.
