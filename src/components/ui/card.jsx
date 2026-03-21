import { cn } from '../../lib/utils'

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-[color:var(--theme-border)] bg-[color:var(--theme-panel)] shadow-[var(--theme-shadow-card)] backdrop-blur-xl',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col gap-2 p-6', className)} {...props} />
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn(
        'text-[28px] font-semibold tracking-[-0.03em] text-[color:var(--theme-foreground)]',
        className,
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn('text-sm leading-7 text-[color:var(--theme-muted-foreground)]', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return <div className={cn('px-6 pb-6', className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
