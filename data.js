/* =========================================================
   BeautyPalette 데이터
   - 설문 문항, 계절 타입, 얼굴 분석 팁, 추구미, 제품 목록
   - 제품은 시연용 샘플 데이터입니다 (추후 DB/API로 교체)
   ========================================================= */

/* ---------- 설문 문항 ----------
   score : 퍼스널 컬러 점수 (warm/cool = 온도, light/deep = 명도)
   set   : 얼굴 분석 / 추구미 결과 값                       */
const QUESTIONS = [
  // ===== 1단계: 퍼스널 컬러 =====
  {
    section: 'color',
    title: '맨얼굴의 피부색과 가장 가까운 것은?',
    hint: '자연광 아래에서 거울을 보고 골라 주세요.',
    options: [
      { label: '밝고 노르스름한 피부', color: '#F3D9BC', score: { warm: 1, light: 1 } },
      { label: '밝고 핑크빛이 도는 피부', color: '#F6DCD8', score: { cool: 1, light: 1 } },
      { label: '어둡고 황갈색 피부', color: '#C99A6E', score: { warm: 1, deep: 1 } },
      { label: '어둡고 붉은기/올리브 피부', color: '#B98A7E', score: { cool: 1, deep: 1 } },
    ],
  },
  {
    section: 'color',
    title: '손목 안쪽 혈관은 어떤 색인가요?',
    hint: '혈관 색은 웜/쿨 판단에 가장 큰 비중(2점)을 가져요.',
    options: [
      { label: '초록빛에 가깝다', color: '#7FA67A', score: { warm: 2 } },
      { label: '파란빛·보랏빛에 가깝다', color: '#7C8DC2', score: { cool: 2 } },
      { label: '잘 모르겠다 / 섞여 있다', color: '#A9A3A0', score: {} },
    ],
  },
  {
    section: 'color',
    title: '얼굴이 더 화사해 보이는 액세서리는?',
    hint: '',
    options: [
      { label: '골드', color: '#D9B25F', score: { warm: 1 } },
      { label: '실버', color: '#C9CCD3', score: { cool: 1 } },
      { label: '둘 다 비슷하다', color: '#E4D6C8', score: {} },
    ],
  },
  {
    section: 'color',
    title: '햇볕에 오래 있으면 피부가?',
    hint: '',
    options: [
      { label: '쉽게 까맣게 탄다', color: '#B98057', score: { warm: 1 } },
      { label: '빨갛게 달아올랐다가 돌아온다', color: '#E79A93', score: { cool: 1 } },
    ],
  },
  {
    section: 'color',
    title: '눈동자 색은 어떤가요?',
    hint: '',
    options: [
      { label: '밝은 갈색, 투명한 느낌', color: '#A87545', score: { light: 1 } },
      { label: '짙은 흑갈색, 깊은 느낌', color: '#3B2A22', score: { deep: 1 } },
    ],
  },
  {
    section: 'color',
    title: '염색하지 않은 머리카락 색은?',
    hint: '',
    options: [
      { label: '밝은 갈색, 가늘고 부드러움', color: '#8A5E3C', score: { light: 1 } },
      { label: '짙은 흑발, 굵고 힘 있음', color: '#1F1A18', score: { deep: 1 } },
    ],
  },
  {
    section: 'color',
    title: '입었을 때 "얼굴 좋아 보인다"는 말을 듣는 옷 색은?',
    hint: '',
    options: [
      { label: '파스텔처럼 밝고 연한 색', color: '#F3D1DC', score: { light: 1 } },
      { label: '진하고 깊이감 있는 색', color: '#6B2E3A', score: { deep: 1 } },
      { label: '노랑·오렌지·카키 계열', color: '#E3A44F', score: { warm: 1 } },
      { label: '블루·핑크·퍼플 계열', color: '#8F8BD0', score: { cool: 1 } },
    ],
  },

  // ===== 2단계: 얼굴 분석 =====
  {
    section: 'face',
    title: '내 얼굴형과 가장 가까운 것은?',
    hint: '머리를 모두 넘기고 정면에서 윤곽선을 확인해 보세요.',
    options: [
      { label: '둥근형', sub: '가로·세로 길이가 비슷하고 볼이 통통', set: { shape: 'round' } },
      { label: '계란형', sub: '이마가 턱보다 살짝 넓고 갸름', set: { shape: 'oval' } },
      { label: '긴 얼굴형', sub: '세로 길이가 가로보다 확연히 긺', set: { shape: 'long' } },
      { label: '각진형', sub: '턱선이 뚜렷하고 각이 있음', set: { shape: 'square' } },
      { label: '하트형', sub: '이마가 넓고 턱이 뾰족함', set: { shape: 'heart' } },
    ],
  },
  {
    section: 'face',
    title: '상·중·하안부 중 가장 길어 보이는 곳은?',
    hint: '상안부: 헤어라인~눈썹 / 중안부: 눈썹~코끝 / 하안부: 코끝~턱끝',
    options: [
      { label: '상안부 (이마)', set: { ratio: 'upper' } },
      { label: '중안부 (눈썹~코끝)', set: { ratio: 'middle' } },
      { label: '하안부 (코끝~턱)', set: { ratio: 'lower' } },
      { label: '비슷하다 (균형형)', set: { ratio: 'balanced' } },
    ],
  },
  {
    section: 'face',
    title: '내 눈매의 특징은?',
    hint: '',
    options: [
      { label: '동그랗고 큰 눈', set: { eye: 'round' } },
      { label: '가로로 길고 가는 눈', set: { eye: 'long' } },
      { label: '눈꼬리가 올라간 눈', set: { eye: 'up' } },
      { label: '눈꼬리가 처진 눈', set: { eye: 'down' } },
    ],
  },
  {
    section: 'face',
    title: '전체적인 이목구비 인상은?',
    hint: '',
    options: [
      { label: '곡선형', sub: '둥글고 부드러운 인상', set: { impression: 'soft' } },
      { label: '직선형', sub: '또렷하고 시원한 인상', set: { impression: 'sharp' } },
    ],
  },

  // ===== 3단계: 추구미 =====
  {
    section: 'style',
    title: '내가 되고 싶은 이미지(추구미)는?',
    hint: '분석 결과와 조합해 맞춤 메이크업 가이드를 만들어 드려요.',
    options: [
      { label: '청순', sub: '맑고 깨끗한, 꾸안꾸', color: '#F4E3E0', set: { style: 'pure' } },
      { label: '어른여자', sub: '세련되고 우아한 분위기', color: '#9C6B5A', set: { style: 'chic' } },
      { label: '힙', sub: '개성 있고 강렬한 무드', color: '#3B3540', set: { style: 'hip' } },
      { label: '러블리', sub: '생기 있고 사랑스러운', color: '#F2A7B5', set: { style: 'lovely' } },
    ],
  },
];

