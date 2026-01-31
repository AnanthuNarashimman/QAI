import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AgentPage from './AgentPage/AgentPage'
import AuditPage from './AuditPage/AuditPage'
import ReportPage from './ReportPage/ReportPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AgentPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
