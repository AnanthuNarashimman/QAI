import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import AgentPage from './AgentPage/AgentPage'
import AuditPage from './AuditPage/AuditPage'
import ReportPage from './ReportPage/ReportPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
