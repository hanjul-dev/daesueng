import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-[color:var(--theme-accent)] bg-[color:var(--theme-accent)] text-[color:var(--theme-foreground-inverse)] hover:border-[color:var(--theme-accent-soft)] hover:bg-[color:var(--theme-accent-soft)]',
        outline:
          'border-[color:var(--theme-border)] bg-[color:var(--theme-panel-strong)] text-[color:var(--theme-foreground)] hover:bg-white',
        secondary:
          'border-transparent bg-[color:var(--theme-accent-muted)] text-[color:var(--theme-foreground)] hover:bg-zinc-200',
        ghost:
          'border-transparent bg-transparent text-[color:var(--theme-muted-foreground)] hover:bg-[color:var(--theme-accent-muted)] hover:text-[color:var(--theme-foreground)]',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({ className, variant, size, ...props }) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { Button }
