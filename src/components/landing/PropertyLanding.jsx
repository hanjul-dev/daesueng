import { cn } from '../../lib/utils'
import CalibrationSection from './CalibrationSection'
import ExperienceSection from './ExperienceSection'
import HeroSection from './HeroSection'
import OverviewSection from './OverviewSection'
import SellingPointsSection from './SellingPointsSection'
import SiteHeader from './SiteHeader'
import useDesktopLayout from './useDesktopLayout'

export default function PropertyLanding({ viewer }) {
  const isDesktopLayout = useDesktopLayout()

  return (
    <div
      className={cn(
        'min-h-screen w-full bg-transparent text-[color:var(--theme-foreground)]',
        isDesktopLayout && 'min-w-[1180px]',
      )}
    >
      <SiteHeader isDesktopLayout={isDesktopLayout} />
      <HeroSection isDesktopLayout={isDesktopLayout} />
      <OverviewSection isDesktopLayout={isDesktopLayout} />
      <SellingPointsSection isDesktopLayout={isDesktopLayout} />
      <ExperienceSection viewer={viewer} isDesktopLayout={isDesktopLayout} />
      <CalibrationSection />
      <div aria-hidden="true" className="h-16 sm:h-20 lg:h-28" />
    </div>
  )
}
