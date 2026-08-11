import { useMemo, useState } from "react";
import {
  createEmptyExercise,
  createEmptyPlan,
  getPlanMetrics,
  type Exercise,
  type WorkoutBlock,
  type WorkoutPlan,
} from "../../data";

type UsePlanEditorOptions = {
  initialPlan?: WorkoutPlan;
  onSave: (plan: WorkoutPlan, activate: boolean) => void;
};

export function numericFieldKey(
  field: "sets" | "duration" | "rest",
  blockId: string,
  exerciseId: string,
) {
  return `${field}-${blockId}-${exerciseId}`;
}

export function usePlanEditor({ initialPlan, onSave }: UsePlanEditorOptions) {
  const [draft, setDraft] = useState<WorkoutPlan>(() =>
    initialPlan ? structuredClone(initialPlan) : createEmptyPlan(),
  );
  const [error, setError] = useState("");
  const [numberInputs, setNumberInputs] = useState<Record<string, string>>({});
  const metrics = useMemo(() => getPlanMetrics(draft), [draft]);

  const clearError = () => setError("");
  const setName = (name: string) => {
    clearError();
    setDraft((current) => ({ ...current, name }));
  };

  const toggleDay = (day: number) => {
    clearError();
    setDraft((current) => {
      const required = current.workoutDays.includes(day);
      const optional = current.optionalWorkoutDays?.includes(day) ?? false;
      if (required)
        return {
          ...current,
          workoutDays: current.workoutDays.filter((value) => value !== day),
          optionalWorkoutDays: [...(current.optionalWorkoutDays ?? []), day],
        };
      if (optional)
        return {
          ...current,
          optionalWorkoutDays: (current.optionalWorkoutDays ?? []).filter(
            (value) => value !== day,
          ),
        };
      return { ...current, workoutDays: [...current.workoutDays, day] };
    });
  };

  const updateBlock = (
    blockId: string,
    updater: (block: WorkoutBlock) => WorkoutBlock,
  ) => {
    clearError();
    setDraft((current) => ({
      ...current,
      blocks: current.blocks.map((block) =>
        block.id === blockId ? updater(block) : block,
      ),
    }));
  };

  const updateExercise = (
    blockId: string,
    exerciseId: string,
    patch: Partial<Exercise>,
  ) =>
    updateBlock(blockId, (block) => ({
      ...block,
      exercises: block.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, ...patch } : exercise,
      ),
    }));

  const numberValue = (key: string, fallback: number) =>
    numberInputs[key] ?? String(fallback);
  const updateNumber = (
    key: string,
    value: string,
    commit: (value: number) => void,
  ) => {
    clearError();
    setNumberInputs((current) => ({ ...current, [key]: value }));
    if (value !== "") commit(Number(value));
  };

  const addSection = () => {
    clearError();
    setDraft((current) => ({
      ...current,
      blocks: [
        ...current.blocks,
        {
          id: crypto.randomUUID(),
          name: "",
          shortName: String(current.blocks.length + 1).padStart(2, "0"),
          exercises: [createEmptyExercise()],
        },
      ],
    }));
  };

  const deleteSection = (blockId: string) => {
    clearError();
    setDraft((current) => ({
      ...current,
      blocks: current.blocks
        .filter((block) => block.id !== blockId)
        .map((block, index) => ({
          ...block,
          shortName: String(index + 1).padStart(2, "0"),
        })),
    }));
  };

  const addExercise = (blockId: string) =>
    updateBlock(blockId, (block) => ({
      ...block,
      exercises: [...block.exercises, createEmptyExercise()],
    }));
  const deleteExercise = (blockId: string, exerciseId: string) =>
    updateBlock(blockId, (block) => ({
      ...block,
      exercises: block.exercises.filter(
        (exercise) => exercise.id !== exerciseId,
      ),
    }));

  const submit = (activate: boolean) => {
    if (Object.values(numberInputs).some((value) => value === "")) {
      setError("Complete all number fields before saving.");
      return;
    }
    if (!draft.name.trim()) {
      setError("Give your plan a name.");
      return;
    }
    if (draft.workoutDays.length === 0) {
      setError("Choose at least one workout day.");
      return;
    }
    if (
      draft.blocks.length === 0 ||
      draft.blocks.some((block) => block.exercises.length === 0)
    ) {
      setError("Each plan needs at least one section with a workout.");
      return;
    }
    if (
      draft.blocks.some((block) =>
        block.exercises.some((exercise) => !exercise.name.trim()),
      )
    ) {
      setError("Every workout needs a name.");
      return;
    }

    onSave(
      {
        ...draft,
        name: draft.name.trim(),
        updatedAt: new Date().toISOString(),
        blocks: draft.blocks.map((block, index) => ({
          ...block,
          name: block.name.trim() || `Section ${index + 1}`,
          shortName: String(index + 1).padStart(2, "0"),
        })),
      },
      activate,
    );
  };

  return {
    draft,
    error,
    metrics,
    setName,
    toggleDay,
    updateBlock,
    updateExercise,
    numberValue,
    updateNumber,
    addSection,
    deleteSection,
    addExercise,
    deleteExercise,
    submit,
  };
}

export type PlanEditorController = ReturnType<typeof usePlanEditor>;
