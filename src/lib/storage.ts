import { defaultPlan, type WorkoutBlock, type WorkoutPlan } from "../data";
import type { Session, SessionScope } from "../types";

export type ActiveWorkoutState = {
  version: 1;
  planId: string;
  blocks: WorkoutBlock[];
  title: string;
  scope: SessionScope;
  index: number;
  running: boolean;
  remainingSeconds: number;
  deadlineMs: number;
  startedAtMs: number;
};

export const STORAGE_KEYS = {
  sessions: "fitflow.sessions.v1",
  plans: "fitflow.plans.v1",
  activePlan: "fitflow.active-plan.v1",
  activeWorkout: "fitflow.active-workout.v1",
  requestedPlan: "fitflow.requested-plan.full-upper-core.v1",
} as const;

export function loadActiveWorkout(): ActiveWorkoutState | null {
  try {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.activeWorkout) ?? "null",
    ) as Partial<ActiveWorkoutState> | null;
    if (
      !stored ||
      stored.version !== 1 ||
      typeof stored.planId !== "string" ||
      !Array.isArray(stored.blocks) ||
      typeof stored.title !== "string" ||
      !["plan", "section", "exercise"].includes(stored.scope ?? "") ||
      typeof stored.index !== "number" ||
      typeof stored.running !== "boolean" ||
      typeof stored.remainingSeconds !== "number" ||
      typeof stored.deadlineMs !== "number" ||
      typeof stored.startedAtMs !== "number"
    )
      return null;
    return stored as ActiveWorkoutState;
  } catch {
    return null;
  }
}

export function saveActiveWorkout(state: ActiveWorkoutState) {
  localStorage.setItem(STORAGE_KEYS.activeWorkout, JSON.stringify(state));
}

export function clearActiveWorkout() {
  localStorage.removeItem(STORAGE_KEYS.activeWorkout);
}

export function loadSessions(): Session[] {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEYS.sessions) ?? "[]",
    ) as Session[];
  } catch {
    return [];
  }
}

export function loadPlans(): WorkoutPlan[] {
  try {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.plans) ?? "[]",
    ) as WorkoutPlan[];
    if (!stored.length) return [defaultPlan];
    return stored.some((plan) => plan.id === defaultPlan.id)
      ? stored
      : [defaultPlan, ...stored];
  } catch {
    return [defaultPlan];
  }
}
