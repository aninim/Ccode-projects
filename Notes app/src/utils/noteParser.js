// noteParser.js
// Note schema + search logic — pure browser-safe JS, no Node.js dependencies
// Serialization (gray-matter) lives in electron.main.js (Node.js only)

import { v4 as uuidv4 } from 'uuid'

/**
 * Create a new blank note schema
 */
export function createNote(overrides = {}) {
  return {
    id: uuidv4(),
    type: 'doc_note',
    created_at: new Date().toISOString(),
    persons: [],
    project: '',
    feature: '',
    sprint: '',
    tags: [],
    priority: 'none',
    language: 'auto',
    location: '',
    weather: '',
    actions: [],
    growth_note: null,
    body: '',
    ...overrides
  }
}

/**
 * Save a note to ~/SecondBrain/notes/ via Electron IPC
 * Main process handles serialization to MD+YAML
 */
export async function saveNote(note) {
  return window.electronAPI.saveNote(note)
}

/**
 * Load all notes from ~/SecondBrain/notes/ via Electron IPC
 * Main process handles parsing — returns plain note objects
 */
export async function loadNotes() {
  return window.electronAPI.loadNotes()
}

/**
 * Filter notes by query string and optional filters
 * @param {Array} notes - already-loaded note objects
 * @param {string} query - keyword search against body + tags
 * @param {Object} filters - { person, project, tag, priority }
 */
export function searchNotes(notes, query = '', filters = {}) {
  const q = query.toLowerCase()
  return notes.filter(note => {
    if (filters.person && !note.persons?.includes(filters.person)) return false
    if (filters.project && note.project !== filters.project) return false
    if (filters.tag && !note.tags?.includes(filters.tag)) return false
    if (filters.priority && note.priority !== filters.priority) return false
    if (q) {
      const searchable = [note.body, ...(note.tags || []), note.project, note.feature].join(' ').toLowerCase()
      if (!searchable.includes(q)) return false
    }
    return true
  })
}
