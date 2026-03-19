import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import useAppStore from '../store/useAppStore'

const HOTSPOTS = [
  {
    id: 'lobby-entrance',
    position: [0, 2, -9.5],
    floor: '1F',
    title: '로비 입구 / Lobby Entrance',
    specs: {
      material: 'Tempered Glass Curtain Wall',
      dimensions: '8m × 3.5m',
      details: 'Double-pane Low-E Glass, U-value: 1.1 W/m²·K\nAluminum frame, powder coated\nAutomatic sliding doors',
    },
    icon: '🚪',
  },
  {
    id: 'office-area-left',
    position: [-11, 2, -3],
    floor: '1F',
    title: '사무실 공간 A / Office Area A',
    specs: {
      material: 'Gypsum Board + Paint Finish',
      dimensions: '8m × 12m (96m²)',
      details: 'Open floor plan with modular partitions\n12 workstations with cable management\nFloat floor for wire routing',
    },
    icon: '🏢',
  },
  {
    id: 'office-area-right',
    position: [11, 2, -3],
    floor: '1F',
    title: '사무실 공간 B / Office Area B',
    specs: {
      material: 'Acoustic Panel Walls',
      dimensions: '6m × 12m (72m²)',
      details: 'Conference room integrated\nSoundproofing NRC 0.85\nAdjustable LED panel lighting',
    },
    icon: '🏢',
  },
  {
    id: 'parking-b1',
    position: [0, -1.5, 0],
    floor: 'B1',
    title: '지하 주차장 / Underground Parking',
    specs: {
      material: 'Epoxy-coated Concrete',
      dimensions: '30m × 20m (600m²)',
      details: '24 parking spaces\nLED strip lighting\nVentilation system: 6 ACH\nFire suppression: wet pipe sprinkler',
    },
    icon: '🅿️',
  },
  {
    id: 'meeting-2f',
    position: [-3, 5.5, -7],
    floor: '2F',
    title: '회의실 / Conference Room',
    specs: {
      material: 'Wood Veneer + Acoustic Fabric',
      dimensions: '6m × 5m (30m²)',
      details: 'Capacity: 12 persons\n85" Interactive Display\nVideo conferencing system\nMotorized blackout blinds',
    },
    icon: '📋',
  },
  {
    id: 'elevator',
    position: [-6, 2, 8],
    floor: '1F',
    title: '엘리베이터 / Elevator',
    specs: {
      material: 'Stainless Steel / Granite Floor',
      dimensions: '2m × 2m × 2.5m',
      details: 'Capacity: 1000kg / 13 persons\nSpeed: 1.0 m/s\nServes: B1 to 2F\nEmergency backup power',
    },
    icon: '🛗',
  },
  {
    id: 'staircase',
    position: [6, 2, 7],
    floor: '1F',
    title: '계단실 / Staircase',
    specs: {
      material: 'Reinforced Concrete + Steel Railing',
      dimensions: '1.2m width, 14 risers',
      details: 'Riser height: 175mm\nTread depth: 280mm\nAnti-slip nosing\nFire-rated: 2-hour',
    },
    icon: '🪜',
  },
  {
    id: 'hvac-unit',
    position: [0, 3, 0],
    floor: '1F',
    title: 'HVAC 시스템 / HVAC System',
    specs: {
      material: 'Galvanized Steel Ductwork',
      dimensions: 'Main duct: 600mm × 400mm',
      details: 'VRF system: 40HP\nFresh air handling: 15 CMM\nZone control: 6 zones\nPM2.5 filtration',
    },
    icon: '❄️',
  },
]

function HotspotMarker({ hotspot }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const setSelectedHotspot = useAppStore((s) => s.setSelectedHotspot)
  const navMode = useAppStore((s) => s.navMode)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = hotspot.position[1] + Math.sin(state.clock.elapsedTime * 2 + hotspot.position[0]) * 0.15
    }
  })

  return (
    <group ref={meshRef} position={hotspot.position}>
      {/* Glowing sphere */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          setSelectedHotspot(hotspot)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = navMode === 'firstperson' ? 'crosshair' : 'grab'
        }}
      >
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? '#ff6b35' : '#00d4ff'}
          emissive={hovered ? '#ff6b35' : '#00d4ff'}
          emissiveIntensity={hovered ? 2 : 1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.42, 32]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.5}
          transparent
          opacity={hovered ? 0.8 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label on hover */}
      {hovered && (
        <Html
          center
          distanceFactor={15}
          style={{ pointerEvents: 'none' }}
        >
          <div className="glass rounded-lg px-3 py-1.5 text-xs whitespace-nowrap animate-fadeIn"
               style={{ color: 'var(--text-primary)', minWidth: '120px', textAlign: 'center' }}>
            <span className="mr-1">{hotspot.icon}</span>
            {hotspot.title.split(' / ')[1] || hotspot.title}
          </div>
        </Html>
      )}
    </group>
  )
}

export default function Hotspots() {
  return (
    <group>
      {HOTSPOTS.map((hotspot) => (
        <HotspotMarker key={hotspot.id} hotspot={hotspot} />
      ))}
    </group>
  )
}

export { HOTSPOTS }
