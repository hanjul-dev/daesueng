import { ArrowRight, CarFront, House, TreePine } from 'lucide-react'
import { PROPERTY_CONTENT, PROPERTY_MEDIA } from '../../content/property'
import { cn } from '../../lib/utils'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import PropertyShot from './PropertyShot'
import { scrollToSection } from './landingUtils'

const HERO_ICONS = [House, TreePine, CarFront]

export default function HeroSection() {
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
