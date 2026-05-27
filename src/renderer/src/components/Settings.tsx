import { useState } from 'react'
import { useTimerStore } from '../store/timerStore'

interface FieldConfig {
  key: 'workDuration' | 'shortBreakDuration' | 'longBreakDuration' | 'longBreakInterval'
  label: string
  unit: string
  min: number
  max: number
}

const fields: FieldConfig[] = [
  { key: 'workDuration', label: '专注时长', unit: '分钟', min: 1, max: 90 },
  { key: 'shortBreakDuration', label: '短休息时长', unit: '分钟', min: 1, max: 30 },
  { key: 'longBreakDuration', label: '长休息时长', unit: '分钟', min: 5, max: 60 },
  { key: 'longBreakInterval', label: '长休息间隔', unit: '个番茄', min: 2, max: 10 }
]

export default function Settings() {
  const store = useTimerStore()
  const [values, setValues] = useState({
    workDuration: store.workDuration,
    shortBreakDuration: store.shortBreakDuration,
    longBreakDuration: store.longBreakDuration,
    longBreakInterval: store.longBreakInterval
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (key: FieldConfig['key'], val: number) => {
    setValues((v) => ({ ...v, [key]: val }))
    setSaved(false)
  }

  const handleSave = () => {
    store.updateSettings(values)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClearRecords = () => {
    if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      useTimerStore.setState({ records: [] })
    }
  }

  return (
    <div className="settings-container">
      <h2 className="stats-title">⚙️ 设置</h2>

      <div className="settings-group">
        {fields.map(({ key, label, unit, min, max }) => (
          <div key={key} className="setting-item">
            <div className="setting-label">
              <span>{label}</span>
              <span className="setting-unit">{unit}</span>
            </div>
            <div className="setting-control">
              <button
                className="adj-btn"
                onClick={() => handleChange(key, Math.max(min, values[key] - 1))}
              >−</button>
              <span className="setting-value">{values[key]}</span>
              <button
                className="adj-btn"
                onClick={() => handleChange(key, Math.min(max, values[key] + 1))}
              >+</button>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              value={values[key]}
              onChange={(e) => handleChange(key, Number(e.target.value))}
              className="setting-slider"
            />
          </div>
        ))}
      </div>

      <button
        className="save-btn"
        onClick={handleSave}
        style={saved ? { background: '#2a9d8f' } : {}}
      >
        {saved ? '✓ 已保存' : '保存设置'}
      </button>

      <div className="danger-zone">
        <h3 className="danger-title">危险区域</h3>
        <button className="danger-btn" onClick={handleClearRecords}>
          清空所有历史记录
        </button>
      </div>
    </div>
  )
}
