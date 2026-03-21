import {
  Bloom,
  BrightnessContrast,
  EffectComposer,
  SMAA,
  SSAO,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction, SMAAPreset } from 'postprocessing'
import * as THREE from 'three'

export default function PostProcessing() {
  return (
    <EffectComposer multisampling={0} enableNormalPass>
      <SSAO
        blendFunction={BlendFunction.MULTIPLY}
        samples={18}
        radius={0.1}
        intensity={3.4}
        luminanceInfluence={0.34}
        worldDistanceThreshold={1}
        worldDistanceFalloff={0.25}
        worldProximityThreshold={0.45}
        worldProximityFalloff={0.2}
        color={new THREE.Color('#201a15')}
      />

      <Bloom
        intensity={0.12}
        luminanceThreshold={0.95}
        luminanceSmoothing={0.32}
        mipmapBlur
        radius={0.55}
      />

      <BrightnessContrast brightness={0.015} contrast={0.05} />

      <Vignette
        offset={0.24}
        darkness={0.24}
        blendFunction={BlendFunction.NORMAL}
      />

      <SMAA preset={SMAAPreset.HIGH} />
    </EffectComposer>
  )
}
