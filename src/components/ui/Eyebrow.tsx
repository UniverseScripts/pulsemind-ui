import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface EyebrowProps {
  children: ReactNode
  className?: string
  /** Optional count or note shown to the right, on the same baseline. */
  trailing?: ReactNode
}

/**
 * A region label. Used only where a section genuinely begins — it marks structure,
 * so scattering it across a screen would make it mean nothing.
 */
export function Eyebrow({ children, className, trailing }: EyebrowProps) {
  if (!trailing) {
    return <p className={cn('eyebrow', className)}>{children}</p>
  }

  return (
    <div className={cn('flex flex-wrap items-baseline justify-between gap-x-3', className)}>
      <p className="eyebrow shrink-0">{children}</p>
      {/* min-w-0 matters: without it this refuses to shrink below its content width and
          pushes the whole page wider than a narrow viewport. */}
      <p className="min-w-0 font-mono text-2xs text-ink-400">{trailing}</p>
    </div>
  )
}
