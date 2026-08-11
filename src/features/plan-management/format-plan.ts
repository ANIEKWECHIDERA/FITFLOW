import type { WorkoutPlan } from "../../data";

export function scheduleLabel(plan: WorkoutPlan) {
  const minimum = plan.workoutDays.length;
  const maximum = minimum + (plan.optionalWorkoutDays?.length ?? 0);
  return `${minimum}${maximum > minimum ? `–${maximum}` : ""} ${maximum === 1 ? "day" : "days"} / week`;
}
