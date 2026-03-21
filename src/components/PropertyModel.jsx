import { Suspense } from 'react'
import useAppStore from '../store/useAppStore'
import ImportedModel from './ImportedModel'

export default function PropertyModel() {
  const modelTransform = useAppStore((state) => state.modelTransform)

  return (
    <Suspense fallback={null}>
      <ImportedModel
        position={[
          modelTransform.positionX,
          modelTransform.positionY,
          modelTransform.positionZ,
        ]}
        scale={modelTransform.scale}
      />
    </Suspense>
  )
}
