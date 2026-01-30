import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AgentPage from './AgentPage/AgentPage'
import AuditPage from './AuditPage/AuditPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AgentPage />} />
        <Route path="/audit" element={<AuditPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
