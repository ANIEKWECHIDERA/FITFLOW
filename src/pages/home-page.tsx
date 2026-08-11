import { useState } from "react";
import {
  Check,
  ChevronRight,
  CircleStop,
  Clock3,
  Dumbbell,
  Flame,
  Play,
  Sparkles,
} from "lucide-react";
import { getPlanMetrics, type WorkoutPlan } from "../data";
import type { DisplayDay } from "../types";
import { countLabel, isoDate } from "../lib/format";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

type HomePageProps = {
  plan: WorkoutPlan;
  week: DisplayDay[];
  today: DisplayDay;
  streak: number;
  completedDates: Set<string>;
  skippedDates: Set<string>;
  onStart: () => void;
  onSkip: () => void;
};

export function HomePage({
  plan,
  week,
  today,
  streak,
  completedDates,
  skippedDates,
  onStart,
  onSkip,
}: HomePageProps) {
  const [confirmSkip, setConfirmSkip] = useState(false);
  const metrics = getPlanMetrics(plan);
  const dateLabel = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
  const alreadyDone = completedDates.has(isoDate());
  const alreadySkipped = skippedDates.has(isoDate());
  const canPlay = today.kind === "strength";

  return (
    <div className="screen home-screen">
      <section className="welcome">
        <p className="eyebrow">{dateLabel}</p>
        <h1>
          Ready when
          <br />
          you are.
        </h1>
        <p>One session at a time. Keep the flow going.</p>
      </section>
      <Card className="today-card">
        <div className="today-card-head">
          <span className="mini-label">TODAY'S WORKOUT FLOW</span>
          <span className="duration">
            <Clock3 /> {today.duration}
          </span>
        </div>
        <div className="workout-glyph">
          {today.kind === "rest" ? <Sparkles /> : <Dumbbell />}
          <span className="glyph-ring one" />
          <span className="glyph-ring two" />
        </div>
        <div className="workout-copy">
          <span className="workout-kind">
            {today.optional ? "optional workout" : today.kind}
          </span>
          <h2>{today.title}</h2>
          <p>
            {canPlay
              ? `${countLabel(metrics.blocks, "section")} · ${countLabel(metrics.sets, "focused set")}`
              : "Recovery is part of the work."}
          </p>
        </div>
        {alreadyDone ? (
          <Button className="start-button done">
            <Check /> Today’s goal met
          </Button>
        ) : alreadySkipped ? (
          <div className="skipped-message">
            <CircleStop />
            <span>
              <b>Workout skipped</b>
              <small>Be kind to yourself. Tomorrow is a fresh start.</small>
            </span>
          </div>
        ) : canPlay ? (
          <div className="today-actions">
            <Button className="start-button" onClick={onStart}>
              <Play fill="currentColor" /> Start workout <ChevronRight />
            </Button>
            <Button
              variant="ghost"
              className="skip-button"
              onClick={() => setConfirmSkip(true)}
            >
              Skip today
            </Button>
          </div>
        ) : (
          <div className="rest-message">
            Take it easy. Your next workout flow is waiting.
          </div>
        )}
      </Card>
      {confirmSkip && (
        <div className="modal-backdrop">
          <div className="stop-modal">
            <span className="modal-icon">
              <CircleStop />
            </span>
            <p className="eyebrow">SKIP TODAY'S WORKOUT FLOW?</p>
            <h2>Take today off?</h2>
            <p>
              We’ll add this workout to your history as skipped. It won’t count
              toward your streak.
            </p>
            <Button
              className="skip-confirm-button"
              onClick={() => {
                onSkip();
                setConfirmSkip(false);
              }}
            >
              Yes, skip today
            </Button>
            <Button
              variant="outline"
              className="secondary-button"
              onClick={() => setConfirmSkip(false)}
            >
              Go back
            </Button>
          </div>
        </div>
      )}
      <section className="week-section">
        <div className="section-title">
          <div>
            <span className="mini-label">THIS WEEK</span>
            <h3>Your rhythm</h3>
          </div>
          <div className="streak-pill">
            <Flame /> {streak} {streak === 1 ? "day" : "days"} streak
          </div>
        </div>
        <div className="week-strip">
          {week.map((day, index) => {
            const mondayIndex =
              new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
            const cursor = new Date();
            cursor.setDate(cursor.getDate() + index - mondayIndex);
            const complete = completedDates.has(isoDate(cursor));
            return (
              <div
                className={index === mondayIndex ? "day active" : "day"}
                key={day.day}
              >
                <span>{day.short}</span>
                <b>{cursor.getDate()}</b>
                <i
                  className={
                    complete
                      ? "day-dot complete"
                      : day.kind === "rest"
                        ? "day-dot rest"
                        : "day-dot"
                  }
                >
                  {complete && <Check />}
                </i>
              </div>
            );
          })}
        </div>
      </section>
      <blockquote>
        “Motivation gets you started. Flow keeps you moving.”
      </blockquote>
    </div>
  );
}
