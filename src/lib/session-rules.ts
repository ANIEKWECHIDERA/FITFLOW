import type { WorkoutBlock, WorkoutPlan } from '../data'
import type { Session } from '../types'
import type { SessionScope } from '../types'
import { isoDate } from './format'

export const STREAK_COMPLETION_THRESHOLD = 0.5

export function countExerciseSets(blocks: WorkoutBlock[]) {
  return blocks.reduce((total, block) => total + block.exercises.reduce((blockTotal, exercise) => blockTotal + exercise.sets, 0), 0)
}

export function calculateSessionOutcome({ scope, status, completedSets, scopedSets, fullPlanSets }: {
  scope: SessionScope
  status: 'completed' | 'partial'
  completedSets: number
  scopedSets: number
  fullPlanSets: number
}) {
  const creditedSets = status === 'completed' ? scopedSets : completedSets
  const completionRatio = fullPlanSets === 0 ? 0 : Math.min(1, creditedSets / fullPlanSets)
  return {
    completionRatio,
    qualifiesForStreak: scope === 'plan' && completionRatio >= STREAK_COMPLETION_THRESHOLD,
  }
}

export function qualifiesForStreak(session: Session, plan: WorkoutPlan) {
  if (typeof session.qualifiesForStreak === 'boolean') return session.qualifiesForStreak

  // Legacy full-plan titles match the plan name. Scoped titles include section
  // or exercise context, so historical scoped sessions remain non-qualifying.
  return session.status === 'completed' && !session.scope && session.title === plan.name
}

export function calculateCurrentStreak({ workoutDays, qualifyingDates, skippedDates, today = new Date() }: {
  workoutDays: number[]
  qualifyingDates: Set<string>
  skippedDates: Set<string>
  today?: Date
}) {
  let streak = 0
  const cursor = new Date(today)
  for (let index = 0; index < 60; index += 1) {
    if (!workoutDays.includes(cursor.getDay())) { cursor.setDate(cursor.getDate() - 1); continue }
    const cursorDate = isoDate(cursor)
    if (qualifyingDates.has(cursorDate)) { streak += 1; cursor.setDate(cursor.getDate() - 1); continue }
    if (cursorDate === isoDate(today) && !skippedDates.has(cursorDate)) { cursor.setDate(cursor.getDate() - 1); continue }
    break
  }
  return streak
}
