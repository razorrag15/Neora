import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Newspaper,
  Sparkles,
  ChevronRight,
  RefreshCw
} from 'lucide-react'
import StockCard from '@/components/stock/StockCard'
import neoraBackend from '@/services/neoraBackendService'

interface DisplayStock {
  symbol: string
  name: string
  price: number
  change: number
  change_percent: number
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  // State for market data
  const [niftyStocks, setNiftyStocks] = useState<DisplayStock[]>([])
  const [sensexStocks, setSensexStocks] = useState<DisplayStock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    loadMarketData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadMarketData()
      setLastUpdate(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  async function loadMarketData() {
    try {
      setLoading(true)
      setError(null)
      
      const dashboard = await neoraBackend.getMarketDashboard()
      
      if (dashboard) {
        // Convert backend stock data to display format
        const convertStocks = (stocks: any[]) => stocks.map(s => ({
          symbol: s.symbol,
          name: s.name,
          price: s.last_price,
          change: s.change,
          change_percent: s.change_percent
        }))
        
        // Get top 4 stocks from each index for display
        setNiftyStocks(convertStocks(dashboard.nifty_50.stocks.slice(0, 4)))
        setSensexStocks(convertStocks(dashboard.sensex.stocks.slice(0, 4)))
      }
    } catch (err: any) {
      console.error('Error loading market data:', err)
      setError(err.response?.data?.detail || err.message || 'Failed to load market data')
    } finally {
      setLoading(false)
    }
  }

  const handleStockClick = (symbol: string) => {
    // TODO: Navigate to stock detail page when implemented
    console.log('Stock clicked:', symbol)
  }

  // Convert backend stock data to StockCard format
  const convertToStockCardFormat = (stock: DisplayStock) => ({
    symbol: stock.symbol,
    name: stock.name,
    price: stock.price,
    change: stock.change,
    changePercent: stock.change_percent,
    volume: 0,
    marketCap: 0,
    pe: 0,
    data: [] // No chart data for now
  })

  // Combine top movers from both indices
  const displayStocks = [
    ...niftyStocks.slice(0, 2).map(convertToStockCardFormat),
    ...sensexStocks.slice(0, 2).map(convertToStockCardFormat)
  ]

  return (
    <div className="space-y-8 animate-fade-in relative z-10 pb-24 p-4 md:p-10">
      {/* Royal Welcome Hero */}
      <section className="relative overflow-hidden rounded-[2rem] bg-surface-primary dark:bg-surface-glass border border-border-light p-8 md:p-12 shadow-3d transition-all group">
        {/* Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-main/5 to-transparent opacity-50 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-accent-main/10 text-accent-main text-xs font-bold uppercase tracking-widest border border-accent-main/20">
                {error ? 'Market Status: Error' : loading ? 'Loading...' : 'Market Status: Live'}
              </span>
              <span className="text-xs text-text-tertiary font-medium">
                Updated {lastUpdate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-text-primary mb-4 tracking-tight leading-tight">
              Royal Market <br /><span className="bg-clip-text text-transparent bg-gradient-royal">Intelligence Suite</span>
            </h1>
            <p className="text-text-secondary text-lg font-light max-w-xl leading-relaxed">
              Welcome back, <span className="font-bold text-text-primary">{user?.full_name}</span>.
              {error ? (
                <span className="text-market-loss font-bold"> {error}</span>
              ) : (
                <> Real-time market data from <span className="font-bold text-text-primary">NIFTY 50</span> and <span className="font-bold text-text-primary">SENSEX</span>.</>
              )}
            </p>
          </div>

          {/* Net Worth Card */}
          <div className="w-full md:w-auto transform hover:scale-105 transition-transform duration-300">
            <div
              onClick={() => navigate('/portfolio')}
              className="p-6 bg-gradient-card rounded-2xl border border-border-light shadow-3d cursor-pointer group/card relative overflow-hidden min-w-[280px]"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:opacity-20 transition-opacity">
                <Briefcase size={80} className="text-accent-secondary" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-accent-main/10 rounded-lg text-accent-main">
                    <Briefcase size={18} />
                  </div>
                  <p className="text-xs text-text-secondary uppercase tracking-widest font-bold">Total Net Worth</p>
                </div>
                <p className="text-4xl font-mono font-bold text-text-primary tracking-tight mt-2">₹12,45,680</p>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-sm text-market-gain flex items-center gap-1 font-bold bg-market-gain/10 px-2 py-1 rounded-md">
                    <ArrowUpRight size={14} /> +₹28,450
                  </span>
                  <span className="text-xs text-text-tertiary">Today's P&L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Movers Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-text-primary flex items-center gap-3">
              Market Movers
              {loading && <RefreshCw size={20} className="animate-spin text-accent-main" />}
            </h2>
            <p className="text-text-tertiary mt-1">
              Top stocks from NIFTY 50 and SENSEX
            </p>
            {!loading && !error && (
              <p className="text-xs text-text-tertiary mt-1">
                Last updated: {lastUpdate.toLocaleTimeString('en-IN')}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadMarketData}
              className="px-4 py-2 rounded-full bg-surface-elevated hover:bg-accent-main hover:text-white text-text-primary text-sm font-bold transition-all shadow-sm border border-border-light flex items-center gap-2"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>

        {/* Stock Cards Grid */}
        {error ? (
          <div className="card-royal p-8 text-center">
            <p className="text-market-loss font-bold mb-2">⚠️ Backend Connection Error</p>
            <p className="text-text-secondary text-sm mb-4">{error}</p>
            <p className="text-text-tertiary text-xs">
              Please ensure the backend is running and authenticated. 
              Check the admin panel to complete TOTP authentication.
            </p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-royal p-6 animate-pulse">
                <div className="h-4 bg-surface-elevated rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-surface-elevated rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-surface-elevated rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : displayStocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayStocks.map(stock => (
              <StockCard key={stock.symbol} stock={stock} onClick={handleStockClick} />
            ))}
          </div>
        ) : (
          <div className="card-royal p-8 text-center text-text-secondary">
            No stock data available
          </div>
        )}
      </section>

