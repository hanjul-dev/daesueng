import { PROPERTY_MEDIA_ASSETS } from '../../content/propertyMediaAssets'
import { cn } from '../../lib/utils'
import { Badge } from '../ui/badge'

export default function PropertyShot({ tone, eyebrow, title, description, className }) {
  const photoAsset = PROPERTY_MEDIA_ASSETS[tone]
  const isPrimaryPhoto = tone === 'hero'

  return (
    <article
      className={cn(
        'photo-surface min-h-[280px] sm:min-h-[320px] lg:min-h-[360px] 2xl:min-h-[400px]',
        `photo-surface--${tone}`,
        className,
      )}
    >
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
            sizes={
              isPrimaryPhoto
                ? '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 56vw'
                : '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 28vw'
            }
          />
          <div className="photo-surface__overlay" />
        </>
      )}
      <div className="photo-surface__grain" />

      <div className="photo-surface__content">
        <div className="photo-surface__copy space-y-3">
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
