import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Layouts
import PublicLayout from '@/components/layout/PublicLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'

// Route Guards
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminRoute from '@/components/auth/AdminRoute'

// Public Pages
import Landing from '@/pages/public/Landing'

// Auth Pages
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// Protected Pages
import Dashboard from '@/pages/dashboard/Dashboard'
import Watchlist from '@/pages/watchlist/Watchlist'

// Admin Pages
import AdminPanel from '@/pages/admin/AdminPanel'

// Placeholder components for routes we haven't built yet
const MarketOverview = () => (
  <div className="p-6">
    <h1 className="text-3xl font-display font-bold mb-4">Market Overview</h1>
    <p className="text-text-secondary">Coming soon...</p>
  </div>
)

const Portfolio = () => (
  <div className="p-6">
    <h1 className="text-3xl font-display font-bold mb-4">Portfolio</h1>
    <p className="text-text-secondary">Portfolio management coming soon...</p>
  </div>
)

const Profile = () => {
  const { user } = useAuthStore()
  return (
    <div className="p-6">
      <h1 className="text-3xl font-display font-bold mb-4">Profile</h1>
      <div className="card-royal p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-secondary">Name</label>
            <p className="text-lg font-semibold">{user?.full_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary">Email</label>
            <p className="text-lg font-semibold">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary">Role</label>
            <p className="text-lg font-semibold capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const Pricing = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="max-w-4xl w-full text-center">
      <h1 className="text-4xl font-display font-bold mb-4">Pricing</h1>
      <p className="text-xl text-text-secondary mb-8">Simple, transparent pricing for everyone</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card-royal p-8">
          <h3 className="text-2xl font-bold mb-2">Free</h3>
          <p className="text-4xl font-bold mb-4">₹0<span className="text-lg text-text-tertiary">/mo</span></p>
          <ul className="text-left space-y-2 mb-6">
            <li>✓ Real-time market data</li>
            <li>✓ Basic portfolio tracking</li>
            <li>✓ Watchlist (up to 5)</li>
            <li>✓ AI assistant (limited)</li>
          </ul>
          <button className="w-full py-3 bg-surface-elevated rounded-lg font-semibold">Current Plan</button>
        </div>
        <div className="card-royal p-8 border-2 border-accent-main">
          <div className="inline-block px-3 py-1 bg-accent-main text-white text-xs font-bold rounded-full mb-2">POPULAR</div>
          <h3 className="text-2xl font-bold mb-2">Pro</h3>
          <p className="text-4xl font-bold mb-4">₹499<span className="text-lg text-text-tertiary">/mo</span></p>
          <ul className="text-left space-y-2 mb-6">
            <li>✓ Everything in Free</li>
            <li>✓ Unlimited watchlists</li>
            <li>✓ Advanced analytics</li>
            <li>✓ Priority AI assistant</li>
            <li>✓ Premium research reports</li>
          </ul>
          <button className="w-full py-3 bg-gradient-main text-white rounded-lg font-semibold hover:shadow-glow transition-all">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  </div>
)


function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/market" element={<MarketOverview />} />
          <Route path="/pricing" element={<Pricing />} />
        </Route>

        {/* Auth Routes - No Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute><DashboardLayout /></AdminRoute>}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App