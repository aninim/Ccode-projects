const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')
const matter = require('gray-matter')

const STORAGE_ROOT = path.join(os.homedir(), 'SecondBrain')
const NOTES_DIR = path.join(STORAGE_ROOT, 'notes')
const INDEX_DIR = path.join(STORAGE_ROOT, 'index')

function ensureDirs() {
  [NOTES_DIR, INDEX_DIR].forEach(dir => fs.mkdirSync(dir, { recursive: true }))
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // Use dev server if dist hasn't been built yet
  const distIndex = path.join(__dirname, 'dist', 'index.html')
  if (fs.existsSync(distIndex)) {
    win.loadFile(distIndex)
  } else {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  }
}

// IPC: save a note — receives plain note object, serializes to MD+YAML here (Node.js only)
ipcMain.handle('note:save', (_event, note) => {
  ensureDirs()
  const date = note.created_at.slice(0, 10)
  const project = (note.project || 'general').toLowerCase().replace(/\s+/g, '-')
  const shortId = note.id.slice(0, 8)
  const filename = `${date}_${project}_${shortId}.md`
  const { body, ...frontMatter } = note
  const content = matter.stringify(body || '', frontMatter)
  const filePath = path.join(NOTES_DIR, filename)
  fs.writeFileSync(filePath, content, 'utf8')
  return { ok: true, path: filePath }
})

// IPC: load all notes — parses MD+YAML here, returns plain note objects to renderer
ipcMain.handle('note:loadAll', () => {
  ensureDirs()
  const files = fs.readdirSync(NOTES_DIR).filter(f => f.endsWith('.md'))
  return files.map(f => {
    const raw = fs.readFileSync(path.join(NOTES_DIR, f), 'utf8')
    const { data, content } = matter(raw)
    return { ...data, body: content.trim(), _filename: f }
  })
})

// IPC: update an index file (persons / projects / tags)
ipcMain.handle('index:update', (_event, type, value) => {
  ensureDirs()
  const indexPath = path.join(INDEX_DIR, `${type}.json`)
  let list = []
  if (fs.existsSync(indexPath)) {
    try { list = JSON.parse(fs.readFileSync(indexPath, 'utf8')) } catch { list = [] }
  }
  if (!list.includes(value)) {
    list.push(value)
    fs.writeFileSync(indexPath, JSON.stringify(list, null, 2), 'utf8')
  }
  return list
})

// IPC: load an index file
ipcMain.handle('index:load', (_event, type) => {
  const indexPath = path.join(INDEX_DIR, `${type}.json`)
  if (!fs.existsSync(indexPath)) return []
  try { return JSON.parse(fs.readFileSync(indexPath, 'utf8')) } catch { return [] }
})

app.whenReady().then(() => {
  ensureDirs()
  createWindow()
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
