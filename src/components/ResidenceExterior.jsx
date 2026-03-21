import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

function createStoneTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const context = canvas.getContext('2d')
  context.fillStyle = '#e9e2d7'
  context.fillRect(0, 0, size, size)

  for (let i = 0; i < 5400; i += 1) {
    const x = Math.random() * size
    const y = Math.random() * size
    const grain = Math.random() * 2.6 + 0.4

    context.globalAlpha = Math.random() * 0.08 + 0.03
    context.fillStyle = ['#d9d1c4', '#efe9df', '#c9c0b5', '#f6f2eb'][i % 4]
    context.fillRect(x, y, grain, grain)
  }

  context.globalAlpha = 0.32
  context.strokeStyle = '#cdc3b5'
  context.lineWidth = 1.5

  for (let y = 68; y < size; y += 86) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(size, y)
    context.stroke()
  }

  for (let x = 84; x < size; x += 96) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, size)
    context.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3.2, 2.4)
  texture.anisotropy = 8
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function GlassRailing({ position, rotation = [0, 0, 0], width, height = 1.02, glass, rail }) {
  const posts = Math.max(2, Math.floor(width / 1.55))

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, 0.028]} />
        <primitive attach="material" object={glass} />
      </mesh>
      <mesh position={[0, height + 0.02, 0]}>
        <boxGeometry args={[width + 0.06, 0.04, 0.045]} />
        <primitive attach="material" object={rail} />
      </mesh>
      {Array.from({ length: posts }).map((_, index) => {
        const ratio = posts === 1 ? 0 : index / (posts - 1)
        return (
          <mesh
            key={`post-${index}`}
            position={[-width / 2 + ratio * width, 0.22, 0]}
            castShadow
          >
            <boxGeometry args={[0.05, 0.44, 0.05]} />
            <primitive attach="material" object={rail} />
          </mesh>
        )
      })}
    </group>
  )
}

function CurtainWall({ position, width, height, glass, frame, mullions = 4 }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[width, height, 0.035]} />
        <primitive attach="material" object={glass} />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[width + 0.08, 0.06, 0.08]} />
        <primitive attach="material" object={frame} />
      </mesh>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width + 0.08, 0.06, 0.08]} />
        <primitive attach="material" object={frame} />
      </mesh>
      <mesh position={[-width / 2, height / 2, 0]} castShadow>
        <boxGeometry args={[0.08, height + 0.06, 0.08]} />
        <primitive attach="material" object={frame} />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]} castShadow>
        <boxGeometry args={[0.08, height + 0.06, 0.08]} />
        <primitive attach="material" object={frame} />
      </mesh>
      {Array.from({ length: Math.max(0, mullions - 1) }).map((_, index) => {
        const ratio = (index + 1) / mullions
        return (
          <mesh
            key={`mullion-${index}`}
            position={[-width / 2 + ratio * width, height / 2, 0]}
            castShadow
          >
            <boxGeometry args={[0.055, height + 0.02, 0.07]} />
            <primitive attach="material" object={frame} />
          </mesh>
        )
      })}
      <mesh position={[0, height * 0.56, 0]} castShadow>
        <boxGeometry args={[width + 0.02, 0.05, 0.07]} />
        <primitive attach="material" object={frame} />
      </mesh>
    </group>
  )
}

function PolygonGlass({ points, position = [0, 0, 0], rotation = [0, 0, 0], glass, frame }) {
  const shape = useMemo(() => {
    const nextShape = new THREE.Shape()
    points.forEach(([x, y], index) => {
      if (index === 0) {
        nextShape.moveTo(x, y)
      } else {
        nextShape.lineTo(x, y)
      }
    })
    nextShape.closePath()
    return nextShape
  }, [points])

  const geometry = useMemo(() => new THREE.ShapeGeometry(shape), [shape])
  const outline = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry])

  useEffect(() => {
    return () => {
      geometry.dispose()
      outline.dispose()
    }
  }, [geometry, outline])

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry}>
        <primitive attach="material" object={glass} />
      </mesh>
      <lineSegments geometry={outline}>
        <lineBasicMaterial color={frame.color} />
      </lineSegments>
    </group>
  )
}

