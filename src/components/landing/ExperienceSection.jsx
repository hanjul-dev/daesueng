import { Maximize2, Play, SunMedium } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { TOUR_CONTENT } from '../../content/property'
import useAppStore from '../../store/useAppStore'
import VirtualJoystick from '../VirtualJoystick'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import ExperienceControls from './ExperienceControls'
import FullscreenExperienceHud from './FullscreenExperienceHud'
import { findHotspot } from './landingUtils'

export default function ExperienceSection({ viewer }) {
  const stageRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const setSelectedHotspot = useAppStore((state) => state.setSelectedHotspot)
  const setTimeOfDay = useAppStore((state) => state.setTimeOfDay)
  const setNavMode = useAppStore((state) => state.setNavMode)
  const setExperienceFullscreen = useAppStore((state) => state.setExperienceFullscreen)

  useEffect(() => {
    function updateTouchDevice() {
      setIsTouchDevice('ontouchstart' in window || (navigator.maxTouchPoints ?? 0) > 0)
    }

    updateTouchDevice()
    window.addEventListener('resize', updateTouchDevice)

    return () => window.removeEventListener('resize', updateTouchDevice)
  }, [])

  useEffect(() => {
    function handleFullscreenChange() {
      const fullscreenActive = document.fullscreenElement === stageRef.current
      setIsFullscreen(fullscreenActive)
      setExperienceFullscreen(fullscreenActive)

      if (!fullscreenActive) {
        setNavMode('orbit')
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [setExperienceFullscreen, setNavMode])

  useEffect(
    () => () => {
      setExperienceFullscreen(false)
    },
    [setExperienceFullscreen],
  )

  async function toggleFullscreen() {
    const stageNode = stageRef.current
    if (!stageNode) {
      return
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        return
      }

      await stageNode.requestFullscreen?.()
    } catch (error) {
      console.error('Failed to toggle fullscreen viewer', error)
    }
  }

  function openCuratedView(id, hour) {
    if (typeof hour === 'number') {
      setTimeOfDay(hour)
    }

    const hotspot = findHotspot(id)
    if (hotspot) {
      setSelectedHotspot(hotspot)
    }
  }

  return (
    <section id="experience" className="layout-shell layout-shell--wide scroll-mt-28 pb-20">
      <div className="space-y-6">
        <div className="tour-island">
          <div className="tour-island__shell">
            <span className="tour-island__pulse" />
            <span className="text-sm font-medium text-white">{TOUR_CONTENT.islandLabel}</span>
            <span className="hidden text-sm text-white/66 lg:inline">{TOUR_CONTENT.liveStatus}</span>
          </div>

          <div className="space-y-3 px-1 pt-6">
            <h2 className="max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              {TOUR_CONTENT.islandTitle}
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-white/78 sm:text-[15px]">
              {TOUR_CONTENT.islandDescription}
            </p>
          </div>

          <div className="flex flex-col gap-3 px-1 pt-5 sm:flex-row">
            <Button
              size="lg"
              className="border-white/12 bg-white text-[color:var(--theme-accent)] hover:bg-white/94"
              onClick={() => openCuratedView('front-approach', 10.5)}
            >
              <Play className="h-4 w-4 fill-current" />
              지금 둘러보기
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/14 bg-white/8 text-white hover:bg-white/14"
              onClick={toggleFullscreen}
            >
              <Maximize2 className="h-4 w-4" />
              전체화면으로 보기
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.84fr)_minmax(0,1.16fr)] xl:items-start 2xl:grid-cols-[minmax(360px,0.8fr)_minmax(0,1.2fr)]">
          <div className="order-2 xl:order-1">
            <ExperienceControls />
          </div>

          <div ref={stageRef} className="tour-stage order-1 xl:order-2" id="tour-stage">
            <div className="tour-stage__chrome">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-[color:var(--theme-subtle-foreground)]">
                  {TOUR_CONTENT.stageEyebrow}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-base font-medium text-[color:var(--theme-foreground)]">
                    {TOUR_CONTENT.stageTitle}
                  </p>
                  <Badge variant="secondary">실시간 4D 체험</Badge>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openCuratedView('double-height-glass', 18.25)}
                >
                  <SunMedium className="h-4 w-4" />
                  석양 보기
                </Button>
                <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                  <Maximize2 className="h-4 w-4" />
                  {isFullscreen ? '전체화면 닫기' : '전체화면'}
                </Button>
              </div>
            </div>

            <div className="tour-stage__description px-5 pt-2 sm:px-6 xl:px-7">
              <p className="max-w-2xl text-sm leading-7 text-[color:var(--theme-muted-foreground)]">
                {TOUR_CONTENT.stageDescription}
              </p>
            </div>

            <div className="tour-stage__viewer">
              <div className="relative h-full">
                {viewer}
                {isFullscreen && (
                  <>
                    <FullscreenExperienceHud
                      isTouchDevice={isTouchDevice}
                      onCloseFullscreen={toggleFullscreen}
                    />
                    <VirtualJoystick />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
