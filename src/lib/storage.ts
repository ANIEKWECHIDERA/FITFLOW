import { defaultPlan, type WorkoutPlan } from "../data";
import type { Session } from "../types";

export const STORAGE_KEYS = {
  sessions: "fitflow.sessions.v1",
  plans: "fitflow.plans.v1",
  activePlan: "fitflow.active-plan.v1",
  requestedPlan: "fitflow.requested-plan.full-upper-core.v1",
} as const;

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
