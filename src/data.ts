export type Exercise = {
  id: string;
  name: string;
  type: "timed" | "reps";
  sets: number;
  durationSeconds?: number;
  reps?: string;
  restSeconds: number;
  note?: string;
};

export type WorkoutBlock = {
  id: string;
  name: string;
  shortName: string;
  optional?: boolean;
  exercises: Exercise[];
};

export type WorkoutPlan = {
  id: string;
  name: string;
  workoutDays: number[];
  optionalWorkoutDays?: number[];
  blocks: WorkoutBlock[];
  createdAt: string;
  updatedAt: string;
};

export const workoutBlocks: WorkoutBlock[] = [
  {
    id: "warmup",
    name: "Warm-up",
    shortName: "01",
    exercises: [
      {
        id: "arm-circles",
        name: "Arm circles",
        type: "timed",
        sets: 1,
        durationSeconds: 60,
        reps: "30 sec each direction",
        restSeconds: 0,
        note: "30 seconds forward, then 30 seconds backward.",
      },
      {
        id: "jumping-jacks",
        name: "Jumping jacks",
        type: "timed",
        sets: 1,
        durationSeconds: 60,
        reps: "1 minute",
        restSeconds: 0,
      },
      {
        id: "shoulder-rolls",
        name: "Shoulder rolls",
        type: "timed",
        sets: 1,
        durationSeconds: 30,
        reps: "30 seconds",
        restSeconds: 0,
      },
      {
        id: "high-knees",
        name: "High knees",
        type: "timed",
        sets: 1,
        durationSeconds: 60,
        reps: "1 minute",
        restSeconds: 0,
      },
      {
        id: "dynamic-chest-stretch",
        name: "Dynamic chest stretch",
        type: "timed",
        sets: 1,
        durationSeconds: 60,
        reps: "1 minute",
        restSeconds: 0,
      },
      {
        id: "cat-cow-warmup",
        name: "Cat-cow stretch",
        type: "timed",
        sets: 1,
        durationSeconds: 60,
        reps: "1 minute",
        restSeconds: 0,
      },
    ],
  },
  {
    id: "main",
    name: "Main workout",
    shortName: "02",
    exercises: [
      {
        id: "pushups",
        name: "Push-ups",
        type: "reps",
        sets: 4,
        reps: "12–20 reps",
        durationSeconds: 30,
        restSeconds: 75,
        note: "Rest 60–90 seconds between sets.",
      },
      {
        id: "backpack-rows",
        name: "Backpack rows",
        type: "reps",
        sets: 4,
        reps: "10–15 reps",
        durationSeconds: 30,
        restSeconds: 75,
        note: "Use pull-ups instead when a bar is available. Rest 60–90 seconds.",
      },
      {
        id: "pike-pushups",
        name: "Pike push-ups",
        type: "reps",
        sets: 3,
        reps: "8–12 reps",
        durationSeconds: 30,
        restSeconds: 75,
        note: "Rest 60–90 seconds between sets.",
      },
      {
        id: "side-plank",
        name: "Side plank (each side)",
        type: "timed",
        sets: 3,
        reps: "30–45 sec each side",
        durationSeconds: 80,
        restSeconds: 30,
        note: "Hold each side for 30–45 seconds.",
      },
      {
        id: "leg-raises",
        name: "Leg raises",
        type: "reps",
        sets: 3,
        reps: "12–15 reps",
        durationSeconds: 30,
        restSeconds: 50,
        note: "Lower slowly for better control. Rest 45–60 seconds.",
      },
      {
        id: "mountain-climbers-main",
        name: "Mountain climbers",
        type: "timed",
        sets: 3,
        reps: "30–40 seconds",
        durationSeconds: 35,
        restSeconds: 45,
        note: "Keep the core braced and hips controlled.",
      },
    ],
  },
  {
    id: "core",
    name: "Intermediate upper core",
    shortName: "03",
    exercises: [
      {
        id: "crunches",
        name: "Crunches",
        type: "reps",
        sets: 3,
        reps: "20 reps",
        durationSeconds: 30,
        restSeconds: 40,
        note: "Focus on curling the upper trunk, not pulling the neck.",
      },
      {
        id: "toe-touches",
        name: "Toe touches",
        type: "reps",
        sets: 3,
        reps: "15 reps",
        durationSeconds: 30,
        restSeconds: 40,
      },
      {
        id: "reverse-crunches",
        name: "Reverse crunches",
        type: "reps",
        sets: 3,
        reps: "12 reps",
        durationSeconds: 30,
        restSeconds: 40,
      },
      {
        id: "hollow-body-hold",
        name: "Hollow body hold",
        type: "timed",
        sets: 3,
        reps: "20–30 seconds",
        durationSeconds: 25,
        restSeconds: 40,
        note: "Bend the knees to scale while keeping the lower back down.",
      },
    ],
  },
  {
    id: "finisher",
    name: "Finisher (optional)",
    shortName: "04",
    optional: true,
    exercises: [
      {
        id: "finisher-pushups",
        name: "Push-ups",
        type: "reps",
        sets: 3,
        reps: "15 reps",
        durationSeconds: 35,
        restSeconds: 0,
        note: "Complete as a circuit for 3 rounds.",
      },
      {
        id: "finisher-climbers",
        name: "Mountain climbers",
        type: "reps",
        sets: 3,
        reps: "20 each leg",
        durationSeconds: 40,
        restSeconds: 0,
        note: "Continue the circuit without rest.",
      },
      {
        id: "finisher-plank",
        name: "Plank",
        type: "timed",
        sets: 3,
        reps: "30 seconds",
        durationSeconds: 30,
        restSeconds: 30,
        note: "Rest 30 seconds after each round.",
      },
    ],
  },
  {
    id: "cooldown",
    name: "Cool-down",
    shortName: "05",
    exercises: [
      {
        id: "chest-stretch",
        name: "Chest stretch",
        type: "timed",
        sets: 1,
        reps: "20–30 seconds",
        durationSeconds: 25,
        restSeconds: 0,
      },
      {
        id: "shoulder-stretch",
        name: "Shoulder stretch",
        type: "timed",
        sets: 1,
        reps: "20–30 seconds",
        durationSeconds: 25,
        restSeconds: 0,
      },
      {
        id: "triceps-stretch",
        name: "Triceps stretch",
        type: "timed",
        sets: 1,
        reps: "20–30 seconds",
        durationSeconds: 25,
        restSeconds: 0,
      },
      {
        id: "childs-pose",
        name: "Child's pose",
        type: "timed",
        sets: 1,
        reps: "20–30 seconds",
        durationSeconds: 25,
        restSeconds: 0,
      },
      {
        id: "cobra-stretch",
        name: "Cobra stretch",
        type: "timed",
        sets: 1,
        reps: "20–30 seconds",
        durationSeconds: 25,
        restSeconds: 0,
      },
      {
        id: "cat-cow-cooldown",
        name: "Cat-cow stretch",
        type: "timed",
        sets: 1,
        reps: "20–30 seconds",
        durationSeconds: 25,
        restSeconds: 0,
      },
      {
        id: "lat-stretch",
        name: "Lat stretch",
        type: "timed",
        sets: 1,
        reps: "20–30 seconds",
        durationSeconds: 25,
        restSeconds: 0,
      },
      {
        id: "neck-stretch",
        name: "Neck stretch",
        type: "timed",
        sets: 1,
        reps: "20–30 seconds",
        durationSeconds: 25,
        restSeconds: 0,
      },
      {
        id: "walk-cooldown",
        name: "Easy walk",
        type: "timed",
        sets: 1,
        reps: "2 minutes",
        durationSeconds: 120,
        restSeconds: 0,
        note: "Walk around to gradually lower your heart rate.",
      },
    ],
  },
];

