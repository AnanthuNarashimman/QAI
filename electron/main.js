const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const http = require('http')
const fs = require('fs')
const Store = require('electron-store')

const isDev = process.argv.includes('--dev') || !app.isPackaged
const BACKEND_PORT = 5000
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`

const store = new Store({ name: 'qai-config' })

let mainWindow = null
let backendProcess = null

// ── Backend spawn ──────────────────────────────────────────────────────────────

function resolvePythonBin(backendDir) {
  const venvBin = process.platform === 'win32'
    ? path.join(backendDir, 'venv', 'Scripts', 'python.exe')
    : path.join(backendDir, 'venv', 'bin', 'python')

  return fs.existsSync(venvBin) ? venvBin : 'python3'
}

function spawnBackend() {
  const backendEnv = {
    ...process.env,
    PORT: String(BACKEND_PORT),
    HOST: '127.0.0.1',
    GEMINI_API_KEY: store.get('geminiApiKey', ''),
    ENABLE_SCREENSHOTS: 'yes',
    PYTHONUNBUFFERED: '1'
  }

  if (isDev) {
    const backendDir = path.join(__dirname, '..', 'backend')
    const python = resolvePythonBin(backendDir)
    const script = path.join(backendDir, 'app.py')
    console.log(`[backend] spawning: ${python} ${script}`)
    backendProcess = spawn(python, [script], { cwd: backendDir, env: backendEnv })
  } else {
    const ext = process.platform === 'win32' ? '.exe' : ''
    const binary = path.join(process.resourcesPath, 'backend', `qai-backend${ext}`)
    console.log(`[backend] spawning binary: ${binary}`)
    backendProcess = spawn(binary, [], { env: backendEnv })
  }

  backendProcess.stdout.on('data', (d) => console.log('[backend]', d.toString().trimEnd()))
  backendProcess.stderr.on('data', (d) => console.error('[backend]', d.toString().trimEnd()))
  backendProcess.on('exit', (code) => console.log(`[backend] exited with code ${code}`))
}

// ── Health poll ────────────────────────────────────────────────────────────────

function waitForBackend(retries = 30, intervalMs = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0

    const check = () => {
      const req = http.get(`${BACKEND_URL}/api/health`, (res) => {
        if (res.statusCode === 200) {
          console.log('[backend] ready')
          resolve()
        } else {
          retry()
        }
        res.resume()
      })
      req.on('error', retry)
      req.setTimeout(800, () => { req.destroy(); retry() })
    }

    const retry = () => {
      attempts++
      if (attempts >= retries) {
        reject(new Error(`Backend did not respond after ${retries} attempts`))
        return
      }
      setTimeout(check, intervalMs)
    }

    check()
  })
}

// ── Window ─────────────────────────────────────────────────────────────────────

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    title: 'QAI',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(process.resourcesPath, 'app', 'index.html'))
  }

  mainWindow.once('ready-to-show', () => mainWindow.show())
  mainWindow.on('closed', () => { mainWindow = null })

  // Open target="_blank" links in the system browser, not a new Electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

// ── IPC handlers ───────────────────────────────────────────────────────────────

ipcMain.handle('get-api-key', () => store.get('geminiApiKey', ''))

ipcMain.handle('set-api-key', (_, key) => {
  store.set('geminiApiKey', key)
  // Restart the backend so it picks up the new key
  if (backendProcess) {
    backendProcess.kill()
    backendProcess = null
  }
  spawnBackend()
})

ipcMain.handle('get-backend-url', () => BACKEND_URL)

// ── App lifecycle ──────────────────────────────────────────────────────────────

app.whenReady().then(async () => {
  spawnBackend()

  try {
    await waitForBackend()
    createWindow()
  } catch (err) {
    console.error('Fatal: backend failed to start —', err.message)
    app.quit()
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
  if (backendProcess) {
    backendProcess.kill()
    backendProcess = null
  }
})
