# BeautyPalette

퍼스널 컬러 · 얼굴 분석 · 추구미 기반 맞춤 뷰티 추천 웹 서비스 (중간 발표용 프로토타입)

## 실행 방법
설치할 것은 없습니다. 아래 중 편한 방법을 쓰세요.

1. **VS Code에서 F5** : VS Code에서 이 폴더를 열고(File → Open Folder) `F5`를 누르면 Edge로 `index.html`이 열립니다.
   (Chrome을 쓰려면 왼쪽 "실행 및 디버그"에서 `BeautyPalette 열기 (Chrome)` 선택)
2. **Live Server** : 오른쪽 아래 `Go Live` 클릭
3. **더블클릭** : 파일 탐색기에서 `index.html` 더블클릭

## 파일 구조
```
index.html      홈 (서비스 소개, 진단 시작, 트렌드 카드)
login.html      로그인
signup.html     회원가입
test.html       셀프 진단 (퍼스널 컬러 7 + 얼굴 분석 4 + 추구미 1 = 12문항)
analysis.html   진단 원리 (점수 계산표, 4계절 팔레트)
result.html     결과 카드 (팔레트, 얼굴 분석 팁, 추구미 가이드)
recommend.html  톤/카테고리별 제품 추천 + 추구미별 메이크업 가이드
css/style.css   공통 디자인
js/data.js      설문 문항, 계절 타입, 팁, 제품 데이터
js/app.js       로그인, 진단 로직, 페이지별 화면 출력
```

## 진단 로직
1. 답변마다 `warm / cool / light / deep` 점수를 더함
2. 웜 vs 쿨, 라이트 vs 딥 중 더 높은 쪽으로 판정
3. 웜+라이트 = 봄, 웜+딥 = 가을, 쿨+라이트 = 여름, 쿨+딥 = 겨울
4. 계절 × 얼굴형 × 추구미 조합으로 결과 가이드와 제품 추천

## 현재 한계 / 다음 단계
- 로그인과 결과 저장은 브라우저 localStorage에 임시로 저장됨 → 서버/DB 연동 필요 (비밀번호 암호화 포함)
- 제품 데이터는 시연용 샘플 → 실제 제품 DB 구축 또는 크롤링/API 연동
- 트렌드 카드 내용을 관리자 페이지에서 수정할 수 있게 개선
