import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SkipToMain, useAnnouncement } from './components/Accessibility'
import { Toaster } from '@/components/ui/sonner'
import LandingPage from './pages/LandingPage'
import FeedbackPage from './pages/FeedbackPage'
import DashboardPage from './pages/DashboardPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import UserLookupPage from './pages/UserLookupPage'

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  const { AnnouncementRegion } = useAnnouncement()

  return (
    <ErrorBoundary>
      <Router>
        <SkipToMain />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Route for giving feedback, potentially with a user identifier */}
            <Route path="/ke" element={<UserLookupPage />} /> {/* Changed from /beri-feedback */}
            <Route path="/ke/:userId" element={<FeedbackPage />} /> {/* Changed from /beri-feedback/:userId */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* Add route for forgot password */}
            {/* Add a redirect for any other path to the landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <AnnouncementRegion />
        <Toaster />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
