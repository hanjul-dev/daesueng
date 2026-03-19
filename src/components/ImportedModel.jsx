import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import useAppStore from '../store/useAppStore' // 스토어 임포트 추가

export default function ImportedModel({ url = '/house2-1k.glb' }) {
  const { scene } = useGLTF(url)
  const modelScale = useAppStore(s => s.modelScale) // 전역 스토어에서 스케일 가져오기

  // useEffect에서 재질(Material) 건드리는 로직 완전히 100% 삭제
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          // 오직 그림자 옵션만(캐스트/리시브) 추가하고, 
          // 텍스처, 반사율 등 모든 재질 설정은 원본 GLB 그대로 유지합니다.
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [scene])

  return (
    <primitive 
      object={scene} 
      position={[0, -3.5, 0]} 
      scale={modelScale} 
    />
  )
}

// 모델을 미리 로드하여 성능 확보
useGLTF.preload('/house2-1k.glb')

