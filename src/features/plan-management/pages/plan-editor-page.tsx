import { AnimatePresence } from "motion/react";
import { Plus, Save } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { EditorActions } from "../components/editor-actions";
import { ManagementHeader } from "../components/management-header";
import { PlanBasicsForm } from "../components/plan-basics-form";
import { SectionEditor } from "../components/section-editor";
import type { PlanEditorPageProps } from "../types";
import { usePlanEditor } from "../use-plan-editor";

export function PlanEditorPage({
  initialPlan,
  onCancel,
  onSave,
}: PlanEditorPageProps) {
  const editor = usePlanEditor({ initialPlan, onSave });
  return (
    <div className="management-page editor-page">
      <ManagementHeader
        eyebrow={initialPlan ? "EDIT PLAN" : "NEW PLAN"}
        title={
          initialPlan ? "Refine your workout flow" : "Build your workout flow"
        }
        onBack={onCancel}
        action={
          <Button
            className="save-icon"
            size="icon"
            onClick={() => editor.submit(false)}
            aria-label="Save plan"
          >
            <Save />
          </Button>
        }
      />
      <main>
        <PlanBasicsForm editor={editor} />
        <div className="editor-sections">
          <AnimatePresence initial={false}>
            {editor.draft.blocks.map((block, index) => (
              <SectionEditor
                block={block}
                index={index}
                editor={editor}
                key={block.id}
              />
            ))}
          </AnimatePresence>
        </div>
        <Button
          variant="outline"
          className="add-section-button"
          onClick={editor.addSection}
        >
          <Plus /> Add section
        </Button>
        {editor.error && <p className="form-error">{editor.error}</p>}
        <EditorActions onSave={editor.submit} />
      </main>
    </div>
  );
}