      {/* Main Grid: News & Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* News Feed - Takes 8 cols */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-display font-bold text-text-primary flex items-center gap-3">
              <Newspaper size={24} className="text-accent-secondary" />
              Intelligence Feed
            </h2>
          </div>

          <div className="grid gap-6">
            {/* News section would be populated with real data from API */}
            <div className="text-center py-8 text-text-secondary">
              News feed integration coming soon
            </div>
          </div>
        </div>

        {/* Sidebar Widgets - Takes 4 cols */}
        <div className="lg:col-span-4 space-y-8">
          {/* Market Stats Widget */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-text-primary">Market Stats</h2>
            </div>
            <div className="card-royal p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">NIFTY 50 Stocks</span>
                <span className="font-mono font-bold text-text-primary">{niftyStocks.length > 0 ? '50' : '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">SENSEX Stocks</span>
                <span className="font-mono font-bold text-text-primary">{sensexStocks.length > 0 ? '30' : '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Data Source</span>
                <span className="font-bold text-market-gain text-sm">Kite Connect</span>
              </div>
            </div>
          </div>

          {/* AI Assistant Promo */}
          <div className="card-royal p-8 bg-gradient-royal text-white relative overflow-hidden border-none shadow-xl shadow-accent-glow/40 group">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold font-display mb-3">NEORA AI</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">Your personal royal financial analyst. Get instant insights on portfolio health and market trends.</p>
              <button
                className="w-full py-3.5 bg-white text-accent-main rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-1 transition-all shadow-md flex items-center justify-center gap-2"
              >
                Start Conversation <Sparkles size={14} />
              </button>
            </div>
            {/* Abstract circles */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  )
}