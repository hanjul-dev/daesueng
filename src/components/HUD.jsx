import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Building2,
  CarFront,
  Gamepad2,
  House,
  MapPinned,
  Maximize2,
  Monitor,
  MoonStar,
  MoveRight,
  Play,
  SunMedium,
  TreePine,
  X,
} from 'lucide-react'
import useAppStore from '../store/useAppStore'
import { HOTSPOTS } from './Hotspots'
import {
  HOTSPOT_DETAILS,
  OVERVIEW_CARDS,
  PROPERTY_CONTENT,
  PROPERTY_MEDIA,
  SELLING_POINTS,
  TIME_PRESETS,
  TOUR_CONTENT,
  TOUR_HIGHLIGHTS,
} from '../content/property'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Slider } from './ui/slider'
import { cn } from '../lib/utils'
import VirtualJoystick from './VirtualJoystick'
import exteriorHeroImage from '../assets/property/exterior-hero.jpeg'
import exteriorAngleImage from '../assets/property/exterior-angle.jpeg'
import exteriorMaterialImage from '../assets/property/exterior-material.jpeg'

const HERO_ICONS = [House, TreePine, CarFront]
const PHOTO_ASSET_BY_TONE = {
  hero: {
    src: exteriorHeroImage,
    position: 'center center',
  },
  park: {
    src: exteriorAngleImage,
    position: 'center center',
  },
  garage: {
    src: exteriorMaterialImage,
    position: 'center center',
  },
}

function scrollToSection(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function formatTime(hour) {
  const roundedHour = Math.floor(hour)
  const minutes = Math.round((hour - roundedHour) * 60)
  const period = roundedHour >= 12 ? '오후' : '오전'
  const displayHour = roundedHour === 0 ? 12 : roundedHour > 12 ? roundedHour - 12 : roundedHour
  return `${period} ${displayHour}시 ${minutes.toString().padStart(2, '0')}분`
}

function getTimeNarrative(hour) {
  if (hour < 8) {
    return '이른 시간대에는 전면 석재와 프레임 대비가 차분하게 읽혀 첫인상 판단에 좋습니다.'
  }
  if (hour < 15) {
    return '주간광에서는 커튼월 비례와 발코니 수평선이 가장 선명하게 보입니다.'
  }
  if (hour < 19.5) {
    return '석양 구간은 처마 깊이와 매스의 입체감이 가장 풍부하게 드러나는 시간입니다.'
  }
  return '야간에는 유리 면의 반사와 실내 빛 분위기가 더해져 외관의 무드가 달라집니다.'
}

function findHotspot(id) {
  return HOTSPOTS.find((hotspot) => hotspot.id === id) ?? null
}

function PropertyShot({ tone, eyebrow, title, description, className }) {
  const photoAsset = PHOTO_ASSET_BY_TONE[tone]

  return (
    <article className={cn('photo-surface', `photo-surface--${tone}`, className)}>
      {photoAsset && (
        <>
          <img
            src={photoAsset.src}
            alt={title}
            className="photo-surface__image"
            style={{ objectPosition: photoAsset.position }}
          />
          <div className="photo-surface__overlay" />
        </>
      )}
      <div className="photo-surface__grain" />
      <div className="relative z-10 flex h-full flex-col justify-between gap-10">
        <div className="max-w-[72%] space-y-3">
          <Badge variant="inverse" className="w-fit border-white/15 bg-black/60 text-white">
            {eyebrow}
          </Badge>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[30px]">
              {title}
            </h3>
            <p className="text-sm leading-7 text-white/80 sm:text-[15px]">{description}</p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-medium text-white/86 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-white/70" />
          Real Exterior Photo
        </div>
      </div>
    </article>
  )
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--theme-border)] bg-white/82 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:flex-nowrap sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Badge>{PROPERTY_CONTENT.brand}</Badge>
          <span className="hidden text-sm text-[color:var(--theme-subtle-foreground)] sm:block">
            {PROPERTY_CONTENT.badge}
          </span>
        </div>

        <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 sm:w-auto sm:overflow-visible sm:pb-0">
          <Button variant="ghost" size="sm" onClick={() => scrollToSection('overview')}>
            매물 소개
          </Button>
          <Button variant="ghost" size="sm" onClick={() => scrollToSection('experience')}>
            외관 체험
          </Button>
          <Button size="sm" onClick={() => scrollToSection('experience')}>
            둘러보기
          </Button>
        </div>
      </div>
    </header>
  )
}

