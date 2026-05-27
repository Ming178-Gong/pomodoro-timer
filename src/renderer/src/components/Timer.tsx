import { useEffect, useRef } from 'react'
import { useTimerStore, Phase } from '../store/timerStore'

const PHASE_LABELS: Record<Phase, string> = {
  work: '专注工作',
  shortBreak: '短暂休息',
  longBreak: '长时休息'
}

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

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevSecondsRef = useRef(secondsLeft)
  const prevPhaseRef = useRef(phase)

  // 计时器 tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => tick(), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, tick])

  // 检测阶段完成并发送通知
  useEffect(() => {
    if (prevPhaseRef.current !== phase) {
      const wasWork = prevPhaseRef.current === 'work'
      const title = wasWork ? '🍅 番茄完成！' : '⏰ 休息结束！'
      const body = wasWork
        ? `继续加油！今天已完成 ${pomodoroCount} 个番茄`
        : '回到工作状态，专注下一个番茄'
      window.api?.notify(title, body)
      prevPhaseRef.current = phase
    }
  }, [phase, pomodoroCount])

  // 更新托盘提示
  useEffect(() => {
    const label = PHASE_LABELS[phase]
    window.api?.updateTrayTip(`🍅 番茄钟 - ${label} ${formatTime(secondsLeft)}`)
    prevSecondsRef.current = secondsLeft
  }, [secondsLeft, phase])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // 圆形进度条计算
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
      {/* 阶段切换 */}
      <div className="phase-tabs">
        {(['work', 'shortBreak', 'longBreak'] as Phase[]).map((p) => (
          <button
            key={p}
            className={`phase-tab ${phase === p ? 'active' : ''}`}
            style={phase === p ? { color, borderColor: color } : {}}
            onClick={() => setPhase(p)}
          >
            {PHASE_LABELS[p]}
          </button>
        ))}
      </div>

      {/* 圆形计时器 */}
      <div className="timer-ring-wrapper">
        <svg width="260" height="260" viewBox="0 0 260 260">
          {/* 背景圆 */}
          <circle
            cx="130" cy="130" r={radius}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10"
          />
          {/* 进度圆 */}
          <circle
            cx="130" cy="130" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 130 130)"
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
          />
        </svg>
        <div className="timer-display">
          <div className="timer-time" style={{ color }}>
            {formatTime(secondsLeft)}
          </div>
          <div className="timer-phase-label">{PHASE_LABELS[phase]}</div>
        </div>
      </div>

      {/* 任务输入 */}
      <input
        className="task-input"
        placeholder="当前任务（可选）"
        value={currentTask}
        onChange={(e) => setCurrentTask(e.target.value)}
        maxLength={40}
      />

      {/* 控制按钮 */}
      <div className="timer-controls">
        <button className="ctrl-btn secondary" onClick={resetTimer} title="重置">
          ↺
        </button>
        <button
          className="ctrl-btn primary"
          style={{ background: color }}
          onClick={isRunning ? pauseTimer : startTimer}
        >
          {isRunning ? '⏸ 暂停' : '▶ 开始'}
        </button>
        <button
          className="ctrl-btn secondary"
          onClick={() => {
            const phases: Phase[] = ['work', 'shortBreak', 'longBreak']
            const next = phases[(phases.indexOf(phase) + 1) % phases.length]
            setPhase(next)
          }}
          title="跳过"
        >
          ⏭
        </button>
      </div>

      {/* 番茄计数 */}
      <div className="pomodoro-dots">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`dot ${i < (pomodoroCount % 4) ? 'filled' : ''}`}
            style={i < (pomodoroCount % 4) ? { background: color } : {}}
          />
        ))}
        <span className="total-count">共 {pomodoroCount} 个</span>
      </div>
    </div>
  )
}
