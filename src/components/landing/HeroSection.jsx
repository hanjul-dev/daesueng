import { ArrowRight, CarFront, House, TreePine } from 'lucide-react'
import { PROPERTY_CONTENT, PROPERTY_MEDIA } from '../../content/property'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import PropertyShot from './PropertyShot'
import { scrollToSection } from './landingUtils'

const HERO_ICONS = [House, TreePine, CarFront]

export default function HeroSection() {
  return (
    <section className="layout-shell layout-shell--wide pb-10 pt-10 sm:pt-16 lg:pb-16 xl:pb-20">
      <div className="grid gap-6 lg:gap-8 xl:grid-cols-[minmax(0,0.94fr)_minmax(460px,1.06fr)] xl:items-start 2xl:gap-10 2xl:grid-cols-[minmax(0,0.88fr)_minmax(560px,1.12fr)]">
        <div className="space-y-8">
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

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:gap-4">
            {PROPERTY_CONTENT.heroFacts.map((fact, index) => {
              const Icon = HERO_ICONS[index]
              const isLastCard = index === PROPERTY_CONTENT.heroFacts.length - 1

              return (
                <div
                  key={fact.label}
                  className={`rounded-[28px] border border-[color:var(--theme-border)] bg-white/72 p-5 shadow-[var(--theme-shadow-soft)] backdrop-blur-xl ${
                    isLastCard ? 'col-span-2 sm:col-span-1' : ''
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
          </div>
        </div>

        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:gap-5">
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
