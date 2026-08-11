import { DAY_OPTIONS } from "../../../data";
import type { PlanEditorController } from "../use-plan-editor";
import { PlanMetrics } from "./plan-metrics";
import { Card } from "../../../components/ui/card";

export function PlanBasicsForm({ editor }: { editor: PlanEditorController }) {
  const { draft, metrics, setName, toggleDay } = editor;
  return (
    <Card className="form-card plan-basics">
      <label className="field">
        <span>Plan name</span>
        <input
          autoFocus
          placeholder="e.g. Full body strength"
          value={draft.name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <div className="field">
        <span>
          Workout days <i>tap twice to make optional</i>
        </span>
        <div className="day-picker">
          {DAY_OPTIONS.map((day) => {
            const required = draft.workoutDays.includes(day.value);
            const optional =
              draft.optionalWorkoutDays?.includes(day.value) ?? false;
            return (
              <button
                type="button"
                className={required ? "selected" : optional ? "optional" : ""}
                key={day.value}
                onClick={() => toggleDay(day.value)}
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
      <PlanMetrics metrics={metrics} />
    </Card>
  );
}
