# FitFlow

A mobile-first guided workout PWA built from the FitFlow product brief.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For a production check:

```bash
npm run build
npm run preview
```

## Included in this MVP

- Today dashboard with weekly schedule
- Create, edit, load, and delete workout plans from the profile menu
- Optional workout sections with dynamic exercises, sets, reps, work, and rest timing
- Plan-specific workout days, streaks, history, and automatically calculated metrics
- A full upper-body and core plan included as the editable default
- Timestamp-based timed intervals and rep-based set completion
- Pause, resume, stop, partial-session saving, and automatic transitions
- Web Audio cues and best-effort Screen Wake Lock
- Local session history, streaks, and a four-week activity heatmap
- Installable PWA with an offline-cached application shell

Session data currently stays in the browser with `localStorage`. Firebase authentication and sync are intentionally the next infrastructure step after validating the core workout flow.
