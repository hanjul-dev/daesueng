import { ArrowRight, CarFront, House, TreePine } from 'lucide-react'
import { PROPERTY_CONTENT, PROPERTY_MEDIA } from '../../content/property'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import PropertyShot from './PropertyShot'
import { scrollToSection } from './landingUtils'

const HERO_ICONS = [House, TreePine, CarFront]

export default function HeroSection() {
  const [primaryMedia, ...secondaryMedia] = PROPERTY_MEDIA

  return (
    <section className="layout-shell layout-shell--wide pb-10 pt-10 sm:pt-16 lg:pb-16 xl:pb-20">
      <div className="grid grid-cols-12 gap-4 lg:gap-5 xl:gap-6 2xl:gap-7">
        <div className="col-span-12 space-y-8 xl:col-span-6 xl:self-center xl:space-y-10 xl:pr-8">
          <div className="space-y-5">
            <Badge variant="secondary">{PROPERTY_CONTENT.badge}</Badge>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[color:var(--theme-foreground)] sm:text-5xl lg:text-6xl xl:text-[4.25rem] 2xl:text-[4.75rem]">
                {PROPERTY_CONTENT.title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[color:var(--theme-muted-foreground)] sm:text-lg xl:max-w-3xl">
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
        </div>

        <PropertyShot
          tone={primaryMedia.tone}
          eyebrow={primaryMedia.eyebrow}
          title={primaryMedia.title}
          description={primaryMedia.description}
          className="col-span-12 xl:col-span-6 min-h-[360px] sm:min-h-[460px] xl:min-h-[540px] 2xl:min-h-[620px]"
        />

        {PROPERTY_CONTENT.heroFacts.map((fact, index) => {
          const Icon = HERO_ICONS[index]
          const isLastCard = index === PROPERTY_CONTENT.heroFacts.length - 1

          return (
            <div
              key={fact.label}
              className={`col-span-12 rounded-[28px] border border-[color:var(--theme-border)] bg-white/72 p-5 shadow-[var(--theme-shadow-soft)] backdrop-blur-xl sm:col-span-4 ${
                isLastCard ? 'sm:col-span-4' : ''
              }`}
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

        {secondaryMedia.map((item) => (
          <PropertyShot
            key={item.title}
            tone={item.tone}
            eyebrow={item.eyebrow}
            title={item.title}
            description={item.description}
            className="col-span-12 sm:col-span-6 min-h-[300px] sm:min-h-[360px] xl:min-h-[420px] 2xl:min-h-[500px]"
          />
        ))}
      </div>
    </section>
  )
}
