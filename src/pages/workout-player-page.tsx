import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  CircleStop,
  Dumbbell,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  Wind,
} from "lucide-react";
import type { WorkoutBlock, WorkoutPlan } from "../data";
import type { Session, SessionScope } from "../types";
import { buildSteps, formatTime } from "../player";
import { isoDate } from "../lib/format";
import { playCue } from "../lib/audio";
import { Button } from "../components/ui/button";
import {
  calculateSessionOutcome,
  countExerciseSets,
} from "../lib/session-rules";
import {
  recoverActiveWorkout,
} from "../lib/active-workout";
import {
  saveActiveWorkout,
  type ActiveWorkoutState,
} from "../lib/storage";
import { useScreenWakeLock } from "../hooks/use-screen-wake-lock";

type WorkoutPlayerPageProps = {
  plan: WorkoutPlan;
  blocks: WorkoutBlock[];
  sessionTitle: string;
  scope: SessionScope;
  resumeState: ActiveWorkoutState;
  onExit: () => void;
  onSave: (session: Session) => void;
};

export function WorkoutPlayerPage({
  plan,
  blocks,
  sessionTitle,
  scope,
  resumeState,
  onExit,
  onSave,
}: WorkoutPlayerPageProps) {
  const steps = useMemo(() => buildSteps(blocks), [blocks]);
  const fullPlanSets = useMemo(
    () => countExerciseSets(plan.blocks),
    [plan.blocks],
  );
  const scopedSets = useMemo(() => countExerciseSets(blocks), [blocks]);
  const restored = useRef(recoverActiveWorkout(resumeState, steps)).current;
  const [index, setIndex] = useState(restored.index);
  const [running, setRunning] = useState(restored.running);
  const [remaining, setRemaining] = useState(restored.remainingSeconds);
  const [confirmStop, setConfirmStop] = useState(false);
  const startedAt = useRef(restored.startedAtMs);
  const deadline = useRef(restored.deadlineMs);
  const lastTick = useRef<number | null>(null);
  const advancing = useRef(false);
  const step = steps[index];

  useScreenWakeLock();

  const finish = useCallback(
    (status: "completed" | "partial") => {
      if (status === "completed") playCue("finish");
      const completedSets = steps
        .slice(0, index)
        .filter((candidate) => candidate.kind === "exercise").length;
      const { completionRatio, qualifiesForStreak } = calculateSessionOutcome({
        scope,
        status,
        completedSets,
        scopedSets,
        fullPlanSets,
      });
      onSave({
        id: crypto.randomUUID(),
        planId: plan.id,
        date: isoDate(),
        title: sessionTitle,
        durationSeconds: Math.max(
          1,
          Math.round((Date.now() - startedAt.current) / 1000),
        ),
        status,
        scope,
        completionRatio,
        qualifiesForStreak,
      });
    },
    [
      fullPlanSets,
      index,
      onSave,
      plan.id,
      scope,
      scopedSets,
      sessionTitle,
      steps,
    ],
  );

  const advance = useCallback(() => {
    if (advancing.current) return;
    advancing.current = true;
    if (index >= steps.length - 1) {
      finish("completed");
      return;
    }
    const next = steps[index + 1];
    setIndex(index + 1);
    setRemaining(next.seconds);
    setRunning(true);
    lastTick.current = null;
    deadline.current =
      next.mode === "timed" ? Date.now() + next.seconds * 1000 : 0;
    playCue(next.kind === "rest" ? "rest" : "start");
  }, [finish, index, steps]);

  useEffect(() => {
    advancing.current = false;
  }, [step.id]);
  useEffect(() => {
    if (!running || step.mode !== "timed") return;
    const update = () => {
      const nextRemaining = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setRemaining(nextRemaining);
      if (
        nextRemaining <= 3 &&
        nextRemaining > 0 &&
        lastTick.current !== nextRemaining
      ) {
        lastTick.current = nextRemaining;
        playCue("tick");
      }
      if (nextRemaining === 0) advance();
    };
    update();
    const timer = window.setInterval(update, 50);
    return () => window.clearInterval(timer);
  }, [advance, running, step.mode]);

  useEffect(() => {
    saveActiveWorkout({
      ...resumeState,
      index,
      running,
      remainingSeconds: remaining,
      deadlineMs: deadline.current,
      startedAtMs: startedAt.current,
    });
  }, [index, remaining, resumeState, running]);

  const togglePause = () => {
    if (step.mode !== "timed") return;
    if (running) {
      setRemaining(
        Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)),
      );
      setRunning(false);
    } else {
      deadline.current = Date.now() + remaining * 1000;
      setRunning(true);
    }
  };
  const progress =
    ((index +
      (step.mode === "timed" && step.seconds
        ? 1 - remaining / step.seconds
        : 0)) /
      steps.length) *
    100;
  const nextStep = steps[index + 1];

  return (
    <div className={running ? "player" : "player paused"}>
      <header className="player-header">
        <Button variant="ghost" onClick={() => setConfirmStop(true)}>
          <ArrowLeft /> Exit
        </Button>
        <span>{Math.round(progress)}% complete</span>
        <Button
          variant="ghost"
          className="sound-button"
          aria-label="Audio cues on"
        >
          <Volume2 />
        </Button>
      </header>
      <div className="overall-progress">
        <span style={{ width: `${progress}%` }} />
      </div>
      <main className="player-main">
        <div className="player-status">
          <span>
            {step.kind === "rest" ? "RECOVER" : step.blockName.toUpperCase()}
          </span>
          <i />
          <span>
            SET {step.set} OF {step.totalSets}
          </span>
        </div>
        <div
          className={
            step.kind === "rest" ? "motion-orbit rest" : "motion-orbit"
          }
        >
          <div>{step.kind === "rest" ? <Wind /> : <Dumbbell />}</div>
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
        </div>
        <div className="player-copy">
          <p>
            {step.kind === "rest"
              ? `Up next · ${nextStep?.exerciseName ?? "Finish"}`
              : step.blockName}
          </p>
          <h1>
            {step.kind === "rest" ? "Catch your breath" : step.exerciseName}
          </h1>
          <div
            className="target"
            role={step.mode === "timed" ? "timer" : undefined}
            aria-live="off"
            aria-label={
              step.mode === "timed"
                ? `${remaining} seconds remaining`
                : step.reps
            }
          >
            {step.mode === "timed" ? formatTime(remaining) : step.reps}
          </div>
          {step.note && step.kind === "exercise" && (
            <p className="coach-note">{step.note}</p>
          )}
        </div>
        <div className="player-actions">
          {step.mode === "reps" ? (
            <Button className="primary-action" onClick={advance}>
              <Check /> Complete set
            </Button>
          ) : (
            <Button className="round-control" onClick={togglePause}>
              {running ? (
                <Pause fill="currentColor" />
              ) : (
                <Play fill="currentColor" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            className="stop-control"
            onClick={() => setConfirmStop(true)}
          >
            <CircleStop /> End workout
          </Button>
        </div>
        <div className="up-next">
          <span className="up-next-icon">
            {nextStep?.kind === "rest" ? <Wind /> : <RotateCcw />}
          </span>
          <span>
            <small>UP NEXT</small>
            <b>
              {nextStep
                ? nextStep.kind === "rest"
                  ? `${nextStep.seconds}s rest`
                  : nextStep.exerciseName
                : "Flow complete"}
            </b>
          </span>
          <span>
            {nextStep?.kind === "exercise" ? `Set ${nextStep.set}` : ""}
          </span>
        </div>
      </main>
      {!running && step.mode === "timed" && (
        <div className="pause-label">PAUSED</div>
      )}
      {confirmStop && (
        <div className="modal-backdrop">
          <div className="stop-modal">
            <span className="modal-icon">
              <CircleStop />
            </span>
            <p className="eyebrow">END THIS WORKOUT FLOW?</p>
            <h2>Save your progress?</h2>
            <p>
              You’ve completed {Math.round(progress)}% of this workout. Partial
              sessions still count as showing up.
            </p>
            <Button className="start-button" onClick={() => finish("partial")}>
              Save partial session
            </Button>
            <Button
              variant="outline"
              className="secondary-button"
              onClick={() => setConfirmStop(false)}
            >
              Keep moving
            </Button>
            <Button variant="ghost" className="text-button" onClick={onExit}>
              Discard session
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
