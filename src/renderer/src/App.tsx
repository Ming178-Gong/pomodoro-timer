import { useState } from 'react'
import Timer from './components/Timer'
import Stats from './components/Stats'
import Settings from './components/Settings'
import { useI18n } from './i18n/useI18n'

type Tab = 'timer' | 'stats' | 'settings'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('timer')
  const t = useI18n()

  return (
    <div className="app-container">
      {/* Title bar — native traffic lights rendered by Electron on the left */}
      <div className="titlebar">
        <span className="titlebar-title">🍅 Pomodoro</span>
      </div>

      {/* Main content */}
      <div className="main-content">
        {activeTab === 'timer' && <Timer />}
        {activeTab === 'stats' && <Stats />}
        {activeTab === 'settings' && <Settings />}
      </div>

      {/* Bottom navigation */}
      <nav className="bottom-nav">
        <button
          className={`nav-btn ${activeTab === 'timer' ? 'active' : ''}`}
          onClick={() => setActiveTab('timer')}
        >
          <span className="nav-icon">⏱️</span>
          <span>{t.nav.timer}</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <span className="nav-icon">📊</span>
          <span>{t.nav.stats}</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <span className="nav-icon">⚙️</span>
          <span>{t.nav.settings}</span>
        </button>
      </nav>
    </div>
  )
}
