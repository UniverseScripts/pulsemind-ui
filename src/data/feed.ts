/**
 * The single boundary between the screens and wherever patient data comes from.
 *
 * Today it reads the simulated ward in `mockFeed.ts`. When a real transport is agreed,
 * only this file changes — no component imports `mockFeed` directly.
 */

import type {
  Assessment,
  ParameterHistoryPoint,
  ParameterName,
  PatientContext,
  RefusedAssessment,
  ScoredAssessment,
} from '../types/clinical'
import { isScored } from '../types/clinical'
import { bandRank } from './bands'
import { parameterHistory, scoreHistory, type ScoreObservation } from './history'
import { PATIENT_CONTEXT, WARD } from './mockFeed'

export function getWard(): Assessment[] {
  return WARD
}

export function getAssessment(patientId: string): Assessment | undefined {
  return WARD.find((assessment) => assessment.patient_id === patientId)
}

export function getPatientContext(patientId: string): PatientContext | undefined {
  return PATIENT_CONTEXT[patientId]
}

/**
 * Patients that produced a score, ordered for triage: an open prompt first, then by
 * published band, then by score. The published band is used as given — never re-derived.
 */
export function rankedPatients(ward: Assessment[]): ScoredAssessment[] {
  return ward
    .filter(isScored)
    .slice()
    .sort((a, b) => {
      const promptDifference = Number(hasOpenPrompt(b)) - Number(hasOpenPrompt(a))
      if (promptDifference !== 0) {
        return promptDifference
      }
      const bandDifference = bandRank(b.risk_level) - bandRank(a.risk_level)
      if (bandDifference !== 0) {
        return bandDifference
      }
      return b.risk_score - a.risk_score
    })
}

/**
 * Patients whose latest reading fell below the data-sufficiency floor. They are listed
 * separately and never ranked, so a refusal cannot be read as a low score.
 */
export function dataLimitedPatients(ward: Assessment[]): RefusedAssessment[] {
  return ward.filter((assessment): assessment is RefusedAssessment => !isScored(assessment))
}

export function hasOpenPrompt(assessment: Assessment): boolean {
  return isScored(assessment) && assessment.prompt?.status === 'open'
}

/** Recent assessments for one patient, as independent observations. */
export function getScoreHistory(assessment: ScoredAssessment, now: Date): ScoreObservation[] {
  return scoreHistory(assessment.patient_id, assessment.risk_score, now)
}

/** Charting history for one parameter, carrying provenance per point. */
export function getParameterHistory(
  assessment: Assessment,
  parameterName: ParameterName,
  now: Date,
): ParameterHistoryPoint[] {
  const reading = assessment.parameters.find(
    (parameter) => parameter.parameter_name === parameterName,
  )
  return parameterHistory(
    assessment.patient_id,
    parameterName,
    reading?.value ?? null,
    reading?.source ?? 'cohort_default',
    now,
  )
}

/** Search by patient ID or bed code, matching the board's search field. */
export function matchesQuery(assessment: Assessment, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (needle === '') {
    return true
  }
  return (
    assessment.patient_id.toLowerCase().includes(needle) ||
    assessment.bed_code.toLowerCase().includes(needle)
  )
}

export type { ScoreObservation }
