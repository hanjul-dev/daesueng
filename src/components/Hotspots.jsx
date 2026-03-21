import { useEffect, useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useAppStore from '../store/useAppStore'
import { HOTSPOT_DETAILS } from '../content/property'

const HOTSPOTS = [
  { id: 'front-approach', position: [0.4, -1.4, -9.6] },
  { id: 'garage-access', position: [-6.2, -1.1, -7] },
  { id: 'double-height-glass', position: [4.8, 2.8, -7.4] },
  { id: 'balcony-line', position: [-1.8, 1.9, -9.2] },
  { id: 'gable-wing', position: [-7.7, 4.2, -0.8] },
]

function buildHotspotPayload(hotspot) {
  const copy = HOTSPOT_DETAILS[hotspot.id]
  return {
    ...hotspot,
    floor: copy?.floor ?? 'Exterior',
    title: copy?.title ?? hotspot.id,
    summary: copy?.summary ?? '',
  }
}

function HotspotMarker({ hotspot, index }) {
  const markerRef = useRef()
  const [hovered, setHovered] = useState(false)
  const selectedHotspot = useAppStore((state) => state.selectedHotspot)
  const setSelectedHotspot = useAppStore((state) => state.setSelectedHotspot)
  const isSelected = selectedHotspot?.id === hotspot.id
  const payload = buildHotspotPayload(hotspot)

  useEffect(
    () => () => {
      document.body.style.cursor = 'default'
    },
    [],
  )

  useFrame((frameState) => {
    if (!markerRef.current) return
    markerRef.current.position.y =
      hotspot.position[1] + Math.sin(frameState.clock.elapsedTime * 1.35 + index) * 0.08
  })

  const accentColor = isSelected ? '#111111' : hovered ? '#3f3f46' : '#71717a'

  return (
    <group ref={markerRef} position={hotspot.position}>
      <mesh
        onClick={(event) => {
          event.stopPropagation()
          setSelectedHotspot(payload)
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[isSelected ? 0.15 : 0.125, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={accentColor}
          emissiveIntensity={isSelected ? 0.58 : hovered ? 0.42 : 0.22}
          metalness={0.12}
          roughness={0.38}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.16, 0]}>
        <ringGeometry args={[0.24, 0.32, 36]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={isSelected ? 0.92 : hovered ? 0.72 : 0.48}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {(hovered || isSelected) && (
        <Html center position={[0, 0.58, 0]} distanceFactor={16} style={{ pointerEvents: 'none' }}>
          <div className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 shadow-[var(--theme-shadow-soft)]">
            {payload.title}
          </div>
        </Html>
      )}
    </group>
  )
}

export default function Hotspots() {
  return (
    <group>
      {HOTSPOTS.map((hotspot, index) => (
        <HotspotMarker key={hotspot.id} hotspot={hotspot} index={index} />
      ))}
    </group>
  )
}

export { HOTSPOTS }
