import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ChevronRight,
  Dumbbell,
  Play,
  TimerReset,
} from "lucide-react";
import { getPlanMetrics, type WorkoutBlock, type WorkoutPlan } from "../data";
import { countLabel } from "../lib/format";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

type PlanPageProps = {
  plan: WorkoutPlan;
  onStart: (blocks: WorkoutBlock[], title: string) => void;
};

export function PlanPage({ plan, onStart }: PlanPageProps) {
  const [openBlock, setOpenBlock] = useState("");
  const metrics = getPlanMetrics(plan);
  return (
    <div className="screen plan-screen">
      <p className="eyebrow">YOUR PROGRAM</p>
      <h1>
        The flow,
        <br />
        mapped out.
      </h1>
      <p className="lead">
        {plan.name} · scheduled {plan.workoutDays.length}
        {plan.optionalWorkoutDays?.length
          ? `–${plan.workoutDays.length + plan.optionalWorkoutDays.length}`
          : ""}{" "}
        {plan.workoutDays.length === 1 && !plan.optionalWorkoutDays?.length
          ? "day"
          : "days"}{" "}
        each week.
      </p>
      <div className="plan-summary">
        <span>
          <TimerReset /> {countLabel(metrics.minutes, "min")}
        </span>
        <span>
          <Activity /> {countLabel(metrics.sets, "set")}
        </span>
        <span>
          <Dumbbell /> {countLabel(metrics.blocks, "section")}
        </span>
      </div>
      <div className="block-list">
        {plan.blocks.map((block) => {
          const open = block.id === openBlock;
          return (
            <motion.div
              layout
              key={block.id}
              transition={{ layout: { duration: 0.002 } }}
            >
              <Card className={open ? "block-card open" : "block-card"}>
                <div className="block-card-header">
                  <Button
                    variant="ghost"
                    className="block-toggle"
                    onClick={() => setOpenBlock(open ? "" : block.id)}
                  >
                    <span className="block-number">{block.shortName}</span>
                    <span>
                      <b>{block.name}</b>
                      <small>
                        {countLabel(block.exercises.length, "workout")}
                      </small>
                    </span>
                    <ChevronRight />
                  </Button>
                  <Button
                    size="icon"
                    className="scope-start"
                    onClick={() =>
                      onStart([block], `${plan.name} · ${block.name}`)
                    }
                    aria-label={`Start ${block.name}`}
                  >
                    <Play fill="currentColor" />
                  </Button>
                </div>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      className="exercise-list"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.002 }}
                    >
                      {block.exercises.map((exercise) => (
                        <div key={exercise.id}>
                          <span className="exercise-icon">
                            <Dumbbell />
                          </span>
                          <span className="exercise-details">
                            <b>{exercise.name}</b>
                            <small>
                              {countLabel(exercise.sets, "set")} ·{" "}
                              {exercise.type === "timed"
                                ? `${exercise.durationSeconds}s`
                                : exercise.reps}
                            </small>
                          </span>
                          <Button
                            size="icon"
                            className="exercise-start"
                            onClick={() =>
                              onStart(
                                [{ ...block, exercises: [exercise] }],
                                `${exercise.name} · ${block.name}`,
                              )
                            }
                            aria-label={`Start ${exercise.name}`}
                          >
                            <Play fill="currentColor" />
                          </Button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
      <Button
        className="floating-start"
        onClick={() => onStart(plan.blocks, plan.name)}
      >
        <Play fill="currentColor" /> Begin this flow
      </Button>
    </div>
  );
}
