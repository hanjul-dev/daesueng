import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useAppStore from '../store/useAppStore'

const FLOOR_HEIGHT = 3.2
const FLOOR_Y = { B1: -FLOOR_HEIGHT, '1F': 0, '2F': FLOOR_HEIGHT }

// ============== 고급 프로시저럴 텍스처 + Normal Map 생성 ==============

/** 화강석 Diffuse + Normal + Roughness 일체형 */
function createGraniteTextures(scale = 2) {
  const size = 1024
  // Diffuse
  const cD = document.createElement('canvas'); cD.width = size; cD.height = size
  const ctxD = cD.getContext('2d')
  // Normal
  const cN = document.createElement('canvas'); cN.width = size; cN.height = size
  const ctxN = cN.getContext('2d')
  // Roughness
  const cR = document.createElement('canvas'); cR.width = size; cR.height = size
  const ctxR = cR.getContext('2d')

  // Base color
  ctxD.fillStyle = '#c8c4be'; ctxD.fillRect(0, 0, size, size)
  ctxN.fillStyle = '#8080ff'; ctxN.fillRect(0, 0, size, size) // neutral normal
  ctxR.fillStyle = '#8a8a8a'; ctxR.fillRect(0, 0, size, size) // base roughness

  // 화강석 입자 (고밀도)
  const graniteColors = ['#b0aca5', '#bab6ae', '#a8a49c', '#c0bcb5', '#d0ccc6', '#989490', '#8a867e']
  for (let i = 0; i < 20000; i++) {
    const x = Math.random() * size, y = Math.random() * size
    const s = Math.random() * 3 + 0.5
    ctxD.fillStyle = graniteColors[~~(Math.random() * graniteColors.length)]
    ctxD.globalAlpha = Math.random() * 0.15 + 0.03
    ctxD.fillRect(x, y, s, s)
    // Normal 입자
    ctxN.fillStyle = Math.random() > 0.5 ? '#8888ff' : '#7878ff'
    ctxN.globalAlpha = Math.random() * 0.06
    ctxN.fillRect(x, y, s, s)
    // Roughness 변동
    ctxR.fillStyle = Math.random() > 0.5 ? '#909090' : '#7a7a7a'
    ctxR.globalAlpha = Math.random() * 0.08
    ctxR.fillRect(x, y, s, s)
  }

  // 패널 줄눈 (수평/수직 조인트 — 사진에서 보이는 것처럼)
  const panelH = 170, panelW = 256
  ctxD.globalAlpha = 0.4; ctxD.strokeStyle = '#7a766e'; ctxD.lineWidth = 2.5
  ctxN.globalAlpha = 0.4; ctxN.strokeStyle = '#6060e0'; ctxN.lineWidth = 3 // normal map: indent
  ctxR.globalAlpha = 0.3; ctxR.strokeStyle = '#606060'; ctxR.lineWidth = 2

  for (let y = 0; y < size; y += panelH) {
    ctxD.beginPath(); ctxD.moveTo(0, y); ctxD.lineTo(size, y); ctxD.stroke()
    ctxN.beginPath(); ctxN.moveTo(0, y); ctxN.lineTo(size, y); ctxN.stroke()
    ctxR.beginPath(); ctxR.moveTo(0, y); ctxR.lineTo(size, y); ctxR.stroke()
  }
  for (let x = 0; x < size; x += panelW) {
    ctxD.beginPath(); ctxD.moveTo(x, 0); ctxD.lineTo(x, size); ctxD.stroke()
    ctxN.beginPath(); ctxN.moveTo(x, 0); ctxN.lineTo(x, size); ctxN.stroke()
    ctxR.beginPath(); ctxR.moveTo(x, 0); ctxR.lineTo(x, size); ctxR.stroke()
  }

  // 줄눈 안쪽 그림자선
  ctxD.globalAlpha = 0.15; ctxD.strokeStyle = '#5a5650'; ctxD.lineWidth = 1
  for (let y = 1; y < size; y += panelH) {
    ctxD.beginPath(); ctxD.moveTo(0, y); ctxD.lineTo(size, y); ctxD.stroke()
  }

  const makeMap = (canvas) => {
    const t = new THREE.CanvasTexture(canvas)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(scale, scale)
    t.anisotropy = 8
    return t
  }

  return {
    map: makeMap(cD),
    normalMap: makeMap(cN),
    roughnessMap: makeMap(cR),
  }
}

