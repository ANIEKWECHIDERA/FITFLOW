import {
  BarChart3,
  CalendarDays,
  Check,
  CircleStop,
  Clock3,
  Dumbbell,
  Flame,
} from "lucide-react";
import type { WorkoutPlan } from "../data";
import type { Session } from "../types";
import { isoDate } from "../lib/format";
import { Card } from "../components/ui/card";

type ProgressPageProps = {
  plan: WorkoutPlan;
  sessions: Session[];
  streak: number;
  completedDates: Set<string>;
};

export function ProgressPage({
  plan,
  sessions,
  streak,
  completedDates,
}: ProgressPageProps) {
  const totalMinutes = Math.round(
    sessions.reduce((sum, item) => sum + item.durationSeconds, 0) / 60,
  );
  const completedCount = sessions.filter(
    (session) => session.status === "completed",
  ).length;
  const days = Array.from({ length: 28 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - 27 + index);
    return date;
  });
  return (
    <div className="screen progress-screen">
      <p className="eyebrow">YOUR PROGRESS</p>
      <h1>
        Consistency,
        <br />
        made visible.
      </h1>
      <p className="progress-plan-name">{plan.name}</p>
      <div className="stats-grid">
        <Card className="stat dark">
          <Flame />
          <strong>{streak}</strong>
          <span>{streak === 1 ? "day" : "days"} streak</span>
        </Card>
        <Card className="stat">
          <Dumbbell />
          <strong>{completedCount}</strong>
          <span>
            {completedCount === 1 ? "Workout flow" : "Workout flows"} finished
          </span>
        </Card>
        <Card className="stat wide">
          <Clock3 />
          <strong>{totalMinutes}</strong>
          <span>{totalMinutes === 1 ? "minute" : "minutes"} in motion</span>
        </Card>
      </div>
      <Card className="activity-card">
        <div className="section-title">
          <div>
            <span className="mini-label">LAST 4 WEEKS</span>
            <h3>Activity</h3>
          </div>
          <CalendarDays />
        </div>
        <div className="heatmap">
          {days.map((day) => (
            <span
              key={isoDate(day)}
              title={isoDate(day)}
              className={completedDates.has(isoDate(day)) ? "filled" : ""}
            />
          ))}
        </div>
        <div className="heatmap-legend">
          <span>Less</span>
          <i />
          <i className="mid" />
          <i className="full" />
          <span>More</span>
        </div>
      </Card>
      <section className="history">
        <div className="section-title">
          <div>
            <span className="mini-label">RECENT</span>
            <h3>Session history</h3>
          </div>
          <BarChart3 />
        </div>
        {sessions.length === 0 ? (
          <div className="empty-state">
            <Dumbbell />
            <b>Your first workout flow starts here.</b>
            <p>Complete a workout and it’ll show up in your history.</p>
          </div>
        ) : (
          sessions.slice(0, 8).map((item) => (
            <div className="history-row" key={item.id}>
              <span
                className={
                  item.status === "completed"
                    ? "history-check"
                    : item.status === "skipped"
                      ? "history-check skipped"
                      : "history-check partial"
                }
              >
                {item.status === "completed" ? <Check /> : <CircleStop />}
              </span>
              <span>
                <b>{item.title}</b>
                <small>
                  {new Intl.DateTimeFormat("en", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(`${item.date}T12:00:00`))}
                </small>
              </span>
              <span>
                {item.status === "skipped"
                  ? "Skipped"
                  : item.durationSeconds
                    ? `${Math.max(1, Math.round(item.durationSeconds / 60))} min`
                    : "Logged"}
              </span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
