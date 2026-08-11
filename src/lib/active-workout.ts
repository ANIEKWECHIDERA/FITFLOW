import type { WorkoutBlock } from "../data";
import { buildSteps, type Step } from "../player";
import type { SessionScope } from "../types";
import type { ActiveWorkoutState } from "./storage";

export function createActiveWorkout(
  planId: string,
  blocks: WorkoutBlock[],
  title: string,
  scope: SessionScope,
  now = Date.now(),
): ActiveWorkoutState {
  const firstStep = buildSteps(blocks)[0];
  return {
    version: 1,
    planId,
    blocks,
    title,
    scope,
    index: 0,
    running: true,
    remainingSeconds: firstStep?.seconds ?? 0,
    deadlineMs:
      firstStep?.mode === "timed" ? now + firstStep.seconds * 1000 : 0,
    startedAtMs: now,
  };
}

export function recoverActiveWorkout(
  state: ActiveWorkoutState,
  steps: Step[],
  now = Date.now(),
): ActiveWorkoutState {
  if (!steps.length) return state;

  let index = Math.min(Math.max(0, state.index), steps.length - 1);
  let deadlineMs = state.deadlineMs;
  const current = steps[index];

  if (!state.running || current.mode !== "timed") {
    return {
      ...state,
      index,
      remainingSeconds: Math.max(0, state.remainingSeconds),
      deadlineMs: current.mode === "timed" ? deadlineMs : 0,
    };
  }

  if (deadlineMs <= 0)
    deadlineMs = now + Math.max(0, state.remainingSeconds) * 1000;

  while (deadlineMs <= now && index < steps.length - 1) {
    index += 1;
    const next = steps[index];
    if (next.mode !== "timed") {
      return {
        ...state,
        index,
        remainingSeconds: next.seconds,
        deadlineMs: 0,
      };
    }
    deadlineMs += next.seconds * 1000;
  }

  return {
    ...state,
    index,
    remainingSeconds: Math.max(0, Math.ceil((deadlineMs - now) / 1000)),
    deadlineMs,
  };
}
