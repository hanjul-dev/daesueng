import { useEffect, useMemo } from 'react'
import { useProgress } from '@react-three/drei'
import useAppStore from '../store/useAppStore'

function getLoadingMessage(progress) {
  if (progress < 30) return '외관 매스와 기본 장면을 먼저 준비하고 있습니다.'
  if (progress < 65) return '재료감과 주요 입면 요소를 순서대로 불러오고 있습니다.'
  if (progress < 90) return '광량과 그림자 균형을 정리해 보기 편한 상태로 맞추고 있습니다.'
  return '외관 프리뷰가 거의 준비되었습니다.'
}

export default function LoadingScreen() {
  const isLoading = useAppStore((state) => state.isLoading)
  const setLoadingProgress = useAppStore((state) => state.setLoadingProgress)
  const setLoadingStage = useAppStore((state) => state.setLoadingStage)
  const setLoaded = useAppStore((state) => state.setLoaded)
  const { progress, active, loaded, total } = useProgress()
  const resolvedProgress = total === 0 ? 100 : progress

  useEffect(() => {
    setLoadingProgress(resolvedProgress)

    if (resolvedProgress < 30) setLoadingStage('shell')
    else if (resolvedProgress < 75) setLoadingStage('materials')
    else if (resolvedProgress < 100) setLoadingStage('lighting')
  }, [resolvedProgress, setLoadingProgress, setLoadingStage])

  useEffect(() => {
    if (resolvedProgress >= 100 && !active) {
      const timeout = window.setTimeout(() => setLoaded(), 360)
      return () => window.clearTimeout(timeout)
    }

    return undefined
  }, [active, resolvedProgress, setLoaded])

  const progressLabel = useMemo(() => Math.round(resolvedProgress), [resolvedProgress])

  return (
    <div
      className="absolute inset-0 z-20 grid place-items-center bg-white/76 p-6 backdrop-blur-2xl"
      style={{
        opacity: isLoading ? 1 : 0,
        transition: 'opacity 0.85s ease',
        pointerEvents: isLoading ? 'auto' : 'none',
        visibility: isLoading ? 'visible' : 'hidden',
      }}
    >
      <div className="w-full max-w-[560px] rounded-[36px] border border-[color:var(--theme-border)] bg-[color:var(--theme-panel-strong)] p-8 shadow-[var(--theme-shadow-card)]">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[color:var(--theme-subtle-foreground)]">
          DAESEUNG CONSTRUCTION
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--theme-foreground)] sm:text-4xl">
          외관 프리뷰를 준비하고 있습니다
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-[color:var(--theme-muted-foreground)]">
          정면 인상, 커튼월 비례, 차고 접근과 공원 방향 조망을 편안하게 확인하실 수 있도록 장면을 정리하고 있습니다.
        </p>

        <div className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-black/6">
          <div
            className="h-full rounded-full bg-[color:var(--theme-accent)] transition-[width] duration-300"
            style={{ width: `${progressLabel}%` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-[color:var(--theme-muted-foreground)]">
          <span>{getLoadingMessage(resolvedProgress)}</span>
          <span>{progressLabel}%</span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 text-xs text-[color:var(--theme-subtle-foreground)]">
          <span>불러온 항목 {loaded}</span>
          <span>전체 항목 {total}</span>
        </div>
      </div>
    </div>
  )
}
