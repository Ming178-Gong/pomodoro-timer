import { useEffect, useRef } from 'react'
import { useTimerStore, Phase } from '../store/timerStore'
import { useI18n } from '../i18n/useI18n'

const PHASE_COLORS: Record<Phase, string> = {
  work: '#e63946',
  shortBreak: '#2a9d8f',
  longBreak: '#457b9d'
}

export default function Timer() {
  const {
    phase, secondsLeft, isRunning, pomodoroCount, currentTask,
    setPhase, startTimer, pauseTimer, resetTimer, tick,
    setCurrentTask
  } = useTimerStore()

  const t = useI18n()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevPhaseRef = useRef(phase)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => tick(), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, tick])

  useEffect(() => {
    if (prevPhaseRef.current !== phase) {
      const wasWork = prevPhaseRef.current === 'work'
      const title = wasWork ? '🍅 Pomodoro done!' : '⏰ Break over!'
      const body = wasWork
        ? `Keep going! ${pomodoroCount} pomodoro${pomodoroCount !== 1 ? 's' : ''} today`
        : 'Back to focus — start the next pomodoro'
      window.api?.notify(title, body)
      prevPhaseRef.current = phase
    }
  }, [phase, pomodoroCount])

  useEffect(() => {
    const label = t.timer.phases[phase]
    window.api?.updateTrayTip(`🍅 Pomodoro - ${label} ${formatTime(secondsLeft)}`)
  }, [secondsLeft, phase, t])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const totalDuration = useTimerStore((s) =>
    phase === 'work' ? s.workDuration
    : phase === 'shortBreak' ? s.shortBreakDuration
    : s.longBreakDuration
  ) * 60

  const radius = 110
  const circumference = 2 * Math.PI * radius
  const progress = secondsLeft / totalDuration
  const strokeDashoffset = circumference * (1 - progress)
  const color = PHASE_COLORS[phase]

  return (
    <div className="timer-container">
      {/* Phase tabs */}
      <div className="phase-tabs">
        {(['work', 'shortBreak', 'longBreak'] as Phase[]).map((p) => (
          <button
            key={p}
            className={`phase-tab ${phase === p ? 'active' : ''}`}
            style={phase === p ? { color, borderColor: color } : {}}
            onClick={() => setPhase(p)}
          >
            {t.timer.phases[p]}
          </button>
        ))}
      </div>

      {/* Circular ring */}
      <div className="timer-ring-wrapper">
        <svg width="260" height="260" viewBox="0 0 260 260">
          <circle cx="130" cy="130" r={radius}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          <circle cx="130" cy="130" r={radius}
            fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 130 130)"
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }} />
        </svg>
        <div className="timer-display">
          <div className="timer-time" style={{ color }}>{formatTime(secondsLeft)}</div>
          <div className="timer-phase-label">{t.timer.phases[phase]}</div>
        </div>
      </div>

      {/* Task input */}
      <input
        className="task-input"
        placeholder={t.timer.taskPlaceholder}
        value={currentTask}
        onChange={(e) => setCurrentTask(e.target.value)}
        maxLength={40}
      />

      {/* Controls */}
      <div className="timer-controls">
        <button className="ctrl-btn secondary" onClick={resetTimer} title="Reset">↺</button>
        <button
          className="ctrl-btn primary"
          style={{ background: color }}
          onClick={isRunning ? pauseTimer : startTimer}
        >
          {isRunning ? t.timer.pause : t.timer.start}
        </button>
        <button
          className="ctrl-btn secondary"
          onClick={() => {
            const phases: Phase[] = ['work', 'shortBreak', 'longBreak']
            const next = phases[(phases.indexOf(phase) + 1) % phases.length]
            setPhase(next)
          }}
          title="Skip"
        >⏭</button>
      </div>

      {/* Pomodoro dots */}
      <div className="pomodoro-dots">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`dot ${i < (pomodoroCount % 4) ? 'filled' : ''}`}
            style={i < (pomodoroCount % 4) ? { background: color } : {}}
          />
        ))}
        <span className="total-count">{t.timer.count(pomodoroCount)}</span>
      </div>
    </div>
  )
}
