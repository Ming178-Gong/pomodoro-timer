import { useMemo } from 'react'
import { useTimerStore, PomodoroRecord } from '../store/timerStore'
import { useI18n } from '../i18n/useI18n'

function getDateStr(date: Date): string {
  return date.toISOString().split('T')[0]
}

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return getDateStr(d)
  })
}

export default function Stats() {
  const records = useTimerStore((s) => s.records)
  const t = useI18n()

  const last7Days = useMemo(() => getLast7Days(), [])

  const byDate = useMemo(() => {
    const map: Record<string, PomodoroRecord[]> = {}
    for (const r of records) {
      if (!map[r.date]) map[r.date] = []
      map[r.date].push(r)
    }
    return map
  }, [records])

  const todayStr = getDateStr(new Date())
  const todayRecords = byDate[todayStr] || []
  const todayMinutes = todayRecords.reduce((sum, r) => sum + r.duration, 0)
  const totalPomodoros = records.length
  const totalMinutes = records.reduce((sum, r) => sum + r.duration, 0)
  const maxCount = Math.max(...last7Days.map((d) => (byDate[d] || []).length), 1)

  return (
    <div className="stats-container">
      <h2 className="stats-title">{t.stats.title}</h2>

      {/* Summary cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#e63946' }}>{todayRecords.length}</div>
          <div className="stat-label">{t.stats.todayPomodoros}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#2a9d8f' }}>{todayMinutes}</div>
          <div className="stat-label">{t.stats.todayMinutes}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#457b9d' }}>{totalPomodoros}</div>
          <div className="stat-label">{t.stats.totalPomodoros}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f4a261' }}>{Math.round(totalMinutes / 60)}</div>
          <div className="stat-label">{t.stats.totalHours}</div>
        </div>
      </div>

      {/* 7-day bar chart */}
      <div className="chart-section">
        <h3 className="chart-title">{t.stats.last7Days}</h3>
        <div className="bar-chart">
          {last7Days.map((date, idx) => {
            const count = (byDate[date] || []).length
            const heightPct = maxCount > 0 ? (count / maxCount) * 100 : 0
            const isToday = date === todayStr
            const d = new Date(date + 'T00:00:00')
            const dayIdx = (d.getDay() + 6) % 7

            return (
              <div key={date} className="bar-item">
                <div className="bar-count">{count > 0 ? count : ''}</div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      height: `${Math.max(heightPct, count > 0 ? 8 : 0)}%`,
                      background: isToday ? '#e63946' : 'rgba(230,57,70,0.45)'
                    }}
                  />
                </div>
                <div className={`bar-label ${isToday ? 'today' : ''}`}>
                  {t.stats.days[dayIdx]}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Today's records */}
      <div className="recent-section">
        <h3 className="chart-title">{t.stats.todayRecords}</h3>
        {todayRecords.length === 0 ? (
          <div className="empty-tip">{t.stats.emptyTip}</div>
        ) : (
          <ul className="record-list">
            {[...todayRecords].reverse().map((r) => (
              <li key={r.id} className="record-item">
                <span className="record-icon">🍅</span>
                <span className="record-task">{r.task}</span>
                <span className="record-time">
                  {new Date(r.completedAt).toLocaleTimeString(
                    useTimerStore.getState().language === 'zh' ? 'zh-CN' : 'en-US',
                    { hour: '2-digit', minute: '2-digit' }
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
