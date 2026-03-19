import Scene from './components/Scene'
import HUD from './components/HUD'
import LoadingScreen from './components/LoadingScreen'
import VirtualJoystick from './components/VirtualJoystick'

export default function App() {
  return (
    <div className="w-full h-full relative" id="app-root">
      {/* 3D 씬 */}
      <Scene />

      {/* UI 오버레이 */}
      <HUD />

      {/* 모바일 가상 조이스틱 */}
      <VirtualJoystick />

      {/* 로딩 화면 */}
      <LoadingScreen />
    </div>
  )
}
