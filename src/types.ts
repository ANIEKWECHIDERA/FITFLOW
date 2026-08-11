export type Screen = "home" | "plan" | "progress" | "manage" | "editor";

export type Session = {
  id: string;
  planId?: string;
  date: string;
  title: string;
  durationSeconds: number;
  status: "completed" | "partial" | "skipped";
};

export type DisplayDay = {
  day: string;
  short: string;
  kind: "strength" | "rest";
  title: string;
  duration: string;
  optional?: boolean;
};
