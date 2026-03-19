import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useAppStore from '../store/useAppStore'

export default function SunLight() {
  const lightRef = useRef()
  const fillLightRef = useRef()
  const timeOfDay = useAppStore((s) => s.timeOfDay)

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
      sunIntensity = 0.05
      sunColor = new THREE.Color('#1a237e')
      fillInt = 0.02
      fillCol = new THREE.Color('#1a1a4a')
    } else if (isDawn) {
      const t = (hour - 5) / 2
      sunIntensity = THREE.MathUtils.lerp(0.1, 0.8, t)
      sunColor = new THREE.Color().lerpColors(new THREE.Color('#ff6b35'), new THREE.Color('#ffb347'), t)
      fillInt = sunIntensity * 0.35
      fillCol = new THREE.Color('#ffe0b0')
    } else if (isDusk) {
      const t = (hour - 17) / 2
      sunIntensity = THREE.MathUtils.lerp(0.8, 0.1, t)
      sunColor = new THREE.Color().lerpColors(new THREE.Color('#ffb347'), new THREE.Color('#ff4500'), t)
      fillInt = sunIntensity * 0.3
      fillCol = new THREE.Color('#ff8040')
    } else {
      const noonProximity = 1 - Math.abs(hour - 12) / 6
      sunIntensity = THREE.MathUtils.lerp(0.6, 1.2, noonProximity)
      sunColor = new THREE.Color().lerpColors(new THREE.Color('#ffe4b5'), new THREE.Color('#ffffff'), noonProximity)
      fillInt = sunIntensity * 0.25
      fillCol = new THREE.Color('#c8d8f0')
    }

    // Fill light (반대쪽에서) — 간접광 시뮬레이션
    const fillPos = [-horizontal * 20, Math.max(elevation * 25, 5), 20]

    return {
      sunPosition: [
        horizontal * 35,
        Math.max(elevation * 45, isNight ? -5 : 3),
        -18 + Math.sin(angle * 0.5) * 12,
      ],
      intensity: sunIntensity,
      color: sunColor,
      fillPosition: fillPos,
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

  return (
    <>
      {/* ★ Main directional (sun) light — 4K shadow map ★ */}
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

      {/* ★ Fill light — 간접 반사광 시뮬레이션 ★ */}
      <directionalLight
        ref={fillLightRef}
        position={fillPosition}
        intensity={fillIntensity}
        color={fillColor}
        castShadow={false}
      />

      {/* Ambient light — 기본 환경광 */}
      <ambientLight
        intensity={isNight ? 0.06 : THREE.MathUtils.lerp(0.12, 0.35, intensity)}
        color={isNight ? '#0d1b2a' : '#c0d0e0'}
      />

      {/* Hemisphere light — 하늘/지면 바운스 */}
      <hemisphereLight
        args={[
          isNight ? '#0d1b2a' : '#87ceeb',
          isNight ? '#0a0a15' : '#3a5a40',
          isNight ? 0.04 : 0.25,
        ]}
      />

      {/* Interior point lights — 실내 조명 */}
      <pointLight position={[0, 3, -5]} intensity={isNight ? 2.5 : 0.4} color="#ffe4b5" distance={15} decay={2} />
      <pointLight position={[-8, 3, 0]} intensity={isNight ? 2.0 : 0.3} color="#ffe4b5" distance={12} decay={2} />
      <pointLight position={[8, 3, 0]} intensity={isNight ? 2.0 : 0.3} color="#ffe4b5" distance={12} decay={2} />
      <pointLight position={[0, 6.5, -5]} intensity={isNight ? 1.5 : 0.2} color="#ffe4b5" distance={12} decay={2} />

      {/* 2F 간접 반사광 */}
      <pointLight position={[-4, 6, -2]} intensity={isNight ? 1.0 : 0.15} color="#fff0d0" distance={10} decay={2} />
      <pointLight position={[4, 6, -2]} intensity={isNight ? 1.0 : 0.15} color="#fff0d0" distance={10} decay={2} />

      {/* Ground bounce light — 지면 반사 */}
      <rectAreaLight
        position={[0, -3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={30}
        height={30}
        intensity={isNight ? 0.02 : 0.15}
        color={isNight ? '#0a0a15' : '#e8e0d0'}
      />
    </>
  )
}
