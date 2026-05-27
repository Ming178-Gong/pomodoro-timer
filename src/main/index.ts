import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage, Notification } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuiting = false

function createTray() {
  // 创建 16x16 红色圆形托盘图标（使用 nativeImage 生成）
  const size = 16
  const canvas = Buffer.alloc(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const cx = size / 2, cy = size / 2, r = size / 2 - 1
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      if (dist <= r) {
        canvas[i] = 220     // R
        canvas[i + 1] = 60  // G
        canvas[i + 2] = 60  // B
        canvas[i + 3] = 255 // A
      } else {
        canvas[i + 3] = 0   // transparent
      }
    }
  }
  const icon = nativeImage.createFromBuffer(canvas, { width: size, height: size })

  tray = new Tray(icon)
  tray.setToolTip('番茄钟')

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示/隐藏',
      click: () => {
        if (mainWindow) {
          if (mainWindow.isVisible()) {
            mainWindow.hide()
          } else {
            mainWindow.show()
            mainWindow.focus()
          }
        }
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        isQuiting = true
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.focus()
      } else {
        mainWindow.show()
        mainWindow.focus()
      }
    }
  })
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 380,
    height: 580,
    show: false,
    resizable: false,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 14, y: 12 },
    backgroundColor: '#1a1a2e',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
  })

  mainWindow.on('close', (e) => {
    if (!isQuiting) {
      e.preventDefault()
      mainWindow!.hide()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// IPC 处理：发送桌面通知
ipcMain.on('notify', (_event, { title, body }: { title: string; body: string }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body, silent: false }).show()
  }
})

// IPC 处理：更新托盘提示
ipcMain.on('update-tray-tip', (_event, tip: string) => {
  if (tray) tray.setToolTip(tip)
})

// IPC 处理：窗口控制
ipcMain.on('window-minimize', () => mainWindow?.minimize())
ipcMain.on('window-close', () => mainWindow?.hide())

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.pomodoro.timer')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    } else {
      mainWindow?.show()
    }
  })
})

app.on('before-quit', () => {
  isQuiting = true
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
