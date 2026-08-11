import { Check, Save } from "lucide-react";
import { Button } from "../../../components/ui/button";

export function EditorActions({
  onSave,
}: {
  onSave: (activate: boolean) => void;
}) {
  return (
    <div className="editor-save-actions">
      <Button
        variant="outline"
        className="editor-save secondary-save"
        onClick={() => onSave(false)}
      >
        <Save /> Save plan
      </Button>
      <Button className="editor-save" onClick={() => onSave(true)}>
        <Check /> Save & load plan
      </Button>
    </div>
  );
}
