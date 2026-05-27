/// <reference types="vite/client" />

interface Window {
  api: {
    notify: (title: string, body: string) => void
    updateTrayTip: (tip: string) => void
    minimizeWindow: () => void
    closeWindow: () => void
  }
}
