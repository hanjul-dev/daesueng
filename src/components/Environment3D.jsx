import { useMemo } from 'react'
import useAppStore from '../store/useAppStore'

function PineTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.2, 2.8, 8]} />
        <meshStandardMaterial color="#5a3b27" roughness={0.88} />
      </mesh>
      <mesh position={[0, 3.35, 0]} castShadow>
        <coneGeometry args={[1.1, 2.6, 8]} />
        <meshStandardMaterial color="#21452c" roughness={0.84} />
      </mesh>
      <mesh position={[0, 4.8, 0]} castShadow>
        <coneGeometry args={[0.8, 2, 8]} />
        <meshStandardMaterial color="#2c5b38" roughness={0.84} />
      </mesh>
    </group>
  )
}

function Shrub({ position, scale = 1, color = '#6a7b4f' }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh castShadow>
        <sphereGeometry args={[0.48, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.94} />
      </mesh>
      <mesh position={[0.35, 0.08, 0.18]} castShadow>
        <sphereGeometry args={[0.34, 10, 8]} />
        <meshStandardMaterial color="#7f8a59" roughness={0.94} />
      </mesh>
    </group>
  )
}

function NeighborHouse({ position, scale = [1, 1, 1] }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[6, 10, 8]} />
        <meshStandardMaterial color="#8b9097" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.7, 4.05]}>
        <boxGeometry args={[3.2, 2.2, 0.04]} />
        <meshStandardMaterial color="#5f7d95" roughness={0.1} metalness={0.12} />
      </mesh>
      <mesh position={[0, 1.6, 4.05]}>
        <boxGeometry args={[2.8, 2.5, 0.04]} />
        <meshStandardMaterial color="#546f82" roughness={0.12} metalness={0.1} />
      </mesh>
    </group>
  )
}

export default function Environment3D() {
  const modelMode = useAppStore((state) => state.modelMode)
  const modelTransform = useAppStore((state) => state.modelTransform)
  const shrubLayout = useMemo(
    () => [
      { position: [-3.8, -2.1, -8.85], scale: 1.15, color: '#77824f' },
      { position: [-2.1, -2.05, -8.55], scale: 1.2, color: '#627648' },
      { position: [-0.25, -2.05, -8.9], scale: 0.95, color: '#8b7a52' },
      { position: [1.75, -2.08, -8.8], scale: 0.82, color: '#7f6655' },
    ],
    [],
  )

  return (
    <group position={[0, modelMode === 'glb' ? modelTransform.positionY + 3.5 : 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]} receiveShadow>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial color="#bcb7ae" roughness={0.96} />
      </mesh>

      {modelMode !== 'glb' && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.46, -15.5]} receiveShadow>
            <planeGeometry args={[44, 10]} />
            <meshStandardMaterial color="#6c6a68" roughness={0.94} />
          </mesh>

          <mesh position={[-10.8, -2.6, -11.2]} rotation={[0, 0, -0.18]} castShadow receiveShadow>
            <boxGeometry args={[6.4, 1.5, 0.8]} />
            <meshStandardMaterial color="#bdb5aa" roughness={0.92} />
          </mesh>

          <mesh position={[-5.7, -2.55, -10.8]} rotation={[0, 0, -0.08]} castShadow receiveShadow>
            <boxGeometry args={[5.4, 1.5, 1]} />
            <meshStandardMaterial color="#bdb5aa" roughness={0.92} />
          </mesh>

          <mesh position={[14.8, 0.75, -0.6]} castShadow receiveShadow>
            <boxGeometry args={[4.4, 1.5, 20]} />
            <meshStandardMaterial color="#a5a098" roughness={0.9} />
          </mesh>

          <NeighborHouse position={[18, 1.5, -1.5]} scale={[1.15, 1.05, 1]} />
          <NeighborHouse position={[-22, 0.6, -8]} scale={[1.4, 0.84, 1.2]} />
          <NeighborHouse position={[0, -0.6, 28]} scale={[1.8, 0.65, 1.8]} />

          <PineTree position={[-20, -3.5, -10]} scale={2.1} />
          <PineTree position={[-24, -3.5, -4]} scale={1.8} />
          <PineTree position={[-16, -3.5, 8]} scale={1.45} />

          {shrubLayout.map((shrub) => (
            <Shrub
              key={shrub.position.join('-')}
              position={shrub.position}
              scale={shrub.scale}
              color={shrub.color}
            />
          ))}
        </>
      )}
    </group>
  )
}
