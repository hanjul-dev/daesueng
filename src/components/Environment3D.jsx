import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 나무 (저폴리 나무)
function Tree({ position, scale = 1, type = 'deciduous' }) {
  const trunkColor = type === 'pine' ? '#4a3728' : '#6b4423'
  const leafColor = type === 'pine'
    ? '#1a472a'
    : type === 'autumn' ? '#c17817' : '#2d6a1e'

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* 줄기 */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.15, 2.4, 6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {type === 'pine' ? (
        /* 소나무형 */
        <>
          <mesh position={[0, 3.2, 0]} castShadow>
            <coneGeometry args={[1.0, 2.0, 6]} />
            <meshStandardMaterial color={leafColor} roughness={0.8} />
          </mesh>
          <mesh position={[0, 4.5, 0]} castShadow>
            <coneGeometry args={[0.7, 1.5, 6]} />
            <meshStandardMaterial color="#1d5c30" roughness={0.8} />
          </mesh>
          <mesh position={[0, 5.5, 0]} castShadow>
            <coneGeometry args={[0.4, 1.2, 6]} />
            <meshStandardMaterial color="#226b38" roughness={0.8} />
          </mesh>
        </>
      ) : (
        /* 활엽수형 */
        <>
          <mesh position={[0, 3.5, 0]} castShadow>
            <sphereGeometry args={[1.3, 8, 6]} />
            <meshStandardMaterial color={leafColor} roughness={0.85} />
          </mesh>
          <mesh position={[0.4, 3.8, 0.3]} castShadow>
            <sphereGeometry args={[0.8, 7, 5]} />
            <meshStandardMaterial color={type === 'autumn' ? '#d4881c' : '#358a27'} roughness={0.85} />
          </mesh>
          <mesh position={[-0.3, 3.3, -0.4]} castShadow>
            <sphereGeometry args={[0.9, 7, 5]} />
            <meshStandardMaterial color={type === 'autumn' ? '#a8681a' : '#267518'} roughness={0.85} />
          </mesh>
        </>
      )}
    </group>
  )
}

// 관목/덤불
function Bush({ position, scale = 1, color = '#2a6e1a' }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.5, 6, 5]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[0.3, 0.25, 0.2]} castShadow>
        <sphereGeometry args={[0.35, 6, 5]} />
        <meshStandardMaterial color="#348922" roughness={0.9} />
      </mesh>
    </group>
  )
}

// 벤치
function Bench({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 좌석 */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.06, 0.4]} />
        <meshStandardMaterial color="#7a5230" roughness={0.7} />
      </mesh>
      {/* 등받이 */}
      <mesh position={[0, 0.7, -0.18]} castShadow>
        <boxGeometry args={[1.5, 0.45, 0.04]} />
        <meshStandardMaterial color="#7a5230" roughness={0.7} />
      </mesh>
      {/* 다리 */}
      {[[-0.6, 0.22, 0], [0.6, 0.22, 0]].map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.06, 0.44, 0.4]} />
          <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

// 가로등
function StreetLight({ position }) {
  return (
    <group position={position}>
      {/* 기둥 */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 4, 8]} />
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* 등 부분 */}
      <mesh position={[0.3, 3.8, 0]} castShadow>
        <boxGeometry args={[0.8, 0.1, 0.3]} />
        <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* 전구 (emissive) */}
      <mesh position={[0.3, 3.73, 0]}>
        <boxGeometry args={[0.6, 0.04, 0.2]} />
        <meshStandardMaterial
          color="#ffe4b5"
          emissive="#ffe4b5"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* 빛 */}
      <pointLight
        position={[0.3, 3.6, 0]}
        intensity={0.5}
        distance={8}
        decay={2}
        color="#ffe4b5"
      />
    </group>
  )
}

// 주변 건물 (배경용 실루엣)
function BackgroundBuilding({ position, width, height, depth, color = '#3a3f4a' }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
      </mesh>
      {/* 창문들 */}
      {[...Array(Math.floor(height / 1.5))].map((_, row) =>
        [...Array(Math.floor(width / 2))].map((_, col) => (
          <mesh
            key={`${row}-${col}`}
            position={[
              -width / 2 + 1.2 + col * 2,
              -height / 2 + 1.5 + row * 1.5,
              depth / 2 + 0.01,
            ]}
          >
            <planeGeometry args={[0.8, 1.0]} />
            <meshStandardMaterial
              color="#4a6080"
              emissive="#2a4060"
              emissiveIntensity={Math.random() > 0.4 ? 0.3 : 0}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))
      )}
    </group>
  )
}

// 도로
function Road({ position, width = 8, length = 80, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 아스팔트 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.95} />
      </mesh>
      {/* 중앙선 */}
      {[...Array(Math.floor(length / 4))].map((_, i) => (
        <mesh
          key={i}
          position={[0, 0.005, -length / 2 + 2 + i * 4]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.15, 2]} />
          <meshStandardMaterial color="#e8e800" roughness={0.5} />
        </mesh>
      ))}
      {/* 차선 (양쪽) */}
      <mesh position={[-width / 2 + 0.5, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, length]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      <mesh position={[width / 2 - 0.5, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, length]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  )
}

