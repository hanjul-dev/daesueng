import Scene from './components/Scene'
import HUD from './components/HUD'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  return (
    <div className="min-h-screen" id="app-root">
      <HUD
        viewer={
          <div className="relative h-full">
            <Scene />
            <LoadingScreen />
          </div>
        }
      />
    </div>
  )
}
