// EODView.jsx — End-of-Day debrief
// Phase 1: 3 guided questions → saved as daily note
// Phase 2: AI (Copilot) will structure answers + extract action items

import { useState } from 'react'
import { createNote, saveNote } from '../utils/noteParser'
import { updateIndexFromNote } from '../utils/indexManager'
import { EOD_QUESTIONS } from '../automation/eodPrompt'

const EMPTY = { 0: '', 1: '', 2: '' }

export default function EODView({ onNoteSaved }) {
  const [answers, setAnswers] = useState(EMPTY)
  const [status, setStatus] = useState(null) // null | 'saving' | 'saved' | 'error'

  const allAnswered = EOD_QUESTIONS.every((_, i) => answers[i].trim())

  const handleSave = async () => {
    if (!allAnswered) return
    setStatus('saving')
    try {
      const body = EOD_QUESTIONS
        .map((q, i) => `**${q}**\n${answers[i].trim()}`)
        .join('\n\n')

      const note = createNote({
        type: 'eod_note',
        body,
        tags: ['eod'],
        priority: 'none',
      })

      await saveNote(note)
      await updateIndexFromNote(note)

      setAnswers(EMPTY)
      setStatus('saved')
      setTimeout(() => { setStatus(null); onNoteSaved?.() }, 1500)
    } catch (err) {
      console.error('EOD save error:', err)
      setStatus('error')
    }
  }

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long' })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">

        <div>
          <h2 className="text-lg font-semibold text-gray-800">🌙 End of Day</h2>
          <p className="text-xs text-gray-400 mt-0.5">{today}</p>
        </div>

        {EOD_QUESTIONS.map((q, i) => (
          <div key={i}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="text-blue-500 mr-1">{i + 1}.</span> {q}
            </label>
            <textarea
              rows={3}
              value={answers[i]}
              onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))}
              placeholder="Your answer..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSave}
            disabled={!allAnswered || status === 'saving'}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'saving' ? 'Saving...' : 'Save EOD Note'}
          </button>
          {status === 'saved' && <span className="text-sm text-green-600 font-medium">✓ Saved</span>}
          {status === 'error' && <span className="text-sm text-red-500">Save failed</span>}
          {!allAnswered && status === null && (
            <span className="text-xs text-gray-400">Answer all 3 to save</span>
          )}
        </div>

      </div>
    </div>
  )
}
