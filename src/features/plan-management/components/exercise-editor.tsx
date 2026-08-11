import { X } from "lucide-react";
import type { Exercise } from "../../../data";
import type { PlanEditorController } from "../use-plan-editor";
import { numericFieldKey } from "../use-plan-editor";
import { Button } from "../../../components/ui/button";

type ExerciseEditorProps = {
  blockId: string;
  exercise: Exercise;
  index: number;
  editor: PlanEditorController;
};

export function ExerciseEditor({
  blockId,
  exercise,
  index,
  editor,
}: ExerciseEditorProps) {
  const { updateExercise, deleteExercise, numberValue, updateNumber } = editor;
  const setsKey = numericFieldKey("sets", blockId, exercise.id);
  const durationKey = numericFieldKey("duration", blockId, exercise.id);
  const restKey = numericFieldKey("rest", blockId, exercise.id);

  return (
    <div className="workout-editor">
      <div className="workout-editor-title">
        <span>WORKOUT {index + 1}</span>
        <Button
          variant="ghost"
          onClick={() => deleteExercise(blockId, exercise.id)}
          aria-label="Delete workout"
        >
          <X />
        </Button>
      </div>
      <label className="field">
        <span>Workout name</span>
        <input
          placeholder="e.g. Push-ups"
          value={exercise.name}
          onChange={(event) =>
            updateExercise(blockId, exercise.id, { name: event.target.value })
          }
        />
      </label>
      <div className="form-grid two">
        <label className="field">
          <span>Workout type</span>
          <select
            value={exercise.type}
            onChange={(event) =>
              updateExercise(blockId, exercise.id, {
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
            value={numberValue(setsKey, exercise.sets)}
            onChange={(event) =>
              updateNumber(setsKey, event.target.value, (value) =>
                updateExercise(blockId, exercise.id, {
                  sets: Math.max(1, value),
                }),
              )
            }
          />
        </label>
        <label className="field">
          <span>
            {exercise.type === "reps" ? "Reps per set" : "Target label"}
          </span>
          <input
            placeholder={exercise.type === "reps" ? "e.g. 10–12" : "Optional"}
            value={exercise.reps ?? ""}
            onChange={(event) =>
              updateExercise(blockId, exercise.id, { reps: event.target.value })
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
            value={numberValue(durationKey, exercise.durationSeconds ?? 45)}
            onChange={(event) =>
              updateNumber(durationKey, event.target.value, (value) =>
                updateExercise(blockId, exercise.id, {
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
            value={numberValue(restKey, exercise.restSeconds)}
            onChange={(event) =>
              updateNumber(restKey, event.target.value, (value) =>
                updateExercise(blockId, exercise.id, {
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
              updateExercise(blockId, exercise.id, { note: event.target.value })
            }
          />
        </label>
      </div>
    </div>
  );
}
