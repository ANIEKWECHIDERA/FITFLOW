export type Screen = "home" | "plan" | "progress" | "manage" | "editor";
export type SessionScope = "plan" | "section" | "exercise";

export type Session = {
  id: string;
  planId?: string;
  date: string;
  title: string;
  durationSeconds: number;
  status: "completed" | "partial" | "skipped";
  scope?: SessionScope;
  completionRatio?: number;
  qualifiesForStreak?: boolean;
};

export type DisplayDay = {
  day: string;
  short: string;
  kind: "strength" | "rest";
  title: string;
  duration: string;
  optional?: boolean;
};
