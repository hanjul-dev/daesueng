import useAppStore from '../../store/useAppStore'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Slider } from '../ui/slider'

const ADJUSTMENT_ITEMS = [
  { key: 'keyAngle', label: 'Sun Angle', min: -180, max: 180, step: 1 },
  { key: 'keyHeight', label: 'Sun Height', min: 4, max: 32, step: 0.5 },
  { key: 'keyIntensity', label: 'Sun Intensity', min: 0, max: 2.4, step: 0.01 },
  { key: 'fillAngle', label: 'Fill Angle', min: -180, max: 180, step: 1 },
  { key: 'fillHeight', label: 'Fill Height', min: 2, max: 20, step: 0.5 },
  { key: 'fillIntensity', label: 'Fill Intensity', min: 0, max: 3.2, step: 0.01 },
  { key: 'exposure', label: 'Exposure', min: 0.4, max: 1.6, step: 0.01 },
]

export default function LightAdjustmentPanel() {
  const lightTuning = useAppStore((state) => state.lightTuning)
  const setLightTuning = useAppStore((state) => state.setLightTuning)
  const resetLightTuning = useAppStore((state) => state.resetLightTuning)

  return (
    <Card className="rounded-[34px]">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2">
            <Badge variant="secondary">Light Adjust</Badge>
            <CardTitle className="text-[26px]">GLB Lighting</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={resetLightTuning}>
            Reset
          </Button>
        </div>
        <CardDescription className="text-[15px]">
          태양광 각도와 보조광 세기를 먼저 맞춘 뒤, 최종 숫자를 주시면 그대로 하드코딩하겠습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {ADJUSTMENT_ITEMS.map((item) => (
          <div key={item.key} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[color:var(--theme-foreground)]">{item.label}</p>
              <p className="text-xs text-[color:var(--theme-subtle-foreground)]">
                {Number(lightTuning[item.key]).toFixed(item.step < 1 ? 2 : 0)}
              </p>
            </div>
            <Slider
              min={item.min}
              max={item.max}
              step={item.step}
              value={[lightTuning[item.key]]}
              onValueChange={([nextValue]) => setLightTuning({ [item.key]: nextValue })}
            />
          </div>
        ))}

        <div className="rounded-[22px] border border-[color:var(--theme-border)] bg-white/72 px-4 py-3 text-xs leading-6 text-[color:var(--theme-muted-foreground)]">
          {`sun ${lightTuning.keyAngle.toFixed(0)}deg / ${lightTuning.keyHeight.toFixed(1)}h / ${lightTuning.keyIntensity.toFixed(2)} | fill ${lightTuning.fillAngle.toFixed(0)}deg / ${lightTuning.fillHeight.toFixed(1)}h / ${lightTuning.fillIntensity.toFixed(2)} | exposure ${lightTuning.exposure.toFixed(2)}`}
        </div>
      </CardContent>
    </Card>
  )
}
