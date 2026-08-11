import { motion } from "motion/react";
import { Plus, Trash2 } from "lucide-react";
import type { WorkoutBlock } from "../../../data";
import type { PlanEditorController } from "../use-plan-editor";
import { ExerciseEditor } from "./exercise-editor";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

type SectionEditorProps = {
  block: WorkoutBlock;
  index: number;
  editor: PlanEditorController;
};

export function SectionEditor({ block, index, editor }: SectionEditorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.002 }}
    >
      <Card className="form-card section-editor">
        <div className="section-editor-head">
          <span className="section-count">
            {String(index + 1).padStart(2, "0")}
          </span>
          <label className="field">
            <span>
              Section name <i>optional</i>
            </span>
            <input
              placeholder={`Section ${index + 1}`}
              value={block.name}
              onChange={(event) =>
                editor.updateBlock(block.id, (current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />
          </label>
          <Button
            variant="ghost"
            className="icon-danger"
            onClick={() => editor.deleteSection(block.id)}
            aria-label="Delete section"
          >
            <Trash2 />
          </Button>
        </div>
        <div className="workout-editors">
          {block.exercises.map((exercise, exerciseIndex) => (
            <ExerciseEditor
              blockId={block.id}
              exercise={exercise}
              index={exerciseIndex}
              editor={editor}
              key={exercise.id}
            />
          ))}
        </div>
        <Button
          variant="outline"
          className="add-inline"
          onClick={() => editor.addExercise(block.id)}
        >
          <Plus /> Add workout
        </Button>
      </Card>
    </motion.div>
  );
}
