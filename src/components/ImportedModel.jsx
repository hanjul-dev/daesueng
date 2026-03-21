import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const DEFAULT_MODEL_URL = '/models/daeseung-villa-2k.glb'

function tuneMaterial(material) {
  const nextMaterial = material.clone()

  if ('color' in nextMaterial && nextMaterial.color instanceof THREE.Color) {
    const luminance = (nextMaterial.color.r + nextMaterial.color.g + nextMaterial.color.b) / 3
    if (luminance > 0.74) {
      nextMaterial.color.multiplyScalar(0.9)
    }
  }

  if ('envMapIntensity' in nextMaterial) {
    nextMaterial.envMapIntensity = Math.min(nextMaterial.envMapIntensity ?? 0.85, 0.72)
  }

  if ('roughness' in nextMaterial) {
    nextMaterial.roughness = Math.max(nextMaterial.roughness ?? 0.4, 0.2)
  }

  if ('metalness' in nextMaterial) {
    nextMaterial.metalness = Math.min(nextMaterial.metalness ?? 0.16, 0.24)
  }

  nextMaterial.needsUpdate = true
  return nextMaterial
}

function prepareModel(scene, desiredLongestEdge) {
  const clone = scene.clone(true)

  clone.traverse((child) => {
    if (!child.isMesh) return

    child.castShadow = true
    child.receiveShadow = true

    if (Array.isArray(child.material)) {
      child.material = child.material.map((material) => tuneMaterial(material))
    } else if (child.material) {
      child.material = tuneMaterial(child.material)
    }
  })

  const box = new THREE.Box3().setFromObject(clone)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()

  box.getSize(size)
  box.getCenter(center)

  const longestEdge = Math.max(size.x, size.y, size.z) || 1
  const normalizedScale = desiredLongestEdge / longestEdge
  const offset = [-center.x, -box.min.y, -center.z]

  return { clone, normalizedScale, offset }
}

export default function ImportedModel({
  url = DEFAULT_MODEL_URL,
  position = [0, -3.5, 0],
  desiredLongestEdge = 23,
  rotation = [0, 0, 0],
  scale = 1,
  onReady,
}) {
  const { scene } = useGLTF(url)

  const preparedModel = useMemo(
    () => prepareModel(scene, desiredLongestEdge),
    [desiredLongestEdge, scene],
  )

  useEffect(() => {
    onReady?.()

    return () => {
      preparedModel.clone.traverse((child) => {
        if (!child.isMesh) return

        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose())
        } else if (child.material) {
          child.material.dispose()
        }
      })
    }
  }, [onReady, preparedModel])

  return (
    <group position={position} scale={preparedModel.normalizedScale * scale}>
      <primitive object={preparedModel.clone} position={preparedModel.offset} rotation={rotation} />
    </group>
  )
}

useGLTF.preload(DEFAULT_MODEL_URL)
