import { PROPERTY_CONTENT } from '../../content/property'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { scrollToSection } from './landingUtils'

export default function SiteHeader() {
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
