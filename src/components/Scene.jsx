import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Sky, Stars } from '@react-three/drei'
import * as THREE from 'three'
import useAppStore from '../store/useAppStore'
import SunLight from './SunLight'
import Hotspots from './Hotspots'
import { CameraUpdater } from './SceneHelpers'
import Environment3D from './Environment3D'
import PostProcessing from './PostProcessing'
import PropertyModel from './PropertyModel'
import FirstPersonController from './FirstPersonController'

function RendererExposureUpdater() {
  const exposure = useAppStore((state) => state.lightTuning.exposure)
  const get = useThree((state) => state.get)

  useEffect(() => {
    const renderer = get().gl
    renderer.toneMappingExposure = exposure
  }, [exposure, get])

  return null
}

function SceneContents() {
  const timeOfDay = useAppStore((state) => state.timeOfDay)
  const isLoading = useAppStore((state) => state.isLoading)
  const modelMode = useAppStore((state) => state.modelMode)
  const navMode = useAppStore((state) => state.navMode)
  const isExperienceFullscreen = useAppStore((state) => state.isExperienceFullscreen)
  const isNight = timeOfDay < 5 || timeOfDay > 19

  return (
    <>
      <color attach="background" args={[isNight ? '#12161d' : '#e7e4de']} />
      <SunLight />

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

      {isNight && (
        <Stars radius={100} depth={50} count={1800} factor={3} saturation={0.35} fade />
      )}

      <PropertyModel />
      <Environment3D />
      <RendererExposureUpdater />
      {modelMode !== 'glb' && <Hotspots />}

      {navMode === 'orbit' && (
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={isExperienceFullscreen}
          enableRotate
          minDistance={12}
          maxDistance={46}
          maxPolarAngle={Math.PI / 2 - 0.04}
          target={[0, 4.6, 0]}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.56}
          zoomSpeed={0.8}
        />
      )}

      <FirstPersonController />
      <CameraUpdater />
      <fog attach="fog" args={[isNight ? '#131820' : '#d8d2ca', 70, 150]} />
      {!isLoading && <PostProcessing />}
    </>
  )
}

export default function Scene() {
  const exposure = useAppStore((state) => state.lightTuning.exposure)

  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      camera={{
        position: [22, 10.5, 27],
        fov: 32,
        near: 0.1,
        far: 500,
      }}
      gl={{
        antialias: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: exposure,
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: 'high-performance',
        physicallyCorrectLights: true,
      }}
      dpr={[1, 1.35]}
      performance={{ min: 0.65 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  )
}
