/**
 * The standing disclaimer. Sticky, so it cannot be scrolled away from any screen.
 */
export function SafetyFooter() {
  return (
    <footer className="sticky bottom-0 z-10 border-t border-rule bg-surface">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2 sm:px-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-ink-400">
          Read-only
        </span>
        <p className="min-w-0 flex-1 text-2xs text-ink-500">
          PulseMind reads from the ventilator and monitor. It does not diagnose, recommend
          treatment, change ventilator settings, or act without a clinician. The clinical
          decision remains with qualified staff.
        </p>
        <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.07em] text-ink-400 lg:inline">
          Simulated data · not a real patient
        </span>
      </div>
    </footer>
  )
}
