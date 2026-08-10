import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity, ArrowLeft, BarChart3, CalendarDays, Check, ChevronRight, CircleStop,
  Clock3, Dumbbell, Flame, Footprints, Home, Pause, Play, RotateCcw, Sparkles,
  TimerReset, Volume2, Wind,
} from 'lucide-react'
import { totalSets, week, workoutBlocks, type DayPlan } from './data'
import { buildSteps, formatTime, type Step } from './player'

type Screen = 'home' | 'plan' | 'progress'
type Session = { id: string; date: string; title: string; durationSeconds: number; status: 'completed' | 'partial' }

const STORAGE_KEY = 'fitflow.sessions.v1'
const isoDate = (date = new Date()) => date.toISOString().slice(0, 10)

function loadSessions(): Session[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Session[] }
  catch { return [] }
}

function getTodayPlan(): DayPlan {
  const jsDay = new Date().getDay()
  return week[jsDay === 0 ? 6 : jsDay - 1]
}

function playCue(type: 'start' | 'rest' | 'tick' | 'finish') {
  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext
  if (!AudioContextClass) return
  const ctx = new AudioContextClass()
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  const frequencies = { start: 620, rest: 360, tick: 840, finish: 760 }
  oscillator.frequency.value = frequencies[type]
  oscillator.type = 'sine'
  gain.gain.setValueAtTime(0.0001, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (type === 'finish' ? 0.55 : 0.18))
  oscillator.connect(gain).connect(ctx.destination)
  oscillator.start()
  oscillator.stop(ctx.currentTime + (type === 'finish' ? 0.58 : 0.2))
  oscillator.addEventListener('ended', () => void ctx.close())
}

