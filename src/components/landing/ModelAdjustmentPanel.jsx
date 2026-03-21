import useAppStore from '../../store/useAppStore'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Slider } from '../ui/slider'

const ADJUSTMENT_ITEMS = [
  {
    key: 'scale',
    label: 'Scale',
    min: 0.4,
    max: 1.8,
    step: 0.01,
  },
  {
    key: 'positionX',
    label: 'Position X',
    min: -20,
    max: 20,
    step: 0.1,
  },
  {
    key: 'positionY',
    label: 'Position Y',
    min: -18,
    max: 8,
    step: 0.1,
  },
  {
    key: 'positionZ',
    label: 'Position Z',
    min: -20,
    max: 20,
    step: 0.1,
  },
]

export default function ModelAdjustmentPanel() {
  const modelTransform = useAppStore((state) => state.modelTransform)
  const setModelTransform = useAppStore((state) => state.setModelTransform)
  const resetModelTransform = useAppStore((state) => state.resetModelTransform)

  return (
    <Card className="rounded-[34px]">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2">
            <Badge variant="secondary">임시 정렬 조정</Badge>
            <CardTitle className="text-[26px]">모델 위치 맞추기</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={resetModelTransform}>
            초기화
          </Button>
        </div>
        <CardDescription className="text-[15px]">
          하단이 잘리거나 프레이밍이 어긋나면 여기서 값을 움직여보세요. 맞는 값을 주시면 그대로
          고정하겠습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {ADJUSTMENT_ITEMS.map((item) => (
          <div key={item.key} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[color:var(--theme-foreground)]">{item.label}</p>
              <p className="text-xs text-[color:var(--theme-subtle-foreground)]">
                {Number(modelTransform[item.key]).toFixed(item.key === 'scale' ? 2 : 1)}
              </p>
            </div>
            <Slider
              min={item.min}
              max={item.max}
              step={item.step}
              value={[modelTransform[item.key]]}
              onValueChange={([nextValue]) => setModelTransform({ [item.key]: nextValue })}
            />
          </div>
        ))}

        <div className="rounded-[22px] border border-[color:var(--theme-border)] bg-white/72 px-4 py-3 text-xs leading-6 text-[color:var(--theme-muted-foreground)]">
          {`현재 값: scale ${modelTransform.scale.toFixed(2)} / x ${modelTransform.positionX.toFixed(1)} / y ${modelTransform.positionY.toFixed(1)} / z ${modelTransform.positionZ.toFixed(1)}`}
        </div>
      </CardContent>
    </Card>
  )
}