/** 대리석 (Marble) 텍스처 */
function createMarbleTextures(base, vein, scale = 3) {
  const size = 1024
  const cD = document.createElement('canvas'); cD.width = size; cD.height = size
  const ctxD = cD.getContext('2d')
  const cN = document.createElement('canvas'); cN.width = size; cN.height = size
  const ctxN = cN.getContext('2d')

  ctxD.fillStyle = base; ctxD.fillRect(0, 0, size, size)
  ctxN.fillStyle = '#8080ff'; ctxN.fillRect(0, 0, size, size)

  // Marble veins
  ctxD.globalAlpha = 0.12
  ctxN.globalAlpha = 0.08
  for (let i = 0; i < 50; i++) {
    ctxD.strokeStyle = vein
    ctxD.lineWidth = Math.random() * 3 + 0.5
    ctxN.strokeStyle = '#7070e8'
    ctxN.lineWidth = Math.random() * 2.5 + 0.5

    ctxD.beginPath(); ctxN.beginPath()
    let x = Math.random() * size, y = Math.random() * size
    ctxD.moveTo(x, y); ctxN.moveTo(x, y)
    for (let j = 0; j < 8; j++) {
      x += (Math.random() - 0.5) * 100; y += (Math.random() - 0.3) * 80
      ctxD.lineTo(x, y); ctxN.lineTo(x, y)
    }
    ctxD.stroke(); ctxN.stroke()
  }

  // subtle surface shimmer
  for (let i = 0; i < 5000; i++) {
    ctxD.fillStyle = Math.random() > 0.5 ? '#ffffff' : vein
    ctxD.globalAlpha = Math.random() * 0.02
    const x = Math.random() * size, y = Math.random() * size
    ctxD.fillRect(x, y, Math.random() * 2, Math.random() * 2)
  }

  const makeMap = (canvas) => {
    const t = new THREE.CanvasTexture(canvas)
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(scale, scale); t.anisotropy = 8
    return t
  }
  return { map: makeMap(cD), normalMap: makeMap(cN) }
}

/** 목재 텍스처 */
function createWoodTextures(scale = 5) {
  const size = 1024
  const cD = document.createElement('canvas'); cD.width = size; cD.height = size
  const ctxD = cD.getContext('2d')
  const cN = document.createElement('canvas'); cN.width = size; cN.height = size
  const ctxN = cN.getContext('2d')

  ctxN.fillStyle = '#8080ff'; ctxN.fillRect(0, 0, size, size)

  const bw = 128
  const cols = ['#b8923a','#a88532','#c49e45','#9a7828','#c8a84d','#b08830']
  for (let x = 0; x < size; x += bw) {
    ctxD.fillStyle = cols[~~(Math.random() * cols.length)]
    ctxD.fillRect(x, 0, bw - 1, size)
    // 나무결
    ctxD.globalAlpha = 0.12
    ctxN.globalAlpha = 0.06
    for (let y = 0; y < size; y += 2) {
      const grainCol = Math.random() > 0.5 ? '#7a6020' : '#c8a848'
      ctxD.strokeStyle = grainCol; ctxD.lineWidth = 0.5
      ctxN.strokeStyle = '#7878f0'; ctxN.lineWidth = 0.5
      ctxD.beginPath(); ctxD.moveTo(x + 2, y); ctxD.lineTo(x + bw - 3, y + (Math.random() - 0.5) * 2); ctxD.stroke()
      ctxN.beginPath(); ctxN.moveTo(x + 2, y); ctxN.lineTo(x + bw - 3, y + (Math.random() - 0.5) * 2); ctxN.stroke()
    }
    ctxD.globalAlpha = 1; ctxN.globalAlpha = 1
  }

  const makeMap = (canvas) => {
    const t = new THREE.CanvasTexture(canvas)
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(scale, scale); t.anisotropy = 8
    return t
  }
  return { map: makeMap(cD), normalMap: makeMap(cN) }
}

/** 콘크리트 Roughness+Normal 생성 */
function createConcreteTextures(scale = 3) {
  const size = 512
  const cN = document.createElement('canvas'); cN.width = size; cN.height = size
  const ctxN = cN.getContext('2d')
  ctxN.fillStyle = '#8080ff'; ctxN.fillRect(0, 0, size, size)
  for (let i = 0; i < 12000; i++) {
    ctxN.fillStyle = Math.random() > 0.5 ? '#7878f0' : '#8888ff'
    ctxN.globalAlpha = Math.random() * 0.04
    ctxN.fillRect(Math.random()*size, Math.random()*size, Math.random()*3+0.5, Math.random()*3+0.5)
  }
  const t = new THREE.CanvasTexture(cN)
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(scale, scale); t.anisotropy = 4
  return { normalMap: t }
}

