import { DAY_OPTIONS, getPlanMetrics, type WorkoutPlan } from "../data";
import type { DisplayDay } from "../types";
import { countLabel } from "./format";

export function buildWeek(plan: WorkoutPlan): DisplayDay[] {
  const metrics = getPlanMetrics(plan);
  return DAY_OPTIONS.map((day) => {
    const scheduled = plan.workoutDays.includes(day.value);
    const optional = plan.optionalWorkoutDays?.includes(day.value) ?? false;
    const workoutDay = scheduled || optional;
    return {
      day: day.name,
      short: day.short,
      kind: workoutDay ? "strength" : "rest",
      title: workoutDay ? plan.name : "Rest & recover",
      duration: workoutDay ? countLabel(metrics.minutes, "min") : "—",
      optional,
    };
  });
}
