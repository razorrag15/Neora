import { useState, useEffect } from 'react'
import { watchlistService, type Watchlist, type RealInstrument } from '@/services/watchlistService'
import { useAuthStore } from '@/store/authStore'
import StockCard from '@/components/stock/StockCard'
import {
  Search, Plus, Trash2, TrendingUp, RefreshCw,
  Star, X, Edit2, FolderPlus, Loader2
} from 'lucide-react'

export default function WatchlistPage() {
  const { user } = useAuthStore()
  const [watchlists, setWatchlists] = useState<Watchlist[]>([])
  const [selectedWatchlist, setSelectedWatchlist] = useState<Watchlist | null>(null)
  const [instruments, setInstruments] = useState<RealInstrument[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredInstruments, setFilteredInstruments] = useState<RealInstrument[]>([])
  const [showAddStockModal, setShowAddStockModal] = useState(false)
  const [showCreateWatchlistModal, setShowCreateWatchlistModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [newWatchlistName, setNewWatchlistName] = useState('')
  const [newWatchlistDescription, setNewWatchlistDescription] = useState('')

  // Load watchlists and instruments on mount
  useEffect(() => {
    if (user) {
      loadWatchlists()
      loadInstruments()
    }
  }, [user])

  // Filter instruments as user types
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = watchlistService.searchRealStocks(instruments, searchQuery)
      setFilteredInstruments(results)
    } else {
      setFilteredInstruments([])
    }
  }, [searchQuery, instruments])

  const loadWatchlists = async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = await watchlistService.getUserWatchlists(user.id)
      setWatchlists(data)
      
      // Select default or first watchlist
      const defaultList = data.find(w => w.is_default) || data[0]
      setSelectedWatchlist(defaultList || null)
    } catch (error) {
      console.error('Failed to load watchlists:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadInstruments = async () => {
    try {
      const data = await watchlistService.getAllNSEStocks()
      setInstruments(data)
    } catch (error) {
      console.error('Failed to load instruments:', error)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadWatchlists()
    setRefreshing(false)
  }

  const handleCreateWatchlist = async () => {
    if (!user || !newWatchlistName.trim()) return
    
    try {
      await watchlistService.createWatchlist(user.id, {
        name: newWatchlistName,
        description: newWatchlistDescription || undefined,
        is_default: watchlists.length === 0 // First watchlist is default
      })
      
      await loadWatchlists()
      setShowCreateWatchlistModal(false)
      setNewWatchlistName('')
      setNewWatchlistDescription('')
    } catch (error) {
      alert('Failed to create watchlist')
    }
  }

  const handleAddStock = async (instrument: RealInstrument) => {
    if (!selectedWatchlist) return
    
    try {
      await watchlistService.addStock(selectedWatchlist.id, {
        symbol: instrument.tradingsymbol,
        exchange: instrument.exchange as 'NSE' | 'BSE'
      })
      
      await loadWatchlists()
      setShowAddStockModal(false)
      setSearchQuery('')
    } catch (error: any) {
      if (error?.response?.data?.detail?.includes('already')) {
        alert('Stock already in watchlist')
      } else {
        alert('Failed to add stock')
      }
    }
  }

  const handleRemoveStock = async (itemId: string) => {
    if (!selectedWatchlist) return
    if (!confirm('Remove this stock from watchlist?')) return
    
    try {
      await watchlistService.removeStock(selectedWatchlist.id, itemId)
      await loadWatchlists()
    } catch (error) {
      alert('Failed to remove stock')
    }
  }

  const handleDeleteWatchlist = async (watchlistId: string) => {
    if (!confirm('Delete this entire watchlist? This cannot be undone.')) return
    
    try {
      await watchlistService.deleteWatchlist(watchlistId)
      await loadWatchlists()
    } catch (error) {
      alert('Failed to delete watchlist')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold bg-gradient-main bg-clip-text text-transparent">
            My Watchlists
          </h1>
          <p className="text-text-secondary mt-1">
            {selectedWatchlist 
              ? `${selectedWatchlist.items.length} stocks • ${watchlists.length} watchlists`
              : `${watchlists.length} watchlists`
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 text-text-secondary hover:text-accent-main hover:bg-surface-elevated rounded-lg transition-colors"
            title="Refresh watchlists"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={() => setShowCreateWatchlistModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-elevated hover:bg-surface-primary text-text-primary rounded-lg transition-colors"
          >
            <FolderPlus className="w-5 h-5" />
            New Watchlist
          </button>
          
          {selectedWatchlist && (
            <button
              onClick={() => setShowAddStockModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-main text-white rounded-lg hover:shadow-glow transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Stock
            </button>
          )}
        </div>
      </div>

      {/* Watchlist Tabs */}
      {watchlists.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {watchlists.map((watchlist) => (
            <div key={watchlist.id} className="relative group">
              <button
                onClick={() => setSelectedWatchlist(watchlist)}
                className={`
                  px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2
                  ${selectedWatchlist?.id === watchlist.id
                    ? 'bg-gradient-main text-white shadow-lg'
                    : 'bg-surface-primary text-text-secondary hover:bg-surface-elevated'
                  }
                `}
              >
                {watchlist.is_default && <Star className="w-4 h-4" fill="currentColor" />}
                {watchlist.name}
                <span className="text-xs opacity-75">({watchlist.items.length})</span>
              </button>
              
              {/* Delete button (show on hover, not for default watchlist if it's the only one) */}
              {(watchlists.length > 1 || !watchlist.is_default) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteWatchlist(watchlist.id)
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete watchlist"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State - No watchlists */}
      {watchlists.length === 0 ? (
        <div className="text-center py-16 card-royal border-2 border-dashed">
          <FolderPlus className="w-16 h-16 mx-auto text-text-tertiary mb-4" />
          <h3 className="text-xl font-semibold mb-2">No watchlists yet</h3>
          <p className="text-text-secondary mb-6">
            Create your first watchlist to start tracking stocks
          </p>
          <button
            onClick={() => setShowCreateWatchlistModal(true)}
            className="px-6 py-3 bg-gradient-main text-white rounded-lg hover:shadow-glow transition-all"
          >
            Create Watchlist
          </button>
        </div>
      ) : !selectedWatchlist ? (
        <div className="text-center py-16 card-royal">
          <p className="text-text-secondary">Select a watchlist to view stocks</p>
        </div>
      ) : selectedWatchlist.items.length === 0 ? (
        /* Empty State - Watchlist has no stocks */
        <div className="text-center py-16 card-royal border-2 border-dashed">
          <TrendingUp className="w-16 h-16 mx-auto text-text-tertiary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Watchlist is empty</h3>
          <p className="text-text-secondary mb-6">
            Add stocks to "{selectedWatchlist.name}" to start tracking
          </p>
          <button
            onClick={() => setShowAddStockModal(true)}
            className="px-6 py-3 bg-gradient-main text-white rounded-lg hover:shadow-glow transition-all"
          >
            Add Stocks
          </button>
        </div>
      ) : (
        /* Stock Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedWatchlist.items.map((item) => (
            <div key={item.id} className="relative group">
              <StockCard
                stock={{
                  symbol: item.symbol,
                  name: item.symbol,
                  price: item.last_price,
                  change: item.change,
                  changePercent: item.change_percent,
                  volume: 0,
                  marketCap: '',
                  sector: '',
                  trend: item.change_percent >= 0 ? 'up' : 'down',
                  data: [] // No sparkline data for now
                }}
              />
              {/* Remove Button (shows on hover) */}
              <button
                onClick={() => handleRemoveStock(item.id)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="Remove from watchlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              {/* Show notes/targets if set */}
              {(item.notes || item.target_price || item.stop_loss) && (
                <div className="absolute bottom-2 left-2 right-2 p-2 bg-black/70 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.target_price && <div>🎯 Target: ₹{item.target_price}</div>}
                  {item.stop_loss && <div>🛑 Stop Loss: ₹{item.stop_loss}</div>}
                  {item.notes && <div>📝 {item.notes}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Watchlist Modal */}
      {showCreateWatchlistModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card-royal max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Create Watchlist</h3>
              <button
                onClick={() => {
                  setShowCreateWatchlistModal(false)
                  setNewWatchlistName('')
                  setNewWatchlistDescription('')
                }}
                className="p-2 hover:bg-surface-elevated rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Watchlist Name *</label>
                <input
                  type="text"
                  value={newWatchlistName}
                  onChange={(e) => setNewWatchlistName(e.target.value)}
                  placeholder="e.g., Long Term Picks"
                  className="w-full px-4 py-3 bg-surface-elevated rounded-lg focus:ring-2 focus:ring-accent-main"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                <textarea
                  value={newWatchlistDescription}
                  onChange={(e) => setNewWatchlistDescription(e.target.value)}
                  placeholder="e.g., Quality stocks for long-term holding"
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-elevated rounded-lg focus:ring-2 focus:ring-accent-main resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowCreateWatchlistModal(false)
                    setNewWatchlistName('')
                    setNewWatchlistDescription('')
                  }}
                  className="flex-1 px-4 py-3 bg-surface-elevated hover:bg-surface-primary rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWatchlist}
                  disabled={!newWatchlistName.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-main text-white rounded-lg hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Stock Modal */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card-royal max-w-2xl w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-border-light">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">
                  Add Stock to "{selectedWatchlist?.name}"
                </h3>
                <button
                  onClick={() => {
                    setShowAddStockModal(false)
                    setSearchQuery('')
                  }}
                  className="p-2 hover:bg-surface-elevated rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stocks by symbol or name (e.g., RELIANCE, TCS)..."
                  className="w-full pl-10 pr-4 py-3 bg-surface-elevated rounded-lg focus:ring-2 focus:ring-accent-main"
                  autoFocus
                />
              </div>
              
              {instruments.length === 0 && (
                <div className="mt-4 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading stock database...
                </div>
              )}
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-6">
              {searchQuery.length < 2 ? (
                <div className="text-center text-text-tertiary py-8">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Type at least 2 characters to search from {instruments.length.toLocaleString()} stocks...</p>
                </div>
              ) : filteredInstruments.length === 0 ? (
                <div className="text-center text-text-tertiary py-8">
                  <p>No stocks found matching "{searchQuery}"</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredInstruments.map((inst) => (
                    <button
                      key={inst.instrument_token}
                      onClick={() => handleAddStock(inst)}
                      className="w-full p-4 bg-surface-elevated hover:bg-surface-primary rounded-lg text-left transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-lg">{inst.tradingsymbol}</div>
                          <div className="text-sm text-text-secondary truncate">{inst.name}</div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-xs px-2 py-1 bg-accent-main/20 text-accent-main rounded font-medium">
                            {inst.exchange}
                          </span>
                          <Plus className="w-5 h-5 text-accent-main opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}