// ============== PBR 재질 (대폭 향상) ==============
function createMaterials() {
  const granite = createGraniteTextures(2)
  const marble = createMarbleTextures('#f0ece4', '#b8a898', 3)
  const stairMarble = createMarbleTextures('#f4f0ea', '#c0b0a0', 2)
  const oak = createWoodTextures(4)
  const concrete = createConcreteTextures(3)

  return {
    granite: new THREE.MeshStandardMaterial({
      map: granite.map,
      normalMap: granite.normalMap,
      normalScale: new THREE.Vector2(0.6, 0.6),
      roughnessMap: granite.roughnessMap,
      roughness: 0.55,
      metalness: 0.03,
      envMapIntensity: 0.8,
    }),
    marble: new THREE.MeshStandardMaterial({
      map: marble.map,
      normalMap: marble.normalMap,
      normalScale: new THREE.Vector2(0.3, 0.3),
      color: '#f5f0ea',
      roughness: 0.15,
      metalness: 0.08,
      envMapIntensity: 1.2,
    }),
    oak: new THREE.MeshStandardMaterial({
      map: oak.map,
      normalMap: oak.normalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      color: '#c4a050',
      roughness: 0.45,
      metalness: 0.02,
      envMapIntensity: 0.6,
    }),
    stairMarble: new THREE.MeshStandardMaterial({
      map: stairMarble.map,
      normalMap: stairMarble.normalMap,
      normalScale: new THREE.Vector2(0.2, 0.2),
      color: '#f8f4ee',
      roughness: 0.12,
      metalness: 0.05,
      envMapIntensity: 1.5,
    }),
    concrete: new THREE.MeshStandardMaterial({
      color: '#b8b4ac',
      normalMap: concrete.normalMap,
      normalScale: new THREE.Vector2(0.35, 0.35),
      roughness: 0.88,
      metalness: 0.04,
      envMapIntensity: 0.3,
    }),
    retaining: new THREE.MeshStandardMaterial({
      color: '#a09c94',
      normalMap: concrete.normalMap,
      normalScale: new THREE.Vector2(0.4, 0.4),
      roughness: 0.92,
      metalness: 0.03,
      envMapIntensity: 0.2,
    }),
    // 다크 트림/지붕 — 사진: 다크 차콜
    darkTrim: new THREE.MeshStandardMaterial({
      color: '#2a2a2a',
      roughness: 0.45,
      metalness: 0.35,
      envMapIntensity: 1.0,
    }),
    // 소피트 (오버행 하부)
    soffit: new THREE.MeshStandardMaterial({
      color: '#3a2c1c',
      roughness: 0.55,
      metalness: 0.03,
      envMapIntensity: 0.4,
    }),
    // 창틀 — 블랙 알루미늄
    frame: new THREE.MeshStandardMaterial({
      color: '#1c1c1c',
      roughness: 0.2,
      metalness: 0.8,
      envMapIntensity: 1.5,
    }),
    // ★★★ 유리 — MeshPhysicalMaterial with IOR, 반사, 투명 ★★★
    glass: new THREE.MeshPhysicalMaterial({
      color: '#5a88a8',
      transparent: true,
      opacity: 0.35,
      roughness: 0.02,
      metalness: 0.05,
      transmission: 0.65,
      thickness: 0.5,
      ior: 1.52,
      reflectivity: 0.5,
      envMapIntensity: 2.0,
      clearcoat: 0.3,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
    }),
    // ★ 발코니 유리 — 프레임리스, 거의 투명 ★
    balcGlass: new THREE.MeshPhysicalMaterial({
      color: '#d0e8f4',
      transparent: true,
      opacity: 0.08,
      roughness: 0.005,
      metalness: 0.01,
      transmission: 0.96,
      thickness: 0.8,
      ior: 1.52,
      reflectivity: 0.6,
      envMapIntensity: 2.5,
      clearcoat: 0.5,
      clearcoatRoughness: 0.05,
      side: THREE.DoubleSide,
    }),
    // ★ 커튼월 유리 ★
    curtainGlass: new THREE.MeshPhysicalMaterial({
      color: '#4a7898',
      transparent: true,
      opacity: 0.4,
      roughness: 0.01,
      metalness: 0.08,
      transmission: 0.6,
      thickness: 0.5,
      ior: 1.52,
      reflectivity: 0.55,
      envMapIntensity: 2.0,
      clearcoat: 0.4,
      clearcoatRoughness: 0.08,
      side: THREE.DoubleSide,
    }),
    handle: new THREE.MeshStandardMaterial({
      color: '#c0c0c0',
      roughness: 0.15,
      metalness: 0.9,
      envMapIntensity: 2.0,
    }),
    door: new THREE.MeshStandardMaterial({
      color: '#f0f0ec',
      roughness: 0.65,
      metalness: 0.02,
      envMapIntensity: 0.5,
    }),
    epoxy: new THREE.MeshStandardMaterial({
      color: '#b0b4b8',
      roughness: 0.35,
      metalness: 0.12,
      envMapIntensity: 0.7,
    }),
    ceiling: new THREE.MeshStandardMaterial({
      color: '#f0ece4',
      roughness: 0.9,
      metalness: 0.01,
      envMapIntensity: 0.3,
    }),
    gold: new THREE.MeshStandardMaterial({
      color: '#c4a832',
      roughness: 0.12,
      metalness: 0.95,
      envMapIntensity: 2.5,
    }),
    garage: new THREE.MeshStandardMaterial({
      color: '#444',
      roughness: 0.35,
      metalness: 0.55,
      envMapIntensity: 0.8,
    }),
  }
}

