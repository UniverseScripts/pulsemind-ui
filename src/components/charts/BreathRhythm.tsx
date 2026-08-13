import { useState } from 'react'
import { Play } from 'lucide-react'
import type { Assessment, RiskBand } from '../../types/clinical'
import { cn } from '../../lib/cn'

interface BreathRhythmProps {
  assessment: Assessment
  /** Published band, or null for a reading below the sufficiency floor. */
  band: RiskBand | null
}

/** Bars in the track. Enough to read as a rhythm, few enough to stay quiet. */
const BAR_COUNT = 9
/** How many breaths one press plays. */
const CYCLES = 6

/** Peak height of the breath, as a fraction of the track. Amplitude is the band channel. */
const PEAK: Record<RiskBand, number> = {
  LOW: 0.45,
  MEDIUM: 0.62,
  HIGH: 0.8,
  CRITICAL: 1,
}

function respiratoryRate(assessment: Assessment): number | null {
  const reading = assessment.parameters.find(
    (parameter) => parameter.parameter_name === 'respiratory_rate_total',
  )
  return reading?.value ?? null
}

/**
 * The patient's ventilation, as motion.
 *
 * Period comes from the charted respiratory rate. Amplitude comes from the band. That
 * split is deliberate and it is the whole safety argument: IEC 60601-1-8 specifies alarm
 * indicators by flash frequency — 1.4–2.8 Hz high priority, 0.4–0.8 Hz medium — so
 * frequency is the channel that carries alarm priority. Here frequency is set by the
 * patient's physiology and never by severity. Amplitude, which the standard is silent
 * on, is what varies with band.
 *
 * The effect the viewer sees is still "faster when sicker", because respiratory rate
 * genuinely tracks band in ventilated patients — but it is true rather than encoded.
 *
 * Four further properties, and it should not ship without any of them:
 *
 *   - It never auto-starts. Six cycles on a press, then it stops. WCAG 2.2.2 therefore
 *     never attaches, so no pause control is needed — which matters, because a pause
 *     control is one of the behaviours that would make this read as an alarm.
 *   - Bounded fill in a fixed track, never a growing glyph. Looming motion captures
 *     attention involuntarily; a bar filling inside a fixed frame does not.
 *   - Continuous, 100% duty, no off phase. A flashing indicator is a two-state square
 *     wave at 20–60% duty; 100% duty is the standard's non-flashing row.
 *   - It supplements the numeral beside it and never replaces it.
 *
 * Under a reduced-motion preference the global rule freezes the animation on its first
 * frame, which is why 0% is the correct resting state.
 */
export function BreathRhythm({ assessment, band }: BreathRhythmProps) {
  const [run, setRun] = useState(0)
  const rate = respiratoryRate(assessment)

  if (rate === null) {
    return null
  }

  const periodSeconds = 60 / rate
  const peak = band ? PEAK[band] : 0.3

  return (
    <div className="flex items-end gap-3">
      {/* Achromatic on purpose. The band is already stated three times on this screen,
          and colouring a moving element with the severity hue is the one combination
          that would read as an alarm indicator. Amplitude carries the band here. */}
      <div
        className="flex h-9 items-end gap-[3px] border-b border-rule-strong pb-px text-ink-700"
        aria-hidden="true"
        onAnimationEnd={() => setRun(0)}
      >
        {Array.from({ length: BAR_COUNT }, (_, index) => (
          <span
            key={`${run}-${index}`}
            className={cn('block w-[3px] origin-bottom rounded-[1px] bg-current')}
            style={{
              height: '100%',
              transform: 'scaleY(0.22)',
              // Each bar lags the one before it, so the breath reads as a wave
              // travelling across the track rather than nine bars blinking together.
              animation:
                run === 0
                  ? undefined
                  : `pm-breath ${periodSeconds}s ease-in-out ${(index * periodSeconds) / (BAR_COUNT * 2.4)}s ${CYCLES}`,
              ['--breath-peak' as string]: peak,
            }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setRun((current) => current + 1)}
        className="mb-0.5 inline-flex items-center gap-1.5 rounded-[2px] border border-rule-strong px-2 py-1 text-2xs text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950"
      >
        <Play size={10} strokeWidth={2.5} />
        {run === 0 ? 'Play rhythm' : 'Again'}
      </button>
    </div>
  )
}