const SECTIONS = {
  color: '퍼스널 컬러',
  face: '얼굴 분석',
  style: '추구미',
};

/* ---------- 계절 타입 ---------- */
const SEASONS = {
  spring: {
    en: 'Spring Warm',
    ko: '봄 웜톤',
    keywords: ['화사함', '생기', '맑고 밝음'],
    desc: '노란 기가 도는 밝은 피부에 맑고 선명한 컬러가 잘 어울려요. 탁한 색보다 투명하고 생기 있는 색이 얼굴을 환하게 밝혀 줍니다.',
    palette: [
      { hex: '#F7A58B', name: '피치' },
      { hex: '#F28A6E', name: '코랄' },
      { hex: '#FFC98B', name: '애프리콧' },
      { hex: '#F9D66C', name: '버터' },
      { hex: '#B5D99C', name: '라임' },
    ],
    best: '코랄, 피치, 애프리콧, 웜 핑크',
    avoid: '회색빛이 섞인 탁한 색, 블랙, 차가운 버건디',
    hair: '밀크 브라운, 오렌지 브라운',
  },
  summer: {
    en: 'Summer Cool',
    ko: '여름 쿨톤',
    keywords: ['청량함', '우아함', '부드러움'],
    desc: '핑크빛이 도는 밝은 피부에 흰 기가 섞인 부드러운 파스텔 컬러가 잘 어울려요. 너무 진하거나 노란 색은 피부를 칙칙하게 만들 수 있어요.',
    palette: [
      { hex: '#F4B6C2', name: '로즈' },
      { hex: '#D98A9E', name: '말린장미' },
      { hex: '#C8B6E2', name: '라벤더' },
      { hex: '#A9C6E8', name: '스카이' },
      { hex: '#B9D8D2', name: '민트' },
    ],
    best: '로즈 핑크, 라벤더, 말린 장미, 쿨 MLBB',
    avoid: '오렌지, 카키, 머스터드 같은 노란 기가 강한 색',
    hair: '애쉬 브라운, 쿨 블랙',
  },
  autumn: {
    en: 'Autumn Warm',
    ko: '가을 웜톤',
    keywords: ['깊이감', '차분함', '고급스러움'],
    desc: '황갈색 피부에 채도가 낮고 깊이 있는 어스(earth) 컬러가 잘 어울려요. 음영 메이크업으로 분위기를 살리기 좋은 타입입니다.',
    palette: [
      { hex: '#C26A3D', name: '테라코타' },
      { hex: '#A44A3F', name: '브릭' },
      { hex: '#D49A6A', name: '카멜' },
      { hex: '#8A7F3B', name: '올리브' },
      { hex: '#7A4A33', name: '초콜릿' },
    ],
    best: '브릭, 테라코타, 말린 오렌지, 카멜 브라운',
    avoid: '형광색, 쨍한 핑크, 차가운 파스텔',
    hair: '다크 브라운, 카키 브라운',
  },
  winter: {
    en: 'Winter Cool',
    ko: '겨울 쿨톤',
    keywords: ['선명함', '도시적', '강렬함'],
    desc: '피부와 머리·눈동자의 대비가 뚜렷해 고채도의 선명한 컬러와 블랙·화이트가 잘 어울려요. 애매한 중간색보다 확실한 색이 좋아요.',
    palette: [
      { hex: '#B0123B', name: '체리' },
      { hex: '#D6246E', name: '푸시아' },
      { hex: '#7B1FA2', name: '퍼플' },
      { hex: '#0D47A1', name: '로열블루' },
      { hex: '#1B1B2A', name: '블랙' },
    ],
    best: '체리 레드, 푸시아, 플럼, 버건디',
    avoid: '베이지, 코랄, 탁한 오렌지 계열',
    hair: '블루 블랙, 다크 애쉬',
  },
};

