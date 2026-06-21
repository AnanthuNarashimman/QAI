import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import AgentPage from './AgentPage/AgentPage'
import AuditPage from './AuditPage/AuditPage'
import ReportPage from './ReportPage/ReportPage'
import ResourcesPage from './ResourcesPage/ResourcesPage'
import HistoryPage from './HistoryPage/HistoryPage'
import SettingsPage from './SettingsPage/SettingsPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/agent" replace />} />
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
