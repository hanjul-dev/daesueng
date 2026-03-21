import { PROPERTY_CONTENT } from '../../content/property'
import { cn } from '../../lib/utils'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { scrollToSection } from './landingUtils'

export default function SiteHeader({ isDesktopLayout }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--theme-border)] bg-white/82 backdrop-blur-2xl">
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8',
          isDesktopLayout ? 'flex-nowrap gap-4' : 'flex-wrap',
        )}
      >
        <div className="flex items-center gap-3">
          <Badge>{PROPERTY_CONTENT.brand}</Badge>
          <span className="hidden text-sm text-[color:var(--theme-subtle-foreground)] sm:block">
            {PROPERTY_CONTENT.badge}
          </span>
        </div>

        <div
          className={cn(
            'flex items-center gap-2',
            isDesktopLayout ? 'w-auto overflow-visible pb-0' : 'w-full overflow-x-auto pb-1',
          )}
        >
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
