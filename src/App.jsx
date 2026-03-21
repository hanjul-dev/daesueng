import ExperienceViewer from './components/ExperienceViewer'
import PropertyLanding from './components/landing/PropertyLanding'

export default function App() {
  return (
    <div className="min-h-screen" id="app-root">
      <PropertyLanding viewer={<ExperienceViewer />} />
    </div>
  )
}