/* ---------- 얼굴 분석 팁 ---------- */
const FACE_SHAPES = {
  round:  { name: '둥근형', tip: '광대 위에서 입꼬리 방향으로 사선 블러셔, 턱 양옆에 가벼운 쉐이딩으로 세로 라인을 강조하세요.' },
  oval:   { name: '계란형', tip: '이상적인 비율이라 어떤 메이크업도 소화 가능해요. 광대 중앙에 둥글게 블러셔를 올려 자연스럽게 마무리하세요.' },
  long:   { name: '긴 얼굴형', tip: '블러셔를 가로로 길게 넣고, 이마 끝과 턱 끝에 쉐이딩을 해 세로 길이를 줄여 보이게 하세요.' },
  square: { name: '각진형', tip: '턱 각진 부분에 쉐이딩, 블러셔는 광대 위에 둥글게 넣어 부드러운 곡선을 만들어 주세요.' },
  heart:  { name: '하트형', tip: '이마 양옆에 쉐이딩, 턱 끝에 하이라이터를 살짝 올려 하안부에 볼륨감을 주세요.' },
};

const RATIO_TIPS = {
  upper:    { name: '상안부가 긴 편', tip: '앞머리나 헤어라인 쉐이딩으로 이마를 짧아 보이게 하고, 눈썹은 일자에 가깝게 그려요.' },
  middle:   { name: '중안부가 긴 편', tip: '애교살과 언더 섀도우로 눈을 세로로 키우고, 블러셔는 코끝 높이보다 높게 가로로 넣어요.' },
  lower:    { name: '하안부가 긴 편', tip: '입술 윗선을 살짝 오버해 인중을 짧아 보이게 하고, 턱 끝에 쉐이딩을 넣어 주세요.' },
  balanced: { name: '균형 잡힌 비율', tip: '비율 보정보다 피부 표현과 컬러 포인트에 집중하면 좋아요.' },
};

