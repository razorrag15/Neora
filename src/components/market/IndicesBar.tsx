import { useEffect, useState } from 'react'
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react'
import neoraBackend, { type IndexData } from '@/services/neoraBackendService'

export default function IndicesBar() {
  const [nifty, setNifty] = useState<IndexData | null>(null)
  const [sensex, setSensex] = useState<IndexData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    loadIndices()

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadIndices, 30000)
    return () => clearInterval(interval)
  }, [])

  async function loadIndices() {
    try {
      setLoading(true)
      
      const dashboard = await neoraBackend.getMarketDashboard()
      
      if (dashboard) {
        setNifty(dashboard.nifty_50)
        setSensex(dashboard.sensex)
        setError(false)
      }
    } catch (err) {
      console.error('Error loading indices:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  // Create indices array for display
  const indices = []
  if (nifty) {
    indices.push({
      name: nifty.symbol,
      value: nifty.last_value,
      change: nifty.change,
      changePercent: nifty.change_percent,
      color: nifty.change >= 0 ? 'green' : 'red'
    })
  }
  if (sensex) {
    indices.push({
      name: sensex.symbol,
      value: sensex.last_value,
      change: sensex.change,
      changePercent: sensex.change_percent,
      color: sensex.change >= 0 ? 'green' : 'red'
    })
  }

  return (
    <div className="w-full bg-surface-primary/80 dark:bg-surface-glass backdrop-blur-lg border-b border-border-light overflow-hidden whitespace-nowrap py-3 hidden md:flex z-20 shadow-sm relative">
      <div className="flex items-center animate-marquee space-x-16 px-4">
        {/* Show message if error */}
        {error && !loading && (
          <div className="text-sm text-text-secondary px-4">
            <span className="font-bold text-text-tertiary">⚠️ Data unavailable</span>
          </div>
        )}

        {/* Show indices if available */}
        {indices.length > 0 && [...indices, ...indices, ...indices].map((index, i) => (
          <div key={`${index.name}-${i}`} className="flex items-center space-x-3 text-sm group cursor-pointer">
            <span className="font-bold text-text-secondary group-hover:text-accent-main transition-colors font-display tracking-wider">
              {index.name}
            </span>
            <span className="font-mono text-text-primary font-semibold">
              {index.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`flex items-center font-bold text-xs px-2 py-0.5 rounded-full ${
                index.color === 'green'
                  ? 'text-market-gain bg-market-gain/10'
                  : 'text-market-loss bg-market-loss/10'
              }`}>
              {index.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(index.changePercent).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* Status indicator */}
      <div className="absolute right-28 top-1/2 -translate-y-1/2 z-20">
        <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-surface-elevated">
          <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
          <span className={`w-2 h-2 rounded-full ${
            !error && indices.length > 0 ? 'bg-market-gain animate-pulse' : 'bg-text-tertiary'
          }`} />
          <span className="text-text-tertiary">
            {loading ? 'LOADING' : error ? 'ERROR' : 'LIVE'}
          </span>
        </div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none"></div>
    </div>
  )
}