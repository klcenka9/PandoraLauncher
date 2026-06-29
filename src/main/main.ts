import { app, BrowserWindow, dialog } from 'electron'
import path from 'path'
import { autoUpdater } from 'electron-updater'

let mainWindow: BrowserWindow | null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const isDev = process.env.NODE_ENV === 'development'
  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../../dist/index.html')}`

  mainWindow.loadURL(startUrl)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()

  if (!app.isPackaged) {
    return
  }

  autoUpdater.checkForUpdatesAndNotify().catch((err) => {
    console.error('Auto-update check failed:', err)
  })
})

autoUpdater.on('update-downloaded', async () => {
  const { response } = await dialog.showMessageBox({
    type: 'info',
    title: 'Aktualizace stažena',
    message: 'Nová verze Pandora Launcher byla stažena. Restartovat nyní a nainstalovat?',
    buttons: ['Restartovat nyní', 'Později'],
    defaultId: 0,
    cancelId: 1,
  })

  if (response === 0) {
    autoUpdater.quitAndInstall()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
