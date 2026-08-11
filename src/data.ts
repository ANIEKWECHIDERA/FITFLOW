export type Exercise = {
  id: string
  name: string
  type: 'timed' | 'reps'
  sets: number
  durationSeconds?: number
  reps?: string
  restSeconds: number
  note?: string
}

export type WorkoutBlock = {
  id: string
  name: string
  shortName: string
  exercises: Exercise[]
}

export type WorkoutPlan = {
  id: string
  name: string
  workoutDays: number[]
  blocks: WorkoutBlock[]
  createdAt: string
  updatedAt: string
}

export const workoutBlocks: WorkoutBlock[] = [
  {
    id: 'warmup', name: 'Warm-up', shortName: '01', exercises: [
      { id: 'arm-circles', name: 'Arm circles', type: 'timed', sets: 1, durationSeconds: 30, restSeconds: 5, note: 'Start small, then open the range.' },
      { id: 'walkouts', name: 'Walkouts', type: 'reps', sets: 1, reps: '8 reps', restSeconds: 10, note: 'Keep your hips controlled.' },
      { id: 'scapular-pushups', name: 'Scapular push-ups', type: 'reps', sets: 1, reps: '10 reps', restSeconds: 15, note: 'Move through the shoulders, arms long.' },
    ]
  },
  {
    id: 'main', name: 'Main workout', shortName: '02', exercises: [
      { id: 'pushups', name: 'Push-ups', type: 'reps', sets: 4, reps: '12–20 reps', restSeconds: 75, note: 'Strong plank. Chest leads the movement.' },
      { id: 'pike-pushups', name: 'Pike push-ups', type: 'reps', sets: 3, reps: '8–12 reps', restSeconds: 75, note: 'Head travels forward and down.' },
      { id: 'chair-dips', name: 'Chair dips', type: 'reps', sets: 3, reps: '10–15 reps', restSeconds: 60, note: 'Keep shoulders away from ears.' },
      { id: 'plank-taps', name: 'Plank shoulder taps', type: 'timed', sets: 3, durationSeconds: 40, restSeconds: 45, note: 'Keep your hips quiet.' },
    ]
  },
  {
    id: 'core', name: 'Upper core', shortName: '03', exercises: [
      { id: 'dead-bug', name: 'Dead bug', type: 'timed', sets: 3, durationSeconds: 40, restSeconds: 20, note: 'Press your lower back into the floor.' },
      { id: 'hollow-hold', name: 'Hollow body hold', type: 'timed', sets: 3, durationSeconds: 30, restSeconds: 30, note: 'Scale by bending your knees.' },
      { id: 'plank', name: 'High plank', type: 'timed', sets: 2, durationSeconds: 45, restSeconds: 30, note: 'Push the floor away.' },
    ]
  },
  {
    id: 'finisher', name: 'Finisher', shortName: '04', exercises: [
      { id: 'mountain-climbers', name: 'Mountain climbers', type: 'timed', sets: 3, durationSeconds: 30, restSeconds: 15, note: 'Move fast without losing your shape.' },
    ]
  },
  {
    id: 'cooldown', name: 'Cool-down', shortName: '05', exercises: [
      { id: 'childs-pose', name: "Child's pose", type: 'timed', sets: 1, durationSeconds: 45, restSeconds: 5, note: 'Slow your breathing.' },
      { id: 'chest-stretch', name: 'Chest & shoulder stretch', type: 'timed', sets: 1, durationSeconds: 45, restSeconds: 0, note: 'No forcing—just create space.' },
    ]
  }
]

export const DAY_OPTIONS = [
  { value: 1, name: 'Monday', short: 'M' },
  { value: 2, name: 'Tuesday', short: 'T' },
  { value: 3, name: 'Wednesday', short: 'W' },
  { value: 4, name: 'Thursday', short: 'T' },
  { value: 5, name: 'Friday', short: 'F' },
  { value: 6, name: 'Saturday', short: 'S' },
  { value: 0, name: 'Sunday', short: 'S' },
] as const

const now = new Date().toISOString()

export const defaultPlan: WorkoutPlan = {
  id: 'fitflow-upper-core',
  name: 'Upper body + core',
  workoutDays: [1, 3, 5],
  blocks: workoutBlocks,
  createdAt: now,
  updatedAt: now,
}

export function getPlanMetrics(plan: WorkoutPlan) {
  const sets = plan.blocks.reduce((sum, block) => sum + block.exercises.reduce((count, exercise) => count + exercise.sets, 0), 0)
  const seconds = plan.blocks.reduce((sum, block) => sum + block.exercises.reduce((count, exercise) => {
    const work = (exercise.durationSeconds ?? 45) * exercise.sets
    const rest = exercise.restSeconds * Math.max(0, exercise.sets - 1)
    return count + work + rest
  }, 0), 0)
  return { sets, blocks: plan.blocks.length, seconds, minutes: Math.max(1, Math.ceil(seconds / 60)) }
}

export function createEmptyPlan(): WorkoutPlan {
  const timestamp = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: '',
    workoutDays: [1, 3, 5],
    blocks: [{ id: crypto.randomUUID(), name: '', shortName: '01', exercises: [createEmptyExercise()] }],
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export function createEmptyExercise(): Exercise {
  return { id: crypto.randomUUID(), name: '', type: 'reps', sets: 3, reps: '10', durationSeconds: 45, restSeconds: 60, note: '' }
}
