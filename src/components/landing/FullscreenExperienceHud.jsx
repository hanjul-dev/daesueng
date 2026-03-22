import { Gamepad2, Layers3, Monitor, MoonStar, SunMedium, X } from 'lucide-react'
import { FLOOR_VIEWS, getFloorViewConfig } from '../../content/floorSections'
import { HOTSPOT_DETAILS, TIME_PRESETS } from '../../content/property'
import { cn } from '../../lib/utils'
import useAppStore from '../../store/useAppStore'

export default function FullscreenExperienceHud({ isTouchDevice, onCloseFullscreen }) {
  const navMode = useAppStore((state) => state.navMode)
  const setNavMode = useAppStore((state) => state.setNavMode)
  const floorView = useAppStore((state) => state.floorView)
  const setFloorView = useAppStore((state) => state.setFloorView)
  const timeOfDay = useAppStore((state) => state.timeOfDay)
  const setTimeOfDay = useAppStore((state) => state.setTimeOfDay)
  const hotspotOverlayEnabled = useAppStore((state) => state.hotspotOverlayEnabled)
  const setHotspotOverlayEnabled = useAppStore((state) => state.setHotspotOverlayEnabled)
  const nearbyHotspot = useAppStore((state) => state.nearbyHotspot)
  const selectedHotspot = useAppStore((state) => state.selectedHotspot)
  const setSelectedHotspot = useAppStore((state) => state.setSelectedHotspot)
  const clearSelectedHotspot = useAppStore((state) => state.clearSelectedHotspot)
  const activeFloor = getFloorViewConfig(floorView)
  const selectedHotspotCopy =
    hotspotOverlayEnabled && selectedHotspot && HOTSPOT_DETAILS[selectedHotspot.id]
      ? HOTSPOT_DETAILS[selectedHotspot.id]
      : null

  function activateWalkMode() {
    setNavMode('walk')
  }

  function activateOrbitMode() {
    setNavMode('orbit')
  }

  function toggleHotspotOverlay() {
    setHotspotOverlayEnabled(!hotspotOverlayEnabled)
  }

  function openNearbyHotspot() {
    if (!nearbyHotspot) {
      return
    }

    setSelectedHotspot(nearbyHotspot)
  }

  const instructionText = isTouchDevice
    ? navMode === 'walk'
      ? '왼쪽 조이스틱으로 이동하고 오른쪽 패드로 시선을 조절하세요. 높이는 Q와 E 버튼으로 바꿀 수 있습니다.'
      : floorView === 'overview'
        ? '드래그로 회전하고, 확대 또는 축소로 전체 매스를 살펴보세요.'
        : '층별 단면을 위에서 확인한 뒤 필요할 때 Walk 모드로 내려가면 됩니다.'
    : navMode === 'walk'
      ? '화면을 한 번 클릭한 뒤 WASD로 이동하세요. Q는 상승, E는 하강이고 가까운 포인트는 F로 바로 열 수 있습니다.'
      : floorView === 'overview'
        ? '마우스로 드래그하면 회전하고 휠로 확대와 축소가 가능합니다.'
        : 'Orbit 상태에서 층별 기준 시점을 먼저 보고, 필요하면 Walk로 내려가 디테일을 확인하세요.'

  const overlayHint = hotspotOverlayEnabled
    ? navMode === 'walk'
      ? nearbyHotspot
        ? isTouchDevice
          ? `${nearbyHotspot.title} 포인트가 가까이에 있습니다. 버튼으로 상세 설명을 열 수 있습니다.`
          : `${nearbyHotspot.title} 포인트가 가까이에 있습니다. F 키로 상세 설명을 열 수 있습니다.`
        : isTouchDevice
          ? '떠 있는 포인트를 탭하거나 가까워졌을 때 버튼으로 상세 설명을 열 수 있습니다.'
          : '떠 있는 포인트를 클릭하거나 가까워졌을 때 F 키로 상세 설명을 열 수 있습니다.'
      : 'Orbit에서도 떠 있는 포인트를 클릭하면 재질, 구조, 확인 범위를 바로 볼 수 있습니다.'
    : '작업자 참고 포인트 레이어가 꺼져 있습니다. 필요할 때만 켜서 설명과 재질 정보를 확인하세요.'

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/48 px-4 py-2 text-xs font-medium text-white backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-[color:var(--theme-island-glow)]" />
          외관 체험 모드
        </div>

        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/14 bg-black/48 p-1 backdrop-blur-xl">
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              navMode === 'orbit' ? 'bg-white text-black' : 'text-white/78 hover:text-white',
            )}
            onClick={activateOrbitMode}
          >
            <Monitor className="h-4 w-4" />
            Orbit
          </button>
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              navMode === 'walk' ? 'bg-white text-black' : 'text-white/78 hover:text-white',
            )}
            onClick={activateWalkMode}
          >
            <Gamepad2 className="h-4 w-4" />
            Walk
          </button>
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              hotspotOverlayEnabled ? 'bg-white text-black' : 'text-white/78 hover:text-white',
            )}
            onClick={toggleHotspotOverlay}
          >
            <Layers3 className="h-4 w-4" />
            포인트
          </button>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <div className="hidden rounded-full border border-white/12 bg-black/42 px-4 py-2 text-xs text-white/72 backdrop-blur-xl sm:block">
            {isTouchDevice ? '모바일 체험 모드' : 'PC 체험 모드'}
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-black/48 text-white backdrop-blur-xl transition-colors hover:bg-black/58"
            onClick={onCloseFullscreen}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full max-w-xl space-y-3">
          <div className="pointer-events-auto rounded-[28px] border border-white/12 bg-black/46 p-5 text-white backdrop-blur-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-white/58">Navigation</p>
                <p className="mt-2 text-lg font-semibold">
                  {navMode === 'walk' ? '직접 걸어보는 모드' : '회전하며 살펴보는 모드'}
                </p>
              </div>
              <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium text-white/82">
                {activeFloor.label}
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-white/78">{instructionText}</p>
            <div className="mt-4 rounded-[22px] border border-white/10 bg-white/6 px-4 py-3 text-sm leading-6 text-white/78">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-white/46">Hotspot Layer</p>
                  <p className="mt-1 font-medium text-white">
                    {hotspotOverlayEnabled ? '작업자 참고 포인트가 표시 중입니다.' : '작업자 참고 포인트가 꺼져 있습니다.'}
                  </p>
                </div>
                <button
                  type="button"
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition-colors',
                    hotspotOverlayEnabled
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white hover:bg-white/14',
                  )}
                  onClick={toggleHotspotOverlay}
                >
                  <Layers3 className="h-3.5 w-3.5" />
                  {hotspotOverlayEnabled ? '레이어 끄기' : '레이어 켜기'}
                </button>
              </div>
              <p className="mt-3">{overlayHint}</p>

              {hotspotOverlayEnabled && navMode === 'walk' && nearbyHotspot && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/86">
                    가까운 포인트: {nearbyHotspot.title}
                  </span>
                  {(isTouchDevice || navMode === 'walk') && (
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full bg-white px-3 py-2 text-xs font-medium text-black transition-colors hover:bg-white/90"
                      onClick={openNearbyHotspot}
                    >
                      상세 보기
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedHotspotCopy && (
            <div className="pointer-events-auto rounded-[28px] border border-white/12 bg-black/52 p-5 text-white backdrop-blur-2xl">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="inline-flex rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium text-white/78">
                    {selectedHotspotCopy.floor}
                  </div>
                  <h3 className="text-xl font-semibold">{selectedHotspotCopy.title}</h3>
                  <p className="max-w-lg text-sm leading-7 text-white/74">
                    {selectedHotspotCopy.summary}
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex rounded-full border border-white/14 bg-white/8 px-3 py-2 text-xs font-medium text-white/82 transition-colors hover:bg-white/14"
                  onClick={clearSelectedHotspot}
                >
                  닫기
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-white/46">Material</p>
                  <p className="mt-2 text-sm leading-6 text-white/84">{selectedHotspotCopy.material}</p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-white/46">Check Range</p>
                  <p className="mt-2 text-sm leading-6 text-white/84">{selectedHotspotCopy.dimensions}</p>
                </div>
              </div>

              <div className="mt-4 max-h-[28vh] space-y-2 overflow-y-auto pr-1">
                {selectedHotspotCopy.details.map((detail) => (
                  <div
                    key={detail}
                    className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-3 text-sm leading-6 text-white/74"
                  >
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pointer-events-auto flex flex-col gap-3 rounded-[28px] border border-white/12 bg-black/42 p-3 backdrop-blur-2xl">
          <div className="flex flex-wrap items-center gap-2">
            {FLOOR_VIEWS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  floorView === item.id
                    ? 'bg-white text-black'
                    : 'bg-white/8 text-white/76 hover:bg-white/14 hover:text-white',
                )}
                onClick={() => setFloorView(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {TIME_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  Math.abs(timeOfDay - preset.value) < 0.26
                    ? 'bg-white text-black'
                    : 'bg-white/8 text-white/76 hover:bg-white/14 hover:text-white',
                )}
                onClick={() => setTimeOfDay(preset.value)}
              >
                {preset.value >= 19.5 ? (
                  <MoonStar className="h-4 w-4" />
                ) : (
                  <SunMedium className="h-4 w-4" />
                )}
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
