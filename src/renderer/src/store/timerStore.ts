import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Phase = 'work' | 'shortBreak' | 'longBreak'

export interface PomodoroRecord {
  id: string
  date: string        // YYYY-MM-DD
  completedAt: string // ISO timestamp
  task: string
  duration: number    // minutes
}

interface TimerState {
  // 设置
  workDuration: number       // 分钟
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number  // 每 N 个番茄后长休息

  // 计时器状态
  phase: Phase
  secondsLeft: number
  isRunning: boolean
  pomodoroCount: number      // 当前会话番茄数
  currentTask: string

  // 历史记录
  records: PomodoroRecord[]

  // Actions
  setPhase: (phase: Phase) => void
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  tick: () => void
  completePomodoro: () => void
  setCurrentTask: (task: string) => void
  updateSettings: (settings: Partial<Pick<TimerState, 'workDuration' | 'shortBreakDuration' | 'longBreakDuration' | 'longBreakInterval'>>) => void
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,

      phase: 'work',
      secondsLeft: 25 * 60,
      isRunning: false,
      pomodoroCount: 0,
      currentTask: '',

      records: [],

      setPhase: (phase) => {
        const state = get()
        const duration =
          phase === 'work' ? state.workDuration
          : phase === 'shortBreak' ? state.shortBreakDuration
          : state.longBreakDuration
        set({ phase, secondsLeft: duration * 60, isRunning: false })
      },

      startTimer: () => set({ isRunning: true }),
      pauseTimer: () => set({ isRunning: false }),

      resetTimer: () => {
        const state = get()
        const duration =
          state.phase === 'work' ? state.workDuration
          : state.phase === 'shortBreak' ? state.shortBreakDuration
          : state.longBreakDuration
        set({ secondsLeft: duration * 60, isRunning: false })
      },

      tick: () => {
        const state = get()
        if (state.secondsLeft > 0) {
          set({ secondsLeft: state.secondsLeft - 1 })
        } else {
          state.completePomodoro()
        }
      },

      completePomodoro: () => {
        const state = get()
        set({ isRunning: false })

        if (state.phase === 'work') {
          const newCount = state.pomodoroCount + 1
          const record: PomodoroRecord = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            completedAt: new Date().toISOString(),
            task: state.currentTask || '专注工作',
            duration: state.workDuration
          }

          // 决定下一个阶段
          const nextPhase: Phase = newCount % state.longBreakInterval === 0
            ? 'longBreak'
            : 'shortBreak'
          const nextDuration = nextPhase === 'longBreak'
            ? state.longBreakDuration
            : state.shortBreakDuration

          set({
            pomodoroCount: newCount,
            records: [...state.records, record],
            phase: nextPhase,
            secondsLeft: nextDuration * 60
          })
        } else {
          // 休息结束，回到工作
          set({ phase: 'work', secondsLeft: state.workDuration * 60 })
        }
      },

      setCurrentTask: (task) => set({ currentTask: task }),

      updateSettings: (settings) => {
        const state = get()
        const newState = { ...settings }
        // 同步更新当前剩余时间（如果计时器未运行）
        if (!state.isRunning) {
          if (settings.workDuration && state.phase === 'work') {
            Object.assign(newState, { secondsLeft: settings.workDuration * 60 })
          } else if (settings.shortBreakDuration && state.phase === 'shortBreak') {
            Object.assign(newState, { secondsLeft: settings.shortBreakDuration * 60 })
          } else if (settings.longBreakDuration && state.phase === 'longBreak') {
            Object.assign(newState, { secondsLeft: settings.longBreakDuration * 60 })
          }
        }
        set(newState)
      }
    }),
    {
      name: 'pomodoro-storage',
      partialize: (state) => ({
        workDuration: state.workDuration,
        shortBreakDuration: state.shortBreakDuration,
        longBreakDuration: state.longBreakDuration,
        longBreakInterval: state.longBreakInterval,
        records: state.records
      })
    }
  )
)
