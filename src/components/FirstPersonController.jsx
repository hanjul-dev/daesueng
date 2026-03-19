import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import useAppStore from '../store/useAppStore'

const MOVE_SPEED = 5
const PLAYER_HEIGHT = 1.7
const PLAYER_RADIUS = 0.3
const FLOOR_HEIGHT = 3.2

// 계단 영역 정의 (도면 기준: 우측 계단실, position=[7, 0, 3])
const STAIR_ZONES = [
  {
    // 1F → 2F 계단 (z축 방향으로 올라감)
    minX: 6.3, maxX: 7.9,
    minZ: 3, maxZ: 7,
    baseY: 0,
    topY: FLOOR_HEIGHT,
    axis: 'z',
    minAxis: 3, maxAxis: 7,
    ascending: true,
  },
]

// 바닥 높이 계산 (계단 포함)
function getFloorHeight(x, z, currentY) {
  for (const stair of STAIR_ZONES) {
    if (x >= stair.minX && x <= stair.maxX && z >= stair.minZ && z <= stair.maxZ) {
      const axisVal = stair.axis === 'z' ? z : x
      const range = stair.maxAxis - stair.minAxis
      let t = (axisVal - stair.minAxis) / range
      if (!stair.ascending) t = 1 - t
      t = Math.max(0, Math.min(1, t))
      const steps = 16
      const stepT = Math.floor(t * steps) / steps
      return stair.baseY + stepT * (stair.topY - stair.baseY)
    }
  }

  // 2F에 있으면 2F 유지
  if (currentY > FLOOR_HEIGHT * 0.5) return FLOOR_HEIGHT
  return 0 // 기본 1F
}

// 충돌 벽 (건물 16x12 = ±8, ±6)
const COLLISION_BOXES = [
  // 외벽
  { min: [-8.2, -10, -6.2], max: [8.2, 20, -5.8] },    // 앞
  { min: [-8.2, -10, 5.8], max: [8.2, 20, 6.2] },      // 뒤
  { min: [-8.2, -10, -6.2], max: [-7.8, 20, 6.2] },    // 왼쪽
  { min: [7.8, -10, -6.2], max: [8.2, 20, 6.2] },      // 오른쪽
  // 내벽: 로비 파티션
  { min: [-0.1, -10, -4.5], max: [0.1, 20, 0.5] },
  // 좌측 방 벽
  { min: [-4.1, -10, -0.5], max: [-3.9, 20, 4.5] },
  // 복도 벽
  { min: [-4, -10, 1.94], max: [0, 20, 2.06] },
  // 화장실 벽
  { min: [4.94, -10, 2], max: [5.06, 20, 5] },
]

function checkCollision(position, radius) {
  for (const box of COLLISION_BOXES) {
    const closestX = Math.max(box.min[0], Math.min(position.x, box.max[0]))
    const closestZ = Math.max(box.min[2], Math.min(position.z, box.max[2]))
    const distX = position.x - closestX
    const distZ = position.z - closestZ
    const distSq = distX * distX + distZ * distZ
    if (distSq < radius * radius) {
      return true
    }
  }
  return false
}

