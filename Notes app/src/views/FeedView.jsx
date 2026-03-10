// FeedView.jsx — Phase 1
// Chronological list of all notes with filters: person, project, priority, keyword

import { useState, useEffect } from 'react'
import { loadNotes, searchNotes } from '../utils/noteParser'

const TEAM_MEMBERS = ['Oren', 'Tom', 'Avner', 'Eliyahu', 'Corinne', 'Aviram', 'Ayman']
const PROJECTS = ['RDS', 'ETL', 'FDM', 'OMPS', 'SimRig', 'SyntheticData', 'Roadmap']

const PRIORITY_BADGE = {
  urgent:   { label: '🔴 Urgent',    cls: 'bg-red-100 text-red-700' },
  followup: { label: '🟡 Follow-up', cls: 'bg-yellow-100 text-yellow-700' },
  fyi:      { label: '🟢 FYI',       cls: 'bg-green-100 text-green-700' },
  none:     { label: null, cls: '' },
}

function NoteCard({ note }) {
  const preview = note.body?.slice(0, 150) + (note.body?.length > 150 ? '…' : '')
  const date = note.created_at ? new Date(note.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''
  const priority = PRIORITY_BADGE[note.priority] || PRIORITY_BADGE.none

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-400">{date}</span>
        {note.project && (
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">{note.project}</span>
        )}
        {note.persons?.map(p => (
          <span key={p} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{p}</span>
        ))}
        {priority.label && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priority.cls}`}>{priority.label}</span>
        )}
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{preview}</p>

      {note.tags?.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {note.tags.map(t => (
            <span key={t} className="text-xs text-blue-500">#{t}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FeedView() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ person: '', project: '', priority: '' })

  useEffect(() => {
    loadNotes()
      .then(loaded => {
        // newest first
        loaded.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        setNotes(loaded)
      })
      .catch(() => setError('Could not load notes — is the Electron app running?'))
      .finally(() => setLoading(false))
  }, [])

  const visible = searchNotes(notes, query, {
    person: filters.person || undefined,
    project: filters.project || undefined,
    priority: filters.priority || undefined,
  })

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">📋 Notes Feed</h2>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="🔍 Search notes..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm flex-1 min-w-48 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={filters.person}
          onChange={e => setFilters(f => ({ ...f, person: e.target.value }))}
          className="border rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="">All people</option>
          {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          value={filters.project}
          onChange={e => setFilters(f => ({ ...f, project: e.target.value }))}
          className="border rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="">All projects</option>
          {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={filters.priority}
          onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
          className="border rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="">All priorities</option>
          <option value="urgent">🔴 Urgent</option>
          <option value="followup">🟡 Follow-up</option>
          <option value="fyi">🟢 FYI</option>
        </select>
        {(query || filters.person || filters.project || filters.priority) && (
          <button
            onClick={() => { setQuery(''); setFilters({ person: '', project: '', priority: '' }) }}
            className="text-xs text-gray-400 hover:text-gray-600 px-2"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Content */}
      {loading && <p className="text-sm text-gray-400">Loading notes...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && visible.length === 0 && (
        <p className="text-sm text-gray-400">
          {notes.length === 0 ? 'No notes yet — capture your first one!' : 'No notes match your filters.'}
        </p>
      )}
      {!loading && !error && (
        <div className="space-y-3">
          {visible.map(note => <NoteCard key={note.id || note._filename} note={note} />)}
        </div>
      )}
      {!loading && !error && visible.length > 0 && (
        <p className="text-xs text-gray-400 text-right">{visible.length} of {notes.length} notes</p>
      )}
    </div>
  )
}
