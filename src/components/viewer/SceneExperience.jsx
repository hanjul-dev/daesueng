import LoadingScreen from '../LoadingScreen'
import Scene from '../Scene'

export default function SceneExperience() {
  return (
    <div className="relative h-full">
      <Scene />
      <LoadingScreen />
    </div>
  )
}
