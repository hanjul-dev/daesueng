import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useAppStore from '../store/useAppStore'

export default function SunLight() {
  const lightRef = useRef()
  const fillLightRef = useRef()
  const timeOfDay = useAppStore((state) => state.timeOfDay)
  const modelMode = useAppStore((state) => state.modelMode)
  const modelTransform = useAppStore((state) => state.modelTransform)
  const lightTuning = useAppStore((state) => state.lightTuning)
  const isGlbMode = modelMode === 'glb'

  const { sunPosition, intensity, color, fillPosition, fillIntensity, fillColor } = useMemo(() => {
    const hour = timeOfDay
    const angle = ((hour - 6) / 12) * Math.PI
    const elevation = Math.sin(angle)
    const horizontal = Math.cos(angle)

    const isNight = hour < 5 || hour > 19
    const isDawn = hour >= 5 && hour < 7
    const isDusk = hour >= 17 && hour < 19

    let sunIntensity = 0
    let sunColor = new THREE.Color('#ffffff')
    let fillInt = 0
    let fillCol = new THREE.Color('#ffffff')

    if (isNight) {
      sunIntensity = 0.08
      sunColor = new THREE.Color('#1a237e')
      fillInt = 0.05
      fillCol = new THREE.Color('#1a1a4a')
    } else if (isDawn) {
      const t = (hour - 5) / 2
      sunIntensity = THREE.MathUtils.lerp(0.16, 0.74, t)
      sunColor = new THREE.Color().lerpColors(new THREE.Color('#ff6b35'), new THREE.Color('#ffb347'), t)
      fillInt = sunIntensity * 0.34
      fillCol = new THREE.Color('#ffe0b0')
    } else if (isDusk) {
      const t = (hour - 17) / 2
      sunIntensity = THREE.MathUtils.lerp(0.74, 0.16, t)
      sunColor = new THREE.Color().lerpColors(new THREE.Color('#ffb347'), new THREE.Color('#ff4500'), t)
      fillInt = sunIntensity * 0.3
      fillCol = new THREE.Color('#ff8040')
    } else {
      const noonProximity = 1 - Math.abs(hour - 12) / 6
      sunIntensity = THREE.MathUtils.lerp(0.56, 1.02, noonProximity)
      sunColor = new THREE.Color().lerpColors(new THREE.Color('#ffe4b5'), new THREE.Color('#ffffff'), noonProximity)
      fillInt = sunIntensity * 0.24
      fillCol = new THREE.Color('#c8d8f0')
    }

    return {
      sunPosition: [
        horizontal * 35,
        Math.max(elevation * 45, isNight ? -5 : 3),
        -18 + Math.sin(angle * 0.5) * 12,
      ],
      intensity: sunIntensity,
      color: sunColor,
      fillPosition: [-horizontal * 20, Math.max(elevation * 25, 5), 20],
      fillIntensity: fillInt,
      fillColor: fillCol,
    }
  }, [timeOfDay])

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.lerp(new THREE.Vector3(...sunPosition), 0.05)
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, intensity, 0.05)
      lightRef.current.color.lerp(color, 0.05)
    }

    if (fillLightRef.current) {
      fillLightRef.current.position.lerp(new THREE.Vector3(...fillPosition), 0.05)
      fillLightRef.current.intensity = THREE.MathUtils.lerp(fillLightRef.current.intensity, fillIntensity, 0.05)
      fillLightRef.current.color.lerp(fillColor, 0.05)
    }
  })

  const isNight = timeOfDay < 5 || timeOfDay > 19
  const keyAngleRad = THREE.MathUtils.degToRad(lightTuning.keyAngle)
  const fillAngleRad = THREE.MathUtils.degToRad(lightTuning.fillAngle)
  const keyRadius = 21.3
  const fillRadius = 10.2
  const keyLightPosition = [
    modelTransform.positionX + Math.sin(keyAngleRad) * keyRadius,
    modelTransform.positionY + lightTuning.keyHeight,
    modelTransform.positionZ + Math.cos(keyAngleRad) * keyRadius,
  ]
  const fillLightPosition = [
    modelTransform.positionX + Math.sin(fillAngleRad) * fillRadius,
    modelTransform.positionY + lightTuning.fillHeight,
    modelTransform.positionZ + Math.cos(fillAngleRad) * fillRadius,
  ]

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={sunPosition}
        intensity={intensity}
        color={color}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={120}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-bias={-0.0005}
        shadow-normalBias={0.03}
        shadow-radius={3}
      />

      <directionalLight
        ref={fillLightRef}
        position={fillPosition}
        intensity={fillIntensity}
        color={fillColor}
        castShadow={false}
      />

      <ambientLight
        intensity={
          isNight
            ? (isGlbMode ? 0.11 : 0.05)
            : THREE.MathUtils.lerp(isGlbMode ? 0.18 : 0.08, isGlbMode ? 0.36 : 0.22, intensity)
        }
        color={isNight ? '#122136' : '#d2dae4'}
      />

      <hemisphereLight
        args={[
          isNight ? '#142238' : '#a7d8ff',
          isNight ? '#0d1320' : '#54634a',
          isNight ? (isGlbMode ? 0.09 : 0.04) : (isGlbMode ? 0.28 : 0.18),
        ]}
      />

      {isGlbMode && (
        <>
          <directionalLight
            position={keyLightPosition}
            intensity={isNight ? Math.max(0.08, lightTuning.keyIntensity * 0.28) : lightTuning.keyIntensity}
            color={isNight ? '#7ea6ff' : '#fff1dc'}
            castShadow={false}
          />
          <pointLight
            position={fillLightPosition}
            intensity={isNight ? Math.max(0.12, lightTuning.fillIntensity * 0.16) : lightTuning.fillIntensity}
            color={isNight ? '#9ab2ff' : '#fff3e0'}
            distance={48}
            decay={2}
          />
        </>
      )}

      <pointLight position={[0, 3, -5]} intensity={isNight ? 2.1 : 0.22} color="#ffe4b5" distance={15} decay={2} />
      <pointLight position={[-8, 3, 0]} intensity={isNight ? 1.6 : 0.16} color="#ffe4b5" distance={12} decay={2} />
      <pointLight position={[8, 3, 0]} intensity={isNight ? 1.6 : 0.16} color="#ffe4b5" distance={12} decay={2} />
      <pointLight position={[0, 6.5, -5]} intensity={isNight ? 1.2 : 0.12} color="#ffe4b5" distance={12} decay={2} />

      <pointLight position={[-4, 6, -2]} intensity={isNight ? 0.8 : 0.1} color="#fff0d0" distance={10} decay={2} />
      <pointLight position={[4, 6, -2]} intensity={isNight ? 0.8 : 0.1} color="#fff0d0" distance={10} decay={2} />

      <rectAreaLight
        position={[0, -3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={30}
        height={30}
        intensity={isNight ? 0.02 : 0.08}
        color={isNight ? '#0a0a15' : '#e8e0d0'}
      />
    </>
  )
}
