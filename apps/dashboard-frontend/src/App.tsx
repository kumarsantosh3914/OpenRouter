import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import PublicRoute from '@/components/PublicRoute'
import LandingPage from '@/pages/LandingPage'
import SignInPage from '@/pages/SignInPage'
import SignUpPage from '@/pages/SignUpPage'
import DashboardPage from '@/pages/DashboardPage'
import ModelsPage from '@/pages/ModelsPage'
import DocsPage from '@/pages/DocsPage'
import PricingPage from '@/pages/PricingPage'
import ApiKeysPage from '@/pages/ApiKeysPage'
import CreditsPage from '@/pages/CreditsPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public-only: authenticated users are bounced to /dashboard */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/sign-in" element={<PublicRoute><SignInPage /></PublicRoute>} />
          <Route path="/sign-up" element={<PublicRoute><SignUpPage /></PublicRoute>} />

          {/* Fully public (accessible regardless of auth) */}
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/pricing" element={<PricingPage />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/models" element={<ProtectedRoute><ModelsPage /></ProtectedRoute>} />
          <Route path="/api-keys" element={<ProtectedRoute><ApiKeysPage /></ProtectedRoute>} />
          <Route path="/credits" element={<ProtectedRoute><CreditsPage /></ProtectedRoute>} />

          {/* Catch-all → landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