export default function ResidenceExterior() {
  const stoneTexture = useMemo(() => createStoneTexture(), [])

  const materials = useMemo(
    () => ({
      stone: new THREE.MeshStandardMaterial({
        map: stoneTexture,
        color: '#f2ece2',
        roughness: 0.76,
        metalness: 0.02,
      }),
      trim: new THREE.MeshStandardMaterial({
        color: '#2b2d31',
        roughness: 0.42,
        metalness: 0.3,
      }),
      wood: new THREE.MeshStandardMaterial({
        color: '#4b3828',
        roughness: 0.58,
        metalness: 0.04,
      }),
      concrete: new THREE.MeshStandardMaterial({
        color: '#b8b0a4',
        roughness: 0.88,
        metalness: 0.03,
      }),
      retaining: new THREE.MeshStandardMaterial({
        color: '#c8c0b4',
        roughness: 0.92,
        metalness: 0.02,
      }),
      frame: new THREE.MeshStandardMaterial({
        color: '#191c20',
        roughness: 0.24,
        metalness: 0.76,
      }),
      curtainGlass: new THREE.MeshPhysicalMaterial({
        color: '#567a92',
        transparent: true,
        opacity: 0.46,
        roughness: 0.04,
        metalness: 0.08,
        transmission: 0.58,
        thickness: 0.55,
        ior: 1.5,
        envMapIntensity: 1.5,
      }),
      balconyGlass: new THREE.MeshPhysicalMaterial({
        color: '#d8edf6',
        transparent: true,
        opacity: 0.16,
        roughness: 0.01,
        metalness: 0.03,
        transmission: 0.96,
        thickness: 0.45,
        ior: 1.5,
        envMapIntensity: 1.8,
      }),
      garage: new THREE.MeshStandardMaterial({
        color: '#686a6c',
        roughness: 0.38,
        metalness: 0.52,
      }),
      planter: new THREE.MeshStandardMaterial({
        color: '#4b3825',
        roughness: 0.94,
        metalness: 0.01,
      }),
    }),
    [stoneTexture],
  )

  useEffect(() => {
    return () => {
      stoneTexture.dispose()
      Object.values(materials).forEach((material) => material.dispose())
    }
  }, [materials, stoneTexture])

  return (
    <group position={[0, -3.5, 0]}>
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[17.2, 0.04, 14.4]} />
        <primitive attach="material" object={materials.concrete} />
      </mesh>

      <mesh position={[0, 1.6, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[17.4, 3.2, 13.8]} />
        <primitive attach="material" object={materials.stone} />
      </mesh>

      <mesh position={[4.15, 5.95, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[8.4, 5.4, 13.2]} />
        <primitive attach="material" object={materials.stone} />
      </mesh>

      <mesh position={[-0.35, 7.1, -0.25]} castShadow receiveShadow>
        <boxGeometry args={[3.1, 8.2, 10.9]} />
        <primitive attach="material" object={materials.stone} />
      </mesh>

      <mesh position={[-4.9, 8.2, -0.8]} castShadow receiveShadow>
        <boxGeometry args={[7.6, 3.2, 10.6]} />
        <primitive attach="material" object={materials.stone} />
      </mesh>

      <mesh position={[-4.9, 6.46, -1.05]} castShadow receiveShadow>
        <boxGeometry args={[7.95, 0.34, 11.05]} />
        <primitive attach="material" object={materials.stone} />
      </mesh>

      <mesh position={[0, 3.38, -7.7]} castShadow receiveShadow>
        <boxGeometry args={[14.7, 0.26, 2.85]} />
        <primitive attach="material" object={materials.stone} />
      </mesh>

      <mesh position={[-4.9, 6.18, -1.05]}>
        <boxGeometry args={[7.85, 0.08, 10.9]} />
        <primitive attach="material" object={materials.wood} />
      </mesh>

      <mesh position={[0, 3.24, -7.7]}>
        <boxGeometry args={[14.45, 0.08, 2.65]} />
        <primitive attach="material" object={materials.wood} />
      </mesh>

      <mesh position={[-4.85, 9.92, -0.85]} rotation={[0, 0, 0.11]} castShadow receiveShadow>
        <boxGeometry args={[8.05, 0.26, 10.95]} />
        <primitive attach="material" object={materials.stone} />
      </mesh>

      <mesh position={[4.15, 9.06, 0]} rotation={[0, 0, -0.06]} castShadow receiveShadow>
        <boxGeometry args={[8.65, 0.26, 13.45]} />
        <primitive attach="material" object={materials.stone} />
      </mesh>

      <mesh position={[0.1, 10.28, -0.2]} castShadow>
        <boxGeometry args={[17.8, 0.18, 14.1]} />
        <primitive attach="material" object={materials.trim} />
      </mesh>

      <mesh position={[-6.35, 1.4, -6.78]}>
        <boxGeometry args={[2.75, 2.55, 0.08]} />
        <primitive attach="material" object={materials.garage} />
      </mesh>

      <mesh position={[5.15, 1.4, -6.82]}>
        <boxGeometry args={[5.8, 2.5, 0.06]} />
        <primitive attach="material" object={materials.curtainGlass} />
      </mesh>

      <mesh position={[0.25, 1.55, -6.78]}>
        <boxGeometry args={[1.3, 2.85, 0.06]} />
        <primitive attach="material" object={materials.frame} />
      </mesh>

      <mesh position={[0.65, 1.55, -6.73]}>
        <boxGeometry args={[0.82, 2.2, 0.06]} />
        <primitive attach="material" object={materials.curtainGlass} />
      </mesh>

      <CurtainWall
        position={[3.9, 4.9, -6.58]}
        width={7.15}
        height={4.9}
        glass={materials.curtainGlass}
        frame={materials.frame}
        mullions={4}
      />

      <CurtainWall
        position={[-5.2, 4.65, -8.88]}
        width={4.25}
        height={2.1}
        glass={materials.curtainGlass}
        frame={materials.frame}
        mullions={2}
      />

      <PolygonGlass
        position={[-8.05, 6.8, -1.15]}
        rotation={[0, Math.PI / 2, 0]}
        glass={materials.curtainGlass}
        frame={materials.frame}
        points={[
          [-3.55, -1.2],
          [3.1, -1.2],
          [3.1, 1.05],
          [-0.75, 2.45],
          [-3.55, 2.1],
        ]}
      />

      <PolygonGlass
        position={[3.8, 6.45, -6.55]}
        rotation={[0, Math.PI, 0]}
        glass={materials.curtainGlass}
        frame={materials.frame}
        points={[
          [-3.45, -2.0],
          [3.45, -2.0],
          [3.45, 1.2],
          [-0.55, 2.25],
          [-3.45, 1.8],
        ]}
      />

      <GlassRailing
        position={[0.1, 3.42, -9.08]}
        width={14.1}
        glass={materials.balconyGlass}
        rail={materials.frame}
      />

      <GlassRailing
        position={[-7.0, 3.42, -7.7]}
        rotation={[0, Math.PI / 2, 0]}
        width={2.8}
        glass={materials.balconyGlass}
        rail={materials.frame}
      />

      <mesh position={[0.3, 0.92, -10.25]} castShadow receiveShadow>
        <boxGeometry args={[8.2, 1.85, 1.15]} />
        <primitive attach="material" object={materials.retaining} />
      </mesh>

      <mesh position={[-7.7, 0.82, -7.65]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.64, 5.5]} />
        <primitive attach="material" object={materials.retaining} />
      </mesh>

      <mesh position={[-2.1, 1.05, -8.95]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 1.1, 1.5]} />
        <primitive attach="material" object={materials.planter} />
      </mesh>

      <mesh position={[-2.1, 1.62, -8.95]} receiveShadow>
        <boxGeometry args={[4.45, 0.08, 1.22]} />
        <meshStandardMaterial color="#6e7e51" roughness={0.96} />
      </mesh>

      <mesh position={[7.9, 4.9, -0.2]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[13.15, 5.2, 0.14]} />
        <primitive attach="material" object={materials.stone} />
      </mesh>

      <mesh position={[-8.55, 5.8, -0.4]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[10.8, 5.3, 0.14]} />
        <primitive attach="material" object={materials.stone} />
      </mesh>
    </group>
  )
}
