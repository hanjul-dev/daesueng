import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import useAppStore from '../store/useAppStore'

export function CameraUpdater() {
  const { camera } = useThree()
  const navMode = useAppStore((state) => state.navMode)
  const setCameraPosition = useAppStore((state) => state.setCameraPosition)
  const setCameraRotation = useAppStore((state) => state.setCameraRotation)
  const directionRef = useRef(new THREE.Vector3())

  useFrame(() => {
    if (navMode !== 'orbit') {
      return
    }

    const direction = directionRef.current
    camera.getWorldDirection(direction)

    setCameraPosition([camera.position.x, camera.position.y, camera.position.z])
    setCameraRotation(Math.atan2(direction.x, direction.z))
  })

  return null
}
