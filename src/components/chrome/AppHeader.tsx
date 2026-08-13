import { Link } from 'react-router'
import { Moon, Sun } from 'lucide-react'
import { useClock } from '../../hooks/useClock'
import { useTheme } from '../../hooks/useTheme'
import { formatClock, formatDate } from '../../lib/format'

/**
 * The persistent chrome.
 *
 * Two things here are load-bearing rather than decorative. The status indicator does
 * not pulse: a flashing indicator is the defining visual signature of an alarm signal,
 * and PulseMind raises no alarms. And the categorical label is permanent, so the
 * product cannot be seen — or screenshotted — without it.
 */
export function AppHeader() {
  const now = useClock()
  const [theme, toggleTheme] = useTheme()

  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-surface">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-1.5 px-4 py-2.5 sm:px-6">
        {/* Full width on a phone so the brand and the categorical label get their own
            line, rather than being squeezed into the clock and overlapping it. */}
        <div className="flex w-full min-w-0 items-center justify-between gap-3 sm:w-auto sm:flex-1 sm:justify-start">
          <Link to="/" className="shrink-0 text-base font-bold tracking-[-0.01em] text-ink-950">
            PulseMind
          </Link>
          {/* Never hidden, at any width. This is the label that stops the product being
              read as an alarm system, so it shortens rather than disappearing. */}
          <span className="shrink-0 rounded-[2px] border border-rule bg-surface-sunken px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
            <span className="hidden sm:inline">Decision support · </span>Not an alarm
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <span className="h-[6px] w-[6px] rounded-full bg-verified" aria-hidden="true" />
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-500 sm:inline">
            Receiving
          </span>
          <span className="font-mono text-lg tabular-nums leading-none text-ink-950">
            {formatClock(now)}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-4">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.06em] text-ink-400 lg:inline">
            {formatDate(now)} · device local time
          </span>
          <span className="hidden shrink-0 text-2xs text-ink-500 md:inline">ICU Clinician</span>
          <button
            type="button"
            onClick={toggleTheme}
            className="shrink-0 rounded-[2px] border border-rule p-1.5 text-ink-500 transition-colors hover:border-rule-strong hover:text-ink-950"
            aria-label={theme === 'day' ? 'Switch to night shift theme' : 'Switch to day theme'}
            title={theme === 'day' ? 'Night shift' : 'Day'}
          >
            {theme === 'day' ? <Moon size={13} strokeWidth={2} /> : <Sun size={13} strokeWidth={2} />}
          </button>
        </div>
      </div>
    </header>
  )
}
