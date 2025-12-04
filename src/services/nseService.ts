/**
 * NSE API Service
 * Direct integration with NSE India's public APIs for real-time market data
 * Updated with proper TypeScript types based on real API response structures
 */

import axios from 'axios';
import type {
  MarketStatusResponse,
  StockQuoteResponse,
  IndexData,
  AllIndicesResponse,
  SearchResponse,
} from '../types/nse';

const NSE_BASE_URL = 'https://www.nseindia.com/api';

// Create axios instance with NSE headers
const nseClient = axios.create({
  baseURL: NSE_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  withCredentials: true,
});

// Legacy interface for backward compatibility with existing components
export interface StockQuote {
  symbol: string;
  companyName: string;
  ltp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  prevClose: number;
  volume: number;
  change: number;
  pChange: number;
  lastUpdateTime: string;
}

export interface IndexQuote {
  index: string;
  ltp: number;
  change: number;
  pChange: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
}

export interface MarketMover {
  symbol: string;
  companyName: string;
  ltp: number;
  change: number;
  pChange: number;
  volume: number;
}

/**
 * Get full stock quote with complete API response
 */
export async function getStockQuoteRaw(symbol: string): Promise<StockQuoteResponse | null> {
  try {
    const response = await nseClient.get<StockQuoteResponse>(`/quote-equity?symbol=${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
}

/**
 * Get quote for a single stock (legacy format for backward compatibility)
 */
export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const data = await getStockQuoteRaw(symbol);

    if (!data || !data.priceInfo) {
      console.error('Invalid data structure from NSE API');
      return null;
    }

    const priceInfo = data.priceInfo;
    
    return {
      symbol: symbol,
      companyName: data.info?.companyName || symbol,
      ltp: priceInfo.lastPrice || 0,
      open: priceInfo.open || 0,
      high: priceInfo.intraDayHighLow?.max || 0,
      low: priceInfo.intraDayHighLow?.min || 0,
      close: priceInfo.close || 0,
      prevClose: priceInfo.previousClose || 0,
      volume: data.preOpenMarket?.totalTradedVolume || 0,
      change: priceInfo.change || 0,
      pChange: priceInfo.pChange || 0,
      lastUpdateTime: data.metadata?.lastUpdateTime || new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
}

/**
 * Get multiple stock quotes (batch)
 */
export async function getStockQuotes(symbols: string[]): Promise<StockQuote[]> {
  const quotes: StockQuote[] = [];
  
  // Fetch quotes in parallel with rate limiting
  const batchSize = 5;
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const batchQuotes = await Promise.all(
      batch.map(symbol => getStockQuote(symbol))
    );
    
    quotes.push(...batchQuotes.filter(q => q !== null) as StockQuote[]);
    
    // Small delay to avoid rate limiting
    if (i + batchSize < symbols.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return quotes;
}

/**
 * Get all market indices with full data (133 indices)
 */
export async function getAllIndicesRaw(): Promise<IndexData[]> {
  try {
    const response = await nseClient.get<AllIndicesResponse>('/allIndices');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching all indices:', error);
    return [];
  }
}

/**
 * Get market indices (NIFTY 50, SENSEX, etc.) - legacy format
 */
export async function getMarketIndices(): Promise<IndexQuote[]> {
  try {
    const allIndices = await getAllIndicesRaw();

    if (!allIndices || allIndices.length === 0) {
      console.error('Invalid indices data from NSE API');
      return [];
    }

    // Map common indices
    const indicesMap: { [key: string]: string } = {
      'NIFTY 50': 'NIFTY 50',
      'NIFTY BANK': 'BANKNIFTY',
      'INDIA VIX': 'INDIA VIX',
      'NIFTY MIDCAP 100': 'NIFTY MIDCAP 100',
    };

    const indices: IndexQuote[] = [];
    
    for (const item of allIndices) {
      if (indicesMap[item.index]) {
        indices.push({
          index: indicesMap[item.index],
          ltp: item.last || 0,
          change: item.variation || 0,
          pChange: item.percentChange || 0,
          open: item.open || 0,
          high: item.yearHigh || 0,
          low: item.yearLow || 0,
          prevClose: item.previousClose || 0,
        });
      }
    }

    return indices;
  } catch (error) {
    console.error('Error fetching market indices:', error);
    return [];
  }
}

/**
 * Get market status with full details
 */
export async function getMarketStatus(): Promise<MarketStatusResponse | null> {
  try {
    const response = await nseClient.get<MarketStatusResponse>('/marketStatus');
    return response.data;
  } catch (error) {
    console.error('Error fetching market status:', error);
    return null;
  }
}

/**
 * Get top gainers
 */
export async function getTopGainers(limit: number = 10): Promise<MarketMover[]> {
  try {
    const response = await nseClient.get('/live-analysis-variations?index=gainers');
    const data = response.data;

    if (!data || !data.NIFTY || !data.NIFTY.data) {
      console.error('Invalid gainers data from NSE API');
      return [];
    }

    return data.NIFTY.data.slice(0, limit).map((item: any) => ({
      symbol: item.symbol,
      companyName: item.meta?.companyName || item.symbol,
      ltp: item.lastPrice || 0,
      change: item.change || 0,
      pChange: item.pChange || 0,
      volume: item.totalTradedVolume || 0,
    }));
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    return [];
  }
}

/**
 * Get top losers
 */
export async function getTopLosers(limit: number = 10): Promise<MarketMover[]> {
  try {
    const response = await nseClient.get('/live-analysis-variations?index=losers');
    const data = response.data;

    if (!data || !data.NIFTY || !data.NIFTY.data) {
      console.error('Invalid losers data from NSE API');
      return [];
    }

    return data.NIFTY.data.slice(0, limit).map((item: any) => ({
      symbol: item.symbol,
      companyName: item.meta?.companyName || item.symbol,
      ltp: item.lastPrice || 0,
      change: item.change || 0,
      pChange: item.pChange || 0,
      volume: item.totalTradedVolume || 0,
    }));
  } catch (error) {
    console.error('Error fetching top losers:', error);
    return [];
  }
}

/**
 * Search stocks by name or symbol with full response
 */
export async function searchStocksRaw(query: string): Promise<SearchResponse | null> {
  try {
    const response = await nseClient.get<SearchResponse>(`/search/autocomplete?q=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching stocks:', error);
    return null;
  }
}

/**
 * Search stocks by name or symbol (simplified format)
 */
export async function searchStocks(query: string): Promise<any[]> {
  try {
    const data = await searchStocksRaw(query);

    if (!data || !data.symbols) {
      return [];
    }

    return data.symbols.map((item) => ({
      symbol: item.symbol,
      name: item.symbol_info || item.symbol,
      exchange: 'NSE',
      meta: item.meta,
    }));
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
}

/**
 * Get most active stocks by volume
 */
export async function getMostActive(limit: number = 10): Promise<MarketMover[]> {
  try {
    const response = await nseClient.get('/live-analysis-variations?index=volume');
    const data = response.data;

    if (!data || !data.NIFTY || !data.NIFTY.data) {
      console.error('Invalid most active data from NSE API');
      return [];
    }

    return data.NIFTY.data.slice(0, limit).map((item: any) => ({
      symbol: item.symbol,
      companyName: item.meta?.companyName || item.symbol,
      ltp: item.lastPrice || 0,
      change: item.change || 0,
      pChange: item.pChange || 0,
      volume: item.totalTradedVolume || 0,
    }));
  } catch (error) {
    console.error('Error fetching most active stocks:', error);
    return [];
  }
}

/**
 * Initialize NSE session (call this once on app load)
 */
export async function initializeNSESession(): Promise<boolean> {
  try {
    // Visit NSE homepage to get cookies
    await axios.get('https://www.nseindia.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    return true;
  } catch (error) {
    console.error('Error initializing NSE session:', error);
    return false;
  }
}

export default {
  // Legacy functions for backward compatibility
  getStockQuote,
  getStockQuotes,
  getMarketIndices,
  getTopGainers,
  getTopLosers,
  searchStocks,
  getMostActive,
  initializeNSESession,
  
  // New functions with full type support
  getStockQuoteRaw,
  getAllIndicesRaw,
  getMarketStatus,
  searchStocksRaw,
};