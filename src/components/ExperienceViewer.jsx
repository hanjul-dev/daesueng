import { AlertTriangle, RefreshCcw, Sparkles } from 'lucide-react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import ErrorBoundary from './ui/error-boundary'

const SceneExperience = lazy(() => import('./viewer/SceneExperience'))

function ViewerStateCard({ mode, onActivate, onRetry }) {
  const isIdle = mode === 'idle'
  const isError = mode === 'error'

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--theme-panel-strong)]/86 p-6 backdrop-blur-xl">
      <div className="w-full max-w-md rounded-[32px] border border-[color:var(--theme-border)] bg-white/92 p-6 text-center shadow-[var(--theme-shadow-card)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--theme-accent-muted)]">
          {isError ? (
            <AlertTriangle className="h-6 w-6 text-[color:var(--theme-foreground)]" />
          ) : (
            <Sparkles className="h-6 w-6 text-[color:var(--theme-foreground)]" />
          )}
        </div>

        <div className="mt-4 space-y-2">
          <Badge variant="secondary" className="mx-auto w-fit">
            {isIdle ? 'Smart Loading' : isError ? 'Viewer Recovery' : 'Preparing Viewer'}
          </Badge>
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[color:var(--theme-foreground)]">
            {isIdle
              ? '외관 뷰어는 필요한 시점에만 불러옵니다'
              : isError
                ? '뷰어를 다시 불러오겠습니다'
                : '실시간 외관 뷰어를 준비하고 있습니다'}
          </h3>
          <p className="text-sm leading-7 text-[color:var(--theme-muted-foreground)]">
            {isIdle
              ? '첫 화면은 사진과 매물 설명을 먼저 보여드리고, 3D는 체험 구간에 들어오면 불러와 초기 진입을 가볍게 만들었습니다.'
              : isError
                ? '일시적인 그래픽 초기화 오류가 생겼습니다. 다시 시도하면 외관 체험만 안전하게 복구됩니다.'
                : '고용량 외관 모델과 조명 데이터를 순서대로 준비하고 있습니다.'}
          </p>
        </div>

        {isIdle && (
          <div className="mt-5">
            <Button size="sm" onClick={onActivate}>
              지금 뷰어 미리 불러오기
            </Button>
          </div>
        )}

        {isError && (
          <div className="mt-5">
            <Button size="sm" onClick={onRetry}>
              <RefreshCcw className="h-4 w-4" />
              다시 시도
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ExperienceViewer() {
  const rootRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    const target = rootRef.current
    if (!target || shouldLoad || typeof IntersectionObserver === 'undefined') {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '480px 0px',
      },
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [shouldLoad])

  function retryViewer() {
    setShouldLoad(true)
    setResetKey((currentKey) => currentKey + 1)
  }

  return (
    <div ref={rootRef} className="relative h-full">
      {!shouldLoad ? (
        <ViewerStateCard mode="idle" onActivate={() => setShouldLoad(true)} />
      ) : (
        <ErrorBoundary
          resetKey={resetKey}
          onError={(error) => {
            console.error('Experience viewer crashed', error)
          }}
          fallback={<ViewerStateCard mode="error" onRetry={retryViewer} />}
        >
          <Suspense fallback={<ViewerStateCard mode="loading" />}>
            <SceneExperience key={resetKey} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  )
}
