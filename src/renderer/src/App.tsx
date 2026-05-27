import { useState } from 'react'
import Timer from './components/Timer'
import Stats from './components/Stats'
import Settings from './components/Settings'

type Tab = 'timer' | 'stats' | 'settings'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('timer')

  return (
    <div className="app-container">
      {/* 标题栏：交通灯由 Electron 原生渲染，此处只保留拖拽区域和标题 */}
      <div className="titlebar">
        <span className="titlebar-title">🍅 番茄钟</span>
      </div>

      {/* 主内容区 */}
      <div className="main-content">
        {activeTab === 'timer' && <Timer />}
        {activeTab === 'stats' && <Stats />}
        {activeTab === 'settings' && <Settings />}
      </div>

      {/* 底部导航 */}
      <nav className="bottom-nav">
        <button
          className={`nav-btn ${activeTab === 'timer' ? 'active' : ''}`}
          onClick={() => setActiveTab('timer')}
        >
          <span className="nav-icon">⏱️</span>
          <span>计时器</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <span className="nav-icon">📊</span>
          <span>统计</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <span className="nav-icon">⚙️</span>
          <span>设置</span>
        </button>
      </nav>
    </div>
  )
}
