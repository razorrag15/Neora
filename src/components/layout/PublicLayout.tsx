import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Crown, Menu, X, Moon, Sun } from 'lucide-react'
import BackgroundEffects from './BackgroundEffects'

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if dark mode is already enabled
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true)
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen bg-bg-primary relative">
      {/* Background Effects */}
      <BackgroundEffects />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-primary/80 dark:bg-surface-glass backdrop-blur-lg border-b border-border-light">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Crown className="w-8 h-8 text-accent-main group-hover:text-accent-secondary transition-colors" />
                <div className="absolute inset-0 blur-lg bg-accent-main opacity-20 group-hover:opacity-40 transition-opacity"></div>
              </div>
              <span className="text-2xl font-display font-bold bg-gradient-royal bg-clip-text text-transparent">
                NEORA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/market" className="text-text-secondary hover:text-accent-main transition-colors">
                Market
              </Link>
              <Link to="/pricing" className="text-text-secondary hover:text-accent-main transition-colors">
                Pricing
              </Link>
              
              <button
                onClick={toggleTheme}
                className="p-2.5 text-text-secondary hover:text-accent-main hover:bg-surface-elevated rounded-xl transition-all"
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <Link
                to="/login"
                className="px-4 py-2 text-text-secondary hover:text-accent-main transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-main text-white rounded-lg hover:shadow-glow transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-elevated"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border-light">
              <div className="flex flex-col space-y-4">
                <Link to="/market" className="text-text-secondary hover:text-accent-main transition-colors">
                  Market
                </Link>
                <Link to="/pricing" className="text-text-secondary hover:text-accent-main transition-colors">
                  Pricing
                </Link>
                <button
                  onClick={toggleTheme}
                  className="text-left text-text-secondary hover:text-accent-main transition-colors flex items-center gap-2"
                >
                  {isDark ? <><Sun size={16} /> Light Mode</> : <><Moon size={16} /> Dark Mode</>}
                </button>
                <Link to="/login" className="text-text-secondary hover:text-accent-main transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-main text-white rounded-lg hover:shadow-glow transition-all text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-16 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface-primary border-t border-border-light mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Crown className="w-6 h-6 text-accent-main" />
                <span className="text-xl font-display font-bold">NEORA Intelligence</span>
              </div>
              <p className="text-text-secondary text-sm">
                Your royal companion for Indian stock market intelligence.
                Real-time data, AI insights, and comprehensive analytics.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link to="/market" className="hover:text-accent-main">Market Data</Link></li>
                <li><Link to="/pricing" className="hover:text-accent-main">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><a href="#" className="hover:text-accent-main">About</a></li>
                <li><a href="#" className="hover:text-accent-main">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border-light text-center text-sm text-text-tertiary">
            <p>© 2024 NEORA Intelligence. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}