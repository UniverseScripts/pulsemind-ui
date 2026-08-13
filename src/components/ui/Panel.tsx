import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface PanelProps {
  children: ReactNode
  className?: string
  /** A recessed surface, for empty states and secondary regions. */
  sunken?: boolean
  /** A dashed edge, used only where data is absent rather than merely quiet. */
  dashed?: boolean
}

/**
 * A ruled container. Hairline border, near-square corners, no shadow — depth is
 * carried by background value, which costs no pixels and does not imply elevation
 * that isn't there.
 */
export function Panel({ children, className, sunken = false, dashed = false }: PanelProps) {
  return (
    <div
      className={cn(
        'rounded-[3px] border',
        dashed ? 'border-dashed border-rule-strong' : 'border-rule',
        sunken ? 'bg-surface-sunken' : 'bg-surface',
        className,
      )}
    >
      {children}
    </div>
  )
}
