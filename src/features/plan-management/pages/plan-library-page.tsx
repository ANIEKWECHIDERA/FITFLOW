import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { DeletePlanDialog } from "../components/delete-plan-dialog";
import { ManagementHeader } from "../components/management-header";
import { PlanLibraryCard } from "../components/plan-library-card";
import type { PlanLibraryPageProps } from "../types";

export function PlanLibraryPage({
  plans,
  activePlanId,
  onBack,
  onLoad,
  onEdit,
  onDelete,
  onNew,
}: PlanLibraryPageProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  return (
    <div className="management-page library-page">
      <ManagementHeader
        eyebrow="YOUR LIBRARY"
        title="Manage plans"
        onBack={onBack}
        action={
          <Button
            className="save-icon"
            size="icon"
            onClick={onNew}
            aria-label="New plan"
          >
            <Plus />
          </Button>
        }
      />
      <main>
        <p className="library-intro">
          Choose the plan you want to follow, or update the details as your
          routine evolves.
        </p>
        <div className="library-list">
          {plans.map((plan) => (
            <PlanLibraryCard
              plan={plan}
              active={plan.id === activePlanId}
              canDelete={plans.length > 1}
              onLoad={() => onLoad(plan.id)}
              onEdit={() => onEdit(plan)}
              onDelete={() => setDeleteId(plan.id)}
              key={plan.id}
            />
          ))}
        </div>
        <Button
          variant="outline"
          className="add-section-button"
          onClick={onNew}
        >
          <Plus /> Create new plan
        </Button>
      </main>
      <DeletePlanDialog
        open={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
