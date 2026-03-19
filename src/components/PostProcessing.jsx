import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  EffectComposer,
  Bloom,
  SSAO,
  Vignette,
  ChromaticAberration,
  ToneMapping,
  SMAA,
  BrightnessContrast,
  HueSaturation,
} from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode, SMAAPreset } from 'postprocessing'
import * as THREE from 'three'

export default function PostProcessing() {
  return (
    <EffectComposer multisampling={0} disableNormalPass={false}>
      {/* SSAO — 구석에 부드러운 차폐 그림자 */}
      <SSAO
        blendFunction={BlendFunction.MULTIPLY}
        samples={21}
        radius={0.12}
        intensity={18}
        luminanceInfluence={0.6}
        worldDistanceThreshold={1.5}
        worldDistanceFalloff={0.5}
        worldProximityThreshold={0.4}
        worldProximityFalloff={0.3}
        color={new THREE.Color('#1a1a2e')}
      />

      {/* Bloom — 밝은 광원이 퍼지는 효과 */}
      <Bloom
        intensity={0.35}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.4}
        mipmapBlur
        radius={0.7}
      />

      {/* Brightness/Contrast 미세 조정 */}
      <BrightnessContrast
        brightness={0.02}
        contrast={0.08}
      />

      {/* 채도 미세 보정 */}
      <HueSaturation
        saturation={0.05}
      />

      {/* Vignette — 가장자리 어둡게 */}
      <Vignette
        offset={0.3}
        darkness={0.55}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Chromatic Aberration — 매우 미세한 색수차 */}
      <ChromaticAberration
        offset={new THREE.Vector2(0.0004, 0.0004)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={true}
        modulationOffset={0.4}
      />

      {/* Tone Mapping — ACES Filmic 시네마틱 톤 매핑 */}
      <ToneMapping
        mode={ToneMappingMode.ACES_FILMIC}
      />

      {/* SMAA 안티앨리어싱 */}
      <SMAA preset={SMAAPreset.HIGH} />
    </EffectComposer>
  )
}
