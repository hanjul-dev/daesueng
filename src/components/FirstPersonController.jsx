import { useCallback, useEffect, useMemo, useRef } from 'react'
import { PointerLockControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { getFloorViewConfig } from '../content/floorSections'
import useAppStore from '../store/useAppStore'

const WALK_SPEED = 5.2
const VERTICAL_SPEED = 4.4
const POSITION_EPSILON = 0.0005
const YAW_EPSILON = 0.002
const WORLD_LOOK_TARGET = new THREE.Vector3()

function normalizeYawDelta(a, b) {
  return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)))
}

export default function FirstPersonController() {
  const navMode = useAppStore((state) => state.navMode)
  const isExperienceFullscreen = useAppStore((state) => state.isExperienceFullscreen)
  const floorView = useAppStore((state) => state.floorView)
  const modelTransform = useAppStore((state) => state.modelTransform)
  const setExplorer = useAppStore((state) => state.setExplorer)
  const { camera, gl } = useThree()
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)
  const previousFloorViewRef = useRef(null)
  const localPositionRef = useRef(new THREE.Vector3())
  const syncedPositionRef = useRef(new THREE.Vector3())
  const forwardVectorRef = useRef(new THREE.Vector3())
  const rightVectorRef = useRef(new THREE.Vector3())
  const movementVectorRef = useRef(new THREE.Vector3())
  const lookEulerRef = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const keyStateRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    elevateUp: false,
    elevateDown: false,
  })
  const yawRef = useRef(Math.PI)
  const syncedYawRef = useRef(Math.PI)
  const isTouchDevice = useMemo(
    () =>
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || (navigator.maxTouchPoints ?? 0) > 0),
    [],
  )
  const floorConfig = getFloorViewConfig(floorView)
  const isWalkMode = navMode === 'walk' && (!isTouchDevice || isExperienceFullscreen)
  const canMoveExplorer = isWalkMode || floorView !== 'overview'

  const syncExplorer = useCallback(
    (force = false) => {
      const localPosition = localPositionRef.current
      if (
        !force &&
        localPosition.distanceToSquared(syncedPositionRef.current) < POSITION_EPSILON &&
        normalizeYawDelta(yawRef.current, syncedYawRef.current) < YAW_EPSILON
      ) {
        return
      }

      const nextLocalPosition = [localPosition.x, localPosition.y, localPosition.z]

      setExplorer({
        localPosition: nextLocalPosition,
        yaw: yawRef.current,
      })

      syncedPositionRef.current.copy(localPosition)
      syncedYawRef.current = yawRef.current
    },
    [setExplorer],
  )

  const moveCameraToExplorer = useCallback(
    (lookForward = false) => {
      const activeCamera = cameraRef.current
      if (!activeCamera) {
        return
      }

      const activeScale = modelTransform.scale
      const { x, y, z } = localPositionRef.current
      const worldX = modelTransform.positionX + x * activeScale
      const worldY = modelTransform.positionY + y * activeScale
      const worldZ = modelTransform.positionZ + z * activeScale

      activeCamera.position.set(worldX, worldY, worldZ)

      if (!lookForward) {
        return
      }

      WORLD_LOOK_TARGET.set(
        worldX + Math.sin(yawRef.current) * 5,
        worldY,
        worldZ + Math.cos(yawRef.current) * 5,
      )
      activeCamera.lookAt(WORLD_LOOK_TARGET)
    },
    [modelTransform.positionX, modelTransform.positionY, modelTransform.positionZ, modelTransform.scale],
  )

  useEffect(() => {
    cameraRef.current = camera
  }, [camera])

  useEffect(() => {
    if (previousFloorViewRef.current === floorView) {
      return
    }

    const [startX, startY, startZ] = floorConfig.walk.start
    const [lookX, , lookZ] = floorConfig.walk.lookTarget
    const nextYaw = Math.atan2(lookX - startX, lookZ - startZ)

    localPositionRef.current.set(startX, startY, startZ)
    yawRef.current = nextYaw
    lookEulerRef.current.set(0, nextYaw, 0)
    previousFloorViewRef.current = floorView
    syncExplorer(true)
  }, [floorConfig, floorView, syncExplorer])

  useEffect(() => {
    if (!isWalkMode) {
      controlsRef.current?.unlock?.()
      return
    }

    moveCameraToExplorer(true)
  }, [isWalkMode, modelTransform, moveCameraToExplorer])

  useEffect(() => {
    if (!canMoveExplorer) {
      return undefined
    }

    function handleKeyChange(event, pressed) {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          keyStateRef.current.forward = pressed
          event.preventDefault()
          break
        case 'KeyS':
        case 'ArrowDown':
          keyStateRef.current.backward = pressed
          event.preventDefault()
          break
        case 'KeyA':
        case 'ArrowLeft':
          keyStateRef.current.left = pressed
          event.preventDefault()
          break
        case 'KeyD':
        case 'ArrowRight':
          keyStateRef.current.right = pressed
          event.preventDefault()
          break
        case 'KeyQ':
          keyStateRef.current.elevateUp = pressed
          event.preventDefault()
          break
        case 'KeyE':
          keyStateRef.current.elevateDown = pressed
          event.preventDefault()
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

    function resetMovementState() {
      keyStateRef.current = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        elevateUp: false,
        elevateDown: false,
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', resetMovementState)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', resetMovementState)
    }
  }, [canMoveExplorer])

  useFrame((_, delta) => {
    if (!canMoveExplorer) {
      return
    }

    const activeCamera = cameraRef.current
    if (!activeCamera) {
      return
    }

    const activeScale = Math.max(modelTransform.scale, 0.0001)
    const clampedDelta = Math.min(delta, 0.05)
    const joystickInput = window.__joystickInput ?? { x: 0, y: 0 }
    const lookInput = window.__lookInput ?? { x: 0, y: 0 }
    const elevationInput = window.__elevationInput ?? 0
    const movementVector = movementVectorRef.current
    const forwardVector = forwardVectorRef.current
    const rightVector = rightVectorRef.current
    const lookEuler = lookEulerRef.current
    const localPosition = localPositionRef.current
    const moveStep = (WALK_SPEED * clampedDelta) / activeScale
    const verticalStep = (VERTICAL_SPEED * clampedDelta) / activeScale
    const forwardInput =
      (keyStateRef.current.forward ? 1 : 0) -
      (keyStateRef.current.backward ? 1 : 0) +
      joystickInput.y
    const lateralInput =
      (keyStateRef.current.right ? 1 : 0) -
      (keyStateRef.current.left ? 1 : 0) +
      joystickInput.x
    const verticalInput =
      (keyStateRef.current.elevateUp ? 1 : 0) -
      (keyStateRef.current.elevateDown ? 1 : 0) +
      elevationInput

    if (isWalkMode && isTouchDevice) {
      if (Math.abs(lookInput.x) > 0.0001 || Math.abs(lookInput.y) > 0.0001) {
        lookEuler.setFromQuaternion(activeCamera.quaternion)
        lookEuler.y -= lookInput.x
        lookEuler.x -= lookInput.y
        lookEuler.x = THREE.MathUtils.clamp(lookEuler.x, -Math.PI / 2.3, Math.PI / 2.3)
        activeCamera.quaternion.setFromEuler(lookEuler)
        window.__lookInput = { x: 0, y: 0 }
      }
    }

    activeCamera.getWorldDirection(forwardVector)
    forwardVector.y = 0

    if (forwardVector.lengthSq() < 0.0001) {
      forwardVector.set(Math.sin(yawRef.current), 0, Math.cos(yawRef.current))
    } else {
      forwardVector.normalize()
    }

    rightVector.crossVectors(forwardVector, activeCamera.up).normalize()

    movementVector.set(0, 0, 0)
    movementVector.addScaledVector(forwardVector, forwardInput)
    movementVector.addScaledVector(rightVector, lateralInput)

    if (movementVector.lengthSq() > 0.001) {
      movementVector.normalize().multiplyScalar(moveStep)
      localPosition.add(movementVector)
    }

    if (Math.abs(verticalInput) > 0.001) {
      localPosition.y += verticalInput * verticalStep
    }

    localPosition.x = THREE.MathUtils.clamp(
      localPosition.x,
      floorConfig.walk.bounds.minX,
      floorConfig.walk.bounds.maxX,
    )
    localPosition.y = THREE.MathUtils.clamp(
      localPosition.y,
      floorConfig.walk.bounds.minY ?? floorConfig.walk.eyeHeight,
      floorConfig.walk.bounds.maxY ?? floorConfig.walk.eyeHeight,
    )
    localPosition.z = THREE.MathUtils.clamp(
      localPosition.z,
      floorConfig.walk.bounds.minZ,
      floorConfig.walk.bounds.maxZ,
    )

    activeCamera.getWorldDirection(forwardVector)
    forwardVector.y = 0
    if (forwardVector.lengthSq() > 0.0001) {
      forwardVector.normalize()
      yawRef.current = Math.atan2(forwardVector.x, forwardVector.z)
    }

    if (isWalkMode) {
      moveCameraToExplorer(false)
    }

    syncExplorer()
  })

  if (!isWalkMode || isTouchDevice) {
    return null
  }

  return (
    <PointerLockControls
      ref={controlsRef}
      selector="#tour-stage"
      args={[camera, gl.domElement]}
    />
  )
}