// 인도/보도
function Sidewalk({ position, width = 3, length = 30, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#b8b0a0" roughness={0.75} />
      </mesh>
      {/* 보도블록 패턴 (간소화) */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[0, 0.003, -length/2 + 2.5 + i * 5]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[width - 0.05, 0.02]} />
          <meshStandardMaterial color="#a09888" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// 화단
function FlowerBed({ position, size = [3, 0.3, 1.5] }) {
  return (
    <group position={position}>
      {/* 화단 테두리 */}
      <mesh position={[0, size[1] / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#8b7355" roughness={0.85} />
      </mesh>
      {/* 흙 */}
      <mesh position={[0, size[1] + 0.02, 0]} receiveShadow>
        <boxGeometry args={[size[0] - 0.1, 0.05, size[2] - 0.1]} />
        <meshStandardMaterial color="#4a3520" roughness={0.95} />
      </mesh>
      {/* 꽃들 */}
      {[...Array(6)].map((_, i) => {
        const x = (Math.random() - 0.5) * (size[0] - 0.5)
        const z = (Math.random() - 0.5) * (size[2] - 0.5)
        const colors = ['#e74c3c', '#f39c12', '#9b59b6', '#e91e63', '#ff5722', '#ff9800']
        return (
          <mesh key={i} position={[x, size[1] + 0.15, z]}>
            <sphereGeometry args={[0.08, 6, 4]} />
            <meshStandardMaterial color={colors[i]} roughness={0.7} />
          </mesh>
        )
      })}
    </group>
  )
}

// 주차된 차량
function ParkedCar({ position, rotation = [0, 0, 0], color = '#2c3e50' }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 차체 */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.8, 0.6, 4.2]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
      </mesh>
      {/* 윗부분 (유리) */}
      <mesh position={[0, 0.95, -0.2]} castShadow>
        <boxGeometry args={[1.6, 0.5, 2.2]} />
        <meshStandardMaterial color="#1a2530" roughness={0.1} metalness={0.3} transparent opacity={0.7} />
      </mesh>
      {/* 바퀴 */}
      {[[-0.85, 0.25, -1.3], [0.85, 0.25, -1.3], [-0.85, 0.25, 1.3], [0.85, 0.25, 1.3]].map((p, i) => (
        <mesh key={i} position={p} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.15, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// 울타리/펜스
function Fence({ start, end, height = 1.2 }) {
  const dx = end[0] - start[0]
  const dz = end[2] - start[2]
  const length = Math.sqrt(dx * dx + dz * dz)
  const angle = Math.atan2(dx, dz)
  const mid = [(start[0] + end[0]) / 2, start[1] + height / 2, (start[2] + end[2]) / 2]

  const postCount = Math.max(2, Math.floor(length / 2))

  return (
    <group>
      {/* 수평 레일 */}
      <mesh position={mid} rotation={[0, angle, 0]} castShadow>
        <boxGeometry args={[0.04, 0.04, length]} />
        <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[mid[0], mid[1] - 0.4, mid[2]]} rotation={[0, angle, 0]} castShadow>
        <boxGeometry args={[0.04, 0.04, length]} />
        <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* 기둥 */}
      {[...Array(postCount)].map((_, i) => {
        const t = i / (postCount - 1)
        return (
          <mesh
            key={i}
            position={[
              start[0] + dx * t,
              start[1] + height / 2,
              start[2] + dz * t,
            ]}
            castShadow
          >
            <boxGeometry args={[0.06, height, 0.06]} />
            <meshStandardMaterial color="#4a4a4a" metalness={0.7} roughness={0.3} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function Environment() {
  const groundY = -3.5

  return (
    <group>
      {/* === 주변 건물들 === */}
      <BackgroundBuilding position={[-35, groundY + 7.5, -5]} width={10} height={15} depth={8} color="#4a5060" />
      <BackgroundBuilding position={[-35, groundY + 5, 10]} width={8} height={10} depth={12} color="#525868" />
      <BackgroundBuilding position={[35, groundY + 10, -8]} width={12} height={20} depth={10} color="#3d4452" />
      <BackgroundBuilding position={[35, groundY + 6, 8]} width={8} height={12} depth={8} color="#4d5565" />
      <BackgroundBuilding position={[0, groundY + 4, -35]} width={18} height={8} depth={6} color="#555d6a" />
      <BackgroundBuilding position={[-15, groundY + 6, -32]} width={10} height={12} depth={8} color="#4a5260" />
      <BackgroundBuilding position={[18, groundY + 3.5, -32]} width={8} height={7} depth={6} color="#5a6270" />

      {/* === 주차된 차량 === */}
      <ParkedCar position={[-25, groundY, -20]} rotation={[0, Math.PI / 2, 0]} color="#c0392b" />
      <ParkedCar position={[-25, groundY, -14]} rotation={[0, Math.PI / 2, 0]} color="#2c3e50" />
      <ParkedCar position={[25, groundY, -20]} rotation={[0, -Math.PI / 2, 0]} color="#ecf0f1" />
      <ParkedCar position={[25, groundY, -15]} rotation={[0, -Math.PI / 2, 0]} color="#2980b9" />

      {/* === 울타리 === */}
      <Fence start={[-16, groundY, -13]} end={[-16, groundY, 11]} />
      <Fence start={[16, groundY, -13]} end={[16, groundY, 11]} />

      {/* === 고급 건축 뷰어용 쇼케이스 바닥 === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, groundY + 0.001, 0]} receiveShadow>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial color="#1f2226" roughness={0.8} metalness={0.1} />
      </mesh>
    </group>
  )
}
