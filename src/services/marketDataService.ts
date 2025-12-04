/**
 * Market Data Service
 * Unified interface for fetching market data
 * Currently uses NSE API, can be extended with Kotak Neo API later
 */

import nseService, { StockQuote, IndexQuote, MarketMover } from './nseService';

// Cache configuration
const CACHE_DURATION = {
  QUOTE: 5000,        // 5 seconds
  INDICES: 10000,     // 10 seconds
  MOVERS: 30000,      // 30 seconds
};

// Simple in-memory cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

/**
 * Get data from cache or fetch if expired
 */
function getCached<T>(
  key: string,
  fetchFn: () => Promise<T>,
  duration: number
): Promise<T> {
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && now - cached.timestamp < duration) {
    return Promise.resolve(cached.data);
  }

  return fetchFn().then(data => {
    cache.set(key, { data, timestamp: now });
    return data;
  });
}

/**
 * Initialize market data service
 */
export async function initialize(): Promise<void> {
  try {
    await nseService.initializeNSESession();
    console.log('Market data service initialized');
  } catch (error) {
    console.error('Failed to initialize market data service:', error);
  }
}

/**
 * Get quote for a single stock with caching
 */
export async function getQuote(symbol: string): Promise<StockQuote | null> {
  return getCached(
    `quote_${symbol}`,
    () => nseService.getStockQuote(symbol),
    CACHE_DURATION.QUOTE
  );
}

/**
 * Get multiple stock quotes with caching
 */
export async function getQuotes(symbols: string[]): Promise<StockQuote[]> {
  const cacheKey = `quotes_${symbols.join(',')}`;
  return getCached(
    cacheKey,
    () => nseService.getStockQuotes(symbols),
    CACHE_DURATION.QUOTE
  );
}

/**
 * Get market indices with caching
 */
export async function getIndices(): Promise<IndexQuote[]> {
  return getCached(
    'indices',
    () => nseService.getMarketIndices(),
    CACHE_DURATION.INDICES
  );
}

/**
 * Get top gainers with caching
 */
export async function getTopGainers(limit: number = 10): Promise<MarketMover[]> {
  return getCached(
    `gainers_${limit}`,
    () => nseService.getTopGainers(limit),
    CACHE_DURATION.MOVERS
  );
}

/**
 * Get top losers with caching
 */
export async function getTopLosers(limit: number = 10): Promise<MarketMover[]> {
  return getCached(
    `losers_${limit}`,
    () => nseService.getTopLosers(limit),
    CACHE_DURATION.MOVERS
  );
}

/**
 * Get most active stocks with caching
 */
export async function getMostActive(limit: number = 10): Promise<MarketMover[]> {
  return getCached(
    `active_${limit}`,
    () => nseService.getMostActive(limit),
    CACHE_DURATION.MOVERS
  );
}

/**
 * Search stocks (no caching for search)
 */
export async function searchStocks(query: string): Promise<any[]> {
  if (!query || query.length < 2) {
    return [];
  }
  return nseService.searchStocks(query);
}

/**
 * Clear cache (useful for manual refresh)
 */
export function clearCache(): void {
  cache.clear();
  console.log('Market data cache cleared');
}

/**
 * Get cache statistics (for debugging)
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return `₹${price.toFixed(2)}`;
}

/**
 * Format percentage change for display
 */
export function formatPChange(pChange: number): string {
  const sign = pChange >= 0 ? '+' : '';
  return `${sign}${pChange.toFixed(2)}%`;
}

/**
 * Format volume for display
 */
export function formatVolume(volume: number): string {
  if (volume >= 10000000) {
    return `${(volume / 10000000).toFixed(2)} Cr`;
  } else if (volume >= 100000) {
    return `${(volume / 100000).toFixed(2)}L`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(2)}K`;
  }
  return volume.toString();
}

/**
 * Get color class for price change
 */
export function getChangeColorClass(change: number): string {
  if (change > 0) return 'text-market-gain';
  if (change < 0) return 'text-market-loss';
  return 'text-text-secondary';
}

/**
 * Convert stock data to the format used by StockCard component
 */
export function convertToStockCardData(quote: StockQuote): any {
  return {
    symbol: quote.symbol,
    name: quote.companyName,
    price: quote.ltp,
    change: quote.change,
    changePercent: quote.pChange,
    volume: quote.volume,
    marketCap: 0, // Not available from NSE API
    pe: 0,         // Not available from NSE API
  };
}

/**
 * Get market status (open/closed)
 */
export function getMarketStatus(): {
  isOpen: boolean;
  message: string;
  nextOpenTime?: string;
} {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const time = hours * 60 + minutes;

  // Market closed on weekends
  if (day === 0 || day === 6) {
    return {
      isOpen: false,
      message: 'Market Closed (Weekend)',
      nextOpenTime: 'Monday 9:15 AM',
    };
  }

  // Market hours: 9:15 AM to 3:30 PM (555 minutes to 930 minutes)
  const marketOpen = 9 * 60 + 15;  // 555 minutes
  const marketClose = 15 * 60 + 30; // 930 minutes

  if (time < marketOpen) {
    return {
      isOpen: false,
      message: 'Pre-Market',
      nextOpenTime: '9:15 AM',
    };
  } else if (time >= marketOpen && time <= marketClose) {
    return {
      isOpen: true,
      message: 'Market Open',
    };
  } else {
    return {
      isOpen: false,
      message: 'Market Closed',
      nextOpenTime: 'Tomorrow 9:15 AM',
    };
  }
}

/**
 * Auto-refresh market data
 * Returns a cleanup function to stop refreshing
 */
export function startAutoRefresh(
  callback: () => void,
  interval: number = 5000
): () => void {
  const intervalId = setInterval(callback, interval);
  return () => clearInterval(intervalId);
}

export default {
  initialize,
  getQuote,
  getQuotes,
  getIndices,
  getTopGainers,
  getTopLosers,
  getMostActive,
  searchStocks,
  clearCache,
  getCacheStats,
  formatPrice,
  formatPChange,
  formatVolume,
  getChangeColorClass,
  convertToStockCardData,
  getMarketStatus,
  startAutoRefresh,
};