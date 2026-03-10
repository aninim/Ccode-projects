// Electron preload — exposes safe IPC bridge to renderer via contextBridge
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  saveNote: (filename, content) => ipcRenderer.invoke('note:save', filename, content),
  loadNotes: () => ipcRenderer.invoke('note:loadAll'),
  updateIndex: (type, value) => ipcRenderer.invoke('index:update', type, value),
  loadIndex: (type) => ipcRenderer.invoke('index:load', type)
})
