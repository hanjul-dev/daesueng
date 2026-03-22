export const DEFAULT_FLOOR_VIEW = 'overview'

export const FLOOR_VIEWS = [
  {
    id: 'overview',
    label: '전체',
    description: '건물 전체 매스를 그대로 보면서 외관 인상을 확인합니다.',
    slice: null,
    orbit: {
      position: [22, 10.5, 27],
      target: [0, 4.6, 0],
      minDistance: 12,
      maxDistance: 46,
      allowPan: false,
    },
    walk: {
      start: [0, 1.72, 12],
      lookTarget: [0, 2.4, -6],
      eyeHeight: 1.72,
      bounds: {
        minX: -22,
        maxX: 22,
        minY: 1.2,
        maxY: 12.6,
        minZ: -24,
        maxZ: 26,
      },
    },
  },
  {
    id: 'b1',
    label: 'B1',
    description: '지하 1층을 약 1.7m 높이로 절단해 하부 동선과 차고 레벨을 봅니다.',
    slice: {
      minHeight: 0,
      maxHeight: 1.72,
    },
    orbit: {
      position: [11, 8.6, 11],
      target: [0, 0.95, 0],
      minDistance: 8,
      maxDistance: 28,
      allowPan: true,
    },
    walk: {
      start: [-0.6, 1.72, 4.8],
      lookTarget: [0, 1.72, -6.2],
      eyeHeight: 1.72,
      bounds: {
        minX: -10.5,
        maxX: 10.5,
        minY: 1.2,
        maxY: 3.4,
        minZ: -11,
        maxZ: 9,
      },
    },
  },
  {
    id: '1f',
    label: '1F',
    description: '1층 레벨을 사람 눈높이로 잘라 1층 공간감을 위에서 확인합니다.',
    slice: {
      minHeight: 4.4,
      maxHeight: 6.1,
    },
    orbit: {
      position: [10.5, 12.3, 10.5],
      target: [0, 5.2, 0],
      minDistance: 7,
      maxDistance: 24,
      allowPan: true,
    },
    walk: {
      start: [0, 6.12, 2.8],
      lookTarget: [0, 6.12, -6],
      eyeHeight: 6.12,
      bounds: {
        minX: -9.5,
        maxX: 9.5,
        minY: 5.1,
        maxY: 7.8,
        minZ: -10,
        maxZ: 8.5,
      },
    },
  },
  {
    id: '2f',
    label: '2F',
    description: '2층을 절단해 상부 레벨과 발코니 주변 비례를 집중해서 봅니다.',
    slice: {
      minHeight: 8.9,
      maxHeight: 10.6,
    },
    orbit: {
      position: [9, 16.2, 8.5],
      target: [0, 9.55, 0],
      minDistance: 6,
      maxDistance: 22,
      allowPan: true,
    },
    walk: {
      start: [-0.4, 10.62, 1.4],
      lookTarget: [0, 10.62, -5.4],
      eyeHeight: 10.62,
      bounds: {
        minX: -8.5,
        maxX: 8.5,
        minY: 9.4,
        maxY: 12.3,
        minZ: -8.5,
        maxZ: 7.5,
      },
    },
  },
]

export function getFloorViewConfig(id) {
  return FLOOR_VIEWS.find((item) => item.id === id) ?? FLOOR_VIEWS[0]
}
