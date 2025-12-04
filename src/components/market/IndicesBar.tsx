import { useEffect, useState } from 'react'
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react'
import marketDataService from '@/services/marketDataService'
import type { IndexQuote } from '@/services/nseService'

export default function IndicesBar() {
  const [indices, setIndices] = useState<IndexQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    loadIndices()

    // Auto-refresh every 10 seconds
    const cleanup = marketDataService.startAutoRefresh(loadIndices, 10000)
    return cleanup
  }, [])

  async function loadIndices() {
    try {
      const data = await marketDataService.getIndices()
      if (data && data.length > 0) {
        setIndices(data)
        setError(false)
      } else {
        // Fallback to mock data if no real data
        setError(true)
      }
    } catch (err) {
      console.error('Error loading indices:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  // Use real data only
  const displayIndices = indices.length > 0 ? indices : []

  return (
    <div className="w-full bg-surface-primary/80 dark:bg-surface-glass backdrop-blur-lg border-b border-border-light overflow-hidden whitespace-nowrap py-3 hidden md:flex z-20 shadow-sm relative">
      <div className="flex items-center animate-marquee space-x-16 px-4">
        {/* Duplicate for seamless scrolling */}
        {[...displayIndices, ...displayIndices, ...displayIndices].map((index, i) => (
          <div key={`${index.index}-${i}`} className="flex items-center space-x-3 text-sm group cursor-pointer">
            <span className="font-bold text-text-secondary group-hover:text-accent-main transition-colors font-display tracking-wider">
              {index.index}
            </span>
            <span className="font-mono text-text-primary font-semibold">
              {index.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`flex items-center font-bold text-xs px-2 py-0.5 rounded-full ${index.pChange >= 0
                ? 'text-market-gain bg-market-gain/10'
                : 'text-market-loss bg-market-loss/10'
              }`}>
              {index.pChange >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(index.pChange).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* Status indicator */}
      <div className="absolute right-28 top-1/2 -translate-y-1/2 z-20">
        <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-surface-elevated">
          <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
          <span className={`w-2 h-2 rounded-full ${!error ? 'bg-market-gain animate-pulse' : 'bg-text-tertiary'
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