export default function FirstPersonController() {
  const controlsRef = useRef()
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })
  const currentFloorY = useRef(0) // 현재 바닥 높이
  const { camera, gl } = useThree()
  const navMode = useAppStore((s) => s.navMode)
  const setCameraPosition = useAppStore((s) => s.setCameraPosition)
  const setCameraRotation = useAppStore((s) => s.setCameraRotation)
  const isMobile = useRef(false)

  useEffect(() => {
    isMobile.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }, [])

  const onKeyDown = useCallback((event) => {
    switch (event.code) {
      case 'KeyW': case 'ArrowUp':    moveState.current.forward = true; break
      case 'KeyS': case 'ArrowDown':  moveState.current.backward = true; break
      case 'KeyA': case 'ArrowLeft':  moveState.current.left = true; break
      case 'KeyD': case 'ArrowRight': moveState.current.right = true; break
    }
  }, [])

  const onKeyUp = useCallback((event) => {
    switch (event.code) {
      case 'KeyW': case 'ArrowUp':    moveState.current.forward = false; break
      case 'KeyS': case 'ArrowDown':  moveState.current.backward = false; break
      case 'KeyA': case 'ArrowLeft':  moveState.current.left = false; break
      case 'KeyD': case 'ArrowRight': moveState.current.right = false; break
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [onKeyDown, onKeyUp])

  useEffect(() => {
    if (navMode === 'firstperson') {
      // 모바일에서는 PointerLock 사용 안함
      if (!isMobile.current && controlsRef.current) {
        controlsRef.current.lock()
      }
      camera.position.set(0, PLAYER_HEIGHT, 0)
    } else if (controlsRef.current) {
      controlsRef.current.unlock()
    }
  }, [navMode, camera])

  useFrame((_, delta) => {
    if (navMode !== 'firstperson') return

    // 모바일이 아닌 경우 PointerLock 필요
    if (!isMobile.current && controlsRef.current && !controlsRef.current.isLocked) return

    const speed = MOVE_SPEED * delta

    // 모바일 조이스틱 입력 읽기
    const joystick = window.__joystickInput || { x: 0, y: 0 }
    const lookInput = window.__lookInput || { x: 0, y: 0 }

    // 모바일 시점 회전
    if (isMobile.current && (lookInput.x !== 0 || lookInput.y !== 0)) {
      const euler = new THREE.Euler(0, 0, 0, 'YXZ')
      euler.setFromQuaternion(camera.quaternion)
      euler.y -= lookInput.x
      euler.x -= lookInput.y
      euler.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, euler.x))
      camera.quaternion.setFromEuler(euler)
      // Reset after reading
      if (window.__lookInput) window.__lookInput = { x: 0, y: 0 }
    }

    // 카메라 방향 벡터
    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()

    const right = new THREE.Vector3()
    right.crossVectors(forward, camera.up).normalize()

    const direction = new THREE.Vector3()

    // 키보드 입력
    if (moveState.current.forward) direction.add(forward)
    if (moveState.current.backward) direction.sub(forward)
    if (moveState.current.left) direction.sub(right)
    if (moveState.current.right) direction.add(right)

    // 조이스틱 입력 (모바일)
    if (Math.abs(joystick.x) > 0.1 || Math.abs(joystick.y) > 0.1) {
      direction.add(forward.clone().multiplyScalar(joystick.y))
      direction.add(right.clone().multiplyScalar(joystick.x))
    }

    direction.normalize().multiplyScalar(speed)

    // 충돌 검사 후 이동
    const newPos = camera.position.clone().add(direction)

    if (!checkCollision(newPos, PLAYER_RADIUS)) {
      camera.position.add(direction)
    } else {
      // 벽 슬라이딩
      const slideX = camera.position.clone()
      slideX.x += direction.x
      if (!checkCollision(slideX, PLAYER_RADIUS)) {
        camera.position.x = slideX.x
      }

      const slideZ = camera.position.clone()
      slideZ.z += direction.z
      if (!checkCollision(slideZ, PLAYER_RADIUS)) {
        camera.position.z = slideZ.z
      }
    }

    // 계단 높이 계산
    const targetFloorY = getFloorHeight(camera.position.x, camera.position.z, currentFloorY.current)
    currentFloorY.current = THREE.MathUtils.lerp(currentFloorY.current, targetFloorY, delta * 8)

    // 플레이어 높이 = 바닥 높이 + 눈높이
    camera.position.y = currentFloorY.current + PLAYER_HEIGHT

    // 범위 제한 (건물 16x12)
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -7.5, 7.5)
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -5.5, 5.5)

    // 클리핑 방지
    camera.near = 0.1
    camera.updateProjectionMatrix()

    // 스토어 업데이트 (미니맵용)
    setCameraPosition([camera.position.x, camera.position.y, camera.position.z])
    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    setCameraRotation(Math.atan2(dir.x, dir.z))
  })

  if (navMode !== 'firstperson') return null

  // 모바일에서는 PointerLockControls 렌더링하지 않음
  if (isMobile.current) return null

  return (
    <PointerLockControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
    />
  )
}