// Material Swap
const swappableMaterials = {
  'marble-white': () => new THREE.MeshStandardMaterial({ map: createMarbleTextures('#f0ece4','#b8a898',3).map, color: '#f5f0ea', roughness: 0.2, envMapIntensity: 1.2 }),
  'marble-black': () => new THREE.MeshStandardMaterial({ map: createMarbleTextures('#2a2a2a','#444',3).map, color: '#2d2d2d', roughness: 0.15, envMapIntensity: 1.5 }),
  'marble-beige': () => new THREE.MeshStandardMaterial({ map: createMarbleTextures('#d4c5a9','#b0a088',3).map, color: '#d4c5a9', roughness: 0.25, envMapIntensity: 1.0 }),
  'wood-oak': () => new THREE.MeshStandardMaterial({ map: createWoodTextures(5).map, color: '#b8860b', roughness: 0.55, envMapIntensity: 0.6 }),
  'wood-walnut': () => new THREE.MeshStandardMaterial({ map: createWoodTextures(5).map, color: '#5c3317', roughness: 0.5, envMapIntensity: 0.6 }),
  'paint-warm-gray': () => new THREE.MeshStandardMaterial({ color: '#d6d0c4', roughness: 0.7, envMapIntensity: 0.4 }),
  'paint-cool-blue': () => new THREE.MeshStandardMaterial({ color: '#c5d5e4', roughness: 0.9, envMapIntensity: 0.3 }),
  'paint-sage-green': () => new THREE.MeshStandardMaterial({ color: '#c5d4c0', roughness: 0.9, envMapIntensity: 0.3 }),
  'tile-dark': () => new THREE.MeshStandardMaterial({ color: '#4a4a4a', roughness: 0.3, envMapIntensity: 0.8 }),
  'tile-light': () => new THREE.MeshStandardMaterial({ color: '#e0ddd5', roughness: 0.25, envMapIntensity: 0.6 }),
  'tile-terracotta': () => new THREE.MeshStandardMaterial({ color: '#c8735b', roughness: 0.4, envMapIntensity: 0.5 }),
}
export { swappableMaterials }

// ============== 헬퍼 컴포넌트 ==============
function Win({ position, w=2, h=1.8, rotation=[0,0,0], m }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow><boxGeometry args={[w+0.1,h+0.1,0.06]}/><primitive object={m.frame} attach="material"/></mesh>
      <mesh><boxGeometry args={[w,h,0.02]}/><primitive object={m.glass} attach="material"/></mesh>
      {w > 1.5 && <mesh><boxGeometry args={[0.03,h,0.07]}/><primitive object={m.frame} attach="material"/></mesh>}
    </group>
  )
}

function DL({ position, intensity=0.4 }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.06,0.06,0.025,12]}/>
        <meshStandardMaterial color="#fff5e0" emissive="#fff5e0" emissiveIntensity={1.2}/>
      </mesh>
      {/* 라이트 바디 glow ring */}
      <mesh position={[0,0.01,0]}>
        <ringGeometry args={[0.04,0.07,12]}/>
        <meshStandardMaterial color="#ffe8c8" emissive="#ffe8c8" emissiveIntensity={0.8} side={THREE.DoubleSide} transparent opacity={0.5}/>
      </mesh>
      <spotLight
        position={[0,-0.1,0]}
        angle={Math.PI/3}
        penumbra={0.7}
        intensity={intensity}
        distance={5}
        decay={2}
        color="#ffe4c8"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.002}
      />
    </group>
  )
}

function Door({ position, rotation=[0,0,0], m }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow><boxGeometry args={[0.9,2.2,0.05]}/><primitive object={m.door} attach="material"/></mesh>
      <group position={[0.35,0,0.03]}>
        <mesh><boxGeometry args={[0.12,0.03,0.03]}/><primitive object={m.handle} attach="material"/></mesh>
      </group>
    </group>
  )
}