const EYE_TIPS = {
  round: { name: '동그란 눈', tip: '눈꼬리 쪽으로 아이라인을 길게 빼 가로 길이를 더하면 성숙한 느낌이 나요.' },
  long:  { name: '가로로 긴 눈', tip: '눈 중앙에 펄/밝은 섀도우를 올리고 언더라인을 채워 세로 폭을 키워 보세요.' },
  up:    { name: '올라간 눈매', tip: '언더 눈꼬리에 음영을 넣어 각도를 완화하면 부드러운 인상이 돼요.' },
  down:  { name: '처진 눈매', tip: '아이라인 끝을 수평보다 살짝 위로 빼고, 하단 눈꼬리 음영은 생략하세요.' },
};

const IMPRESSIONS = {
  soft:  { name: '곡선형', tip: '둥근 눈썹, 글로시한 립 등 곡선을 살리는 표현이 자연스럽게 어울려요.' },
  sharp: { name: '직선형', tip: '각진 눈썹, 매트한 립, 길게 뺀 아이라인 등 선을 살리는 표현이 잘 어울려요.' },
};

/* ---------- 추구미 ---------- */
const STYLES = {
  pure: {
    name: '청순',
    en: 'Pure',
    summary: '피부 결이 살아있는 얇은 베이스와 투명한 컬러로 맑은 분위기',
    base: '톤업 선크림 + 얇은 쿠션, 파우더는 T존에만',
    eye: '음영 섀도우 한 가지, 브라운 아이라인 최소화',
    cheek: '광대 중앙에 은은하게 퍼지는 블러셔',
    lip: '촉촉한 립밤 또는 MLBB 틴트를 그라데이션으로',
    lipBySeason: { spring: '애프리콧 립밤', summer: '로즈 MLBB', autumn: '카멜 누드', winter: '라즈베리 틴트' },
  },
  chic: {
    name: '어른여자',
    en: 'Chic',
    summary: '정돈된 피부와 음영, 또렷한 립으로 세련된 분위기',
    base: '세미매트 파운데이션, 쉐이딩으로 윤곽 정리',
    eye: '브라운 음영 + 눈꼬리를 길게 뺀 아이라인',
    cheek: '광대 아래 사선으로 차분하게',
    lip: '풀립 매트 또는 벨벳 립',
    lipBySeason: { spring: '코랄 브라운', summer: '말린 장미', autumn: '브릭 레드', winter: '버건디' },
  },
  hip: {
    name: '힙',
    en: 'Hip',
    summary: '컬러·질감 포인트로 개성 있고 강렬한 분위기',
    base: '광 없는 매트 베이스, 하이라이터는 콧대에만',
    eye: '그래픽 라이너 또는 컬러 마스카라 포인트',
    cheek: '생략하거나 쉐이딩만',
    lip: '진한 컬러를 오버립으로, 또는 글로시 포인트',
    lipBySeason: { spring: '오렌지 레드', summer: '베리 퍼플', autumn: '딥 초콜릿', winter: '블랙 체리' },
  },
  lovely: {
    name: '러블리',
    en: 'Lovely',
    summary: '혈색과 애교살 포인트로 생기 있고 사랑스러운 분위기',
    base: '촉촉한 글로우 쿠션',
    eye: '애교살 펄 + 동그란 아이라인',
    cheek: '눈 바로 아래에 넓고 둥글게',
    lip: '글로시 틴트로 생기 있게',
    lipBySeason: { spring: '코랄 핑크', summer: '베이비 핑크', autumn: '피치 브라운', winter: '푸시아 핑크' },
  },
};

