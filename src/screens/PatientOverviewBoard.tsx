import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import {
  dataLimitedPatients,
  getWard,
  hasOpenPrompt,
  matchesQuery,
  rankedPatients,
} from '../data/feed'
import { useClock } from '../hooks/useClock'
import { cn } from '../lib/cn'
import { pluralise } from '../lib/format'
import { DataLimitedRow } from '../components/board/DataLimitedRow'
import { InputStatusPanel } from '../components/board/InputStatusPanel'
import { PatientRow } from '../components/board/PatientRow'
import { SelectedPatientPanel } from '../components/board/SelectedPatientPanel'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Panel } from '../components/ui/Panel'

type Filter = 'all' | 'awaiting' | 'limited'

const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'awaiting', label: 'Awaiting review' },
  { key: 'limited', label: 'Data-limited' },
]

export function PatientOverviewBoard() {
  const now = useClock()
  const ward = getWard()

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedId, setSelectedId] = useState(ward[0].patient_id)

  const visible = useMemo(
    () => ward.filter((assessment) => matchesQuery(assessment, query)),
    [ward, query],
  )

  const ranked = rankedPatients(visible)
  const limited = dataLimitedPatients(visible)
  const awaitingCount = ward.filter(hasOpenPrompt).length

  const showRanked = filter !== 'limited' && ranked.length > 0
  const showLimited = filter !== 'awaiting' && limited.length > 0
  const rankedRows = filter === 'awaiting' ? ranked.filter(hasOpenPrompt) : ranked

  const selected = ward.find((assessment) => assessment.patient_id === selectedId) ?? ward[0]

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Patient overview</Eyebrow>
          <h1 className="mt-1.5 text-xl font-semibold tracking-[-0.015em] text-ink-950">
            Adult ventilated ICU patients
          </h1>
        </div>
        <p className="max-w-md text-2xs leading-relaxed text-ink-500">
          A prompt is raised only when a band change is sustained and confirmed — roughly one
          in every 34 readings. A patient held at HIGH for six hours is one interruption, not
          seventy.
        </p>
      </div>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <section className="flex min-w-0 flex-1 flex-col gap-3">
          <Panel className="flex flex-wrap items-center gap-3 p-2.5">
            <label className="flex min-w-[14rem] flex-1 items-center gap-2 rounded-[2px] border border-rule bg-surface-sunken px-2.5">
              <Search size={13} strokeWidth={2} className="shrink-0 text-ink-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search bed or patient ID"
                className="w-full bg-transparent py-2 font-mono text-2xs text-ink-950 outline-none placeholder:text-ink-400"
              />
            </label>

            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setFilter(option.key)}
                  className={cn(
                    'rounded-[2px] border px-2.5 py-1.5 text-2xs font-medium transition-colors',
                    filter === option.key
                      ? 'border-ink-950 bg-ink-950 text-surface'
                      : 'border-rule bg-surface text-ink-700 hover:border-rule-strong',
                  )}
                >
                  {option.label}
                  {option.key === 'awaiting' && awaitingCount > 0 && (
                    <span className="ml-1.5 font-mono tabular-nums opacity-70">
                      {awaitingCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Panel>

          {showRanked && (
            <div>
              <Eyebrow
                className="mb-2 px-1"
                trailing={`${pluralise(rankedRows.length, 'patient')} · prompt first, then band`}
              >
                Triage board · ranked
              </Eyebrow>
              <Panel className="overflow-hidden">
                {rankedRows.map((assessment) => (
                  <PatientRow
                    key={assessment.patient_id}
                    assessment={assessment}
                    selected={assessment.patient_id === selectedId}
                    onSelect={() => setSelectedId(assessment.patient_id)}
                    now={now}
                  />
                ))}
              </Panel>
            </div>
          )}

          {showLimited && (
            <div className="mt-1">
              <Eyebrow
                className="mb-2 px-1"
                trailing={`${pluralise(limited.length, 'patient')} below the sufficiency floor`}
              >
                Data-limited · not ranked
              </Eyebrow>
              <Panel dashed sunken className="overflow-hidden">
                {limited.map((assessment) => (
                  <DataLimitedRow
                    key={assessment.patient_id}
                    assessment={assessment}
                    selected={assessment.patient_id === selectedId}
                    onSelect={() => setSelectedId(assessment.patient_id)}
                    now={now}
                  />
                ))}
              </Panel>
            </div>
          )}

          {rankedRows.length === 0 && limited.length === 0 && (
            <Panel dashed sunken className="px-4 py-10 text-center">
              <p className="text-2xs text-ink-500">
                {query
                  ? `No patient matches “${query}” in this filter.`
                  : 'No patient in this filter.'}
              </p>
            </Panel>
          )}
        </section>

        <aside className="flex w-full shrink-0 flex-col gap-4 xl:w-[23rem]">
          <SelectedPatientPanel assessment={selected} now={now} />
          <InputStatusPanel devices={selected.devices} />
        </aside>
      </div>
    </div>
  )
}
