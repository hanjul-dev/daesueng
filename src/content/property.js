export const PROPERTY_CONTENT = {
  brand: 'DAESEUNG CONSTRUCTION',
  badge: 'OO 공원 생활권',
  title: 'OO 공원 앞, 지하 1층·지상 2층 단독주택',
  description:
    '실사 사진과 외관 투어를 한 화면 안에서 자연스럽게 이어 보여주는 분양형 랜딩입니다. 먼저 공원 방향 조망과 전면 인상을 읽고, 바로 아래에서 외관을 회전하며 커튼월과 차고 접근을 직접 확인하실 수 있습니다.',
  primaryAction: '매물 소개 보기',
  secondaryAction: '실시간 외관 둘러보기',
  heroFacts: [
    { label: '구성', value: '지하 1층 · 지상 2층 단독주택' },
    { label: '조망', value: '공원 방향 오픈 뷰' },
    { label: '동선', value: '차고 진입과 주출입 분리' },
  ],
  overviewTitle: '공원 뷰와 진입 인상이 함께 살아 있는 프리미엄 단독주택',
  overviewDescription:
    '이 집은 전면에서 보이는 커튼월과 석재 매스만으로 끝나는 타입이 아닙니다. 차고 접근, 정면 입면의 비례, 사선 지붕과 수평 발코니 선이 함께 읽혀야 비로소 집의 품격이 드러납니다. 그래서 첫 화면은 설명보다 인상, 체험보다 설득이 먼저 오도록 새로 정리했습니다.',
  overviewNarrative: [
    '공원 방향으로 열리는 시야가 먼저 읽히고, 전면 커튼월과 깊은 처마가 뒤이어 집의 인상을 완성합니다.',
    '지하 1층 차고와 상부 주거 매스를 분리해 단독주택다운 독립감과 정돈된 동선을 함께 확보합니다.',
    '3D는 주인공이 아니라 판단을 돕는 도구로 배치하고, 사진과 요약 정보가 먼저 신뢰를 만들도록 설계합니다.',
  ],
  contactLine: '사진으로 신뢰를 만들고, 체험에서 확신을 주는 흐름으로 다시 짰습니다.',
}

export const PROPERTY_MEDIA = [
  {
    tone: 'hero',
    eyebrow: '대표 외관',
    title: '정면 입면과 커튼월 인상',
    description: '석재 매스와 짙은 프레임의 대비가 첫인상을 분명하게 만듭니다.',
    className: 'md:col-span-2 min-h-[360px] sm:min-h-[520px] xl:min-h-[620px] 2xl:min-h-[720px]',
  },
  {
    tone: 'park',
    eyebrow: '공원 방향',
    title: '열린 조망과 주거 분위기',
    description: '공원 쪽으로 열린 감각이 집의 가치 판단을 돕습니다.',
  },
  {
    tone: 'garage',
    eyebrow: '차고 접근',
    title: '차량 진입과 주출입 동선',
    description: '실거주 만족도를 좌우하는 접근 흐름을 한눈에 확인합니다.',
  },
]

export const SELLING_POINTS = [
  {
    title: '정면 인상',
    description: '먼 거리에서도 읽히는 매스 비례와 깊은 처마가 첫인상을 안정감 있게 잡아줍니다.',
  },
  {
    title: '공원 조망',
    description: '주변 풍경과 맞닿는 열린 방향성을 먼저 보여줘 실거주 가치를 빠르게 전달합니다.',
  },
  {
    title: '차고 동선',
    description: '차고 진입과 보행 접근을 분리해 일상 동선이 정돈되어 보이도록 풀었습니다.',
  },
]

export const OVERVIEW_CARDS = [
  {
    label: '입지',
    value: 'OO 공원 앞',
    description: '주거지의 인상과 조망 가치를 함께 판단하기 좋은 포인트입니다.',
  },
  {
    label: '건물 구성',
    value: '지하 1층 · 지상 2층',
    description: '차고와 상부 생활 공간의 역할 분리가 명확합니다.',
  },
  {
    label: '핵심 인상',
    value: '석재 매스 · 커튼월 · 깊은 처마',
    description: '구매자가 첫눈에 체감하는 품격 요소를 중심으로 보여줍니다.',
  },
]

export const TOUR_CONTENT = {
  islandLabel: '실시간 4D 외관 투어',
  islandTitle: '사진으로 읽은 외관을 바로 아래에서 실제로 둘러보세요.',
  islandDescription:
    '정면 입면, 차고 접근, 커튼월 비례를 부드럽게 회전하며 확인하고 필요하면 전체화면으로 확장해 외관만 집중해서 볼 수 있습니다.',
  liveStatus: '실시간 반영',
  stageEyebrow: 'Exterior Tour',
  stageTitle: '외관 프리뷰',
  stageDescription: '광량과 관찰 포인트를 바꾸며 정면 인상과 조망 방향을 직접 확인해보세요.',
}

