import { Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";

type DeletePlanDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeletePlanDialog({
  open,
  onConfirm,
  onCancel,
}: DeletePlanDialogProps) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="stop-modal">
        <span className="modal-icon">
          <Trash2 />
        </span>
        <p className="eyebrow">DELETE PLAN?</p>
        <h2>This can’t be undone.</h2>
        <p>
          Your workout history will stay, but this plan and its workout setup
          will be removed.
        </p>
        <Button
          variant="danger"
          className="delete-confirm-button"
          onClick={onConfirm}
        >
          Delete plan
        </Button>
        <Button
          variant="outline"
          className="secondary-button"
          onClick={onCancel}
        >
          Keep plan
        </Button>
      </div>
    </div>
  );
}
