import { useState, useEffect } from 'react'
import { Shield, Key, RefreshCw, Check, X, ExternalLink, AlertCircle } from 'lucide-react'
import neoraBackend from '@/services/neoraBackendService'

export default function AdminPanel() {
  const [totpCode, setTotpCode] = useState<string>('')
  const [totpDate, setTotpDate] = useState<string>('')
  const [expiresIn, setExpiresIn] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [authStatus, setAuthStatus] = useState<{
    authenticated: boolean
    message: string
  } | null>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  async function checkAuthStatus() {
    try {
      const status = await neoraBackend.getAuthStatus()
      setAuthStatus(status)
    } catch (err) {
      console.error('Error checking auth status:', err)
    }
  }

  async function fetchTOTP() {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      const adminKey = import.meta.env.VITE_ADMIN_KEY
      const response = await neoraBackend.getCurrentTOTP(adminKey)
      
      setTotpCode(response.current_code)
      setTotpDate(response.date)
      setExpiresIn(response.expires_in_seconds)
      setSuccess('TOTP code fetched successfully!')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch TOTP code')
    } finally {
      setLoading(false)
    }
  }

  async function refreshTOTP() {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      const adminKey = import.meta.env.VITE_ADMIN_KEY
      const response = await neoraBackend.refreshTOTPCode(adminKey)
      
      setTotpCode(response.current_code)
      setTotpDate(response.date)
      setExpiresIn(response.expires_in_seconds)
      setSuccess('New TOTP code generated successfully!')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh TOTP code')
    } finally {
      setLoading(false)
    }
  }

  async function loginToKite() {
    if (!totpCode) {
      setError('Please fetch TOTP code first')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      const response = await neoraBackend.loginWithTOTP(totpCode)
      
      // Open Kite login URL in new window
      window.open(response.login_url, '_blank', 'width=800,height=600')
      
      setSuccess('Login URL opened! Complete the authentication in the new window.')
      
      // Check auth status after a delay
      setTimeout(checkAuthStatus, 5000)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate Kite login')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="card-royal p-8 bg-gradient-royal text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Control Panel</h1>
            <p className="text-white/80 text-sm">Manage TOTP authentication and Kite Connect access</p>
          </div>
        </div>
      </div>

      {/* Authentication Status */}
      <div className="card-royal p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertCircle size={20} />
            Authentication Status
          </h2>
          <button
            onClick={checkAuthStatus}
            disabled={loading}
            className="px-3 py-1 text-sm rounded-lg bg-surface-elevated hover:bg-accent-main hover:text-white transition-all flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Check
          </button>
        </div>
        
        {authStatus && (
          <div className={`flex items-center gap-3 p-4 rounded-lg ${
            authStatus.authenticated 
              ? 'bg-market-gain/10 text-market-gain' 
              : 'bg-market-loss/10 text-market-loss'
          }`}>
            {authStatus.authenticated ? <Check size={20} /> : <X size={20} />}
            <span className="font-semibold">{authStatus.message}</span>
          </div>
        )}
      </div>

      {/* Step 1: Get TOTP Code */}
      <div className="card-royal p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Key size={20} />
              Step 1: Get Today's TOTP Code
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              Generate or retrieve the current time-based one-time password
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchTOTP}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-accent-main text-white hover:bg-accent-main/90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Key size={16} />}
              Get Code
            </button>
            <button
              onClick={refreshTOTP}
              disabled={loading || !totpCode}
              className="px-4 py-2 rounded-lg bg-surface-elevated hover:bg-accent-secondary hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {totpCode && (
          <div className="bg-surface-elevated p-6 rounded-lg border-2 border-accent-main/20">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-text-tertiary mb-1">TOTP Code</p>
                <p className="text-3xl font-mono font-bold text-accent-main">{totpCode}</p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary mb-1">Valid Date</p>
                <p className="text-lg font-semibold">{totpDate}</p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary mb-1">Expires In</p>
                <p className="text-lg font-semibold">{formatTime(expiresIn)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Login to Kite */}
      <div className="card-royal p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ExternalLink size={20} />
              Step 2: Login to Kite Connect
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              Authenticate with Zerodha using the TOTP code
            </p>
          </div>
          <button
            onClick={loginToKite}
            disabled={loading || !totpCode}
            className="px-4 py-2 rounded-lg bg-gradient-main text-white hover:shadow-glow transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <ExternalLink size={16} />
            Login to Kite
          </button>
        </div>

        {!totpCode && (
          <div className="bg-surface-elevated p-4 rounded-lg text-text-tertiary text-sm">
            ⚠️ Please fetch the TOTP code first before attempting to login
          </div>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-lg bg-market-loss/10 border border-market-loss/20 text-market-loss flex items-center gap-3">
          <X size={20} />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg bg-market-gain/10 border border-market-gain/20 text-market-gain flex items-center gap-3">
          <Check size={20} />
          <span className="font-semibold">{success}</span>
        </div>
      )}

      {/* Instructions */}
      <div className="card-royal p-6 bg-surface-elevated">
        <h3 className="font-bold mb-3">Daily Workflow Instructions</h3>
        <ol className="space-y-2 text-sm text-text-secondary">
          <li className="flex gap-2">
            <span className="font-bold text-accent-main">1.</span>
            <span>Click "Get Code" to fetch today's TOTP authentication code</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-accent-main">2.</span>
            <span>Click "Login to Kite" to open the Zerodha authentication window</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-accent-main">3.</span>
            <span>Complete the login in the popup window with your Zerodha credentials</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-accent-main">4.</span>
            <span>Once authenticated, the dashboard will have access to real-time market data</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-accent-main">5.</span>
            <span>Authentication is valid for the entire trading day (9:15 AM - 3:30 PM IST)</span>
          </li>
        </ol>
      </div>
    </div>
  )
}