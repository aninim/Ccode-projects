// Electron preload — exposes safe IPC bridge to renderer via contextBridge
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  saveNote: (note) => ipcRenderer.invoke('note:save', note),
  loadNotes: () => ipcRenderer.invoke('note:loadAll'),
  updateIndex: (type, value) => ipcRenderer.invoke('index:update', type, value),
  loadIndex: (type) => ipcRenderer.invoke('index:load', type)
})
