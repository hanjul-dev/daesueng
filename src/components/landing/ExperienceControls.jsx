import { Gamepad2, Layers3, Monitor, MoveRight } from 'lucide-react'
import { useMemo } from 'react'
import { FLOOR_VIEWS, getFloorViewConfig } from '../../content/floorSections'
import { HOTSPOT_DETAILS, TIME_PRESETS, TOUR_HIGHLIGHTS } from '../../content/property'
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
  const hotspotOverlayEnabled = useAppStore((state) => state.hotspotOverlayEnabled)
  const setHotspotOverlayEnabled = useAppStore((state) => state.setHotspotOverlayEnabled)
  const nearbyHotspot = useAppStore((state) => state.nearbyHotspot)
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

  function openHotspotDetail(hotspot) {
    setHotspotOverlayEnabled(true)
    setSelectedHotspot(hotspot)
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
            데스크톱에서는 뷰어를 한 번 클릭한 뒤 <span className="font-semibold text-[color:var(--theme-foreground)]">WASD</span>로 이동하고,{' '}
            <span className="font-semibold text-[color:var(--theme-foreground)]">Q / E</span>로 높이를 조절할 수 있습니다.
            작업 포인트를 켜면 Walk 모드에서 가까이 간 뒤{' '}
            <span className="font-semibold text-[color:var(--theme-foreground)]">F</span> 키로 상세 설명을 열 수 있습니다.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-[34px]">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-2">
              <Badge variant="secondary">작업자 참고</Badge>
              <CardTitle className="text-[26px]">상호작용 포인트 레이어</CardTitle>
            </div>
            <Badge>{hotspotOverlayEnabled ? 'ON' : 'OFF'}</Badge>
          </div>
          <CardDescription className="text-[15px]">
            고객에게는 깔끔한 외관만 보여주고, 필요할 때만 재질·구조·입면 판단 포인트를 떠 있는 오브젝트로 켤 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant={hotspotOverlayEnabled ? 'default' : 'outline'}
            onClick={() => setHotspotOverlayEnabled(!hotspotOverlayEnabled)}
          >
            <Layers3 className="h-4 w-4" />
            {hotspotOverlayEnabled ? '참고 포인트 끄기' : '참고 포인트 켜기'}
          </Button>

          <p className="text-xs leading-6 text-[color:var(--theme-subtle-foreground)]">
            포인트를 켜면 떠 있는 오브젝트를 클릭해 상세 설명을 열 수 있습니다. Walk 모드에서는 가까이 갔을 때
            {' '}<span className="font-semibold text-[color:var(--theme-foreground)]">F</span> 키 상호작용도 가능합니다.
          </p>

          {hotspotOverlayEnabled && navMode === 'walk' && nearbyHotspot && (
            <div className="rounded-[22px] border border-[color:var(--theme-border-strong)] bg-white/82 px-4 py-3 text-sm leading-6 text-[color:var(--theme-foreground)] shadow-[var(--theme-shadow-soft)]">
              현재 가까운 포인트: <span className="font-semibold">{nearbyHotspot.title}</span>
              {' '}· F 키로 상세 보기
            </div>
          )}
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
            고객 설득 포인트이면서 동시에 작업자 참고 포인트가 될 수 있는 항목만 간결하게 추려두었습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {hotspotOverlayEnabled ? (
            highlightItems.map(({ id, title, description, hotspot }) => {
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
                  onClick={() => openHotspotDetail(hotspot)}
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
            })
          ) : (
            <div className="rounded-[24px] border border-dashed border-[color:var(--theme-border)] bg-[color:var(--theme-panel-muted)] px-4 py-5 text-sm leading-7 text-[color:var(--theme-muted-foreground)]">
              참고 포인트 레이어가 꺼져 있습니다. 위 스위치를 켜면 떠 있는 오브젝트와 상세 설명 패널이 함께 활성화됩니다.
            </div>
          )}
        </CardContent>
      </Card>

      {hotspotOverlayEnabled && selectedHotspotCopy && (
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
                <p className="text-xs text-[color:var(--theme-subtle-foreground)]">주요 재질</p>
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