// ============== 도면+사진 기반 건물 매스 ==============
function BuildingMass({ m }) {
  const layers = useAppStore((s) => s.layers)
  if (!layers.structure) return null
  const H = FLOOR_HEIGHT
  const W = 16, D = 12

  return (
    <group>
      {/* ======= B1: 옹벽 + 차고 ======= */}
      <mesh position={[0, -H, 0]} receiveShadow><boxGeometry args={[W, 0.25, D]}/><primitive object={m.epoxy} attach="material"/></mesh>
      <mesh position={[0, 0, 0]} receiveShadow><boxGeometry args={[W, 0.25, D]}/><primitive object={m.concrete} attach="material"/></mesh>
      <mesh position={[0,-H/2,-D/2]} castShadow><boxGeometry args={[W,H,0.25]}/><primitive object={m.concrete} attach="material"/></mesh>
      <mesh position={[0,-H/2,D/2]} castShadow><boxGeometry args={[W,H,0.25]}/><primitive object={m.concrete} attach="material"/></mesh>
      <mesh position={[-W/2,-H/2,0]} castShadow><boxGeometry args={[0.25,H,D]}/><primitive object={m.concrete} attach="material"/></mesh>
      <mesh position={[W/2,-H/2,0]} castShadow><boxGeometry args={[0.25,H,D]}/><primitive object={m.concrete} attach="material"/></mesh>
      <mesh position={[0, -H/2-0.5, -D/2-1]} castShadow><boxGeometry args={[W+2, H+1, 0.3]}/><primitive object={m.retaining} attach="material"/></mesh>
      <mesh position={[-5, -H/2, -D/2-0.13]} castShadow><boxGeometry args={[3, 2.5, 0.05]}/><primitive object={m.garage} attach="material"/></mesh>
      <Win position={[2, -H/2, -D/2]} w={1.5} h={1.2} m={m}/>
      <Win position={[5, -H/2, -D/2]} w={1.2} h={1.0} m={m}/>

      {/* ======= 1F: 메인 볼륨 ======= */}
      <mesh position={[0, H, 0]} receiveShadow><boxGeometry args={[W, 0.25, D]}/><primitive object={m.concrete} attach="material"/></mesh>
      <mesh position={[-W/2, H/2, 0]} castShadow receiveShadow><boxGeometry args={[0.25,H,D]}/><primitive object={m.granite} attach="material"/></mesh>
      <mesh position={[W/2, H/2, 0]} castShadow receiveShadow><boxGeometry args={[0.25,H,D]}/><primitive object={m.granite} attach="material"/></mesh>
      <mesh position={[0, H/2, D/2]} castShadow><boxGeometry args={[W,H,0.25]}/><primitive object={m.granite} attach="material"/></mesh>
      <mesh position={[-6.5, H/2, -D/2]} castShadow><boxGeometry args={[3,H,0.25]}/><primitive object={m.granite} attach="material"/></mesh>
      <mesh position={[6.5, H/2, -D/2]} castShadow><boxGeometry args={[3,H,0.25]}/><primitive object={m.granite} attach="material"/></mesh>
      <mesh position={[0, H/2, -D/2]} castShadow><boxGeometry args={[1,H,0.25]}/><primitive object={m.granite} attach="material"/></mesh>
      <Win position={[-3, H/2, -D/2]} w={4} h={H-0.4} m={m}/>
      <Win position={[3.5, H/2, -D/2]} w={4} h={H-0.4} m={m}/>
      <Win position={[-W/2, H/2, -2]} w={2} h={1.6} rotation={[0,Math.PI/2,0]} m={m}/>
      <Win position={[-W/2, H/2, 3]} w={2} h={1.6} rotation={[0,Math.PI/2,0]} m={m}/>
      <Win position={[W/2, H/2, -2]} w={1.5} h={1.5} rotation={[0,Math.PI/2,0]} m={m}/>

      {/* ======= 유리 발코니 (2F 레벨, 전면) ======= */}
      <mesh position={[0, H, -D/2-1.2]} receiveShadow castShadow>
        <boxGeometry args={[14, 0.18, 2.4]}/><primitive object={m.granite} attach="material"/>
      </mesh>
      <mesh position={[0, H-0.1, -D/2-1.2]}>
        <boxGeometry args={[13.8, 0.06, 2.2]}/><primitive object={m.soffit} attach="material"/>
      </mesh>
      {[-5,-3.5,-2,-0.5,1,2.5,4,5.5].map((x,i)=>
        <DL key={`s${i}`} position={[x, H-0.14, -D/2-1.2]} intensity={0.25}/>
      )}
      <mesh position={[0, H+0.55, -D/2-2.35]}>
        <boxGeometry args={[14, 1.0, 0.012]}/><primitive object={m.balcGlass} attach="material"/>
      </mesh>
      <mesh position={[0, H+1.05, -D/2-2.35]} castShadow>
        <boxGeometry args={[14.1, 0.035, 0.04]}/><primitive object={m.handle} attach="material"/>
      </mesh>

      {/* ======= 2F: 캔틸레버 돌출 볼륨 ======= */}
      {/* --- 좌측 --- */}
      <mesh position={[-4.5, H, -D/2-1]} castShadow><boxGeometry args={[7, 0.25, D+2]}/><primitive object={m.concrete} attach="material"/></mesh>
      <mesh position={[-W/2, H+H/2, 0]} castShadow><boxGeometry args={[0.25,H,D]}/><primitive object={m.granite} attach="material"/></mesh>
      <mesh position={[-4.5, H+H/2, -D/2-1.5]} castShadow>
        <boxGeometry args={[7,H,0.25]}/><primitive object={m.granite} attach="material"/>
      </mesh>
      <mesh position={[-W/2, H+H/2, -D/2-0.75]} castShadow>
        <boxGeometry args={[0.25,H,1.5]}/><primitive object={m.granite} attach="material"/>
      </mesh>
      <mesh position={[-4.5, H+H/2, D/2]} castShadow><boxGeometry args={[7,H,0.25]}/><primitive object={m.granite} attach="material"/></mesh>
      <mesh position={[-4.5, H*2+0.12, -D/2-0.75]} castShadow>
        <boxGeometry args={[7.2, 0.2, D+1.7]}/><primitive object={m.darkTrim} attach="material"/>
      </mesh>
      <mesh position={[-4.5, H-0.02, -D/2-0.75]}>
        <boxGeometry args={[6.8, 0.06, 1.3]}/><primitive object={m.soffit} attach="material"/>
      </mesh>
      <Win position={[-5.5, H+H/2, -D/2-1.5]} w={2.5} h={1.6} m={m}/>
      <Win position={[-3, H+H/2, -D/2-1.5]} w={2.0} h={1.6} m={m}/>
      <Win position={[-W/2, H+H/2, -2]} w={2.5} h={1.8} rotation={[0,Math.PI/2,0]} m={m}/>
      <Win position={[-W/2, H+H/2, 3]} w={2} h={1.5} rotation={[0,Math.PI/2,0]} m={m}/>

      {/* --- 우측 --- */}
      <mesh position={[5, H, -D/2-0.5]} castShadow><boxGeometry args={[6, 0.25, D+1]}/><primitive object={m.concrete} attach="material"/></mesh>
      <mesh position={[W/2, H+H/2, 0]} castShadow><boxGeometry args={[0.25,H,D]}/><primitive object={m.granite} attach="material"/></mesh>
      <mesh position={[5, H+H/2, -D/2-1]} castShadow>
        <boxGeometry args={[6,H,0.25]}/><primitive object={m.granite} attach="material"/>
      </mesh>
      <mesh position={[W/2, H+H/2, -D/2-0.5]} castShadow>
        <boxGeometry args={[0.25,H,1]}/><primitive object={m.granite} attach="material"/>
      </mesh>
      <mesh position={[5, H+H/2, D/2]} castShadow><boxGeometry args={[6,H,0.25]}/><primitive object={m.granite} attach="material"/></mesh>
      <mesh position={[5, H*2+0.12, -D/2-0.25]} castShadow>
        <boxGeometry args={[6.2, 0.2, D+0.7]}/><primitive object={m.darkTrim} attach="material"/>
      </mesh>
      <mesh position={[5, H-0.02, -D/2-0.25]}>
        <boxGeometry args={[5.8, 0.06, 0.8]}/><primitive object={m.soffit} attach="material"/>
      </mesh>
      <Win position={[4, H+H/2, -D/2-1]} w={2} h={1.6} m={m}/>
      <Win position={[6.5, H+H/2, -D/2-1]} w={1.5} h={1.5} m={m}/>
      <Win position={[W/2, H+H/2, -2]} w={1.5} h={1.5} rotation={[0,Math.PI/2,0]} m={m}/>

      {/* --- 2F 중앙: 대형 유리 커튼월 --- */}
      <group position={[0, H+H/2, -D/2]}>
        <mesh><boxGeometry args={[4, H-0.3, 0.02]}/><primitive object={m.curtainGlass} attach="material"/></mesh>
        {[-2, -0.67, 0.67, 2].map((x,i)=>
          <mesh key={`cv${i}`} position={[x,0,0]} castShadow><boxGeometry args={[0.04,H-0.3,0.06]}/><primitive object={m.frame} attach="material"/></mesh>
        )}
        <mesh castShadow><boxGeometry args={[4,0.04,0.06]}/><primitive object={m.frame} attach="material"/></mesh>
      </group>

      {/* ======= 2F 상부 오버행 소피트 ======= */}
      <mesh position={[0, H*2-0.04, -D/2-1.5]}>
        <boxGeometry args={[14, 0.08, 3]}/><primitive object={m.soffit} attach="material"/>
      </mesh>
      {[-5,-3,-1,1,3,5].map((x,i)=>
        <DL key={`t${i}`} position={[x, H*2-0.1, -D/2-1]} intensity={0.3}/>
      )}

      {/* ======= 지붕 파라펫 ======= */}
      <mesh position={[0, H*2+0.3, -D/2-0.5]} castShadow><boxGeometry args={[16.5,0.45,0.08]}/><primitive object={m.darkTrim} attach="material"/></mesh>
      <mesh position={[0, H*2+0.3, D/2+0.1]} castShadow><boxGeometry args={[16.5,0.45,0.08]}/><primitive object={m.darkTrim} attach="material"/></mesh>
      <mesh position={[-W/2-0.1, H*2+0.3, 0]} castShadow><boxGeometry args={[0.08,0.45,D+0.4]}/><primitive object={m.darkTrim} attach="material"/></mesh>
      <mesh position={[W/2+0.1, H*2+0.3, 0]} castShadow><boxGeometry args={[0.08,0.45,D+0.4]}/><primitive object={m.darkTrim} attach="material"/></mesh>

      {/* 외부 진입 계단 */}
      {[...Array(8)].map((_,i)=>
        <mesh key={`es${i}`} position={[W/2+0.5, -H+i*(H/8), -4+i*0.3]} castShadow receiveShadow>
          <boxGeometry args={[1.3,0.06,0.3]}/><primitive object={m.granite} attach="material"/>
        </mesh>
      )}

      {/* 전면 조경 옹벽 */}
      <mesh position={[3, -H+0.5, -D/2-2.5]} castShadow>
        <boxGeometry args={[8,1.0,0.2]}/><primitive object={m.retaining} attach="material"/>
      </mesh>
    </group>
  )
}

