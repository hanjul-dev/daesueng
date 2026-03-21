import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium tracking-tight',
  {
    variants: {
      variant: {
        default:
          'border-[color:var(--theme-border)] bg-[color:var(--theme-panel-strong)] text-[color:var(--theme-muted-foreground)]',
        secondary:
          'border-transparent bg-[color:var(--theme-accent-muted)] text-[color:var(--theme-muted-foreground)]',
        inverse:
          'border-[color:var(--theme-accent)] bg-[color:var(--theme-accent)] text-[color:var(--theme-foreground-inverse)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }
