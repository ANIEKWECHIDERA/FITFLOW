import type { getPlanMetrics, WorkoutPlan } from "../../data";

export type ReturnTypeOfPlanMetrics = ReturnType<typeof getPlanMetrics>;

export type PlanEditorPageProps = {
  initialPlan?: WorkoutPlan;
  onCancel: () => void;
  onSave: (plan: WorkoutPlan, activate: boolean) => void;
};

export type PlanLibraryPageProps = {
  plans: WorkoutPlan[];
  activePlanId: string;
  onBack: () => void;
  onLoad: (id: string) => void;
  onEdit: (plan: WorkoutPlan) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
};
