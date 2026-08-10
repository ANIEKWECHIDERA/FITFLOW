import type { WorkoutBlock } from './data'

export type Step = {
  id: string
  blockId: string
  blockName: string
  exerciseName: string
  note?: string
  set: number
  totalSets: number
  kind: 'exercise' | 'rest'
  mode: 'timed' | 'reps'
  seconds: number
  reps?: string
}

export function buildSteps(blocks: WorkoutBlock[]): Step[] {
  const steps: Step[] = []
  blocks.forEach((block) => {
    block.exercises.forEach((exercise) => {
      for (let set = 1; set <= exercise.sets; set += 1) {
        steps.push({
          id: `${exercise.id}-${set}`,
          blockId: block.id,
          blockName: block.name,
          exerciseName: exercise.name,
          note: exercise.note,
          set,
          totalSets: exercise.sets,
          kind: 'exercise',
          mode: exercise.type,
          seconds: exercise.durationSeconds ?? 0,
          reps: exercise.reps,
        })
        const isFinalSet = set === exercise.sets
        if (exercise.restSeconds > 0 && !isFinalSet) {
          steps.push({
            id: `${exercise.id}-${set}-rest`,
            blockId: block.id,
            blockName: block.name,
            exerciseName: exercise.name,
            set,
            totalSets: exercise.sets,
            kind: 'rest',
            mode: 'timed',
            seconds: exercise.restSeconds,
          })
        }
      }
    })
  })
  return steps
}

export function formatTime(seconds: number) {
  const safe = Math.max(0, seconds)
  const minutes = Math.floor(safe / 60)
  return `${minutes}:${String(safe % 60).padStart(2, '0')}`
}
