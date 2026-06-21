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
    const binaryDir = path.join(process.resourcesPath, 'backend')
    const binary = path.join(binaryDir, `qai-backend${ext}`)
    console.log(`[backend] spawning binary: ${binary}`)
    // cwd must be the binary's own directory so onedir libs resolve correctly
    backendProcess = spawn(binary, [], { cwd: binaryDir, env: backendEnv })
  }

  backendProcess.stdout.on('data', (d) => console.log('[backend]', d.toString().trimEnd()))
  backendProcess.stderr.on('data', (d) => console.error('[backend]', d.toString().trimEnd()))
  backendProcess.on('exit', (code) => console.log(`[backend] exited with code ${code}`))
}

// ── Loading splash ─────────────────────────────────────────────────────────────

function createLoadingWindow() {
  const win = new BrowserWindow({
    width: 360,
    height: 240,
    frame: false,
    resizable: false,
    center: true,
    alwaysOnTop: true,
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  })

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{display:flex;flex-direction:column;align-items:center;justify-content:center;
         height:100vh;background:#e0f2f7;font-family:-apple-system,BlinkMacSystemFont,sans-serif;
         color:#1a1a2e;-webkit-app-region:drag}
    h1{font-size:32px;font-weight:700;color:#00B4D8;letter-spacing:-1px;margin-bottom:6px}
    p{font-size:13px;color:rgba(26,26,46,0.55);margin-bottom:28px;text-align:center;
      padding:0 24px;line-height:1.5}
    .dots span{display:inline-block;width:9px;height:9px;border-radius:50%;
               background:#00B4D8;margin:0 4px;animation:b 1.2s infinite ease-in-out}
    .dots span:nth-child(2){animation-delay:.2s}
    .dots span:nth-child(3){animation-delay:.4s}
    @keyframes b{0%,80%,100%{transform:scale(0);opacity:.4}40%{transform:scale(1);opacity:1}}
  </style></head><body>
    <h1>QAI</h1>
    <p>Starting backend…<br><span style="font-size:11px">First run may take a minute to install browser drivers</span></p>
    <div class="dots"><span></span><span></span><span></span></div>
  </body></html>`

  win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
  return win
}

// ── Health poll ────────────────────────────────────────────────────────────────

// 300 retries × 1 s = 5 minutes — enough for first-run Playwright install
function waitForBackend(retries = 300, intervalMs = 1000) {
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
  const loadingWin = createLoadingWindow()
  spawnBackend()

  try {
    await waitForBackend()
    createWindow()
    loadingWin.close()
  } catch (err) {
    console.error('Fatal: backend failed to start —', err.message)
    loadingWin.close()
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