export const DAY_OPTIONS = [
  { value: 1, name: "Monday", short: "M" },
  { value: 2, name: "Tuesday", short: "T" },
  { value: 3, name: "Wednesday", short: "W" },
  { value: 4, name: "Thursday", short: "T" },
  { value: 5, name: "Friday", short: "F" },
  { value: 6, name: "Saturday", short: "S" },
  { value: 0, name: "Sunday", short: "S" },
] as const;

const now = new Date().toISOString();

export const defaultPlan: WorkoutPlan = {
  id: "full-upper-body-core-intermediate-v1",
  name: "Full Upper Body + Core Workout (Intermediate)",
  workoutDays: [1, 3],
  optionalWorkoutDays: [5],
  blocks: workoutBlocks,
  createdAt: now,
  updatedAt: now,
};

export function getPlanMetrics(plan: WorkoutPlan) {
  const sets = plan.blocks.reduce(
    (sum, block) =>
      sum +
      block.exercises.reduce((count, exercise) => count + exercise.sets, 0),
    0,
  );
  const seconds = plan.blocks.reduce(
    (sum, block) =>
      block.optional
        ? sum
        : sum +
          block.exercises.reduce((count, exercise) => {
            const work = (exercise.durationSeconds ?? 45) * exercise.sets;
            const rest = exercise.restSeconds * Math.max(0, exercise.sets - 1);
            return count + work + rest;
          }, 0),
    0,
  );
  return {
    sets,
    blocks: plan.blocks.length,
    seconds,
    minutes: Math.max(1, Math.ceil(seconds / 60)),
  };
}

export function createEmptyPlan(): WorkoutPlan {
  const timestamp = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: "",
    workoutDays: [1, 3, 5],
    blocks: [
      {
        id: crypto.randomUUID(),
        name: "",
        shortName: "01",
        exercises: [createEmptyExercise()],
      },
    ],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function createEmptyExercise(): Exercise {
  return {
    id: crypto.randomUUID(),
    name: "",
    type: "reps",
    sets: 3,
    reps: "10",
    durationSeconds: 45,
    restSeconds: 60,
    note: "",
  };
}
