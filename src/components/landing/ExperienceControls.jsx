import { Gamepad2, Layers3, Monitor, MoveRight } from 'lucide-react'
import { useMemo } from 'react'
import { FLOOR_VIEWS, getFloorViewConfig } from '../../content/floorSections'
import {
  HOTSPOT_DETAILS,
  TIME_PRESETS,
  TOUR_HIGHLIGHTS,
} from '../../content/property'
import { cn } from '../../lib/utils'
import useAppStore from '../../store/useAppStore'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Slider } from '../ui/slider'
import { findHotspot, formatTime, getTimeNarrative } from './landingUtils'

export default function ExperienceControls() {
  const timeOfDay = useAppStore((state) => state.timeOfDay)
  const setTimeOfDay = useAppStore((state) => state.setTimeOfDay)
  const navMode = useAppStore((state) => state.navMode)
  const setNavMode = useAppStore((state) => state.setNavMode)
  const floorView = useAppStore((state) => state.floorView)
  const setFloorView = useAppStore((state) => state.setFloorView)
  const selectedHotspot = useAppStore((state) => state.selectedHotspot)
  const setSelectedHotspot = useAppStore((state) => state.setSelectedHotspot)
  const clearSelectedHotspot = useAppStore((state) => state.clearSelectedHotspot)

  const highlightItems = useMemo(
    () =>
      TOUR_HIGHLIGHTS.map((item) => ({
        ...item,
        hotspot: findHotspot(item.id),
      })).filter((item) => item.hotspot),
    [],
  )

  const selectedHotspotCopy =
    selectedHotspot && HOTSPOT_DETAILS[selectedHotspot.id]
      ? HOTSPOT_DETAILS[selectedHotspot.id]
      : null
  const activeFloor = getFloorViewConfig(floorView)

  function activateWalkMode() {
    setNavMode('walk')
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-[34px]">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-2">
              <Badge variant="secondary">층별 단면</Badge>
              <CardTitle className="text-[26px]">층별로 잘라 보고 탐색하기</CardTitle>
            </div>
            <Badge>{activeFloor.label}</Badge>
          </div>
          <CardDescription className="text-[15px]">{activeFloor.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {FLOOR_VIEWS.map((item) => (
              <Button
                key={item.id}
                variant={floorView === item.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFloorView(item.id)}
              >
                <Layers3 className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              variant={navMode === 'orbit' ? 'default' : 'outline'}
              onClick={() => setNavMode('orbit')}
            >
              <Monitor className="h-4 w-4" />
              Orbit 위에서 보기
            </Button>
            <Button
              variant={navMode === 'walk' ? 'default' : 'outline'}
              onClick={activateWalkMode}
            >
              <Gamepad2 className="h-4 w-4" />
              사람 시점으로 걷기
            </Button>
          </div>

          <p className="text-xs leading-6 text-[color:var(--theme-subtle-foreground)]">
            층 단면을 고르면 사람 기준점이 함께 잡히고, 데스크톱에서는 걷기 모드로 바꾼 뒤 뷰어를
            한 번 클릭하면 바로 들어갈 수 있습니다. 모바일은 전체화면 조이스틱 방식이 더 안정적입니다.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-[34px]">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-2">
              <Badge variant="secondary">광량 프리셋</Badge>
              <CardTitle className="text-[26px]">시간대별 외관 인상</CardTitle>
            </div>
            <Badge>{formatTime(timeOfDay)}</Badge>
          </div>
          <CardDescription className="text-[15px]">{getTimeNarrative(timeOfDay)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {TIME_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant={Math.abs(timeOfDay - preset.value) < 0.26 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeOfDay(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <Slider
            min={6}
            max={21}
            step={0.25}
            value={[timeOfDay]}
            onValueChange={([nextValue]) => setTimeOfDay(nextValue)}
          />

          <div className="flex justify-between text-xs text-[color:var(--theme-subtle-foreground)]">
            <span>오전</span>
            <span>정오</span>
            <span>석양</span>
            <span>야간</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[34px]">
        <CardHeader className="space-y-3">
          <Badge variant="secondary">주요 시선</Badge>
          <CardTitle className="text-[26px]">외관에서 먼저 볼 포인트</CardTitle>
          <CardDescription className="text-[15px]">
            고객이 가장 많이 확인하는 외관 판단 요소만 간결하게 추려서 배치했습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {highlightItems.map(({ id, title, description, hotspot }) => {
            const isActive = selectedHotspot?.id === id

            return (
              <button
                key={id}
                type="button"
                className={cn(
                  'flex w-full items-start justify-between gap-4 rounded-[24px] border p-4 text-left transition-all',
                  isActive
                    ? 'border-[color:var(--theme-border-strong)] bg-white shadow-[var(--theme-shadow-soft)]'
                    : 'border-[color:var(--theme-border)] bg-[color:var(--theme-panel-muted)] hover:bg-white',
                )}
                onClick={() => setSelectedHotspot(hotspot)}
              >
                <div className="space-y-1">
                  <p className="text-base font-medium text-[color:var(--theme-foreground)]">{title}</p>
                  <p className="text-sm leading-6 text-[color:var(--theme-muted-foreground)]">
                    {description}
                  </p>
                </div>
                <MoveRight className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--theme-subtle-foreground)]" />
              </button>
            )
          })}
        </CardContent>
      </Card>

      {selectedHotspotCopy && (
        <Card className="rounded-[34px]">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-2">
                <Badge>{selectedHotspotCopy.floor}</Badge>
                <CardTitle className="text-[26px]">{selectedHotspotCopy.title}</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={clearSelectedHotspot}>
                닫기
              </Button>
            </div>
            <CardDescription className="text-[15px]">{selectedHotspotCopy.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-[color:var(--theme-border)] bg-white/72 p-4">
                <p className="text-xs text-[color:var(--theme-subtle-foreground)]">주요 재료</p>
                <p className="mt-2 text-sm font-medium leading-6 text-[color:var(--theme-foreground)]">
                  {selectedHotspotCopy.material}
                </p>
              </div>
              <div className="rounded-[22px] border border-[color:var(--theme-border)] bg-white/72 p-4">
                <p className="text-xs text-[color:var(--theme-subtle-foreground)]">확인 범위</p>
                <p className="mt-2 text-sm font-medium leading-6 text-[color:var(--theme-foreground)]">
                  {selectedHotspotCopy.dimensions}
                </p>
              </div>
            </div>

            <ul className="space-y-2">
              {selectedHotspotCopy.details.map((detail) => (
                <li
                  key={detail}
                  className="rounded-[20px] border border-[color:var(--theme-border)] bg-white/70 px-4 py-3 text-sm leading-6 text-[color:var(--theme-muted-foreground)]"
                >
                  {detail}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
