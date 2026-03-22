import { useEffect, useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useAppStore from '../store/useAppStore'
import { HOTSPOTS, buildHotspotPayload, findClosestHotspot } from '../content/hotspots'

function HotspotMarker({ hotspot, index }) {
  const markerRef = useRef()
  const [hovered, setHovered] = useState(false)
  const navMode = useAppStore((state) => state.navMode)
  const selectedHotspot = useAppStore((state) => state.selectedHotspot)
  const nearbyHotspot = useAppStore((state) => state.nearbyHotspot)
  const setSelectedHotspot = useAppStore((state) => state.setSelectedHotspot)
  const isSelected = selectedHotspot?.id === hotspot.id
  const isNearby = nearbyHotspot?.id === hotspot.id && navMode === 'walk'
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

  const accentColor = isSelected ? '#111111' : isNearby ? '#1d4ed8' : hovered ? '#3f3f46' : '#71717a'

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

      {(hovered || isSelected || isNearby) && (
        <Html center position={[0, isNearby ? 0.92 : 0.58, 0]} distanceFactor={16} style={{ pointerEvents: 'none' }}>
          <div className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 shadow-[var(--theme-shadow-soft)]">
            {isNearby ? `F 상세 보기 · ${payload.title}` : payload.title}
          </div>
        </Html>
      )}
    </group>
  )
}

export default function Hotspots() {
  const modelMode = useAppStore((state) => state.modelMode)
  const navMode = useAppStore((state) => state.navMode)
  const hotspotOverlayEnabled = useAppStore((state) => state.hotspotOverlayEnabled)
  const explorerLocalPosition = useAppStore((state) => state.explorer.localPosition)
  const modelTransform = useAppStore((state) => state.modelTransform)
  const nearbyHotspot = useAppStore((state) => state.nearbyHotspot)
  const setSelectedHotspot = useAppStore((state) => state.setSelectedHotspot)
  const setNearbyHotspot = useAppStore((state) => state.setNearbyHotspot)
  const clearNearbyHotspot = useAppStore((state) => state.clearNearbyHotspot)
  const previousNearbyIdRef = useRef(null)

  useEffect(() => {
    if (hotspotOverlayEnabled || navMode === 'walk') {
      return undefined
    }

    clearNearbyHotspot()
    previousNearbyIdRef.current = null
    return undefined
  }, [clearNearbyHotspot, hotspotOverlayEnabled, navMode])

  useEffect(() => {
    if (!hotspotOverlayEnabled || navMode !== 'walk') {
      return undefined
    }

    function handleKeyDown(event) {
      if (event.code !== 'KeyF' || !nearbyHotspot) {
        return
      }

      event.preventDefault()
      setSelectedHotspot(nearbyHotspot)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hotspotOverlayEnabled, navMode, nearbyHotspot, setSelectedHotspot])

  useFrame(() => {
    if (!hotspotOverlayEnabled || navMode !== 'walk') {
      if (previousNearbyIdRef.current !== null) {
        previousNearbyIdRef.current = null
        clearNearbyHotspot()
      }
      return
    }

    const nextHotspot = findClosestHotspot(explorerLocalPosition)
    const nextHotspotId = nextHotspot?.id ?? null

    if (previousNearbyIdRef.current === nextHotspotId) {
      return
    }

    previousNearbyIdRef.current = nextHotspotId
    if (nextHotspot) {
      setNearbyHotspot(nextHotspot)
    } else {
      clearNearbyHotspot()
    }
  })

  if (!hotspotOverlayEnabled || modelMode !== 'glb') {
    return null
  }

  return (
    <group
      position={[
        modelTransform.positionX,
        modelTransform.positionY,
        modelTransform.positionZ,
      ]}
      scale={modelTransform.scale}
    >
      {HOTSPOTS.map((hotspot, index) => (
        <HotspotMarker key={hotspot.id} hotspot={hotspot} index={index} />
      ))}
    </group>
  )
}

export { HOTSPOTS }
