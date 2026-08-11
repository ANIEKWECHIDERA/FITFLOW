import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BarChart3, Dumbbell, Home } from "lucide-react";
import { defaultPlan, type WorkoutBlock, type WorkoutPlan } from "./data";
import type { Screen, Session, SessionScope } from "./types";
import { isoDate } from "./lib/format";
import { playCue } from "./lib/audio";
import { buildWeek } from "./lib/schedule";
import {
  clearActiveWorkout,
  loadActiveWorkout,
  loadPlans,
  loadSessions,
  saveActiveWorkout,
  STORAGE_KEYS,
} from "./lib/storage";
import { createActiveWorkout } from "./lib/active-workout";
import { calculateCurrentStreak, qualifiesForStreak } from "./lib/session-rules";
import { AppNavigation } from "./components/app-navigation";
import { LoadingScreen } from "./components/loading-screen";
import { ProfileMenu } from "./components/profile-menu";
import { HomePage } from "./pages/home-page";
import { PlanPage } from "./pages/plan-page";
import { ProgressPage } from "./pages/progress-page";
import { WorkoutPlayerPage } from "./pages/workout-player-page";
import { PlanEditor, PlanLibrary } from "./PlanManagement";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [playerScope, setPlayerScope] = useState(loadActiveWorkout);
  const [sessions, setSessions] = useState<Session[]>(loadSessions);
  const [plans, setPlans] = useState<WorkoutPlan[]>(loadPlans);
  const [activePlanId, setActivePlanId] = useState(() => {
    if (localStorage.getItem(STORAGE_KEYS.requestedPlan) !== defaultPlan.id) {
      const available = loadPlans();
      localStorage.setItem(STORAGE_KEYS.plans, JSON.stringify(available));
      localStorage.setItem(STORAGE_KEYS.activePlan, defaultPlan.id);
      localStorage.setItem(STORAGE_KEYS.requestedPlan, defaultPlan.id);
      return defaultPlan.id;
    }
    return localStorage.getItem(STORAGE_KEYS.activePlan) ?? loadPlans()[0].id;
  });
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan>();
  const [profileMenu, setProfileMenu] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const activePlan = plans.find((plan) => plan.id === activePlanId) ?? plans[0];
  const week = useMemo(() => buildWeek(activePlan), [activePlan]);
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const planSessions = useMemo(
    () =>
      sessions.filter(
        (item) =>
          item.planId === activePlan.id ||
          (!item.planId && activePlan.id === defaultPlan.id),
      ),
    [activePlan.id, sessions],
  );
  const completedDates = useMemo(
    () =>
      new Set(
        planSessions
          .filter((item) => qualifiesForStreak(item, activePlan))
          .map((item) => item.date),
      ),
    [activePlan, planSessions],
  );
  const skippedDates = useMemo(
    () =>
      new Set(
        planSessions
          .filter((item) => item.status === "skipped")
          .map((item) => item.date),
      ),
    [planSessions],
  );
  const currentStreak = useMemo(() => {
    return calculateCurrentStreak({ workoutDays: activePlan.workoutDays, qualifyingDates: completedDates, skippedDates });
  }, [activePlan.workoutDays, completedDates, skippedDates]);

  const saveSession = useCallback(
    (session: Session) =>
      setSessions((current) => {
        const next = [session, ...current];
        localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(next));
        return next;
      }),
    [],
  );
  const withLoading = (message: string, operation: () => void) => {
    setLoadingMessage(message);
    window.setTimeout(() => {
      operation();
      setLoadingMessage(null);
    }, 420);
  };
  const loadPlan = (id: string) =>
    withLoading("Loading your plan…", () => {
      setActivePlanId(id);
      localStorage.setItem(STORAGE_KEYS.activePlan, id);
      setScreen("home");
    });
  const savePlan = (plan: WorkoutPlan, activate: boolean) =>
    withLoading("Saving your plan…", () => {
      setPlans((current) => {
        const exists = current.some((item) => item.id === plan.id);
        const next = exists
          ? current.map((item) => (item.id === plan.id ? plan : item))
          : [...current, plan];
        localStorage.setItem(STORAGE_KEYS.plans, JSON.stringify(next));
        return next;
      });
      if (activate) {
        setActivePlanId(plan.id);
        localStorage.setItem(STORAGE_KEYS.activePlan, plan.id);
        setScreen("home");
      } else setScreen("manage");
    });
  const deletePlan = (id: string) =>
    withLoading("Deleting plan…", () =>
      setPlans((current) => {
        const next = current.filter((plan) => plan.id !== id);
        localStorage.setItem(STORAGE_KEYS.plans, JSON.stringify(next));
        if (id === activePlanId && next[0]) {
          setActivePlanId(next[0].id);
          localStorage.setItem(STORAGE_KEYS.activePlan, next[0].id);
        }
        return next;
      }),
    );
  const startPlayer = (blocks: WorkoutBlock[], title: string, scope: SessionScope) => {
    playCue("start");
    const activeWorkout = createActiveWorkout(
      activePlan.id,
      blocks,
      title,
      scope,
    );
    saveActiveWorkout(activeWorkout);
    setPlayerScope(activeWorkout);
  };
  const closePlayer = () => {
    clearActiveWorkout();
    setPlayerScope(null);
  };
  const closeProfile = (action: () => void) => {
    action();
    setProfileMenu(false);
  };

  if (screen === "editor")
    return (
      <>
        <PlanEditor
          initialPlan={editingPlan}
          onCancel={() => setScreen("manage")}
          onSave={savePlan}
        />
        <LoadingScreen message={loadingMessage} />
      </>
    );
  if (screen === "manage")
    return (
      <>
        <PlanLibrary
          plans={plans}
          activePlanId={activePlan.id}
          onBack={() => setScreen("home")}
          onLoad={loadPlan}
          onEdit={(plan) => {
            setEditingPlan(plan);
            setScreen("editor");
          }}
          onDelete={deletePlan}
          onNew={() => {
            setEditingPlan(undefined);
            setScreen("editor");
          }}
        />
        <LoadingScreen message={loadingMessage} />
      </>
    );
  if (playerScope)
    return (
      <WorkoutPlayerPage
        plan={
          plans.find((plan) => plan.id === playerScope.planId) ?? activePlan
        }
        blocks={playerScope.blocks}
        sessionTitle={playerScope.title}
        scope={playerScope.scope}
        resumeState={playerScope}
        onExit={closePlayer}
        onSave={(session) => {
          saveSession(session);
          closePlayer();
          setScreen("progress");
        }}
      />
    );

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          onClick={() => setScreen("home")}
          aria-label="FitFlow home"
        >
          <span className="brand-mark">
            <span />
            <span />
            <span />
          </span>
          <span>FITFLOW</span>
        </button>
        <ProfileMenu
          open={profileMenu}
          plan={activePlan}
          onToggle={() => setProfileMenu((open) => !open)}
          onNew={() =>
            closeProfile(() => {
              setEditingPlan(undefined);
              setScreen("editor");
            })
          }
          onManage={() => closeProfile(() => setScreen("manage"))}
          onEdit={() =>
            closeProfile(() => {
              setEditingPlan(activePlan);
              setScreen("editor");
            })
          }
        />
      </header>
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.002 }}
        >
          {screen === "home" && (
            <HomePage
              plan={activePlan}
              week={week}
              today={week[todayIndex]}
              streak={currentStreak}
              completedDates={completedDates}
              skippedDates={skippedDates}
              onStart={() => startPlayer(activePlan.blocks, activePlan.name, "plan")}
              onSkip={() =>
                saveSession({
                  id: crypto.randomUUID(),
                  planId: activePlan.id,
                  date: isoDate(),
                  title: activePlan.name,
                  durationSeconds: 0,
                  status: "skipped",
                  scope: "plan",
                  completionRatio: 0,
                  qualifiesForStreak: false,
                })
              }
            />
          )}
          {screen === "plan" && (
            <PlanPage plan={activePlan} onStart={startPlayer} />
          )}
          {screen === "progress" && (
            <ProgressPage
              plan={activePlan}
              sessions={planSessions}
              streak={currentStreak}
              completedDates={completedDates}
            />
          )}
        </motion.main>
      </AnimatePresence>
      <AppNavigation
        active={screen}
        items={[
          { screen: "home", label: "Today", icon: <Home /> },
          { screen: "plan", label: "Plan", icon: <Dumbbell /> },
          { screen: "progress", label: "Progress", icon: <BarChart3 /> },
        ]}
        onNavigate={setScreen}
      />
      <LoadingScreen message={loadingMessage} />
    </div>
  );
}

export default App;
