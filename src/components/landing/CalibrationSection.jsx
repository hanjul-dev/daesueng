import { useState } from 'react'
import { featureFlags } from '../../config/featureFlags'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import LightAdjustmentPanel from './LightAdjustmentPanel'
import ModelAdjustmentPanel from './ModelAdjustmentPanel'

export default function CalibrationSection() {
  const [isOpen, setIsOpen] = useState(false)

  if (!featureFlags.showCalibrationControls) {
    return null
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-2 sm:px-6 lg:px-8">
      <div className="rounded-[40px] border border-[color:var(--theme-border)] bg-[color:var(--theme-panel)] p-5 shadow-[var(--theme-shadow-soft)] backdrop-blur-xl sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="w-fit">
              Fine Tune
            </Badge>
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[color:var(--theme-foreground)] sm:text-3xl">
              Model And Lighting Calibration
            </h3>
            <p className="max-w-3xl text-sm leading-7 text-[color:var(--theme-muted-foreground)]">
              정렬과 조명 보정은 최하단에만 두고, 운영 화면에서는 플래그로 숨길 수 있게 분리했습니다.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={() => setIsOpen((open) => !open)}>
            {isOpen ? '보정 패널 닫기' : '보정 패널 열기'}
          </Button>
        </div>

        {isOpen && (
          <div className="grid gap-4 xl:grid-cols-2">
            <ModelAdjustmentPanel />
            <LightAdjustmentPanel />
          </div>
        )}
      </div>
    </section>
  )
}