/* ---------- 제품 (시연용 샘플) ---------- */
const PRODUCTS = [
  // 베이스
  { name: '웜 베이지 글로우 쿠션', cat: 'base', color: '#E4BE9A', tones: ['spring', 'autumn'], styles: ['lovely', 'pure'], desc: '노란 기를 살려 피부를 건강하게 표현하는 촉촉 쿠션' },
  { name: '쿨 바닐라 톤업 선크림', cat: 'base', color: '#F4E4E1', tones: ['summer', 'winter'], styles: ['pure', 'lovely'], desc: '핑크빛 톤업으로 맑고 깨끗한 피부 표현' },
  { name: '세미매트 롱웨어 파운데이션', cat: 'base', color: '#DDB79C', tones: ['spring', 'summer', 'autumn', 'winter'], styles: ['chic', 'hip'], desc: '모공을 매끈하게 커버하는 세미매트 피니시' },

  // 봄 웜
  { name: '코랄 글로우 틴트', cat: 'lip', color: '#F27B6B', tones: ['spring'], styles: ['lovely', 'pure'], desc: '생기 있는 코랄 컬러의 물광 틴트' },
  { name: '애프리콧 컬러 립밤', cat: 'lip', color: '#F6A27E', tones: ['spring'], styles: ['pure'], desc: '은은한 살구빛으로 맨입술처럼 자연스럽게' },
  { name: '피치 블러 블러셔', cat: 'cheek', color: '#F9B49A', tones: ['spring'], styles: ['lovely', 'pure'], desc: '보송하게 퍼지는 복숭아빛 혈색' },
  { name: '골드 펄 4구 팔레트', cat: 'eye', color: '#E8B87A', tones: ['spring'], styles: ['lovely', 'pure'], desc: '샴페인 골드 펄과 웜 브라운 음영 구성' },

  // 여름 쿨
  { name: '로즈 MLBB 벨벳 틴트', cat: 'lip', color: '#D98A9E', tones: ['summer'], styles: ['pure', 'chic'], desc: '말린 장미빛의 부드러운 벨벳 립' },
  { name: '베리 젤리 글로스', cat: 'lip', color: '#C25579', tones: ['summer'], styles: ['lovely', 'hip'], desc: '투명한 베리 컬러의 탱글한 글로스' },
  { name: '라벤더 쿨 블러셔', cat: 'cheek', color: '#D7B2D8', tones: ['summer'], styles: ['lovely'], desc: '노란기를 잡아주는 라벤더 핑크 혈색' },
  { name: '쿨 핑크 음영 팔레트', cat: 'eye', color: '#E6B9C6', tones: ['summer'], styles: ['pure', 'lovely'], desc: '그레이시 핑크와 모브 음영 구성' },

  // 가을 웜
  { name: '브릭 벨벳 립스틱', cat: 'lip', color: '#A44A3F', tones: ['autumn'], styles: ['chic', 'hip'], desc: '깊이감 있는 벽돌빛 레드' },
  { name: '카멜 누드 립', cat: 'lip', color: '#B97A5A', tones: ['autumn'], styles: ['pure', 'chic'], desc: '차분한 카멜 브라운 누드' },
  { name: '테라코타 블러셔', cat: 'cheek', color: '#C67B5C', tones: ['autumn'], styles: ['chic'], desc: '윤곽을 살려주는 말린 오렌지 컬러' },
  { name: '브라운 음영 팔레트', cat: 'eye', color: '#8B5A3C', tones: ['autumn'], styles: ['chic', 'hip'], desc: '카키·초콜릿 브라운으로 깊은 눈매 연출' },

  // 겨울 쿨
  { name: '체리 레드 매트 립', cat: 'lip', color: '#B0123B', tones: ['winter'], styles: ['chic', 'hip'], desc: '선명하고 강렬한 체리 레드' },
  { name: '푸시아 글로시 립', cat: 'lip', color: '#D6246E', tones: ['winter'], styles: ['lovely', 'hip'], desc: '쨍한 푸시아 핑크의 유리알 광택' },
  { name: '플럼 블러셔', cat: 'cheek', color: '#9C4A72', tones: ['winter'], styles: ['chic'], desc: '차가운 자두빛으로 도시적인 혈색' },
  { name: '스모키 그레이 팔레트', cat: 'eye', color: '#5B5560', tones: ['winter'], styles: ['hip', 'chic'], desc: '그레이·블랙 펄로 강렬한 스모키' },
];

const CATEGORIES = { all: '전체', base: '베이스', eye: '아이', cheek: '치크', lip: '립' };

/* ---------- 홈 트렌드 카드 (관리자가 수정하는 영역) ---------- */
const TRENDS = [
  { tag: 'TREND 01', title: '속광 피부 &\n블러 립', desc: '얇게 빛나는 피부 위에 경계를 흐린 블러 립으로 힘을 뺀 메이크업' },
  { tag: 'TREND 02', title: '음영 아이 &\n누드 브라운', desc: '펄 없이 브라운 음영만으로 눈매에 깊이를 더하는 스타일' },
  { tag: 'TREND 03', title: '혈색 블러셔\n레이어링', desc: '크림 + 파우더 블러셔를 겹쳐 속에서 올라오는 듯한 혈색 표현' },
];
