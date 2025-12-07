import { neoraBackendService } from './neoraBackendService'

export interface RealInstrument {
  instrument_token: number
  exchange_token: number
  tradingsymbol: string
  name: string
  exchange: string
  segment: string
  instrument_type: string
  last_price: number
  tick_size: number
  lot_size: number
}

export interface WatchlistItem {
  id: string
  symbol: string
  exchange: 'NSE' | 'BSE'
  last_price: number
  change: number
  change_percent: number
  color: string
  notes?: string
  target_price?: number
  stop_loss?: number
  added_at: string
}

export interface Watchlist {
  id: string
  name: string
  description?: string
  is_default: boolean
  created_at: string
  items: WatchlistItem[]
}

export interface WatchlistCreateData {
  name: string
  description?: string
  is_default?: boolean
}

export interface WatchlistItemCreateData {
  symbol: string
  exchange?: 'NSE' | 'BSE'
  notes?: string
  target_price?: number
  stop_loss?: number
}

class WatchlistService {
  private instrumentsCache: RealInstrument[] = []
  private cacheTimestamp: number = 0
  private CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

  /**
   * Get ALL real NSE equity stocks from Kite Connect.
   * This fetches 100% REAL data, no mocks.
   * Results are cached for 24 hours for performance.
   */
  async getAllNSEStocks(): Promise<RealInstrument[]> {
    const now = Date.now()
    
    // Return cached data if still valid
    if (this.instrumentsCache.length > 0 && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      console.log(`✅ Using cached ${this.instrumentsCache.length} real stocks`)
      return this.instrumentsCache
    }
    
    try {
      console.log('📡 Fetching REAL stocks from Kite Connect...')
      
      // Fetch from backend (which fetches from Kite Connect)
      const response = await neoraBackendService.get<RealInstrument[]>(
        '/api/v1/market/instruments?exchange=NSE&instrument_type=EQ'
      )
      
      this.instrumentsCache = response
      this.cacheTimestamp = now
      
      console.log(`✅ Loaded ${response.length} REAL NSE equity stocks from Kite Connect`)
      return response
      
    } catch (error) {
      console.error('❌ Failed to fetch real stocks:', error)
      throw new Error('Failed to load stock list. Please ensure backend is authenticated.')
    }
  }

  /**
   * Get ALL real BSE equity stocks from Kite Connect.
   */
  async getAllBSEStocks(): Promise<RealInstrument[]> {
    try {
      console.log('📡 Fetching BSE stocks from Kite Connect...')
      const response = await neoraBackendService.get<RealInstrument[]>(
        '/api/v1/market/instruments?exchange=BSE&instrument_type=EQ'
      )
      
      console.log(`✅ Loaded ${response.length} REAL BSE equity stocks`)
      return response
      
    } catch (error) {
      console.error('❌ Failed to fetch BSE stocks:', error)
      throw error
    }
  }

  /**
   * Search real stocks by symbol or name.
   * Searches locally in cached data for instant results.
   */
  searchRealStocks(stocks: RealInstrument[], query: string): RealInstrument[] {
    if (!query || query.length < 2) return []
    
    const term = query.toUpperCase()
    
    // Search by symbol or name
    const results = stocks.filter(stock =>
      stock.tradingsymbol.includes(term) ||
      stock.name.toUpperCase().includes(term)
    )
    
    // Limit to 50 results for performance
    return results.slice(0, 50)
  }

  /**
   * Get all watchlists for user with live data
   */
  async getUserWatchlists(userId: string): Promise<Watchlist[]> {
    try {
      const response = await neoraBackendService.get<Watchlist[]>(
        `/api/v1/market/watchlists/${userId}`
      )
      return response
    } catch (error) {
      console.error('Failed to fetch watchlists:', error)
      throw error
    }
  }

  /**
   * Create new watchlist
   */
  async createWatchlist(
    userId: string,
    data: WatchlistCreateData
  ): Promise<{ success: boolean; watchlist: Watchlist }> {
    try {
      const response = await neoraBackendService.post(
        `/api/v1/market/watchlists/${userId}`,
        data
      )
      return response
    } catch (error) {
      console.error('Failed to create watchlist:', error)
      throw error
    }
  }

  /**
   * Add stock to watchlist
   */
  async addStock(
    watchlistId: string,
    data: WatchlistItemCreateData
  ): Promise<{ success: boolean; item: WatchlistItem }> {
    try {
      const response = await neoraBackendService.post(
        `/api/v1/market/watchlists/${watchlistId}/items`,
        data
      )
      return response
    } catch (error) {
      console.error('Failed to add stock:', error)
      throw error
    }
  }

  /**
   * Remove stock from watchlist
   */
  async removeStock(watchlistId: string, itemId: string): Promise<void> {
    try {
      await neoraBackendService.delete(
        `/api/v1/market/watchlists/${watchlistId}/items/${itemId}`
      )
    } catch (error) {
      console.error('Failed to remove stock:', error)
      throw error
    }
  }

  /**
   * Delete entire watchlist
   */
  async deleteWatchlist(watchlistId: string): Promise<void> {
    try {
      await neoraBackendService.delete(
        `/api/v1/market/watchlists/${watchlistId}`
      )
    } catch (error) {
      console.error('Failed to delete watchlist:', error)
      throw error
    }
  }

  /**
   * Update watchlist details
   */
  async updateWatchlist(
    watchlistId: string,
    data: WatchlistCreateData
  ): Promise<{ success: boolean; watchlist: Watchlist }> {
    try {
      const response = await neoraBackendService.put(
        `/api/v1/market/watchlists/${watchlistId}`,
        data
      )
      return response
    } catch (error) {
      console.error('Failed to update watchlist:', error)
      throw error
    }
  }

  /**
   * Clear instruments cache (useful for testing)
   */
  clearCache(): void {
    this.instrumentsCache = []
    this.cacheTimestamp = 0
    console.log('🗑️ Instruments cache cleared')
  }
}

export const watchlistService = new WatchlistService()