// 계단
function Stairs({ position, baseY, m }) {
  const l = useAppStore(s=>s.layers); if(!l.structure) return null
  const steps=16, rH=FLOOR_HEIGHT/steps, tD=0.25
  return (
    <group position={position}>
      {[...Array(steps)].map((_,i)=>(
        <group key={i}>
          <mesh position={[0,baseY+rH*(i+1),tD*i+tD/2]} castShadow receiveShadow><boxGeometry args={[1.2,0.04,tD+0.02]}/><primitive object={m.stairMarble} attach="material"/></mesh>
          <mesh position={[0,baseY+rH*i+rH/2,tD*i]} castShadow><boxGeometry args={[1.2,rH,0.02]}/><primitive object={m.stairMarble} attach="material"/></mesh>
        </group>
      ))}
      <mesh position={[-0.62,baseY+FLOOR_HEIGHT/2,steps*tD/2]} castShadow><boxGeometry args={[0.04,FLOOR_HEIGHT+0.2,steps*tD+0.5]}/><primitive object={m.marble} attach="material"/></mesh>
      <mesh position={[0.62,baseY+FLOOR_HEIGHT/2,steps*tD/2]} castShadow><boxGeometry args={[0.04,FLOOR_HEIGHT+0.2,steps*tD+0.5]}/><primitive object={m.marble} attach="material"/></mesh>
      <mesh position={[0.63,baseY+FLOOR_HEIGHT/2+0.5,steps*tD/2]}><boxGeometry args={[0.01,1.0,steps*tD]}/><primitive object={m.balcGlass} attach="material"/></mesh>
    </group>
  )
}

