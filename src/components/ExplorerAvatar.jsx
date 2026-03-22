import useAppStore from '../store/useAppStore'

const HUMAN_HEIGHT = 1.72

export default function ExplorerAvatar() {
  const navMode = useAppStore((state) => state.navMode)
  const floorView = useAppStore((state) => state.floorView)
  const explorer = useAppStore((state) => state.explorer)
  const modelTransform = useAppStore((state) => state.modelTransform)

  if (navMode !== 'orbit' || floorView === 'overview') {
    return null
  }

  const activeScale = modelTransform.scale
  const [localX, localY, localZ] = explorer.localPosition
  const footX = modelTransform.positionX + localX * activeScale
  const footY = modelTransform.positionY + (localY - HUMAN_HEIGHT) * activeScale
  const footZ = modelTransform.positionZ + localZ * activeScale
  return (
    <group position={[footX, footY, footZ]} rotation={[0, explorer.yaw, 0]} scale={activeScale}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[0.26, 0.38, 40]} />
        <meshStandardMaterial color="#efe9d8" emissive="#d6c198" emissiveIntensity={0.38} />
      </mesh>

      <mesh position={[0, 0.93, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.82, 6, 12]} />
        <meshStandardMaterial color="#f0ece2" roughness={0.72} />
      </mesh>

      <mesh position={[0, 1.56, 0]} castShadow>
        <sphereGeometry args={[0.18, 20, 16]} />
        <meshStandardMaterial color="#d8bfab" roughness={0.8} />
      </mesh>

      <mesh position={[-0.11, 0.36, 0.01]} rotation={[0, 0, 0.06]} castShadow>
        <capsuleGeometry args={[0.05, 0.5, 4, 10]} />
        <meshStandardMaterial color="#2b2d31" roughness={0.92} />
      </mesh>

      <mesh position={[0.11, 0.36, 0.01]} rotation={[0, 0, -0.06]} castShadow>
        <capsuleGeometry args={[0.05, 0.5, 4, 10]} />
        <meshStandardMaterial color="#2b2d31" roughness={0.92} />
      </mesh>

      <mesh position={[0, 1.14, -0.1]} castShadow>
        <boxGeometry args={[0.34, 0.42, 0.16]} />
        <meshStandardMaterial color="#50483f" roughness={0.86} />
      </mesh>
    </group>
  )
}
