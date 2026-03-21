import { useEffect, useMemo, useRef } from 'react'
import { PointerLockControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import useAppStore from '../store/useAppStore'

const WALK_HEIGHT = 1.72
const WALK_SPEED = 5.2
const WALK_BOUNDS = {
  minX: -22,
  maxX: 22,
  minZ: -24,
  maxZ: 26,
}
const WALK_START = new THREE.Vector3(0, WALK_HEIGHT, 18)
const WALK_LOOK_TARGET = new THREE.Vector3(0, 4.2, 0)

export default function FirstPersonController() {
  const navMode = useAppStore((state) => state.navMode)
  const isExperienceFullscreen = useAppStore((state) => state.isExperienceFullscreen)
  const { camera, gl } = useThree()
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)
  const keyStateRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })
  const movementVectorRef = useRef(new THREE.Vector3())
  const forwardVectorRef = useRef(new THREE.Vector3())
  const rightVectorRef = useRef(new THREE.Vector3())
  const lookEulerRef = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const isTouchDevice = useMemo(
    () =>
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || (navigator.maxTouchPoints ?? 0) > 0),
    [],
  )
  const isWalkMode = navMode === 'walk' && isExperienceFullscreen

  useEffect(() => {
    cameraRef.current = camera
  }, [camera])

  useEffect(() => {
    if (!isWalkMode) {
      controlsRef.current?.unlock?.()
      return
    }

    const activeCamera = cameraRef.current
    if (!activeCamera) return

    activeCamera.position.copy(WALK_START)
    activeCamera.lookAt(WALK_LOOK_TARGET)
  }, [isWalkMode])

  useEffect(() => {
    if (!isWalkMode) {
      return undefined
    }

    function handleKeyChange(event, pressed) {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          keyStateRef.current.forward = pressed
          break
        case 'KeyS':
        case 'ArrowDown':
          keyStateRef.current.backward = pressed
          break
        case 'KeyA':
        case 'ArrowLeft':
          keyStateRef.current.left = pressed
          break
        case 'KeyD':
        case 'ArrowRight':
          keyStateRef.current.right = pressed
          break
        default:
          break
      }
    }

    function handleKeyDown(event) {
      handleKeyChange(event, true)
    }

    function handleKeyUp(event) {
      handleKeyChange(event, false)
    }

    function handleEnterWalkMode() {
      if (!isTouchDevice) {
        controlsRef.current?.lock?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('experience-enter-walk', handleEnterWalkMode)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('experience-enter-walk', handleEnterWalkMode)
    }
  }, [isTouchDevice, isWalkMode])

  useFrame((_, delta) => {
    if (!isWalkMode) {
      return
    }

    const activeCamera = cameraRef.current
    if (!activeCamera) {
      return
    }

    const clampedDelta = Math.min(delta, 0.05)
    const joystickInput = window.__joystickInput ?? { x: 0, y: 0 }
    const lookInput = window.__lookInput ?? { x: 0, y: 0 }
    const movementVector = movementVectorRef.current
    const forwardVector = forwardVectorRef.current
    const rightVector = rightVectorRef.current
    const lookEuler = lookEulerRef.current
    const forwardInput =
      (keyStateRef.current.forward ? 1 : 0) -
      (keyStateRef.current.backward ? 1 : 0) +
      joystickInput.y
    const lateralInput =
      (keyStateRef.current.right ? 1 : 0) -
      (keyStateRef.current.left ? 1 : 0) +
      joystickInput.x

    activeCamera.getWorldDirection(forwardVector)
    forwardVector.y = 0
    forwardVector.normalize()

    rightVector.crossVectors(forwardVector, activeCamera.up).normalize()

    movementVector.set(0, 0, 0)
    movementVector.addScaledVector(forwardVector, forwardInput)
    movementVector.addScaledVector(rightVector, lateralInput)

    if (movementVector.lengthSq() > 0.001) {
      movementVector.normalize().multiplyScalar(WALK_SPEED * clampedDelta)
      activeCamera.position.add(movementVector)
    }

    if (isTouchDevice && (Math.abs(lookInput.x) > 0.0001 || Math.abs(lookInput.y) > 0.0001)) {
      lookEuler.setFromQuaternion(activeCamera.quaternion)
      lookEuler.y -= lookInput.x
      lookEuler.x -= lookInput.y
      lookEuler.x = THREE.MathUtils.clamp(lookEuler.x, -Math.PI / 2.3, Math.PI / 2.3)
      activeCamera.quaternion.setFromEuler(lookEuler)
      window.__lookInput = { x: 0, y: 0 }
    }

    activeCamera.position.set(
      THREE.MathUtils.clamp(activeCamera.position.x, WALK_BOUNDS.minX, WALK_BOUNDS.maxX),
      WALK_HEIGHT,
      THREE.MathUtils.clamp(activeCamera.position.z, WALK_BOUNDS.minZ, WALK_BOUNDS.maxZ),
    )
  })

  if (!isWalkMode || isTouchDevice) {
    return null
  }

  return <PointerLockControls ref={controlsRef} selector="#tour-stage" args={[camera, gl.domElement]} />
}
