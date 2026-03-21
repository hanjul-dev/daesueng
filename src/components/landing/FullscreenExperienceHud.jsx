import { Gamepad2, Monitor, MoonStar, SunMedium, X } from 'lucide-react'
import { TIME_PRESETS } from '../../content/property'
import { cn } from '../../lib/utils'
import useAppStore from '../../store/useAppStore'

export default function FullscreenExperienceHud({ isTouchDevice, onCloseFullscreen }) {
  const navMode = useAppStore((state) => state.navMode)
  const setNavMode = useAppStore((state) => state.setNavMode)
  const timeOfDay = useAppStore((state) => state.timeOfDay)
  const setTimeOfDay = useAppStore((state) => state.setTimeOfDay)

  function activateWalkMode() {
    setNavMode('walk')
    window.dispatchEvent(new Event('experience-enter-walk'))
  }

  function activateOrbitMode() {
    setNavMode('orbit')
  }

  const instructionText = isTouchDevice
    ? navMode === 'walk'
      ? '왼쪽 조이스틱으로 이동하고 오른쪽 패드로 시야를 조절하세요.'
      : '한 손가락 드래그로 회전하고 두 손가락으로 확대·축소할 수 있습니다.'
    : navMode === 'walk'
      ? '화면을 한 번 클릭한 뒤 마우스로 시야를 돌리고 WASD로 이동하세요. Esc로 마우스 잠금을 해제할 수 있습니다.'
      : '마우스로 드래그하며 회전하고 휠로 확대·축소할 수 있습니다.'

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/48 px-4 py-2 text-xs font-medium text-white backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-[color:var(--theme-island-glow)]" />
          몰입형 외관 체험
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
        <div className="pointer-events-auto max-w-md rounded-[28px] border border-white/12 bg-black/46 p-5 text-white backdrop-blur-2xl">
          <p className="text-xs uppercase tracking-[0.12em] text-white/58">Navigation</p>
          <p className="mt-2 text-lg font-semibold">
            {navMode === 'walk' ? '직접 걸어보는 모드' : '외관을 회전하며 보는 모드'}
          </p>
          <p className="mt-2 text-sm leading-7 text-white/78">{instructionText}</p>
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center gap-2 rounded-[28px] border border-white/12 bg-black/42 p-3 backdrop-blur-2xl">
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
              {preset.label === '야간' ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
