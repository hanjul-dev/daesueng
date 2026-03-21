import PropertyLanding from './components/landing/PropertyLanding'
import LoadingScreen from './components/LoadingScreen'
import Scene from './components/Scene'

export default function App() {
  const viewer = (
    <div className="relative h-full">
      <Scene />
      <LoadingScreen />
    </div>
  )

  return (
    <div className="min-h-screen" id="app-root">
      <PropertyLanding viewer={viewer} />
    </div>
  )
}
