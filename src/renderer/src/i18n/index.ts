export type Language = 'en' | 'zh'

export const translations = {
  en: {
    // App nav
    nav: {
      timer: 'Timer',
      stats: 'Stats',
      settings: 'Settings'
    },
    // Timer page
    timer: {
      phases: {
        work: 'Focus',
        shortBreak: 'Short Break',
        longBreak: 'Long Break'
      },
      taskPlaceholder: 'Current task (optional)',
      start: '▶ Start',
      pause: '⏸ Pause',
      total: 'Total',
      count: (n: number) => `${n} pomodoro${n !== 1 ? 's' : ''}`
    },
    // Stats page
    stats: {
      title: '📊 Statistics',
      todayPomodoros: "Today's Pomodoros",
      todayMinutes: "Today's Minutes",
      totalPomodoros: 'Total Pomodoros',
      totalHours: 'Total Hours',
      last7Days: 'Last 7 Days',
      todayRecords: "Today's Records",
      emptyTip: 'No pomodoros yet today. Stay focused! 🍅',
      defaultTask: 'Focus session',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    // Settings page
    settings: {
      title: '⚙️ Settings',
      workDuration: 'Focus Duration',
      shortBreakDuration: 'Short Break',
      longBreakDuration: 'Long Break',
      longBreakInterval: 'Long Break Every',
      minutes: 'min',
      pomodoros: 'pomodoros',
      save: 'Save Settings',
      saved: '✓ Saved',
      language: 'Language',
      dangerZone: 'Danger Zone',
      clearRecords: 'Clear All Records',
      clearConfirm: 'Are you sure you want to clear all records? This cannot be undone.'
    }
  },
  zh: {
    // App nav
    nav: {
      timer: '计时器',
      stats: '统计',
      settings: '设置'
    },
    // Timer page
    timer: {
      phases: {
        work: '专注工作',
        shortBreak: '短暂休息',
        longBreak: '长时休息'
      },
      taskPlaceholder: '当前任务（可选）',
      start: '▶ 开始',
      pause: '⏸ 暂停',
      total: '共',
      count: (n: number) => `共 ${n} 个`
    },
    // Stats page
    stats: {
      title: '📊 统计数据',
      todayPomodoros: '今日番茄',
      todayMinutes: '今日分钟',
      totalPomodoros: '累计番茄',
      totalHours: '累计小时',
      last7Days: '近 7 天',
      todayRecords: '今日记录',
      emptyTip: '今天还没有完成的番茄，加油！🍅',
      defaultTask: '专注工作',
      days: ['一', '二', '三', '四', '五', '六', '日']
    },
    // Settings page
    settings: {
      title: '⚙️ 设置',
      workDuration: '专注时长',
      shortBreakDuration: '短休息时长',
      longBreakDuration: '长休息时长',
      longBreakInterval: '长休息间隔',
      minutes: '分钟',
      pomodoros: '个番茄',
      save: '保存设置',
      saved: '✓ 已保存',
      language: '语言',
      dangerZone: '危险区域',
      clearRecords: '清空所有历史记录',
      clearConfirm: '确定要清空所有历史记录吗？此操作不可恢复。'
    }
  }
} as const

export type Translations = typeof translations['en']
