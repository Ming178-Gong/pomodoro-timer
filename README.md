# 🍅 Pomodoro Timer

A beautiful, minimal desktop Pomodoro timer built with Electron + React. Stay focused, track your progress, and build better work habits — one tomato at a time.

![App Screenshot](https://raw.githubusercontent.com/Ming178-Gong/pomodoro-timer/main/docs/screenshot.png)

---

## ✨ Features

- **Circular progress ring** — Visual countdown with smooth animation
- **Three modes** — Focus (25 min) · Short Break (5 min) · Long Break (15 min)
- **Auto phase switching** — Automatically cycles to break after every focus session
- **System tray** — Minimize to tray and keep running in the background
- **Desktop notifications** — Get notified when a session ends
- **Task tracking** — Label what you're working on for each Pomodoro
- **Statistics** — View daily counts and a 7-day bar chart
- **Custom durations** — Adjust all timers and long-break intervals in Settings
- **Persistent data** — Your records survive app restarts
- **Native macOS title bar** — Traffic lights integrated via `hiddenInset` style

---

## 🖥 Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | [Electron](https://electronjs.org/) v31 |
| UI framework | [React](https://react.dev/) 18 + TypeScript |
| Build tool | [electron-vite](https://electron-vite.org/) + Vite 5 |
| State & persistence | [Zustand](https://zustand-demo.pmnd.rs/) with `persist` middleware |
| Styling | Plain CSS (custom dark theme) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# Clone the repo
git clone https://github.com/Ming178-Gong/pomodoro-timer.git
cd pomodoro-timer

# Install dependencies
npm install

# Start in development mode (hot reload)
npm run dev
```

### Build for Production

```bash
npm run build
```

The packaged app will be output to the `out/` directory.

---

## 📁 Project Structure

```
pomodoro-timer/
├── src/
│   ├── main/
│   │   └── index.ts          # Electron main process (window, tray, notifications)
│   ├── preload/
│   │   └── index.ts          # IPC bridge between main and renderer
│   └── renderer/
│       └── src/
│           ├── App.tsx        # Root component + tab navigation
│           ├── components/
│           │   ├── Timer.tsx      # Circular countdown ring
│           │   ├── Stats.tsx      # 7-day chart + daily records
│           │   └── Settings.tsx   # Duration & interval settings
│           ├── store/
│           │   └── timerStore.ts  # Zustand global state (persisted)
│           └── assets/
│               └── index.css      # Dark theme styles
├── electron.vite.config.ts   # Build configuration
└── package.json
```

---

## ⌨️ Usage

| Action | How |
|---|---|
| Start / Pause | Click the big **▶ / ⏸** button |
| Reset current session | Click **↺** |
| Skip to next phase | Click **⏭** |
| Switch phase manually | Click the tabs at the top |
| Add a task label | Type in the input field below the ring |
| Minimize to tray | Click the yellow traffic light |
| Quit the app | Right-click the tray icon → Quit |

---

## 🔔 How the Pomodoro Technique Works

1. Pick a task to work on
2. Focus for **25 minutes** — no distractions
3. Take a **5-minute** short break
4. Repeat — after **4 Pomodoros**, take a **15-minute** long break
5. All durations are configurable in **Settings**

---

## 📄 License

MIT © [Ming178-Gong](https://github.com/Ming178-Gong)

---

---

# 🍅 番茄钟

一款简洁美观的桌面番茄工作法计时器，基于 Electron + React 构建。专注当下，追踪进度，养成更好的工作习惯——一个番茄一个番茄地来。

---

## ✨ 功能特性

- **圆形进度环** — 平滑动画倒计时，一眼知晓剩余时间
- **三种模式** — 专注工作（25 分钟）· 短暂休息（5 分钟）· 长时休息（15 分钟）
- **自动切换阶段** — 每次专注结束后自动进入休息，无需手动操作
- **系统托盘** — 最小化到托盘后台运行，不占用桌面空间
- **桌面通知** — 时间到时弹出系统通知提醒
- **任务标记** — 为每个番茄记录当前在做什么
- **统计数据** — 查看今日番茄数及近 7 天柱状图
- **自定义时长** — 在设置页调整所有计时时长和长休息间隔
- **数据持久化** — 重启应用后历史记录依然保留
- **原生 macOS 标题栏** — 采用 `hiddenInset` 风格集成系统交通灯按钮

---

## 🖥 技术栈

| 层级 | 技术 |
|---|---|
| 桌面壳层 | [Electron](https://electronjs.org/) v31 |
| UI 框架 | [React](https://react.dev/) 18 + TypeScript |
| 构建工具 | [electron-vite](https://electron-vite.org/) + Vite 5 |
| 状态管理 | [Zustand](https://zustand-demo.pmnd.rs/)（含持久化中间件）|
| 样式 | 纯 CSS（自定义深色主题）|

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 9

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/Ming178-Gong/pomodoro-timer.git
cd pomodoro-timer

# 安装依赖
npm install

# 以开发模式启动（支持热更新）
npm run dev
```

### 生产构建

```bash
npm run build
```

打包后的应用输出到 `out/` 目录。

---

## 📁 项目结构

```
pomodoro-timer/
├── src/
│   ├── main/
│   │   └── index.ts          # Electron 主进程（窗口、托盘、通知）
│   ├── preload/
│   │   └── index.ts          # 主进程与渲染进程的 IPC 桥接
│   └── renderer/
│       └── src/
│           ├── App.tsx        # 根组件 + 底部导航
│           ├── components/
│           │   ├── Timer.tsx      # 圆形倒计时环
│           │   ├── Stats.tsx      # 7天图表 + 今日记录
│           │   └── Settings.tsx   # 时长与间隔设置
│           ├── store/
│           │   └── timerStore.ts  # Zustand 全局状态（持久化）
│           └── assets/
│               └── index.css      # 深色主题样式
├── electron.vite.config.ts   # 构建配置
└── package.json
```

---

## ⌨️ 使用方式

| 操作 | 方法 |
|---|---|
| 开始 / 暂停 | 点击中间大按钮 **▶ / ⏸** |
| 重置当前会话 | 点击 **↺** 按钮 |
| 跳过到下一阶段 | 点击 **⏭** 按钮 |
| 手动切换阶段 | 点击顶部标签栏 |
| 添加任务标签 | 在圆环下方输入框中输入 |
| 最小化到托盘 | 点击黄色交通灯按钮 |
| 退出应用 | 右键点击托盘图标 → 退出 |

---

## 🔔 番茄工作法原理

1. 选定一项任务
2. **专注 25 分钟**——拒绝一切干扰
3. 休息 **5 分钟**
4. 重复循环——每完成 **4 个番茄**，休息 **15 分钟**
5. 所有时长均可在**设置**页面自定义

---

## 📄 开源协议

MIT © [Ming178-Gong](https://github.com/Ming178-Gong)
