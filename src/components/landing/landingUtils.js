import { HOTSPOTS } from '../Hotspots'

export function scrollToSection(sectionId) {
  if (typeof document === 'undefined') {
    return
  }

  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

export function formatTime(hour) {
  const totalMinutes = Math.round(hour * 60)
  const normalizedHour = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  const period = normalizedHour >= 12 ? '오후' : '오전'
  const displayHour =
    normalizedHour === 0 ? 12 : normalizedHour > 12 ? normalizedHour - 12 : normalizedHour

  return `${period} ${displayHour}시 ${minutes.toString().padStart(2, '0')}분`
}

export function getTimeNarrative(hour) {
  if (hour < 8) {
    return '이른 시간대에는 전면 석재와 프레임 대비가 차분하게 읽혀 첫인상 판단에 좋습니다.'
  }

  if (hour < 15) {
    return '주간광에서는 커튼월 비례와 발코니 수평선이 가장 분명하게 보입니다.'
  }

  if (hour < 19.5) {
    return '석양 구간은 처마 깊이와 매스의 입체감이 가장 드라마틱하게 살아나는 시간입니다.'
  }

  return '야간에는 유리 면의 반사와 실내 빛 분위기가 더해져 고급스러운 무드가 살아납니다.'
}

export function findHotspot(id) {
  return HOTSPOTS.find((hotspot) => hotspot.id === id) ?? null
}
