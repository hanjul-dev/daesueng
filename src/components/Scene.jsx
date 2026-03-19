import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  Sky,
  Stars,
  Grid,
  AccumulativeShadows,
  RandomizedLight,
} from '@react-three/drei'
import * as THREE from 'three'
import useAppStore from '../store/useAppStore'
import Building from './Building'
import ImportedModel from './ImportedModel'
import SunLight from './SunLight'
import Hotspots from './Hotspots'
import FirstPersonController from './FirstPersonController'
import FPSTracker, { CameraUpdater } from './SceneHelpers'
import Environment3D from './Environment3D'
import PostProcessing from './PostProcessing'

function SceneContents() {
  const navMode = useAppStore((s) => s.navMode)
  const timeOfDay = useAppStore((s) => s.timeOfDay)
  const isNight = timeOfDay < 5 || timeOfDay > 19

  return (
    <>
      {/* 조명 */}
      <SunLight />

      {/* 하늘 — 대기 산란 시뮬레이션 */}
      {!isNight && (
        <Sky
          distance={450000}
          sunPosition={[
            Math.cos(((timeOfDay - 6) / 12) * Math.PI) * 30,
            Math.sin(((timeOfDay - 6) / 12) * Math.PI) * 40,
            -15,
          ]}
          inclination={0.5}
          azimuth={0.25}
          turbidity={timeOfDay > 16 || timeOfDay < 8 ? 10 : 3}
          rayleigh={timeOfDay > 16 || timeOfDay < 8 ? 4 : 0.8}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />
      )}

      {/* 별 (야간) */}
      {isNight && (
        <Stars radius={100} depth={50} count={3000} factor={3} saturation={0.5} fade />
      )}

      {/* ★★★ HDRI 환경맵 — IBL(Image Based Lighting) ★★★ */}
      {/* 건물과 유리에 사실적인 반사/환경광 제공 */}
      <Environment
        preset="apartment"
        background={false}
        environmentIntensity={isNight ? 0.15 : 0.9}
      />

      {/* 지면 그리드 (먼 거리) */}
      <Grid
        position={[0, -3.49, 0]}
        args={[200, 200]}
        cellSize={2}
        cellThickness={0.3}
        cellColor="#2a3a2a"
        sectionSize={10}
        sectionThickness={0.8}
        sectionColor="#3a5a40"
        fadeDistance={80}
        infiniteGrid
      />

      {/* 건물 */}
      {/* <Building /> 기존 코드로 만든 건물은 숨김 처리 */}
      <ImportedModel url="/house2-1k.glb" />

      {/* 외부 환경 (나무, 도로, 주변 건물 등) */}
      <Environment3D />

      {/* 핫스팟 마커 */}
      <Hotspots />

      {/* 궤도 컨트롤 */}
      {navMode === 'orbit' && (
        <OrbitControls
          makeDefault
          enablePan
          enableZoom
          enableRotate
          minDistance={5}
          maxDistance={80}
          maxPolarAngle={Math.PI / 2 - 0.05}
          target={[0, 2, 0]}
          enableDamping
          dampingFactor={0.05}
        />
      )}

      {/* 1인칭 컨트롤 */}
      <FirstPersonController />

      {/* 헬퍼 */}
      <FPSTracker />
      <CameraUpdater />

      {/* 안개 효과 (깊이감) — 더 자연스럽게 */}
      <fog attach="fog" args={[isNight ? '#0a0e1a' : '#b8c8d8', 60, 140]} />

      {/* ★★★ 후처리 효과 파이프라인 ★★★ */}
      <PostProcessing />
    </>
  )
}

export default function Scene() {
  const setLoadingProgress = useAppStore((s) => s.setLoadingProgress)
  const setLoaded = useAppStore((s) => s.setLoaded)

  useEffect(() => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 12 + 3
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setTimeout(() => setLoaded(), 500)
      }
      setLoadingProgress(Math.min(progress, 100))
    }, 250)
    return () => clearInterval(interval)
  }, [setLoadingProgress, setLoaded])

  return (
    <Canvas
      shadows="soft"
      camera={{
        position: [25, 20, 25],
        fov: 50,
        near: 0.1,
        far: 500,
      }}
      gl={{
        antialias: false, // SMAA handles this in post-processing
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: 'high-performance',
        physicallyCorrectLights: true,
      }}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  )
}
