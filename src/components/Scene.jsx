import { Suspense, useCallback, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Sky, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { getFloorViewConfig } from '../content/floorSections'
import useAppStore from '../store/useAppStore'
import SunLight from './SunLight'
import Hotspots from './Hotspots'
import { CameraUpdater } from './SceneHelpers'
import Environment3D from './Environment3D'
import PostProcessing from './PostProcessing'
import PropertyModel from './PropertyModel'
import FirstPersonController from './FirstPersonController'
import ExplorerAvatar from './ExplorerAvatar'

function RendererExposureUpdater() {
  const exposure = useAppStore((state) => state.lightTuning.exposure)
  const get = useThree((state) => state.get)

  useEffect(() => {
    const renderer = get().gl
    renderer.toneMappingExposure = exposure
    renderer.localClippingEnabled = true
  }, [exposure, get])

  return null
}

function OrbitNavigator() {
  const { camera } = useThree()
  const controlsRef = useRef(null)
  const navMode = useAppStore((state) => state.navMode)
  const isExperienceFullscreen = useAppStore((state) => state.isExperienceFullscreen)
  const floorView = useAppStore((state) => state.floorView)
  const explorerLocalPosition = useAppStore((state) => state.explorer.localPosition)
  const modelTransform = useAppStore((state) => state.modelTransform)
  const floorConfig = getFloorViewConfig(floorView)
  const previousTargetRef = useRef(null)
  const previousFloorViewRef = useRef(floorView)
  const previousNavModeRef = useRef(navMode)

  const getFixedOrbitTarget = useCallback(
    (activeScale) => {
      const [targetX, targetY, targetZ] = floorConfig.orbit.target

      return new THREE.Vector3(
        modelTransform.positionX + targetX * activeScale,
        modelTransform.positionY + targetY * activeScale,
        modelTransform.positionZ + targetZ * activeScale,
      )
    },
    [floorConfig.orbit.target, modelTransform],
  )

  const getExplorerOrbitTarget = useCallback(
    (activeScale) => {
      const [localX, localY, localZ] = explorerLocalPosition

      return new THREE.Vector3(
        modelTransform.positionX + localX * activeScale,
        modelTransform.positionY + localY * activeScale - 0.68 * activeScale,
        modelTransform.positionZ + localZ * activeScale,
      )
    },
    [explorerLocalPosition, modelTransform],
  )

  useEffect(() => {
    if (navMode !== 'orbit') {
      previousNavModeRef.current = navMode
      return
    }

    const activeScale = modelTransform.scale
    const [cameraX, cameraY, cameraZ] = floorConfig.orbit.position
    const [targetX, targetY, targetZ] = floorConfig.orbit.target
    const fixedTarget = getFixedOrbitTarget(activeScale)
    const explorerTarget = getExplorerOrbitTarget(activeScale)
    const shouldTrackExplorer =
      floorView !== 'overview' &&
      ((previousNavModeRef.current === 'walk' && previousFloorViewRef.current === floorView) ||
        (previousNavModeRef.current === 'orbit' &&
          previousFloorViewRef.current === floorView &&
          previousTargetRef.current !== null))
    const nextTarget = shouldTrackExplorer ? explorerTarget : fixedTarget
    const nextOffset = new THREE.Vector3(
      (cameraX - targetX) * activeScale,
      (cameraY - targetY) * activeScale,
      (cameraZ - targetZ) * activeScale,
    )
    const shouldResetCamera =
      previousNavModeRef.current !== 'orbit' ||
      previousFloorViewRef.current !== floorView ||
      previousTargetRef.current === null

    if (shouldResetCamera) {
      camera.position.copy(nextTarget).add(nextOffset)
      camera.lookAt(nextTarget)
    } else if (shouldTrackExplorer && previousTargetRef.current) {
      camera.position.add(nextTarget.clone().sub(previousTargetRef.current))
    }

    if (controlsRef.current) {
      controlsRef.current.target.copy(nextTarget)
      controlsRef.current.update()
    }

    previousTargetRef.current = nextTarget
    previousFloorViewRef.current = floorView
    previousNavModeRef.current = navMode
  }, [
    camera,
    explorerLocalPosition,
    floorConfig,
    floorView,
    getExplorerOrbitTarget,
    getFixedOrbitTarget,
    modelTransform,
    navMode,
  ])

  if (navMode !== 'orbit') {
    return null
  }

  const activeScale = modelTransform.scale
  const orbitTarget = getFixedOrbitTarget(activeScale)

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={floorConfig.orbit.allowPan}
      enableZoom={isExperienceFullscreen || floorView !== 'overview'}
      enableRotate
      minDistance={floorConfig.orbit.minDistance * activeScale}
      maxDistance={floorConfig.orbit.maxDistance * activeScale}
      minPolarAngle={0.08}
      maxPolarAngle={Math.PI / 2 - 0.04}
      target={orbitTarget.toArray()}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.56}
      zoomSpeed={0.8}
      panSpeed={0.78}
    />
  )
}

function SceneContents() {
  const timeOfDay = useAppStore((state) => state.timeOfDay)
  const isLoading = useAppStore((state) => state.isLoading)
  const modelMode = useAppStore((state) => state.modelMode)
  const navMode = useAppStore((state) => state.navMode)
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
      <ExplorerAvatar />
      <RendererExposureUpdater />
      {modelMode !== 'glb' && <Hotspots />}
      {navMode === 'orbit' && <OrbitNavigator />}

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
