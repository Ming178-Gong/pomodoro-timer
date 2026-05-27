import { useState } from 'react'
import { useTimerStore } from '../store/timerStore'
import { useI18n } from '../i18n/useI18n'
import type { Language } from '../i18n'

export default function Settings() {
  const store = useTimerStore()
  const t = useI18n()
  const language = useTimerStore((s) => s.language)

  const [values, setValues] = useState({
    workDuration: store.workDuration,
    shortBreakDuration: store.shortBreakDuration,
    longBreakDuration: store.longBreakDuration,
    longBreakInterval: store.longBreakInterval
  })
  const [saved, setSaved] = useState(false)

  type DurationKey = 'workDuration' | 'shortBreakDuration' | 'longBreakDuration' | 'longBreakInterval'

  const fields: { key: DurationKey; label: string; unit: string; min: number; max: number }[] = [
    { key: 'workDuration',       label: t.settings.workDuration,       unit: t.settings.minutes,   min: 1,  max: 90 },
    { key: 'shortBreakDuration', label: t.settings.shortBreakDuration, unit: t.settings.minutes,   min: 1,  max: 30 },
    { key: 'longBreakDuration',  label: t.settings.longBreakDuration,  unit: t.settings.minutes,   min: 5,  max: 60 },
    { key: 'longBreakInterval',  label: t.settings.longBreakInterval,  unit: t.settings.pomodoros, min: 2,  max: 10 }
  ]

  const handleChange = (key: DurationKey, val: number) => {
    setValues((v) => ({ ...v, [key]: val }))
    setSaved(false)
  }

  const handleSave = () => {
    store.updateSettings(values)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClearRecords = () => {
    if (confirm(t.settings.clearConfirm)) {
      useTimerStore.setState({ records: [] })
    }
  }

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文',    flag: '🇨🇳' }
  ]

  return (
    <div className="settings-container">
      <h2 className="stats-title">{t.settings.title}</h2>

      {/* Language switcher */}
      <div className="setting-item">
        <div className="setting-label">
          <span>{t.settings.language}</span>
        </div>
        <div className="lang-switcher">
          {languages.map(({ code, label, flag }) => (
            <button
              key={code}
              className={`lang-btn ${language === code ? 'active' : ''}`}
              onClick={() => store.setLanguage(code)}
            >
              <span>{flag}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="settings-divider" />

      {/* Duration settings */}
      <div className="settings-group">
        {fields.map(({ key, label, unit, min, max }) => (
          <div key={key} className="setting-item">
            <div className="setting-label">
              <span>{label}</span>
              <span className="setting-unit">{unit}</span>
            </div>
            <div className="setting-control">
              <button className="adj-btn" onClick={() => handleChange(key, Math.max(min, values[key] - 1))}>−</button>
              <span className="setting-value">{values[key]}</span>
              <button className="adj-btn" onClick={() => handleChange(key, Math.min(max, values[key] + 1))}>+</button>
            </div>
            <input
              type="range" min={min} max={max} value={values[key]}
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
        {saved ? t.settings.saved : t.settings.save}
      </button>

      <div className="danger-zone">
        <h3 className="danger-title">{t.settings.dangerZone}</h3>
        <button className="danger-btn" onClick={handleClearRecords}>
          {t.settings.clearRecords}
        </button>
      </div>
    </div>
  )
}
