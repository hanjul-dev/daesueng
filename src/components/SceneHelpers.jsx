import { useRef, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import useAppStore from '../store/useAppStore'

export default function FPSTracker() {
  const setFps = useAppStore((s) => s.setFps)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())

  useFrame(() => {
    frameCount.current++
    const now = performance.now()
    const elapsed = now - lastTime.current

    if (elapsed >= 1000) {
      setFps(Math.round((frameCount.current * 1000) / elapsed))
      frameCount.current = 0
      lastTime.current = now
    }
  })

  return null
}

export function CameraUpdater() {
  const { camera } = useThree()
  const setCameraPosition = useAppStore((s) => s.setCameraPosition)
  const setCameraRotation = useAppStore((s) => s.setCameraRotation)
  const navMode = useAppStore((s) => s.navMode)

  useFrame(() => {
    if (navMode === 'orbit') {
      setCameraPosition([camera.position.x, camera.position.y, camera.position.z])
      const dir = new THREE.Vector3()
      camera.getWorldDirection(dir)
      setCameraRotation(Math.atan2(dir.x, dir.z))
    }
  })

  return null
}

// Raycaster for hover highlighting
export function HoverHighlighter() {
  const { camera, scene, gl } = useThree()
  const setHoveredObject = useAppStore((s) => s.setHoveredObject)
  const navMode = useAppStore((s) => s.navMode)
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())
  const prevHighlighted = useRef(null)

  useFrame(() => {
    if (navMode !== 'orbit') return

    raycaster.current.setFromCamera(mouse.current, camera)
    const intersects = raycaster.current.intersectObjects(scene.children, true)

    // Reset previous
    if (prevHighlighted.current && prevHighlighted.current.material) {
      if (prevHighlighted.current._originalEmissive) {
        prevHighlighted.current.material.emissive?.copy(prevHighlighted.current._originalEmissive)
        prevHighlighted.current.material.emissiveIntensity = prevHighlighted.current._originalEmissiveIntensity || 0
      }
      prevHighlighted.current = null
    }

    if (intersects.length > 0) {
      const hit = intersects[0].object
      if (hit.material && hit.material.emissive) {
        if (!hit._originalEmissive) {
          hit._originalEmissive = hit.material.emissive.clone()
          hit._originalEmissiveIntensity = hit.material.emissiveIntensity
        }
        hit.material.emissive.set('#00d4ff')
        hit.material.emissiveIntensity = 0.15
        prevHighlighted.current = hit
        setHoveredObject(hit.name || 'Object')
      }
    } else {
      setHoveredObject(null)
    }
  })

  // Track mouse position
  const onMouseMove = useCallback((e) => {
    const rect = gl.domElement.getBoundingClientRect()
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }, [gl])

  // Attach listener
  useRef(() => {
    gl.domElement.addEventListener('mousemove', onMouseMove)
    return () => gl.domElement.removeEventListener('mousemove', onMouseMove)
  })

  return null
}
