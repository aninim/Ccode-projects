// indexManager.js
// Maintain persons / projects / tags indexes in ~/SecondBrain/index/
// All file I/O delegated to Electron main process via window.electronAPI

/**
 * Add a value to an index if not already present
 * @param {'persons'|'projects'|'tags'} type
 * @param {string} value
 */
export async function updateIndex(type, value) {
  if (!value) return
  return window.electronAPI.updateIndex(type, value)
}

/**
 * Update all relevant indexes from a saved note
 */
export async function updateIndexFromNote(note) {
  const ops = []
  if (note.project) ops.push(updateIndex('projects', note.project))
  if (note.persons?.length) note.persons.forEach(p => ops.push(updateIndex('persons', p)))
  if (note.tags?.length) note.tags.forEach(t => ops.push(updateIndex('tags', t)))
  await Promise.all(ops)
}

/**
 * Load an index list (for autocomplete suggestions)
 * @param {'persons'|'projects'|'tags'} type
 * @returns {Promise<string[]>}
 */
export async function loadIndex(type) {
  return window.electronAPI.loadIndex(type)
}
