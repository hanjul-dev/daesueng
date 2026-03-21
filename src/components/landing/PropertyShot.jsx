import { PROPERTY_MEDIA_ASSETS } from '../../content/propertyMediaAssets'
import { cn } from '../../lib/utils'
import { Badge } from '../ui/badge'

export default function PropertyShot({ tone, eyebrow, title, description, className }) {
  const photoAsset = PROPERTY_MEDIA_ASSETS[tone]
  const isPrimaryPhoto = tone === 'hero'

  return (
    <article className={cn('photo-surface', `photo-surface--${tone}`, className)}>
      {photoAsset && (
        <>
          <img
            src={photoAsset.src}
            alt={title}
            className="photo-surface__image"
            style={{ objectPosition: photoAsset.position }}
            loading={isPrimaryPhoto ? 'eager' : 'lazy'}
            fetchPriority={isPrimaryPhoto ? 'high' : 'low'}
            decoding="async"
            sizes={isPrimaryPhoto ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 30vw'}
          />
          <div className="photo-surface__overlay" />
        </>
      )}
      <div className="photo-surface__grain" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-10">
        <div className="max-w-[72%] space-y-3">
          <Badge variant="inverse" className="w-fit border-white/15 bg-black/60 text-white">
            {eyebrow}
          </Badge>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[30px]">
              {title}
            </h3>
            <p className="text-sm leading-7 text-white/80 sm:text-[15px]">{description}</p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-medium text-white/86 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-white/70" />
          Real Exterior Photo
        </div>
      </div>
    </article>
  )
}
