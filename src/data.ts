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

export type DayPlan = { day: string; short: string; kind: 'strength' | 'run' | 'mobility' | 'rest'; title: string; duration: string }

export const week: DayPlan[] = [
  { day: 'Monday', short: 'M', kind: 'strength', title: 'Upper body + core', duration: '42 min' },
  { day: 'Tuesday', short: 'T', kind: 'run', title: 'Easy run', duration: '25 min' },
  { day: 'Wednesday', short: 'W', kind: 'strength', title: 'Upper body + core', duration: '42 min' },
  { day: 'Thursday', short: 'T', kind: 'mobility', title: 'Mobility flow', duration: '20 min' },
  { day: 'Friday', short: 'F', kind: 'strength', title: 'Upper body + core', duration: '42 min' },
  { day: 'Saturday', short: 'S', kind: 'run', title: 'Long run', duration: '45 min' },
  { day: 'Sunday', short: 'S', kind: 'rest', title: 'Rest & recover', duration: '—' },
]

export const totalSets = workoutBlocks.reduce((sum, block) => sum + block.exercises.reduce((n, exercise) => n + exercise.sets, 0), 0)
