import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Dumbbell,
  Edit3,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  createEmptyExercise,
  createEmptyPlan,
  DAY_OPTIONS,
  getPlanMetrics,
  type Exercise,
  type WorkoutPlan,
} from "./data";

type EditorProps = {
  initialPlan?: WorkoutPlan;
  onCancel: () => void;
  onSave: (plan: WorkoutPlan, activate: boolean) => void;
};

const countLabel = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;
const scheduleLabel = (plan: WorkoutPlan) => {
  const minimum = plan.workoutDays.length;
  const maximum = minimum + (plan.optionalWorkoutDays?.length ?? 0);
  return `${minimum}${maximum > minimum ? `–${maximum}` : ""} ${maximum === 1 ? "day" : "days"} / week`;
};

export function PlanEditor({ initialPlan, onCancel, onSave }: EditorProps) {
  const [draft, setDraft] = useState<WorkoutPlan>(() =>
    initialPlan ? structuredClone(initialPlan) : createEmptyPlan(),
  );
  const [error, setError] = useState("");
  const [numberInputs, setNumberInputs] = useState<Record<string, string>>({});
  const metrics = useMemo(() => getPlanMetrics(draft), [draft]);

  const updateBlock = (
    blockId: string,
    updater: (
      block: WorkoutPlan["blocks"][number],
    ) => WorkoutPlan["blocks"][number],
  ) => {
    setError("");
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
  ) => {
    setError("");
    updateBlock(blockId, (block) => ({
      ...block,
      exercises: block.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, ...patch } : exercise,
      ),
    }));
  };

  const numberValue = (key: string, fallback: number) =>
    numberInputs[key] ?? String(fallback);
  const updateNumber = (
    key: string,
    value: string,
    commit: (value: number) => void,
  ) => {
    setError("");
    setNumberInputs((current) => ({ ...current, [key]: value }));
    if (value !== "") commit(Number(value));
  };

  const addSection = () =>
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

  const deleteSection = (blockId: string) =>
    setDraft((current) => ({
      ...current,
      blocks: current.blocks
        .filter((block) => block.id !== blockId)
        .map((block, index) => ({
          ...block,
          shortName: String(index + 1).padStart(2, "0"),
        })),
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
    const normalized = {
      ...draft,
      name: draft.name.trim(),
      updatedAt: new Date().toISOString(),
      blocks: draft.blocks.map((block, index) => ({
        ...block,
        name: block.name.trim() || `Section ${index + 1}`,
        shortName: String(index + 1).padStart(2, "0"),
      })),
    };
    onSave(normalized, activate);
  };

  return (
    <div className="management-page editor-page">
      <header className="management-header">
        <button onClick={onCancel}>
          <ArrowLeft />
        </button>
        <div>
          <span className="mini-label">
            {initialPlan ? "EDIT PLAN" : "NEW PLAN"}
          </span>
          <h1>{initialPlan ? "Refine your flow" : "Build your flow"}</h1>
        </div>
        <button
          className="save-icon"
          onClick={() => submit(false)}
          aria-label="Save plan"
        >
          <Save />
        </button>
      </header>
      <main>
        <section className="form-card plan-basics">
          <label className="field">
            <span>Plan name</span>
            <input
              autoFocus
              placeholder="e.g. Full body strength"
              value={draft.name}
              onChange={(event) => {
                setError("");
                setDraft({ ...draft, name: event.target.value });
              }}
            />
          </label>
          <div className="field">
            <span>
              Workout days <i>tap twice to make optional</i>
            </span>
            <div className="day-picker">
              {DAY_OPTIONS.map((day) => {
                const selected = draft.workoutDays.includes(day.value);
                const optional =
                  draft.optionalWorkoutDays?.includes(day.value) ?? false;
                return (
                  <button
                    type="button"
                    className={
                      selected ? "selected" : optional ? "optional" : ""
                    }
                    key={day.value}
                    onClick={() => {
                      setError("");
                      setDraft((current) => {
                        if (selected)
                          return {
                            ...current,
                            workoutDays: current.workoutDays.filter(
                              (value) => value !== day.value,
                            ),
                            optionalWorkoutDays: [
                              ...(current.optionalWorkoutDays ?? []),
                              day.value,
                            ],
                          };
                        if (optional)
                          return {
                            ...current,
                            optionalWorkoutDays: (
                              current.optionalWorkoutDays ?? []
                            ).filter((value) => value !== day.value),
                          };
                        return {
                          ...current,
                          workoutDays: [...current.workoutDays, day.value],
                        };
                      });
                    }}
                  >
                    <b>{day.short}</b>
                    <small>{optional ? "Opt" : day.name.slice(0, 3)}</small>
                  </button>
                );
              })}
            </div>
            <div className="day-legend">
              <span>
                <i className="required-dot" /> Streak day
              </span>
              <span>
                <i className="optional-dot" /> Optional
              </span>
            </div>
          </div>
          <div className="live-metrics">
            <span>
              <Clock3 />
              <b>{metrics.minutes}</b>
              <small>estimated {metrics.minutes === 1 ? "min" : "mins"}</small>
            </span>
            <span>
              <Dumbbell />
              <b>{metrics.sets}</b>
              <small>total {metrics.sets === 1 ? "set" : "sets"}</small>
            </span>
            <span>
              <Copy />
              <b>{metrics.blocks}</b>
              <small>{metrics.blocks === 1 ? "section" : "sections"}</small>
            </span>
          </div>
        </section>

        <div className="editor-sections">
          <AnimatePresence initial={false}>
            {draft.blocks.map((block, blockIndex) => (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.002 }}
                className="form-card section-editor"
                key={block.id}
              >
                <div className="section-editor-head">
                  <span className="section-count">
                    {String(blockIndex + 1).padStart(2, "0")}
                  </span>
                  <label className="field">
                    <span>
                      Section name <i>optional</i>
                    </span>
                    <input
                      placeholder={`Section ${blockIndex + 1}`}
                      value={block.name}
                      onChange={(event) =>
                        updateBlock(block.id, (current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <button
                    className="icon-danger"
                    onClick={() => deleteSection(block.id)}
                    aria-label="Delete section"
                  >
                    <Trash2 />
                  </button>
                </div>
                <div className="workout-editors">
                  {block.exercises.map((exercise, exerciseIndex) => (
                    <div className="workout-editor" key={exercise.id}>
                      <div className="workout-editor-title">
                        <span>WORKOUT {exerciseIndex + 1}</span>
                        <button
                          onClick={() =>
                            updateBlock(block.id, (current) => ({
                              ...current,
                              exercises: current.exercises.filter(
                                (item) => item.id !== exercise.id,
                              ),
                            }))
                          }
                          aria-label="Delete workout"
                        >
                          <X />
                        </button>
                      </div>
                      <label className="field">
                        <span>Workout name</span>
                        <input
                          placeholder="e.g. Push-ups"
                          value={exercise.name}
                          onChange={(event) =>
                            updateExercise(block.id, exercise.id, {
                              name: event.target.value,
                            })
                          }
                        />
                      </label>
                      <div className="form-grid two">
                        <label className="field">
                          <span>Workout type</span>
                          <select
                            value={exercise.type}
                            onChange={(event) =>
                              updateExercise(block.id, exercise.id, {
                                type: event.target.value as Exercise["type"],
                              })
                            }
                          >
                            <option value="reps">Reps</option>
                            <option value="timed">Timed</option>
                          </select>
                        </label>
                        <label className="field">
                          <span>Sets</span>
                          <input
                            type="number"
                            min="1"
                            value={numberValue(
                              `sets-${block.id}-${exercise.id}`,
                              exercise.sets,
                            )}
                            onChange={(event) =>
                              updateNumber(
                                `sets-${block.id}-${exercise.id}`,
                                event.target.value,
                                (value) =>
                                  updateExercise(block.id, exercise.id, {
                                    sets: Math.max(1, value),
                                  }),
                              )
                            }
                          />
                        </label>
                        <label className="field">
                          <span>
                            {exercise.type === "reps"
                              ? "Reps per set"
                              : "Target label"}
                          </span>
                          <input
                            placeholder={
                              exercise.type === "reps"
                                ? "e.g. 10–12"
                                : "Optional"
                            }
                            value={exercise.reps ?? ""}
                            onChange={(event) =>
                              updateExercise(block.id, exercise.id, {
                                reps: event.target.value,
                              })
                            }
                          />
                        </label>
                        <label className="field">
                          <span>
                            Work duration <i>seconds</i>
                          </span>
                          <input
                            type="number"
                            min="1"
                            value={numberValue(
                              `duration-${block.id}-${exercise.id}`,
                              exercise.durationSeconds ?? 45,
                            )}
                            onChange={(event) =>
                              updateNumber(
                                `duration-${block.id}-${exercise.id}`,
                                event.target.value,
                                (value) =>
                                  updateExercise(block.id, exercise.id, {
                                    durationSeconds: Math.max(1, value),
                                  }),
                              )
                            }
                          />
                        </label>
                        <label className="field">
                          <span>
                            Rest duration <i>seconds</i>
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={numberValue(
                              `rest-${block.id}-${exercise.id}`,
                              exercise.restSeconds,
                            )}
                            onChange={(event) =>
                              updateNumber(
                                `rest-${block.id}-${exercise.id}`,
                                event.target.value,
                                (value) =>
                                  updateExercise(block.id, exercise.id, {
                                    restSeconds: Math.max(0, value),
                                  }),
                              )
                            }
                          />
                        </label>
                        <label className="field">
                          <span>
                            Coach note <i>optional</i>
                          </span>
                          <input
                            placeholder="Form cue or reminder"
                            value={exercise.note ?? ""}
                            onChange={(event) =>
                              updateExercise(block.id, exercise.id, {
                                note: event.target.value,
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="add-inline"
                  onClick={() =>
                    updateBlock(block.id, (current) => ({
                      ...current,
                      exercises: [...current.exercises, createEmptyExercise()],
                    }))
                  }
                >
                  <Plus /> Add workout
                </button>
              </motion.section>
            ))}
          </AnimatePresence>
        </div>
        <button className="add-section-button" onClick={addSection}>
          <Plus /> Add section
        </button>
        {error && <p className="form-error">{error}</p>}
        <div className="editor-save-actions">
          <button
            className="editor-save secondary-save"
            onClick={() => submit(false)}
          >
            <Save /> Save plan
          </button>
          <button className="editor-save" onClick={() => submit(true)}>
            <Check /> Save & load plan
          </button>
        </div>
      </main>
    </div>
  );
}

type LibraryProps = {
  plans: WorkoutPlan[];
  activePlanId: string;
  onBack: () => void;
  onLoad: (id: string) => void;
  onEdit: (plan: WorkoutPlan) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
};

export function PlanLibrary({
  plans,
  activePlanId,
  onBack,
  onLoad,
  onEdit,
  onDelete,
  onNew,
}: LibraryProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  return (
    <div className="management-page library-page">
      <header className="management-header">
        <button onClick={onBack}>
          <ArrowLeft />
        </button>
        <div>
          <span className="mini-label">YOUR LIBRARY</span>
          <h1>Manage plans</h1>
        </div>
        <button className="save-icon" onClick={onNew} aria-label="New plan">
          <Plus />
        </button>
      </header>
      <main>
        <p className="library-intro">
          Choose the plan you want to follow, or update the details as your
          routine evolves.
        </p>
        <div className="library-list">
          {plans.map((plan) => {
            const metrics = getPlanMetrics(plan);
            const active = plan.id === activePlanId;
            return (
              <motion.article
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.002 }}
                className={active ? "library-card active" : "library-card"}
                key={plan.id}
              >
                <div className="library-card-top">
                  <span className="library-icon">
                    <Dumbbell />
                  </span>
                  <span>
                    <small>
                      {active
                        ? "ACTIVE PLAN"
                        : scheduleLabel(plan).toUpperCase()}
                    </small>
                    <h2>{plan.name}</h2>
                  </span>
                  {active && (
                    <span className="active-check">
                      <Check />
                    </span>
                  )}
                </div>
                <div className="library-metrics">
                  <span>{countLabel(metrics.minutes, "min")}</span>
                  <i />
                  <span>{countLabel(metrics.sets, "set")}</span>
                  <i />
                  <span>{countLabel(metrics.blocks, "section")}</span>
                </div>
                <div className="library-actions">
                  <button onClick={() => onEdit(plan)}>
                    <Edit3 /> Edit
                  </button>
                  <button
                    className="delete-plan"
                    disabled={plans.length === 1}
                    onClick={() => setDeleteId(plan.id)}
                  >
                    <Trash2 /> Delete
                  </button>
                  <button
                    className="load-plan"
                    disabled={active}
                    onClick={() => onLoad(plan.id)}
                  >
                    Load plan <ChevronRight />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
        <button className="add-section-button" onClick={onNew}>
          <Plus /> Create new plan
        </button>
      </main>
      {deleteId && (
        <div className="modal-backdrop">
          <div className="stop-modal">
            <span className="modal-icon">
              <Trash2 />
            </span>
            <p className="eyebrow">DELETE PLAN?</p>
            <h2>This can’t be undone.</h2>
            <p>
              Your workout history will stay, but this plan and its workout
              setup will be removed.
            </p>
            <button
              className="delete-confirm-button"
              onClick={() => {
                onDelete(deleteId);
                setDeleteId(null);
              }}
            >
              Delete plan
            </button>
            <button
              className="secondary-button"
              onClick={() => setDeleteId(null)}
            >
              Keep plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