export const TIME_PRESETS = [
  { label: '오전', value: 9.5 },
  { label: '정오', value: 13 },
  { label: '석양', value: 18.25 },
  { label: '야간', value: 20.25 },
]

export const TOUR_HIGHLIGHTS = [
  {
    id: 'front-approach',
    title: '정면 진입 인상',
    description: '전면 매스와 처마 깊이, 발코니 선의 균형을 먼저 확인합니다.',
  },
  {
    id: 'double-height-glass',
    title: '더블하이트 커튼월',
    description: '석재 매스와 유리 면적의 비례가 어떻게 읽히는지 비교합니다.',
  },
  {
    id: 'balcony-line',
    title: '발코니 수평선',
    description: '전면 입면을 안정적으로 보이게 하는 수평 리듬을 확인합니다.',
  },
  {
    id: 'garage-access',
    title: '차고 접근성',
    description: '차량 진입 흐름과 전면 하부의 안정감을 함께 봅니다.',
  },
]

export const HOTSPOT_DETAILS = {
  'front-approach': {
    floor: 'Exterior',
    title: '정면 진입 인상',
    summary: '집을 처음 마주했을 때 읽히는 비례와 존재감을 보는 포인트입니다.',
    material: '밝은 석재 매스, 짙은 메탈 라인',
    dimensions: '전면 약 17m, 3개 매스 중심 구성',
    details: [
      '수평 매스와 사선 지붕선이 함께 읽혀야 집의 인상이 안정적으로 정리됩니다.',
      '정면에서 가장 먼저 보이는 처마 깊이와 발코니 두께를 구매자 시선에 맞춰 확인합니다.',
      '첫인상 구간이므로 과한 장식보다 매스 비례와 재료의 대비를 우선적으로 봅니다.',
    ],
  },
  'garage-access': {
    floor: 'B1',
    title: '차고와 하부 진입',
    summary: '차량 동선과 하부 매스의 안정감을 함께 판단하는 포인트입니다.',
    material: '콘크리트 배경, 메탈 셔터',
    dimensions: '좌측 하부 차고 진입 구간',
    details: [
      '전면 사진에서 보이는 차고 입구와 벽체 밸런스를 기준으로 접근성을 읽습니다.',
      '하부 매스가 너무 무겁거나 답답해 보이지 않는지 같이 비교해보는 구간입니다.',
      '실제 거주 단계에서 가장 자주 체감하는 동선 중 하나라 구매 판단에 중요합니다.',
    ],
  },
  'double-height-glass': {
    floor: 'Main Facade',
    title: '더블하이트 커튼월',
    summary: '집의 품격을 결정하는 핵심 요소로, 유리 면과 프레임 비례를 함께 봅니다.',
    material: '로이 복층 유리, 블랙 메탈 프레임',
    dimensions: '전면 2층 높이 커튼월',
    details: [
      '유리 면적이 과장돼 보이지 않도록 프레임 간격과 상부 분할을 함께 확인합니다.',
      '반사만 강한 유리가 아니라 묵직하게 보이는 고급 주택의 인상에 맞춰 읽습니다.',
      '정면에서 집의 첫 가치 판단을 만드는 영역이라 사진과 3D를 같이 보는 것이 좋습니다.',
    ],
  },
  'balcony-line': {
    floor: '2F Terrace',
    title: '발코니 선과 유리 난간',
    summary: '수평선을 어떻게 정리하느냐에 따라 외관의 고급감이 달라집니다.',
    material: '투명 유리 난간, 슬림 메탈 캡',
    dimensions: '전면 발코니 약 14m',
    details: [
      '난간이 두껍게 보이지 않도록 얇은 선으로 정리되는지 확인합니다.',
      '슬래브 하부와 처마가 한 리듬으로 연결되는지 함께 보면 외관 판단이 쉬워집니다.',
      '커튼월과 발코니 선이 자연스럽게 이어져야 전면 인상이 정돈되어 보입니다.',
    ],
  },
  'gable-wing': {
    floor: 'Upper Wing',
    title: '사선 지붕과 측면 윙',
    summary: '측면에서 집의 개성과 실루엣을 가장 강하게 만드는 포인트입니다.',
    material: '사선 유리창, 밝은 석재 캔틸레버 매스',
    dimensions: '좌측 상부 돌출 윙 중심',
    details: [
      '사선 지붕선과 측면 창호 구성이 함께 읽혀야 외관의 성격이 분명해집니다.',
      '상부로 돌출된 매스와 하부 발코니 선의 관계를 같이 보면 집의 실루엣이 더 잘 보입니다.',
      '정면에서 다 보이지 않는 건물의 개성을 측면에서 보완하는 핵심 구간입니다.',
    ],
  },
}
