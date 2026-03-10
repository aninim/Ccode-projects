// Second Brain — Notes App
// Root component — Phase 1 MVP

import { useState } from 'react'
import CaptureForm from './capture/CaptureForm'
import FeedView from './views/FeedView'
import EODView from './views/EODView'

export default function App() {
  const [view, setView] = useState('capture')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleNoteSaved = () => {
    setRefreshKey(k => k + 1)
    setView('feed')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex gap-4">
        {['capture', 'feed', 'eod', 'team', 'project', 'triage'].map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1 rounded text-sm font-medium ${view === v ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'}`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </nav>

      {/* Views */}
      <main className="p-6">
        {view === 'capture' && <CaptureForm onNoteSaved={handleNoteSaved} />}
        {view === 'feed' && <FeedView refreshKey={refreshKey} />}
        {view === 'eod' && <EODView onNoteSaved={handleNoteSaved} />}
        {/* Phase 3: TeamView, ProjectView, TriageView */}
      </main>
    </div>
  )
}