// 가구
function Desk({ position, rotation=[0,0,0] }) {
  const l = useAppStore(s=>s.layers); if(!l.furniture) return null
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0,0.75,0]} castShadow><boxGeometry args={[1.4,0.03,0.65]}/><meshStandardMaterial color="#a08040" roughness={0.4} envMapIntensity={0.8}/></mesh>
      <mesh position={[-0.65,0.375,0]} castShadow><boxGeometry args={[0.03,0.75,0.6]}/><meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} envMapIntensity={1.0}/></mesh>
      <mesh position={[0.65,0.375,0]} castShadow><boxGeometry args={[0.03,0.75,0.6]}/><meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} envMapIntensity={1.0}/></mesh>
      <mesh position={[0,1.05,-0.2]} castShadow><boxGeometry args={[0.55,0.32,0.02]}/><meshStandardMaterial color="#111" roughness={0.08} envMapIntensity={1.5}/></mesh>
    </group>
  )
}
function Sofa({ position, rotation=[0,0,0] }) {
  const l = useAppStore(s=>s.layers); if(!l.furniture) return null
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0,0.3,0]} castShadow><boxGeometry args={[2.2,0.25,0.9]}/><meshStandardMaterial color="#3a3a38" roughness={0.85}/></mesh>
      <mesh position={[0,0.55,-0.38]} castShadow><boxGeometry args={[2.2,0.45,0.15]}/><meshStandardMaterial color="#3a3a38" roughness={0.85}/></mesh>
      <mesh position={[-1.05,0.4,0]} castShadow><boxGeometry args={[0.12,0.5,0.9]}/><meshStandardMaterial color="#3a3a38" roughness={0.85}/></mesh>
      <mesh position={[1.05,0.4,0]} castShadow><boxGeometry args={[0.12,0.5,0.9]}/><meshStandardMaterial color="#3a3a38" roughness={0.85}/></mesh>
    </group>
  )
}

// HVAC/MEP
function HVACDuct({start,end,radius=0.15}){const l=useAppStore(s=>s.layers);if(!l.hvac)return null;const s2=new THREE.Vector3(...start),e=new THREE.Vector3(...end),d=new THREE.Vector3().subVectors(e,s2),len=d.length(),mid=s2.clone().add(d.multiplyScalar(0.5));return<mesh position={mid.toArray()} castShadow><cylinderGeometry args={[radius,radius,len,10]}/><meshStandardMaterial color="#a0aec0" roughness={0.4} metalness={0.6} transparent opacity={0.7}/></mesh>}
function MEPPipe({start,end,radius=0.05,color='#48bb78'}){const l=useAppStore(s=>s.layers);if(!l.mep)return null;const s2=new THREE.Vector3(...start),e=new THREE.Vector3(...end),d=new THREE.Vector3().subVectors(e,s2),len=d.length(),mid=s2.clone().add(d.multiplyScalar(0.5));return<mesh position={mid.toArray()} castShadow><cylinderGeometry args={[radius,radius,len,8]}/><meshStandardMaterial color={color} roughness={0.5} metalness={0.4} transparent opacity={0.7}/></mesh>}

