/*
 * 〈When Love Responds〉 작품 설정 파일
 * ------------------------------------------------------------
 * 작품 주소·이름·설명은 이 파일만 고치면 됩니다.
 * 배열 순서는 화면 배치(3열 × 2행)일 뿐, 작품의 순서가 아닙니다.
 *
 *  url       : 각 작품의 배포 주소 (개별 사이트는 독립적으로 계속 수정 가능)
 *  name      : 작품명 (영문)
 *  subtitle  : 한국어 이름
 *  line      : 마우스를 올렸을 때 나타나는 한 줄 설명
 *  image     : assets/works/ 안의 최적화 이미지 이름 (-720 / -1400 자동 선택)
 *  presence  : 시각적 존재감 보정값 (1 = 기본, 0.9 = 조금 작게, 1.1 = 조금 크게)
 *  allow     : 작품이 사용하는 브라우저 권한 (마이크·카메라 등)
 */
window.WLR_WORKS = [
  {
    id: 'eros',
    name: 'EROS',
    subtitle: '열정적인 사랑',
    line: '목소리를 내면, 심장이 뛰기 시작합니다.',
    url: 'https://eros-web-iota.vercel.app',
    image: 'eros',
    presence: 1.1,
  },
  {
    id: 'ludus',
    name: 'LUDUS',
    subtitle: '장난스러운 사랑',
    line: '잡힐 듯 잡히지 않는, 놀이처럼 다가오는 마음.',
    url: 'https://ludus-web-two.vercel.app',
    image: 'ludus',
    presence: 1.0,
  },
  {
    id: 'philia',
    name: 'PHILIA',
    subtitle: '우정의 사랑',
    line: '함께 주무르고 섞으며, 서로를 닮아갑니다.',
    url: 'https://philia-web.vercel.app',
    back: 'top',          // PHILIA keeps its own buttons along the bottom edge
    image: 'philia',
    presence: 1.06,
  },
  {
    id: 'storge',
    name: 'STORGE',
    subtitle: '가족의 사랑',
    line: '태엽을 감으면, 익숙한 선율이 흘러나옵니다.',
    url: 'https://storge-web.vercel.app',
    image: 'storge',
    presence: 0.98,
  },
  {
    id: 'pragma',
    name: 'PRAGMA',
    subtitle: '맞춰가는 사랑',
    line: '맞춰가며, 오래 지켜내는 사랑.',
    url: 'https://pragma-web-xi.vercel.app',
    image: 'pragma',
    presence: 1.04,
  },
  {
    id: 'agape',
    name: 'AGAPE',
    subtitle: '무조건적인 사랑',
    line: '숨을 불어 넣으면, 빛의 정원이 피어납니다.',
    url: 'https://agape-web-rouge.vercel.app',
    image: 'agape',
    presence: 1.05,
  },
];

/*
 * 갤러리 동작 설정
 *  back     : 작품별 BACK TO GALLERY 위치 — 'bottom'(기본, 왼쪽 아래) 또는 'top'(왼쪽 위). 모바일에서는 항상 상단 내비게이션 줄.
 *  openMode : 'frame' — 갤러리 안에서 작품을 띄움 (전체화면 유지, BACK TO GALLERY 자동 제공) ← 권장
 *             'link'  — 작품 주소로 직접 이동 (크롬 키오스크 모드에서만 주소창이 숨겨짐)
 *  주소 뒤에 ?mode=link 또는 ?mode=frame 을 붙이면 이 값을 임시로 덮어씁니다.
 */
window.WLR_SETTINGS = {
  openMode: 'frame',
  permissions: 'microphone; camera; fullscreen; autoplay; accelerometer; gyroscope; clipboard-write',
};