declare global { interface Window { webkitAudioContext?: typeof AudioContext } }

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [playerOpen, setPlayerOpen] = useState(false)
  const [sessions, setSessions] = useState<Session[]>(loadSessions)
  const today = getTodayPlan()

  const saveSession = useCallback((session: Session) => {
    setSessions((current) => {
      const next = [session, ...current]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const completedDates = useMemo(() => new Set(sessions.filter((item) => item.status === 'completed').map((item) => item.date)), [sessions])
  const currentStreak = useMemo(() => {
    let streak = 0
    const cursor = new Date()
    for (let i = 0; i < 60; i += 1) {
      const index = cursor.getDay() === 0 ? 6 : cursor.getDay() - 1
      if (week[index].kind === 'rest') { cursor.setDate(cursor.getDate() - 1); continue }
      if (completedDates.has(isoDate(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); continue }
      if (isoDate(cursor) === isoDate()) { cursor.setDate(cursor.getDate() - 1); continue }
      break
    }
    return streak
  }, [completedDates])

  const logSimpleWorkout = () => saveSession({
    id: crypto.randomUUID(), date: isoDate(), title: today.title, durationSeconds: 0, status: 'completed',
  })

  if (playerOpen) {
    return <WorkoutPlayer onExit={() => setPlayerOpen(false)} onSave={(session) => { saveSession(session); setPlayerOpen(false); setScreen('progress') }} />
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setScreen('home')} aria-label="FitFlow home">
          <span className="brand-mark"><span /><span /><span /></span>
          <span>FITFLOW</span>
        </button>
        <button className="avatar" aria-label="Profile">CA</button>
      </header>

      <main>
        {screen === 'home' && <HomeScreen today={today} streak={currentStreak} completedDates={completedDates} onStart={() => setPlayerOpen(true)} onLog={logSimpleWorkout} />}
        {screen === 'plan' && <PlanScreen onStart={() => setPlayerOpen(true)} />}
        {screen === 'progress' && <ProgressScreen sessions={sessions} streak={currentStreak} completedDates={completedDates} />}
      </main>

      <nav className="bottom-nav" aria-label="Main navigation">
        <NavButton active={screen === 'home'} icon={<Home />} label="Today" onClick={() => setScreen('home')} />
        <NavButton active={screen === 'plan'} icon={<Dumbbell />} label="Plan" onClick={() => setScreen('plan')} />
        <NavButton active={screen === 'progress'} icon={<BarChart3 />} label="Progress" onClick={() => setScreen('progress')} />
      </nav>
    </div>
  )
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return <button className={active ? 'nav-button active' : 'nav-button'} onClick={onClick}>{icon}<span>{label}</span></button>
}

function HomeScreen({ today, streak, completedDates, onStart, onLog }: { today: DayPlan; streak: number; completedDates: Set<string>; onStart: () => void; onLog: () => void }) {
  const dateLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
  const alreadyDone = completedDates.has(isoDate())
  const canPlay = today.kind === 'strength'
  const icon = today.kind === 'run' ? <Footprints /> : today.kind === 'mobility' ? <Wind /> : today.kind === 'rest' ? <Sparkles /> : <Dumbbell />

  return (
    <div className="screen home-screen">
      <section className="welcome">
        <p className="eyebrow">{dateLabel}</p>
        <h1>Ready when<br />you are.</h1>
        <p>One session at a time. Keep the flow going.</p>
      </section>

      <section className="today-card">
        <div className="today-card-head">
          <span className="mini-label">TODAY'S FLOW</span>
          <span className="duration"><Clock3 /> {today.duration}</span>
        </div>
        <div className="workout-glyph">{icon}<span className="glyph-ring one" /><span className="glyph-ring two" /></div>
        <div className="workout-copy">
          <span className="workout-kind">{today.kind}</span>
          <h2>{today.title}</h2>
          <p>{canPlay ? `${workoutBlocks.length} blocks · ${totalSets} focused sets` : today.kind === 'rest' ? 'Recovery is part of the work.' : 'Move at a pace you can sustain.'}</p>
        </div>
        {alreadyDone ? (
          <button className="start-button done"><Check /> Completed today</button>
        ) : canPlay ? (
          <button className="start-button" onClick={onStart}><Play fill="currentColor" /> Start workout <ChevronRight /></button>
        ) : today.kind === 'rest' ? (
          <div className="rest-message">Take it easy. Your next flow is waiting.</div>
        ) : (
          <button className="start-button" onClick={onLog}><Check /> Mark as done <ChevronRight /></button>
        )}
      </section>

      <section className="week-section">
        <div className="section-title"><div><span className="mini-label">THIS WEEK</span><h3>Your rhythm</h3></div><div className="streak-pill"><Flame /> {streak} day streak</div></div>
        <div className="week-strip">
          {week.map((day, index) => {
            const mondayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
            const cursor = new Date(); cursor.setDate(cursor.getDate() + index - mondayIndex)
            const complete = completedDates.has(isoDate(cursor))
            return <div className={index === mondayIndex ? 'day active' : 'day'} key={day.day}><span>{day.short}</span><b>{cursor.getDate()}</b><i className={complete ? 'day-dot complete' : day.kind === 'rest' ? 'day-dot rest' : 'day-dot'}>{complete && <Check />}</i></div>
          })}
        </div>
      </section>

      <blockquote>“Motivation gets you started. Flow keeps you moving.”</blockquote>
    </div>
  )
}

function PlanScreen({ onStart }: { onStart: () => void }) {
  const [openBlock, setOpenBlock] = useState('main')
  return (
    <div className="screen plan-screen">
      <p className="eyebrow">YOUR PROGRAM</p>
      <h1>The flow,<br />mapped out.</h1>
      <p className="lead">A complete upper-body session built to move without guesswork.</p>
      <div className="plan-summary"><span><TimerReset /> 42 min</span><span><Activity /> {totalSets} sets</span><span><Dumbbell /> {workoutBlocks.length} blocks</span></div>
      <div className="block-list">
        {workoutBlocks.map((block) => {
          const open = block.id === openBlock
          return <article className={open ? 'block-card open' : 'block-card'} key={block.id}>
            <button onClick={() => setOpenBlock(open ? '' : block.id)}><span className="block-number">{block.shortName}</span><span><b>{block.name}</b><small>{block.exercises.length} exercises</small></span><ChevronRight /></button>
            {open && <div className="exercise-list">{block.exercises.map((exercise) => <div key={exercise.id}><span className="exercise-icon"><Dumbbell /></span><span><b>{exercise.name}</b><small>{exercise.sets} {exercise.sets === 1 ? 'set' : 'sets'} · {exercise.type === 'timed' ? `${exercise.durationSeconds}s` : exercise.reps}</small></span></div>)}</div>}
          </article>
        })}
      </div>
      <button className="floating-start" onClick={onStart}><Play fill="currentColor" /> Begin this flow</button>
    </div>
  )
}

function ProgressScreen({ sessions, streak, completedDates }: { sessions: Session[]; streak: number; completedDates: Set<string> }) {
  const totalMinutes = Math.round(sessions.reduce((sum, item) => sum + item.durationSeconds, 0) / 60)
  const days = Array.from({ length: 28 }, (_, index) => { const date = new Date(); date.setDate(date.getDate() - 27 + index); return date })
  return (
    <div className="screen progress-screen">
      <p className="eyebrow">YOUR PROGRESS</p>
      <h1>Consistency,<br />made visible.</h1>
      <div className="stats-grid">
        <div className="stat dark"><Flame /><strong>{streak}</strong><span>day streak</span></div>
        <div className="stat"><Dumbbell /><strong>{sessions.filter((s) => s.status === 'completed').length}</strong><span>flows finished</span></div>
        <div className="stat wide"><Clock3 /><strong>{totalMinutes}</strong><span>minutes in motion</span></div>
      </div>
      <section className="activity-card">
        <div className="section-title"><div><span className="mini-label">LAST 4 WEEKS</span><h3>Activity</h3></div><CalendarDays /></div>
        <div className="heatmap">{days.map((day) => <span key={isoDate(day)} title={isoDate(day)} className={completedDates.has(isoDate(day)) ? 'filled' : ''} />)}</div>
        <div className="heatmap-legend"><span>Less</span><i /><i className="mid" /><i className="full" /><span>More</span></div>
      </section>
      <section className="history">
        <div className="section-title"><div><span className="mini-label">RECENT</span><h3>Session history</h3></div></div>
        {sessions.length === 0 ? <div className="empty-state"><Dumbbell /><b>Your first flow starts here.</b><p>Complete a workout and it’ll show up in your history.</p></div> : sessions.slice(0, 8).map((item) => <div className="history-row" key={item.id}><span className={item.status === 'completed' ? 'history-check' : 'history-check partial'}>{item.status === 'completed' ? <Check /> : <CircleStop />}</span><span><b>{item.title}</b><small>{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${item.date}T12:00:00`))}</small></span><span>{item.durationSeconds ? `${Math.max(1, Math.round(item.durationSeconds / 60))} min` : 'Logged'}</span></div>)}
      </section>
    </div>
  )
}

function WorkoutPlayer({ onExit, onSave }: { onExit: () => void; onSave: (session: Session) => void }) {
  const steps = useMemo(() => buildSteps(workoutBlocks), [])
  const [index, setIndex] = useState(0)
  const [running, setRunning] = useState(true)
  const [remaining, setRemaining] = useState(steps[0].seconds)
  const [confirmStop, setConfirmStop] = useState(false)
  const startedAt = useRef(Date.now())
  const deadline = useRef(steps[0].mode === 'timed' ? Date.now() + steps[0].seconds * 1000 : 0)
  const lastTick = useRef<number | null>(null)
  const wakeLock = useRef<WakeLockSentinel | null>(null)
  const step = steps[index]

  const finish = useCallback((status: 'completed' | 'partial') => {
    if (status === 'completed') playCue('finish')
    onSave({ id: crypto.randomUUID(), date: isoDate(), title: 'Upper body + core', durationSeconds: Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)), status })
  }, [onSave])

  const advance = useCallback(() => {
    if (index >= steps.length - 1) { finish('completed'); return }
    const nextIndex = index + 1
    const next = steps[nextIndex]
    setIndex(nextIndex)
    setRemaining(next.seconds)
    setRunning(true)
    lastTick.current = null
    deadline.current = next.mode === 'timed' ? Date.now() + next.seconds * 1000 : 0
    playCue(next.kind === 'rest' ? 'rest' : 'start')
  }, [finish, index, steps])

  useEffect(() => {
    if (!running || step.mode !== 'timed') return
    const update = () => {
      const nextRemaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000))
      setRemaining(nextRemaining)
      if (nextRemaining <= 3 && nextRemaining > 0 && lastTick.current !== nextRemaining) { lastTick.current = nextRemaining; playCue('tick') }
      if (nextRemaining === 0) advance()
    }
    update()
    const timer = window.setInterval(update, 250)
    return () => window.clearInterval(timer)
  }, [advance, running, step.mode])

  useEffect(() => {
    const request = async () => {
      try { if ('wakeLock' in navigator) wakeLock.current = await navigator.wakeLock.request('screen') }
      catch { /* Wake Lock is best-effort. */ }
    }
    void request()
    return () => { void wakeLock.current?.release() }
  }, [])

  const togglePause = () => {
    if (step.mode !== 'timed') return
    if (running) { setRemaining(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000))); setRunning(false) }
    else { deadline.current = Date.now() + remaining * 1000; setRunning(true) }
  }
  const progress = ((index + (step.mode === 'timed' && step.seconds ? 1 - remaining / step.seconds : 0)) / steps.length) * 100
  const nextStep = steps[index + 1]

  return (
    <div className={running ? 'player' : 'player paused'}>
      <header className="player-header"><button onClick={() => setConfirmStop(true)}><ArrowLeft /> Exit</button><span>{Math.round(progress)}% complete</span><button className="sound-button" aria-label="Audio cues on"><Volume2 /></button></header>
      <div className="overall-progress"><span style={{ width: `${progress}%` }} /></div>
      <main className="player-main">
        <div className="player-status"><span>{step.kind === 'rest' ? 'RECOVER' : step.blockName.toUpperCase()}</span><i /> <span>SET {step.set} OF {step.totalSets}</span></div>
        <div className={step.kind === 'rest' ? 'motion-orbit rest' : 'motion-orbit'}><div>{step.kind === 'rest' ? <Wind /> : <Dumbbell />}</div><span className="orbit orbit-one" /><span className="orbit orbit-two" /></div>
        <div className="player-copy">
          <p>{step.kind === 'rest' ? `Up next · ${nextStep?.exerciseName ?? 'Finish'}` : step.blockName}</p>
          <h1>{step.kind === 'rest' ? 'Catch your breath' : step.exerciseName}</h1>
          <div className="target">{step.mode === 'timed' ? formatTime(remaining) : step.reps}</div>
          {step.note && step.kind === 'exercise' && <p className="coach-note">{step.note}</p>}
        </div>
        <div className="player-actions">
          {step.mode === 'reps' ? <button className="primary-action" onClick={advance}><Check /> Complete set</button> : <button className="round-control" onClick={togglePause}>{running ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button>}
          <button className="stop-control" onClick={() => setConfirmStop(true)}><CircleStop /> End workout</button>
        </div>
        <div className="up-next"><span className="up-next-icon">{nextStep?.kind === 'rest' ? <Wind /> : <RotateCcw />}</span><span><small>UP NEXT</small><b>{nextStep ? (nextStep.kind === 'rest' ? `${nextStep.seconds}s rest` : nextStep.exerciseName) : 'Flow complete'}</b></span><span>{nextStep?.kind === 'exercise' ? `Set ${nextStep.set}` : ''}</span></div>
      </main>
      {!running && step.mode === 'timed' && <div className="pause-label">PAUSED</div>}
      {confirmStop && <div className="modal-backdrop"><div className="stop-modal"><span className="modal-icon"><CircleStop /></span><p className="eyebrow">END THIS FLOW?</p><h2>Save your progress?</h2><p>You’ve completed {Math.round(progress)}% of today’s workout. Partial sessions still count as showing up.</p><button className="start-button" onClick={() => finish('partial')}>Save partial session</button><button className="secondary-button" onClick={() => setConfirmStop(false)}>Keep moving</button><button className="text-button" onClick={onExit}>Discard session</button></div></div>}
    </div>
  )
}

export default App