// 층별 인테리어
function FloorInterior({ floorId, yBase, m, matCfg }) {
  const layers = useAppStore(s => s.layers)
  const isB1 = floorId === 'B1'
  const sm = useMemo(() => {
    const a=swappableMaterials[matCfg.lobbyFloor], b=swappableMaterials[matCfg.officeWalls], c=swappableMaterials[matCfg.hallwayFloor]
    return { lobby: a?a():m.oak, wall: b?b():m.marble, hall: c?c():m.oak }
  }, [matCfg, m])

  return (
    <group>
      {layers.structure && !isB1 && <mesh position={[0,yBase+0.13,0]} receiveShadow><boxGeometry args={[15.5,0.01,11.5]}/><primitive object={sm.lobby} attach="material"/></mesh>}
      {layers.interior && !isB1 && <>
        <mesh position={[0,yBase+FLOOR_HEIGHT/2,-2]} castShadow><boxGeometry args={[0.12,FLOOR_HEIGHT,5]}/><primitive object={sm.wall} attach="material"/></mesh>
        <mesh position={[-4,yBase+FLOOR_HEIGHT/2,2]} castShadow><boxGeometry args={[0.12,FLOOR_HEIGHT,5]}/><primitive object={sm.wall} attach="material"/></mesh>
        <mesh position={[-2,yBase+FLOOR_HEIGHT/2,2]} castShadow><boxGeometry args={[4,FLOOR_HEIGHT,0.12]}/><primitive object={sm.wall} attach="material"/></mesh>
        <mesh position={[5,yBase+FLOOR_HEIGHT/2,3.5]} castShadow><boxGeometry args={[0.12,FLOOR_HEIGHT,3]}/><primitive object={sm.wall} attach="material"/></mesh>
      </>}
      {layers.interior && !isB1 && <>
        <Door position={[-4,yBase+1.25,0]} rotation={[0,Math.PI/2,0]} m={m}/>
        <Door position={[0,yBase+1.25,-4]} m={m}/>
        <Door position={[5,yBase+1.25,3]} rotation={[0,Math.PI/2,0]} m={m}/>
      </>}
      {layers.structure && [[-5,0,-3],[0,0,-3],[5,0,-3],[-5,0,3],[0,0,3],[5,0,3]].map((p,i)=>
        <mesh key={`col${i}`} position={[p[0],yBase+FLOOR_HEIGHT/2,p[2]]} castShadow><boxGeometry args={[0.35,FLOOR_HEIGHT,0.35]}/><primitive object={m.granite} attach="material"/></mesh>
      )}
      {!isB1 && [[-4,0,-3],[0,0,-3],[4,0,-3],[-4,0,0],[0,0,0],[4,0,0]].map((p,i)=>
        <DL key={`dl${i}`} position={[p[0],yBase+FLOOR_HEIGHT-0.02,p[2]]} intensity={0.35}/>
      )}
      {!isB1 && <>
        <Desk position={[-6,yBase+0.13,-4]}/>
        <Desk position={[-6,yBase+0.13,-2]}/>
        <Sofa position={[3,yBase+0.13,-4]}/>
        <Sofa position={[3,yBase+0.13,-1.5]} rotation={[0,Math.PI,0]}/>
      </>}
      <HVACDuct start={[-7,yBase+FLOOR_HEIGHT-0.3,-4]} end={[7,yBase+FLOOR_HEIGHT-0.3,-4]}/>
      <HVACDuct start={[-7,yBase+FLOOR_HEIGHT-0.3,3]} end={[7,yBase+FLOOR_HEIGHT-0.3,3]}/>
      <MEPPipe start={[7,yBase+0.5,-5]} end={[7,yBase+FLOOR_HEIGHT-0.2,-5]} color="#48bb78"/>
      <MEPPipe start={[-7,yBase+0.5,5]} end={[-7,yBase+FLOOR_HEIGHT-0.2,5]} color="#e53e3e"/>
    </group>
  )
}

// ============== 메인 ==============
export default function Building() {
  const activeFloor = useAppStore(s => s.activeFloor)
  const isExploded = useAppStore(s => s.isExploded)
  const matCfg = useAppStore(s => s.materialConfig)
  const m = useMemo(() => createMaterials(), [])
  const floorRefs = useRef({ B1: null, '1F': null, '2F': null })

  useFrame((_, delta) => {
    const floors = floorRefs.current
    const eAmt = isExploded ? 3.5 : 0
    Object.entries(floors).forEach(([fid, ref]) => {
      if (!ref) return
      let tY = 0
      if (isExploded) { if(fid==='B1') tY=-eAmt; if(fid==='2F') tY=eAmt }
      let tOp = 1
      if (activeFloor !== 0) { const fm={'-1':'B1',1:'1F',2:'2F'}; if(fm[activeFloor]!==fid) tOp=0.08 }
      ref.position.y = THREE.MathUtils.lerp(ref.position.y, tY, delta*3)
      ref.traverse((ch) => {
        if(ch.material){if(ch.material.transparent!==false)ch.material.transparent=true;const bo=ch.material._bo??ch.material.opacity;ch.material._bo=bo;ch.material.opacity=THREE.MathUtils.lerp(ch.material.opacity,tOp*bo,delta*4)}
      })
    })
  })

  return (
    <group>
      <BuildingMass m={m}/>
      <group ref={el=>(floorRefs.current.B1=el)}>
        <FloorInterior floorId="B1" yBase={FLOOR_Y.B1} m={m} matCfg={matCfg}/>
      </group>
      <group ref={el=>(floorRefs.current['1F']=el)}>
        <FloorInterior floorId="1F" yBase={FLOOR_Y['1F']} m={m} matCfg={matCfg}/>
        <Stairs position={[6,0,3]} baseY={FLOOR_Y['1F']} m={m}/>
      </group>
      <group ref={el=>(floorRefs.current['2F']=el)}>
        <FloorInterior floorId="2F" yBase={FLOOR_Y['2F']} m={m} matCfg={matCfg}/>
      </group>
    </group>
  )
}
