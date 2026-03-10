// CaptureForm.jsx
// Phase 1: 3 mandatory fields + optional fields below text box
// Rule: NEVER add more mandatory fields. Keep capture friction minimal.

import { useState } from 'react'
import { createNote, saveNote } from '../utils/noteParser'
import { updateIndexFromNote } from '../utils/indexManager'

const TEAM_MEMBERS = ['Oren', 'Tom', 'Avner', 'Eliyahu', 'Corinne', 'Aviram', 'Ayman']
const PROJECTS = ['RDS', 'ETL', 'FDM', 'OMPS', 'SimRig', 'SyntheticData', 'Roadmap']

const EMPTY_FORM = {
  persons: [],
  project: '',
  body: '',
  feature: '',
  tags: '',
  priority: 'none',
  location: '',
  growthNote: { person: '', type: '', observation: '' },
  actions: []
}

export default function CaptureForm({ onNoteSaved }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState(null) // null | 'saving' | 'saved' | 'error'
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.persons.length) e.persons = 'Select at least one person'
    if (!form.project) e.project = 'Select a project'
    if (!form.body.trim()) e.body = 'Notes cannot be empty'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setStatus('saving')
    try {
      const tags = form.tags
        .split(/[\s,]+/)
        .map(t => t.replace(/^#/, '').trim())
        .filter(Boolean)

      const growthNote = form.growthNote.person && form.growthNote.observation
        ? { person: form.growthNote.person, type: form.growthNote.type || 'observation', observation: form.growthNote.observation }
        : null

      const note = createNote({
        persons: form.persons,
        project: form.project,
        body: form.body.trim(),
        feature: form.feature,
        tags,
        priority: form.priority,
        location: form.location,
        growth_note: growthNote,
      })

      await saveNote(note)
      await updateIndexFromNote(note)

      setForm(EMPTY_FORM)
      setStatus('saved')
      setTimeout(() => { setStatus(null); onNoteSaved?.() }, 1200)
    } catch (err) {
      console.error('Save error:', err)
      setStatus('error')
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">📝 New Note</h2>

      {/* MANDATORY FIELDS — top */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">👤 Person(s) *</label>
          <select
            multiple
            value={form.persons}
            className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.persons ? 'border-red-400' : ''}`}
            onChange={e => setForm(f => ({ ...f, persons: [...e.target.selectedOptions].map(o => o.value) }))}
          >
            {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {errors.persons && <p className="text-xs text-red-500 mt-1">{errors.persons}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">🗂 Project *</label>
          <select
            value={form.project}
            className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.project ? 'border-red-400' : ''}`}
            onChange={e => setForm(f => ({ ...f, project: e.target.value }))}
          >
            <option value="">Select project...</option>
            {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {errors.project && <p className="text-xs text-red-500 mt-1">{errors.project}</p>}
        </div>
      </div>

      {/* FREE TEXT — mandatory */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">📝 Notes * <span className="text-gray-400">(type, paste, or dictate)</span></label>
        <textarea
          rows={8}
          value={form.body}
          className={`w-full border rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.body ? 'border-red-400' : ''}`}
          placeholder="What happened? What was decided? What's next?..."
          onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
        />
        {errors.body && <p className="text-xs text-red-500 mt-1">{errors.body}</p>}
      </div>

      {/* OPTIONAL FIELDS — below text box */}
      <details className="text-sm text-gray-500 cursor-pointer">
        <summary className="font-medium text-gray-600 hover:text-blue-600">+ Optional fields</summary>
        <div className="mt-3 space-y-3 pl-2">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Feature" value={form.feature} className="border rounded-lg px-3 py-2 text-sm w-full"
              onChange={e => setForm(f => ({ ...f, feature: e.target.value }))} />
            <input placeholder="#tags (space separated)" value={form.tags} className="border rounded-lg px-3 py-2 text-sm w-full"
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.priority} className="border rounded-lg px-3 py-2 text-sm w-full"
              onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              <option value="none">⬜ Priority</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="followup">🟡 Follow-up</option>
              <option value="fyi">🟢 FYI</option>
            </select>
            <input placeholder="📍 Location / link" value={form.location} className="border rounded-lg px-3 py-2 text-sm w-full"
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
          {/* Growth Note */}
          <div className="bg-blue-50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-blue-700">📊 Growth Note</p>
            <div className="grid grid-cols-3 gap-2">
              <select value={form.growthNote.person} className="border rounded px-2 py-1 text-sm"
                onChange={e => setForm(f => ({ ...f, growthNote: { ...f.growthNote, person: e.target.value } }))}>
                <option value="">Person</option>
                {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={form.growthNote.type} className="border rounded px-2 py-1 text-sm"
                onChange={e => setForm(f => ({ ...f, growthNote: { ...f.growthNote, type: e.target.value } }))}>
                <option value="">Type</option>
                <option value="strength">Strength</option>
                <option value="improvement">Improvement</option>
                <option value="observation">Observation</option>
              </select>
              <input placeholder="Observation" value={form.growthNote.observation} className="border rounded px-2 py-1 text-sm"
                onChange={e => setForm(f => ({ ...f, growthNote: { ...f.growthNote, observation: e.target.value } }))} />
            </div>
          </div>
        </div>
      </details>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={status === 'saving'}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'saving' ? 'Saving...' : 'Save Note'}
        </button>
        <button className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50">
          🎙 Voice
        </button>
        {/* Phase 2: VoiceInput component goes here */}
        {status === 'saved' && <span className="text-sm text-green-600 font-medium">✓ Note saved</span>}
        {status === 'error' && <span className="text-sm text-red-500">Save failed — check app is running</span>}
      </div>
    </div>
  )
}
