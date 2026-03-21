import CalibrationSection from './CalibrationSection'
import ExperienceSection from './ExperienceSection'
import HeroSection from './HeroSection'
import OverviewSection from './OverviewSection'
import SellingPointsSection from './SellingPointsSection'
import SiteHeader from './SiteHeader'

export default function PropertyLanding({ viewer }) {
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
