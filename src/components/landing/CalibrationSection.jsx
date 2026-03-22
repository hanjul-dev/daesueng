import { useState } from 'react'
import { featureFlags } from '../../config/featureFlags'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import LightAdjustmentPanel from './LightAdjustmentPanel'
import ModelAdjustmentPanel from './ModelAdjustmentPanel'

export default function CalibrationSection() {
  const [isOpen, setIsOpen] = useState(true)

  if (!featureFlags.showCalibrationControls) {
    return null
  }

  return (
    <section className="layout-shell layout-shell--wide pb-20 pt-2">
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
              모델 위치와 조명을 여기서 바로 맞춰보신 뒤, 최종값을 주시면 그대로 고정하겠습니다.
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
