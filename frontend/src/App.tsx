import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import {
  HomePage,
  CreateGoalPage,
  SubmitProofPage,
  DashboardPage,
} from './pages'
import { ToastContainer } from './components/Toast'
import { ToastProvider, useToast } from './contexts/ToastContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ErrorBoundary } from './components/ErrorBoundary'

function AppContent() {
  const { toasts, removeToast } = useToast()

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-goal" element={<CreateGoalPage />} />
        <Route path="/submit-proof" element={<SubmitProofPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
