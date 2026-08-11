import { Clock3, Copy, Dumbbell } from "lucide-react";
import type { ReturnTypeOfPlanMetrics } from "../types";

export function PlanMetrics({ metrics }: { metrics: ReturnTypeOfPlanMetrics }) {
  return (
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
  );
}