function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pt-16 lg:px-8 lg:pb-16">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)] md:items-start lg:gap-8">
        <div className="space-y-8">
          <div className="space-y-5">
            <Badge variant="secondary">{PROPERTY_CONTENT.badge}</Badge>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-[color:var(--theme-foreground)] sm:text-5xl lg:text-6xl">
                {PROPERTY_CONTENT.title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[color:var(--theme-muted-foreground)] sm:text-lg">
                {PROPERTY_CONTENT.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => scrollToSection('overview')}>
              {PROPERTY_CONTENT.primaryAction}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => scrollToSection('experience')}>
              {PROPERTY_CONTENT.secondaryAction}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PROPERTY_CONTENT.heroFacts.map((fact, index) => {
              const Icon = HERO_ICONS[index]

              return (
                <div
                  key={fact.label}
                  className={cn(
                    'rounded-[28px] border border-[color:var(--theme-border)] bg-white/72 p-5 shadow-[var(--theme-shadow-soft)] backdrop-blur-xl',
                    index === PROPERTY_CONTENT.heroFacts.length - 1 ? 'col-span-2 sm:col-span-1' : '',
                  )}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--theme-accent-muted)]">
                    <Icon className="h-5 w-5 text-[color:var(--theme-foreground)]" />
                  </div>
                  <p className="text-xs text-[color:var(--theme-subtle-foreground)]">{fact.label}</p>
                  <p className="mt-2 text-base font-medium text-[color:var(--theme-foreground)]">
                    {fact.value}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
          {PROPERTY_MEDIA.map((item) => (
            <PropertyShot
              key={item.title}
              tone={item.tone}
              eyebrow={item.eyebrow}
              title={item.title}
              description={item.description}
              className={item.className}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function OverviewSection() {
  return (
    <section id="overview" className="mx-auto max-w-7xl scroll-mt-28 px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <Card className="rounded-[40px]">
          <CardHeader className="space-y-4">
            <Badge variant="secondary">매물 소개</Badge>
            <CardTitle className="max-w-3xl text-3xl sm:text-[40px]">
              {PROPERTY_CONTENT.overviewTitle}
            </CardTitle>
            <CardDescription className="max-w-3xl text-[15px]">
              {PROPERTY_CONTENT.overviewDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {PROPERTY_CONTENT.overviewNarrative.map((item) => (
              <div
                key={item}
                className="rounded-[26px] border border-[color:var(--theme-border)] bg-white/72 px-5 py-4 text-sm leading-7 text-[color:var(--theme-muted-foreground)]"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {OVERVIEW_CARDS.map((item) => (
            <Card key={item.label} className="rounded-[34px]">
              <CardHeader className="space-y-2">
                <Badge>{item.label}</Badge>
                <CardTitle className="text-[26px]">{item.value}</CardTitle>
                <CardDescription className="text-[15px]">{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function SellingPointsSection() {
  const pointIcons = [Building2, MapPinned, CarFront]

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge variant="secondary">핵심 요약</Badge>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[color:var(--theme-foreground)] sm:text-4xl">
            처음 볼 때 바로 판단해야 할 세 가지
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-[color:var(--theme-muted-foreground)] sm:text-[15px]">
          {PROPERTY_CONTENT.contactLine}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {SELLING_POINTS.map((point, index) => {
          const Icon = pointIcons[index]

          return (
            <Card key={point.title} className="rounded-[32px]">
              <CardHeader className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--theme-accent-muted)]">
                  <Icon className="h-5 w-5 text-[color:var(--theme-foreground)]" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-[28px]">{point.title}</CardTitle>
                  <CardDescription className="text-[15px]">{point.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

function ModelAdjustmentPanel() {
  const modelTransform = useAppStore((state) => state.modelTransform)
  const setModelTransform = useAppStore((state) => state.setModelTransform)
  const resetModelTransform = useAppStore((state) => state.resetModelTransform)

  const adjustmentItems = [
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
          하단이 잘리거나 프레임이 어긋나면 여기서 값을 움직여보세요. 맞는 값을 주시면 그대로 고정하겠습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {adjustmentItems.map((item) => (
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
          현재 값:
          {' '}
          {`scale ${modelTransform.scale.toFixed(2)} / x ${modelTransform.positionX.toFixed(1)} / y ${modelTransform.positionY.toFixed(1)} / z ${modelTransform.positionZ.toFixed(1)}`}
        </div>
      </CardContent>
    </Card>
  )
}

function LightAdjustmentPanel() {
  const lightTuning = useAppStore((state) => state.lightTuning)
  const setLightTuning = useAppStore((state) => state.setLightTuning)
  const resetLightTuning = useAppStore((state) => state.resetLightTuning)

  const adjustmentItems = [
    { key: 'keyAngle', label: 'Sun Angle', min: -180, max: 180, step: 1 },
    { key: 'keyHeight', label: 'Sun Height', min: 4, max: 32, step: 0.5 },
    { key: 'keyIntensity', label: 'Sun Intensity', min: 0, max: 2.4, step: 0.01 },
    { key: 'fillAngle', label: 'Fill Angle', min: -180, max: 180, step: 1 },
    { key: 'fillHeight', label: 'Fill Height', min: 2, max: 20, step: 0.5 },
    { key: 'fillIntensity', label: 'Fill Intensity', min: 0, max: 3.2, step: 0.01 },
    { key: 'exposure', label: 'Exposure', min: 0.4, max: 1.6, step: 0.01 },
  ]

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
          Tune the dedicated light for the GLB facade, then send the values and we can hardcode
          them.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {adjustmentItems.map((item) => (
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

function ExperienceControls() {
  const timeOfDay = useAppStore((state) => state.timeOfDay)
  const setTimeOfDay = useAppStore((state) => state.setTimeOfDay)
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

  return (
    <div className="space-y-4">
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
          <Badge variant="secondary">주요 포인트</Badge>
          <CardTitle className="text-[26px]">외관에서 먼저 볼 부분</CardTitle>
          <CardDescription className="text-[15px]">
            고객이 가장 많이 확인하는 포인트만 간결하게 추려 배치했습니다.
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

function CalibrationSection() {
  const [isOpen, setIsOpen] = useState(false)

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
              These sliders live at the bottom only for alignment and lighting calibration, so they
              can be removed later without changing the landing layout above.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={() => setIsOpen((open) => !open)}>
            {isOpen ? '보정 패널 접기' : '보정 패널 열기'}
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

function FullscreenExperienceHud({ isTouchDevice, onCloseFullscreen }) {
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
      ? '좌측 조이스틱으로 이동하고 우측 패드로 시야를 조절하세요.'
      : '손가락 드래그로 외관을 회전하고 두 손가락으로 확대·축소할 수 있습니다.'
    : navMode === 'walk'
      ? '장면을 한 번 클릭한 뒤 마우스로 시야를 돌리고 WASD로 이동하세요. Esc로 마우스 잠금을 해제할 수 있습니다.'
      : '마우스 드래그로 회전하고 휠로 확대·축소할 수 있습니다.'

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

function ExperienceSection({ viewer }) {
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

  async function toggleFullscreen() {
    const stageNode = stageRef.current
    if (!stageNode) return

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
    <section id="experience" className="mx-auto max-w-7xl scroll-mt-28 px-4 pb-20 sm:px-6 lg:px-8">
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

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="order-2 lg:order-1">
            <ExperienceControls />
          </div>

          <div ref={stageRef} className="tour-stage order-1 lg:order-2" id="tour-stage">
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
                <Button variant="outline" size="sm" onClick={() => openCuratedView('double-height-glass', 18.25)}>
                  <SunMedium className="h-4 w-4" />
                  석양 보기
                </Button>
                <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                  <Maximize2 className="h-4 w-4" />
                  {isFullscreen ? '전체화면 닫기' : '전체화면'}
                </Button>
              </div>
            </div>

            <div className="tour-stage__description px-6 pt-2">
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

export default function HUD({ viewer }) {
  return (
    <div className="min-h-screen bg-transparent text-[color:var(--theme-foreground)]">
      <SiteHeader />
      <HeroSection />
      <OverviewSection />
      <SellingPointsSection />
      <ExperienceSection viewer={viewer} />
      <CalibrationSection />
    </div>
  )
}
