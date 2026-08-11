import { motion } from "motion/react";
import { Check, ChevronRight, Dumbbell, Edit3, Trash2 } from "lucide-react";
import { getPlanMetrics, type WorkoutPlan } from "../../../data";
import { countLabel } from "../../../lib/format";
import { scheduleLabel } from "../format-plan";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

type PlanLibraryCardProps = {
  plan: WorkoutPlan;
  active: boolean;
  canDelete: boolean;
  onLoad: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function PlanLibraryCard({
  plan,
  active,
  canDelete,
  onLoad,
  onEdit,
  onDelete,
}: PlanLibraryCardProps) {
  const metrics = getPlanMetrics(plan);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.002 }}
    >
      <Card className={active ? "library-card active" : "library-card"}>
        <div className="library-card-top">
          <span className="library-icon">
            <Dumbbell />
          </span>
          <span>
            <small>
              {active ? "ACTIVE PLAN" : scheduleLabel(plan).toUpperCase()}
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
          <Button variant="ghost" onClick={onEdit}>
            <Edit3 /> Edit
          </Button>
          <Button
            variant="ghost"
            className="delete-plan"
            disabled={!canDelete}
            onClick={onDelete}
          >
            <Trash2 /> Delete
          </Button>
          <Button className="load-plan" disabled={active} onClick={onLoad}>
            Load plan <ChevronRight />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
